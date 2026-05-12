import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { studentMyCourses } from '../api/api'

const STATUS_CONFIG = {
  approved: { bg: '#F0FDF4', color: '#16A34A', border: '#BBF7D0', icon: '✅', label: 'Approved' },
  pending:  { bg: '#FEF9E7', color: '#D97706', border: '#FDE68A', icon: '⏳', label: 'Pending' },
  rejected: { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA', icon: '❌', label: 'Rejected' },
}

export default function MyCourses() {
  const navigate = useNavigate()
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const res = await studentMyCourses()
        setEnrollments(res.data)
      } catch (err) {
        console.error(err)
        navigate('/login')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [navigate])

  if (loading) {
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
          <div style={{ fontSize: '2.2rem' }}>🎓</div>
          <p style={{ color: '#5A7A5A', fontWeight: 600, fontSize: '0.95rem' }}>Loading your courses…</p>
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

  const approved = enrollments.filter(e => e.status === 'approved').length
  const pending  = enrollments.filter(e => e.status === 'pending').length

  return (
    <>
      <BaseStyles />
      <style>{`
        .mc-card {
          background: white;
          border: 1.5px solid #E8F5E9;
          border-radius: 22px;
          padding: 26px;
          box-shadow: 0 2px 14px rgba(0,0,0,0.04);
          transition: transform 0.2s, box-shadow 0.2s;
          animation: fadeUp 0.4s ease both;
          display: flex; flex-direction: column;
        }
        .mc-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 36px rgba(76,175,80,0.1);
        }
        .mc-card:nth-child(1) { animation-delay: 0.05s; }
        .mc-card:nth-child(2) { animation-delay: 0.12s; }
        .mc-card:nth-child(3) { animation-delay: 0.19s; }
        .mc-card:nth-child(4) { animation-delay: 0.26s; }

        .mc-action-btn {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 0.85rem; font-weight: 700;
          padding: 9px 18px; border-radius: 50px; border: none;
          cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif;
          transition: transform 0.16s, box-shadow 0.16s;
        }
        .mc-action-btn.primary {
          background: linear-gradient(135deg, #4CAF50, #2E7D32);
          color: white;
          box-shadow: 0 3px 12px rgba(76,175,80,0.28);
        }
        .mc-action-btn.primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(76,175,80,0.38);
        }

        .stat-card {
          background: white;
          border: 1.5px solid #E8F5E9;
          border-radius: 18px;
          padding: 20px 24px;
          display: flex; align-items: center; gap: 14px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.04);
        }
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
          background: 'linear-gradient(135deg, #E8F5E9 0%, #F0FAF0 100%)',
          borderBottom: '1.5px solid #C8E6C9',
          padding: '44px 24px 40px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'radial-gradient(circle, rgba(76,175,80,0.11) 1.5px, transparent 1.5px)',
            backgroundSize: '28px 28px',
            maskImage: 'radial-gradient(ellipse 80% 100% at 0% 50%, black 0%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 100% at 0% 50%, black 0%, transparent 75%)',
          }} />

          <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: '#E8F5E9', color: '#2E7D32',
              fontWeight: 700, fontSize: '0.75rem',
              padding: '4px 13px', borderRadius: 50,
              letterSpacing: '0.07em', textTransform: 'uppercase',
              marginBottom: 14, border: '1.5px solid #A5D6A7',
            }}>
              🎓 My Learning
            </div>

            <h1 style={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
              color: '#1A3A1A', letterSpacing: '-0.02em',
              marginBottom: 8, lineHeight: 1.1,
            }}>
              My Courses
            </h1>
            <p style={{ fontSize: '0.95rem', color: '#5A7A5A', marginBottom: 28 }}>
              Your pending and approved course enrolments.
            </p>

            {/* Stats row */}
            {enrollments.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <div className="stat-card">
                  <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: '#E8F5E9', border: '1.5px solid #C8E6C9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.2rem',
                  }}>📚</div>
                  <div>
                    <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: '1.5rem', color: '#2E7D32', lineHeight: 1 }}>
                      {enrollments.length}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#7A9A7A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Total
                    </div>
                  </div>
                </div>

                {approved > 0 && (
                  <div className="stat-card">
                    <div style={{
                      width: 40, height: 40, borderRadius: 12,
                      background: '#F0FDF4', border: '1.5px solid #BBF7D0',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.2rem',
                    }}>✅</div>
                    <div>
                      <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: '1.5rem', color: '#16A34A', lineHeight: 1 }}>
                        {approved}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#7A9A7A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Approved
                      </div>
                    </div>
                  </div>
                )}

                {pending > 0 && (
                  <div className="stat-card">
                    <div style={{
                      width: 40, height: 40, borderRadius: 12,
                      background: '#FEF9E7', border: '1.5px solid #FDE68A',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.2rem',
                    }}>⏳</div>
                    <div>
                      <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: '1.5rem', color: '#D97706', lineHeight: 1 }}>
                        {pending}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#7A9A7A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Pending
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ── Content ── */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '44px 24px 80px' }}>

          {enrollments.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '64px 32px',
              background: 'white', borderRadius: 24,
              border: '1.5px solid #E8F5E9',
              boxShadow: '0 2px 14px rgba(0,0,0,0.04)',
            }}>
              <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>📭</div>
              <h2 style={{
                fontFamily: "'Nunito', sans-serif", fontWeight: 900,
                fontSize: '1.5rem', color: '#1A3A1A', marginBottom: 10,
              }}>
                No enrolments yet
              </h2>
              <p style={{ color: '#5A7A5A', fontSize: '0.92rem', marginBottom: 28, maxWidth: 340, margin: '0 auto 28px' }}>
                You haven't enrolled in any courses yet. Browse our materials and get started!
              </p>
              <button
                className="mc-action-btn primary"
                onClick={() => navigate('/streams')}
              >
                📚 Browse Courses
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 20,
            }}>
              {enrollments.map(enrollment => {
                const st = STATUS_CONFIG[enrollment.status] || STATUS_CONFIG.pending
                const course = enrollment.course || {}

                return (
                  <div key={enrollment.id} className="mc-card">

                    {/* Status badge */}
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      fontSize: '0.75rem', fontWeight: 700,
                      padding: '4px 12px', borderRadius: 50,
                      background: st.bg, color: st.color, border: `1.5px solid ${st.border}`,
                      marginBottom: 16, alignSelf: 'flex-start',
                    }}>
                      {st.icon} {st.label}
                    </div>

                    {/* Title */}
                    <h2 style={{
                      fontFamily: "'Nunito', sans-serif",
                      fontWeight: 900, fontSize: '1.1rem',
                      color: '#1A3A1A', marginBottom: 6, lineHeight: 1.3,
                    }}>
                      {course.title}
                    </h2>

                    {/* Teacher & price */}
                    <p style={{ fontSize: '0.85rem', color: '#7A9A7A', marginBottom: 16, fontWeight: 500 }}>
                      {course.teacher?.name && `👤 ${course.teacher.name}`}
                      {course.price && ` · ${course.price}`}
                    </p>

                    {/* Meta */}
                    <div style={{
                      display: 'flex', flexDirection: 'column', gap: 6,
                      fontSize: '0.82rem', color: '#5A7A5A',
                      marginBottom: 20, flex: 1,
                    }}>
                      {course.schedule  && <span>📅 {course.schedule}</span>}
                      {course.mode      && <span>💻 {course.mode}</span>}
                      {course.startDate && <span>🚀 Starts: {course.startDate}</span>}
                    </div>

                    {/* Status message + action */}
                    {enrollment.status === 'pending' && (
                      <div style={{
                        background: '#FEF9E7', border: '1.5px solid #FDE68A',
                        color: '#92400E', borderRadius: 12,
                        padding: '11px 14px', fontSize: '0.84rem',
                      }}>
                        ⏳ Your enrolment is awaiting admin approval.
                      </div>
                    )}

                    {enrollment.status === 'rejected' && (
                      <div style={{
                        background: '#FEF2F2', border: '1.5px solid #FECACA',
                        color: '#991B1B', borderRadius: 12,
                        padding: '11px 14px', fontSize: '0.84rem',
                      }}>
                        ❌ Enrolment rejected. Please contact admin for details.
                      </div>
                    )}

                    {enrollment.status === 'approved' && (
                      <div>
                        <div style={{
                          background: '#F0FDF4', border: '1.5px solid #BBF7D0',
                          color: '#14532D', borderRadius: 12,
                          padding: '11px 14px', fontSize: '0.84rem',
                          marginBottom: 16,
                        }}>
                          ✅ Approved! You can now access your course content.
                        </div>
                        <button
                          className="mc-action-btn primary"
                          style={{ width: '100%', justifyContent: 'center' }}
                          onClick={() => navigate(`/my-courses/${course.id}/overview`)}
                        >
                          👁️ View Course
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
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