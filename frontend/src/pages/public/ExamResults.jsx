import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Check, X, ArrowLeft } from 'lucide-react';
import useExamStore from '../../store/examStore';
import PageLayout from '../../components/PageLayout';

export default function ExamResults() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { exam, results, userName, reset } = useExamStore();

  useEffect(() => {
    if (!results) {
      navigate(`/exam/${id}/enter`, { replace: true });
    }
  }, [results, id, navigate]);

  if (!results || !exam) return null;

  const { score, totalQuestions, autoSubmitted, results: questionResults } = results;
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  const handleGoHome = () => {
    reset();
    navigate('/');
  };

  return (
    <PageLayout>
      {/* Top Navigation */}
      <nav className="border-b border-white/10 bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
          <Link to="/" onClick={handleGoHome} className="font-bold text-lg sm:text-2xl tracking-tight text-white">
            .computer Quiz
          </Link>
          <span className="text-white/30 text-[11px] sm:text-xs font-mono uppercase tracking-widest">
            Assessment Complete
          </span>
        </div>
      </nav>

      {/* Score Header — centered */}
      <section className="border-b border-white/10 py-10 sm:py-14 lg:py-16">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
          <p className="text-purple-300/40 text-[11px] sm:text-xs font-mono uppercase tracking-widest mb-4">
            {autoSubmitted ? "Time expired — auto-submitted" : `Assessment completed by ${userName}`}
          </p>
          <div className="mb-3">
            <span className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-white">{score}</span>
            <span className="text-2xl sm:text-3xl lg:text-4xl text-white/20 font-light ml-2">/ {totalQuestions}</span>
          </div>
          <p className="text-white/40 text-sm font-mono mb-6 sm:mb-8">{percentage}% correct</p>

          <button
            onClick={handleGoHome}
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 text-[11px] sm:text-xs font-mono font-semibold tracking-widest bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-500 hover:to-purple-400 uppercase transition-all rounded-sm"
            id="go-home-btn"
          >
            <ArrowLeft size={14} strokeWidth={2.5} />
            Return to Exams
          </button>
        </div>
      </section>

      {/* Question Review — centered */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-10">
        <h2 className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-white/40 mb-6 sm:mb-8 pb-3 border-b border-white/10">
          Answer Review — {score} of {totalQuestions} correct
        </h2>

        <div className="space-y-4 sm:space-y-5">
          {questionResults.map((result, index) => {
            const { questionText, options, correctOptionIndex, selectedOptionIndex, isCorrect } = result;

            return (
              <div key={result.questionId} className="border border-white/10 bg-white/[0.02] p-4 sm:p-6 rounded-sm">
                <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-5">
                  <span className="text-white/20 text-[11px] sm:text-xs font-mono mt-0.5 shrink-0 w-5 sm:w-6 text-right">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 sm:gap-3">
                      <h3 className="text-xs sm:text-sm font-medium text-white/80 leading-relaxed">{questionText}</h3>
                      <span className="shrink-0 mt-0.5">
                        {isCorrect ? (
                          <div className="w-5 h-5 sm:w-6 sm:h-6 border border-purple-400/40 bg-purple-500/10 flex items-center justify-center rounded-sm">
                            <Check size={10} className="text-purple-300" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 sm:w-6 sm:h-6 border border-dashed border-white/20 flex items-center justify-center rounded-sm">
                            <X size={10} className="text-white/30" />
                          </div>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="ml-8 sm:ml-10 space-y-1.5 sm:space-y-2">
                  {options.map((option, optIdx) => {
                    const letter = String.fromCharCode(65 + optIdx);
                    const isCorrectOption = optIdx === correctOptionIndex;
                    const isUserChoice = optIdx === selectedOptionIndex;
                    const isWrongChoice = isUserChoice && !isCorrectOption;

                    let borderClass = 'border-white/8 text-white/35';
                    let letterClass = 'text-white/20';
                    let labelEl = null;

                    if (isCorrectOption) {
                      borderClass = 'border-purple-400/30 text-white/80 bg-purple-500/5';
                      letterClass = 'bg-purple-500 text-white font-semibold';
                      labelEl = (
                        <span className="text-[9px] sm:text-[10px] text-purple-300/50 uppercase tracking-widest font-mono shrink-0">
                          {isUserChoice ? 'Correct' : 'Correct Answer'}
                        </span>
                      );
                    } else if (isWrongChoice) {
                      borderClass = 'border-dashed border-white/15 text-white/50';
                      letterClass = 'text-white/40';
                      labelEl = (
                        <span className="text-[9px] sm:text-[10px] text-white/30 uppercase tracking-widest font-mono shrink-0">
                          Your Answer
                        </span>
                      );
                    }

                    return (
                      <div key={optIdx} className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 border text-xs sm:text-sm rounded-sm ${borderClass}`}>
                        <span className={`w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center font-mono text-[10px] sm:text-xs rounded-sm shrink-0 ${letterClass}`}>
                          {letter}
                        </span>
                        <span className="flex-1 text-xs sm:text-sm">{option}</span>
                        {labelEl}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center py-8 sm:py-10">
          <button
            onClick={handleGoHome}
            className="inline-flex items-center gap-2 px-5 py-2 text-[11px] sm:text-xs font-mono tracking-widest text-white/40 hover:text-purple-300 uppercase transition-colors"
            id="bottom-go-home-btn"
          >
            <ArrowLeft size={14} />
            Take Another Assessment
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#050505]/60 py-5 sm:py-6 px-6 sm:px-8 mt-auto">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-white/15 text-[11px] font-mono uppercase tracking-wider">.computer Quiz</p>
        </div>
      </footer>
    </PageLayout>
  );
}
