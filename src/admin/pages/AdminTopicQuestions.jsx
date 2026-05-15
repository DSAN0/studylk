import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  adminCreateTopicQuestion,
  adminDeleteTopicQuestion,
  adminGetTopicQuestions,
} from '../../api/api'

const emptyForm = {
  question_text: '',
  option_a: '',
  option_b: '',
  option_c: '',
  option_d: '',
  correct_answer: 'A',
  explanation: '',
  ordering: 0,
}

const OPTION_COLORS = {
  A: { bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE' },
  B: { bg: '#F0FDF4', color: '#16A34A', border: '#BBF7D0' },
  C: { bg: '#FEF9E7', color: '#D97706', border: '#FDE68A' },
  D: { bg: '#F5F3FF', color: '#7C3AED', border: '#DDD6FE' },
}

export default function AdminTopicQuestions() {
  const { topicId } = useParams()
  const navigate = useNavigate()

  const [questions, setQuestions] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    loadData()
  }, [topicId])

  async function loadData() {
    try {
      const res = await adminGetTopicQuestions(topicId)
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
      await adminCreateTopicQuestion(topicId, {
        ...form,
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
      await adminDeleteTopicQuestion(id)
      await loadData()
    } catch (err) {
      setError(JSON.stringify(err.response?.data || 'Delete failed'))
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .atq-root {
          min-height: 100vh;
          background: #F3F7F3;
          padding-top: 68px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #1A3A1A;
        }

        .atq-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 36px 24px 72px;
        }

        .atq-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
          gap: 12px;
          flex-wrap: wrap;
        }

        .atq-title-sub {
          font-size: 0.75rem;
          color: #7A9A7A;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          margin-bottom: 4px;
        }

        .atq-title {
          font-family: 'Nunito', sans-serif;
          font-weight: 900;
          font-size: 1.7rem;
          color: #1A3A1A;
          letter-spacing: -0.02em;
        }

        .atq-back-btn {
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

        .atq-back-btn:hover {
          background: #E8F5E9;
          color: #2E7D32;
          border-color: #A5D6A7;
        }

        .atq-count-badge {
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

        .atq-error {
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

        .atq-card {
          background: white;
          border: 1.5px solid #E8F5E9;
          border-radius: 22px;
          padding: 28px;
          margin-bottom: 22px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
          animation: fadeUp 0.4s ease both;
        }

        .atq-card-title {
          font-family: 'Nunito', sans-serif;
          font-weight: 900;
          font-size: 1.1rem;
          color: #1A3A1A;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .atq-icon-box {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: #E8F5E9;
          border: 1.5px solid #C8E6C9;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
        }

        .atq-field {
          margin-bottom: 16px;
        }

        .atq-label {
          display: block;
          font-size: 0.78rem;
          font-weight: 700;
          color: #5A7A5A;
          margin-bottom: 6px;
          letter-spacing: 0.01em;
        }

        .atq-input,
        .atq-textarea {
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

        .atq-input::placeholder,
        .atq-textarea::placeholder {
          color: #A8C4A8;
        }

        .atq-input:focus,
        .atq-textarea:focus {
          border-color: #4CAF50;
          box-shadow: 0 0 0 3px rgba(76,175,80,0.12);
          background: white;
        }

        .atq-textarea {
          resize: vertical;
        }

        .atq-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 14px;
          margin-bottom: 16px;
        }

        .atq-option-field {
          background: white;
          border: 1.5px solid;
          border-radius: 14px;
          padding: 14px;
        }

        .atq-option-label-row {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 8px;
        }

        .atq-option-badge {
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

        .atq-answer-grid {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .atq-answer-opt {
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

        .atq-submit-btn {
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

        .atq-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 7px 22px rgba(76,175,80,0.38);
        }

        .atq-submit-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .atq-q-row {
          background: #FAFFFE;
          border: 1.5px solid #E8F5E9;
          border-radius: 16px;
          margin-bottom: 12px;
          overflow: hidden;
          transition: border-color 0.18s;
        }

        .atq-q-row:hover {
          border-color: #A5D6A7;
        }

        .atq-q-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          cursor: pointer;
          gap: 12px;
        }

        .atq-q-num {
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

        .atq-q-text {
          font-weight: 600;
          font-size: 0.9rem;
          color: #1A3A1A;
          flex: 1;
          line-height: 1.4;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .atq-q-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .atq-correct-badge {
          font-size: 0.72rem;
          font-weight: 800;
          padding: 3px 10px;
          border-radius: 50px;
          border: 1.5px solid;
        }

        .atq-order-badge {
          font-size: 0.72rem;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 50px;
          background: #F8FBF8;
          border: 1.5px solid #E8F5E9;
          color: #5A7A5A;
        }

        .atq-delete-btn {
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

        .atq-delete-btn:hover {
          background: #FEF2F2;
        }

        .atq-q-body {
          padding: 0 18px 18px;
          border-top: 1.5px solid #F0F7F0;
        }

        .atq-opts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 10px;
          margin-top: 14px;
          margin-bottom: 12px;
        }

        .atq-opt-chip {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 10px 12px;
          border-radius: 12px;
          font-size: 0.83rem;
          border: 1.5px solid;
        }

        .atq-explanation {
          font-size: 0.83rem;
          color: #5A7A5A;
          line-height: 1.6;
          background: #F1F8F1;
          border: 1.5px solid #C8E6C9;
          border-radius: 10px;
          padding: 10px 14px;
          margin-top: 8px;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 640px) {
          .atq-card {
            padding: 20px;
          }

          .atq-q-header {
            align-items: flex-start;
          }

          .atq-q-meta {
            flex-wrap: wrap;
            justify-content: flex-end;
          }
        }
      `}</style>

      <main className="atq-root">
        <div className="atq-inner">
          <div className="atq-topbar">
            <div>
              <div className="atq-title-sub">Admin · Topic Practice</div>
              <h1 className="atq-title">Topic Questions</h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="atq-count-badge">
                📋 {questions.length} question{questions.length !== 1 ? 's' : ''}
              </span>

              <button
                className="atq-back-btn"
                onClick={() => navigate('/admin/topic-practice')}
              >
                ← Back
              </button>
            </div>
          </div>

          {error && (
            <div className="atq-error">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="atq-card">
            <div className="atq-card-title">
              <span className="atq-icon-box">➕</span>
              Add New Topic Question
            </div>

            <form onSubmit={handleSubmit}>
              <div className="atq-field">
                <label className="atq-label">Question Text</label>
                <textarea
                  className="atq-textarea"
                  rows={4}
                  placeholder="Type the topic question here…"
                  value={form.question_text}
                  onChange={e => set('question_text', e.target.value)}
                  required
                />
              </div>

              <div className="atq-grid">
                {['a', 'b', 'c', 'd'].map(opt => {
                  const key = opt.toUpperCase()
                  const c = OPTION_COLORS[key]

                  return (
                    <div
                      key={opt}
                      className="atq-option-field"
                      style={{ borderColor: c.border, background: c.bg }}
                    >
                      <div className="atq-option-label-row">
                        <div
                          className="atq-option-badge"
                          style={{
                            background: c.bg,
                            color: c.color,
                            borderColor: c.border,
                          }}
                        >
                          {key}
                        </div>

                        <span
                          style={{
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            color: c.color,
                          }}
                        >
                          Option {key}
                        </span>
                      </div>

                      <input
                        className="atq-input"
                        placeholder={`Enter option ${key}`}
                        value={form[`option_${opt}`]}
                        onChange={e => set(`option_${opt}`, e.target.value)}
                        required
                      />
                    </div>
                  )
                })}
              </div>

              <div className="atq-field">
                <label className="atq-label">Correct Answer</label>
                <div className="atq-answer-grid">
                  {['A', 'B', 'C', 'D'].map(opt => {
                    const c = OPTION_COLORS[opt]
                    const selected = form.correct_answer === opt

                    return (
                      <button
                        key={opt}
                        type="button"
                        className="atq-answer-opt"
                        style={
                          selected
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

              <div className="atq-field">
                <label className="atq-label">Ordering</label>
                <input
                  type="number"
                  className="atq-input"
                  value={form.ordering}
                  onChange={e => set('ordering', e.target.value)}
                  min={0}
                />
              </div>

              <div className="atq-field">
                <label className="atq-label">Explanation</label>
                <textarea
                  className="atq-textarea"
                  rows={3}
                  placeholder="Explain the correct answer…"
                  value={form.explanation}
                  onChange={e => set('explanation', e.target.value)}
                />
              </div>

              <button type="submit" className="atq-submit-btn" disabled={saving}>
                {saving ? '⏳ Saving…' : '✓ Add Question'}
              </button>
            </form>
          </div>

          <div className="atq-card">
            <div className="atq-card-title">
              <span className="atq-icon-box">📋</span>
              Questions ({questions.length})
            </div>

            {questions.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '36px 20px',
                  color: '#7A9A7A',
                  fontSize: '0.92rem',
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>📭</div>
                No topic questions added yet. Use the form above to add the first one.
              </div>
            ) : (
              questions.map((q, i) => {
                const isOpen = expanded === q.id
                const corrColor = OPTION_COLORS[q.correct_answer] || OPTION_COLORS.A

                return (
                  <div key={q.id} className="atq-q-row">
                    <div
                      className="atq-q-header"
                      onClick={() => setExpanded(isOpen ? null : q.id)}
                    >
                      <div className="atq-q-num">{q.ordering || i + 1}</div>

                      <div className="atq-q-text">{q.question_text}</div>

                      <div className="atq-q-meta">
                        <span
                          className="atq-correct-badge"
                          style={{
                            background: corrColor.bg,
                            color: corrColor.color,
                            borderColor: corrColor.border,
                          }}
                        >
                          ✓ {q.correct_answer}
                        </span>

                        <span className="atq-order-badge">#{q.ordering || i + 1}</span>

                        <button
                          className="atq-delete-btn"
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
                      <div className="atq-q-body">
                        <div
                          style={{
                            fontSize: '0.9rem',
                            color: '#1A3A1A',
                            fontWeight: 600,
                            lineHeight: 1.6,
                            marginTop: 14,
                            marginBottom: 4,
                          }}
                        >
                          {q.question_text}
                        </div>

                        <div className="atq-opts-grid">
                          {['A', 'B', 'C', 'D'].map(opt => {
                            const c = OPTION_COLORS[opt]
                            const val = q[`option_${opt.toLowerCase()}`]
                            const isCorrect = q.correct_answer === opt

                            return (
                              <div
                                key={opt}
                                className="atq-opt-chip"
                                style={{
                                  background: isCorrect ? c.bg : 'white',
                                  borderColor: isCorrect ? c.border : '#E8F5E9',
                                }}
                              >
                                <div
                                  className="atq-option-badge"
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
                                  style={{
                                    color: isCorrect ? c.color : '#4A6A4A',
                                    fontWeight: isCorrect ? 700 : 500,
                                  }}
                                >
                                  {val}
                                </span>

                                {isCorrect && (
                                  <span
                                    style={{
                                      marginLeft: 'auto',
                                      color: c.color,
                                      fontSize: '0.8rem',
                                    }}
                                  >
                                    ✓
                                  </span>
                                )}
                              </div>
                            )
                          })}
                        </div>

                        {q.explanation && (
                          <div className="atq-explanation">
                            💡 <strong>Explanation:</strong> {q.explanation}
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