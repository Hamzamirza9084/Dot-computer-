import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Clock, FileText, AlertCircle } from 'lucide-react';
import api from '../../lib/axios';
import useExamStore from '../../store/examStore';
import PageLayout from '../../components/PageLayout';

export default function ExamEntry() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');
  const { setExamData, setUserName } = useExamStore();

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await api.get('/exams');
        const found = res.data.data.find((e) => e._id === id);
        if (found) setExam(found);
        else setError('Exam not found or not available.');
      } catch (err) {
        setError('Failed to load exam details.');
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [id]);

  const handleStart = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setStarting(true);
    setError('');
    try {
      const res = await api.get(`/exams/${id}/start`, { params: { userName: name.trim() } });
      setUserName(name.trim());
      setExamData(res.data.data);
      navigate(`/exam/${id}/take`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start exam.');
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex-1 flex items-center justify-center text-white/30 font-mono text-sm uppercase tracking-widest">
          Loading...
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Top Navigation */}
      <nav className="border-b border-white/10 bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
          <Link to="/" className="font-bold text-lg sm:text-2xl tracking-tight text-white">
            .computer Quiz
          </Link>
          <span className="text-white/30 text-[11px] sm:text-xs font-mono uppercase tracking-widest">
            Assessment Entry
          </span>
        </div>
      </nav>

      {/* Main Content — properly centered */}
      <main className="flex-1 flex items-center justify-center px-6 sm:px-8 py-10 sm:py-16">
        <div className="w-full max-w-lg mx-auto">
          {error && (
            <div className="flex items-center gap-3 p-4 mb-6 border border-red-500/20 bg-red-500/5 text-red-300/80 text-sm rounded-sm">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {exam && (
            <>
              {/* Exam Info */}
              <div className="border border-white/10 bg-white/[0.02] backdrop-blur-sm p-6 sm:p-8 mb-6 sm:mb-8 rounded-sm text-center">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight mb-3 text-white">
                  {exam.title}
                </h1>
                {exam.description && (
                  <p className="text-white/40 text-xs sm:text-sm mb-5 sm:mb-6 leading-relaxed">{exam.description}</p>
                )}
                <div className="flex items-center justify-center gap-4 sm:gap-6 text-[11px] sm:text-xs text-purple-300/50 font-mono uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Clock size={12} />
                    {exam.durationMinutes} minutes
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FileText size={12} />
                    {exam.questionCount} question{exam.questionCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Name Entry Form */}
              <form onSubmit={handleStart} className="space-y-4 sm:space-y-5" id="exam-entry-form">
                <div>
                  <label htmlFor="userName" className="block text-[11px] sm:text-xs font-mono text-white/40 mb-2 uppercase tracking-widest">
                    Candidate Identifier
                  </label>
                  <input
                    type="text"
                    id="userName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoFocus
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/15 text-white placeholder-white/20 focus:outline-none focus:border-purple-400/50 focus:bg-white/[0.05] transition-all duration-200 rounded-sm"
                    placeholder="Enter your full name"
                  />
                </div>

                <button
                  type="submit"
                  disabled={starting || !name.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-mono font-semibold text-xs uppercase tracking-widest hover:from-purple-500 hover:to-purple-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 rounded-sm"
                  id="start-exam-btn"
                >
                  {starting ? (
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Begin Assessment
                      <ArrowRight size={14} strokeWidth={2.5} />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-white/15 text-[10px] sm:text-[11px] mt-8 sm:mt-10 font-mono uppercase tracking-widest">
                Timer starts immediately upon entry
              </p>
            </>
          )}
        </div>
      </main>
    </PageLayout>
  );
}
