import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getStreams, getSubjects, getCourses } from '../api/api'

const STREAM_CONFIG = {
  science:    { icon: '🔬', color: '#4CAF50', bg: '#F1F8F1', border: '#C8E6C9', light: '#E8F5E9', tag: 'Science' },
  commerce:   { icon: '📊', color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A', light: '#FEF9E7', tag: 'Commerce' },
  arts:       { icon: '🎨', color: '#3B82F6', bg: '#EFF6FF', border: '#BFDBFE', light: '#EBF5FF', tag: 'Arts' },
  technology: { icon: '⚙️', color: '#8B5CF6', bg: '#F5F3FF', border: '#DDD6FE', light: '#F3F0FF', tag: 'Technology' },
}

export default function Subjects() {
  const { streamId } = useParams()
  const navigate = useNavigate()

  const [stream, setStream] = useState(null)
  const [subjects, setSubjects] = useState([])
  const [courseCounts, setCourseCounts] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const streamsRes = await getStreams()
        const subjectsRes = await getSubjects(streamId)
        const selectedStream = streamsRes.data.find(s => s.id === streamId)
        setStream(selectedStream || null)
        setSubjects(subjectsRes.data)

        const counts = {}
        await Promise.all(
          subjectsRes.data.map(async subject => {
            try {
              const coursesRes = await getCourses(streamId, subject.id)
              counts[subject.id] = coursesRes.data.length
            } catch {
              counts[subject.id] = 0
            }
          })
        )
        setCourseCounts(counts)
      } catch (err) {
        console.error(err)
        setStream(null)
        setSubjects([])
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [streamId])

  const cfg = STREAM_CONFIG[streamId] || STREAM_CONFIG.science
  const totalCourses = Object.values(courseCounts).reduce((a, b) => a + b, 0)

  /* ── Loading ── */
  if (loading) {
    return (
      <>
        <LoadingStyles />
        <div style={{
          minHeight: '100vh', paddingTop: 68,
          background: 'linear-gradient(160deg, #F0FAF0 0%, #FAFFFE 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 16,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
          <div style={{ fontSize: '2.5rem' }}>📚</div>
          <p style={{ color: '#5A7A5A', fontWeight: 600, fontSize: '0.95rem' }}>Loading subjects…</p>
          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: '50%', background: '#4CAF50',
                animation: `bounce 1.2s ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
        </div>
      </>
    )
  }

  /* ── Not found ── */
  if (!stream) {
    return (
      <>
        <LoadingStyles />
        <div style={{
          minHeight: '100vh', paddingTop: 68,
          background: 'linear-gradient(160deg, #F0FAF0 0%, #FAFFFE 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🔍</div>
            <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: '1.8rem', color: '#1A3A1A', marginBottom: 10 }}>
              Stream not found
            </h2>
            <p style={{ color: '#5A7A5A', marginBottom: 28 }}>The stream you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/streams')}
              style={{
                background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                color: 'white', fontWeight: 700, fontSize: '0.95rem',
                padding: '12px 26px', borderRadius: 50, border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 18px rgba(76,175,80,0.3)',
              }}
            >
              ← Back to streams
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .subjects-root {
          min-height: 100vh;
          background: #F8FBF8;
          padding-top: 68px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #1A3A1A;
        }

        .subjects-hero {
          padding: 48px 24px 44px;
          border-bottom: 1.5px solid;
          position: relative;
          overflow: hidden;
        }
        .subjects-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(76,175,80,0.1) 1.5px, transparent 1.5px);
          background-size: 28px 28px;
          mask-image: radial-gradient(ellipse 80% 100% at 0% 50%, black 0%, transparent 75%);
          -webkit-mask-image: radial-gradient(ellipse 80% 100% at 0% 50%, black 0%, transparent 75%);
          pointer-events: none;
        }

        .subjects-hero-inner {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          font-weight: 600;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }
        .breadcrumb-link {
          color: #7A9A7A;
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          font-size: inherit;
          font-weight: inherit;
          padding: 0;
          transition: color 0.18s;
        }
        .breadcrumb-link:hover { color: #2E7D32; }
        .breadcrumb-sep { color: #B0C4B0; }
        .breadcrumb-current { color: #2E7D32; }

        .subjects-header-row {
          display: flex;
          align-items: flex-start;
          gap: 18px;
          margin-bottom: 14px;
        }

        .subjects-icon-box {
          width: 64px;
          height: 64px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.9rem;
          border: 1.5px solid;
          flex-shrink: 0;
        }

        .subjects-stream-badge {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          padding: 4px 12px;
          border-radius: 50px;
          border: 1.5px solid;
          margin-bottom: 8px;
        }

        .subjects-title {
          font-family: 'Nunito', sans-serif;
          font-weight: 900;
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          color: #1A3A1A;
          letter-spacing: -0.02em;
          line-height: 1.1;
          margin: 0;
        }

        .subjects-desc {
          font-size: 0.95rem;
          color: #5A7A5A;
          line-height: 1.7;
          max-width: 500px;
          margin-bottom: 24px;
        }

        .subjects-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .stat-pill {
          font-size: 0.82rem;
          font-weight: 700;
          padding: 6px 16px;
          border-radius: 50px;
          background: white;
          border: 1.5px solid;
          color: inherit;
        }

        /* Subject grid */
        .subjects-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 48px 24px 80px;
        }

        .subjects-section-label {
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: #7A9A7A;
          margin-bottom: 20px;
        }

        .subjects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        .subject-card {
          background: white;
          border-radius: 20px;
          padding: 28px 24px;
          cursor: pointer;
          border: 1.5px solid #E8F5E9;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
          transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
          display: flex;
          flex-direction: column;
          animation: fadeUp 0.4s ease both;
        }
        .subject-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 14px 40px rgba(0,0,0,0.09);
        }

        .subject-icon {
          font-size: 2.2rem;
          margin-bottom: 16px;
          display: block;
        }

        .subject-name {
          font-family: 'Nunito', sans-serif;
          font-weight: 900;
          font-size: 1.1rem;
          color: #1A3A1A;
          margin-bottom: 8px;
          transition: color 0.18s;
        }
        .subject-card:hover .subject-name { color: var(--stream-color); }

        .subject-desc {
          font-size: 0.86rem;
          color: #5A7A5A;
          line-height: 1.65;
          flex: 1;
          margin-bottom: 20px;
        }

        .subject-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 16px;
          border-top: 1.5px solid #F0F7F0;
          font-size: 0.82rem;
          font-weight: 600;
        }

        .subject-count {
          color: #7A9A7A;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .subject-arrow {
          font-weight: 700;
          font-size: 0.85rem;
          transition: gap 0.18s;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .subject-card:hover .subject-arrow { gap: 8px; }

        /* Empty state */
        .empty-state {
          text-align: center;
          padding: 60px 32px;
          background: white;
          border-radius: 24px;
          border: 1.5px solid #E8F5E9;
          box-shadow: 0 2px 14px rgba(0,0,0,0.04);
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .subject-card:nth-child(1) { animation-delay: 0.04s; }
        .subject-card:nth-child(2) { animation-delay: 0.1s; }
        .subject-card:nth-child(3) { animation-delay: 0.16s; }
        .subject-card:nth-child(4) { animation-delay: 0.22s; }
        .subject-card:nth-child(5) { animation-delay: 0.28s; }
        .subject-card:nth-child(6) { animation-delay: 0.34s; }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-8px); }
        }
      `}</style>

      <main className="subjects-root" style={{ '--stream-color': cfg.color }}>

        {/* ── Hero ── */}
        <section
          className="subjects-hero"
          style={{
            background: `linear-gradient(135deg, ${cfg.light} 0%, #FAFFFE 100%)`,
            borderColor: cfg.border,
          }}
        >
          <div className="subjects-hero-inner">

            {/* Breadcrumb */}
            <nav className="breadcrumb">
              <button className="breadcrumb-link" onClick={() => navigate('/')}>Home</button>
              <span className="breadcrumb-sep">›</span>
              <button className="breadcrumb-link" onClick={() => navigate('/streams')}>Streams</button>
              <span className="breadcrumb-sep">›</span>
              <span className="breadcrumb-current">{stream.name} Stream</span>
            </nav>

            {/* Header row */}
            <div className="subjects-header-row">
              <div
                className="subjects-icon-box"
                style={{ background: cfg.bg, borderColor: cfg.border }}
              >
                {cfg.icon}
              </div>
              <div>
                <div
                  className="subjects-stream-badge"
                  style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.border }}
                >
                  {cfg.tag} Stream
                </div>
                <h1 className="subjects-title">Select a subject</h1>
              </div>
            </div>

            <p className="subjects-desc">
              {stream.desc} Choose a subject below to explore available courses.
            </p>

            {/* Stats */}
            <div className="subjects-stats">
              <span className="stat-pill" style={{ borderColor: cfg.border, color: cfg.color }}>
                📖 {subjects.length} Subjects
              </span>
              <span className="stat-pill" style={{ borderColor: cfg.border, color: cfg.color }}>
                🎓 {totalCourses} Courses
              </span>
            </div>
          </div>
        </section>

        {/* ── Subjects grid ── */}
        <div className="subjects-content">
          {subjects.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: '3rem', marginBottom: 14 }}>📭</div>
              <h3 style={{
                fontFamily: "'Nunito', sans-serif", fontWeight: 900,
                fontSize: '1.3rem', color: '#1A3A1A', marginBottom: 8,
              }}>
                No subjects yet
              </h3>
              <p style={{ color: '#5A7A5A', fontSize: '0.9rem', marginBottom: 28 }}>
                Subjects for this stream are coming soon.
              </p>
              <button
                onClick={() => navigate('/streams')}
                style={{
                  background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                  color: 'white', fontWeight: 700, fontSize: '0.92rem',
                  padding: '11px 24px', borderRadius: 50, border: 'none', cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(76,175,80,0.28)',
                }}
              >
                ← Back to streams
              </button>
            </div>
          ) : (
            <>
              <div className="subjects-section-label">
                {subjects.length} subject{subjects.length !== 1 ? 's' : ''} available
              </div>
              <div className="subjects-grid">
                {subjects.map(subject => (
                  <div
                    key={subject.id}
                    className="subject-card"
                    style={{ '--stream-color': cfg.color }}
                    onClick={() => navigate(`/streams/${streamId}/${subject.id}`)}
                  >
                    <span className="subject-icon">{subject.icon}</span>
                    <h2 className="subject-name">{subject.name}</h2>
                    <p className="subject-desc">{subject.desc}</p>
                    <div className="subject-footer">
                      <span className="subject-count">
                        📄 {courseCounts[subject.id] || 0} course{courseCounts[subject.id] !== 1 ? 's' : ''}
                      </span>
                      <span className="subject-arrow" style={{ color: cfg.color }}>
                        View courses →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

      </main>
    </>
  )
}

function LoadingStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@900&family=Plus+Jakarta+Sans:wght@600&display=swap');
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50%       { transform: translateY(-8px); }
      }
    `}</style>
  )
}