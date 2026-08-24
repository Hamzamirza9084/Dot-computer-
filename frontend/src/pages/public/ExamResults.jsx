import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Check, X, ArrowLeft } from 'lucide-react';
import useExamStore from '../../store/examStore';

export default function ExamResults() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { exam, results, userName, reset } = useExamStore();

  useEffect(() => {
    if (!results) navigate(`/exam/${id}/enter`, { replace: true });
  }, [results, id, navigate]);

  if (!results || !exam) return null;

  const { score, totalQuestions, autoSubmitted, results: questionResults } = results;
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  const handleGoHome = () => { reset(); navigate('/'); };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f9f9f9', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Nav */}
      <nav className="border-b flex justify-center" style={{ backgroundColor: '#ffffff', borderColor: '#e2e2e2', padding: '16px 24px' }}>
        <div className="w-full max-w-5xl flex items-center justify-between">
          <Link to="/" onClick={handleGoHome} className="font-extrabold text-xl tracking-tight" style={{ color: '#1b1b1b' }}>
            .computer<span style={{ color: '#5682B1' }}>Quiz</span>
          </Link>
          <span className="text-sm font-medium" style={{ color: '#727780' }}>Assessment Complete</span>
        </div>
      </nav>

      {/* Score hero */}
      <section className="border-b flex justify-center" style={{ backgroundColor: '#ffffff', borderColor: '#e2e2e2', paddingTop: '56px', paddingBottom: '56px' }}>
        <div className="w-full max-w-5xl px-6 text-center">
          <p className="text-sm font-medium" style={{ color: '#727780', marginBottom: '24px' }}>
            {autoSubmitted ? "Time expired -- auto-submitted" : `Completed by ${userName}`}
          </p>
          <div className="relative inline-flex items-center justify-center" style={{ width: '180px', height: '180px', marginBottom: '24px' }}>
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="70" fill="none" stroke="#e2e2e2" strokeWidth="6" />
              <circle cx="80" cy="80" r="70" fill="none" stroke="#5682B1" strokeWidth="6" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 70}
                strokeDashoffset={2 * Math.PI * 70 * (1 - percentage / 100)}
                style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
            </svg>
            <div className="text-center">
              <span className="font-extrabold" style={{ fontSize: '44px', color: '#1b1b1b' }}>{score}</span>
              <span style={{ fontSize: '20px', color: '#c2c7d0', fontWeight: 300, marginLeft: '2px' }}>/{totalQuestions}</span>
            </div>
          </div>
          <p className="text-sm font-medium" style={{ color: '#727780', marginBottom: '32px' }}>{percentage}% correct</p>
          <button onClick={handleGoHome}
            className="inline-flex items-center gap-2.5 text-white text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
            style={{ backgroundColor: '#5682B1', borderRadius: '16px', padding: '12px 28px' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#739EC9'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#5682B1'; }}
            id="go-home-btn">
            <ArrowLeft size={16} /> Return to Assessments
          </button>
        </div>
      </section>

      {/* Answer review */}
      <main className="flex-1 w-full flex justify-center px-6" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <div className="w-full max-w-5xl">
        <h2 className="text-sm font-semibold border-b" style={{ color: '#727780', paddingBottom: '16px', marginBottom: '24px', borderColor: '#e2e2e2' }}>
          Answer Review -- {score} of {totalQuestions} correct
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {questionResults.map((result, index) => {
            const { questionText, options, correctOptionIndex, selectedOptionIndex, isCorrect } = result;
            return (
              <div key={result.questionId} className="rounded-2xl" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e2e2', padding: '24px' }}>
                <div className="flex items-start gap-4" style={{ marginBottom: '20px' }}>
                  <span style={{ color: '#c2c7d0', fontSize: '12px', fontWeight: 700, marginTop: '2px', width: '24px', textAlign: 'right', flexShrink: 0 }}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-medium" style={{ fontSize: '15px', color: '#1b1b1b', lineHeight: '1.5' }}>{questionText}</h3>
                      <span className="shrink-0">
                        {isCorrect ? (
                          <div className="flex items-center justify-center" style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: 'rgba(86,130,177,0.1)', border: '1px solid rgba(86,130,177,0.25)' }}>
                            <Check size={14} style={{ color: '#5682B1' }} />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center" style={{ width: '28px', height: '28px', borderRadius: '8px', border: '1px dashed #e2e2e2' }}>
                            <X size={14} style={{ color: '#c2c7d0' }} />
                          </div>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ marginLeft: '40px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {options.map((option, optIdx) => {
                    const letter = String.fromCharCode(65 + optIdx);
                    const isCorrectOpt = optIdx === correctOptionIndex;
                    const isUserChoice = optIdx === selectedOptionIndex;
                    const isWrong = isUserChoice && !isCorrectOpt;
                    let bg = '#ffffff', border = '#e2e2e2', textColor = '#42474f';
                    let letterBg = '#f3f3f3', letterColor = '#727780';
                    let label = null;
                    if (isCorrectOpt) {
                      bg = 'rgba(86,130,177,0.06)'; border = 'rgba(86,130,177,0.3)'; textColor = '#1b1b1b';
                      letterBg = '#5682B1'; letterColor = '#ffffff';
                      label = <span style={{ fontSize: '12px', fontWeight: 600, color: '#5682B1', flexShrink: 0 }}>{isUserChoice ? 'Correct' : 'Correct Answer'}</span>;
                    } else if (isWrong) {
                      border = '#e2e2e2'; textColor = '#42474f';
                      label = <span style={{ fontSize: '12px', fontWeight: 500, color: '#727780', flexShrink: 0 }}>Your Answer</span>;
                    }
                    return (
                      <div key={optIdx} className="flex items-center gap-3 border rounded-xl"
                           style={{ backgroundColor: bg, borderColor: border, color: textColor, padding: '10px 16px', fontSize: '14px' }}>
                        <span className="flex items-center justify-center shrink-0 font-semibold rounded-lg"
                              style={{ width: '24px', height: '24px', fontSize: '11px', backgroundColor: letterBg, color: letterColor }}>{letter}</span>
                        <span className="flex-1">{option}</span>
                        {label}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-center" style={{ paddingTop: '48px', paddingBottom: '16px' }}>
          <button onClick={handleGoHome}
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors duration-300"
            style={{ color: '#727780' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#5682B1'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#727780'; }}
            id="bottom-go-home-btn">
            <ArrowLeft size={16} /> Take Another Assessment
          </button>
        </div>
        </div>
      </main>

      <footer className="border-t text-center flex justify-center" style={{ backgroundColor: '#ffffff', borderColor: '#e2e2e2', padding: '24px' }}>
        <div className="w-full max-w-5xl">
          <p className="text-sm" style={{ color: '#c2c7d0' }}>.computer Quiz</p>
        </div>
      </footer>
    </div>
  );
}
