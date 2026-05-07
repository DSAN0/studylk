import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getStreams, getSubjects, getCourses } from '../api/api'

const STREAM_CONFIG = {
  science:    { color: '#4CAF50', bg: '#F1F8F1', border: '#C8E6C9', light: '#E8F5E9' },
  commerce:   { color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A', light: '#FEF9E7' },
  arts:       { color: '#3B82F6', bg: '#EFF6FF', border: '#BFDBFE', light: '#EBF5FF' },
  technology: { color: '#8B5CF6', bg: '#F5F3FF', border: '#DDD6FE', light: '#F3F0FF' },
}

const TAG_STYLES = {
  accent:   { bg: '#FEF9E7', color: '#D97706', border: '#FDE68A' },
  commerce: { bg: '#F0FDF4', color: '#16A34A', border: '#BBF7D0' },
  arts:     { bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE' },
  science:  { bg: '#F0FDF4', color: '#15803D', border: '#A7F3D0' },
  tech:     { bg: '#F5F3FF', color: '#7C3AED', border: '#DDD6FE' },
}

function StarRating({ rating = 0, reviewCount = 0 }) {
  const rounded = Math.round(Number(rating))
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <div style={{ display: 'flex', gap: 2 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <svg key={i} width="13" height="13" viewBox="0 0 20 20" fill={i <= rounded ? '#F59E0B' : '#D1D5DB'}>
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span style={{ fontSize: '0.75rem', color: '#7A9A7A', fontWeight: 500 }}>
        {rating} ({reviewCount})
      </span>
    </div>
  )
}

export default function Courses() {
  const { streamId, subjectId } = useParams()
  const navigate = useNavigate()

  const [stream, setStream]   = useState(null)
  const [subject, setSubject] = useState(null)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [streamsRes, subjectsRes, coursesRes] = await Promise.all([
          getStreams(),
          getSubjects(streamId),
          getCourses(streamId, subjectId),
        ])
        setStream(streamsRes.data.find(s => s.id === streamId))
        setSubject(subjectsRes.data.find(s => s.id === subjectId))
        setCourses(coursesRes.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [streamId, subjectId])

  const cfg = STREAM_CONFIG[streamId] || STREAM_CONFIG.science

  /* ── Loading ── */
  if (loading) {
    return (
      <>
        <BaseStyles />
        <div style={{
          minHeight: '100vh', paddingTop: 68,
          background: 'linear-gradient(160deg, #F0FAF0 0%, #FAFFFE 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 14,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
          <div style={{ fontSize: '2.2rem' }}>🎓</div>
          <p style={{ color: '#5A7A5A', fontWeight: 600, fontSize: '0.95rem' }}>Loading courses…</p>
          <div style={{ display: 'flex', gap: 6 }}>
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
  if (!stream || !subject) {
    return (
      <>
        <BaseStyles />
        <div style={{
          minHeight: '100vh', paddingTop: 68,
          background: 'linear-gradient(160deg, #F0FAF0 0%, #FAFFFE 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: '3rem', marginBottom: 14 }}>🔍</div>
            <p style={{ color: '#5A7A5A', marginBottom: 24 }}>Subject not found.</p>
            <GreenButton onClick={() => navigate('/streams')}>Go to streams</GreenButton>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <BaseStyles />
      <style>{`
        .course-card {
          background: white;
          border-radius: 22px;
          padding: 26px;
          cursor: pointer;
          border: 1.5px solid #E8F5E9;
          box-shadow: 0 2px 14px rgba(0,0,0,0.04);
          transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
          display: flex;
          flex-direction: column;
          animation: fadeUp 0.4s ease both;
        }
        .course-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 44px rgba(0,0,0,0.09);
          border-color: var(--stream-color-border);
        }
        .course-card:hover .course-title {
          color: var(--stream-color);
        }
        .course-card:nth-child(1) { animation-delay: 0.05s; }
        .course-card:nth-child(2) { animation-delay: 0.12s; }
        .course-card:nth-child(3) { animation-delay: 0.19s; }
        .course-card:nth-child(4) { animation-delay: 0.26s; }
        .course-card:nth-child(5) { animation-delay: 0.33s; }
        .course-card:nth-child(6) { animation-delay: 0.4s; }

        .course-title {
          font-family: 'Nunito', sans-serif;
          font-weight: 900;
          font-size: 1.1rem;
          color: #1A3A1A;
          margin-bottom: 10px;
          line-height: 1.3;
          transition: color 0.18s;
        }

        .course-desc {
          font-size: 0.86rem;
          color: #5A7A5A;
          line-height: 1.65;
          margin-bottom: 18px;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .course-meta-row {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 18px;
        }
        .course-meta-item {
          font-size: 0.8rem;
          color: #7A9A7A;
          display: flex;
          align-items: center;
          gap: 7px;
          font-weight: 500;
        }

        .course-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 16px;
          border-top: 1.5px solid #F0F7F0;
          margin-top: auto;
        }

        .view-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.85rem;
          font-weight: 700;
          padding: 9px 18px;
          border-radius: 50px;
          border: none;
          cursor: pointer;
          background: linear-gradient(135deg, var(--stream-color), var(--stream-color-dark));
          color: white;
          box-shadow: 0 3px 12px var(--stream-color-shadow);
          transition: transform 0.16s, box-shadow 0.16s;
          pointer-events: none;
        }
        .course-card:hover .view-btn {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px var(--stream-color-shadow);
        }

        .teacher-avatar {
          width: 36px; height: 36px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 0.85rem;
          flex-shrink: 0;
          border: 1.5px solid;
        }

        .seats-badge {
          font-size: 0.72rem;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 50px;
          background: #FEF9E7;
          color: #D97706;
          border: 1px solid #FDE68A;
        }
        .seats-badge.low {
          background: #FEF2F2;
          color: #DC2626;
          border-color: #FECACA;
        }
      `}</style>

      <main style={{
        minHeight: '100vh',
        background: '#F8FBF8',
        paddingTop: 68,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: '#1A3A1A',
        '--stream-color': cfg.color,
        '--stream-color-border': cfg.border,
        '--stream-color-dark': shadeColor(cfg.color, -20),
        '--stream-color-shadow': cfg.color + '44',
      }}>

        {/* ── Hero ── */}
        <section style={{
          background: `linear-gradient(135deg, ${cfg.light} 0%, #FAFFFE 100%)`,
          borderBottom: `1.5px solid ${cfg.border}`,
          padding: '44px 24px 40px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* dot pattern */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'radial-gradient(circle, rgba(76,175,80,0.1) 1.5px, transparent 1.5px)',
            backgroundSize: '28px 28px',
            maskImage: 'radial-gradient(ellipse 70% 100% at 0% 50%, black 0%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 100% at 0% 50%, black 0%, transparent 75%)',
          }} />

          <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>

            {/* Breadcrumb */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', fontWeight: 600, marginBottom: 28, flexWrap: 'wrap' }}>
              {[
                { label: 'Home',        action: () => navigate('/') },
                { label: 'Streams',     action: () => navigate('/streams') },
                { label: stream.name,   action: () => navigate(`/streams/${streamId}`) },
              ].map((crumb, i) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button
                    onClick={crumb.action}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#7A9A7A', fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 'inherit', padding: 0,
                    }}
                    onMouseEnter={e => e.target.style.color = '#2E7D32'}
                    onMouseLeave={e => e.target.style.color = '#7A9A7A'}
                  >
                    {crumb.label}
                  </button>
                  <span style={{ color: '#B0C4B0' }}>›</span>
                </span>
              ))}
              <span style={{ color: cfg.color, fontWeight: 700 }}>{subject.name}</span>
            </nav>

            {/* Title block */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 12 }}>
              <div style={{
                width: 58, height: 58, borderRadius: 16,
                background: cfg.bg, border: `1.5px solid ${cfg.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.7rem', flexShrink: 0,
              }}>
                {subject.icon}
              </div>
              <div>
                <div style={{
                  display: 'inline-block',
                  background: cfg.bg, color: cfg.color, borderColor: cfg.border,
                  border: `1.5px solid ${cfg.border}`,
                  fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.09em',
                  textTransform: 'uppercase', padding: '4px 12px', borderRadius: 50,
                  marginBottom: 8,
                }}>
                  Step 3 of 3 · {stream.name} Stream
                </div>
                <h1 style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 900,
                  fontSize: 'clamp(1.7rem, 3.8vw, 2.6rem)',
                  color: '#1A3A1A', letterSpacing: '-0.02em', lineHeight: 1.1, margin: 0,
                }}>
                  {subject.name} Courses
                </h1>
              </div>
            </div>

            <p style={{ fontSize: '0.95rem', color: '#5A7A5A', lineHeight: 1.7, maxWidth: 500, marginBottom: 22 }}>
              {courses.length > 0
                ? `${courses.length} course${courses.length > 1 ? 's' : ''} available. Click a course to view full details.`
                : 'No courses available yet for this subject. Check back soon!'}
            </p>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <span style={{
                fontSize: '0.82rem', fontWeight: 700, padding: '6px 16px',
                borderRadius: 50, background: 'white', border: `1.5px solid ${cfg.border}`,
                color: cfg.color,
              }}>
                🎓 {courses.length} course{courses.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </section>

        {/* ── Courses grid ── */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 80px' }}>

          {courses.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '60px 32px',
              background: 'white', borderRadius: 24,
              border: '1.5px solid #E8F5E9',
              boxShadow: '0 2px 14px rgba(0,0,0,0.04)',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: 14 }}>📭</div>
              <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: '1.3rem', color: '#1A3A1A', marginBottom: 8 }}>
                No courses yet
              </h3>
              <p style={{ color: '#5A7A5A', fontSize: '0.9rem', marginBottom: 28 }}>
                Courses for this subject are coming soon.
              </p>
              <GreenButton onClick={() => navigate('/streams')}>← Back to streams</GreenButton>
            </div>
          ) : (
            <>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#7A9A7A', marginBottom: 20 }}>
                {courses.length} course{courses.length !== 1 ? 's' : ''} available
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 22,
              }}>
                {courses.map(course => {
                  const tagStyle = TAG_STYLES[course.tagColor] || TAG_STYLES.accent
                  const seatsLeft = course.seatsLeft ?? course.seats_left ?? 0
                  const reviewCount = course.reviewCount ?? course.review_count ?? 0
                  const isLowSeats = seatsLeft <= 5

                  return (
                    <div
                      key={course.id}
                      className="course-card"
                      style={{
                        '--stream-color': cfg.color,
                        '--stream-color-border': cfg.border,
                        '--stream-color-dark': shadeColor(cfg.color, -20),
                        '--stream-color-shadow': cfg.color + '44',
                      }}
                      onClick={() => navigate(`/streams/${streamId}/${subjectId}/${course.id}`)}
                    >
                      {/* Top row: tag + seats */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        {course.tag ? (
                          <span style={{
                            fontSize: '0.72rem', fontWeight: 700,
                            padding: '3px 11px', borderRadius: 50,
                            background: tagStyle.bg, color: tagStyle.color,
                            border: `1px solid ${tagStyle.border}`,
                          }}>
                            {course.tag}
                          </span>
                        ) : <span />}
                        <span className={`seats-badge ${isLowSeats ? 'low' : ''}`}>
                          {seatsLeft} seats left
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="course-title">{course.title}</h2>

                      {/* Description */}
                      <p className="course-desc">{course.desc}</p>

                      {/* Teacher */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                        <div
                          className="teacher-avatar"
                          style={{ background: cfg.bg, borderColor: cfg.border, color: cfg.color }}
                        >
                          {course.teacher?.avatar || 'T'}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1A3A1A' }}>
                            {course.teacher?.name || 'Teacher'}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#7A9A7A' }}>{course.mode}</div>
                        </div>
                      </div>

                      {/* Meta */}
                      <div className="course-meta-row">
                        <span className="course-meta-item">📅 {course.schedule}</span>
                        <span className="course-meta-item">🌐 {course.language}</span>
                        <span className="course-meta-item">⏳ {course.duration}</span>
                        <span className="course-meta-item">🚀 Starts: {course.startDate || course.start_date}</span>
                      </div>

                      {/* Footer */}
                      <div className="course-footer">
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '1.05rem', color: cfg.color, marginBottom: 4 }}>
                            {course.price}
                          </div>
                          <StarRating rating={course.rating} reviewCount={reviewCount} />
                        </div>
                        <div className="view-btn">View →</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  )
}

/* ── Helpers ── */

function GreenButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
        color: 'white', fontWeight: 700, fontSize: '0.92rem',
        padding: '11px 24px', borderRadius: 50, border: 'none', cursor: 'pointer',
        boxShadow: '0 4px 16px rgba(76,175,80,0.28)',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {children}
    </button>
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
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(18px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `}</style>
  )
}

function shadeColor(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = Math.min(255, Math.max(0, (num >> 16) + amt))
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amt))
  const B = Math.min(255, Math.max(0, (num & 0xff) + amt))
  return '#' + ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)
}