import { Router } from 'express';
import { param, query, body } from 'express-validator';
import Exam from '../models/Exam.js';
import Question from '../models/Question.js';
import Attempt from '../models/Attempt.js';
import validate from '../middleware/validate.js';

const router = Router();

// GET /api/exams — list visible exams only
router.get('/', async (req, res, next) => {
  try {
    const exams = await Exam.find({ isVisible: true })
      .select('title description durationMinutes questions')
      .sort({ createdAt: -1 })
      .lean();

    const data = exams.map((exam) => ({
      _id: exam._id,
      title: exam.title,
      description: exam.description,
      durationMinutes: exam.durationMinutes,
      questionCount: exam.questions ? exam.questions.length : 0,
    }));

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/exams/:id/start — start exam, create attempt, return questions without answers
router.get(
  '/:id/start',
  [
    param('id').isMongoId().withMessage('Invalid exam ID'),
    query('userName').trim().notEmpty().withMessage('User name is required'),
  ],
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

      if (!exam.isVisible) {
        return res.status(403).json({
          success: false,
          message: 'This exam is not currently available.',
        });
      }

      const userName = req.query.userName;

      // Create attempt with startedAt
      const attempt = await Attempt.create({
        examId: exam._id,
        userName,
        startedAt: new Date(),
      });

      // Strip correctOptionIndex from questions
      const questions = exam.questions.map((q) => ({
        _id: q._id,
        questionText: q.questionText,
        options: q.options,
        order: q.order,
      }));

      res.json({
        success: true,
        data: {
          attemptId: attempt._id,
          exam: {
            _id: exam._id,
            title: exam.title,
            description: exam.description,
            durationMinutes: exam.durationMinutes,
          },
          questions,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/exams/:id/submit — submit exam answers, server scores
router.post(
  '/:id/submit',
  [
    param('id').isMongoId().withMessage('Invalid exam ID'),
    body('attemptId').isMongoId().withMessage('Invalid attempt ID'),
    body('userName').trim().notEmpty().withMessage('User name is required'),
    body('answers').isArray().withMessage('Answers must be an array'),
    body('answers.*.questionId').isMongoId().withMessage('Invalid question ID in answers'),
    body('answers.*.selectedOptionIndex')
      .isInt({ min: 0, max: 3 })
      .withMessage('Selected option index must be 0-3'),
    body('autoSubmitted').optional().isBoolean().withMessage('autoSubmitted must be a boolean'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { attemptId, userName, answers, autoSubmitted } = req.body;

      // Find the attempt
      const attempt = await Attempt.findById(attemptId);
      if (!attempt) {
        return res.status(404).json({
          success: false,
          message: 'Attempt not found.',
        });
      }

      // Prevent double submission
      if (attempt.submittedAt) {
        return res.status(400).json({
          success: false,
          message: 'This exam has already been submitted.',
        });
      }

      // Verify attempt belongs to the right exam and user
      if (attempt.examId.toString() !== req.params.id) {
        return res.status(400).json({
          success: false,
          message: 'Attempt does not match this exam.',
        });
      }

      if (attempt.userName !== userName) {
        return res.status(400).json({
          success: false,
          message: 'User name does not match the attempt.',
        });
      }

      // Get exam for duration
      const exam = await Exam.findById(req.params.id);
      if (!exam) {
        return res.status(404).json({
          success: false,
          message: 'Exam not found.',
        });
      }

      // Server-side timer enforcement: startedAt + durationMinutes + 5s grace
      const now = new Date();
      const deadline = new Date(
        attempt.startedAt.getTime() + exam.durationMinutes * 60 * 1000 + 5000
      );
      const forceAutoSubmit = now > deadline;

      // Get all questions for this exam to score
      const questions = await Question.find({ examId: exam._id }).lean();
      const questionMap = new Map();
      questions.forEach((q) => {
        questionMap.set(q._id.toString(), q);
      });

      // Score the answers
      let score = 0;
      const totalQuestions = questions.length;

      const results = questions.map((q) => {
        const answer = answers.find(
          (a) => a.questionId === q._id.toString()
        );
        const selectedOptionIndex = answer ? answer.selectedOptionIndex : -1;
        const isCorrect = selectedOptionIndex === q.correctOptionIndex;
        if (isCorrect) score++;

        return {
          questionId: q._id,
          questionText: q.questionText,
          options: q.options,
          correctOptionIndex: q.correctOptionIndex,
          selectedOptionIndex,
          isCorrect,
        };
      });

      // Update the attempt
      attempt.answers = answers;
      attempt.score = score;
      attempt.totalQuestions = totalQuestions;
      attempt.submittedAt = now;
      attempt.autoSubmitted = forceAutoSubmit || autoSubmitted || false;
      await attempt.save();

      res.json({
        success: true,
        data: {
          score,
          totalQuestions,
          autoSubmitted: attempt.autoSubmitted,
          results,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
