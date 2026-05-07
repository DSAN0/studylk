import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getStreams, getSubjects, getCourseDetail } from '../api/api'

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

export default function CourseDetail() {
  const { streamId, subjectId, courseId } = useParams()
  const navigate = useNavigate()

  const [stream, setStream]   = useState(null)
  const [subject, setSubject] = useState(null)
  const [course, setCourse]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [streamsRes, subjectsRes, courseRes] = await Promise.all([
          getStreams(),
          getSubjects(streamId),
          getCourseDetail(streamId, subjectId, courseId),
        ])
        setStream(streamsRes.data.find(s => s.id === streamId))
        setSubject(subjectsRes.data.find(s => s.id === subjectId))
        setCourse(courseRes.data)
      } catch (err) {
        console.error(err)
        setCourse(null)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [streamId, subjectId, courseId])

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
          <div style={{ fontSize: '2.2rem' }}>📖</div>
          <p style={{ color: '#5A7A5A', fontWeight: 600, fontSize: '0.95rem' }}>Loading course…</p>
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
  if (!stream || !subject || !course) {
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
            <p style={{ color: '#5A7A5A', marginBottom: 24 }}>Course not found.</p>
            <GreenButton onClick={() => navigate('/streams')}>Go to streams</GreenButton>
          </div>
        </div>
      </>
    )
  }

  const seatsLeft    = course.seatsLeft ?? course.seats_left ?? 0
  const reviewCount  = course.reviewCount ?? course.review_count ?? 0
  const startDate    = course.startDate ?? course.start_date
  const tagColor     = course.tagColor ?? course.tag_color ?? 'accent'
  const tagStyle     = TAG_STYLES[tagColor] || TAG_STYLES.accent
  const isFull       = course.isFull || seatsLeft === 0
  const seatsPercent = course.seats > 0
    ? Math.round(((course.seats - seatsLeft) / course.seats) * 100)
    : 0
  const isLowSeats   = seatsLeft <= 5 && !isFull

  return (
    <>
      <BaseStyles />
      <style>{`
        .cd-root {
          min-height: 100vh;
          background: #F8FBF8;
          padding-top: 68px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #1A3A1A;
        }

        /* Hero strip */
        .cd-hero {
          padding: 40px 24px 36px;
          border-bottom: 1.5px solid;
          position: relative;
          overflow: hidden;
        }
        .cd-hero::before {
          content: '';
          position: absolute; inset: 0;
          background-image: radial-gradient(circle, rgba(76,175,80,0.1) 1.5px, transparent 1.5px);
          background-size: 28px 28px;
          mask-image: radial-gradient(ellipse 60% 100% at 0% 50%, black 0%, transparent 75%);
          -webkit-mask-image: radial-gradient(ellipse 60% 100% at 0% 50%, black 0%, transparent 75%);
          pointer-events: none;
        }
        .cd-hero-inner { max-width: 1200px; margin: 0 auto; position: relative; }

        /* Breadcrumb */
        .cd-breadcrumb {
          display: flex; align-items: center; gap: 6px;
          font-size: 0.82rem; font-weight: 600;
          margin-bottom: 24px; flex-wrap: wrap;
        }
        .cd-bc-btn {
          background: none; border: none; cursor: pointer;
          color: #7A9A7A; font-family: inherit;
          font-size: inherit; font-weight: inherit; padding: 0;
          transition: color 0.18s;
        }
        .cd-bc-btn:hover { color: #2E7D32; }
        .cd-bc-sep { color: #B0C4B0; }

        /* Content grid */
        .cd-grid {
          max-width: 1200px; margin: 0 auto;
          padding: 44px 24px 80px;
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 28px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .cd-grid { grid-template-columns: 1fr; }
          .cd-sidebar { position: static !important; }
        }

        /* Section cards */
        .cd-section {
          background: white;
          border: 1.5px solid #E8F5E9;
          border-radius: 22px;
          padding: 28px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        }
        .cd-section-title {
          font-family: 'Nunito', sans-serif;
          font-weight: 900; font-size: 1.2rem;
          color: #1A3A1A; margin-bottom: 20px;
        }

        /* Feature chips */
        .cd-feature {
          display: flex; align-items: flex-start; gap: 10px;
          background: #F8FBF8; border: 1.5px solid #E8F5E9;
          border-radius: 14px; padding: 14px;
          transition: border-color 0.18s, background 0.18s;
        }
        .cd-feature:hover { background: #F1F8F1; border-color: #C8E6C9; }
        .cd-check {
          width: 22px; height: 22px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.7rem; font-weight: 800; flex-shrink: 0; margin-top: 1px;
        }

        /* Sidebar */
        .cd-sidebar {
          background: white;
          border: 1.5px solid #E8F5E9;
          border-radius: 22px;
          padding: 28px;
          position: sticky;
          top: 90px;
          box-shadow: 0 4px 24px rgba(76,175,80,0.08);
        }

        .cd-price-label { font-size: 0.75rem; color: #7A9A7A; font-weight: 600; margin-bottom: 4px; }
        .cd-price {
          font-family: 'Nunito', sans-serif;
          font-weight: 900; font-size: 2rem;
          margin-bottom: 24px; line-height: 1;
        }

        .cd-info-row {
          display: flex; justify-content: space-between; gap: 12px;
          padding: 11px 0;
          border-bottom: 1.5px solid #F0F7F0;
          font-size: 0.88rem;
        }
        .cd-info-row:last-of-type { border-bottom: none; }
        .cd-info-label { color: #7A9A7A; font-weight: 500; }
        .cd-info-value { color: #1A3A1A; font-weight: 700; text-align: right; }

        /* Seats bar */
        .cd-seats-box {
          background: #F8FBF8; border: 1.5px solid #E8F5E9;
          border-radius: 14px; padding: 16px;
          margin: 20px 0;
        }
        .cd-seats-top {
          display: flex; justify-content: space-between; align-items: center;
          font-size: 0.85rem; margin-bottom: 10px;
        }
        .cd-bar-bg {
          height: 8px; background: #E8F5E9;
          border-radius: 4px; overflow: hidden;
        }
        .cd-bar-fill {
          height: 100%; border-radius: 4px;
          transition: width 0.4s ease;
        }

        /* Register btn */
        .cd-register-btn {
          width: 100%; padding: 14px;
          border-radius: 14px; border: none;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 1rem; font-weight: 800;
          cursor: pointer;
          transition: transform 0.18s, box-shadow 0.18s;
        }
        .cd-register-btn.active {
          background: linear-gradient(135deg, var(--sc), var(--sc-dark));
          color: white;
          box-shadow: 0 4px 18px var(--sc-shadow);
        }
        .cd-register-btn.active:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px var(--sc-shadow);
        }
        .cd-register-btn.full {
          background: #F3F4F6; color: #9CA3AF; cursor: not-allowed;
        }

        .cd-back-btn {
          width: 100%; margin-top: 10px; padding: 12px;
          border-radius: 14px;
          background: #F8FBF8; border: 1.5px solid #E8F5E9;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.9rem; font-weight: 600;
          color: #5A7A5A; cursor: pointer;
          transition: background 0.18s, color 0.18s;
        }
        .cd-back-btn:hover { background: #E8F5E9; color: #2E7D32; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cd-left  { animation: fadeUp 0.45s 0.05s ease both; }
        .cd-sidebar { animation: fadeUp 0.45s 0.18s ease both; }
      `}</style>

      <main
        className="cd-root"
        style={{
          '--sc': cfg.color,
          '--sc-dark': shadeColor(cfg.color, -20),
          '--sc-shadow': cfg.color + '55',
        }}
      >
        {/* ── Hero strip ── */}
        <section
          className="cd-hero"
          style={{ background: `linear-gradient(135deg, ${cfg.light} 0%, #FAFFFE 100%)`, borderColor: cfg.border }}
        >
          <div className="cd-hero-inner">
            <nav className="cd-breadcrumb">
              {[
                { label: 'Home',        action: () => navigate('/') },
                { label: 'Streams',     action: () => navigate('/streams') },
                { label: stream.name,   action: () => navigate(`/streams/${streamId}`) },
                { label: subject.name,  action: () => navigate(`/streams/${streamId}/${subjectId}`) },
              ].map((c, i) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button className="cd-bc-btn" onClick={c.action}>{c.label}</button>
                  <span className="cd-bc-sep">›</span>
                </span>
              ))}
              <span style={{ color: cfg.color, fontWeight: 700, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {course.title}
              </span>
            </nav>

            {/* Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              <Badge bg={cfg.bg} color={cfg.color} border={cfg.border}>{stream.name} Stream</Badge>
              <Badge bg="#F8FBF8" color="#5A7A5A" border="#E8F5E9">{subject.icon} {subject.name}</Badge>
              {course.tag && (
                <Badge bg={tagStyle.bg} color={tagStyle.color} border={tagStyle.border}>{course.tag}</Badge>
              )}
              {isLowSeats && (
                <Badge bg="#FEF2F2" color="#DC2626" border="#FECACA">🔥 Only {seatsLeft} seats left</Badge>
              )}
            </div>

            <h1 style={{
              fontFamily: "'Nunito', sans-serif", fontWeight: 900,
              fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
              color: '#1A3A1A', letterSpacing: '-0.02em',
              lineHeight: 1.15, marginBottom: 12,
            }}>
              {course.title}
            </h1>

            {/* Stars */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', gap: 3 }}>
                {[1,2,3,4,5].map(i => (
                  <svg key={i} width="18" height="18" viewBox="0 0 20 20"
                    fill={i <= Math.round(Number(course.rating)) ? '#F59E0B' : '#D1D5DB'}>
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span style={{ fontSize: '0.88rem', color: '#7A9A7A', fontWeight: 500 }}>
                {course.rating} rating · {reviewCount} reviews
              </span>
            </div>
          </div>
        </section>

        {/* ── Main grid ── */}
        <div className="cd-grid">

          {/* Left column */}
          <div className="cd-left" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

            {/* Description */}
            <section className="cd-section">
              <h2 className="cd-section-title">About this course</h2>
              <p style={{ fontSize: '0.95rem', color: '#4A6A4A', lineHeight: 1.75 }}>
                {course.desc}
              </p>
            </section>

            {/* Features */}
            <section className="cd-section">
              <h2 className="cd-section-title">What you will get</h2>
              {course.features?.length > 0 ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: 12,
                }}>
                  {course.features.map((feature, i) => (
                    <div key={i} className="cd-feature">
                      <div
                        className="cd-check"
                        style={{ background: cfg.bg, color: cfg.color, border: `1.5px solid ${cfg.border}` }}
                      >
                        ✓
                      </div>
                      <span style={{ fontSize: '0.87rem', color: '#4A6A4A', lineHeight: 1.55 }}>{feature}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.87rem', color: '#7A9A7A' }}>No features added yet.</p>
              )}
            </section>

            {/* Teacher */}
            <section className="cd-section">
              <h2 className="cd-section-title">Your teacher</h2>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{
                  width: 58, height: 58, borderRadius: '50%',
                  background: cfg.bg, border: `2px solid ${cfg.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 900, fontSize: '1.2rem', color: cfg.color, flexShrink: 0,
                }}>
                  {course.teacher?.avatar || 'T'}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#1A3A1A', marginBottom: 6 }}>
                    {course.teacher?.name || 'Teacher'}
                  </div>
                  <div style={{ fontSize: '0.87rem', color: '#5A7A5A', lineHeight: 1.6 }}>
                    {course.teacher?.qualification || 'Qualification not added'}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* ── Sidebar ── */}
          <aside className="cd-sidebar">

            <div className="cd-price-label">Course Fee</div>
            <div className="cd-price" style={{ color: cfg.color }}>{course.price}</div>

            {/* Info rows */}
            <div style={{ marginBottom: 4 }}>
              {[
                { label: '📅 Schedule',  value: course.schedule },
                { label: '💻 Mode',      value: course.mode },
                { label: '🌐 Language',  value: course.language },
                { label: '⏳ Duration',  value: course.duration },
                { label: '🚀 Starts',    value: startDate },
              ].map(row => (
                <div key={row.label} className="cd-info-row">
                  <span className="cd-info-label">{row.label}</span>
                  <span className="cd-info-value">{row.value}</span>
                </div>
              ))}
            </div>

            {/* Seats */}
            <div className="cd-seats-box">
              <div className="cd-seats-top">
                <span style={{ color: '#5A7A5A', fontWeight: 600 }}>Availability</span>
                <span style={{
                  fontWeight: 800, fontSize: '0.9rem',
                  color: isFull ? '#DC2626' : isLowSeats ? '#D97706' : cfg.color,
                }}>
                  {isFull ? 'Batch Full' : `${seatsLeft} / ${course.seats} seats left`}
                </span>
              </div>
              <div className="cd-bar-bg">
                <div
                  className="cd-bar-fill"
                  style={{
                    width: `${seatsPercent}%`,
                    background: isFull
                      ? '#EF4444'
                      : isLowSeats
                        ? 'linear-gradient(90deg, #F59E0B, #D97706)'
                        : `linear-gradient(90deg, ${cfg.color}, ${shadeColor(cfg.color, -15)})`,
                  }}
                />
              </div>
            </div>

            {/* Register */}
            <button
              className={`cd-register-btn ${isFull ? 'full' : 'active'}`}
              disabled={isFull}
              onClick={() => {
                if (isFull) return
                const token = localStorage.getItem('studentToken')
                if (!token) { navigate('/register'); return }
                navigate(`/enroll/${streamId}/${subjectId}/${courseId}`)
              }}
            >
              {isFull ? '❌ Batch Full' : '🎓 Register Now'}
            </button>

            <button
              className="cd-back-btn"
              onClick={() => navigate(`/streams/${streamId}/${subjectId}`)}
            >
              ← Back to courses
            </button>
          </aside>
        </div>
      </main>
    </>
  )
}

/* ── Helpers ── */

function Badge({ bg, color, border, children }) {
  return (
    <span style={{
      fontSize: '0.75rem', fontWeight: 700,
      padding: '4px 12px', borderRadius: 50,
      background: bg, color, border: `1.5px solid ${border}`,
      display: 'inline-flex', alignItems: 'center', gap: 4,
    }}>
      {children}
    </span>
  )
}

function GreenButton({ onClick, children }) {
  return (
    <button onClick={onClick} style={{
      background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
      color: 'white', fontWeight: 700, fontSize: '0.92rem',
      padding: '11px 24px', borderRadius: 50, border: 'none', cursor: 'pointer',
      boxShadow: '0 4px 16px rgba(76,175,80,0.28)',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
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