import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Eye, EyeOff, Trash2, Edit, Users, LogOut, AlertCircle } from 'lucide-react';
import api from '../../lib/axios';
import useAuthStore from '../../store/authStore';
import ConfirmModal from '../../components/ConfirmModal';
import PageLayout from '../../components/PageLayout';

export default function AdminDashboard() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newExam, setNewExam] = useState({ title: '', description: '', durationMinutes: 30 });
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const navigate = useNavigate();
  const { logout, email } = useAuthStore();

  const fetchExams = async () => {
    try {
      const res = await api.get('/admin/exams');
      setExams(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load exams.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExams(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError('');
    try {
      await api.post('/admin/exams', newExam);
      setNewExam({ title: '', description: '', durationMinutes: 30 });
      setShowCreateForm(false);
      fetchExams();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create exam.');
    } finally {
      setCreating(false);
    }
  };

  const handleToggleVisibility = async (examId) => {
    setError('');
    try {
      await api.patch(`/admin/exams/${examId}/visibility`);
      fetchExams();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to toggle visibility.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setError('');
    try {
      await api.delete(`/admin/exams/${deleteTarget}`);
      setDeleteTarget(null);
      fetchExams();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete exam.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <PageLayout>
      {/* Top Navigation */}
      <nav className="border-b border-white/10 sticky top-0 z-30 bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/admin/dashboard" className="font-bold text-lg sm:text-2xl tracking-tight text-white">
              .computer Quiz
            </Link>
            <span className="hidden sm:inline-block text-purple-300/40 text-xs font-mono uppercase tracking-widest border-l border-white/10 pl-3">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="hidden sm:inline text-white/30 text-xs font-mono">{email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-mono tracking-widest uppercase border border-white/15 px-2.5 sm:px-3 py-1.5 text-white/50 hover:text-white hover:border-white/40 transition-all rounded-sm"
              id="logout-btn"
            >
              <LogOut size={12} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-10 w-full">
        {error && (
          <div className="flex items-center gap-3 p-3 sm:p-4 mb-6 border border-red-500/20 bg-red-500/5 text-red-300/80 text-xs sm:text-sm rounded-sm">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Actions bar */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 pb-3 sm:pb-4 border-b border-white/10">
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight">Assessments</h2>
            <p className="text-white/30 text-[11px] sm:text-xs font-mono mt-0.5 sm:mt-1">{exams.length} total</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-mono font-semibold tracking-widest uppercase bg-gradient-to-r from-purple-600 to-purple-500 text-white px-3 sm:px-4 py-2 sm:py-2.5 hover:from-purple-500 hover:to-purple-400 transition-all rounded-sm"
            id="create-exam-btn"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span className="hidden sm:inline">New Exam</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <form onSubmit={handleCreate} className="border border-white/15 bg-white/[0.02] p-4 sm:p-6 mb-6 sm:mb-8 space-y-4 sm:space-y-5 rounded-sm" id="create-exam-form">
            <div>
              <label className="block text-[11px] sm:text-xs font-mono text-white/40 mb-2 uppercase tracking-widest">Title</label>
              <input type="text" value={newExam.title} onChange={(e) => setNewExam({ ...newExam, title: e.target.value })} required
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/15 text-white placeholder-white/20 focus:outline-none focus:border-purple-400/50 transition-colors rounded-sm"
                placeholder="e.g. JavaScript Fundamentals" id="exam-title-input" />
            </div>
            <div>
              <label className="block text-[11px] sm:text-xs font-mono text-white/40 mb-2 uppercase tracking-widest">Description</label>
              <textarea value={newExam.description} onChange={(e) => setNewExam({ ...newExam, description: e.target.value })} rows={2}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/15 text-white placeholder-white/20 focus:outline-none focus:border-purple-400/50 transition-colors resize-none rounded-sm"
                placeholder="Brief description..." id="exam-description-input" />
            </div>
            <div>
              <label className="block text-[11px] sm:text-xs font-mono text-white/40 mb-2 uppercase tracking-widest">Duration (minutes)</label>
              <input type="number" value={newExam.durationMinutes} onChange={(e) => setNewExam({ ...newExam, durationMinutes: parseInt(e.target.value) || 1 })} min={1} required
                className="w-24 sm:w-32 px-4 py-3 bg-white/[0.03] border border-white/15 text-white focus:outline-none focus:border-purple-400/50 transition-colors rounded-sm" id="exam-duration-input" />
            </div>
            <div className="flex gap-3 justify-end pt-1 sm:pt-2">
              <button type="button" onClick={() => setShowCreateForm(false)}
                className="px-3 sm:px-4 py-2 text-[11px] sm:text-xs font-mono tracking-widest uppercase text-white/40 hover:text-white border border-white/10 hover:border-white/30 transition-all rounded-sm">
                Cancel
              </button>
              <button type="submit" disabled={creating}
                className="px-4 sm:px-5 py-2 text-[11px] sm:text-xs font-mono font-semibold tracking-widest uppercase bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-500 hover:to-purple-400 disabled:opacity-40 transition-all rounded-sm"
                id="exam-create-submit">
                {creating ? 'Creating...' : 'Create Exam'}
              </button>
            </div>
          </form>
        )}

        {/* Exams List */}
        {loading ? (
          <div className="text-center text-white/30 py-16 sm:py-20 font-mono text-sm uppercase tracking-widest">Loading...</div>
        ) : exams.length === 0 ? (
          <div className="text-center py-16 sm:py-20 border border-dashed border-white/10 rounded-sm">
            <p className="text-white/30 text-[11px] sm:text-xs font-mono uppercase tracking-widest">No exams yet — create your first assessment</p>
          </div>
        ) : (
          <div className="space-y-2.5 sm:space-y-3">
            {exams.map((exam) => (
              <div key={exam._id} className="border border-white/10 bg-white/[0.02] p-4 sm:p-6 hover:border-purple-400/20 transition-colors duration-200 rounded-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3 mb-1">
                      <h3 className="font-semibold text-white text-sm sm:text-base truncate">{exam.title}</h3>
                      <span className={`text-[9px] sm:text-[10px] uppercase tracking-widest font-mono px-2 py-0.5 border shrink-0 rounded-sm ${
                        exam.isVisible ? 'border-purple-400/30 text-purple-300/60' : 'border-white/10 text-white/25'
                      }`}>
                        {exam.isVisible ? 'Live' : 'Draft'}
                      </span>
                    </div>
                    {exam.description && <p className="text-white/35 text-xs sm:text-sm truncate">{exam.description}</p>}
                    <div className="flex items-center gap-3 sm:gap-4 mt-1.5 sm:mt-2 text-[10px] sm:text-[11px] text-white/25 font-mono uppercase tracking-wider">
                      <span>{exam.questionCount} questions</span>
                      <span>{exam.durationMinutes} min</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <button onClick={() => handleToggleVisibility(exam._id)}
                      className="p-2 sm:p-2.5 border border-white/10 hover:border-purple-400/30 text-white/40 hover:text-purple-300 transition-all rounded-sm"
                      title={exam.isVisible ? 'Hide' : 'Show'} id={`toggle-visibility-${exam._id}`}>
                      {exam.isVisible ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                    <button onClick={() => navigate(`/admin/exams/${exam._id}`)}
                      className="p-2 sm:p-2.5 border border-white/10 hover:border-purple-400/30 text-white/40 hover:text-purple-300 transition-all rounded-sm"
                      title="Edit" id={`edit-exam-${exam._id}`}>
                      <Edit size={13} />
                    </button>
                    <button onClick={() => navigate(`/admin/exams/${exam._id}/attempts`)}
                      className="p-2 sm:p-2.5 border border-white/10 hover:border-purple-400/30 text-white/40 hover:text-purple-300 transition-all rounded-sm"
                      title="Attempts" id={`view-attempts-${exam._id}`}>
                      <Users size={13} />
                    </button>
                    <button onClick={() => setDeleteTarget(exam._id)}
                      className="p-2 sm:p-2.5 border border-white/10 hover:border-red-400/30 text-white/40 hover:text-red-400 transition-all rounded-sm"
                      title="Delete" id={`delete-exam-${exam._id}`}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <ConfirmModal isOpen={!!deleteTarget} title="Delete Assessment"
        message="This will permanently delete the exam, all its questions, and all attempts. This action cannot be undone."
        confirmText="Delete" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </PageLayout>
  );
}
