import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ArrowRight, Send, X, Clock } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f9f9f9', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Top bar */}
      <header className="flex items-center justify-between border-b"
              style={{ backgroundColor: '#ffffff', borderColor: '#e2e2e2', padding: '16px 24px', position: 'sticky', top: 0, zIndex: 30 }}>
        <div className="flex items-center gap-4">
          <button onClick={() => setShowConfirm(true)} className="transition-colors duration-300"
                  style={{ color: '#42474f' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#1b1b1b'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#42474f'; }}>
            <X size={20} />
          </button>
          <div>
            <h2 className="font-bold" style={{ fontSize: '18px', color: '#1b1b1b' }}>{exam.title}</h2>
            <p style={{ fontSize: '13px', color: '#727780' }}>Module Assessment</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-full"
               style={{ backgroundColor: '#f3f3f3', padding: '8px 16px', color: '#42474f', fontSize: '14px', fontWeight: 600 }}>
            <Clock size={16} />
            <Timer durationMinutes={exam.durationMinutes} startedAt={startedAt} onTimeUp={handleTimeUp} />
          </div>
          <button
            onClick={() => setShowConfirm(true)}
            disabled={disabled || submitting}
            className="text-white text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50"
            style={{ backgroundColor: '#5682B1', borderRadius: '16px', padding: '10px 20px' }}
            onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#739EC9'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#5682B1'; }}
            id="submit-exam-btn"
          >
            Submit Exam
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 w-full flex justify-center" style={{ padding: '48px 24px' }}>
        <div className="w-full max-w-4xl">
          {/* Question number */}
        <div style={{ marginBottom: '8px' }}>
          <h1 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '40px', lineHeight: '48px', fontWeight: 700, letterSpacing: '-0.02em', color: '#1b1b1b' }}>
            <span>Question {String(currentQuestionIndex + 1).padStart(2, '0')}</span>
            <span style={{ color: '#c2c7d0', fontWeight: 400, fontSize: '20px', marginLeft: '4px' }}>/ {totalQuestions}</span>
          </h1>
        </div>

        {/* Progress bar */}
        <div className="w-full rounded-full overflow-hidden" style={{ height: '4px', backgroundColor: '#e2e2e2', marginBottom: '48px' }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`, backgroundColor: '#5682B1' }} />
        </div>

        {/* Question card */}
        <div className="rounded-2xl" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e2e2', padding: '32px', marginBottom: '48px' }}>
          <p style={{ fontSize: '18px', lineHeight: '28px', fontWeight: 500, color: '#1b1b1b' }}>
            {currentQuestion.questionText}
          </p>
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '64px' }}>
          {currentQuestion.options.map((option, optIdx) => {
            const letter = String.fromCharCode(65 + optIdx);
            const isSelected = answers[currentQuestion._id] === optIdx;
            return (
              <button
                key={optIdx}
                onClick={() => !disabled && setAnswer(currentQuestion._id, optIdx)}
                disabled={disabled}
                className="w-full text-left flex items-center gap-4 rounded-2xl border transition-all duration-200 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: isSelected ? 'rgba(86,130,177,0.08)' : '#ffffff',
                  borderColor: isSelected ? '#5682B1' : '#e2e2e2',
                  borderWidth: isSelected ? '2px' : '1px',
                  padding: isSelected ? '15px 23px' : '16px 24px',
                  boxShadow: isSelected ? '0 2px 8px rgba(86,130,177,0.12)' : 'none',
                }}
              >
                <span className="flex items-center justify-center shrink-0 font-bold text-sm rounded-full"
                      style={{
                        width: '36px', height: '36px',
                        backgroundColor: isSelected ? '#5682B1' : '#f3f3f3',
                        color: isSelected ? '#ffffff' : '#42474f',
                      }}>
                  {letter}
                </span>
                <span style={{ fontSize: '16px', lineHeight: '24px', color: '#1b1b1b' }}>
                  {option}
                </span>
              </button>
            );
          })}
          </div>
        </div>
      </main>

      {/* Bottom navigation */}
      <footer className="border-t flex justify-center" style={{ backgroundColor: '#ffffff', borderColor: '#e2e2e2', padding: '20px 24px', position: 'sticky', bottom: 0, zIndex: 30 }}>
        <div className="w-full max-w-4xl flex justify-between items-center">
          <button
            onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
            disabled={currentQuestionIndex === 0 || disabled}
            className="flex items-center gap-2 text-sm font-semibold transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ color: '#42474f' }}
            id="prev-question-btn"
          >
            <ChevronLeft size={18} />
            Previous
          </button>

          <button
            onClick={() => {
              if (currentQuestionIndex < totalQuestions - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
              } else {
                setShowConfirm(true);
              }
            }}
            disabled={disabled}
            className="flex items-center gap-2 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50"
            style={{ color: '#5682B1' }}
            id="next-question-btn"
          >
            {currentQuestionIndex < totalQuestions - 1 ? 'Next Question' : 'Submit Exam'}
            <ArrowRight size={18} />
          </button>
        </div>
      </footer>

      <ConfirmModal
        isOpen={showConfirm} title="Final Submission"
        message={answeredCount < totalQuestions
          ? `You have completed ${answeredCount} out of ${totalQuestions} questions. Unanswered questions will be marked incorrect.`
          : "You have completed all questions. Ready to submit your final answers?"}
        confirmText="Confirm Submission" cancelText="Return to Assessment"
        onConfirm={() => { setShowConfirm(false); submitExam(false); }}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
