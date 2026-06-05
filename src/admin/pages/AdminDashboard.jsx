import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  adminApproveEnrollment,
  adminGetCourses,
  adminGetEnrollments,
  adminGetRegistrations,
  adminRejectEnrollment,
} from '../../api/api'

const NAV_LINKS = [
  { label: '+ Add Course',        path: '/admin/courses/new',        primary: true },
  { label: 'Course Materials',    path: '/admin/materials' },
  { label: 'Approved Students',   path: '/admin/approved-students' },
  { label: 'Daily Questions',     path: '/admin/daily-questions' },
  { label: 'Question Papers',     path: '/admin/question-papers' },
  { label: 'Topic Practice',      path: '/admin/topic-practice' },
]

export default function AdminDashboard() {
  const navigate = useNavigate()

  const [courses, setCourses]           = useState([])
  const [registrations, setRegistrations] = useState([])
  const [enrollments, setEnrollments]   = useState([])
  const [loading, setLoading]           = useState(true)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    try {
      setLoading(true)
      const [cRes, rRes, eRes] = await Promise.all([
        adminGetCourses(),
        adminGetRegistrations(),
        adminGetEnrollments(),
      ])
      setCourses(cRes.data)
      setRegistrations(rRes.data)
      setEnrollments(eRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    localStorage.removeItem('adminAccessToken')
    localStorage.removeItem('adminRefreshToken')
    localStorage.removeItem('adminUser')
    navigate('/admin/login')
  }

  async function approve(id) {
    try {
      await adminApproveEnrollment(id)
      await loadData()
    } catch (err) {
      alert(JSON.stringify(err.response?.data || 'Approve failed'))
    }
  }

  async function reject(id) {
    const reason = prompt('Reject reason?') || ''
    try {
      await adminRejectEnrollment(id, { admin_note: reason })
      await loadData()
    } catch (err) {
      alert(JSON.stringify(err.response?.data || 'Reject failed'))
    }
  }

  const pending  = enrollments.filter(e => e.status === 'pending')
  const approved = enrollments.filter(e => e.status === 'approved')
  const rejected = enrollments.filter(e => e.status === 'rejected')

  if (loading) {
    return (
      <>
        <Fonts />
        <main style={styles.page}>
          <div style={styles.loadingWrap}>
            <div style={styles.spinner} />
            <p style={styles.loadingText}>Loading dashboard…</p>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Fonts />
      <main style={styles.page}>

        {/* ── TOP BAR ── */}
        <header style={styles.header}>
          <div style={styles.headerInner}>
            <div style={styles.brandRow}>
              <div style={styles.brandDot} />
              <span style={styles.brandName}>
                Study<span style={{ color: '#1A3A1A' }}>LK</span>
              </span>
              <span style={styles.adminBadge}>Admin</span>
            </div>
            <button onClick={logout} style={styles.logoutBtn}
              onMouseEnter={e => e.currentTarget.style.background = '#FEE2E2'}
              onMouseLeave={e => e.currentTarget.style.background = 'white'}
            >
              <LogoutIcon /> Logout
            </button>
          </div>
        </header>

        <div style={styles.container}>

          {/* ── PAGE TITLE ── */}
          <div style={styles.titleRow}>
            <div>
              <p style={styles.eyebrow}>Overview</p>
              <h1 style={styles.h1}>Admin Dashboard</h1>
            </div>
          </div>

          {/* ── NAV ACTIONS ── */}
          <div style={styles.navBar}>
            {NAV_LINKS.map(link => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                style={link.primary ? styles.navBtnPrimary : styles.navBtnSecondary}
                onMouseEnter={e => {
                  if (!link.primary) {
                    e.currentTarget.style.background = '#E8F5E9'
                    e.currentTarget.style.color = '#2E7D32'
                    e.currentTarget.style.borderColor = '#A5D6A7'
                  }
                }}
                onMouseLeave={e => {
                  if (!link.primary) {
                    e.currentTarget.style.background = 'white'
                    e.currentTarget.style.color = '#4A6A4A'
                    e.currentTarget.style.borderColor = '#D4E8D4'
                  }
                }}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* ── STATS ── */}
          <div style={styles.statsGrid}>
            <StatCard icon="📚" label="Courses"           value={courses.length}       color="#4CAF50" />
            <StatCard icon="📋" label="Registrations"     value={registrations.length} color="#3B82F6" />
            <StatCard icon="🎓" label="Total Enrollments" value={enrollments.length}   color="#8B5CF6" />
            <StatCard icon="⏳" label="Pending"           value={pending.length}       color="#F59E0B" />
            <StatCard icon="✅" label="Approved"          value={approved.length}      color="#10B981" />
            <StatCard icon="✕"  label="Rejected"          value={rejected.length}      color="#EF4444" />
          </div>

          {/* ── COURSES ── */}
          <Section title="Courses" action={{ label: '+ Add Course', onClick: () => navigate('/admin/courses/new') }}>
            {courses.length === 0
              ? <Empty text="No courses added yet." />
              : <div style={styles.cardList}>
                  {courses.slice(0, 10).map(c => (
                    <div key={c.id} style={styles.rowCard}
                      onMouseEnter={e => e.currentTarget.style.borderColor = '#A5D6A7'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = '#E8F5E9'}
                    >
                      <div style={styles.courseIconWrap}>
                        <span style={{ fontSize: '1.2rem' }}>📖</span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={styles.cardTitle}>{c.title}</h3>
                        <p style={styles.cardMeta}>
                          {c.teacher_name || c.teacher?.name || 'Teacher'}
                          <Dot />
                          {c.price}
                          <Dot />
                          {c.seats_left} seats left
                        </p>
                      </div>
                      <button
                        onClick={() => navigate(`/admin/courses/${c.id}`)}
                        style={styles.editBtn}
                        onMouseEnter={e => e.currentTarget.style.background = '#E8F5E9'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        Edit →
                      </button>
                    </div>
                  ))}
                </div>
            }
          </Section>

          {/* ── PENDING ENROLLMENTS ── */}
          <Section title="Pending Enrollments" badge={pending.length > 0 ? pending.length : null}>
            {pending.length === 0
              ? <Empty text="No pending enrollments." />
              : <div style={styles.cardList}>
                  {pending.map(e => (
                    <div key={e.id} style={{ ...styles.rowCard, alignItems: 'flex-start' }}
                      onMouseEnter={el => el.currentTarget.style.borderColor = '#FDE68A'}
                      onMouseLeave={el => el.currentTarget.style.borderColor = '#E8F5E9'}
                    >
                      <div style={styles.avatarCircle}>
                        {e.student?.first_name?.[0] || '?'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={styles.cardTitle}>
                          {e.student?.first_name} {e.student?.last_name}
                        </h3>
                        <p style={styles.cardMeta}>
                          {e.student?.email}
                          <Dot />
                          {e.student?.phone}
                        </p>
                        <p style={{ ...styles.cardMeta, marginTop: 2 }}>
                          <span style={styles.courseTag}>{e.course?.title}</span>
                        </p>
                        {e.payment_note && (
                          <p style={styles.noteText}>📝 {e.payment_note}</p>
                        )}
                      </div>
                      <div style={styles.actionBtns}>
                        <button
                          onClick={() => approve(e.id)}
                          style={styles.approveBtn}
                          onMouseEnter={el => el.currentTarget.style.background = '#4CAF50'}
                          onMouseLeave={el => el.currentTarget.style.background = 'transparent'}
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={() => reject(e.id)}
                          style={styles.rejectBtn}
                          onMouseEnter={el => el.currentTarget.style.background = '#EF4444'}
                          onMouseLeave={el => el.currentTarget.style.background = 'transparent'}
                        >
                          ✕ Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
            }
          </Section>

          {/* ── RECENT ENROLLMENTS ── */}
          <Section title="Recent Enrollments">
            {enrollments.length === 0
              ? <Empty text="No enrollments yet." />
              : <div style={styles.cardList}>
                  {enrollments.slice(0, 10).map(e => (
                    <div key={e.id} style={styles.rowCard}
                      onMouseEnter={el => el.currentTarget.style.borderColor = '#E8F5E9'}
                      onMouseLeave={el => el.currentTarget.style.borderColor = '#E8F5E9'}
                    >
                      <div style={styles.avatarCircle}>
                        {e.student?.first_name?.[0] || '?'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={styles.cardTitle}>
                          {e.student?.first_name} {e.student?.last_name}
                        </h3>
                        <p style={styles.cardMeta}>
                          {e.student?.email}
                          <Dot />
                          {e.course?.title}
                        </p>
                      </div>
                      <StatusBadge status={e.status} />
                    </div>
                  ))}
                </div>
            }
          </Section>

        </div>

        {/* ── FOOTER ── */}
        <footer style={styles.footer}>
          <span style={styles.footerBrand}>Study<span style={{ color: '#1A3A1A' }}>LK</span></span>
          <span style={styles.footerText}>Admin Panel · {new Date().getFullYear()}</span>
        </footer>

      </main>
    </>
  )
}

/* ── Sub-components ── */

function Fonts() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Nunito:wght@700;800;900&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    `}</style>
  )
}

function Section({ title, children, action, badge }) {
  return (
    <section style={styles.section}>
      <div style={styles.sectionHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h2 style={styles.sectionTitle}>{title}</h2>
          {badge != null && (
            <span style={styles.badgePill}>{badge}</span>
          )}
        </div>
        {action && (
          <button onClick={action.onClick} style={styles.navBtnPrimary}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            {action.label}
          </button>
        )}
      </div>
      {children}
    </section>
  )
}

function StatCard({ icon, label, value, color }) {
  return (
    <div style={styles.statCard}>
      <div style={{ ...styles.statIconWrap, background: color + '15', color }}>
        {icon}
      </div>
      <p style={styles.statLabel}>{label}</p>
      <p style={{ ...styles.statValue, color }}>{value}</p>
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    approved: { bg: '#DCFCE7', color: '#166534', border: '#BBF7D0' },
    rejected: { bg: '#FEE2E2', color: '#991B1B', border: '#FECACA' },
    pending:  { bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' },
  }
  const s = map[status] || map.pending
  return (
    <span style={{
      fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.04em',
      textTransform: 'uppercase', padding: '4px 10px', borderRadius: 50,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      whiteSpace: 'nowrap',
    }}>
      {status}
    </span>
  )
}

function Empty({ text }) {
  return <p style={{ fontSize: '0.875rem', color: '#7A9A7A', padding: '12px 0' }}>{text}</p>
}

function Dot() {
  return <span style={{ margin: '0 6px', opacity: 0.4 }}>·</span>
}

function LogoutIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

/* ── Styles ── */

const BASE_FONT = "'Plus Jakarta Sans', 'DM Sans', sans-serif"
const DISPLAY_FONT = "'Nunito', sans-serif"

const styles = {
  page: {
    minHeight: '100vh',
    background: '#F8FBF8',
    color: '#1A3A1A',
    fontFamily: BASE_FONT,
  },
  loadingWrap: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', minHeight: '100vh', gap: 16,
  },
  spinner: {
    width: 36, height: 36, borderRadius: '50%',
    border: '3px solid #E8F5E9', borderTopColor: '#4CAF50',
    animation: 'spin 0.8s linear infinite',
  },
  loadingText: { color: '#7A9A7A', fontSize: '0.9rem' },

  // Header
  header: {
    position: 'sticky', top: 0, zIndex: 50,
    background: 'rgba(248,251,248,0.9)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1.5px solid #E8F5E9',
  },
  headerInner: {
    maxWidth: 1240, margin: '0 auto',
    padding: '0 24px',
    height: 60,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  brandRow: { display: 'flex', alignItems: 'center', gap: 10 },
  brandDot: {
    width: 10, height: 10, borderRadius: '50%',
    background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
    boxShadow: '0 0 8px rgba(76,175,80,0.5)',
  },
  brandName: {
    fontFamily: DISPLAY_FONT,
    fontWeight: 900, fontSize: '1.35rem', color: '#2E7D32',
  },
  adminBadge: {
    fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em',
    textTransform: 'uppercase', background: '#E8F5E9', color: '#2E7D32',
    padding: '3px 8px', borderRadius: 50, border: '1px solid #C8E6C9',
  },
  logoutBtn: {
    display: 'flex', alignItems: 'center', gap: 6,
    background: 'white', border: '1.5px solid #E8F5E9',
    borderRadius: 50, padding: '7px 16px',
    fontSize: '0.82rem', fontWeight: 600, color: '#EF4444',
    cursor: 'pointer', transition: 'background 0.2s',
    fontFamily: BASE_FONT,
  },

  // Layout
  container: { maxWidth: 1240, margin: '0 auto', padding: '36px 24px 60px' },
  titleRow: { marginBottom: 24 },
  eyebrow: {
    fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em',
    textTransform: 'uppercase', color: '#4CAF50', marginBottom: 4,
  },
  h1: {
    fontFamily: DISPLAY_FONT,
    fontWeight: 900, fontSize: 'clamp(1.6rem,3vw,2.2rem)',
    color: '#1A3A1A', letterSpacing: '-0.01em',
  },

  // Nav bar
  navBar: {
    display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 32,
  },
  navBtnPrimary: {
    display: 'inline-flex', alignItems: 'center',
    background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
    color: 'white', fontWeight: 700, fontSize: '0.82rem',
    padding: '9px 20px', borderRadius: 50, border: 'none',
    cursor: 'pointer', fontFamily: BASE_FONT,
    boxShadow: '0 3px 12px rgba(76,175,80,0.3)',
    transition: 'opacity 0.18s',
  },
  navBtnSecondary: {
    display: 'inline-flex', alignItems: 'center',
    background: 'white', color: '#4A6A4A',
    fontWeight: 600, fontSize: '0.82rem',
    padding: '8px 18px', borderRadius: 50,
    border: '1.5px solid #D4E8D4', cursor: 'pointer',
    fontFamily: BASE_FONT, transition: 'all 0.18s',
  },

  // Stats
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: 16, marginBottom: 32,
  },
  statCard: {
    background: 'white', borderRadius: 20,
    border: '1.5px solid #E8F5E9',
    padding: '20px 20px 18px',
    boxShadow: '0 2px 12px rgba(76,175,80,0.06)',
    animation: 'fadeUp 0.4s ease both',
  },
  statIconWrap: {
    width: 38, height: 38, borderRadius: 12,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.1rem', marginBottom: 12,
  },
  statLabel: { fontSize: '0.75rem', fontWeight: 600, color: '#7A9A7A', marginBottom: 4 },
  statValue: {
    fontFamily: DISPLAY_FONT,
    fontWeight: 900, fontSize: '2rem',
    lineHeight: 1,
  },

  // Section
  section: {
    background: 'white', borderRadius: 24,
    border: '1.5px solid #E8F5E9',
    padding: '24px 28px', marginBottom: 20,
    boxShadow: '0 2px 12px rgba(76,175,80,0.05)',
  },
  sectionHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10,
  },
  sectionTitle: {
    fontFamily: DISPLAY_FONT, fontWeight: 800,
    fontSize: '1.05rem', color: '#1A3A1A',
  },
  badgePill: {
    background: '#FEF3C7', color: '#92400E',
    border: '1px solid #FDE68A',
    borderRadius: 50, fontSize: '0.7rem',
    fontWeight: 700, padding: '2px 8px',
  },

  // Cards
  cardList: { display: 'flex', flexDirection: 'column', gap: 10 },
  rowCard: {
    display: 'flex', alignItems: 'center', gap: 14,
    background: '#FAFCFA', border: '1.5px solid #E8F5E9',
    borderRadius: 16, padding: '14px 18px',
    transition: 'border-color 0.2s',
  },
  courseIconWrap: {
    width: 40, height: 40, borderRadius: 12,
    background: '#E8F5E9', display: 'flex',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  avatarCircle: {
    width: 38, height: 38, borderRadius: '50%',
    background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
    color: 'white', fontWeight: 800, fontSize: '0.9rem',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, fontFamily: DISPLAY_FONT,
  },
  cardTitle: { fontWeight: 700, fontSize: '0.875rem', color: '#1A3A1A', marginBottom: 3 },
  cardMeta: {
    fontSize: '0.775rem', color: '#7A9A7A',
    display: 'flex', alignItems: 'center', flexWrap: 'wrap',
  },
  courseTag: {
    background: '#E8F5E9', color: '#2E7D32',
    borderRadius: 50, padding: '2px 10px',
    fontSize: '0.72rem', fontWeight: 700,
    border: '1px solid #C8E6C9',
  },
  noteText: { fontSize: '0.75rem', color: '#92400E', marginTop: 4 },
  editBtn: {
    fontSize: '0.78rem', fontWeight: 700, color: '#2E7D32',
    background: 'transparent', border: 'none',
    padding: '6px 12px', borderRadius: 10,
    cursor: 'pointer', fontFamily: BASE_FONT,
    transition: 'background 0.15s', whiteSpace: 'nowrap',
  },
  actionBtns: {
    display: 'flex', gap: 8, flexShrink: 0,
    flexDirection: 'column',
  },
  approveBtn: {
    fontSize: '0.78rem', fontWeight: 700,
    color: '#166534', background: 'transparent',
    border: '1.5px solid #4CAF50', borderRadius: 50,
    padding: '6px 14px', cursor: 'pointer',
    fontFamily: BASE_FONT, transition: 'background 0.2s, color 0.2s',
    whiteSpace: 'nowrap',
  },
  rejectBtn: {
    fontSize: '0.78rem', fontWeight: 700,
    color: '#991B1B', background: 'transparent',
    border: '1.5px solid #EF4444', borderRadius: 50,
    padding: '6px 14px', cursor: 'pointer',
    fontFamily: BASE_FONT, transition: 'background 0.2s, color 0.2s',
    whiteSpace: 'nowrap',
  },

  // Footer
  footer: {
    borderTop: '1.5px solid #E8F5E9',
    padding: '20px 24px',
    display: 'flex', justifyContent: 'center',
    alignItems: 'center', gap: 12,
    background: 'white',
  },
  footerBrand: {
    fontFamily: DISPLAY_FONT, fontWeight: 900,
    fontSize: '1.1rem', color: '#2E7D32',
  },
  footerText: { fontSize: '0.78rem', color: '#AACAAA' },
}