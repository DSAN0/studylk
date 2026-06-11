import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getSubjectTopics, getTopicTheorySections } from '../api/api'
import MathText from '../components/MathText'

// ─── Section type callout config ───────────────────────────────────────────
const SECTION_TYPES = {
  text:       { bg: null,       border: null,       color: null,      label: null,         icon: null  },
  definition: { bg: '#EFF6FF',  border: '#BFDBFE',  color: '#1D4ED8', label: 'Definition', icon: '📘' },
  example:    { bg: '#FFFBEB',  border: '#FDE68A',  color: '#92400E', label: 'Example',    icon: '📝' },
  note:       { bg: '#FEF9E7',  border: '#FCD34D',  color: '#B45309', label: 'Note',       icon: '💡' },
  important:  { bg: '#FEF2F2',  border: '#FECACA',  color: '#991B1B', label: 'Important',  icon: '⚠️' },
  formula:    { bg: '#F0FDF4',  border: '#BBF7D0',  color: '#15803D', label: 'Formula',    icon: '🔢' },
  summary:    { bg: '#F5F3FF',  border: '#DDD6FE',  color: '#6D28D9', label: 'Summary',    icon: '📋' },
}

// ─── Main component ─────────────────────────────────────────────────────────
// Route:  /my-courses/:courseId/subjects/:subjectId/theory
// API expected:
//   getSubjectTopics(subjectId)  → { subject: { id, title, icon }, topics: [{ id, title, order }] }
//   getTopicTheorySections(topicId) → { sections: [{ id, title, content, type, order }] }

export default function TheoryViewer() {
  const { courseId } = useParams()

  console.log("Course ID:", courseId)
  console.log("Params:", useParams())
  
  const navigate = useNavigate()

  const [subject,        setSubject]        = useState(null)
  const [topics,         setTopics]         = useState([])
  const [activeTopic,    setActiveTopic]    = useState(null)
  const [sections,       setSections]       = useState([])
  const [readTopics,     setReadTopics]     = useState(new Set())
  const [loadingTopics,  setLoadingTopics]  = useState(true)
  const [loadingSections,setLoadingSections]= useState(false)
  const [sidebarOpen,    setSidebarOpen]    = useState(false)  // mobile drawer

  const contentRef = useRef(null)
  const STORAGE_KEY = `studylk_theory_read_${courseId}`

  // ── Load topics on mount ─────────────────────────────────────────────────
  useEffect(() => {
    async function loadTopics() {
      try {
        const res = await getSubjectTopics(courseId)
        setSubject(res.data.subject)
        const tList = res.data.topics ?? []
        setTopics(tList)

        // Restore localStorage read state
        try {
          const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
          setReadTopics(new Set(stored))
        } catch { /* ignore parse errors */ }

        // Auto-select first topic
        if (tList.length > 0) {
          await loadSections(tList[0])
          setActiveTopic(tList[0])
        }
      } catch (err) {
        console.error(err)
        navigate(-1)
      } finally {
        setLoadingTopics(false)
      }
    }
    loadTopics()
  }, [courseId]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Fetch sections for a topic ───────────────────────────────────────────
  async function loadSections(topic) {
    setLoadingSections(true)
    setSections([])
    if (contentRef.current) contentRef.current.scrollTo({ top: 0, behavior: 'instant' })
    try {
      const res = await getTopicTheorySections(topic.id)
      setSections(res.data.sections ?? [])
    } catch (err) {
      console.error(err)
      setSections([])
    } finally {
      setLoadingSections(false)
    }
  }

  // ── Select a topic from the sidebar ─────────────────────────────────────
  async function selectTopic(topic) {
    // Mark previous topic as read
    if (activeTopic && activeTopic.id !== topic.id) markAsRead(activeTopic.id)

    setActiveTopic(topic)
    setSidebarOpen(false)
    await loadSections(topic)
  }

  function markAsRead(topicId) {
    setReadTopics(prev => {
      const next = new Set([...prev, topicId])
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...next])) } catch { /* ignore */ }
      return next
    })
  }

  // ── Prev / Next navigation ────────────────────────────────────────────────
  const activeIndex = topics.findIndex(t => t.id === activeTopic?.id)
  const prevTopic   = activeIndex > 0 ? topics[activeIndex - 1] : null
  const nextTopic   = activeIndex < topics.length - 1 ? topics[activeIndex + 1] : null

  function handleNext() {
    if (activeTopic) markAsRead(activeTopic.id)
    if (nextTopic) selectTopic(nextTopic)
  }
  function handlePrev() {
    if (prevTopic) selectTopic(prevTopic)
  }

  const readCount    = topics.filter(t => readTopics.has(t.id)).length
  const progressPct  = topics.length > 0 ? Math.round((readCount / topics.length) * 100) : 0
  const allRead      = topics.length > 0 && readCount === topics.length

  // ── Loading screen ────────────────────────────────────────────────────────
  if (loadingTopics) {
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
          <div style={{ fontSize: '2.2rem' }}>📖</div>
          <p style={{ color: '#5A7A5A', fontWeight: 600, fontSize: '0.95rem' }}>Loading theory…</p>
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

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <>
      <BaseStyles />

      <style>{`
        /* ── Shell ─────────────────────────────────────────────── */
        .tv-shell {
          display: flex;
          height: 100vh;
          padding-top: 68px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #1A3A1A;
          background: #F8FBF8;
        }

        /* ── Sidebar ───────────────────────────────────────────── */
        .tv-sidebar {
          width: 272px;
          min-width: 272px;
          border-right: 1.5px solid #C8E6C9;
          background: white;
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
        }

        .tv-sb-header {
          padding: 20px 18px 16px;
          border-bottom: 1.5px solid #E8F5E9;
          flex-shrink: 0;
        }

        .tv-sb-back-btn {
          display: inline-flex; align-items: center; gap: 5px;
          background: none; border: none; cursor: pointer;
          color: #7A9A7A; font-size: 0.77rem; font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif;
          padding: 0; margin-bottom: 14px;
          transition: color 0.15s;
        }
        .tv-sb-back-btn:hover { color: #2E7D32; }

        .tv-sb-subject-pill {
          display: inline-flex; align-items: center; gap: 6px;
          background: #E8F5E9; border: 1.5px solid #C8E6C9;
          border-radius: 50px; padding: 4px 12px 4px 8px;
          margin-bottom: 12px;
        }
        .tv-sb-subject-icon  { font-size: 1rem; }
        .tv-sb-subject-name  {
          font-size: 0.78rem; font-weight: 800;
          color: #2E7D32; letter-spacing: 0.02em;
        }

        .tv-sb-progress-row {
          display: flex; justify-content: space-between;
          align-items: center; margin-bottom: 7px;
        }
        .tv-sb-progress-label {
          font-size: 0.7rem; font-weight: 800; color: #9ABA9A;
          text-transform: uppercase; letter-spacing: 0.07em;
        }
        .tv-sb-progress-pct {
          font-size: 0.8rem; font-weight: 800; color: #2E7D32;
        }
        .tv-progress-track {
          height: 5px; background: #E8F5E9; border-radius: 3px; overflow: hidden;
        }
        .tv-progress-fill {
          height: 100%; border-radius: 3px;
          background: linear-gradient(90deg, #4CAF50, #2E7D32);
          transition: width 0.4s ease;
        }
        .tv-sb-counts {
          margin-top: 5px; font-size: 0.7rem; color: #AACAAA; font-weight: 600;
        }

        /* Topic list */
        .tv-sb-list {
          flex: 1; overflow-y: auto; padding: 8px 8px 20px;
        }
        .tv-sb-list::-webkit-scrollbar { width: 4px; }
        .tv-sb-list::-webkit-scrollbar-thumb { background: #C8E6C9; border-radius: 2px; }

        .tv-sb-list-label {
          font-size: 0.67rem; font-weight: 800; color: #C0D8C0;
          text-transform: uppercase; letter-spacing: 0.1em;
          padding: 8px 10px 5px;
        }

        .tv-topic-btn {
          display: flex; align-items: flex-start; gap: 10px;
          width: 100%; text-align: left;
          background: none; border: none;
          padding: 9px 10px; border-radius: 12px;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.87rem; font-weight: 600;
          color: #4A6A4A; line-height: 1.4;
          transition: background 0.15s, color 0.15s;
        }
        .tv-topic-btn:hover:not(.active) { background: #F1F8F1; color: #2E7D32; }
        .tv-topic-btn.active {
          background: #E8F5E9; color: #1A3A1A; font-weight: 700;
        }

        .tv-topic-dot {
          width: 7px; height: 7px; min-width: 7px;
          border-radius: 50%; background: #D8EDD8;
          flex-shrink: 0; margin-top: 5px;
          transition: background 0.2s, box-shadow 0.2s;
        }
        .tv-topic-btn.read    .tv-topic-dot { background: #4CAF50; }
        .tv-topic-btn.active  .tv-topic-dot {
          background: #2E7D32;
          box-shadow: 0 0 0 3px rgba(76,175,80,0.22);
        }

        .tv-topic-num {
          display: block; font-size: 0.66rem; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.05em;
          margin-bottom: 1px; color: #AACAAA;
        }
        .tv-topic-btn.active .tv-topic-num { color: #4CAF50; }

        .tv-topic-check {
          margin-left: auto; flex-shrink: 0;
          font-size: 0.7rem; color: #4CAF50; align-self: center;
          margin-top: 0;
        }

        /* ── Main area ─────────────────────────────────────────── */
        .tv-main {
          flex: 1; display: flex; flex-direction: column;
          height: 100%; overflow: hidden; min-width: 0;
        }

        .tv-topbar {
          background: white;
          border-bottom: 1.5px solid #C8E6C9;
          padding: 12px 28px;
          display: flex; align-items: center; gap: 14px;
          box-shadow: 0 2px 10px rgba(76,175,80,0.06);
          flex-shrink: 0;
        }
        .tv-topbar-mobile-toggle {
          display: none;
          background: #E8F5E9; border: 1.5px solid #C8E6C9;
          color: #2E7D32; font-weight: 700; font-size: 0.8rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          padding: 7px 13px; border-radius: 10px;
          cursor: pointer; flex-shrink: 0;
        }
        .tv-topbar-info { flex: 1; min-width: 0; }
        .tv-topbar-sub {
          font-size: 0.7rem; font-weight: 700; color: #9ABA9A;
          text-transform: uppercase; letter-spacing: 0.07em;
          display: block; margin-bottom: 1px;
        }
        .tv-topbar-title {
          font-family: 'Nunito', sans-serif;
          font-weight: 900; font-size: 1rem;
          color: #1A3A1A; white-space: nowrap;
          overflow: hidden; text-overflow: ellipsis;
        }

        /* ── Scrollable content ────────────────────────────────── */
        .tv-content-scroll {
          flex: 1; overflow-y: auto;
          padding: 40px 36px 70px;
        }
        .tv-content-scroll::-webkit-scrollbar { width: 6px; }
        .tv-content-scroll::-webkit-scrollbar-thumb { background: #C8E6C9; border-radius: 3px; }

        .tv-content-inner { max-width: 760px; margin: 0 auto; }

        /* Topic heading */
        .tv-topic-heading {
          margin-bottom: 32px;
          padding-bottom: 22px;
          border-bottom: 2px solid #E8F5E9;
        }
        .tv-topic-eyebrow {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 0.7rem; font-weight: 800; color: #4CAF50;
          text-transform: uppercase; letter-spacing: 0.09em;
          margin-bottom: 9px;
        }
        .tv-topic-h1 {
          font-family: 'Nunito', sans-serif;
          font-weight: 900;
          font-size: clamp(1.5rem, 3vw, 2.1rem);
          color: #1A3A1A; line-height: 1.15;
          letter-spacing: -0.015em;
        }

        /* Theory sections */
        .tv-section {
          margin-bottom: 26px;
          animation: fadeUp 0.3s ease both;
        }
        .tv-section-h2 {
          font-family: 'Nunito', sans-serif;
          font-weight: 900; font-size: 1.1rem;
          color: #1A3A1A; margin-bottom: 10px; margin-top: 30px;
          display: flex; align-items: center; gap: 8px;
        }
        .tv-section-h2::before {
          content: '';
          display: inline-block;
          width: 4px; height: 18px; border-radius: 2px;
          background: linear-gradient(180deg, #4CAF50, #2E7D32);
          flex-shrink: 0;
        }

        .tv-text-content {
          font-size: 0.97rem; line-height: 1.95;
          color: #3A5A3A; white-space: pre-line;
        }

        /* Callout boxes */
        .tv-callout {
          border-radius: 16px;
          padding: 18px 20px;
          position: relative;
          overflow: hidden;
        }
        .tv-callout::before {
          content: '';
          position: absolute; left: 0; top: 0; bottom: 0;
          width: 4px; border-radius: 4px 0 0 4px;
          background: currentColor;
          opacity: 0.6;
        }
        .tv-callout-label {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 0.7rem; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.09em;
          margin-bottom: 10px; opacity: 0.7;
        }
        .tv-callout-body {
          font-size: 0.96rem; line-height: 1.85;
          white-space: pre-line;
        }

        /* Prev / Next nav */
        .tv-nav-footer {
          display: flex; justify-content: space-between;
          align-items: center; gap: 12px; flex-wrap: wrap;
          margin-top: 52px; padding-top: 28px;
          border-top: 2px solid #E8F5E9;
        }
        .tv-nav-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 11px 20px; border-radius: 50px;
          font-size: 0.87rem; font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer; border: 1.5px solid #C8E6C9;
          background: white; color: #3A5A3A;
          transition: background 0.16s, border-color 0.16s, transform 0.16s;
          max-width: 240px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .tv-nav-btn:hover:not(:disabled) {
          background: #F1F8F1; border-color: #A5D6A7; transform: translateY(-1px);
        }
        .tv-nav-btn.primary {
          background: linear-gradient(135deg, #4CAF50, #2E7D32);
          color: white; border-color: transparent;
          box-shadow: 0 4px 16px rgba(76,175,80,0.3);
        }
        .tv-nav-btn.primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(76,175,80,0.42);
        }
        .tv-nav-btn:disabled { opacity: 0.3; cursor: default; transform: none; }

        /* Completion banner */
        .tv-done-badge {
          display: inline-flex; align-items: center; gap: 7px;
          background: linear-gradient(135deg, #E8F5E9, #F0FDF4);
          border: 1.5px solid #A5D6A7; border-radius: 50px;
          padding: 11px 20px; font-size: 0.87rem; font-weight: 700;
          color: #2E7D32;
        }

        /* Loading spinner inside content */
        .tv-section-loading {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 12px; padding: 72px 0;
          animation: fadeUp 0.25s ease;
        }

        /* Empty state */
        .tv-empty {
          text-align: center; padding: 64px 24px;
          background: white; border-radius: 20px;
          border: 1.5px solid #E8F5E9;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        }

        /* ── Mobile ────────────────────────────────────────────── */
        .tv-mobile-overlay {
          display: none; position: fixed; inset: 0;
          z-index: 100; background: rgba(0,0,0,0.38);
        }
        .tv-mobile-drawer {
          display: none; position: fixed;
          top: 0; left: 0; bottom: 0; width: 280px;
          z-index: 110; background: white;
          border-right: 1.5px solid #C8E6C9;
          flex-direction: column; overflow: hidden;
          transform: translateX(-100%);
          transition: transform 0.24s cubic-bezier(.4,0,.2,1);
        }

        @media (max-width: 768px) {
          .tv-shell {
            display: block; height: auto;
            min-height: 100vh; overflow: auto;
          }
          .tv-sidebar { display: none; }
          .tv-main { height: auto; overflow: visible; }
          .tv-topbar { padding: 10px 16px; }
          .tv-topbar-mobile-toggle { display: flex; }
          .tv-content-scroll { overflow: visible; padding: 24px 16px 60px; }
          .tv-mobile-overlay.open { display: block; }
          .tv-mobile-drawer       { display: flex; }
          .tv-mobile-drawer.open  { transform: translateX(0); }
        }
      `}</style>

      <div className="tv-shell">

        {/* ── Desktop Sidebar ──────────────────────────────────── */}
        <aside className="tv-sidebar">
          <SidebarInner
            subject={subject}
            topics={topics}
            activeTopic={activeTopic}
            readTopics={readTopics}
            readCount={readCount}
            progressPct={progressPct}
            onSelectTopic={selectTopic}
            onBack={() => navigate(-1)}
          />
        </aside>

        {/* ── Mobile Drawer ────────────────────────────────────── */}
        <div
          className={`tv-mobile-overlay ${sidebarOpen ? 'open' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />
        <div className={`tv-mobile-drawer ${sidebarOpen ? 'open' : ''}`}>
          <SidebarInner
            subject={subject}
            topics={topics}
            activeTopic={activeTopic}
            readTopics={readTopics}
            readCount={readCount}
            progressPct={progressPct}
            onSelectTopic={selectTopic}
            onBack={() => navigate(-1)}
          />
        </div>

        {/* ── Main ─────────────────────────────────────────────── */}
        <div className="tv-main">

          {/* Sticky top bar */}
          <div className="tv-topbar">
            <button
              className="tv-topbar-mobile-toggle"
              onClick={() => setSidebarOpen(o => !o)}
            >
              ☰ Topics
            </button>

            <div className="tv-topbar-info">
              <span className="tv-topbar-sub">📖 Theory</span>
              <div className="tv-topbar-title">
                {activeTopic ? activeTopic.title : (subject?.title ?? '')}
              </div>
            </div>

            {/* Mini progress pill */}
            {topics.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <div style={{
                  width: 72, height: 5, background: '#E8F5E9', borderRadius: 3, overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%', borderRadius: 3,
                    background: 'linear-gradient(90deg, #4CAF50, #2E7D32)',
                    width: `${progressPct}%`, transition: 'width 0.4s ease',
                  }} />
                </div>
                <span style={{
                  fontSize: '0.73rem', fontWeight: 700, color: '#7A9A7A', whiteSpace: 'nowrap',
                }}>
                  {readCount}/{topics.length}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="tv-content-scroll" ref={contentRef}>
            <div className="tv-content-inner">

              {loadingSections ? (
                <div className="tv-section-loading">
                  <div style={{ fontSize: '2rem' }}>📄</div>
                  <p style={{ color: '#5A7A5A', fontWeight: 600, fontSize: '0.9rem' }}>
                    Loading sections…
                  </p>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[0,1,2].map(i => (
                      <div key={i} style={{
                        width: 7, height: 7, borderRadius: '50%', background: '#4CAF50',
                        animation: `bounce 1.2s ${i * 0.2}s infinite`,
                      }} />
                    ))}
                  </div>
                </div>
              ) : !activeTopic ? (
                <div className="tv-empty">
                  <div style={{ fontSize: '2.8rem', marginBottom: 12 }}>📚</div>
                  <p style={{ color: '#5A7A5A', fontWeight: 600 }}>No topics added yet.</p>
                </div>
              ) : sections.length === 0 ? (
                <div className="tv-empty">
                  <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📭</div>
                  <h3 style={{
                    fontFamily: "'Nunito', sans-serif", fontWeight: 900,
                    fontSize: '1.2rem', color: '#1A3A1A', marginBottom: 8,
                  }}>
                    No sections yet
                  </h3>
                  <p style={{ color: '#7A9A7A', fontSize: '0.9rem' }}>
                    Theory content for this topic hasn't been added yet.
                  </p>
                </div>
              ) : (
                <>
                  {/* ── Topic heading ── */}
                  <div className="tv-topic-heading">
                    <div className="tv-topic-eyebrow">
                      📖 Topic {activeIndex + 1} of {topics.length}
                    </div>
                    <h1 className="tv-topic-h1">{activeTopic.title}</h1>
                  </div>

                  {/* ── Theory sections ── */}
                  {sections.map((section, i) => (
                    <TheorySection
                      key={section.id}
                      section={section}
                      delay={i * 0.05}
                    />
                  ))}

                  {/* ── Nav footer ── */}
                  <div className="tv-nav-footer">
                    <button
                      className="tv-nav-btn"
                      onClick={handlePrev}
                      disabled={!prevTopic}
                    >
                      ← {prevTopic ? truncate(prevTopic.title, 22) : 'Previous'}
                    </button>

                    {nextTopic ? (
                      <button className="tv-nav-btn primary" onClick={handleNext}>
                        {truncate(nextTopic.title, 22)} →
                      </button>
                    ) : (
                      <div className="tv-done-badge">
                        🎉 {allRead ? 'All topics read!' : 'Last topic — well done!'}
                      </div>
                    )}
                  </div>
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Sidebar inner (used for both desktop and mobile drawer) ─────────────────
function SidebarInner({
  subject, topics, activeTopic, readTopics,
  readCount, progressPct, onSelectTopic, onBack,
}) {
  return (
    <>
      <div className="tv-sb-header">
        <button className="tv-sb-back-btn" onClick={onBack}>
          ← Back to course
        </button>

        {/* Subject pill */}
        <div className="tv-sb-subject-pill">
          {subject?.icon && <span className="tv-sb-subject-icon">{subject.icon}</span>}
          <span className="tv-sb-subject-name">{subject?.title ?? 'Theory'}</span>
        </div>

        {/* Progress */}
        <div className="tv-sb-progress-row">
          <span className="tv-sb-progress-label">Progress</span>
          <span className="tv-sb-progress-pct">{progressPct}%</span>
        </div>
        <div className="tv-progress-track">
          <div className="tv-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="tv-sb-counts">{readCount} / {topics.length} topics read</div>
      </div>

      {/* Topic list */}
      <div className="tv-sb-list">
        {topics.length === 0 ? (
          <p style={{
            padding: '24px 12px', fontSize: '0.85rem',
            color: '#A0C0A0', textAlign: 'center',
          }}>
            No topics available.
          </p>
        ) : (
          <>
            <div className="tv-sb-list-label">Topics</div>
            {topics.map((topic, i) => {
              const isActive = activeTopic?.id === topic.id
              const isRead   = readTopics.has(topic.id)
              return (
                <button
                  key={topic.id}
                  className={[
                    'tv-topic-btn',
                    isActive ? 'active' : '',
                    isRead   ? 'read'   : '',
                  ].join(' ')}
                  onClick={() => onSelectTopic(topic)}
                >
                  <span className="tv-topic-dot" />
                  <span style={{ flex: 1 }}>
                    <span className="tv-topic-num">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {topic.title}
                  </span>
                  {isRead && !isActive && (
                    <span className="tv-topic-check">✓</span>
                  )}
                </button>
              )
            })}
          </>
        )}
      </div>
    </>
  )
}

// ─── Single theory section ────────────────────────────────────────────────────
function TheorySection({ section, delay }) {
  const type = SECTION_TYPES[section.type] ?? SECTION_TYPES.text

  return (
    <div className="tv-section" style={{ animationDelay: `${delay}s` }}>

      {/* Section heading (optional) */}
      {section.title && (
        <h2 className="tv-section-h2">{section.title}</h2>
      )}

      {/* Plain text */}
      {!type.bg ? (
        <div className="tv-text-content">
          <MathText text={section.content} />
        </div>
      ) : (
        /* Callout box */
        <div
          className="tv-callout"
          style={{
            background: type.bg,
            border: `1.5px solid ${type.border}`,
            color: type.color,
          }}
        >
          <div className="tv-callout-label">
            {type.icon} {type.label}
          </div>
          <div className="tv-callout-body" style={{ color: type.color }}>
            <MathText text={section.content} />
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Utility ─────────────────────────────────────────────────────────────────
function truncate(str, max) {
  return str && str.length > max ? str.slice(0, max - 1) + '…' : str
}

// ─── Shared base styles (font imports + keyframes) ────────────────────────────
function BaseStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50%       { transform: translateY(-8px); }
      }
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(12px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `}</style>
  )
}