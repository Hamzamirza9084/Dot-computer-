import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save, Edit, AlertCircle, Upload, Download, FileText, Check } from 'lucide-react';
import api from '../../lib/axios';
import ConfirmModal from '../../components/ConfirmModal';

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
  const [csvUploading, setCsvUploading] = useState(false);
  const [csvResult, setCsvResult] = useState(null);
  const [showCsvPanel, setShowCsvPanel] = useState(false);

  const fetchExam = async () => {
    try {
      const res = await api.get(`/admin/exams/${id}`);
      setExam(res.data.data);
      setMetaForm({ title: res.data.data.title, description: res.data.data.description || '', durationMinutes: res.data.data.durationMinutes });
    } catch (err) { setError(err.response?.data?.message || 'Failed to load exam.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchExam(); }, [id]);

  const handleSaveMeta = async (e) => {
    e.preventDefault(); setSavingMeta(true); setError('');
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
    e.preventDefault(); setSavingQuestion(true); setError('');
    try {
      if (editingQuestionId) await api.put(`/admin/questions/${editingQuestionId}`, questionForm);
      else await api.post(`/admin/exams/${id}/questions`, questionForm);
      resetQuestionForm(); fetchExam();
    } catch (err) { setError(err.response?.data?.message || 'Failed to save question.'); }
    finally { setSavingQuestion(false); }
  };

  const handleDeleteQuestion = async () => {
    if (!deleteQuestionTarget) return; setError('');
    try { await api.delete(`/admin/questions/${deleteQuestionTarget}`); setDeleteQuestionTarget(null); fetchExam(); }
    catch (err) { setError(err.response?.data?.message || 'Failed to delete question.'); }
  };

  const updateOption = (index, value) => {
    const newOptions = [...questionForm.options]; newOptions[index] = value;
    setQuestionForm({ ...questionForm, options: newOptions });
  };

  const inputBase = { backgroundColor: '#ffffff', border: '1px solid #e2e2e2', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', color: '#1b1b1b', outline: 'none', width: '100%' };

  const handleCsvUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCsvUploading(true); setCsvResult(null); setError('');
    const formData = new FormData();
    formData.append('csv', file);
    try {
      const res = await api.post(`/admin/exams/${id}/questions/csv`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setCsvResult(res.data.data);
      fetchExam();
    } catch (err) {
      setError(err.response?.data?.message || 'CSV upload failed.');
      if (err.response?.data?.errors) setCsvResult({ errors: err.response.data.errors });
    } finally {
      setCsvUploading(false);
      e.target.value = '';
    }
  };

  const handleDownloadTemplate = () => {
    const csvContent = [
      'question,optionA,optionB,optionC,optionD,correctOption',
      'What is React primarily used for?,Database management,Building user interfaces,Server-side networking,Operating system development,B',
      'Which hook is used for side effects in React?,useState,useEffect,useContext,useReducer,B',
      'What does JSX stand for?,JavaScript XML,JavaScript Extension,Java Syntax Extension,JSON XML Schema,A',
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'quiz_template.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f9f9f9', color: '#727780', fontSize: '14px' }}>Loading...</div>;
  if (!exam) return <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f9f9f9', color: '#727780', fontSize: '14px' }}>Exam not found.</div>;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f9f9f9', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <nav className="border-b flex justify-center" style={{ backgroundColor: '#ffffff', borderColor: '#e2e2e2', padding: '16px 24px', position: 'sticky', top: 0, zIndex: 30 }}>
        <div className="w-full max-w-5xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin/dashboard" className="font-extrabold text-xl tracking-tight" style={{ color: '#1b1b1b' }}>
              .computer<span style={{ color: '#5682B1' }}>Quiz</span>
            </Link>
            <span className="hidden sm:inline text-xs font-semibold border-l" style={{ color: '#727780', borderColor: '#e2e2e2', paddingLeft: '12px' }}>Builder</span>
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
        {error && (
          <div className="flex items-center gap-3 rounded-xl" style={{ padding: '14px 16px', marginBottom: '20px', backgroundColor: 'rgba(186,26,26,0.06)', border: '1px solid rgba(186,26,26,0.15)', color: '#ba1a1a', fontSize: '14px' }}>
            <AlertCircle size={16} className="shrink-0" /><span>{error}</span>
          </div>
        )}

        {/* Exam meta */}
        <div className="border-b" style={{ borderColor: '#e2e2e2', paddingBottom: '24px', marginBottom: '32px' }}>
          {editingMeta ? (
            <form onSubmit={handleSaveMeta} id="edit-meta-form" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input type="text" value={metaForm.title} onChange={(e) => setMetaForm({ ...metaForm, title: e.target.value })}
                className="font-bold" required style={{ ...inputBase, fontSize: '20px' }}
                onFocus={(e) => { e.target.style.borderColor = '#5682B1'; }}
                onBlur={(e) => { e.target.style.borderColor = '#e2e2e2'; }} />
              <textarea value={metaForm.description} onChange={(e) => setMetaForm({ ...metaForm, description: e.target.value })} rows={2}
                style={{ ...inputBase, resize: 'none' }} placeholder="Description..."
                onFocus={(e) => { e.target.style.borderColor = '#5682B1'; }}
                onBlur={(e) => { e.target.style.borderColor = '#e2e2e2'; }} />
              <div className="flex items-center gap-3">
                <input type="number" value={metaForm.durationMinutes} onChange={(e) => setMetaForm({ ...metaForm, durationMinutes: parseInt(e.target.value) || 1 })} min={1}
                  style={{ ...inputBase, width: '100px' }}
                  onFocus={(e) => { e.target.style.borderColor = '#5682B1'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e2e2e2'; }} />
                <span className="text-xs" style={{ color: '#727780' }}>minutes</span>
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={savingMeta}
                  className="text-white text-sm font-semibold transition-all duration-300 disabled:opacity-40"
                  style={{ backgroundColor: '#5682B1', borderRadius: '12px', padding: '10px 20px' }}
                  onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#739EC9'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#5682B1'; }}>
                  {savingMeta ? 'Saving...' : 'Save'}</button>
                <button type="button" onClick={() => { setEditingMeta(false); setMetaForm({ title: exam.title, description: exam.description || '', durationMinutes: exam.durationMinutes }); }}
                  className="text-sm font-semibold transition-colors duration-300"
                  style={{ color: '#727780', padding: '10px 16px', border: '1px solid #e2e2e2', borderRadius: '12px' }}>Cancel</button>
              </div>
            </form>
          ) : (
            <div className="flex items-start justify-between gap-4" id="exam-meta-display">
              <div>
                <h1 className="font-bold" style={{ fontSize: '28px', color: '#1b1b1b' }}>{exam.title}</h1>
                {exam.description && <p className="text-sm" style={{ color: '#727780', marginTop: '4px' }}>{exam.description}</p>}
                <p className="text-xs" style={{ color: '#c2c7d0', marginTop: '8px' }}>{exam.durationMinutes} minutes</p>
              </div>
              <button onClick={() => setEditingMeta(true)}
                className="flex items-center gap-1.5 text-sm font-semibold shrink-0 transition-colors duration-300"
                style={{ color: '#727780', padding: '8px 16px', border: '1px solid #e2e2e2', borderRadius: '10px' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#5682B1'; e.currentTarget.style.color = '#5682B1'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e2e2'; e.currentTarget.style.color = '#727780'; }}>
                <Edit size={13} /> Edit Details
              </button>
            </div>
          )}
        </div>

        {/* Questions header */}
        <div className="flex items-center justify-between" style={{ marginBottom: '24px' }}>
          <div>
            <h2 className="font-bold" style={{ fontSize: '18px', color: '#1b1b1b' }}>Questions</h2>
            <p className="text-xs" style={{ color: '#727780', marginTop: '2px' }}>{exam.questions ? exam.questions.length : 0} total</p>
          </div>
          {!showQuestionForm && (
            <div className="flex items-center gap-2">
              <button onClick={() => { resetQuestionForm(); setShowQuestionForm(true); }}
                className="flex items-center gap-2 text-white text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
                style={{ backgroundColor: '#5682B1', borderRadius: '12px', padding: '10px 20px' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#739EC9'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#5682B1'; }}
                id="add-question-btn">
                <Plus size={15} /> Add Question
              </button>
              <button onClick={() => setShowCsvPanel(!showCsvPanel)}
                className="flex items-center gap-2 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
                style={{ color: '#5682B1', borderRadius: '12px', padding: '10px 20px', border: '1px solid #5682B1' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(86,130,177,0.06)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                id="csv-upload-btn">
                <Upload size={15} /> CSV Upload
              </button>
            </div>
          )}
        </div>

        {/* CSV Upload Panel */}
        {showCsvPanel && (
          <div className="rounded-2xl" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e2e2', padding: '28px', marginBottom: '24px' }} id="csv-upload-panel">
            <div className="flex items-center gap-3" style={{ marginBottom: '20px' }}>
              <div className="flex items-center justify-center" style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(86,130,177,0.08)' }}>
                <FileText size={18} style={{ color: '#5682B1' }} />
              </div>
              <div>
                <h3 className="font-semibold" style={{ fontSize: '16px', color: '#1b1b1b' }}>Bulk Upload via CSV</h3>
                <p className="text-xs" style={{ color: '#727780' }}>Upload a CSV file to add multiple questions at once</p>
              </div>
            </div>

            <div className="rounded-xl" style={{ backgroundColor: '#f9f9f9', border: '1px dashed #e2e2e2', padding: '20px', marginBottom: '16px' }}>
              <p className="text-sm font-semibold" style={{ color: '#42474f', marginBottom: '8px' }}>Required CSV columns:</p>
              <code className="text-xs" style={{ color: '#5682B1', display: 'block', marginBottom: '12px', fontFamily: 'monospace' }}>
                question, optionA, optionB, optionC, optionD, correctOption
              </code>
              <p className="text-xs" style={{ color: '#727780', marginBottom: '16px' }}>
                The <strong>correctOption</strong> column should contain A, B, C, or D (the letter of the correct answer).
              </p>
              <button onClick={handleDownloadTemplate}
                className="inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-300"
                style={{ color: '#5682B1' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#739EC9'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#5682B1'; }}
                id="download-template-btn">
                <Download size={14} /> Download Demo CSV Template
              </button>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-white text-sm font-semibold transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
                style={{ backgroundColor: '#5682B1', borderRadius: '12px', padding: '10px 20px', opacity: csvUploading ? 0.5 : 1 }}>
                <Upload size={15} /> {csvUploading ? 'Uploading...' : 'Choose CSV File'}
                <input type="file" accept=".csv" onChange={handleCsvUpload} disabled={csvUploading}
                  className="hidden" id="csv-file-input" />
              </label>
              <button onClick={() => { setShowCsvPanel(false); setCsvResult(null); }}
                className="text-sm font-semibold transition-colors duration-300"
                style={{ color: '#727780', padding: '10px 16px', border: '1px solid #e2e2e2', borderRadius: '12px' }}>Close</button>
            </div>

            {csvResult && (
              <div className="rounded-xl" style={{ marginTop: '16px', padding: '16px', backgroundColor: csvResult.added ? 'rgba(86,130,177,0.06)' : 'rgba(186,26,26,0.04)', border: `1px solid ${csvResult.added ? 'rgba(86,130,177,0.2)' : 'rgba(186,26,26,0.15)'}` }}>
                {csvResult.added && (
                  <div className="flex items-center gap-2" style={{ marginBottom: csvResult.errors ? '8px' : 0 }}>
                    <Check size={16} style={{ color: '#5682B1' }} />
                    <span className="text-sm font-semibold" style={{ color: '#5682B1' }}>
                      Successfully added {csvResult.added} questions ({csvResult.total} total)
                    </span>
                  </div>
                )}
                {csvResult.errors && csvResult.errors.length > 0 && (
                  <div style={{ marginTop: '8px' }}>
                    <p className="text-xs font-semibold" style={{ color: '#ba1a1a', marginBottom: '4px' }}>Errors:</p>
                    {csvResult.errors.map((err, i) => (
                      <p key={i} className="text-xs" style={{ color: '#727780' }}>{err}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Question form */}
        {showQuestionForm && (
          <form onSubmit={handleSaveQuestion} className="rounded-2xl" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e2e2', padding: '28px', marginBottom: '24px' }} id="question-form">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="block text-sm font-semibold" style={{ color: '#42474f', marginBottom: '8px' }}>Question</label>
                <textarea value={questionForm.questionText} onChange={(e) => setQuestionForm({ ...questionForm, questionText: e.target.value })} required rows={3}
                  style={{ ...inputBase, resize: 'none' }} placeholder="Enter your question..." id="question-text-input"
                  onFocus={(e) => { e.target.style.borderColor = '#5682B1'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e2e2e2'; }} />
              </div>
              <div>
                <label className="block text-sm font-semibold" style={{ color: '#42474f', marginBottom: '8px' }}>Options -- select the correct answer</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {questionForm.options.map((option, idx) => {
                    const letter = String.fromCharCode(65 + idx);
                    const isCorrect = questionForm.correctOptionIndex === idx;
                    return (
                      <div key={idx} className="flex items-center gap-3">
                        <button type="button" onClick={() => setQuestionForm({ ...questionForm, correctOptionIndex: idx })}
                          className="shrink-0 flex items-center justify-center font-bold text-xs rounded-full transition-all duration-200"
                          style={{ width: '36px', height: '36px',
                            backgroundColor: isCorrect ? '#5682B1' : '#f3f3f3',
                            color: isCorrect ? '#ffffff' : '#727780',
                            border: isCorrect ? '2px solid #5682B1' : '2px solid #e2e2e2' }}
                          id={`correct-option-${idx}`}>{letter}</button>
                        <input type="text" value={option} onChange={(e) => updateOption(idx, e.target.value)} required
                          style={inputBase} placeholder={`Option ${letter}`} id={`option-input-${idx}`}
                          onFocus={(e) => { e.target.style.borderColor = '#5682B1'; }}
                          onBlur={(e) => { e.target.style.borderColor = '#e2e2e2'; }} />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex gap-3 justify-end" style={{ paddingTop: '8px' }}>
                <button type="button" onClick={resetQuestionForm}
                  className="text-sm font-semibold" style={{ color: '#727780', padding: '10px 20px', border: '1px solid #e2e2e2', borderRadius: '12px' }}>Cancel</button>
                <button type="submit" disabled={savingQuestion}
                  className="flex items-center gap-2 text-white text-sm font-semibold transition-all duration-300 disabled:opacity-40"
                  style={{ backgroundColor: '#5682B1', borderRadius: '12px', padding: '10px 24px' }}
                  onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#739EC9'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#5682B1'; }}
                  id="save-question-btn"><Save size={14} />{savingQuestion ? 'Saving...' : editingQuestionId ? 'Update' : 'Save'}</button>
              </div>
            </div>
          </form>
        )}

        {/* Questions list */}
        {(!exam.questions || exam.questions.length === 0) && !showQuestionForm ? (
          <div className="text-center rounded-2xl" style={{ paddingTop: '80px', paddingBottom: '80px', border: '1px dashed #e2e2e2' }}>
            <p className="text-sm" style={{ color: '#727780' }}>No questions yet -- add your first question</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {exam.questions && exam.questions.map((q, index) => (
              <div key={q._id} className="rounded-2xl transition-all duration-200"
                   style={{ backgroundColor: '#ffffff', border: '1px solid #e2e2e2', padding: '20px 24px' }}
                   onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#5682B1'; }}
                   onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e2e2'; }}>
                <div className="flex items-start gap-4">
                  <span style={{ color: '#c2c7d0', fontSize: '12px', fontWeight: 700, marginTop: '2px', width: '24px', textAlign: 'right', flexShrink: 0 }}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm" style={{ color: '#1b1b1b', lineHeight: '1.6', marginBottom: '16px' }}>{q.questionText}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, optIdx) => {
                        const letter = String.fromCharCode(65 + optIdx);
                        const isCorrect = optIdx === q.correctOptionIndex;
                        return (
                          <div key={optIdx} className="flex items-center gap-2 border rounded-xl"
                               style={{ padding: '8px 14px', fontSize: '13px',
                                 borderColor: isCorrect ? 'rgba(86,130,177,0.25)' : '#e2e2e2',
                                 backgroundColor: isCorrect ? 'rgba(86,130,177,0.04)' : '#ffffff',
                                 color: isCorrect ? '#1b1b1b' : '#42474f' }}>
                            <span className="flex items-center justify-center shrink-0 font-bold rounded-md"
                                  style={{ width: '22px', height: '22px', fontSize: '10px',
                                    backgroundColor: isCorrect ? '#5682B1' : '#f3f3f3',
                                    color: isCorrect ? '#fff' : '#727780' }}>{letter}</span>
                            <span className="truncate">{opt}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => handleEditQuestion(q)} title="Edit" id={`edit-question-${q._id}`}
                      className="transition-colors duration-200 rounded-lg" style={{ padding: '6px', color: '#c2c7d0' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#5682B1'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = '#c2c7d0'; }}><Edit size={14} /></button>
                    <button onClick={() => setDeleteQuestionTarget(q._id)} title="Delete" id={`delete-question-${q._id}`}
                      className="transition-colors duration-200 rounded-lg" style={{ padding: '6px', color: '#c2c7d0' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#ba1a1a'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = '#c2c7d0'; }}><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </main>

      <ConfirmModal isOpen={!!deleteQuestionTarget} title="Delete Question"
        message="This question will be permanently removed from the exam."
        confirmText="Delete" onConfirm={handleDeleteQuestion} onCancel={() => setDeleteQuestionTarget(null)} />
    </div>
  );
}
