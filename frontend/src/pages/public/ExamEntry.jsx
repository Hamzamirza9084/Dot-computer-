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
        <div className="flex-1 flex items-center justify-center text-white/30 text-sm font-medium">Loading...</div>
      </PageLayout>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#000000', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Nav */}
      <nav className="flex items-center justify-between" style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link to="/" className="font-extrabold text-xl tracking-tight text-white">
          .computer<span style={{ color: '#5682B1' }}>Quiz</span>
        </Link>
        <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>Assessment Entry</span>
      </nav>

      {/* Center card */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          {error && (
            <div className="flex items-center gap-3 rounded-xl" style={{ padding: '14px 16px', marginBottom: '20px', backgroundColor: 'rgba(186,26,26,0.08)', border: '1px solid rgba(186,26,26,0.2)', color: 'rgba(255,120,120,0.9)', fontSize: '14px' }}>
              <AlertCircle size={16} className="shrink-0" /><span>{error}</span>
            </div>
          )}

          {exam && (
            <div className="rounded-2xl text-center"
                 style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', padding: '48px 40px' }}>
              <h1 className="font-bold text-white" style={{ fontSize: '28px', lineHeight: '36px', marginBottom: '16px' }}>
                {exam.title}
              </h1>
              <div className="flex items-center justify-center gap-6" style={{ marginBottom: '36px', color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />{exam.durationMinutes} minutes
                </span>
                <span className="flex items-center gap-1.5">
                  <FileText size={14} />{exam.questionCount} question{exam.questionCount !== 1 ? 's' : ''}
                </span>
              </div>

              <form onSubmit={handleStart} id="exam-entry-form">
                <div className="text-left" style={{ marginBottom: '24px' }}>
                  <label htmlFor="userName" className="block font-semibold" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '10px' }}>
                    Your Name
                  </label>
                  <input
                    type="text" id="userName" value={name}
                    onChange={(e) => setName(e.target.value)} required autoFocus
                    className="w-full text-white text-sm focus:outline-none transition-all duration-300"
                    style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '14px 18px' }}
                    onFocus={(e) => { e.target.style.borderColor = 'rgba(86,130,177,0.5)'; e.target.style.backgroundColor = 'rgba(255,255,255,0.08)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.backgroundColor = 'rgba(255,255,255,0.06)'; }}
                    placeholder="Enter your full name"
                  />
                </div>
                <button
                  type="submit" disabled={starting || !name.trim()}
                  className="w-full flex items-center justify-center gap-2.5 text-white text-sm font-semibold transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5"
                  style={{ backgroundColor: '#5682B1', borderRadius: '16px', padding: '16px' }}
                  onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#739EC9'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#5682B1'; }}
                  id="start-exam-btn"
                >
                  {starting ? (
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Begin Assessment <ArrowRight size={16} /></>
                  )}
                </button>
              </form>
              <p style={{ marginTop: '28px', color: 'rgba(255,255,255,0.2)', fontSize: '12px' }}>
                The timer starts immediately upon entry
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
