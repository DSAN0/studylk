import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  adminCreatePaperQuestion,
  adminDeletePaperQuestion,
  adminGetPaperQuestions,
} from '../../api/api'

import MathText from '../../components/MathText'
import 'katex/dist/katex.min.css'

const emptyForm = {
  question_text: '',
  option_a: '',
  option_b: '',
  option_c: '',
  option_d: '',
  correct_answer: 'A',
  explanation: '',
  marks: 1,
  ordering: 0,
}

const OPTION_COLORS = {
  A: { bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE' },
  B: { bg: '#F0FDF4', color: '#16A34A', border: '#BBF7D0' },
  C: { bg: '#FEF9E7', color: '#D97706', border: '#FDE68A' },
  D: { bg: '#F5F3FF', color: '#7C3AED', border: '#DDD6FE' },
}

export default function AdminPaperQuestions() {
  const { paperId } = useParams()
  const navigate = useNavigate()

  const [questions, setQuestions] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    loadData()
  }, [paperId])

  async function loadData() {
    try {
      const res = await adminGetPaperQuestions(paperId)
      setQuestions(res.data)
    } catch (err) {
      setError(JSON.stringify(err.response?.data || 'Could not load questions'))
    }
  }

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      await adminCreatePaperQuestion(paperId, {
        ...form,
        marks: Number(form.marks),
        ordering: Number(form.ordering),
      })

      setForm(emptyForm)
      await loadData()
    } catch (err) {
      setError(JSON.stringify(err.response?.data || 'Save failed'))
    } finally {
      setSaving(false)
    }
  }

  async function remove(id) {
    if (!confirm('Delete this question?')) return

    try {
      await adminDeletePaperQuestion(id)
      await loadData()
    } catch (err) {
      setError(JSON.stringify(err.response?.data || 'Delete failed'))
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .apq-root {
          min-height: 100vh;
          background: #F3F7F3;
          padding-top: 68px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #1A3A1A;
        }

        .apq-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 36px 24px 72px;
        }

        .apq-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
          gap: 12px;
          flex-wrap: wrap;
        }

        .apq-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: white;
          border: 1.5px solid #D1E9D1;
          color: #5A7A5A;
          font-weight: 600;
          font-size: 0.85rem;
          padding: 8px 16px;
          border-radius: 50px;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: background 0.18s, color 0.18s;
        }

        .apq-back-btn:hover {
          background: #E8F5E9;
          color: #2E7D32;
          border-color: #A5D6A7;
        }

        .apq-title {
          font-family: 'Nunito', sans-serif;
          font-weight: 900;
          font-size: 1.7rem;
          color: #1A3A1A;
          letter-spacing: -0.02em;
          margin: 0;
        }

        .apq-title-sub {
          font-size: 0.75rem;
          color: #7A9A7A;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          margin-bottom: 4px;
        }

        .apq-count-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #E8F5E9;
          color: #2E7D32;
          border: 1.5px solid #A5D6A7;
          font-size: 0.8rem;
          font-weight: 700;
          padding: 5px 13px;
          border-radius: 50px;
        }

        .apq-error {
          background: #FEF2F2;
          border: 1.5px solid #FECACA;
          color: #DC2626;
          border-radius: 14px;
          padding: 12px 16px;
          font-size: 0.87rem;
          margin-bottom: 20px;
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        .apq-card {
          background: white;
          border: 1.5px solid #E8F5E9;
          border-radius: 22px;
          padding: 28px;
          margin-bottom: 22px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
          animation: fadeUp 0.4s ease both;
        }

        .apq-card-title {
          font-family: 'Nunito', sans-serif;
          font-weight: 900;
          font-size: 1.1rem;
          color: #1A3A1A;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .apq-field {
          margin-bottom: 16px;
        }

        .apq-label {
          display: block;
          font-size: 0.78rem;
          font-weight: 700;
          margin-bottom: 6px;
          letter-spacing: 0.01em;
          color: #5A7A5A;
        }

        .apq-input,
        .apq-textarea,
        .apq-select {
          width: 100%;
          box-sizing: border-box;
          padding: 11px 14px;
          border-radius: 12px;
          border: 1.5px solid #D1E9D1;
          background: #FAFFFE;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.9rem;
          color: #1A3A1A;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
        }

        .apq-input::placeholder,
        .apq-textarea::placeholder {
          color: #A8C4A8;
        }

        .apq-input:focus,
        .apq-textarea:focus,
        .apq-select:focus {
          border-color: #4CAF50;
          box-shadow: 0 0 0 3px rgba(76,175,80,0.12);
          background: white;
        }

        .apq-textarea {
          resize: vertical;
        }

        .apq-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 14px;
          margin-bottom: 16px;
        }

        .apq-option-field {
          background: white;
          border: 1.5px solid;
          border-radius: 14px;
          padding: 14px;
        }

        .apq-option-label-row {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 8px;
        }

        .apq-option-badge {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.72rem;
          font-weight: 800;
          border: 1.5px solid;
          flex-shrink: 0;
        }

        .apq-answer-grid {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .apq-answer-opt {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          border: 2px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.18s;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .apq-submit-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #4CAF50, #2E7D32);
          color: white;
          font-weight: 800;
          font-size: 0.92rem;
          padding: 12px 26px;
          border-radius: 50px;
          border: none;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          box-shadow: 0 4px 16px rgba(76,175,80,0.28);
          transition: transform 0.18s, box-shadow 0.18s, opacity 0.18s;
          margin-top: 8px;
        }

        .apq-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 7px 22px rgba(76,175,80,0.38);
        }

        .apq-submit-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .apq-preview {
          margin-top: 12px;
          padding: 16px;
          border-radius: 14px;
          background: #FAFFFE;
          border: 1.5px solid #E8F5E9;
          line-height: 1.8;
          font-size: 0.95rem;
          white-space: pre-wrap;
        }

        .apq-preview-title {
          font-size: 0.75rem;
          font-weight: 700;
          color: #7A9A7A;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .apq-q-row {
          background: #FAFFFE;
          border: 1.5px solid #E8F5E9;
          border-radius: 16px;
          margin-bottom: 12px;
          overflow: hidden;
          transition: border-color 0.18s;
        }

        .apq-q-row:hover {
          border-color: #A5D6A7;
        }

        .apq-q-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          cursor: pointer;
          gap: 12px;
        }

        .apq-q-num {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4CAF50, #2E7D32);
          color: white;
          font-weight: 800;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .apq-q-text {
          font-weight: 600;
          font-size: 0.9rem;
          color: #1A3A1A;
          flex: 1;
          line-height: 1.5;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .apq-q-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .apq-correct-badge {
          font-size: 0.72rem;
          font-weight: 800;
          padding: 3px 10px;
          border-radius: 50px;
          border: 1.5px solid;
        }

        .apq-marks-badge {
          font-size: 0.72rem;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 50px;
          background: #F8FBF8;
          border: 1.5px solid #E8F5E9;
          color: #5A7A5A;
        }

        .apq-delete-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 700;
          color: #DC2626;
          padding: 4px 10px;
          border-radius: 8px;
          transition: background 0.18s;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .apq-delete-btn:hover {
          background: #FEF2F2;
        }

        .apq-q-body {
          padding: 0 18px 18px;
          border-top: 1.5px solid #F0F7F0;
        }

        .apq-full-question {
          font-size: 0.92rem;
          color: #1A3A1A;
          font-weight: 600;
          line-height: 1.8;
          margin-top: 14px;
          margin-bottom: 4px;
          white-space: pre-wrap;
        }

        .apq-opts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 10px;
          margin-top: 14px;
          margin-bottom: 12px;
        }

        .apq-opt-chip {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 10px 12px;
          border-radius: 12px;
          font-size: 0.83rem;
          border: 1.5px solid;
          line-height: 1.6;
        }

        .apq-opt-text {
          flex: 1;
          white-space: pre-wrap;
        }

        .apq-explanation {
          font-size: 0.83rem;
          color: #5A7A5A;
          line-height: 1.7;
          background: #F1F8F1;
          border: 1.5px solid #C8E6C9;
          border-radius: 10px;
          padding: 10px 14px;
          margin-top: 8px;
          white-space: pre-wrap;
        }

        .katex {
          font-size: 1.05em !important;
        }

        .katex-display {
          overflow-x: auto;
          overflow-y: hidden;
          padding: 4px 0;
        }

        .apq-q-text .katex {
          font-size: 1em !important;
        }

        .apq-opt-chip .katex {
          font-size: 0.98em !important;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <main className="apq-root">
        <div className="apq-inner">

          <div className="apq-topbar">
            <div>
              <div className="apq-title-sub">Admin · Question Papers</div>
              <h1 className="apq-title">Paper Questions</h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="apq-count-badge">
                📋 {questions.length} question{questions.length !== 1 ? 's' : ''}
              </span>

              <button
                className="apq-back-btn"
                onClick={() => navigate('/admin/question-papers')}
              >
                ← Back
              </button>
            </div>
          </div>

          {error && (
            <div className="apq-error">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="apq-card">
            <div className="apq-card-title">
              <span style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: '#E8F5E9',
                border: '1.5px solid #C8E6C9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
              }}>
                ➕
              </span>
              Add New Question
            </div>

            <form onSubmit={handleSubmit}>
              <div className="apq-field">
                <label className="apq-label">Question Text</label>

                <textarea
                  className="apq-textarea"
                  rows={4}
                  placeholder="Type the question here… Use $...$ for maths. Example: $19.92 \\times 10^{-27}\\ kg$"
                  value={form.question_text}
                  onChange={e => set('question_text', e.target.value)}
                  required
                />

                {form.question_text && (
                  <div className="apq-preview">
                    <div className="apq-preview-title">Live Preview</div>
                    <MathText text={form.question_text} />
                  </div>
                )}
              </div>

              <div className="apq-grid">
                {['a', 'b', 'c', 'd'].map(opt => {
                  const key = opt.toUpperCase()
                  const c = OPTION_COLORS[key]

                  return (
                    <div
                      key={opt}
                      className="apq-option-field"
                      style={{ borderColor: c.border, background: c.bg }}
                    >
                      <div className="apq-option-label-row">
                        <div
                          className="apq-option-badge"
                          style={{
                            background: c.bg,
                            color: c.color,
                            borderColor: c.border,
                          }}
                        >
                          {key}
                        </div>

                        <span style={{
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: c.color,
                        }}>
                          Option {key}
                        </span>
                      </div>

                      <input
                        className="apq-input"
                        placeholder={`Enter option ${key}`}
                        value={form[`option_${opt}`]}
                        onChange={e => set(`option_${opt}`, e.target.value)}
                      />

                      {form[`option_${opt}`] && (
                        <div className="apq-preview" style={{ fontSize: '0.85rem' }}>
                          <div className="apq-preview-title">Preview</div>
                          <MathText text={form[`option_${opt}`]} />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="apq-field">
                <label className="apq-label">Correct Answer</label>

                <div className="apq-answer-grid">
                  {['A', 'B', 'C', 'D'].map(opt => {
                    const c = OPTION_COLORS[opt]
                    const selected = form.correct_answer === opt

                    return (
                      <button
                        key={opt}
                        type="button"
                        className="apq-answer-opt"
                        style={selected
                          ? {
                              background: c.color,
                              color: 'white',
                              borderColor: c.color,
                              boxShadow: `0 3px 12px ${c.color}44`,
                            }
                          : {
                              background: c.bg,
                              color: c.color,
                              borderColor: c.border,
                            }
                        }
                        onClick={() => set('correct_answer', opt)}
                      >
                        {opt}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 14,
                marginBottom: 16,
              }}>
                <div className="apq-field" style={{ marginBottom: 0 }}>
                  <label className="apq-label">Marks</label>

                  <input
                    type="number"
                    className="apq-input"
                    value={form.marks}
                    onChange={e => set('marks', e.target.value)}
                    min={1}
                  />
                </div>

                <div className="apq-field" style={{ marginBottom: 0 }}>
                  <label className="apq-label">Ordering</label>

                  <input
                    type="number"
                    className="apq-input"
                    value={form.ordering}
                    onChange={e => set('ordering', e.target.value)}
                    min={0}
                  />
                </div>
              </div>

              <div className="apq-field">
                <label className="apq-label">Explanation Optional</label>

                <textarea
                  className="apq-textarea"
                  rows={3}
                  placeholder="Explain the correct answer… Use $...$ for maths"
                  value={form.explanation}
                  onChange={e => set('explanation', e.target.value)}
                />

                {form.explanation && (
                  <div className="apq-preview">
                    <div className="apq-preview-title">Explanation Preview</div>
                    <MathText text={form.explanation} />
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="apq-submit-btn"
                disabled={saving}
              >
                {saving ? '⏳ Saving…' : '✓ Add Question'}
              </button>
            </form>
          </div>

          <div className="apq-card">
            <div className="apq-card-title">
              <span style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: '#E8F5E9',
                border: '1.5px solid #C8E6C9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
              }}>
                📋
              </span>
              Questions ({questions.length})
            </div>

            {questions.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '36px 20px',
                color: '#7A9A7A',
                fontSize: '0.92rem',
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>📭</div>
                No questions added yet. Use the form above to add the first one.
              </div>
            ) : (
              questions.map((q, i) => {
                const isOpen = expanded === q.id
                const corrColor = OPTION_COLORS[q.correct_answer] || OPTION_COLORS.A

                return (
                  <div key={q.id} className="apq-q-row">
                    <div
                      className="apq-q-header"
                      onClick={() => setExpanded(isOpen ? null : q.id)}
                    >
                      <div className="apq-q-num">
                        {q.ordering || i + 1}
                      </div>

                      <div className="apq-q-text">
                        <MathText text={q.question_text} />
                      </div>

                      <div className="apq-q-meta">
                        <span
                          className="apq-correct-badge"
                          style={{
                            background: corrColor.bg,
                            color: corrColor.color,
                            borderColor: corrColor.border,
                          }}
                        >
                          ✓ {q.correct_answer}
                        </span>

                        <span className="apq-marks-badge">
                          {q.marks} mk
                        </span>

                        <button
                          className="apq-delete-btn"
                          onClick={ev => {
                            ev.stopPropagation()
                            remove(q.id)
                          }}
                        >
                          🗑
                        </button>

                        <span style={{ color: '#B0C4B0', fontSize: '0.9rem' }}>
                          {isOpen ? '▲' : '▼'}
                        </span>
                      </div>
                    </div>

                    {isOpen && (
                      <div className="apq-q-body">
                        <div className="apq-full-question">
                          <MathText text={q.question_text} />
                        </div>

                        <div className="apq-opts-grid">
                          {['A', 'B', 'C', 'D'].map(opt => {
                            const c = OPTION_COLORS[opt]
                            const val = q[`option_${opt.toLowerCase()}`] || ''
                            const isCorrect = q.correct_answer === opt

                            return (
                              <div
                                key={opt}
                                className="apq-opt-chip"
                                style={{
                                  background: isCorrect ? c.bg : 'white',
                                  borderColor: isCorrect ? c.border : '#E8F5E9',
                                }}
                              >
                                <div
                                  className="apq-option-badge"
                                  style={{
                                    width: 22,
                                    height: 22,
                                    fontSize: '0.68rem',
                                    background: c.bg,
                                    color: c.color,
                                    borderColor: c.border,
                                  }}
                                >
                                  {opt}
                                </div>

                                <span
                                  className="apq-opt-text"
                                  style={{
                                    color: isCorrect ? c.color : '#4A6A4A',
                                    fontWeight: isCorrect ? 700 : 500,
                                  }}
                                >
                                  <MathText text={val} />
                                </span>

                                {isCorrect && (
                                  <span style={{
                                    marginLeft: 'auto',
                                    color: c.color,
                                    fontSize: '0.8rem',
                                  }}>
                                    ✓
                                  </span>
                                )}
                              </div>
                            )
                          })}
                        </div>

                        {q.explanation && (
                          <div className="apq-explanation">
                            💡 <strong>Explanation:</strong>{' '}
                            <MathText text={q.explanation} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>

        </div>
      </main>
    </>
  )
}