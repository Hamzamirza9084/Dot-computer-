import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import api from '../../lib/axios';
import PageLayout from '../../components/PageLayout';

export default function ExamAttempts() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const res = await api.get(`/admin/exams/${id}/attempts`);
        setData(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load attempts.');
      } finally {
        setLoading(false);
      }
    };
    fetchAttempts();
  }, [id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <PageLayout>
      <nav className="border-b border-white/10 sticky top-0 z-30 bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/admin/dashboard" className="font-bold text-lg sm:text-2xl tracking-tight text-white">.computer Quiz</Link>
            <span className="hidden sm:inline-block text-purple-300/40 text-xs font-mono uppercase tracking-widest border-l border-white/10 pl-3">Attempts</span>
          </div>
          <button onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-mono tracking-widest uppercase text-white/40 hover:text-white transition-colors"
            id="back-to-dashboard">
            <ArrowLeft size={14} /> <span className="hidden sm:inline">Dashboard</span>
          </button>
        </div>
      </nav>

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-10 w-full">
        <div className="mb-6 sm:mb-8 pb-3 sm:pb-4 border-b border-white/10">
          <h1 className="text-base sm:text-lg font-bold tracking-tight">Attempt History</h1>
          {data?.exam && <p className="text-purple-300/40 text-[11px] sm:text-xs font-mono mt-1 uppercase tracking-widest">{data.exam.title}</p>}
        </div>

        {error && (
          <div className="flex items-center gap-3 p-3 sm:p-4 mb-6 border border-red-500/20 bg-red-500/5 text-red-300/80 text-xs sm:text-sm rounded-sm">
            <AlertCircle size={16} className="shrink-0" /><span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="text-center text-white/30 py-16 sm:py-20 font-mono text-sm uppercase tracking-widest">Loading...</div>
        ) : !data?.attempts || data.attempts.length === 0 ? (
          <div className="text-center py-16 sm:py-20 border border-dashed border-white/10 rounded-sm">
            <p className="text-white/30 text-[11px] sm:text-xs font-mono uppercase tracking-widest">No attempts recorded yet</p>
          </div>
        ) : (
          <>
            <p className="text-white/30 text-[10px] sm:text-[11px] font-mono mb-4 sm:mb-5 uppercase tracking-widest">
              {data.attempts.length} attempt{data.attempts.length !== 1 ? 's' : ''} recorded
            </p>

            {/* Desktop table */}
            <div className="hidden sm:block border border-white/10 overflow-hidden rounded-sm">
              <table className="w-full text-sm" id="attempts-table">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02]">
                    <th className="text-left px-5 py-3 text-[11px] font-mono font-normal text-white/40 uppercase tracking-widest">Name</th>
                    <th className="text-left px-5 py-3 text-[11px] font-mono font-normal text-white/40 uppercase tracking-widest">Score</th>
                    <th className="text-left px-5 py-3 text-[11px] font-mono font-normal text-white/40 uppercase tracking-widest">Started</th>
                    <th className="text-left px-5 py-3 text-[11px] font-mono font-normal text-white/40 uppercase tracking-widest">Submitted</th>
                    <th className="text-left px-5 py-3 text-[11px] font-mono font-normal text-white/40 uppercase tracking-widest">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {data.attempts.map((attempt) => (
                    <tr key={attempt._id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-4 text-white font-medium">{attempt.userName}</td>
                      <td className="px-5 py-4 text-purple-300/60 font-mono">
                        {attempt.score !== null ? `${attempt.score} / ${attempt.totalQuestions}` : '—'}
                      </td>
                      <td className="px-5 py-4 text-white/30 text-xs">{formatDate(attempt.startedAt)}</td>
                      <td className="px-5 py-4 text-white/30 text-xs">{formatDate(attempt.submittedAt)}</td>
                      <td className="px-5 py-4">
                        {attempt.submittedAt ? (
                          <span className={`text-[10px] uppercase tracking-widest font-mono px-2 py-0.5 border rounded-sm ${
                            attempt.autoSubmitted ? 'border-white/15 text-white/30' : 'border-purple-400/25 text-purple-300/50'
                          }`}>{attempt.autoSubmitted ? 'Auto' : 'Manual'}</span>
                        ) : <span className="text-[10px] uppercase tracking-widest font-mono text-white/20">In Progress</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden space-y-2.5">
              {data.attempts.map((attempt) => (
                <div key={attempt._id} className="border border-white/10 bg-white/[0.02] p-4 space-y-2.5 rounded-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white text-sm">{attempt.userName}</span>
                    <span className="text-purple-300/50 text-sm font-mono">
                      {attempt.score !== null ? `${attempt.score}/${attempt.totalQuestions}` : '—'}
                    </span>
                  </div>
                  <div className="text-[10px] text-white/25 space-y-0.5 font-mono">
                    <p>Started: {formatDate(attempt.startedAt)}</p>
                    <p>Submitted: {formatDate(attempt.submittedAt)}</p>
                  </div>
                  {attempt.submittedAt && (
                    <span className={`text-[10px] uppercase tracking-widest font-mono px-2 py-0.5 border inline-block rounded-sm ${
                      attempt.autoSubmitted ? 'border-white/15 text-white/30' : 'border-purple-400/25 text-purple-300/50'
                    }`}>{attempt.autoSubmitted ? 'Auto' : 'Manual'}</span>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </PageLayout>
  );
}
