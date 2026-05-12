import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getTopicQuestions } from '../api/api'
import MathText from '../components/MathText'

export default function TopicQuestions() {
  const { topicId } = useParams()
  const navigate = useNavigate()

  const [topic, setTopic] = useState(null)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [shownAnswers, setShownAnswers] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadQuestions() {
      try {
        const res = await getTopicQuestions(topicId)
        setTopic(res.data.topic)
        setQuestions(res.data.questions)
      } catch (err) {
        alert(JSON.stringify(err.response?.data || 'Could not load questions'))
        navigate('/my-courses')
      } finally {
        setLoading(false)
      }
    }

    loadQuestions()
  }, [topicId, navigate])

  function selectAnswer(questionId, opt) {
    if (shownAnswers[questionId]) return

    setAnswers(prev => ({
      ...prev,
      [questionId]: opt,
    }))
  }

  function showAnswer(questionId) {
    if (!answers[questionId]) {
      alert('Please select an answer first')
      return
    }

    setShownAnswers(prev => ({
      ...prev,
      [questionId]: true,
    }))
  }

  if (loading) {
    return (
      <>
        <BaseStyles />
        <main className="tq-loading">
          <div className="tq-loading-icon">📚</div>
          <p>Loading topic questions…</p>
        </main>
      </>
    )
  }

  return (
    <>
      <BaseStyles />

      <main className="tq-root">
        <div className="tq-header">
          <div className="tq-header-inner">
            <div>
              <span className="tq-subtitle">Topic Practice</span>
              <h1>{topic?.title || 'Practice Questions'}</h1>
            </div>

            <button className="tq-back-btn" onClick={() => navigate('/my-courses')}>
              Back
            </button>
          </div>
        </div>

        <div className="tq-content">
          {questions.map((q, index) => {
            const selected = answers[q.id]
            const answerShown = shownAnswers[q.id]
            const correctAnswer = q.correct_answer
            const isCorrect = selected === correctAnswer

            return (
              <div key={q.id} className="tq-question">
                <div className="tq-q-wrap">
                  <span className="tq-q-number">{index + 1}</span>

                  <div className="tq-q-text">
                    <MathText text={q.question_text} />
                  </div>
                </div>

                {['A', 'B', 'C', 'D'].map(opt => {
                  const value = q[`option_${opt.toLowerCase()}`]
                  const isSelected = selected === opt
                  const isCorrectOption = correctAnswer === opt
                  const isWrongSelected = answerShown && isSelected && !isCorrect

                  let optionClass = ''

                  if (answerShown && isCorrectOption) optionClass = 'correct'
                  else if (isWrongSelected) optionClass = 'wrong'
                  else if (isSelected) optionClass = 'selected'

                  return (
                    <label
                      key={opt}
                      className={`tq-option ${optionClass}`}
                      onClick={() => selectAnswer(q.id, opt)}
                    >
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        checked={isSelected}
                        disabled={answerShown}
                        onChange={() => selectAnswer(q.id, opt)}
                      />

                      <span className="tq-option-letter">{opt}</span>

                      <span className="tq-option-text">
                        <MathText text={value} />
                      </span>
                    </label>
                  )
                })}

                {!answerShown ? (
                  <button
                    className="tq-show-btn"
                    onClick={() => showAnswer(q.id)}
                  >
                    Show Answer
                  </button>
                ) : (
                  <div className={`tq-result ${isCorrect ? 'right' : 'wrong'}`}>
                    <div className="tq-result-title">
                      {isCorrect ? '✓ Correct answer' : '✕ Wrong answer'}
                    </div>

                    <p>
                      Correct Answer: <strong>{correctAnswer}</strong>
                    </p>

                    {q.explanation && (
                      <div className="tq-explanation">
                        <strong>Explanation:</strong>
                        <div>
                          <MathText text={q.explanation} />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </main>
    </>
  )
}

function BaseStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

      .tq-root {
        min-height: 100vh;
        background: #F8FBF8;
        padding-top: 68px;
        font-family: 'Plus Jakarta Sans', sans-serif;
        color: #1A3A1A;
      }

      .tq-loading {
        min-height: 100vh;
        padding-top: 90px;
        background: linear-gradient(160deg, #F0FAF0 0%, #FAFFFE 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 14px;
        font-family: 'Plus Jakarta Sans', sans-serif;
        color: #5A7A5A;
        font-weight: 700;
      }

      .tq-loading-icon {
        font-size: 2.2rem;
      }

      .tq-header {
        position: sticky;
        top: 68px;
        z-index: 30;
        background: white;
        border-bottom: 1.5px solid #C8E6C9;
        padding: 16px 24px;
        box-shadow: 0 2px 16px rgba(76,175,80,0.08);
      }

      .tq-header-inner {
        max-width: 900px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
      }

      .tq-subtitle {
        font-size: 0.75rem;
        color: #7A9A7A;
        font-weight: 700;
      }

      .tq-header h1 {
        margin: 2px 0 0;
        font-family: 'Nunito', sans-serif;
        font-size: 1.1rem;
        font-weight: 900;
        color: #1A3A1A;
      }

      .tq-back-btn {
        background: white;
        border: 1.5px solid #D1E9D1;
        color: #2E7D32;
        font-weight: 800;
        padding: 10px 20px;
        border-radius: 999px;
        cursor: pointer;
        font-family: inherit;
      }

      .tq-content {
        max-width: 900px;
        margin: 0 auto;
        padding: 32px 24px 80px;
      }

      .tq-question {
        background: white;
        border: 1.5px solid #E8F5E9;
        border-radius: 22px;
        padding: 28px;
        margin-bottom: 20px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.04);
      }

      .tq-q-wrap {
        display: flex;
        align-items: flex-start;
        gap: 14px;
        margin-bottom: 18px;
      }

      .tq-q-number {
        width: 34px;
        height: 34px;
        min-width: 34px;
        border-radius: 50%;
        background: #E8F5E9;
        border: 1.5px solid #C8E6C9;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
        color: #2E7D32;
      }

      .tq-q-text {
        flex: 1;
        font-size: 1rem;
        font-weight: 700;
        line-height: 1.9;
        color: #1A3A1A;
        word-break: break-word;
        overflow-wrap: anywhere;
      }

      .tq-option {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        border: 1.5px solid #E8F5E9;
        border-radius: 14px;
        padding: 14px 16px;
        margin-bottom: 10px;
        cursor: pointer;
        background: #FAFFFE;
        transition: 0.18s;
      }

      .tq-option:hover {
        background: #F1F8F1;
        border-color: #C8E6C9;
      }

      .tq-option.selected {
        background: #E8F5E9;
        border-color: #4CAF50;
      }

      .tq-option.correct {
        background: #E8F5E9;
        border-color: #22C55E;
      }

      .tq-option.wrong {
        background: #FEF2F2;
        border-color: #EF4444;
      }

      .tq-option input {
        display: none;
      }

      .tq-option-letter {
        width: 28px;
        height: 28px;
        min-width: 28px;
        border-radius: 50%;
        background: white;
        border: 1.5px solid #D1E9D1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
        color: #2E7D32;
      }

      .tq-option.correct .tq-option-letter {
        background: #22C55E;
        color: white;
        border-color: transparent;
      }

      .tq-option.wrong .tq-option-letter {
        background: #EF4444;
        color: white;
        border-color: transparent;
      }

      .tq-option-text {
        flex: 1;
        font-size: 0.95rem;
        line-height: 1.8;
        color: #3A5A3A;
        word-break: break-word;
        overflow-wrap: anywhere;
      }

      .tq-show-btn {
        margin-top: 14px;
        background: linear-gradient(135deg, #4CAF50, #2E7D32);
        color: white;
        border: none;
        padding: 12px 26px;
        border-radius: 999px;
        font-weight: 900;
        cursor: pointer;
        font-family: inherit;
        box-shadow: 0 4px 18px rgba(76,175,80,0.3);
      }

      .tq-result {
        margin-top: 18px;
        padding: 18px;
        border-radius: 16px;
        line-height: 1.8;
      }

      .tq-result.right {
        background: #E8F5E9;
        border: 1.5px solid #22C55E;
      }

      .tq-result.wrong {
        background: #FEF2F2;
        border: 1.5px solid #EF4444;
      }

      .tq-result-title {
        font-weight: 900;
        margin-bottom: 6px;
      }

      .tq-explanation {
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid rgba(0,0,0,0.08);
      }

      .math-text {
        display: inline;
        white-space: normal;
        word-break: normal;
        overflow-wrap: anywhere;
        line-height: 1.9;
      }

      .math-text span {
        display: inline;
      }

      .katex {
        font-size: 1.05em !important;
      }

      .katex-html {
        white-space: nowrap;
      }

      .katex-display {
        overflow-x: auto;
        overflow-y: hidden;
        padding: 4px 0;
      }

      @media (max-width: 640px) {
        .tq-content {
          padding: 24px 14px 70px;
        }

        .tq-question {
          padding: 20px;
        }

        .tq-q-text {
          font-size: 0.94rem;
        }

        .tq-option-text {
          font-size: 0.9rem;
        }
      }
    `}</style>
  )
}