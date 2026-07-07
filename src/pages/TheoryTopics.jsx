import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getTheoryMainTopics } from '../api/api'

// ─── Main component ─────────────────────────────────────────────────────────
// Route:  /my-courses/:courseId/theory
// Sits between CourseOverview and TheoryViewer:
//   CourseOverview → TheoryTopics (this page, Main Topics) → TheoryViewer (sub-topics 1.1, 1.2…)
//
// API expected:
//   getTheoryMainTopics(courseId) → { subject: { id, title, icon }, mainTopics: [{ id, title, ordering, subtopicCount }] }

export default function TheoryTopics() {
  const { courseId } = useParams()
  const navigate = useNavigate()

  const [subject,    setSubject]    = useState(null)
  const [mainTopics, setMainTopics] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(false)
      try {
        const res = await getTheoryMainTopics(courseId)
        setSubject(res.data.subject)
        setMainTopics(res.data.mainTopics ?? [])
      } catch (err) {
        console.error(err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [courseId])

  return (
    <>
      <BaseStyles />
      <style>{`
        .tt-card {
          background: white;
          border-radius: 22px;
          border: 1.5px solid #E8F5E9;
          padding: 26px 24px;
          display: flex;
          align-items: center;
          gap: 18px;
          cursor: pointer;
          box-shadow: 0 2px 14px rgba(0,0,0,0.04);
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
          animation: fadeUp 0.4s ease both;
          text-align: left;
          width: 100%;
        }
        .tt-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 36px rgba(0,0,0,0.08);
          border-color: #A5D6A7;
        }
        .tt-num {
          flex-shrink: 0;
          width: 48px; height: 48px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 1.05rem;
          background: linear-gradient(135deg, #E8F5E9 0%, #F0FAF0 100%);
          border: 1.5px solid #C8E6C9; color: #2E7D32;
        }
        .tt-title {
          font-family: 'Nunito', sans-serif; font-weight: 800;
          font-size: 1.03rem; color: #1A3A1A; margin-bottom: 4px; line-height: 1.3;
        }
        .tt-meta {
          font-size: 0.78rem; color: #7A9A7A; font-weight: 600;
        }
        .tt-arrow {
          flex-shrink: 0; font-size: 1.2rem; color: #A5D6A7; transition: transform 0.2s;
        }
        .tt-card:hover .tt-arrow { transform: translateX(4px); color: #2E7D32; }
      `}</style>

      <main style={{
        minHeight: '100vh',
        background: '#F8FBF8',
        paddingTop: 68,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: '#1A3A1A',
      }}>

        {/* ── Hero strip ── */}
        <section style={{
          background: 'linear-gradient(135deg, #ECFEFF 0%, #F0FEFF 100%)',
          borderBottom: '1.5px solid #A5F3FC',
          padding: '44px 24px 40px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'radial-gradient(circle, rgba(6,182,212,0.11) 1.5px, transparent 1.5px)',
            backgroundSize: '28px 28px',
            maskImage: 'radial-gradient(ellipse 80% 100% at 0% 50%, black 0%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 100% at 0% 50%, black 0%, transparent 75%)',
          }} />

          <div style={{ maxWidth: 780, margin: '0 auto', position: 'relative' }}>

            <button
              onClick={() => navigate(`/my-courses/${courseId}/overview`)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'white', color: '#0E7490',
                border: '1.5px solid #A5F3FC', borderRadius: 50,
                padding: '6px 16px', fontSize: '0.8rem', fontWeight: 700,
                cursor: 'pointer', marginBottom: 20,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                transition: 'background 0.16s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#ECFEFF'}
              onMouseLeave={e => e.currentTarget.style.background = 'white'}
            >
              ← Back to Course
            </button>

            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: '#ECFEFF', color: '#0E7490',
              fontWeight: 700, fontSize: '0.75rem',
              padding: '4px 13px', borderRadius: 50,
              letterSpacing: '0.07em', textTransform: 'uppercase',
              marginBottom: 14, border: '1.5px solid #A5F3FC',
            }}>
              📖 Theory
            </div>

            <h1 style={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
              color: '#1A3A1A', letterSpacing: '-0.02em',
              marginBottom: 8, lineHeight: 1.1,
            }}>
              {subject?.title ?? 'Theory'}
            </h1>
            <p style={{ fontSize: '0.95rem', color: '#5A7A5A' }}>
              Pick a main topic to explore its sub-topics.
            </p>
          </div>
        </section>

        {/* ── Main topics list ── */}
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '40px 24px 80px' }}>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: '2.2rem', marginBottom: 12 }}>📖</div>
              <p style={{ color: '#5A7A5A', fontWeight: 600, fontSize: '0.95rem' }}>Loading topics…</p>
            </div>
          ) : error ? (
            <div style={{
              textAlign: 'center', padding: '56px 24px',
              background: 'white', borderRadius: 20, border: '1.5px solid #FECACA',
            }}>
              <div style={{ fontSize: '2.4rem', marginBottom: 12 }}>⚠️</div>
              <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: '1.1rem', marginBottom: 8 }}>
                Couldn't load theory topics
              </h3>
              <p style={{ color: '#7A9A7A', fontSize: '0.9rem' }}>Please try again in a moment.</p>
            </div>
          ) : mainTopics.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '64px 24px',
              background: 'white', borderRadius: 20, border: '1.5px solid #E8F5E9',
            }}>
              <div style={{ fontSize: '2.6rem', marginBottom: 12 }}>📚</div>
              <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: '1.1rem', marginBottom: 8 }}>
                No theory topics yet
              </h3>
              <p style={{ color: '#7A9A7A', fontSize: '0.9rem' }}>
                Your teacher hasn't added theory content for this course yet.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {mainTopics.map((topic, i) => (
                <button
                  key={topic.id}
                  className="tt-card"
                  style={{ animationDelay: `${i * 0.05}s` }}
                  onClick={() => navigate(`/my-courses/${courseId}/theory/${topic.id}`)}
                >
                  <div className="tt-num">{String(i + 1).padStart(2, '0')}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="tt-title">{topic.title}</div>
                    {typeof topic.subtopicCount === 'number' && (
                      <div className="tt-meta">
                        {topic.subtopicCount} sub-topic{topic.subtopicCount === 1 ? '' : 's'}
                      </div>
                    )}
                  </div>
                  <span className="tt-arrow">→</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}

function BaseStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(18px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `}</style>
  )
}