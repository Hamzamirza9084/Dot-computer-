import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import api from '../../lib/axios';

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
    if (!dateStr) return '--';
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f9f9f9', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <nav className="border-b flex justify-center" style={{ backgroundColor: '#ffffff', borderColor: '#e2e2e2', padding: '16px 24px', position: 'sticky', top: 0, zIndex: 30 }}>
        <div className="w-full max-w-5xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin/dashboard" className="font-extrabold text-xl tracking-tight" style={{ color: '#1b1b1b' }}>
              .computer<span style={{ color: '#5682B1' }}>Quiz</span>
            </Link>
            <span className="hidden sm:inline text-xs font-semibold border-l" style={{ color: '#727780', borderColor: '#e2e2e2', paddingLeft: '12px' }}>Attempts</span>
          </div>
          <button onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-2 text-sm font-semibold transition-colors duration-300"
            style={{ color: '#727780', padding: '8px 16px', borderRadius: '10px', border: '1px solid #e2e2e2' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#5682B1'; e.currentTarget.style.color = '#5682B1'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e2e2'; e.currentTarget.style.color = '#727780'; }}
            id="back-to-dashboard">
            <ArrowLeft size={14} /> Dashboard
          </button>
        </div>
      </nav>

      <main className="flex-1 w-full flex justify-center px-6" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
        <div className="w-full max-w-5xl">
        <div className="border-b" style={{ borderColor: '#e2e2e2', paddingBottom: '20px', marginBottom: '24px' }}>
          <h1 className="font-bold" style={{ fontSize: '28px', color: '#1b1b1b' }}>Attempt History</h1>
          {data?.exam && <p className="text-sm" style={{ color: '#727780', marginTop: '4px' }}>{data.exam.title}</p>}
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-xl" style={{ padding: '14px 16px', marginBottom: '20px', backgroundColor: 'rgba(186,26,26,0.06)', border: '1px solid rgba(186,26,26,0.15)', color: '#ba1a1a', fontSize: '14px' }}>
            <AlertCircle size={16} className="shrink-0" /><span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="text-center text-sm" style={{ color: '#727780', paddingTop: '80px' }}>Loading...</div>
        ) : !data?.attempts || data.attempts.length === 0 ? (
          <div className="text-center rounded-2xl" style={{ paddingTop: '80px', paddingBottom: '80px', border: '1px dashed #e2e2e2' }}>
            <p className="text-sm" style={{ color: '#727780' }}>No attempts recorded yet</p>
          </div>
        ) : (
          <>
            <p className="text-sm" style={{ color: '#727780', marginBottom: '20px' }}>
              {data.attempts.length} attempt{data.attempts.length !== 1 ? 's' : ''} recorded
            </p>

            {/* Table */}
            <div className="hidden sm:block rounded-2xl overflow-hidden" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e2e2' }} id="attempts-table">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e2e2' }}>
                    <th className="text-left font-semibold" style={{ padding: '14px 20px', color: '#727780', fontSize: '12px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Name</th>
                    <th className="text-left font-semibold" style={{ padding: '14px 20px', color: '#727780', fontSize: '12px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Score</th>
                    <th className="text-left font-semibold" style={{ padding: '14px 20px', color: '#727780', fontSize: '12px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Started</th>
                    <th className="text-left font-semibold" style={{ padding: '14px 20px', color: '#727780', fontSize: '12px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Submitted</th>
                    <th className="text-left font-semibold" style={{ padding: '14px 20px', color: '#727780', fontSize: '12px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {data.attempts.map((attempt, idx) => (
                    <tr key={attempt._id}
                        style={{ borderBottom: idx < data.attempts.length - 1 ? '1px solid #f3f3f3' : 'none' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fafafa'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; }}>
                      <td className="font-semibold" style={{ padding: '14px 20px', color: '#1b1b1b' }}>{attempt.userName}</td>
                      <td className="font-bold" style={{ padding: '14px 20px', color: '#5682B1' }}>
                        {attempt.score !== null ? `${attempt.score} / ${attempt.totalQuestions}` : '--'}
                      </td>
                      <td style={{ padding: '14px 20px', color: '#727780', fontSize: '13px' }}>{formatDate(attempt.startedAt)}</td>
                      <td style={{ padding: '14px 20px', color: '#727780', fontSize: '13px' }}>{formatDate(attempt.submittedAt)}</td>
                      <td style={{ padding: '14px 20px' }}>
                        {attempt.submittedAt ? (
                          <span className="text-xs font-bold rounded-full"
                                style={attempt.autoSubmitted
                                  ? { backgroundColor: '#f3f3f3', color: '#727780', padding: '4px 12px', border: '1px solid #e2e2e2' }
                                  : { backgroundColor: 'rgba(86,130,177,0.1)', color: '#5682B1', padding: '4px 12px', border: '1px solid rgba(86,130,177,0.2)' }
                                }>{attempt.autoSubmitted ? 'Auto' : 'Manual'}</span>
                        ) : <span className="text-xs" style={{ color: '#c2c7d0' }}>In Progress</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden flex flex-col gap-2">
              {data.attempts.map((attempt) => (
                <div key={attempt._id} className="rounded-2xl"
                     style={{ backgroundColor: '#ffffff', border: '1px solid #e2e2e2', padding: '16px 20px' }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: '8px' }}>
                    <span className="font-semibold text-sm" style={{ color: '#1b1b1b' }}>{attempt.userName}</span>
                    <span className="text-sm font-bold" style={{ color: '#5682B1' }}>
                      {attempt.score !== null ? `${attempt.score}/${attempt.totalQuestions}` : '--'}
                    </span>
                  </div>
                  <div className="text-xs" style={{ color: '#727780' }}>
                    <p>Started: {formatDate(attempt.startedAt)}</p>
                    <p>Submitted: {formatDate(attempt.submittedAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        </div>
      </main>
    </div>
  );
}
