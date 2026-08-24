import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Eye, EyeOff, Trash2, Edit, Users, LogOut, AlertCircle, Clock, Minus, Check, X, LayoutDashboard, BookOpen, BarChart3, Settings } from 'lucide-react';
import api from '../../lib/axios';
import useAuthStore from '../../store/authStore';
import ConfirmModal from '../../components/ConfirmModal';

export default function AdminDashboard() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newExam, setNewExam] = useState({ title: '', description: '', durationMinutes: 30 });
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [timerEditId, setTimerEditId] = useState(null);
  const [timerValue, setTimerValue] = useState(30);
  const [savingTimer, setSavingTimer] = useState(false);
  const navigate = useNavigate();
  const { logout, email } = useAuthStore();

  const fetchExams = async () => {
    try { const res = await api.get('/admin/exams'); setExams(res.data.data); }
    catch (err) { setError(err.response?.data?.message || 'Failed to load exams.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchExams(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault(); setCreating(true); setError('');
    try { await api.post('/admin/exams', newExam); setNewExam({ title: '', description: '', durationMinutes: 30 }); setShowCreateForm(false); fetchExams(); }
    catch (err) { setError(err.response?.data?.message || 'Failed to create exam.'); }
    finally { setCreating(false); }
  };

  const handleToggleVisibility = async (examId) => {
    setError('');
    try { await api.patch(`/admin/exams/${examId}/visibility`); fetchExams(); }
    catch (err) { setError(err.response?.data?.message || 'Failed to toggle visibility.'); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return; setError('');
    try { await api.delete(`/admin/exams/${deleteTarget}`); setDeleteTarget(null); fetchExams(); }
    catch (err) { setError(err.response?.data?.message || 'Failed to delete exam.'); }
  };

  const handleLogout = () => { logout(); navigate('/admin/login'); };
  const openTimerEditor = (exam) => { setTimerEditId(exam._id); setTimerValue(exam.durationMinutes); };
  const closeTimerEditor = () => { setTimerEditId(null); setTimerValue(30); };
  const handleSaveTimer = async (examId) => {
    if (timerValue < 1) return; setSavingTimer(true); setError('');
    try { await api.put(`/admin/exams/${examId}`, { durationMinutes: timerValue }); setTimerEditId(null); fetchExams(); }
    catch (err) { setError(err.response?.data?.message || 'Failed to update timer.'); }
    finally { setSavingTimer(false); }
  };

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: false },
    { icon: BookOpen, label: 'Assessments', active: true },
    { icon: BarChart3, label: 'Analytics', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  const inputBase = { backgroundColor: '#ffffff', border: '1px solid #e2e2e2', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', color: '#1b1b1b', outline: 'none', width: '100%' };
  const actionBtnStyle = { width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', border: '1px solid #e2e2e2', color: '#727780', backgroundColor: '#ffffff', cursor: 'pointer', transition: 'all 200ms' };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f9f9f9', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col shrink-0" style={{ width: '260px', backgroundColor: '#1b1b1b', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ padding: '24px' }}>
          <div className="flex items-center gap-3" style={{ marginBottom: '4px' }}>
            <div className="flex items-center justify-center font-bold text-white rounded-xl" style={{ width: '40px', height: '40px', backgroundColor: '#5682B1', fontSize: '16px' }}>
              {email ? email.charAt(0).toUpperCase() : 'A'}
            </div>
            <div>
              <p className="font-bold text-white text-sm">Admin Console</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>Management Portal</p>
            </div>
          </div>
        </div>

        {/* Create New button */}
        <div style={{ padding: '0 16px', marginBottom: '8px' }}>
          <button onClick={() => setShowCreateForm(!showCreateForm)}
            className="w-full flex items-center gap-2 text-white text-sm font-semibold transition-all duration-300"
            style={{ backgroundColor: '#5682B1', borderRadius: '12px', padding: '10px 16px' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#739EC9'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#5682B1'; }}
            id="create-exam-btn">
            <Plus size={16} /> Create New
          </button>
        </div>

        {/* Nav items */}
        <nav style={{ padding: '8px', flex: 1 }}>
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.label}
                className="w-full flex items-center gap-3 text-sm font-medium transition-colors duration-200"
                style={{
                  padding: '10px 16px', borderRadius: '10px', marginBottom: '2px',
                  backgroundColor: item.active ? 'rgba(86,130,177,0.15)' : 'transparent',
                  color: item.active ? '#5682B1' : 'rgba(255,255,255,0.5)',
                }}
                onMouseEnter={(e) => { if (!item.active) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
                onMouseLeave={(e) => { if (!item.active) e.currentTarget.style.backgroundColor = 'transparent'; }}>
                <Icon size={18} /> {item.label}
              </button>
            );
          })}
        </nav>

        {/* Sign out */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 text-sm font-medium transition-colors duration-200"
            style={{ color: 'rgba(255,255,255,0.4)', padding: '10px 16px' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
            id="logout-btn">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b" style={{ backgroundColor: '#ffffff', borderColor: '#e2e2e2', padding: '16px 32px' }}>
          <span className="font-bold" style={{ fontSize: '18px', color: '#1b1b1b' }}>
            .computer<span style={{ color: '#5682B1' }}>Quiz</span>
          </span>
          <span className="text-sm" style={{ color: '#727780' }}>{email}</span>
        </header>

        {/* Content */}
        <main style={{ padding: '32px', flex: 1 }}>
          {/* Mobile create button */}
          <div className="lg:hidden flex justify-end" style={{ marginBottom: '16px' }}>
            <button onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center gap-2 text-white text-sm font-semibold"
              style={{ backgroundColor: '#5682B1', borderRadius: '12px', padding: '10px 20px' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#739EC9'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#5682B1'; }}>
              <Plus size={16} /> New Exam
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-3 rounded-xl" style={{ padding: '14px 16px', marginBottom: '20px', backgroundColor: 'rgba(186,26,26,0.06)', border: '1px solid rgba(186,26,26,0.15)', color: '#ba1a1a', fontSize: '14px' }}>
              <AlertCircle size={16} className="shrink-0" /><span>{error}</span>
            </div>
          )}

          <div className="flex items-end justify-between" style={{ marginBottom: '32px' }}>
            <div>
              <h1 className="font-bold" style={{ fontSize: '32px', lineHeight: '40px', color: '#1b1b1b' }}>Assessments</h1>
              <p className="text-sm" style={{ color: '#727780', marginTop: '4px' }}>{exams.length} total</p>
            </div>
            <button onClick={() => setShowCreateForm(!showCreateForm)}
              className="hidden lg:flex items-center gap-2 text-white text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
              style={{ backgroundColor: '#5682B1', borderRadius: '16px', padding: '10px 24px' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#739EC9'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#5682B1'; }}
              id="create-exam-btn-main">
              <Plus size={16} /> New Exam
            </button>
          </div>

          {/* Create form */}
          {showCreateForm && (
            <form onSubmit={handleCreate} className="rounded-2xl" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e2e2', padding: '28px', marginBottom: '24px' }} id="create-exam-form">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="block text-sm font-semibold" style={{ color: '#42474f', marginBottom: '8px' }}>Title</label>
                  <input type="text" value={newExam.title} onChange={(e) => setNewExam({ ...newExam, title: e.target.value })} required
                    style={inputBase} placeholder="e.g. JavaScript Fundamentals" id="exam-title-input"
                    onFocus={(e) => { e.target.style.borderColor = '#5682B1'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#e2e2e2'; }} />
                </div>
                <div>
                  <label className="block text-sm font-semibold" style={{ color: '#42474f', marginBottom: '8px' }}>Description</label>
                  <textarea value={newExam.description} onChange={(e) => setNewExam({ ...newExam, description: e.target.value })} rows={2}
                    style={{ ...inputBase, resize: 'none' }} placeholder="Brief description..." id="exam-description-input"
                    onFocus={(e) => { e.target.style.borderColor = '#5682B1'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#e2e2e2'; }} />
                </div>
                <div>
                  <label className="block text-sm font-semibold" style={{ color: '#42474f', marginBottom: '8px' }}>Duration (minutes)</label>
                  <input type="number" value={newExam.durationMinutes} onChange={(e) => setNewExam({ ...newExam, durationMinutes: parseInt(e.target.value) || 1 })} min={1} required
                    style={{ ...inputBase, width: '120px' }} id="exam-duration-input"
                    onFocus={(e) => { e.target.style.borderColor = '#5682B1'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#e2e2e2'; }} />
                </div>
                <div className="flex gap-3 justify-end" style={{ paddingTop: '8px' }}>
                  <button type="button" onClick={() => setShowCreateForm(false)}
                    className="text-sm font-semibold transition-colors duration-300" style={{ color: '#727780', padding: '10px 20px', borderRadius: '12px', border: '1px solid #e2e2e2' }}>Cancel</button>
                  <button type="submit" disabled={creating}
                    className="text-white text-sm font-semibold transition-all duration-300 disabled:opacity-40"
                    style={{ backgroundColor: '#5682B1', borderRadius: '12px', padding: '10px 24px' }}
                    onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#739EC9'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#5682B1'; }}
                    id="exam-create-submit">{creating ? 'Creating...' : 'Create Exam'}</button>
                </div>
              </div>
            </form>
          )}

          {/* Table header */}
          {!loading && exams.length > 0 && (
            <div className="hidden sm:grid items-center" style={{ gridTemplateColumns: '1fr 120px 200px', padding: '12px 24px', color: '#727780', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              <span>Title & Details</span>
              <span>Status</span>
              <span className="text-right">Actions</span>
            </div>
          )}

          {/* Exam list */}
          {loading ? (
            <div className="text-center text-sm" style={{ color: '#727780', paddingTop: '80px' }}>Loading...</div>
          ) : exams.length === 0 ? (
            <div className="text-center rounded-2xl" style={{ paddingTop: '80px', paddingBottom: '80px', border: '1px dashed #e2e2e2' }}>
              <p className="text-sm" style={{ color: '#727780' }}>No exams yet -- create your first assessment</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {exams.map((exam) => (
                <div key={exam._id}>
                  <div className="rounded-2xl transition-all duration-200"
                       style={{ backgroundColor: '#ffffff', border: '1px solid #e2e2e2', padding: '20px 24px' }}
                       onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#5682B1'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(86,130,177,0.08)'; }}
                       onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e2e2'; e.currentTarget.style.boxShadow = 'none'; }}>
                    <div className="grid items-center gap-4" style={{ gridTemplateColumns: '1fr auto auto' }}>
                      <div className="min-w-0">
                        <h3 className="font-semibold truncate" style={{ fontSize: '16px', color: '#1b1b1b', marginBottom: '4px' }}>{exam.title}</h3>
                        <div className="flex items-center gap-3 text-xs" style={{ color: '#727780' }}>
                          <span className="flex items-center gap-1"><BookOpen size={12} /> {exam.questionCount} questions</span>
                          <span className="flex items-center gap-1"><Clock size={12} /> {exam.durationMinutes} min</span>
                        </div>
                      </div>

                      <span className="text-xs font-bold rounded-full shrink-0"
                            style={exam.isVisible
                              ? { backgroundColor: 'rgba(86,130,177,0.1)', color: '#5682B1', border: '1px solid rgba(86,130,177,0.2)', padding: '4px 14px' }
                              : { backgroundColor: '#f3f3f3', color: '#727780', border: '1px solid #e2e2e2', padding: '4px 14px' }}>
                        {exam.isVisible ? 'Live' : 'Draft'}
                      </span>

                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => openTimerEditor(exam)} title="Update Timer" id={`update-timer-${exam._id}`}
                          style={actionBtnStyle}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#5682B1'; e.currentTarget.style.borderColor = '#5682B1'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = '#727780'; e.currentTarget.style.borderColor = '#e2e2e2'; }}>
                          <Clock size={14} /></button>
                        <button onClick={() => handleToggleVisibility(exam._id)} title={exam.isVisible ? 'Hide' : 'Show'} id={`toggle-visibility-${exam._id}`}
                          style={actionBtnStyle}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#5682B1'; e.currentTarget.style.borderColor = '#5682B1'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = '#727780'; e.currentTarget.style.borderColor = '#e2e2e2'; }}>
                          {exam.isVisible ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                        <button onClick={() => navigate(`/admin/exams/${exam._id}`)} title="Edit" id={`edit-exam-${exam._id}`}
                          style={actionBtnStyle}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#5682B1'; e.currentTarget.style.borderColor = '#5682B1'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = '#727780'; e.currentTarget.style.borderColor = '#e2e2e2'; }}>
                          <Edit size={14} /></button>
                        <button onClick={() => navigate(`/admin/exams/${exam._id}/attempts`)} title="Attempts" id={`view-attempts-${exam._id}`}
                          style={actionBtnStyle}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#5682B1'; e.currentTarget.style.borderColor = '#5682B1'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = '#727780'; e.currentTarget.style.borderColor = '#e2e2e2'; }}>
                          <Users size={14} /></button>
                        <button onClick={() => setDeleteTarget(exam._id)} title="Delete" id={`delete-exam-${exam._id}`}
                          style={actionBtnStyle}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#ba1a1a'; e.currentTarget.style.borderColor = '#ba1a1a'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = '#727780'; e.currentTarget.style.borderColor = '#e2e2e2'; }}>
                          <Trash2 size={14} /></button>
                      </div>
                    </div>

                    {timerEditId === exam._id && (
                      <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e2e2e2' }} id={`timer-editor-${exam._id}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Clock size={14} style={{ color: '#5682B1' }} />
                            <span className="text-sm font-semibold" style={{ color: '#42474f' }}>Update Timer</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button type="button" onClick={() => setTimerValue((v) => Math.max(1, v - 5))}
                              style={{ ...actionBtnStyle, width: '32px', height: '32px' }} id={`timer-decrease-${exam._id}`}>
                              <Minus size={12} /></button>
                            <input type="number" value={timerValue} onChange={(e) => setTimerValue(Math.max(1, parseInt(e.target.value) || 1))} min={1}
                              className="text-center text-sm font-bold" id={`timer-input-${exam._id}`}
                              style={{ ...inputBase, width: '70px', padding: '8px' }}
                              onFocus={(e) => { e.target.style.borderColor = '#5682B1'; }}
                              onBlur={(e) => { e.target.style.borderColor = '#e2e2e2'; }} />
                            <button type="button" onClick={() => setTimerValue((v) => v + 5)}
                              style={{ ...actionBtnStyle, width: '32px', height: '32px' }} id={`timer-increase-${exam._id}`}>
                              <Plus size={12} /></button>
                            <span className="text-xs" style={{ color: '#727780' }}>min</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleSaveTimer(exam._id)} disabled={savingTimer || timerValue === exam.durationMinutes}
                              className="flex items-center gap-1.5 text-white text-sm font-semibold transition-all duration-300 disabled:opacity-35"
                              style={{ backgroundColor: '#5682B1', borderRadius: '10px', padding: '8px 16px' }}
                              onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#739EC9'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#5682B1'; }}
                              id={`timer-save-${exam._id}`}><Check size={14} />{savingTimer ? 'Saving...' : 'Save'}</button>
                            <button onClick={closeTimerEditor}
                              className="flex items-center gap-1.5 text-sm font-semibold transition-colors duration-300"
                              style={{ color: '#727780', borderRadius: '10px', padding: '8px 16px', border: '1px solid #e2e2e2' }}
                              id={`timer-cancel-${exam._id}`}><X size={14} />Cancel</button>
                          </div>
                        </div>
                        {timerValue !== exam.durationMinutes && (
                          <p className="text-xs font-semibold" style={{ color: '#5682B1', marginTop: '12px' }}>
                            Changing from {exam.durationMinutes} min to {timerValue} min
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <ConfirmModal isOpen={!!deleteTarget} title="Delete Assessment"
        message="This will permanently delete the exam, all its questions, and all attempts. This action cannot be undone."
        confirmText="Delete" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
