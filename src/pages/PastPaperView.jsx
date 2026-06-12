import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getPastPaperQuestions, submitPastPaperMCQ } from '../api/api'
import MathText from '../components/MathText'

const QUESTIONS_PER_PAGE = 20

export default function PastPaperView() {
  const { courseId, paperId } = useParams()
  const navigate = useNavigate()

  const [paper, setPaper] = useState(null)          // { id, part_label, part_number, year, is_mcq }
  const [questions, setQuestions] = useState([])    // MCQ or essay questions
  const [answers, setAnswers] = useState({})        // MCQ: { qId: 'A' | 'B' | ... }
  const [shownAnswers, setShownAnswers] = useState({}) // MCQ: { qId: true }
  const [expandedEssay, setExpandedEssay] = useState({}) // Essay: { qId: true }
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [searchError, setSearchError] = useState('')
  const [activeQuestionId, setActiveQuestionId] = useState(null)

  const questionRefs = useRef({})
  const contentRef = useRef(null)

  const isMCQ = paper?.is_mcq ?? (paper?.part_number === 1)

  const totalPages = isMCQ
    ? Math.ceil(questions.length / QUESTIONS_PER_PAGE)
    : 1

  const pageQuestions = isMCQ
    ? questions.slice((currentPage - 1) * QUESTIONS_PER_PAGE, currentPage * QUESTIONS_PER_PAGE)
    : questions

  // ── Load ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const res = await getPastPaperQuestions(paperId)
        // Expected: { paper: { id, part_label, part_number, year, is_mcq }, questions: [...], attempts: [...] }
        setPaper(res.data.paper)
        setQuestions(res.data.questions)

        if (res.data.paper.is_mcq || res.data.paper.part_number === 1) {
          const savedAnswers = {}
          const savedShown = {}
          ;(res.data.attempts || []).forEach(a => {
            savedAnswers[a.question] = a.selected_answer
            savedShown[a.question] = true
          })
          setAnswers(savedAnswers)
          setShownAnswers(savedShown)
        }
      } catch (err) {
        alert('Could not load paper questions')
        navigate(`/my-courses/${courseId}/past-papers`)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [paperId, courseId, navigate])

  // ── Scroll tracking ───────────────────────────────────────────────────────
  useEffect(() => {
    const container = contentRef.current
    if (!container) return
    function handleScroll() {
      const scrollTop = container.scrollTop
      let found = null
      for (const q of pageQuestions) {
        const el = questionRefs.current[q.id]
        if (el && el.offsetTop - 80 <= scrollTop) found = q.id
      }
      if (found !== null) setActiveQuestionId(found)
    }
    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [pageQuestions])

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0
    setActiveQuestionId(pageQuestions[0]?.id ?? null)
  }, [currentPage]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── MCQ helpers ───────────────────────────────────────────────────────────
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
      await submitPastPaperMCQ({ question_id: questionId, selected_answer: answers[questionId] })
      setShownAnswers(prev => ({ ...prev, [questionId]: true }))
    } catch (err) {
      alert(JSON.stringify(err.response?.data || 'Could not save answer'))
    }
  }

  // ── Navigation ────────────────────────────────────────────────────────────
  function scrollToQuestionId(qId) {
    const el = questionRefs.current[qId]
    if (el && contentRef.current) {
      contentRef.current.scrollTo({ top: el.offsetTop - 24, behavior: 'smooth' })
      setActiveQuestionId(qId)
    }
  }

  function goToQuestionNumber(num) {
    if (num < 1 || num > questions.length) return false
    const targetPage = Math.ceil(num / QUESTIONS_PER_PAGE)
    const targetQ = questions[num - 1]
    if (targetPage !== currentPage) {
      setCurrentPage(targetPage)
      setTimeout(() => scrollToQuestionId(targetQ.id), 80)
    } else {
      scrollToQuestionId(targetQ.id)
    }
    return true
  }

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
    const pageMatch = raw.match(/^p(?:age)?:?\s*(\d+)$/i)
    if (pageMatch) {
      const p = parseInt(pageMatch[1])
      if (!goToPage(p)) setSearchError(`Page ${p} doesn't exist (1–${totalPages})`)
      else setSearchInput('')
      return
    }
    const num = parseInt(raw)
    if (isNaN(num) || num < 1) {
      setSearchError('Enter a question number or "p:5" for page 5')
      return
    }
    if (!goToQuestionNumber(num)) setSearchError(`Q${num} doesn't exist (1–${questions.length})`)
    else setSearchInput('')
  }

  function findNextUnanswered() {
    return questions.find(q => !shownAnswers[q.id]) || null
  }

  function resumeNext() {
    const next = findNextUnanswered()
    if (!next) return
    goToQuestionNumber(questions.indexOf(next) + 1)
  }

  const completedCount = Object.keys(shownAnswers).length
  const progressPct = questions.length > 0
    ? Math.round((completedCount / questions.length) * 100)
    : 0

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <BaseStyles />
        <main className="ppv-loading">
          <div className="ppv-loading-icon">📄</div>
          <p>Loading paper…</p>
        </main>
      </>
    )
  }

  // ── MCQ View ──────────────────────────────────────────────────────────────
  if (isMCQ) {
    return (
      <>
        <BaseStyles />
        <div className="ppv-shell">

          {/* ── Sidebar ── */}
          <aside className="ppv-sidebar">

            {/* Progress */}
            <div className="ppv-sb-progress">
              <div className="ppv-sb-progress-top">
                <span className="ppv-sb-label">Progress</span>
                <span className="ppv-sb-pct">{progressPct}%</span>
              </div>
              <div className="ppv-progress-track">
                <div className="ppv-progress-fill" style={{ width: `${progressPct}%` }} />
              </div>
              <div className="ppv-sb-counts">{completedCount} / {questions.length} done</div>
            </div>

            {/* Search */}
            <div className="ppv-sb-search-wrap">
              <form onSubmit={handleSearch} className="ppv-sb-search-form">
                <input
                  className="ppv-sb-search-input"
                  type="text"
                  value={searchInput}
                  onChange={e => { setSearchInput(e.target.value); setSearchError('') }}
                  placeholder="Q number or p:5"
                />
                <button type="submit" className="ppv-sb-search-btn" aria-label="Go">→</button>
              </form>
              {searchError && <p className="ppv-sb-search-err">{searchError}</p>}
              <p className="ppv-sb-search-hint">e.g. <b>12</b> for Q12 · <b>p:2</b> for page 2</p>
            </div>

            {/* Resume */}
            {findNextUnanswered() && (
              <button className="ppv-resume-btn" onClick={resumeNext}>
                ▶ Resume from next
              </button>
            )}

            {/* Legend */}
            <div className="ppv-sb-legend">
              <span className="ppv-legend-dot correct" /> Correct
              <span className="ppv-legend-dot wrong" /> Wrong
              <span className="ppv-legend-dot active" /> Active
              <span className="ppv-legend-dot todo" /> Todo
            </div>

            {/* Pages */}
            <div className="ppv-sb-pages-label">Pages ({totalPages})</div>
            <div className="ppv-sb-pages">
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
                    className={`ppv-page-tab ${isCurrentPage ? 'active' : ''} ${pageDone === pageTotal ? 'done' : ''}`}
                    onClick={() => goToPage(pageNum)}
                  >
                    <span className="ppv-page-tab-num">Page {pageNum}</span>
                    <span className="ppv-page-tab-range">Q{start + 1}–{end}</span>
                    {pageDone > 0 && (
                      <span className="ppv-page-tab-bar">
                        <span className="ppv-page-tab-correct" style={{ width: `${(pageCorrect / pageTotal) * 100}%` }} />
                        <span className="ppv-page-tab-wrong" style={{ width: `${(pageWrong / pageTotal) * 100}%` }} />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Question grid */}
            <div className="ppv-sb-qgrid-label">
              Page {currentPage} · Q{(currentPage - 1) * QUESTIONS_PER_PAGE + 1}–{Math.min(currentPage * QUESTIONS_PER_PAGE, questions.length)}
            </div>
            <div className="ppv-sb-qgrid">
              {pageQuestions.map((q, idx) => {
                const globalNum = (currentPage - 1) * QUESTIONS_PER_PAGE + idx + 1
                const shown = shownAnswers[q.id]
                const correct = shown && answers[q.id] === q.correct_answer
                const wrong = shown && answers[q.id] !== q.correct_answer
                const isActive = activeQuestionId === q.id
                let cls = 'ppv-qnum-btn'
                if (isActive) cls += ' active'
                else if (correct) cls += ' correct'
                else if (wrong) cls += ' wrong'
                return (
                  <button key={q.id} className={cls} onClick={() => scrollToQuestionId(q.id)} title={`Q${globalNum}`}>
                    {globalNum}
                  </button>
                )
              })}
            </div>

          </aside>

          {/* ── Main ── */}
          <div className="ppv-main-wrap">
            <div className="ppv-header">
              <div className="ppv-header-inner">
                <div>
                  <span className="ppv-header-year">{paper?.year} Past Paper</span>
                  <h1>{paper?.part_label || `Part ${paper?.part_number}`}</h1>
                </div>
                <div className="ppv-header-right">
                  <span className="ppv-page-badge">Page {currentPage} / {totalPages}</span>
                  <button className="ppv-back-btn" onClick={() => navigate(`/my-courses/${courseId}/past-papers`)}>
                    ← Back
                  </button>
                </div>
              </div>
            </div>

            <main className="ppv-content" ref={contentRef}>
              {pageQuestions.map((q, idx) => {
                const globalNum = (currentPage - 1) * QUESTIONS_PER_PAGE + idx + 1
                const selected = answers[q.id]
                const answerShown = shownAnswers[q.id]
                const correctAnswer = q.correct_answer
                const isCorrect = selected === correctAnswer
                const nextOnPage = pageQuestions.find((nq, ni) => ni > idx && !shownAnswers[nq.id])

                return (
                  <div
                    key={q.id}
                    ref={el => { questionRefs.current[q.id] = el }}
                    className={`ppv-question ${activeQuestionId === q.id ? 'ppv-question-active' : ''}`}
                  >
                    <div className="ppv-q-wrap">
                      <span className={`ppv-q-number ${answerShown ? (isCorrect ? 'correct' : 'wrong') : ''}`}>
                        {globalNum}
                      </span>
                      <div className="ppv-q-text">
                        {q.question_text?.split('\n').map((line, i) => (
                          <p key={i} className="ppv-line"><MathText text={line} /></p>
                        ))}
                      </div>
                    </div>

                    {/* 5 options: A B C D E */}
                    {['A', 'B', 'C', 'D', 'E'].map(opt => {
                      const value = q[`option_${opt.toLowerCase()}`]
                      if (!value && value !== 0) return null
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
                          className={`ppv-option ${optionClass}`}
                          onClick={() => selectAnswer(q.id, opt)}
                        >
                          <input type="radio" name={`pp-q-${q.id}`} checked={isSelected} disabled={answerShown} onChange={() => selectAnswer(q.id, opt)} />
                          <span className="ppv-option-letter">{opt}</span>
                          <span className="ppv-option-text">
                            {value?.toString().split('\n').map((line, i) => (
                              <span key={i} className="ppv-line"><MathText text={line} /></span>
                            ))}
                          </span>
                        </label>
                      )
                    })}

                    {!answerShown ? (
                      <button className="ppv-show-btn" onClick={() => showAnswer(q.id)}>
                        Show Answer
                      </button>
                    ) : (
                      <div className={`ppv-result ${isCorrect ? 'right' : 'wrong'}`}>
                        <div className="ppv-result-title">
                          {isCorrect ? '✓ Correct answer' : '✕ Wrong answer'}
                        </div>
                        <p>Correct Answer: <strong>{correctAnswer}</strong></p>
                        {q.explanation && (
                          <div className="ppv-explanation">
                            <strong>Explanation:</strong>
                            <div className="ppv-explanation-text">
                              {q.explanation?.split('\n').map((line, i) => (
                                <p key={i} className="ppv-line"><MathText text={line} /></p>
                              ))}
                            </div>
                          </div>
                        )}
                        {nextOnPage && (
                          <button className="ppv-next-hint" onClick={() => scrollToQuestionId(nextOnPage.id)}>
                            Next: Q{(currentPage - 1) * QUESTIONS_PER_PAGE + pageQuestions.indexOf(nextOnPage) + 1} →
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="ppv-pagination">
                  <button className="ppv-pg-btn" disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>
                    ← Previous
                  </button>
                  <div className="ppv-pg-numbers">
                    {Array.from({ length: totalPages }, (_, i) => {
                      const p = i + 1
                      const show = p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2
                      const ellipsisBefore = p === currentPage - 3 && currentPage - 3 > 1
                      const ellipsisAfter = p === currentPage + 3 && currentPage + 3 < totalPages
                      if (ellipsisBefore || ellipsisAfter) return <span key={p} className="ppv-pg-ellipsis">…</span>
                      if (!show) return null
                      return (
                        <button key={p} className={`ppv-pg-num ${p === currentPage ? 'active' : ''}`} onClick={() => goToPage(p)}>
                          {p}
                        </button>
                      )
                    })}
                  </div>
                  <button className="ppv-pg-btn" disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)}>
                    Next →
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      </>
    )
  }

  // ── Essay View ────────────────────────────────────────────────────────────
  return (
    <>
      <BaseStyles />
      <div className="ppv-essay-shell">

        {/* Header */}
        <div className="ppv-essay-header">
          <div className="ppv-essay-header-inner">
            <div>
              <span className="ppv-header-year">{paper?.year} Past Paper</span>
              <h1>{paper?.part_label || `Part ${paper?.part_number}`}</h1>
            </div>
            <button className="ppv-back-btn" onClick={() => navigate(`/my-courses/${courseId}/past-papers`)}>
              ← Back
            </button>
          </div>
        </div>

        {/* Info banner */}
        <div className="ppv-essay-banner">
          <div className="ppv-essay-banner-inner">
            <span className="ppv-essay-banner-icon">✍️</span>
            <div>
              <strong>Structured / Essay Section</strong>
              <p>Tap "Show Answer" on each question to reveal the model answer below.</p>
            </div>
            <span className="ppv-essay-count">{questions.length} Q</span>
          </div>
        </div>

        {/* Questions */}
        <main className="ppv-essay-content" ref={contentRef}>
          {questions.map((q, idx) => {
            const isExpanded = expandedEssay[q.id]
            return (
              <div
                key={q.id}
                ref={el => { questionRefs.current[q.id] = el }}
                className="ppv-essay-question"
                style={{ animationDelay: `${idx * 0.06}s` }}
              >
                {/* Question number + marks */}
                <div className="ppv-essay-q-head">
                  <span className="ppv-essay-q-num">{idx + 1}</span>
                  {q.marks && (
                    <span className="ppv-essay-marks">{q.marks} mark{q.marks !== 1 ? 's' : ''}</span>
                  )}
                </div>

                {/* Question text */}
                <div className="ppv-essay-q-text">
                  {q.question_text?.split('\n').map((line, i) => (
                    <p key={i} className="ppv-line"><MathText text={line} /></p>
                  ))}
                </div>

                {/* Sub-questions if present */}
                {q.sub_questions && q.sub_questions.length > 0 && (
                  <div className="ppv-essay-subqs">
                    {q.sub_questions.map((sub, si) => (
                      <div key={si} className="ppv-essay-subq">
                        <span className="ppv-essay-subq-label">({String.fromCharCode(97 + si)})</span>
                        <div className="ppv-essay-subq-text">
                          {sub.text?.split('\n').map((line, i) => (
                            <p key={i} className="ppv-line"><MathText text={line} /></p>
                          ))}
                        </div>
                        {sub.marks && (
                          <span className="ppv-essay-sub-marks">[{sub.marks}]</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Toggle answer */}
                {!isExpanded ? (
                  <button
                    className="ppv-essay-show-btn"
                    onClick={() => setExpandedEssay(prev => ({ ...prev, [q.id]: true }))}
                  >
                    Show Model Answer ↓
                  </button>
                ) : (
                  <div className="ppv-essay-answer-block">
                    <div className="ppv-essay-answer-header">
                      <span className="ppv-essay-answer-badge">📋 Model Answer</span>
                      <button
                        className="ppv-essay-hide-btn"
                        onClick={() => setExpandedEssay(prev => ({ ...prev, [q.id]: false }))}
                      >
                        Hide ↑
                      </button>
                    </div>
                    <div className="ppv-essay-answer-body">
                      {q.answer?.split('\n').map((line, i) => (
                        <p key={i} className="ppv-line"><MathText text={line} /></p>
                      ))}
                    </div>
                    {/* Sub-answers */}
                    {q.sub_questions && q.sub_questions.some(s => s.answer) && (
                      <div className="ppv-essay-sub-answers">
                        {q.sub_questions.map((sub, si) => sub.answer ? (
                          <div key={si} className="ppv-essay-sub-answer">
                            <span className="ppv-essay-subq-label">({String.fromCharCode(97 + si)})</span>
                            <div className="ppv-essay-subq-text">
                              {sub.answer?.split('\n').map((line, i) => (
                                <p key={i} className="ppv-line"><MathText text={line} /></p>
                              ))}
                            </div>
                          </div>
                        ) : null)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </main>
      </div>
    </>
  )
}

function BaseStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(16px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      /* ── Loading ── */
      .ppv-loading {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 14px;
        background: #F8FBF8;
        font-family: 'Plus Jakarta Sans', sans-serif;
        color: #5A7A5A;
        font-weight: 700;
      }
      .ppv-loading-icon { font-size: 2.2rem; }

      /* ════════════════════════════════
         MCQ LAYOUT
      ════════════════════════════════ */

      .ppv-shell {
        display: flex;
        height: 100vh;
        padding-top: 68px;
        font-family: 'Plus Jakarta Sans', sans-serif;
        color: #1A3A1A;
        background: #F8FBF8;
        overflow: hidden;
      }

      /* Sidebar */
      .ppv-sidebar {
        width: 230px;
        min-width: 230px;
        background: white;
        border-right: 1.5px solid #BFDBFE;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        overflow-x: hidden;
        padding-bottom: 24px;
      }

      .ppv-sb-progress {
        padding: 14px 14px 10px;
        border-bottom: 1px solid #EFF6FF;
      }

      .ppv-sb-progress-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 6px;
      }

      .ppv-sb-label {
        font-size: 0.7rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: #7A9ABB;
      }

      .ppv-sb-pct {
        font-size: 0.75rem;
        font-weight: 800;
        color: #1D4ED8;
      }

      .ppv-progress-track {
        height: 6px;
        background: #EFF6FF;
        border-radius: 99px;
        overflow: hidden;
        margin-bottom: 5px;
      }

      .ppv-progress-fill {
        height: 100%;
        background: #3B82F6;
        border-radius: 99px;
        transition: width 0.4s ease;
      }

      .ppv-sb-counts {
        font-size: 0.7rem;
        color: #7A9ABB;
        font-weight: 600;
      }

      .ppv-sb-search-wrap {
        padding: 10px 12px 6px;
        border-bottom: 1px solid #EFF6FF;
      }

      .ppv-sb-search-form {
        display: flex;
        gap: 5px;
        margin-bottom: 4px;
      }

      .ppv-sb-search-input {
        flex: 1;
        border: 1.5px solid #BFDBFE;
        border-radius: 8px;
        padding: 7px 10px;
        font-size: 0.78rem;
        font-family: 'Plus Jakarta Sans', sans-serif;
        color: #1A3A1A;
        outline: none;
        background: #F8FBFF;
      }

      .ppv-sb-search-input:focus { border-color: #3B82F6; }

      .ppv-sb-search-btn {
        background: linear-gradient(135deg, #3B82F6, #1D4ED8);
        color: white;
        border: none;
        border-radius: 8px;
        width: 32px;
        font-size: 0.9rem;
        cursor: pointer;
        font-family: inherit;
        flex-shrink: 0;
      }

      .ppv-sb-search-err {
        font-size: 0.68rem;
        color: #EF4444;
        font-weight: 600;
        margin-top: 3px;
      }

      .ppv-sb-search-hint {
        font-size: 0.67rem;
        color: #9AB8DD;
        margin-top: 3px;
      }

      .ppv-resume-btn {
        margin: 8px 12px;
        background: linear-gradient(135deg, #3B82F6, #1D4ED8);
        color: white;
        border: none;
        border-radius: 8px;
        padding: 9px 14px;
        font-size: 0.76rem;
        font-weight: 700;
        cursor: pointer;
        font-family: inherit;
        text-align: left;
      }

      .ppv-sb-legend {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 6px 10px;
        padding: 8px 12px;
        font-size: 0.67rem;
        color: #7A9ABB;
        font-weight: 600;
        border-bottom: 1px solid #EFF6FF;
      }

      .ppv-legend-dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
      }
      .ppv-legend-dot.correct { background: #22C55E; }
      .ppv-legend-dot.wrong   { background: #EF4444; }
      .ppv-legend-dot.active  { background: #3B82F6; }
      .ppv-legend-dot.todo    { background: #E5E7EB; border: 1px solid #CBD5E1; }

      .ppv-sb-pages-label {
        font-size: 0.68rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: #7A9ABB;
        padding: 10px 12px 4px;
      }

      .ppv-sb-pages {
        display: flex;
        flex-direction: column;
        gap: 3px;
        padding: 0 8px;
      }

      .ppv-page-tab {
        background: transparent;
        border: 1.5px solid transparent;
        border-radius: 9px;
        padding: 8px 10px 6px;
        cursor: pointer;
        font-family: inherit;
        text-align: left;
        transition: 0.15s;
        display: flex;
        flex-direction: column;
        gap: 3px;
      }

      .ppv-page-tab:hover { background: #EFF6FF; }
      .ppv-page-tab.active { background: #EFF6FF; border-color: #BFDBFE; }
      .ppv-page-tab.done { opacity: 0.7; }

      .ppv-page-tab-num {
        font-size: 0.72rem;
        font-weight: 800;
        color: #1D4ED8;
      }

      .ppv-page-tab-range {
        font-size: 0.65rem;
        color: #7A9ABB;
        font-weight: 600;
      }

      .ppv-page-tab-bar {
        display: flex;
        height: 3px;
        background: #EFF6FF;
        border-radius: 99px;
        overflow: hidden;
        margin-top: 2px;
      }

      .ppv-page-tab-correct {
        height: 100%;
        background: #22C55E;
        border-radius: 99px;
        transition: width 0.3s;
      }

      .ppv-page-tab-wrong {
        height: 100%;
        background: #EF4444;
        transition: width 0.3s;
      }

      .ppv-sb-qgrid-label {
        font-size: 0.67rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #7A9ABB;
        padding: 10px 12px 4px;
      }

      .ppv-sb-qgrid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 4px;
        padding: 0 8px;
      }

      .ppv-qnum-btn {
        height: 28px;
        border-radius: 6px;
        border: 1.5px solid #EFF6FF;
        background: #FAFCFF;
        font-size: 0.65rem;
        font-weight: 700;
        cursor: pointer;
        font-family: inherit;
        color: #5A7A9A;
        transition: 0.12s;
      }

      .ppv-qnum-btn:hover { background: #EFF6FF; border-color: #BFDBFE; }
      .ppv-qnum-btn.active  { background: #3B82F6; border-color: #3B82F6; color: white; }
      .ppv-qnum-btn.correct { background: #DCFCE7; border-color: #86EFAC; color: #166534; }
      .ppv-qnum-btn.wrong   { background: #FEE2E2; border-color: #FCA5A5; color: #991B1B; }

      /* Main */
      .ppv-main-wrap {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .ppv-header {
        background: white;
        border-bottom: 1.5px solid #BFDBFE;
        padding: 0;
        position: sticky;
        top: 0;
        z-index: 10;
      }

      .ppv-header-inner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 28px;
        max-width: 100%;
      }

      .ppv-header-year {
        display: block;
        font-size: 0.7rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.07em;
        color: #3B82F6;
        margin-bottom: 2px;
      }

      .ppv-header-inner h1 {
        font-family: 'Nunito', sans-serif;
        font-weight: 900;
        font-size: 1.25rem;
        color: #1A3A1A;
        letter-spacing: -0.01em;
        line-height: 1.1;
      }

      .ppv-header-right {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .ppv-page-badge {
        background: #EFF6FF;
        color: #1D4ED8;
        font-weight: 800;
        font-size: 0.78rem;
        padding: 5px 14px;
        border-radius: 50px;
        border: 1.5px solid #BFDBFE;
      }

      .ppv-back-btn {
        background: white;
        border: 1.5px solid #BFDBFE;
        color: #1D4ED8;
        border-radius: 50px;
        padding: 7px 16px;
        font-size: 0.8rem;
        font-weight: 700;
        cursor: pointer;
        font-family: 'Plus Jakarta Sans', sans-serif;
        transition: background 0.16s;
        white-space: nowrap;
      }

      .ppv-back-btn:hover { background: #EFF6FF; }

      .ppv-content {
        flex: 1;
        overflow-y: auto;
        padding: 28px 28px 60px;
      }

      /* Questions */
      .ppv-question {
        background: white;
        border-radius: 20px;
        border: 1.5px solid #EFF6FF;
        padding: 28px 26px;
        margin-bottom: 20px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.03);
        animation: fadeUp 0.3s ease both;
        transition: border-color 0.2s, box-shadow 0.2s;
      }

      .ppv-question-active {
        border-color: #BFDBFE;
        box-shadow: 0 4px 22px rgba(59,130,246,0.10);
      }

      .ppv-q-wrap {
        display: flex;
        align-items: flex-start;
        gap: 14px;
        margin-bottom: 18px;
      }

      .ppv-q-number {
        width: 32px;
        height: 32px;
        min-width: 32px;
        border-radius: 50%;
        background: #EFF6FF;
        border: 1.5px solid #BFDBFE;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
        color: #1D4ED8;
        font-size: 0.82rem;
      }

      .ppv-q-number.correct { background: #DCFCE7; border-color: #22C55E; color: #166534; }
      .ppv-q-number.wrong   { background: #FEE2E2; border-color: #EF4444; color: #991B1B; }

      .ppv-q-text {
        flex: 1;
        font-size: 1rem;
        font-weight: 700;
        line-height: 1.9;
        color: #1A3A1A;
        word-break: break-word;
        overflow-wrap: anywhere;
      }

      .ppv-option {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        border: 1.5px solid #EFF6FF;
        border-radius: 14px;
        padding: 13px 15px;
        margin-bottom: 9px;
        cursor: pointer;
        background: #FAFCFF;
        transition: 0.18s;
      }

      .ppv-option:hover { background: #EFF6FF; border-color: #BFDBFE; }
      .ppv-option.selected { background: #EFF6FF; border-color: #3B82F6; }
      .ppv-option.correct  { background: #DCFCE7; border-color: #22C55E; }
      .ppv-option.wrong    { background: #FEE2E2; border-color: #EF4444; }
      .ppv-option input    { display: none; }

      .ppv-option-letter {
        width: 28px;
        height: 28px;
        min-width: 28px;
        border-radius: 50%;
        background: white;
        border: 1.5px solid #BFDBFE;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
        color: #1D4ED8;
        font-size: 0.82rem;
      }

      .ppv-option.correct .ppv-option-letter { background: #22C55E; color: white; border-color: transparent; }
      .ppv-option.wrong   .ppv-option-letter { background: #EF4444; color: white; border-color: transparent; }
      .ppv-option.selected .ppv-option-letter { background: #3B82F6; color: white; border-color: transparent; }

      .ppv-option-text {
        flex: 1;
        font-size: 0.95rem;
        line-height: 1.8;
        color: #2A4A6A;
        word-break: break-word;
        overflow-wrap: anywhere;
      }

      .ppv-show-btn {
        margin-top: 14px;
        background: linear-gradient(135deg, #3B82F6, #1D4ED8);
        color: white;
        border: none;
        padding: 12px 26px;
        border-radius: 999px;
        font-weight: 900;
        cursor: pointer;
        font-family: inherit;
        box-shadow: 0 4px 18px rgba(59,130,246,0.3);
        font-size: 0.9rem;
      }
      .ppv-show-btn:hover { opacity: 0.92; }

      .ppv-result {
        margin-top: 18px;
        padding: 18px;
        border-radius: 16px;
        line-height: 1.8;
        font-size: 0.9rem;
      }

      .ppv-result.right { background: #DCFCE7; border: 1.5px solid #22C55E; }
      .ppv-result.wrong { background: #FEE2E2; border: 1.5px solid #EF4444; }

      .ppv-result-title { font-weight: 900; margin-bottom: 6px; font-size: 0.95rem; }

      .ppv-explanation {
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid rgba(0,0,0,0.08);
      }

      .ppv-explanation-text { white-space: pre-line; }

      .ppv-next-hint {
        margin-top: 12px;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: white;
        border: 1.5px solid #BFDBFE;
        color: #1D4ED8;
        font-size: 0.78rem;
        font-weight: 800;
        padding: 7px 16px;
        border-radius: 999px;
        cursor: pointer;
        font-family: inherit;
      }
      .ppv-next-hint:hover { background: #EFF6FF; }

      .ppv-pagination {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        padding: 24px 0 8px;
        flex-wrap: wrap;
      }

      .ppv-pg-btn {
        background: white;
        border: 1.5px solid #BFDBFE;
        color: #1D4ED8;
        font-weight: 800;
        padding: 9px 20px;
        border-radius: 999px;
        cursor: pointer;
        font-family: inherit;
        font-size: 0.82rem;
        transition: 0.15s;
      }
      .ppv-pg-btn:hover:not(:disabled) { background: #EFF6FF; }
      .ppv-pg-btn:disabled { opacity: 0.4; cursor: default; }

      .ppv-pg-numbers { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; justify-content: center; }

      .ppv-pg-num {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 1.5px solid #EFF6FF;
        background: white;
        color: #5A7A9A;
        font-weight: 800;
        font-size: 0.82rem;
        cursor: pointer;
        font-family: inherit;
        transition: 0.15s;
      }
      .ppv-pg-num:hover { border-color: #BFDBFE; color: #1D4ED8; }
      .ppv-pg-num.active { background: #1D4ED8; border-color: #1D4ED8; color: white; }
      .ppv-pg-ellipsis { color: #7A9ABB; font-weight: 800; font-size: 0.9rem; padding: 0 2px; }

      /* ════════════════════════════════
         ESSAY LAYOUT
      ════════════════════════════════ */

      .ppv-essay-shell {
        min-height: 100vh;
        padding-top: 68px;
        background: #F8FBFF;
        font-family: 'Plus Jakarta Sans', sans-serif;
        color: #1A3A1A;
      }

      .ppv-essay-header {
        background: white;
        border-bottom: 1.5px solid #BFDBFE;
        position: sticky;
        top: 68px;
        z-index: 10;
      }

      .ppv-essay-header-inner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 28px;
        max-width: 860px;
        margin: 0 auto;
      }

      .ppv-essay-header-inner h1 {
        font-family: 'Nunito', sans-serif;
        font-weight: 900;
        font-size: 1.25rem;
        color: #1A3A1A;
        letter-spacing: -0.01em;
        line-height: 1.1;
      }

      .ppv-essay-banner {
        background: linear-gradient(135deg, #EFF6FF 0%, #F5F8FF 100%);
        border-bottom: 1.5px solid #BFDBFE;
        padding: 18px 28px;
      }

      .ppv-essay-banner-inner {
        display: flex;
        align-items: center;
        gap: 16px;
        max-width: 860px;
        margin: 0 auto;
      }

      .ppv-essay-banner-icon {
        font-size: 1.6rem;
        flex-shrink: 0;
      }

      .ppv-essay-banner-inner strong {
        display: block;
        font-weight: 800;
        color: #1D4ED8;
        font-size: 0.92rem;
        margin-bottom: 2px;
      }

      .ppv-essay-banner-inner p {
        font-size: 0.8rem;
        color: #4A6A8A;
      }

      .ppv-essay-count {
        margin-left: auto;
        background: #1D4ED8;
        color: white;
        font-weight: 800;
        font-size: 0.78rem;
        padding: 6px 14px;
        border-radius: 50px;
        flex-shrink: 0;
      }

      .ppv-essay-content {
        max-width: 860px;
        margin: 0 auto;
        padding: 36px 28px 80px;
      }

      .ppv-essay-question {
        background: white;
        border-radius: 22px;
        border: 1.5px solid #EFF6FF;
        padding: 30px 28px;
        margin-bottom: 22px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        animation: fadeUp 0.35s ease both;
        transition: border-color 0.2s;
      }

      .ppv-essay-question:hover { border-color: #BFDBFE; }

      .ppv-essay-q-head {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
      }

      .ppv-essay-q-num {
        width: 34px;
        height: 34px;
        min-width: 34px;
        border-radius: 50%;
        background: linear-gradient(135deg, #3B82F6, #1D4ED8);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
        font-size: 0.88rem;
      }

      .ppv-essay-marks {
        background: #FEF9E7;
        border: 1.5px solid #FDE68A;
        color: #B45309;
        font-weight: 800;
        font-size: 0.72rem;
        padding: 3px 11px;
        border-radius: 50px;
      }

      .ppv-essay-q-text {
        font-size: 1rem;
        font-weight: 700;
        line-height: 1.85;
        color: #1A3A1A;
        margin-bottom: 16px;
      }

      /* Sub-questions */
      .ppv-essay-subqs {
        margin-bottom: 16px;
        padding-left: 16px;
        border-left: 3px solid #BFDBFE;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }

      .ppv-essay-subq {
        display: flex;
        gap: 10px;
        align-items: flex-start;
      }

      .ppv-essay-subq-label {
        font-weight: 800;
        color: #1D4ED8;
        font-size: 0.88rem;
        min-width: 24px;
        padding-top: 2px;
      }

      .ppv-essay-subq-text {
        flex: 1;
        font-size: 0.92rem;
        line-height: 1.75;
        color: #2A4A6A;
      }

      .ppv-essay-sub-marks {
        font-size: 0.72rem;
        color: #B45309;
        font-weight: 700;
        padding-top: 4px;
        white-space: nowrap;
      }

      /* Show answer button */
      .ppv-essay-show-btn {
        margin-top: 6px;
        background: linear-gradient(135deg, #3B82F6, #1D4ED8);
        color: white;
        border: none;
        padding: 12px 28px;
        border-radius: 999px;
        font-weight: 800;
        cursor: pointer;
        font-family: 'Plus Jakarta Sans', sans-serif;
        box-shadow: 0 4px 18px rgba(59,130,246,0.28);
        font-size: 0.88rem;
        transition: opacity 0.15s;
      }
      .ppv-essay-show-btn:hover { opacity: 0.9; }

      /* Answer block */
      .ppv-essay-answer-block {
        margin-top: 18px;
        background: #EFF6FF;
        border: 1.5px solid #BFDBFE;
        border-radius: 16px;
        overflow: hidden;
        animation: fadeUp 0.22s ease;
      }

      .ppv-essay-answer-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 18px;
        background: #DBEAFE;
        border-bottom: 1.5px solid #BFDBFE;
      }

      .ppv-essay-answer-badge {
        font-weight: 800;
        font-size: 0.82rem;
        color: #1D4ED8;
      }

      .ppv-essay-hide-btn {
        background: white;
        border: 1.5px solid #BFDBFE;
        color: #1D4ED8;
        font-size: 0.75rem;
        font-weight: 700;
        padding: 4px 12px;
        border-radius: 50px;
        cursor: pointer;
        font-family: inherit;
      }
      .ppv-essay-hide-btn:hover { background: #EFF6FF; }

      .ppv-essay-answer-body {
        padding: 18px 20px;
        font-size: 0.92rem;
        line-height: 1.9;
        color: #1A3A4A;
        white-space: pre-line;
      }

      .ppv-essay-sub-answers {
        padding: 0 20px 18px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        border-top: 1.5px solid #BFDBFE;
        padding-top: 14px;
        margin-top: 4px;
      }

      .ppv-essay-sub-answer {
        display: flex;
        gap: 10px;
        align-items: flex-start;
      }

      /* Shared line */
      .ppv-line {
        display: block;
        margin: 0 0 8px;
        white-space: pre-wrap;
      }

      /* KaTeX */
      .math-text { display: block; white-space: pre-line; word-break: normal; overflow-wrap: anywhere; line-height: 1.9; }
      .math-text span { display: inline; }
      .katex { font-size: 1.05em !important; }
      .katex-html { white-space: nowrap; }
      .katex-display { overflow-x: auto; overflow-y: hidden; padding: 4px 0; }

      /* ── Responsive ── */
      @media (max-width: 768px) {
        .ppv-shell { flex-direction: column; height: auto; overflow: auto; }
        .ppv-sidebar { width: 100%; min-width: unset; border-right: none; border-bottom: 1.5px solid #BFDBFE; max-height: 320px; }
        .ppv-main-wrap { overflow: visible; }
        .ppv-content { overflow: visible; padding: 18px 14px 40px; }
        .ppv-question { padding: 20px; }
        .ppv-header { position: sticky; top: 0; z-index: 20; }
        .ppv-header-inner { padding: 12px 16px; }

        .ppv-essay-header-inner { padding: 12px 16px; }
        .ppv-essay-content { padding: 22px 14px 60px; }
        .ppv-essay-question { padding: 20px 16px; }
        .ppv-essay-banner { padding: 14px 16px; }
      }
    `}</style>
  )
}