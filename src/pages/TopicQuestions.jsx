import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getTopicQuestions, submitTopicQuestion } from '../api/api'
import MathText from '../components/MathText'

const QUESTIONS_PER_PAGE = 20

export default function TopicQuestions() {
  const { topicId } = useParams()
  const navigate = useNavigate()

  const [topic, setTopic] = useState(null)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [shownAnswers, setShownAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [searchError, setSearchError] = useState('')
  const [activeQuestionId, setActiveQuestionId] = useState(null)

  const questionRefs = useRef({})
  const contentRef = useRef(null)
  const searchInputRef = useRef(null)

  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE)

  const pageQuestions = questions.slice(
    (currentPage - 1) * QUESTIONS_PER_PAGE,
    currentPage * QUESTIONS_PER_PAGE
  )

  useEffect(() => {
    async function loadQuestions() {
      try {
        const res = await getTopicQuestions(topicId)
        setTopic(res.data.topic)
        setQuestions(res.data.questions)

        const savedAnswers = {}
        const savedShownAnswers = {}

        res.data.attempts.forEach(attempt => {
          savedAnswers[attempt.question] = attempt.selected_answer
          savedShownAnswers[attempt.question] = true
        })

        setAnswers(savedAnswers)
        setShownAnswers(savedShownAnswers)

      } catch (err) {
        alert(JSON.stringify(err.response?.data || 'Could not load questions'))
        navigate('/my-courses')
      } finally {
        setLoading(false)
      }
    }
    loadQuestions()
  }, [topicId, navigate])

  // Track which question is active while scrolling
  useEffect(() => {
    const container = contentRef.current
    if (!container) return

    function handleScroll() {
      const scrollTop = container.scrollTop
      let found = null
      for (const q of pageQuestions) {
        const el = questionRefs.current[q.id]
        if (el && el.offsetTop - 80 <= scrollTop) {
          found = q.id
        }
      }
      if (found !== null) setActiveQuestionId(found)
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [pageQuestions])

  // Reset scroll & active when page changes
  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0
    setActiveQuestionId(pageQuestions[0]?.id ?? null)
  }, [currentPage]) // eslint-disable-line react-hooks/exhaustive-deps

  function selectAnswer(questionId, opt) {
    if (shownAnswers[questionId]) return
    setAnswers(prev => ({ ...prev, [questionId]: opt }))
  }

  async function showAnswer(questionId) {
  if (!answers[questionId]) {
    alert('Please select an answer first')
    return
  }

  try {
    await submitTopicQuestion({
      questionId: questionId,
      selected_answer: answers[questionId],
    })

    setShownAnswers(prev => ({ ...prev, [questionId]: true }))
  } catch (err) {
    alert(JSON.stringify(err.response?.data || 'Could not save answer'))
  }
 }

  function scrollToQuestionId(qId) {
    const el = questionRefs.current[qId]
    if (el && contentRef.current) {
      contentRef.current.scrollTo({ top: el.offsetTop - 24, behavior: 'smooth' })
      setActiveQuestionId(qId)
    }
  }

  // Go to a specific global question number (1-based)
  function goToQuestionNumber(num) {
    if (num < 1 || num > questions.length) return false
    const targetPage = Math.ceil(num / QUESTIONS_PER_PAGE)
    const targetQ = questions[num - 1]
    if (targetPage !== currentPage) {
      setCurrentPage(targetPage)
      // scroll after page renders
      setTimeout(() => {
        scrollToQuestionId(targetQ.id)
      }, 80)
    } else {
      scrollToQuestionId(targetQ.id)
    }
    return true
  }

  // Go to a specific page number
  function goToPage(num) {
    if (num < 1 || num > totalPages) return false
    setCurrentPage(num)
    return true
  }

  function handleSearch(e) {
    e.preventDefault()
    setSearchError('')
    const raw = searchInput.trim()
    if (!raw) return

    // Detect "p:5" or "page:5" for page search
    const pageMatch = raw.match(/^p(?:age)?:?\s*(\d+)$/i)
    if (pageMatch) {
      const p = parseInt(pageMatch[1])
      if (!goToPage(p)) {
        setSearchError(`Page ${p} doesn't exist (1–${totalPages})`)
      } else {
        setSearchInput('')
      }
      return
    }

    // Otherwise treat as a question number
    const num = parseInt(raw)
    if (isNaN(num) || num < 1) {
      setSearchError('Enter a question number or "p:5" for page 5')
      return
    }
    if (!goToQuestionNumber(num)) {
      setSearchError(`Q${num} doesn't exist (1–${questions.length})`)
    } else {
      setSearchInput('')
    }
  }

  // Find first unanswered question across all questions
  function findNextUnanswered() {
    return questions.find(q => !shownAnswers[q.id]) || null
  }

  function resumeNext() {
    const next = findNextUnanswered()
    if (!next) return
    const globalIndex = questions.indexOf(next)
    goToQuestionNumber(globalIndex + 1)
  }

  const completedCount = Object.keys(shownAnswers).length
  const progressPct = questions.length > 0
    ? Math.round((completedCount / questions.length) * 100)
    : 0

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

      <div className="tq-shell">

        {/* ── SIDEBAR ── */}
        <aside className="tq-sidebar">

          {/* Progress */}
          <div className="tq-sb-progress">
            <div className="tq-sb-progress-top">
              <span className="tq-sb-label">Progress</span>
              <span className="tq-sb-pct">{progressPct}%</span>
            </div>
            <div className="tq-progress-track">
              <div className="tq-progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
            <div className="tq-sb-counts">
              {completedCount} / {questions.length} done
            </div>
          </div>

          {/* Search */}
          <div className="tq-sb-search-wrap">
            <form onSubmit={handleSearch} className="tq-sb-search-form">
              <input
                ref={searchInputRef}
                className="tq-sb-search-input"
                type="text"
                value={searchInput}
                onChange={e => { setSearchInput(e.target.value); setSearchError('') }}
                placeholder="Q number or p:5"
              />
              <button type="submit" className="tq-sb-search-btn" aria-label="Go">→</button>
            </form>
            {searchError && <p className="tq-sb-search-err">{searchError}</p>}
            <p className="tq-sb-search-hint">e.g. <b>42</b> for Q42 · <b>p:3</b> for page 3</p>
          </div>

          {/* Resume button */}
          {findNextUnanswered() && (
            <button className="tq-resume-btn" onClick={resumeNext}>
              ▶ Resume from next
            </button>
          )}

          {/* Legend */}
          <div className="tq-sb-legend">
            <span className="tq-legend-dot correct" /> Correct
            <span className="tq-legend-dot wrong" /> Wrong
            <span className="tq-legend-dot active" /> Active
            <span className="tq-legend-dot todo" /> Todo
          </div>

          {/* Page tabs */}
          <div className="tq-sb-pages-label">Pages ({totalPages})</div>
          <div className="tq-sb-pages">
            {Array.from({ length: totalPages }, (_, pi) => {
              const pageNum = pi + 1
              const start = pi * QUESTIONS_PER_PAGE
              const end = Math.min(start + QUESTIONS_PER_PAGE, questions.length)
              const pageQs = questions.slice(start, end)
              const pageCorrect = pageQs.filter(q => shownAnswers[q.id] && answers[q.id] === q.correct_answer).length
              const pageWrong = pageQs.filter(q => shownAnswers[q.id] && answers[q.id] !== q.correct_answer).length
              const pageTotal = pageQs.length
              const pageDone = pageCorrect + pageWrong
              const isCurrentPage = pageNum === currentPage

              return (
                <button
                  key={pageNum}
                  className={`tq-page-tab ${isCurrentPage ? 'active' : ''} ${pageDone === pageTotal ? 'done' : ''}`}
                  onClick={() => goToPage(pageNum)}
                >
                  <span className="tq-page-tab-num">Page {pageNum}</span>
                  <span className="tq-page-tab-range">Q{start + 1}–{end}</span>
                  {pageDone > 0 && (
                    <span className="tq-page-tab-bar">
                      <span className="tq-page-tab-correct" style={{ width: `${(pageCorrect / pageTotal) * 100}%` }} />
                      <span className="tq-page-tab-wrong" style={{ width: `${(pageWrong / pageTotal) * 100}%` }} />
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Question grid for current page */}
          <div className="tq-sb-qgrid-label">
            Page {currentPage} · Q{(currentPage - 1) * QUESTIONS_PER_PAGE + 1}–{Math.min(currentPage * QUESTIONS_PER_PAGE, questions.length)}
          </div>
          <div className="tq-sb-qgrid">
            {pageQuestions.map((q, idx) => {
              const globalNum = (currentPage - 1) * QUESTIONS_PER_PAGE + idx + 1
              const shown = shownAnswers[q.id]
              const correct = shown && answers[q.id] === q.correct_answer
              const wrong = shown && answers[q.id] !== q.correct_answer
              const isActive = activeQuestionId === q.id

              let cls = 'tq-qnum-btn'
              if (isActive) cls += ' active'
              else if (correct) cls += ' correct'
              else if (wrong) cls += ' wrong'

              return (
                <button
                  key={q.id}
                  className={cls}
                  onClick={() => scrollToQuestionId(q.id)}
                  title={`Question ${globalNum}`}
                >
                  {globalNum}
                </button>
              )
            })}
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div className="tq-main-wrap">

          {/* Header */}
          <div className="tq-header">
            <div className="tq-header-inner">
              <div>
                <span className="tq-subtitle">Topic Practice</span>
                <h1>{topic?.title || 'Practice Questions'}</h1>
              </div>
              <div className="tq-header-right">
                <span className="tq-page-badge">
                  Page {currentPage} / {totalPages}
                </span>
                <button className="tq-back-btn" onClick={() => navigate('/my-courses')}>
                  ← Back
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <main className="tq-content" ref={contentRef}>

            {pageQuestions.map((q, idx) => {
              const globalNum = (currentPage - 1) * QUESTIONS_PER_PAGE + idx + 1
              const selected = answers[q.id]
              const answerShown = shownAnswers[q.id]
              const correctAnswer = q.correct_answer
              const isCorrect = selected === correctAnswer

              // Next unanswered on this page for the "next" hint
              const nextOnPage = pageQuestions.find((nq, ni) => ni > idx && !shownAnswers[nq.id])

              return (
                <div
                  key={q.id}
                  id={`tq-q-${q.id}`}
                  ref={el => { questionRefs.current[q.id] = el }}
                  className={`tq-question ${activeQuestionId === q.id ? 'tq-question-active' : ''}`}
                >
                  <div className="tq-q-wrap">
                    <span className={`tq-q-number ${answerShown ? (isCorrect ? 'correct' : 'wrong') : ''}`}>
                      {globalNum}
                    </span>
                    <div className="tq-q-text">
                      {q.question_text?.split('\n').map((line, i) => (
                        <p key={i} className="tq-line">
                          <MathText text={line} />
                        </p>
                      ))}
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
                          {value?.split('\n').map((line, i) => (
                            <span key={i} className="tq-line">
                              <MathText text={line} />
                            </span>
                          ))}
                        </span>
                      </label>
                    )
                  })}

                  {!answerShown ? (
                    <button className="tq-show-btn" onClick={() => showAnswer(q.id)}>
                      Show Answer
                    </button>
                  ) : (
                    <div className={`tq-result ${isCorrect ? 'right' : 'wrong'}`}>
                      <div className="tq-result-title">
                        {isCorrect ? '✓ Correct answer' : '✕ Wrong answer'}
                      </div>
                      <p>Correct Answer: <strong>{correctAnswer}</strong></p>
                      {q.explanation && (
                        <div className="tq-explanation">
                          <strong>Explanation:</strong>
                          <div className="tq-explanation-text">
                            {q.explanation?.split('\n').map((line, i) => (
                              <p key={i} className="tq-line">
                                <MathText text={line} />
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Next question hint */}
                      {nextOnPage && (
                        <button
                          className="tq-next-hint"
                          onClick={() => scrollToQuestionId(nextOnPage.id)}
                        >
                          Next: Q{(currentPage - 1) * QUESTIONS_PER_PAGE + pageQuestions.indexOf(nextOnPage) + 1} →
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}

            {/* Page navigation bottom */}
            <div className="tq-pagination">
              <button
                className="tq-pg-btn"
                disabled={currentPage === 1}
                onClick={() => goToPage(currentPage - 1)}
              >
                ← Previous page
              </button>

              <div className="tq-pg-numbers">
                {Array.from({ length: totalPages }, (_, i) => {
                  const p = i + 1
                  // Show first, last, current ±2, and ellipsis
                  const show = p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2
                  const ellipsisBefore = p === currentPage - 3 && currentPage - 3 > 1
                  const ellipsisAfter = p === currentPage + 3 && currentPage + 3 < totalPages

                  if (ellipsisBefore || ellipsisAfter) {
                    return <span key={p} className="tq-pg-ellipsis">…</span>
                  }
                  if (!show) return null

                  return (
                    <button
                      key={p}
                      className={`tq-pg-num ${p === currentPage ? 'active' : ''}`}
                      onClick={() => goToPage(p)}
                    >
                      {p}
                    </button>
                  )
                })}
              </div>

              <button
                className="tq-pg-btn"
                disabled={currentPage === totalPages}
                onClick={() => goToPage(currentPage + 1)}
              >
                Next page →
              </button>
            </div>

          </main>
        </div>
      </div>
    </>
  )
}

function BaseStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

      *, *::before, *::after { box-sizing: border-box; }

      /* ── SHELL ── */
      .tq-shell {
        display: flex;
        height: 100vh;
        padding-top: 68px;
        font-family: 'Plus Jakarta Sans', sans-serif;
        color: #1A3A1A;
        background: #F8FBF8;
        overflow: hidden;
      }

      /* ── LOADING ── */
      .tq-loading {
        min-height: 100vh;
        padding-top: 90px;
        background: #F0FAF0;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 14px;
        font-family: 'Plus Jakarta Sans', sans-serif;
        color: #5A7A5A;
        font-weight: 700;
      }
      .tq-loading-icon { font-size: 2.2rem; }

      /* ── SIDEBAR ── */
      .tq-sidebar {
        width: 230px;
        min-width: 230px;
        background: white;
        border-right: 1.5px solid #C8E6C9;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        overflow-x: hidden;
        padding-bottom: 24px;
      }

      .tq-sb-progress {
        padding: 14px 14px 10px;
        border-bottom: 1px solid #E8F5E9;
      }

      .tq-sb-progress-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 6px;
      }

      .tq-sb-label {
        font-size: 0.7rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: #7A9A7A;
      }

      .tq-sb-pct {
        font-size: 0.75rem;
        font-weight: 800;
        color: #2E7D32;
      }

      .tq-progress-track {
        height: 6px;
        background: #E8F5E9;
        border-radius: 99px;
        overflow: hidden;
        margin-bottom: 5px;
      }

      .tq-progress-fill {
        height: 100%;
        background: #22C55E;
        border-radius: 99px;
        transition: width 0.4s ease;
      }

      .tq-sb-counts {
        font-size: 0.7rem;
        color: #7A9A7A;
        font-weight: 600;
      }

      /* Search */
      .tq-sb-search-wrap {
        padding: 10px 12px 6px;
        border-bottom: 1px solid #E8F5E9;
      }

      .tq-sb-search-form {
        display: flex;
        gap: 6px;
      }

      .tq-sb-search-input {
        flex: 1;
        border: 1.5px solid #D1E9D1;
        border-radius: 8px;
        padding: 6px 10px;
        font-size: 0.8rem;
        font-family: inherit;
        color: #1A3A1A;
        background: #FAFFFE;
        outline: none;
      }

      .tq-sb-search-input:focus {
        border-color: #4CAF50;
      }

      .tq-sb-search-btn {
        background: #2E7D32;
        color: white;
        border: none;
        border-radius: 8px;
        padding: 6px 12px;
        font-size: 0.85rem;
        cursor: pointer;
        font-weight: 900;
      }

      .tq-sb-search-btn:hover { background: #1B5E20; }

      .tq-sb-search-err {
        font-size: 0.68rem;
        color: #EF4444;
        margin-top: 4px;
        font-weight: 700;
      }

      .tq-sb-search-hint {
        font-size: 0.65rem;
        color: #9AB89A;
        margin-top: 4px;
      }

      /* Resume button */
      .tq-resume-btn {
        margin: 8px 12px;
        padding: 8px 12px;
        background: #E8F5E9;
        border: 1.5px solid #4CAF50;
        border-radius: 10px;
        font-size: 0.75rem;
        font-weight: 800;
        color: #2E7D32;
        cursor: pointer;
        font-family: inherit;
        text-align: center;
      }

      .tq-resume-btn:hover { background: #C8E6C9; }

      /* Legend */
      .tq-sb-legend {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
        padding: 6px 12px 8px;
        font-size: 0.65rem;
        color: #7A9A7A;
        font-weight: 700;
        border-bottom: 1px solid #E8F5E9;
      }

      .tq-legend-dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-left: 4px;
      }

      .tq-legend-dot.correct { background: #22C55E; }
      .tq-legend-dot.wrong { background: #EF4444; }
      .tq-legend-dot.active { background: #4CAF50; border: 1.5px solid #2E7D32; }
      .tq-legend-dot.todo { background: #E8F5E9; border: 1.5px solid #C8E6C9; }

      /* Page tabs */
      .tq-sb-pages-label {
        padding: 10px 12px 4px;
        font-size: 0.67rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: #7A9A7A;
      }

      .tq-sb-pages {
        display: flex;
        flex-direction: column;
        gap: 3px;
        padding: 0 8px 8px;
        border-bottom: 1px solid #E8F5E9;
      }

      .tq-page-tab {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 10px;
        border: 1.5px solid #E8F5E9;
        border-radius: 10px;
        background: #FAFFFE;
        cursor: pointer;
        font-family: inherit;
        text-align: left;
        transition: 0.15s;
        position: relative;
        overflow: hidden;
      }

      .tq-page-tab:hover { border-color: #C8E6C9; background: #F1F8F1; }

      .tq-page-tab.active {
        border-color: #4CAF50;
        background: #E8F5E9;
      }

      .tq-page-tab.done {
        border-color: #22C55E;
      }

      .tq-page-tab-num {
        font-size: 0.75rem;
        font-weight: 800;
        color: #2E7D32;
        flex-shrink: 0;
      }

      .tq-page-tab-range {
        font-size: 0.65rem;
        color: #7A9A7A;
        flex: 1;
      }

      .tq-page-tab-bar {
        width: 32px;
        height: 5px;
        border-radius: 99px;
        background: #E8F5E9;
        display: flex;
        overflow: hidden;
        flex-shrink: 0;
      }

      .tq-page-tab-correct {
        background: #22C55E;
        height: 100%;
        transition: width 0.3s;
      }

      .tq-page-tab-wrong {
        background: #EF4444;
        height: 100%;
        transition: width 0.3s;
      }

      /* Q number grid */
      .tq-sb-qgrid-label {
        padding: 10px 12px 4px;
        font-size: 0.67rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: #7A9A7A;
      }

      .tq-sb-qgrid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 4px;
        padding: 0 8px;
      }

      .tq-qnum-btn {
        aspect-ratio: 1;
        border-radius: 8px;
        border: 1.5px solid #E8F5E9;
        background: #FAFFFE;
        font-size: 0.68rem;
        font-weight: 800;
        color: #7A9A7A;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: inherit;
        transition: 0.15s;
      }

      .tq-qnum-btn:hover { border-color: #C8E6C9; color: #2E7D32; }

      .tq-qnum-btn.active {
        background: #E8F5E9;
        border-color: #4CAF50;
        color: #2E7D32;
      }

      .tq-qnum-btn.correct {
        background: #E8F5E9;
        border-color: #22C55E;
        color: #2E7D32;
      }

      .tq-qnum-btn.wrong {
        background: #FEF2F2;
        border-color: #EF4444;
        color: #B91C1C;
      }

      /* ── MAIN WRAP ── */
      .tq-main-wrap {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      /* Header */
      .tq-header {
        background: white;
        border-bottom: 1.5px solid #C8E6C9;
        padding: 14px 24px;
        box-shadow: 0 2px 16px rgba(76,175,80,0.06);
        flex-shrink: 0;
        z-index: 20;
      }

      .tq-header-inner {
        max-width: 860px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
      }

      .tq-header-right {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
      }

      .tq-subtitle {
        font-size: 0.7rem;
        color: #7A9A7A;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        display: block;
      }

      .tq-header h1 {
        margin: 2px 0 0;
        font-family: 'Nunito', sans-serif;
        font-size: 1.05rem;
        font-weight: 900;
        color: #1A3A1A;
      }

      .tq-page-badge {
        background: #E8F5E9;
        border: 1.5px solid #C8E6C9;
        color: #2E7D32;
        font-size: 0.75rem;
        font-weight: 800;
        padding: 6px 14px;
        border-radius: 999px;
      }

      .tq-back-btn {
        background: white;
        border: 1.5px solid #D1E9D1;
        color: #2E7D32;
        font-weight: 800;
        padding: 8px 18px;
        border-radius: 999px;
        cursor: pointer;
        font-family: inherit;
        font-size: 0.82rem;
      }

      .tq-back-btn:hover { background: #F1F8F1; }

      /* Content scroll area */
      .tq-content {
        flex: 1;
        overflow-y: auto;
        padding: 28px 24px 60px;
      }

      /* Question card */
      .tq-question {
        background: white;
        border: 1.5px solid #E8F5E9;
        border-radius: 22px;
        padding: 28px;
        margin-bottom: 20px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.04);
        scroll-margin-top: 24px;
        transition: border-color 0.2s;
        max-width: 860px;
        margin-left: auto;
        margin-right: auto;
      }

      .tq-question.tq-question-active {
        border-color: #4CAF50;
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
        font-size: 0.82rem;
      }

      .tq-q-number.correct {
        background: #E8F5E9;
        border-color: #22C55E;
        color: #2E7D32;
      }

      .tq-q-number.wrong {
        background: #FEF2F2;
        border-color: #EF4444;
        color: #B91C1C;
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

      .tq-option:hover { background: #F1F8F1; border-color: #C8E6C9; }
      .tq-option.selected { background: #E8F5E9; border-color: #4CAF50; }
      .tq-option.correct { background: #E8F5E9; border-color: #22C55E; }
      .tq-option.wrong { background: #FEF2F2; border-color: #EF4444; }
      .tq-option input { display: none; }

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
        font-size: 0.82rem;
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

      .tq-option.selected .tq-option-letter {
        background: #4CAF50;
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
        font-size: 0.9rem;
      }

      .tq-show-btn:hover { opacity: 0.92; }

      .tq-result {
        margin-top: 18px;
        padding: 18px;
        border-radius: 16px;
        line-height: 1.8;
        font-size: 0.9rem;
      }

      .tq-result.right { background: #E8F5E9; border: 1.5px solid #22C55E; }
      .tq-result.wrong { background: #FEF2F2; border: 1.5px solid #EF4444; }

      .tq-result-title {
        font-weight: 900;
        margin-bottom: 6px;
        font-size: 0.95rem;
      }

      .tq-explanation {
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid rgba(0,0,0,0.08);
      }
      
      .tq-explanation-text {
         white-space: pre-line;
      }

      .tq-next-hint {
        margin-top: 12px;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: white;
        border: 1.5px solid #C8E6C9;
        color: #2E7D32;
        font-size: 0.78rem;
        font-weight: 800;
        padding: 7px 16px;
        border-radius: 999px;
        cursor: pointer;
        font-family: inherit;
      }

      .tq-next-hint:hover { background: #E8F5E9; }

      /* ── PAGINATION ── */
      .tq-pagination {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        padding: 24px 0 8px;
        max-width: 860px;
        margin: 0 auto;
        flex-wrap: wrap;
      }

      .tq-pg-btn {
        background: white;
        border: 1.5px solid #C8E6C9;
        color: #2E7D32;
        font-weight: 800;
        padding: 9px 20px;
        border-radius: 999px;
        cursor: pointer;
        font-family: inherit;
        font-size: 0.82rem;
        transition: 0.15s;
      }

      .tq-pg-btn:hover:not(:disabled) { background: #E8F5E9; }
      .tq-pg-btn:disabled { opacity: 0.4; cursor: default; }

      .tq-pg-numbers {
        display: flex;
        align-items: center;
        gap: 4px;
        flex-wrap: wrap;
        justify-content: center;
      }

      .tq-pg-num {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 1.5px solid #E8F5E9;
        background: white;
        color: #5A7A5A;
        font-weight: 800;
        font-size: 0.82rem;
        cursor: pointer;
        font-family: inherit;
        transition: 0.15s;
      }

      .tq-pg-num:hover { border-color: #C8E6C9; color: #2E7D32; }

      .tq-pg-num.active {
        background: #2E7D32;
        border-color: #2E7D32;
        color: white;
      }

      .tq-pg-ellipsis {
        color: #7A9A7A;
        font-weight: 800;
        font-size: 0.9rem;
        padding: 0 2px;
      }

      /* Math styles */
      .math-text {
        display: block;
        white-space: pre-line;
        word-break: normal;
        overflow-wrap: anywhere;
        line-height: 1.9;
      }

      .tq-q-text,
      .tq-option-text,
      .tq-explanation {
        white-space: pre-line;
      }

      .math-text span { display: inline; }
      .katex { font-size: 1.05em !important; }
      .katex-html { white-space: nowrap; }
      .katex-display { overflow-x: auto; overflow-y: hidden; padding: 4px 0; }

      .tq-line {
        display: block;
        margin: 0 0 8px;
        white-space: pre-wrap;
      }

      .tq-option-text .tq-line {
        margin-bottom: 4px;
      }

      /* ── RESPONSIVE ── */
      @media (max-width: 768px) {
        .tq-shell { flex-direction: column; height: auto; overflow: auto; }

        .tq-sidebar {
          width: 100%;
          min-width: unset;
          border-right: none;
          border-bottom: 1.5px solid #C8E6C9;
          max-height: 340px;
        }

        .tq-main-wrap { overflow: visible; }
        .tq-content { overflow: visible; }

        .tq-question { padding: 20px; }
        .tq-q-text { font-size: 0.94rem; }
        .tq-option-text { font-size: 0.9rem; }

        .tq-header { position: sticky; top: 0; z-index: 20; }
      }
    `}</style>
  )
}