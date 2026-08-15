import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save, Edit, AlertCircle } from 'lucide-react';
import api from '../../lib/axios';
import ConfirmModal from '../../components/ConfirmModal';
import PageLayout from '../../components/PageLayout';

export default function ExamBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingMeta, setEditingMeta] = useState(false);
  const [metaForm, setMetaForm] = useState({ title: '', description: '', durationMinutes: 30 });
  const [savingMeta, setSavingMeta] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [questionForm, setQuestionForm] = useState({ questionText: '', options: ['', '', '', ''], correctOptionIndex: 0 });
  const [savingQuestion, setSavingQuestion] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [deleteQuestionTarget, setDeleteQuestionTarget] = useState(null);

  const fetchExam = async () => {
    try {
      const res = await api.get(`/admin/exams/${id}`);
      setExam(res.data.data);
      setMetaForm({ title: res.data.data.title, description: res.data.data.description || '', durationMinutes: res.data.data.durationMinutes });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load exam.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExam(); }, [id]);

  const handleSaveMeta = async (e) => {
    e.preventDefault();
    setSavingMeta(true); setError('');
    try { await api.put(`/admin/exams/${id}`, metaForm); setEditingMeta(false); fetchExam(); }
    catch (err) { setError(err.response?.data?.message || 'Failed to update exam.'); }
    finally { setSavingMeta(false); }
  };

  const resetQuestionForm = () => {
    setQuestionForm({ questionText: '', options: ['', '', '', ''], correctOptionIndex: 0 });
    setEditingQuestionId(null); setShowQuestionForm(false);
  };

  const handleEditQuestion = (question) => {
    setQuestionForm({ questionText: question.questionText, options: [...question.options], correctOptionIndex: question.correctOptionIndex });
    setEditingQuestionId(question._id); setShowQuestionForm(true);
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    setSavingQuestion(true); setError('');
    try {
      if (editingQuestionId) await api.put(`/admin/questions/${editingQuestionId}`, questionForm);
      else await api.post(`/admin/exams/${id}/questions`, questionForm);
      resetQuestionForm(); fetchExam();
    } catch (err) { setError(err.response?.data?.message || 'Failed to save question.'); }
    finally { setSavingQuestion(false); }
  };

  const handleDeleteQuestion = async () => {
    if (!deleteQuestionTarget) return;
    setError('');
    try { await api.delete(`/admin/questions/${deleteQuestionTarget}`); setDeleteQuestionTarget(null); fetchExam(); }
    catch (err) { setError(err.response?.data?.message || 'Failed to delete question.'); }
  };

  const updateOption = (index, value) => {
    const newOptions = [...questionForm.options];
    newOptions[index] = value;
    setQuestionForm({ ...questionForm, options: newOptions });
  };

  if (loading) {
    return <PageLayout><div className="flex-1 flex items-center justify-center text-white/30 font-mono text-sm uppercase tracking-widest">Loading...</div></PageLayout>;
  }
  if (!exam) {
    return <PageLayout><div className="flex-1 flex items-center justify-center text-white/30 font-mono text-sm uppercase tracking-widest">Exam not found.</div></PageLayout>;
  }

  return (
    <PageLayout>
      <nav className="border-b border-white/10 sticky top-0 z-30 bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/admin/dashboard" className="font-bold text-lg sm:text-2xl tracking-tight text-white">.computer Quiz</Link>
            <span className="hidden sm:inline-block text-purple-300/40 text-xs font-mono uppercase tracking-widest border-l border-white/10 pl-3">Builder</span>
          </div>
          <button onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-mono tracking-widest uppercase text-white/40 hover:text-white transition-colors"
            id="back-to-dashboard">
            <ArrowLeft size={14} /> <span className="hidden sm:inline">Dashboard</span>
          </button>
        </div>
      </nav>

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-10 w-full">
        {error && (
          <div className="flex items-center gap-3 p-3 sm:p-4 mb-6 border border-red-500/20 bg-red-500/5 text-red-300/80 text-xs sm:text-sm rounded-sm">
            <AlertCircle size={16} className="shrink-0" /><span>{error}</span>
          </div>
        )}

        {/* Exam Meta */}
        <div className="mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-white/10">
          {editingMeta ? (
            <form onSubmit={handleSaveMeta} className="space-y-3 sm:space-y-4" id="edit-meta-form">
              <input type="text" value={metaForm.title} onChange={(e) => setMetaForm({ ...metaForm, title: e.target.value })}
                className="w-full text-lg sm:text-xl font-bold bg-white/[0.03] border border-white/15 px-4 py-3 text-white focus:outline-none focus:border-purple-400/50 transition-colors rounded-sm" required />
              <textarea value={metaForm.description} onChange={(e) => setMetaForm({ ...metaForm, description: e.target.value })} rows={2}
                className="w-full text-sm bg-white/[0.03] border border-white/15 px-4 py-3 text-white/70 focus:outline-none focus:border-purple-400/50 transition-colors resize-none rounded-sm" placeholder="Description..." />
              <div className="flex items-center gap-3">
                <input type="number" value={metaForm.durationMinutes} onChange={(e) => setMetaForm({ ...metaForm, durationMinutes: parseInt(e.target.value) || 1 })} min={1}
                  className="w-24 text-sm bg-white/[0.03] border border-white/15 px-4 py-2 text-white focus:outline-none focus:border-purple-400/50 transition-colors rounded-sm" />
                <span className="text-[11px] text-white/30 font-mono uppercase tracking-widest">minutes</span>
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={savingMeta}
                  className="px-4 py-2 text-[11px] sm:text-xs font-mono font-semibold tracking-widest uppercase bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-500 hover:to-purple-400 disabled:opacity-40 transition-all rounded-sm">
                  {savingMeta ? 'Saving...' : 'Save'}
                </button>
                <button type="button" onClick={() => { setEditingMeta(false); setMetaForm({ title: exam.title, description: exam.description || '', durationMinutes: exam.durationMinutes }); }}
                  className="px-4 py-2 text-[11px] sm:text-xs font-mono tracking-widest uppercase text-white/40 hover:text-white border border-white/10 transition-all rounded-sm">
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-start justify-between gap-4 group" id="exam-meta-display">
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight">{exam.title}</h1>
                {exam.description && <p className="text-white/35 text-xs sm:text-sm mt-1">{exam.description}</p>}
                <p className="text-white/25 text-[10px] sm:text-[11px] mt-2 font-mono uppercase tracking-widest">{exam.durationMinutes} minutes</p>
              </div>
              <button onClick={() => setEditingMeta(true)} className="flex items-center gap-1.5 px-3 py-1.5 border border-white/10 hover:border-purple-400/30 text-white/40 hover:text-purple-300 transition-all rounded-sm text-[11px] font-mono uppercase tracking-widest shrink-0">
                <Edit size={12} /> Edit Details
              </button>
            </div>
          )}
        </div>

        {/* Questions header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="text-sm font-bold tracking-tight uppercase">Questions</h2>
            <p className="text-white/25 text-[10px] sm:text-[11px] font-mono mt-0.5">{exam.questions ? exam.questions.length : 0} total</p>
          </div>
          {!showQuestionForm && (
            <button onClick={() => { resetQuestionForm(); setShowQuestionForm(true); }}
              className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-mono font-semibold tracking-widest uppercase bg-gradient-to-r from-purple-600 to-purple-500 text-white px-3 sm:px-4 py-2 sm:py-2.5 hover:from-purple-500 hover:to-purple-400 transition-all rounded-sm"
              id="add-question-btn">
              <Plus size={14} strokeWidth={2.5} /> <span className="hidden sm:inline">Add Question</span><span className="sm:hidden">Add</span>
            </button>
          )}
        </div>

        {/* Question Form */}
        {showQuestionForm && (
          <form onSubmit={handleSaveQuestion} className="border border-white/15 bg-white/[0.02] p-4 sm:p-6 mb-6 sm:mb-8 space-y-4 sm:space-y-5 rounded-sm" id="question-form">
            <div>
              <label className="block text-[11px] sm:text-xs font-mono text-white/40 mb-2 uppercase tracking-widest">Question</label>
              <textarea value={questionForm.questionText} onChange={(e) => setQuestionForm({ ...questionForm, questionText: e.target.value })} required rows={3}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/15 text-white placeholder-white/20 focus:outline-none focus:border-purple-400/50 transition-colors resize-none rounded-sm"
                placeholder="Enter your question..." id="question-text-input" />
            </div>
            <div className="space-y-2.5 sm:space-y-3">
              <label className="block text-[11px] sm:text-xs font-mono text-white/40 uppercase tracking-widest">Options — select the correct answer</label>
              {questionForm.options.map((option, idx) => {
                const letter = String.fromCharCode(65 + idx);
                return (
                  <div key={idx} className="flex items-center gap-2 sm:gap-3">
                    <button type="button" onClick={() => setQuestionForm({ ...questionForm, correctOptionIndex: idx })}
                      className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center font-mono text-[11px] sm:text-xs transition-all rounded-sm shrink-0 border ${
                        questionForm.correctOptionIndex === idx
                          ? 'bg-purple-500 text-white font-semibold border-purple-400'
                          : 'border-white/20 text-white/30 hover:border-purple-400/40 hover:text-white/60'
                      }`} id={`correct-option-${idx}`}>
                      {letter}
                    </button>
                    <input type="text" value={option} onChange={(e) => updateOption(idx, e.target.value)} required
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-white/[0.03] border border-white/15 text-white placeholder-white/20 focus:outline-none focus:border-purple-400/50 transition-colors rounded-sm text-sm"
                      placeholder={`Option ${letter}`} id={`option-input-${idx}`} />
                  </div>
                );
              })}
            </div>
            <div className="flex gap-3 justify-end pt-1 sm:pt-2">
              <button type="button" onClick={resetQuestionForm}
                className="px-3 sm:px-4 py-2 text-[11px] sm:text-xs font-mono tracking-widest uppercase text-white/40 hover:text-white border border-white/10 hover:border-white/30 transition-all rounded-sm">
                Cancel
              </button>
              <button type="submit" disabled={savingQuestion}
                className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 text-[11px] sm:text-xs font-mono font-semibold tracking-widest uppercase bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-500 hover:to-purple-400 disabled:opacity-40 transition-all rounded-sm"
                id="save-question-btn">
                <Save size={12} /> {savingQuestion ? 'Saving...' : editingQuestionId ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        )}

        {/* Questions List */}
        {(!exam.questions || exam.questions.length === 0) && !showQuestionForm ? (
          <div className="text-center py-16 sm:py-20 border border-dashed border-white/10 rounded-sm">
            <p className="text-white/30 text-[11px] sm:text-xs font-mono uppercase tracking-widest">No questions yet — add your first question</p>
          </div>
        ) : (
          <div className="space-y-2.5 sm:space-y-3">
            {exam.questions && exam.questions.map((q, index) => (
              <div key={q._id} className="border border-white/10 bg-white/[0.02] p-4 sm:p-6 hover:border-purple-400/20 transition-colors duration-200 rounded-sm">
                <div className="flex items-start gap-3 sm:gap-4">
                  <span className="text-white/20 text-[11px] sm:text-xs font-mono mt-0.5 shrink-0 w-5 sm:w-6 text-right">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/80 font-medium text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">{q.questionText}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                      {q.options.map((opt, optIdx) => {
                        const letter = String.fromCharCode(65 + optIdx);
                        return (
                          <div key={optIdx} className={`text-[11px] sm:text-xs px-3 py-2 sm:py-2.5 border flex items-center gap-2 rounded-sm ${
                            optIdx === q.correctOptionIndex
                              ? 'border-purple-400/30 text-white/80 bg-purple-500/5'
                              : 'border-white/8 text-white/35'
                          }`}>
                            <span className={`font-mono shrink-0 w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-sm text-[9px] sm:text-[10px] ${
                              optIdx === q.correctOptionIndex ? 'bg-purple-500 text-white font-semibold' : 'text-white/20'
                            }`}>{letter}</span>
                            <span className="truncate">{opt}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => handleEditQuestion(q)} className="p-1.5 sm:p-2 text-white/25 hover:text-purple-300 transition-colors rounded-sm" title="Edit" id={`edit-question-${q._id}`}><Edit size={13} /></button>
                    <button onClick={() => setDeleteQuestionTarget(q._id)} className="p-1.5 sm:p-2 text-white/25 hover:text-red-400 transition-colors rounded-sm" title="Delete" id={`delete-question-${q._id}`}><Trash2 size={13} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <ConfirmModal isOpen={!!deleteQuestionTarget} title="Delete Question"
        message="This question will be permanently removed from the exam."
        confirmText="Delete" onConfirm={handleDeleteQuestion} onCancel={() => setDeleteQuestionTarget(null)} />
    </PageLayout>
  );
}
