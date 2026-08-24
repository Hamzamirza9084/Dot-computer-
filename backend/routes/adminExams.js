import { Router } from 'express';
import { body, param } from 'express-validator';
import multer from 'multer';
import { parse } from 'csv-parse/sync';
import Exam from '../models/Exam.js';
import Question from '../models/Question.js';
import Attempt from '../models/Attempt.js';
import validate from '../middleware/validate.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 2 * 1024 * 1024 } });

// ========================
// EXAM CRUD
// ========================

// POST /api/admin/exams — create exam
router.post(
  '/exams',
  [
    body('title').trim().notEmpty().withMessage('Exam title is required'),
    body('description').optional().trim(),
    body('durationMinutes')
      .isInt({ min: 1 })
      .withMessage('Duration must be at least 1 minute'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { title, description, durationMinutes } = req.body;
      const exam = await Exam.create({
        title,
        description: description || '',
        durationMinutes,
      });

      res.status(201).json({
        success: true,
        data: exam,
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/admin/exams — list all exams with question counts
router.get('/exams', async (req, res, next) => {
  try {
    const exams = await Exam.find()
      .sort({ createdAt: -1 })
      .lean();

    const examsWithCounts = exams.map((exam) => ({
      ...exam,
      questionCount: exam.questions ? exam.questions.length : 0,
    }));

    res.json({
      success: true,
      data: examsWithCounts,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/exams/:id — get exam with full questions
router.get(
  '/exams/:id',
  [param('id').isMongoId().withMessage('Invalid exam ID')],
  validate,
  async (req, res, next) => {
    try {
      const exam = await Exam.findById(req.params.id).populate({
        path: 'questions',
        options: { sort: { order: 1 } },
      });

      if (!exam) {
        return res.status(404).json({
          success: false,
          message: 'Exam not found.',
        });
      }

      res.json({
        success: true,
        data: exam,
      });
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/admin/exams/:id — update exam metadata
router.put(
  '/exams/:id',
  [
    param('id').isMongoId().withMessage('Invalid exam ID'),
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().trim(),
    body('durationMinutes')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Duration must be at least 1 minute'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { title, description, durationMinutes } = req.body;
      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (durationMinutes !== undefined) updateData.durationMinutes = durationMinutes;

      const exam = await Exam.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!exam) {
        return res.status(404).json({
          success: false,
          message: 'Exam not found.',
        });
      }

      res.json({
        success: true,
        data: exam,
      });
    } catch (error) {
      next(error);
    }
  }
);

// PATCH /api/admin/exams/:id/visibility — toggle isVisible
router.patch(
  '/exams/:id/visibility',
  [param('id').isMongoId().withMessage('Invalid exam ID')],
  validate,
  async (req, res, next) => {
    try {
      const exam = await Exam.findById(req.params.id);

      if (!exam) {
        return res.status(404).json({
          success: false,
          message: 'Exam not found.',
        });
      }

      // If toggling to visible, ensure at least 1 question exists
      if (!exam.isVisible && exam.questions.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot make exam visible without at least 1 question.',
        });
      }

      exam.isVisible = !exam.isVisible;
      await exam.save();

      res.json({
        success: true,
        data: exam,
      });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/admin/exams/:id — delete exam, cascade delete questions and attempts
router.delete(
  '/exams/:id',
  [param('id').isMongoId().withMessage('Invalid exam ID')],
  validate,
  async (req, res, next) => {
    try {
      const exam = await Exam.findById(req.params.id);

      if (!exam) {
        return res.status(404).json({
          success: false,
          message: 'Exam not found.',
        });
      }

      // Cascade delete questions and attempts
      await Question.deleteMany({ examId: exam._id });
      await Attempt.deleteMany({ examId: exam._id });
      await Exam.findByIdAndDelete(exam._id);

      res.json({
        success: true,
        data: { message: 'Exam and all related data deleted.' },
      });
    } catch (error) {
      next(error);
    }
  }
);

// ========================
// QUESTION CRUD
// ========================

// POST /api/admin/exams/:id/questions — add question to exam
router.post(
  '/exams/:id/questions',
  [
    param('id').isMongoId().withMessage('Invalid exam ID'),
    body('questionText').trim().notEmpty().withMessage('Question text is required'),
    body('options')
      .isArray({ min: 4, max: 4 })
      .withMessage('Exactly 4 options are required'),
    body('options.*').trim().notEmpty().withMessage('Each option must be non-empty'),
    body('correctOptionIndex')
      .isInt({ min: 0, max: 3 })
      .withMessage('Correct option index must be 0-3'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const exam = await Exam.findById(req.params.id);
      if (!exam) {
        return res.status(404).json({
          success: false,
          message: 'Exam not found.',
        });
      }

      const { questionText, options, correctOptionIndex } = req.body;

      const question = await Question.create({
        examId: exam._id,
        questionText,
        options,
        correctOptionIndex,
        order: exam.questions.length,
      });

      exam.questions.push(question._id);
      await exam.save();

      res.status(201).json({
        success: true,
        data: question,
      });
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/admin/questions/:id — edit question
router.put(
  '/questions/:id',
  [
    param('id').isMongoId().withMessage('Invalid question ID'),
    body('questionText')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Question text cannot be empty'),
    body('options')
      .optional()
      .isArray({ min: 4, max: 4 })
      .withMessage('Exactly 4 options are required'),
    body('options.*')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Each option must be non-empty'),
    body('correctOptionIndex')
      .optional()
      .isInt({ min: 0, max: 3 })
      .withMessage('Correct option index must be 0-3'),
    body('order').optional().isInt({ min: 0 }).withMessage('Order must be a non-negative integer'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { questionText, options, correctOptionIndex, order } = req.body;
      const updateData = {};
      if (questionText !== undefined) updateData.questionText = questionText;
      if (options !== undefined) updateData.options = options;
      if (correctOptionIndex !== undefined) updateData.correctOptionIndex = correctOptionIndex;
      if (order !== undefined) updateData.order = order;

      const question = await Question.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!question) {
        return res.status(404).json({
          success: false,
          message: 'Question not found.',
        });
      }

      res.json({
        success: true,
        data: question,
      });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/admin/questions/:id — delete question
router.delete(
  '/questions/:id',
  [param('id').isMongoId().withMessage('Invalid question ID')],
  validate,
  async (req, res, next) => {
    try {
      const question = await Question.findById(req.params.id);

      if (!question) {
        return res.status(404).json({
          success: false,
          message: 'Question not found.',
        });
      }

      // Remove question reference from exam
      await Exam.findByIdAndUpdate(question.examId, {
        $pull: { questions: question._id },
      });

      await Question.findByIdAndDelete(question._id);

      res.json({
        success: true,
        data: { message: 'Question deleted.' },
      });
    } catch (error) {
      next(error);
    }
  }
);

// ========================
// CSV BULK UPLOAD
// ========================

// GET /api/admin/exams/csv-template — download demo CSV
router.get('/exams/csv-template', (req, res) => {
  const csvContent = [
    'question,optionA,optionB,optionC,optionD,correctOption',
    'What is React primarily used for?,Database management,Building user interfaces,Server-side networking,Operating system development,B',
    'Which hook is used for side effects in React?,useState,useEffect,useContext,useReducer,B',
    'What does JSX stand for?,JavaScript XML,JavaScript Extension,Java Syntax Extension,JSON XML Schema,A',
  ].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="quiz_template.csv"');
  res.send(csvContent);
});

// POST /api/admin/exams/:id/questions/csv — bulk upload from CSV
router.post(
  '/exams/:id/questions/csv',
  [param('id').isMongoId().withMessage('Invalid exam ID')],
  validate,
  upload.single('csv'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No CSV file uploaded.' });
      }

      const exam = await Exam.findById(req.params.id);
      if (!exam) {
        return res.status(404).json({ success: false, message: 'Exam not found.' });
      }

      const csvText = req.file.buffer.toString('utf-8');
      let records;
      try {
        records = parse(csvText, {
          columns: true,
          skip_empty_lines: true,
          trim: true,
          bom: true,
        });
      } catch (parseErr) {
        return res.status(400).json({ success: false, message: 'Invalid CSV format. ' + parseErr.message });
      }

      if (records.length === 0) {
        return res.status(400).json({ success: false, message: 'CSV file is empty (no data rows found).' });
      }

      const errors = [];
      const questionsToCreate = [];
      const letterMap = { A: 0, B: 1, C: 2, D: 3 };

      records.forEach((row, idx) => {
        const rowNum = idx + 2; // +2 because row 1 is header
        const q = row.question || row.Question || row.QUESTION || '';
        const optA = row.optionA || row.OptionA || row.OPTIONA || row.option_a || '';
        const optB = row.optionB || row.OptionB || row.OPTIONB || row.option_b || '';
        const optC = row.optionC || row.OptionC || row.OPTIONC || row.option_c || '';
        const optD = row.optionD || row.OptionD || row.OPTIOND || row.option_d || '';
        const correct = (row.correctOption || row.CorrectOption || row.CORRECTOPTION || row.correct_option || '').toUpperCase().trim();

        if (!q) { errors.push(`Row ${rowNum}: Missing question text.`); return; }
        if (!optA || !optB || !optC || !optD) { errors.push(`Row ${rowNum}: All four options (A-D) are required.`); return; }
        if (!letterMap.hasOwnProperty(correct)) { errors.push(`Row ${rowNum}: correctOption must be A, B, C, or D (got "${correct}").`); return; }

        questionsToCreate.push({
          examId: exam._id,
          questionText: q,
          options: [optA, optB, optC, optD],
          correctOptionIndex: letterMap[correct],
          order: exam.questions.length + questionsToCreate.length,
        });
      });

      if (errors.length > 0 && questionsToCreate.length === 0) {
        return res.status(400).json({ success: false, message: 'All rows had errors.', errors });
      }

      const created = await Question.insertMany(questionsToCreate);
      const newIds = created.map((q) => q._id);
      exam.questions.push(...newIds);
      await exam.save();

      res.status(201).json({
        success: true,
        data: {
          added: created.length,
          total: exam.questions.length,
          errors: errors.length > 0 ? errors : undefined,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// ========================
// ATTEMPTS
// ========================

// GET /api/admin/exams/:id/attempts — list all attempts for an exam
router.get(
  '/exams/:id/attempts',
  [param('id').isMongoId().withMessage('Invalid exam ID')],
  validate,
  async (req, res, next) => {
    try {
      const exam = await Exam.findById(req.params.id);
      if (!exam) {
        return res.status(404).json({
          success: false,
          message: 'Exam not found.',
        });
      }

      const attempts = await Attempt.find({ examId: req.params.id })
        .sort({ submittedAt: -1 })
        .lean();

      res.json({
        success: true,
        data: {
          exam: { _id: exam._id, title: exam.title },
          attempts,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
