import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  adminGetPastPaper,
  adminGetPastPaperMCQQuestions,
  adminCreatePastPaperMCQQuestion,
  adminUpdatePastPaperMCQQuestion,
  adminDeletePastPaperMCQQuestion,
  adminGetPastPaperEssayQuestions,
  adminCreatePastPaperEssayQuestion,
  adminUpdatePastPaperEssayQuestion,
  adminDeletePastPaperEssayQuestion,
  adminCreatePastPaperEssaySubQuestion,
  adminUpdatePastPaperEssaySubQuestion,
  adminDeletePastPaperEssaySubQuestion,
} from '../../api/api'

const emptyMCQForm = {
  question_text: '',
  option_a: '',
  option_b: '',
  option_c: '',
  option_d: '',
  option_e: '',
  correct_answer: 'A',
  explanation: '',
  ordering: 0,
  is_active: true,
}

const emptyEssayForm = {
  question_text: '',
  answer: '',
  marks: '',
  ordering: 0,
  is_active: true,
}

const emptySubForm = { text: '', answer: '', marks: '', ordering: 0 }

export default function AdminPastPaperQuestions() {
  const { paperId } = useParams()
  const navigate = useNavigate()

  const [paper, setPaper] = useState(null)
  const [questions, setQuestions] = useState([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  // MCQ form state
  const [mcqForm, setMcqForm] = useState(emptyMCQForm)
  const [editingMcqId, setEditingMcqId] = useState(null)

  // Essay form state
  const [essayForm, setEssayForm] = useState(emptyEssayForm)
  const [editingEssayId, setEditingEssayId] = useState(null)

  // Sub-question inline state per essay question
  const [subFormFor, setSubFormFor] = useState(null) // essay question id currently adding a sub-q
  const [subForm, setSubForm] = useState(emptySubForm)
  const [editingSubId, setEditingSubId] = useState(null)
  const [expandedEssayId, setExpandedEssayId] = useState(null)

  useEffect(() => { loadData() }, [paperId])

  async function loadData() {
    setLoading(true)
    try {
      const pRes = await adminGetPastPaper(paperId)
      setPaper(pRes.data)

      if (pRes.data.is_mcq) {
        const qRes = await adminGetPastPaperMCQQuestions(paperId)
        setQuestions(qRes.data)
      } else {
        const qRes = await adminGetPastPaperEssayQuestions(paperId)
        setQuestions(qRes.data)
      }
    } catch (err) {
      setError(JSON.stringify(err.response?.data || 'Could not load data'))
    } finally {
      setLoading(false)
    }
  }

  // ── MCQ handlers ──────────────────────────────────────────────────────────

  function setMcq(field, value) {
    setMcqForm(prev => ({ ...prev, [field]: value }))
  }

  function startEditMcq(q) {
    setEditingMcqId(q.id)
    setMcqForm({
      question_text: q.question_text,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      option_e: q.option_e || '',
      correct_answer: q.correct_answer,
      explanation: q.explanation || '',
      ordering: q.ordering,
      is_active: q.is_active,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEditMcq() {
    setEditingMcqId(null)
    setMcqForm(emptyMCQForm)
    setError('')
  }

  async function submitMcq(e) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const payload = { ...mcqForm, ordering: Number(mcqForm.ordering) }
      if (editingMcqId) {
        await adminUpdatePastPaperMCQQuestion(editingMcqId, payload)
      } else {
        await adminCreatePastPaperMCQQuestion(paperId, payload)
      }
      setMcqForm(emptyMCQForm)
      setEditingMcqId(null)
      await loadData()
    } catch (err) {
      setError(JSON.stringify(err.response?.data || 'Save failed'))
    } finally {
      setSaving(false)
    }
  }

  async function removeMcq(id) {
    if (!confirm('Delete this MCQ question?')) return
    try {
      await adminDeletePastPaperMCQQuestion(id)
      if (editingMcqId === id) cancelEditMcq()
      await loadData()
    } catch (err) {
      setError(JSON.stringify(err.response?.data || 'Delete failed'))
    }
  }

  // ── Essay handlers ───────────────────────────────────────────────────────

  function setEssay(field, value) {
    setEssayForm(prev => ({ ...prev, [field]: value }))
  }

  function startEditEssay(q) {
    setEditingEssayId(q.id)
    setEssayForm({
      question_text: q.question_text,
      answer: q.answer || '',
      marks: q.marks ?? '',
      ordering: q.ordering,
      is_active: q.is_active,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEditEssay() {
    setEditingEssayId(null)
    setEssayForm(emptyEssayForm)
    setError('')
  }

  async function submitEssay(e) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const payload = {
        ...essayForm,
        ordering: Number(essayForm.ordering),
        marks: essayForm.marks === '' ? null : Number(essayForm.marks),
      }
      if (editingEssayId) {
        await adminUpdatePastPaperEssayQuestion(editingEssayId, payload)
      } else {
        await adminCreatePastPaperEssayQuestion(paperId, payload)
      }
      setEssayForm(emptyEssayForm)
      setEditingEssayId(null)
      await loadData()
    } catch (err) {
      setError(JSON.stringify(err.response?.data || 'Save failed'))
    } finally {
      setSaving(false)
    }
  }

  async function removeEssay(id) {
    if (!confirm('Delete this essay question and all its sub-questions?')) return
    try {
      await adminDeletePastPaperEssayQuestion(id)
      if (editingEssayId === id) cancelEditEssay()
      await loadData()
    } catch (err) {
      setError(JSON.stringify(err.response?.data || 'Delete failed'))
    }
  }

  // ── Sub-question handlers ────────────────────────────────────────────────

  function setSub(field, value) {
    setSubForm(prev => ({ ...prev, [field]: value }))
  }

  function openSubForm(essayQId) {
    setSubFormFor(essayQId)
    setSubForm(emptySubForm)
    setEditingSubId(null)
  }

  function startEditSub(essayQId, sub) {
    setSubFormFor(essayQId)
    setEditingSubId(sub.id)
    setSubForm({
      text: sub.text,
      answer: sub.answer || '',
      marks: sub.marks ?? '',
      ordering: sub.ordering,
    })
  }

  function closeSubForm() {
    setSubFormFor(null)
    setSubForm(emptySubForm)
    setEditingSubId(null)
  }

  async function submitSub(e, essayQId) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const payload = {
        ...subForm,
        ordering: Number(subForm.ordering),
        marks: subForm.marks === '' ? null : Number(subForm.marks),
      }
      if (editingSubId) {
        await adminUpdatePastPaperEssaySubQuestion(editingSubId, payload)
      } else {
        await adminCreatePastPaperEssaySubQuestion(essayQId, payload)
      }
      closeSubForm()
      await loadData()
    } catch (err) {
      setError(JSON.stringify(err.response?.data || 'Save failed'))
    } finally {
      setSaving(false)
    }
  }

  async function removeSub(id) {
    if (!confirm('Delete this sub-question?')) return
    try {
      await adminDeletePastPaperEssaySubQuestion(id)
      await loadData()
    } catch (err) {
      setError(JSON.stringify(err.response?.data || 'Delete failed'))
    }
  }

  if (loading) {
    return (
      <>
        <Fonts />
        <main style={s.page}>
          <div style={s.loadingWrap}>
            <div style={s.spinner} />
            <p style={{ color: '#7A9A7A', fontSize: '0.9rem' }}>Loading paper…</p>
          </div>
        </main>
      </>
    )
  }

  const isMcq = paper?.is_mcq

  return (
    <>
      <Fonts />
      <main style={s.page}>
        <Header />

        <div style={s.container}>
          {/* Title */}
          <div style={s.titleRow}>
            <div>
              <p style={{ ...s.eyebrow, color: isMcq ? '#3B82F6' : '#7C3AED' }}>
                Admin · {paper?.year} · {isMcq ? 'MCQ Paper' : 'Essay Paper'}
              </p>
              <h1 style={s.h1}>{paper?.part_label || `Part ${paper?.part_number}`}</h1>
            </div>
            <BackBtn onClick={() => navigate('/admin/past-papers')} />
          </div>

          {error && <ErrorBanner msg={error} onClose={() => setError('')} />}

          {isMcq ? (
            <MCQSection
              mcqForm={mcqForm}
              setMcq={setMcq}
              editingMcqId={editingMcqId}
              submitMcq={submitMcq}
              cancelEditMcq={cancelEditMcq}
              saving={saving}
              questions={questions}
              startEditMcq={startEditMcq}
              removeMcq={removeMcq}
            />
          ) : (
            <EssaySection
              essayForm={essayForm}
              setEssay={setEssay}
              editingEssayId={editingEssayId}
              submitEssay={submitEssay}
              cancelEditEssay={cancelEditEssay}
              saving={saving}
              questions={questions}
              startEditEssay={startEditEssay}
              removeEssay={removeEssay}
              expandedEssayId={expandedEssayId}
              setExpandedEssayId={setExpandedEssayId}
              subFormFor={subFormFor}
              subForm={subForm}
              setSub={setSub}
              openSubForm={openSubForm}
              startEditSub={startEditSub}
              closeSubForm={closeSubForm}
              submitSub={submitSub}
              removeSub={removeSub}
              editingSubId={editingSubId}
            />
          )}
        </div>

        <Footer />
      </main>
    </>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   MCQ SECTION
════════════════════════════════════════════════════════════════════════ */

function MCQSection({
  mcqForm, setMcq, editingMcqId, submitMcq, cancelEditMcq, saving,
  questions, startEditMcq, removeMcq,
}) {
  return (
    <>
      <form onSubmit={submitMcq} style={s.formCard}>
        <SectionTitle icon="📋" title={editingMcqId ? 'Edit MCQ Question' : 'Add MCQ Question'} />

        <FormField label="Question Text">
          <textarea
            rows={3}
            style={{ ...s.input, resize: 'vertical' }}
            value={mcqForm.question_text}
            onChange={e => setMcq('question_text', e.target.value)}
            placeholder="Type the question here. Use $...$ for LaTeX math."
            required
          />
        </FormField>

        <div style={s.grid2}>
          <FormField label="Option A">
            <input style={s.input} value={mcqForm.option_a} onChange={e => setMcq('option_a', e.target.value)} required />
          </FormField>
          <FormField label="Option B">
            <input style={s.input} value={mcqForm.option_b} onChange={e => setMcq('option_b', e.target.value)} required />
          </FormField>
          <FormField label="Option C">
            <input style={s.input} value={mcqForm.option_c} onChange={e => setMcq('option_c', e.target.value)} required />
          </FormField>
          <FormField label="Option D">
            <input style={s.input} value={mcqForm.option_d} onChange={e => setMcq('option_d', e.target.value)} required />
          </FormField>
          <FormField label="Option E (optional)">
            <input style={s.input} value={mcqForm.option_e} onChange={e => setMcq('option_e', e.target.value)} placeholder="Leave blank if only 4 options" />
          </FormField>

          <FormField label="Correct Answer">
            <select style={s.input} value={mcqForm.correct_answer} onChange={e => setMcq('correct_answer', e.target.value)}>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="E" disabled={!mcqForm.option_e}>E{!mcqForm.option_e ? ' (add option E first)' : ''}</option>
            </select>
          </FormField>

          <FormField label="Ordering">
            <input type="number" style={s.input} value={mcqForm.ordering} onChange={e => setMcq('ordering', e.target.value)} min={0} />
          </FormField>
        </div>

        <FormField label="Explanation (optional)">
          <textarea
            rows={3}
            style={{ ...s.input, resize: 'vertical' }}
            value={mcqForm.explanation}
            onChange={e => setMcq('explanation', e.target.value)}
            placeholder="Explain why the correct answer is correct…"
          />
        </FormField>

        <div style={s.checkRow}>
          <input
            type="checkbox" id="mcq_active"
            checked={mcqForm.is_active}
            onChange={e => setMcq('is_active', e.target.checked)}
            style={{ accentColor: '#1D4ED8', width: 15, height: 15 }}
          />
          <label htmlFor="mcq_active" style={s.checkLabel}>Active (visible to students)</label>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button type="submit" style={s.btnPrimary} disabled={saving}
            onMouseEnter={e => { if (!saving) e.currentTarget.style.opacity = '0.88' }}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            {saving ? 'Saving…' : editingMcqId ? '✓ Update Question' : '+ Add Question'}
          </button>
          {editingMcqId && (
            <button type="button" style={s.cancelBtn} onClick={cancelEditMcq}
              onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'}
              onMouseLeave={e => e.currentTarget.style.background = 'white'}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <section style={s.listCard}>
        <SectionTitle icon="❓" title={`Questions (${questions.length})`} />

        {questions.length === 0 ? (
          <Empty text="No MCQ questions added yet." />
        ) : (
          <div style={s.cardList}>
            {questions
              .slice()
              .sort((a, b) => a.ordering - b.ordering)
              .map((q, i) => {
                const options = [
                  ['A', q.option_a], ['B', q.option_b],
                  ['C', q.option_c], ['D', q.option_d],
                ]
                if (q.option_e) options.push(['E', q.option_e])

                return (
                  <div key={q.id} style={s.questionCard}>
                    <div style={s.questionCardHeader}>
                      <span style={s.qNumBadge}>{q.ordering || i + 1}</span>
                      <p style={s.qText}>{q.question_text}</p>
                      <div style={s.actionGroup}>
                        <button onClick={() => startEditMcq(q)} style={s.editBtn}
                          onMouseEnter={e => { e.currentTarget.style.background = '#EFF6FF'; e.currentTarget.style.color = '#1D4ED8' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#3B82F6' }}
                        >
                          Edit
                        </button>
                        <button onClick={() => removeMcq(q.id)} style={s.deleteBtn}
                          onMouseEnter={e => { e.currentTarget.style.background = '#FEE2E2'; e.currentTarget.style.color = '#991B1B' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#EF4444' }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div style={s.optionsGrid}>
                      {options.map(([letter, text]) => (
                        <div
                          key={letter}
                          style={{
                            ...s.optionPill,
                            ...(letter === q.correct_answer ? s.optionPillCorrect : {}),
                          }}
                        >
                          <strong>{letter}.</strong> {text}
                        </div>
                      ))}
                    </div>

                    {q.explanation && (
                      <p style={s.explanationText}><strong>Explanation:</strong> {q.explanation}</p>
                    )}

                    {!q.is_active && <span style={s.hiddenTag}>Hidden</span>}
                  </div>
                )
              })}
          </div>
        )}
      </section>
    </>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   ESSAY SECTION
════════════════════════════════════════════════════════════════════════ */

function EssaySection({
  essayForm, setEssay, editingEssayId, submitEssay, cancelEditEssay, saving,
  questions, startEditEssay, removeEssay,
  expandedEssayId, setExpandedEssayId,
  subFormFor, subForm, setSub, openSubForm, startEditSub, closeSubForm, submitSub, removeSub, editingSubId,
}) {
  return (
    <>
      <form onSubmit={submitEssay} style={s.formCard}>
        <SectionTitle icon="✍️" title={editingEssayId ? 'Edit Essay Question' : 'Add Essay Question'} />

        <FormField label="Question Text">
          <textarea
            rows={4}
            style={{ ...s.input, resize: 'vertical' }}
            value={essayForm.question_text}
            onChange={e => setEssay('question_text', e.target.value)}
            placeholder="Type the full question here. Use $...$ for LaTeX math."
            required
          />
        </FormField>

        <FormField label="Model Answer (long text)">
          <textarea
            rows={8}
            style={{ ...s.input, resize: 'vertical' }}
            value={essayForm.answer}
            onChange={e => setEssay('answer', e.target.value)}
            placeholder="Write the complete model answer / marking scheme here…"
          />
        </FormField>

        <div style={s.grid2}>
          <FormField label="Total Marks (optional)">
            <input
              type="number"
              style={s.input}
              value={essayForm.marks}
              onChange={e => setEssay('marks', e.target.value)}
              min={0}
              placeholder="e.g. 10"
            />
          </FormField>
          <FormField label="Ordering">
            <input type="number" style={s.input} value={essayForm.ordering} onChange={e => setEssay('ordering', e.target.value)} min={0} />
          </FormField>
        </div>

        <div style={s.checkRow}>
          <input
            type="checkbox" id="essay_active"
            checked={essayForm.is_active}
            onChange={e => setEssay('is_active', e.target.checked)}
            style={{ accentColor: '#7C3AED', width: 15, height: 15 }}
          />
          <label htmlFor="essay_active" style={s.checkLabel}>Active (visible to students)</label>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button type="submit" style={s.btnPrimaryPurple} disabled={saving}
            onMouseEnter={e => { if (!saving) e.currentTarget.style.opacity = '0.88' }}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            {saving ? 'Saving…' : editingEssayId ? '✓ Update Question' : '+ Add Question'}
          </button>
          {editingEssayId && (
            <button type="button" style={s.cancelBtn} onClick={cancelEditEssay}
              onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'}
              onMouseLeave={e => e.currentTarget.style.background = 'white'}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <section style={s.listCard}>
        <SectionTitle icon="❓" title={`Questions (${questions.length})`} />

        {questions.length === 0 ? (
          <Empty text="No essay questions added yet." />
        ) : (
          <div style={s.cardList}>
            {questions
              .slice()
              .sort((a, b) => a.ordering - b.ordering)
              .map((q, i) => {
                const isOpen = expandedEssayId === q.id
                const isAddingSub = subFormFor === q.id

                return (
                  <div key={q.id} style={s.questionCardPurple}>
                    <div
                      style={{ ...s.questionCardHeader, cursor: 'pointer' }}
                      onClick={() => setExpandedEssayId(isOpen ? null : q.id)}
                    >
                      <span style={s.qNumBadgePurple}>{q.ordering || i + 1}</span>
                      <p style={s.qText}>{q.question_text}</p>
                      <div style={s.actionGroup}>
                        {q.marks != null && <span style={s.marksTag}>{q.marks} marks</span>}
                        <button onClick={ev => { ev.stopPropagation(); startEditEssay(q) }} style={s.editBtnPurple}
                          onMouseEnter={e => { e.currentTarget.style.background = '#F3E8FF' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                        >
                          Edit
                        </button>
                        <button onClick={ev => { ev.stopPropagation(); removeEssay(q.id) }} style={s.deleteBtn}
                          onMouseEnter={e => { e.currentTarget.style.background = '#FEE2E2'; e.currentTarget.style.color = '#991B1B' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#EF4444' }}
                        >
                          Delete
                        </button>
                        <span style={{ color: '#B0C4B0', fontSize: '0.9rem' }}>{isOpen ? '▲' : '▼'}</span>
                      </div>
                    </div>

                    {!q.is_active && <span style={s.hiddenTag}>Hidden</span>}

                    {isOpen && (
                      <div style={s.essayBody}>
                        {q.answer && (
                          <div style={s.answerBox}>
                            <strong style={{ fontSize: '0.78rem', color: '#7C3AED' }}>MODEL ANSWER</strong>
                            <p style={{ marginTop: 6, whiteSpace: 'pre-line' }}>{q.answer}</p>
                          </div>
                        )}

                        {/* Sub-questions */}
                        <div style={{ marginTop: 14 }}>
                          <div style={s.subHeader}>
                            <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#4A6A4A' }}>
                              Sub-questions ({q.sub_questions?.length || 0})
                            </span>
                            <button
                              type="button"
                              style={s.addSubBtn}
                              onClick={() => isAddingSub ? closeSubForm() : openSubForm(q.id)}
                            >
                              {isAddingSub ? '✕ Cancel' : '+ Add Sub-question'}
                            </button>
                          </div>

                          {(q.sub_questions || [])
                            .slice()
                            .sort((a, b) => a.ordering - b.ordering)
                            .map((sub, si) => (
                              <div key={sub.id} style={s.subRow}>
                                <span style={s.subLabel}>({String.fromCharCode(97 + si)})</span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <p style={s.subText}>{sub.text}</p>
                                  {sub.answer && <p style={s.subAnswer}>{sub.answer}</p>}
                                </div>
                                {sub.marks != null && <span style={s.marksTagSmall}>{sub.marks}m</span>}
                                <button
                                  type="button"
                                  style={s.subEditBtn}
                                  onClick={() => startEditSub(q.id, sub)}
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  style={s.subDeleteBtn}
                                  onClick={() => removeSub(sub.id)}
                                >
                                  🗑
                                </button>
                              </div>
                            ))}

                          {isAddingSub && (
                            <form onSubmit={e => submitSub(e, q.id)} style={s.subForm}>
                              <FormField label="Sub-question text">
                                <textarea
                                  rows={2}
                                  style={{ ...s.input, resize: 'vertical', marginBottom: 10 }}
                                  value={subForm.text}
                                  onChange={e => setSub('text', e.target.value)}
                                  required
                                />
                              </FormField>
                              <FormField label="Sub-answer (optional)">
                                <textarea
                                  rows={3}
                                  style={{ ...s.input, resize: 'vertical', marginBottom: 10 }}
                                  value={subForm.answer}
                                  onChange={e => setSub('answer', e.target.value)}
                                />
                              </FormField>
                              <div style={{ display: 'flex', gap: 10 }}>
                                <FormField label="Marks">
                                  <input
                                    type="number"
                                    style={{ ...s.input, maxWidth: 100 }}
                                    value={subForm.marks}
                                    onChange={e => setSub('marks', e.target.value)}
                                    min={0}
                                  />
                                </FormField>
                                <FormField label="Ordering">
                                  <input
                                    type="number"
                                    style={{ ...s.input, maxWidth: 100 }}
                                    value={subForm.ordering}
                                    onChange={e => setSub('ordering', e.target.value)}
                                    min={0}
                                  />
                                </FormField>
                              </div>
                              <button type="submit" style={s.btnPrimaryPurple}>
                                {editingSubId ? '✓ Update Sub-question' : '+ Add Sub-question'}
                              </button>
                            </form>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
          </div>
        )}
      </section>
    </>
  )
}

/* ── shared sub-components ── */
function Fonts() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Nunito:wght@700;800;900&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    `}</style>
  )
}

function Header() {
  return (
    <header style={s.header}>
      <div style={s.headerInner}>
        <div style={s.brandRow}>
          <div style={s.brandDot} />
          <span style={s.brandName}>Study<span style={{ color: '#1A3A1A' }}>LK</span></span>
          <span style={s.adminBadge}>Admin</span>
        </div>
      </div>
    </header>
  )
}

function BackBtn({ onClick }) {
  return (
    <button onClick={onClick} style={s.backBtn}
      onMouseEnter={e => { e.currentTarget.style.background = '#E8F5E9'; e.currentTarget.style.color = '#2E7D32' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#4A6A4A' }}
    >
      ← All Past Papers
    </button>
  )
}

function SectionTitle({ icon, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
      <span style={{ fontSize: '1.1rem' }}>{icon}</span>
      <h2 style={s.sectionTitle}>{title}</h2>
    </div>
  )
}

function FormField({ label, children }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <label style={s.fieldLabel}>{label}</label>
      {children}
    </div>
  )
}

function ErrorBanner({ msg, onClose }) {
  return (
    <div style={s.errorBanner}>
      <span>{msg}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#991B1B', fontWeight: 700, fontSize: '1rem' }}>✕</button>
    </div>
  )
}

function Empty({ text }) {
  return <p style={{ fontSize: '0.875rem', color: '#7A9A7A', padding: '12px 0' }}>{text}</p>
}

function Footer() {
  return (
    <footer style={s.footer}>
      <span style={s.footerBrand}>Study<span style={{ color: '#1A3A1A' }}>LK</span></span>
      <span style={s.footerText}>Admin Panel · {new Date().getFullYear()}</span>
    </footer>
  )
}

/* ── styles ── */
const BASE = "'Plus Jakarta Sans', sans-serif"
const DISPLAY = "'Nunito', sans-serif"

const s = {
  page: { minHeight: '100vh', background: '#F8FBF8', color: '#1A3A1A', fontFamily: BASE },
  loadingWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 16 },
  spinner: { width: 36, height: 36, borderRadius: '50%', border: '3px solid #E8F5E9', borderTopColor: '#4CAF50', animation: 'spin 0.8s linear infinite' },
  header: { position: 'sticky', top: 0, zIndex: 50, background: 'rgba(248,251,248,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1.5px solid #E8F5E9' },
  headerInner: { maxWidth: 1240, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center' },
  brandRow: { display: 'flex', alignItems: 'center', gap: 10 },
  brandDot: { width: 10, height: 10, borderRadius: '50%', background: 'linear-gradient(135deg,#4CAF50,#2E7D32)', boxShadow: '0 0 8px rgba(76,175,80,0.5)' },
  brandName: { fontFamily: DISPLAY, fontWeight: 900, fontSize: '1.35rem', color: '#2E7D32' },
  adminBadge: { fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: '#E8F5E9', color: '#2E7D32', padding: '3px 8px', borderRadius: 50, border: '1px solid #C8E6C9' },
  container: { maxWidth: 1240, margin: '0 auto', padding: '36px 24px 60px' },
  titleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 28 },
  eyebrow: { fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 },
  h1: { fontFamily: DISPLAY, fontWeight: 900, fontSize: 'clamp(1.6rem,3vw,2.2rem)', color: '#1A3A1A', letterSpacing: '-0.01em' },
  backBtn: { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'white', border: '1.5px solid #D4E8D4', borderRadius: 50, padding: '8px 18px', fontSize: '0.82rem', fontWeight: 600, color: '#4A6A4A', cursor: 'pointer', fontFamily: BASE, transition: 'all 0.18s', whiteSpace: 'nowrap' },
  formCard: { background: 'white', borderRadius: 24, border: '1.5px solid #E8F5E9', padding: '28px', marginBottom: 20, boxShadow: '0 2px 12px rgba(76,175,80,0.05)' },
  listCard: { background: 'white', borderRadius: 24, border: '1.5px solid #E8F5E9', padding: '28px', boxShadow: '0 2px 12px rgba(76,175,80,0.05)' },
  sectionTitle: { fontFamily: DISPLAY, fontWeight: 800, fontSize: '1.05rem', color: '#1A3A1A' },
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0 20px' },
  fieldLabel: { display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#7A9A7A', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' },
  input: { width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #E8F5E9', background: '#FAFCFA', fontFamily: BASE, fontSize: '0.875rem', color: '#1A3A1A', outline: 'none', marginBottom: 16, transition: 'border-color 0.2s' },
  checkRow: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, marginBottom: 4 },
  checkLabel: { fontSize: '0.85rem', color: '#4A6A4A', fontWeight: 500, cursor: 'pointer' },
  btnPrimary: { display: 'inline-flex', alignItems: 'center', background: 'linear-gradient(135deg,#3B82F6,#1D4ED8)', color: 'white', fontWeight: 700, fontSize: '0.82rem', padding: '9px 18px', borderRadius: 50, border: 'none', cursor: 'pointer', fontFamily: BASE, boxShadow: '0 3px 12px rgba(59,130,246,0.3)', transition: 'opacity 0.18s', whiteSpace: 'nowrap' },
  btnPrimaryPurple: { display: 'inline-flex', alignItems: 'center', background: 'linear-gradient(135deg,#8B5CF6,#7C3AED)', color: 'white', fontWeight: 700, fontSize: '0.82rem', padding: '9px 18px', borderRadius: 50, border: 'none', cursor: 'pointer', fontFamily: BASE, boxShadow: '0 3px 12px rgba(139,92,246,0.3)', transition: 'opacity 0.18s', whiteSpace: 'nowrap', marginTop: 8 },
  cancelBtn: { display: 'inline-flex', alignItems: 'center', background: 'white', color: '#64748B', fontWeight: 600, fontSize: '0.82rem', padding: '9px 18px', borderRadius: 50, border: '1.5px solid #E2E8F0', cursor: 'pointer', fontFamily: BASE, transition: 'background 0.18s', whiteSpace: 'nowrap' },
  cardList: { display: 'flex', flexDirection: 'column', gap: 14 },

  questionCard: { background: '#FAFCFA', border: '1.5px solid #E8F5E9', borderRadius: 18, padding: '18px 20px', transition: 'border-color 0.2s' },
  questionCardPurple: { background: '#FAFAFE', border: '1.5px solid #EDE4FB', borderRadius: 18, padding: '18px 20px' },
  questionCardHeader: { display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  qNumBadge: { width: 28, height: 28, minWidth: 28, borderRadius: '50%', background: '#EFF6FF', border: '1.5px solid #BFDBFE', color: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.78rem' },
  qNumBadgePurple: { width: 28, height: 28, minWidth: 28, borderRadius: '50%', background: '#F3E8FF', border: '1.5px solid #D8B4FE', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.78rem' },
  qText: { flex: 1, fontSize: '0.88rem', fontWeight: 600, color: '#1A3A1A', lineHeight: 1.6 },
  actionGroup: { display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 },
  editBtn: { fontSize: '0.76rem', fontWeight: 700, color: '#3B82F6', background: 'transparent', border: '1.5px solid #3B82F6', borderRadius: 50, padding: '6px 12px', cursor: 'pointer', fontFamily: BASE, transition: 'all 0.2s', whiteSpace: 'nowrap' },
  editBtnPurple: { fontSize: '0.76rem', fontWeight: 700, color: '#7C3AED', background: 'transparent', border: '1.5px solid #7C3AED', borderRadius: 50, padding: '6px 12px', cursor: 'pointer', fontFamily: BASE, transition: 'all 0.2s', whiteSpace: 'nowrap' },
  deleteBtn: { fontSize: '0.76rem', fontWeight: 700, color: '#EF4444', background: 'transparent', border: '1.5px solid #EF4444', borderRadius: 50, padding: '6px 12px', cursor: 'pointer', fontFamily: BASE, transition: 'all 0.2s', whiteSpace: 'nowrap' },

  optionsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8, marginBottom: 10 },
  optionPill: { background: 'white', border: '1.5px solid #E8F5E9', borderRadius: 10, padding: '8px 12px', fontSize: '0.8rem', color: '#4A6A4A' },
  optionPillCorrect: { background: '#DCFCE7', border: '1.5px solid #22C55E', color: '#166534', fontWeight: 700 },
  explanationText: { fontSize: '0.8rem', color: '#7A9A7A', lineHeight: 1.6, marginTop: 6 },
  marksTag: { background: '#FEF9E7', border: '1px solid #FDE68A', color: '#92400E', borderRadius: 50, padding: '2px 10px', fontSize: '0.7rem', fontWeight: 700, whiteSpace: 'nowrap' },
  marksTagSmall: { background: '#FEF9E7', border: '1px solid #FDE68A', color: '#92400E', borderRadius: 50, padding: '1px 8px', fontSize: '0.65rem', fontWeight: 700, whiteSpace: 'nowrap' },
  hiddenTag: { display: 'inline-block', background: '#F1F5F9', color: '#64748B', border: '1px solid #E2E8F0', borderRadius: 50, padding: '2px 9px', fontSize: '0.68rem', fontWeight: 700, marginTop: 4 },

  essayBody: { marginTop: 14, paddingTop: 14, borderTop: '1.5px solid #EDE4FB' },
  answerBox: { background: '#F3E8FF', border: '1.5px solid #D8B4FE', borderRadius: 14, padding: '14px 16px', fontSize: '0.85rem', color: '#3A2A5A', lineHeight: 1.7 },

  subHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  addSubBtn: { fontSize: '0.76rem', fontWeight: 700, color: '#7C3AED', background: 'transparent', border: '1.5px solid #D8B4FE', borderRadius: 50, padding: '5px 12px', cursor: 'pointer', fontFamily: BASE },
  subRow: { display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0', borderBottom: '1px solid #F3E8FF' },
  subLabel: { fontWeight: 800, color: '#7C3AED', fontSize: '0.85rem', minWidth: 22 },
  subText: { fontSize: '0.82rem', color: '#1A3A1A', lineHeight: 1.6, marginBottom: 3 },
  subAnswer: { fontSize: '0.78rem', color: '#7A9A7A', lineHeight: 1.6, fontStyle: 'italic' },
  subEditBtn: { fontSize: '0.72rem', fontWeight: 700, color: '#7C3AED', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: BASE, padding: '4px 8px' },
  subDeleteBtn: { fontSize: '0.78rem', fontWeight: 700, color: '#EF4444', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: BASE, padding: '4px 8px' },
  subForm: { background: 'white', border: '1.5px solid #D8B4FE', borderRadius: 14, padding: '16px', marginTop: 10 },

  errorBanner: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, background: '#FEE2E2', border: '1.5px solid #FECACA', color: '#991B1B', borderRadius: 16, padding: '12px 18px', fontSize: '0.85rem', marginBottom: 20 },
  footer: { borderTop: '1.5px solid #E8F5E9', padding: '20px 24px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, background: 'white' },
  footerBrand: { fontFamily: DISPLAY, fontWeight: 900, fontSize: '1.1rem', color: '#2E7D32' },
  footerText: { fontSize: '0.78rem', color: '#AACAAA' },
}