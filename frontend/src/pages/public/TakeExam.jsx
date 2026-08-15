import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';
import api from '../../lib/axios';
import useExamStore from '../../store/examStore';
import Timer from '../../components/Timer';
import ConfirmModal from '../../components/ConfirmModal';
import PageLayout from '../../components/PageLayout';

export default function TakeExam() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    attemptId, exam, questions, answers, currentQuestionIndex,
    startedAt, userName, setAnswer, setCurrentQuestionIndex, setResults,
  } = useExamStore();

  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const submittedRef = useRef(false);

  useEffect(() => {
    if (!attemptId || !exam || !questions.length) {
      navigate(`/exam/${id}/enter`, { replace: true });
    }
  }, [attemptId, exam, questions, id, navigate]);

  const buildAnswersArray = useCallback(() => {
    return Object.entries(answers).map(([questionId, selectedOptionIndex]) => ({
      questionId, selectedOptionIndex,
    }));
  }, [answers]);

  const submitExam = useCallback(
    async (autoSubmitted = false) => {
      if (submittedRef.current || submitting) return;
      submittedRef.current = true;
      setSubmitting(true);
      setDisabled(true);
      try {
        const res = await api.post(`/exams/${id}/submit`, {
          attemptId, userName, answers: buildAnswersArray(), autoSubmitted,
        });
        setResults(res.data.data);
        navigate(`/exam/${id}/results`, { replace: true });
      } catch (err) {
        if (err.response?.status === 400 && err.response?.data?.message?.includes('already been submitted')) {
          navigate(`/exam/${id}/results`, { replace: true });
        } else {
          submittedRef.current = false;
          setSubmitting(false);
          setDisabled(false);
          alert(err.response?.data?.message || 'Failed to submit. Please try again.');
        }
      }
    },
    [id, attemptId, userName, buildAnswersArray, submitting, navigate, setResults]
  );

  const handleTimeUp = useCallback(() => {
    setDisabled(true);
    submitExam(true);
  }, [submitExam]);

  if (!exam || !questions.length) return null;

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;

  return (
    <PageLayout>
      {/* Top Navigation */}
      <header className="flex flex-col sm:flex-row justify-between items-stretch border-b border-white/10 bg-[#050505]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="py-3 sm:py-4 px-4 sm:px-8 flex items-center justify-between sm:justify-start">
          <span className="font-bold text-lg sm:text-xl tracking-tight text-white">.computer Quiz</span>
          <span className="sm:hidden text-purple-300/50 text-[10px] font-mono uppercase tracking-widest">
            {currentQuestionIndex + 1}/{totalQuestions}
          </span>
          <span className="hidden sm:inline-block text-white/40 ml-3 text-xs sm:text-sm tracking-wide border-l border-white/10 pl-3">
            Advanced Cognitive Assessment
          </span>
        </div>
        <Timer
          durationMinutes={exam.durationMinutes}
          startedAt={startedAt}
          onTimeUp={handleTimeUp}
        />
      </header>

      {/* Main Content — centered */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-8 py-6 sm:py-10 lg:py-12">
        {/* Question Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 sm:mb-8 pb-3 sm:pb-4 border-b border-white/10 gap-3 sm:gap-4">
          <div>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-white/90 leading-snug">
              {exam.title}
            </h1>
            <p className="text-purple-300/40 text-[11px] sm:text-xs mt-1.5 sm:mt-2 font-mono uppercase tracking-wider">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </p>
          </div>
          <button
            className="text-white/40 hover:text-purple-300 flex items-center gap-2 text-[10px] sm:text-[11px] transition-colors uppercase tracking-widest font-mono"
            onClick={() => {}}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
            Flag for review
          </button>
        </div>

        {/* Question Text */}
        <div className="mb-8 sm:mb-10 text-sm sm:text-[15px] lg:text-base leading-relaxed text-white/80">
          <p>{currentQuestion.questionText}</p>
        </div>

        {/* Options List */}
        <div className="space-y-2.5 sm:space-y-3 mb-8 sm:mb-12">
          {currentQuestion.options.map((option, optIdx) => {
            const letter = String.fromCharCode(65 + optIdx);
            const isSelected = answers[currentQuestion._id] === optIdx;
            return (
              <button
                key={optIdx}
                onClick={() => !disabled && setAnswer(currentQuestion._id, optIdx)}
                disabled={disabled}
                className={`w-full text-left px-4 sm:px-5 py-3 sm:py-4 border transition-all duration-200 flex items-center gap-3 sm:gap-4 group rounded-sm disabled:cursor-not-allowed ${
                  isSelected
                    ? 'border-purple-400/60 bg-purple-500/10 text-white shadow-[0_0_20px_rgba(139,92,246,0.08)]'
                    : 'border-white/10 text-white/60 hover:border-purple-400/30 hover:bg-white/[0.03] hover:text-white/90'
                }`}
                id={`option-${currentQuestion._id}-${optIdx}`}
              >
                <span
                  className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center font-mono text-xs sm:text-sm transition-colors rounded-sm shrink-0 ${
                    isSelected
                      ? 'bg-purple-500 text-white font-semibold'
                      : 'bg-transparent text-white/30 group-hover:text-white/60'
                  }`}
                >
                  {letter}
                </span>
                <span className="text-xs sm:text-sm lg:text-[15px]">{option}</span>
              </button>
            );
          })}
        </div>
      </main>

      {/* Bottom Navigation */}
      <footer className="border-t border-white/10 bg-[#050505]/90 backdrop-blur-md py-3 sm:py-4 px-4 sm:px-8 flex justify-between items-center sticky bottom-0 z-30">
        <button
          onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
          disabled={currentQuestionIndex === 0 || disabled}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-[10px] sm:text-xs font-mono tracking-widest text-white/50 hover:text-white uppercase transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          id="prev-question-btn"
        >
          <ChevronLeft size={14} strokeWidth={2.5} />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="flex gap-1 sm:gap-1.5">
          {questions.map((q, idx) => {
            const isAnswered = answers[q._id] !== undefined;
            const isCurrent = idx === currentQuestionIndex;
            return (
              <button
                key={q._id}
                onClick={() => !disabled && setCurrentQuestionIndex(idx)}
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
                  isCurrent
                    ? 'bg-purple-400 scale-125'
                    : isAnswered
                    ? 'bg-purple-400/40'
                    : 'bg-white/10'
                }`}
              />
            );
          })}
        </div>

        {currentQuestionIndex < totalQuestions - 1 ? (
          <button
            onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
            disabled={disabled}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 sm:py-2.5 text-[10px] sm:text-xs font-mono font-semibold tracking-widest bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-500 hover:to-purple-400 uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
            id="next-question-btn"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight size={14} strokeWidth={2.5} />
          </button>
        ) : (
          <button
            onClick={() => setShowConfirm(true)}
            disabled={disabled || submitting}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 sm:py-2.5 text-[10px] sm:text-xs font-mono font-semibold tracking-widest bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-500 hover:to-purple-400 uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
            id="submit-exam-btn"
          >
            {submitting ? 'Sending...' : 'Submit'}
            <Send size={12} strokeWidth={2.5} />
          </button>
        )}
      </footer>

      <ConfirmModal
        isOpen={showConfirm}
        title="Final Submission"
        message={
          answeredCount < totalQuestions
            ? `Warning: You have only completed ${answeredCount} out of ${totalQuestions} questions. Any unanswered questions will be marked as incorrect.`
            : "You have completed all questions. Are you ready to submit your final answers?"
        }
        confirmText="Confirm Submission"
        cancelText="Return to Assessment"
        onConfirm={() => { setShowConfirm(false); submitExam(false); }}
        onCancel={() => setShowConfirm(false)}
      />
    </PageLayout>
  );
}
