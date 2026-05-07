import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { studentStartPaper, studentSubmitPaper } from '../api/api'
import MathText from '../components/MathText'

export default function TakePaper() {
  const { paperId } = useParams()
  const navigate = useNavigate()

  const [attempt, setAttempt]     = useState(null)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers]     = useState({})
  const [timeLeft, setTimeLeft]   = useState(0)
  const [submitting, setSubmitting] = useState(false)

  const submittedRef = useRef(false)

  useEffect(() => {
    async function startPaper() {
      try {
        const res = await studentStartPaper(paperId)
        setAttempt(res.data.attempt)
        setQuestions(res.data.questions)
        setTimeLeft(res.data.attempt.paper.duration_minutes * 60)
      } catch (err) {
        alert(JSON.stringify(err.response?.data || 'Could not start paper'))
        navigate('/my-courses')
      }
    }
    startPaper()
  }, [paperId, navigate])

  useEffect(() => {
    if (!attempt || timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timer); autoSubmit(); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [attempt, timeLeft])

  async function autoSubmit() {
    if (submittedRef.current || !attempt) return
    submittedRef.current = true
    await submitPaper()
  }

  async function submitPaper() {
    if (!attempt || submitting) return
    setSubmitting(true)
    try {
      const payload = {
        answers: Object.entries(answers).map(([questionId, selected_answer]) => ({
          questionId: Number(questionId),
          selected_answer,
        })),
      }
      const res = await studentSubmitPaper(attempt.id, payload)
      navigate(`/paper-result/${res.data.result.id}`)
    } catch (err) {
      alert(JSON.stringify(err.response?.data || 'Submit failed'))
      submittedRef.current = false
    } finally {
      setSubmitting(false)
    }
  }

  function formatTime(seconds) {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const answered   = Object.keys(answers).length
  const total      = questions.length
  const progress   = total > 0 ? Math.round((answered / total) * 100) : 0
  const isLowTime  = timeLeft <= 300
  const isCritical = timeLeft <= 60

  /* ── Loading ── */
  if (!attempt) {
    return (
      <>
        <BaseStyles />
        <main style={{
          minHeight: '100vh', paddingTop: 90,
          background: 'linear-gradient(160deg, #F0FAF0 0%, #FAFFFE 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 14,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
          <div style={{ fontSize: '2.2rem' }}>📄</div>
          <p style={{ color: '#5A7A5A', fontWeight: 600, fontSize: '0.95rem' }}>Starting paper…</p>
          <div style={{ display: 'flex', gap: 6 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: '50%', background: '#4CAF50',
                animation: `bounce 1.2s ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <BaseStyles />
      <style>{`
        .tp-root {
          min-height: 100vh;
          background: #F8FBF8;
          padding-top: 68px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #1A3A1A;
        }

        /* Sticky header bar */
        .tp-header {
          position: sticky;
          top: 68px;
          z-index: 30;
          background: white;
          border-bottom: 1.5px solid #C8E6C9;
          padding: 14px 24px;
          box-shadow: 0 2px 16px rgba(76,175,80,0.08);
        }
        .tp-header-inner {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .tp-title {
          font-family: 'Nunito', sans-serif;
          font-weight: 900; font-size: 1.05rem;
          color: #1A3A1A; flex: 1; min-width: 140px;
        }
        .tp-title-sub {
          font-size: 0.75rem; color: #7A9A7A; font-weight: 600;
          display: block; margin-bottom: 2px;
        }

        /* Timer */
        .tp-timer {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 16px; border-radius: 50px;
          font-family: 'Courier New', monospace;
          font-size: 1.1rem; font-weight: 800;
          border: 2px solid; transition: all 0.3s;
          flex-shrink: 0;
        }
        .tp-timer.normal  { background: #E8F5E9; color: #2E7D32; border-color: #A5D6A7; }
        .tp-timer.low     { background: #FEF9E7; color: '#D97706'; border-color: #FDE68A; animation: pulse-timer 1s infinite; }
        .tp-timer.critical { background: #FEF2F2; color: #DC2626; border-color: #FECACA; animation: pulse-timer 0.5s infinite; }

        /* Progress */
        .tp-progress-wrap {
          display: flex; align-items: center; gap: 10px;
          flex-shrink: 0;
        }
        .tp-progress-bar-bg {
          width: 120px; height: 7px;
          background: #E8F5E9; border-radius: 4px; overflow: hidden;
        }
        .tp-progress-bar-fill {
          height: 100%; border-radius: 4px;
          background: linear-gradient(90deg, #4CAF50, #2E7D32);
          transition: width 0.3s ease;
        }
        .tp-progress-label {
          font-size: 0.78rem; font-weight: 700; color: #5A7A5A;
          white-space: nowrap;
        }

        /* Content */
        .tp-content {
          max-width: 900px;
          margin: 0 auto;
          padding: 32px 24px 80px;
        }

        /* Question card */
        .tp-question {
          background: white;
          border: 1.5px solid #E8F5E9;
          border-radius: 22px;
          padding: 28px;
          margin-bottom: 18px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.04);
          transition: border-color 0.2s;
          animation: fadeUp 0.35s ease both;
        }
        .tp-question.answered { border-color: #A5D6A7; }

        .tp-q-number {
          display: inline-flex; align-items: center; justify-content: center;
          width: 30px; height: 30px; border-radius: 50%;
          background: #E8F5E9; border: 1.5px solid #C8E6C9;
          font-weight: 800; font-size: 0.82rem; color: #2E7D32;
          flex-shrink: 0; margin-right: 10px;
        }
        .tp-q-number.answered-num {
          background: linear-gradient(135deg, #4CAF50, #2E7D32);
          border-color: transparent; color: white;
        }

        .tp-q-text {
          font-size: 0.97rem; font-weight: 600;
          color: #1A3A1A; line-height: 1.65;
          display: flex; align-items: flex-start;
          margin-bottom: 18px;
        }

        /* Options */
        .tp-option {
          display: flex; align-items: flex-start; gap: 12px;
          border: 1.5px solid #E8F5E9;
          border-radius: 14px; padding: 12px 16px;
          margin-bottom: 10px; cursor: pointer;
          transition: background 0.18s, border-color 0.18s;
          background: #FAFFFE;
        }
        .tp-option:hover { background: #F1F8F1; border-color: #C8E6C9; }
        .tp-option.selected {
          background: #E8F5E9;
          border-color: #4CAF50;
        }
        .tp-option input[type="radio"] { display: none; }

        .tp-option-letter {
          width: 28px; height: 28px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 0.82rem;
          flex-shrink: 0; border: 1.5px solid;
          transition: background 0.18s, color 0.18s;
        }
        .tp-option-letter.unselected {
          background: white; color: #5A7A5A; border-color: #D1E9D1;
        }
        .tp-option-letter.selected {
          background: linear-gradient(135deg, #4CAF50, #2E7D32);
          color: white; border-color: transparent;
        }

        .tp-option-text {
          font-size: 0.92rem; color: #3A5A3A; line-height: 1.55;
          padding-top: 3px;
        }
        .tp-option.selected .tp-option-text { color: #1A3A1A; font-weight: 600; }

        /* Bottom bar */
        .tp-bottom {
          display: flex; justify-content: space-between; align-items: center;
          gap: 12px; flex-wrap: wrap;
          margin-top: 32px; padding-top: 24px;
          border-top: 1.5px solid #E8F5E9;
        }

        .tp-exit-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: white; border: 1.5px solid #D1E9D1;
          color: #5A7A5A; font-weight: 600; font-size: 0.9rem;
          padding: 11px 22px; border-radius: 50px; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: background 0.18s, color 0.18s;
        }
        .tp-exit-btn:hover { background: #F8F0F0; color: #DC2626; border-color: #FECACA; }

        .tp-submit-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, #4CAF50, #2E7D32);
          color: white; font-weight: 800; font-size: 0.95rem;
          padding: 12px 28px; border-radius: 50px; border: none; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          box-shadow: 0 4px 18px rgba(76,175,80,0.3);
          transition: transform 0.18s, box-shadow 0.18s, opacity 0.18s;
        }
        .tp-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 26px rgba(76,175,80,0.4);
        }
        .tp-submit-btn:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }

        /* Unanswered warning */
        .tp-unanswered-note {
          font-size: 0.82rem; color: #D97706; font-weight: 600;
          display: flex; align-items: center; gap: 5px;
        }

        @keyframes pulse-timer {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.6; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <main className="tp-root">

        {/* ── Sticky header ── */}
        <div className="tp-header">
          <div className="tp-header-inner">

            {/* Title */}
            <div className="tp-title">
              <span className="tp-title-sub">Question Paper</span>
              {attempt.paper.title}
            </div>

            {/* Progress */}
            <div className="tp-progress-wrap">
              <div className="tp-progress-bar-bg">
                <div className="tp-progress-bar-fill" style={{ width: `${progress}%` }} />
              </div>
              <span className="tp-progress-label">{answered}/{total} answered</span>
            </div>

            {/* Timer */}
            <div className={`tp-timer ${isCritical ? 'critical' : isLowTime ? 'low' : 'normal'}`}>
              {isCritical ? '🔴' : isLowTime ? '⚠️' : '⏱'}
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        {/* ── Questions ── */}
        <div className="tp-content">
          {questions.map((q, index) => {
            const isAnswered = !!answers[q.id]
            return (
              <div
                key={q.id}
                className={`tp-question ${isAnswered ? 'answered' : ''}`}
                style={{ animationDelay: `${index * 0.04}s` }}
              >
                <div className="tp-q-text">
                  <span className={`tp-q-number ${isAnswered ? 'answered-num' : ''}`}>
                    {index + 1}
                  </span>
                  <MathText text={q.question_text} />
                </div>

                {['A', 'B', 'C', 'D'].map(opt => {
                  const value    = q[`option_${opt.toLowerCase()}`]
                  const selected = answers[q.id] === opt
                  return (
                    <label
                      key={opt}
                      className={`tp-option ${selected ? 'selected' : ''}`}
                      onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                    >
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        checked={selected}
                        onChange={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                      />
                      <span className={`tp-option-letter ${selected ? 'selected' : 'unselected'}`}>
                        {opt}
                      </span>
                      <span className="tp-option-text">
                        <MathText text={value} />
                      </span>
                    </label>
                  )
                })}
              </div>
            )
          })}

          {/* ── Bottom bar ── */}
          <div className="tp-bottom">
            <button className="tp-exit-btn" onClick={() => navigate('/my-courses')}>
              ✕ Exit Paper
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              {answered < total && (
                <span className="tp-unanswered-note">
                  ⚠️ {total - answered} question{total - answered !== 1 ? 's' : ''} unanswered
                </span>
              )}
              <button
                className="tp-submit-btn"
                disabled={submitting}
                onClick={submitPaper}
              >
                {submitting ? '⏳ Submitting…' : '✓ Submit Paper'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

function BaseStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50%       { transform: translateY(-8px); }
      }
    `}</style>
  )
}