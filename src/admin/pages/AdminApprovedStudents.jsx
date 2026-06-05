import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminGetApprovedStudents } from '../../api/api'

export default function AdminApprovedStudents() {
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        const res = await adminGetApprovedStudents()
        setStudents(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filtered = students.filter(item => {
    const q = search.toLowerCase()
    const name  = `${item.student?.first_name} ${item.student?.last_name}`.toLowerCase()
    const email = (item.student?.email || '').toLowerCase()
    const course = (item.course?.title || '').toLowerCase()
    return name.includes(q) || email.includes(q) || course.includes(q)
  })

  if (loading) {
    return (
      <>
        <Fonts />
        <main style={s.page}>
          <div style={s.loadingWrap}>
            <div style={s.spinner} />
            <p style={s.loadingText}>Loading approved students…</p>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Fonts />
      <main style={s.page}>
        <Header navigate={navigate} />

        <div style={s.container}>
          {/* Title row */}
          <div style={s.titleRow}>
            <div>
              <p style={s.eyebrow}>Admin · Students</p>
              <h1 style={s.h1}>Approved Students</h1>
              <p style={s.subtitle}>Students approved for course access.</p>
            </div>
            <BackBtn onClick={() => navigate('/admin/dashboard')} />
          </div>

          {/* Search + count bar */}
          <div style={s.toolBar}>
            <div style={s.searchWrap}>
              <SearchIcon />
              <input
                style={s.searchInput}
                placeholder="Search by name, email or course…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <span style={s.countBadge}>{filtered.length} student{filtered.length !== 1 ? 's' : ''}</span>
          </div>

          {/* Table card */}
          <div style={s.card}>
            {filtered.length === 0 ? (
              <Empty text={search ? 'No students match your search.' : 'No approved students yet.'} />
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={s.table}>
                  <thead>
                    <tr>
                      {['Student', 'Email', 'Phone', 'Course', 'Status'].map(h => (
                        <th key={h} style={s.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((item, i) => (
                      <tr key={item.id} style={i % 2 === 0 ? s.trEven : s.trOdd}>
                        <td style={s.tdName}>
                          <div style={s.avatarRow}>
                            <div style={{ ...s.avatar, background: avatarColor(item.student?.first_name) }}>
                              {item.student?.first_name?.[0] || '?'}
                            </div>
                            <span>{item.student?.first_name} {item.student?.last_name}</span>
                          </div>
                        </td>
                        <td style={s.td}>{item.student?.email}</td>
                        <td style={s.td}>{item.student?.phone}</td>
                        <td style={s.td}>
                          <span style={s.courseTag}>{item.course?.title}</span>
                        </td>
                        <td style={s.td}>
                          <span style={s.approvedBadge}>{item.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </main>
    </>
  )
}

/* ── helpers ── */
function avatarColor(name = '') {
  const colors = ['#4CAF50','#3B82F6','#8B5CF6','#F59E0B','#10B981','#EF4444']
  return colors[(name.charCodeAt(0) || 0) % colors.length]
}

/* ── shared sub-components ── */
function Fonts() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Nunito:wght@700;800;900&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      @keyframes spin { to { transform: rotate(360deg); } }
    `}</style>
  )
}

function Header({ navigate }) {
  return (
    <header style={s.header}>
      <div style={s.headerInner}>
        <div style={s.brandRow}>
          <div style={s.brandDot} />
          <span style={s.brandName}>Study<span style={{ color: '#1A3A1A' }}>LK</span></span>
          <span style={s.adminBadge}>Admin</span>
        </div>
      </div>
    </header>
  )
}

function BackBtn({ onClick }) {
  return (
    <button onClick={onClick} style={s.backBtn}
      onMouseEnter={e => { e.currentTarget.style.background = '#E8F5E9'; e.currentTarget.style.color = '#2E7D32' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#4A6A4A' }}
    >
      ← Dashboard
    </button>
  )
}

function Empty({ text }) {
  return <p style={{ fontSize: '0.875rem', color: '#7A9A7A', padding: '16px 0' }}>{text}</p>
}

function Footer() {
  return (
    <footer style={s.footer}>
      <span style={s.footerBrand}>Study<span style={{ color: '#1A3A1A' }}>LK</span></span>
      <span style={s.footerText}>Admin Panel · {new Date().getFullYear()}</span>
    </footer>
  )
}

function SearchIcon() {
  return (
    <svg style={{ flexShrink: 0, color: '#7A9A7A' }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

/* ── styles ── */
const BASE = "'Plus Jakarta Sans', sans-serif"
const DISPLAY = "'Nunito', sans-serif"

const s = {
  page: { minHeight: '100vh', background: '#F8FBF8', color: '#1A3A1A', fontFamily: BASE },
  loadingWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 16 },
  spinner: { width: 36, height: 36, borderRadius: '50%', border: '3px solid #E8F5E9', borderTopColor: '#4CAF50', animation: 'spin 0.8s linear infinite' },
  loadingText: { color: '#7A9A7A', fontSize: '0.9rem' },
  header: { position: 'sticky', top: 0, zIndex: 50, background: 'rgba(248,251,248,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1.5px solid #E8F5E9' },
  headerInner: { maxWidth: 1240, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  brandRow: { display: 'flex', alignItems: 'center', gap: 10 },
  brandDot: { width: 10, height: 10, borderRadius: '50%', background: 'linear-gradient(135deg,#4CAF50,#2E7D32)', boxShadow: '0 0 8px rgba(76,175,80,0.5)' },
  brandName: { fontFamily: DISPLAY, fontWeight: 900, fontSize: '1.35rem', color: '#2E7D32' },
  adminBadge: { fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: '#E8F5E9', color: '#2E7D32', padding: '3px 8px', borderRadius: 50, border: '1px solid #C8E6C9' },
  container: { maxWidth: 1240, margin: '0 auto', padding: '36px 24px 60px' },
  titleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 28 },
  eyebrow: { fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4CAF50', marginBottom: 4 },
  h1: { fontFamily: DISPLAY, fontWeight: 900, fontSize: 'clamp(1.6rem,3vw,2.2rem)', color: '#1A3A1A', letterSpacing: '-0.01em' },
  subtitle: { fontSize: '0.875rem', color: '#7A9A7A', marginTop: 6 },
  backBtn: { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'white', border: '1.5px solid #D4E8D4', borderRadius: 50, padding: '8px 18px', fontSize: '0.82rem', fontWeight: 600, color: '#4A6A4A', cursor: 'pointer', fontFamily: BASE, transition: 'all 0.18s', whiteSpace: 'nowrap' },
  toolBar: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' },
  searchWrap: { display: 'flex', alignItems: 'center', gap: 8, background: 'white', border: '1.5px solid #E8F5E9', borderRadius: 50, padding: '9px 16px', flex: 1, minWidth: 220 },
  searchInput: { border: 'none', outline: 'none', background: 'transparent', fontFamily: BASE, fontSize: '0.85rem', color: '#1A3A1A', width: '100%' },
  countBadge: { fontSize: '0.78rem', fontWeight: 700, background: '#E8F5E9', color: '#2E7D32', border: '1px solid #C8E6C9', borderRadius: 50, padding: '6px 14px', whiteSpace: 'nowrap' },
  card: { background: 'white', borderRadius: 24, border: '1.5px solid #E8F5E9', padding: '8px 0', boxShadow: '0 2px 12px rgba(76,175,80,0.05)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '12px 20px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#7A9A7A', borderBottom: '1.5px solid #E8F5E9' },
  trEven: { background: 'white' },
  trOdd:  { background: '#FAFCFA' },
  tdName: { padding: '14px 20px', fontSize: '0.875rem', fontWeight: 600, color: '#1A3A1A' },
  td:     { padding: '14px 20px', fontSize: '0.82rem', color: '#4A6A4A' },
  avatarRow: { display: 'flex', alignItems: 'center', gap: 10 },
  avatar: { width: 32, height: 32, borderRadius: '50%', color: 'white', fontWeight: 800, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: DISPLAY },
  courseTag: { background: '#E8F5E9', color: '#2E7D32', borderRadius: 50, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700, border: '1px solid #C8E6C9' },
  approvedBadge: { background: '#DCFCE7', color: '#166534', border: '1px solid #BBF7D0', borderRadius: 50, padding: '4px 10px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' },
  footer: { borderTop: '1.5px solid #E8F5E9', padding: '20px 24px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, background: 'white' },
  footerBrand: { fontFamily: DISPLAY, fontWeight: 900, fontSize: '1.1rem', color: '#2E7D32' },
  footerText: { fontSize: '0.78rem', color: '#AACAAA' },
}