import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  adminCreateQuestionPaper,
  adminDeleteQuestionPaper,
  adminGetCourses,
  adminGetQuestionPapers,
} from '../../api/api'

const emptyForm = {
  course: '',
  title: '',
  description: '',
  duration_minutes: 120,
  is_active: true,
  ordering: 0,
}

export default function AdminQuestionPapers() {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [papers, setPapers]   = useState([])
  const [form, setForm]       = useState(emptyForm)
  const [error, setError]     = useState('')
  const [saving, setSaving]   = useState(false)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    try {
      const [cRes, pRes] = await Promise.all([adminGetCourses(), adminGetQuestionPapers()])
      setCourses(cRes.data)
      setPapers(pRes.data)
    } catch (err) {
      setError(JSON.stringify(err.response?.data || err.message))
    }
  }

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await adminCreateQuestionPaper({
        ...form,
        duration_minutes: Number(form.duration_minutes),
        ordering: Number(form.ordering),
      })
      setForm(emptyForm)
      await loadData()
    } catch (err) {
      setError(JSON.stringify(err.response?.data || 'Save failed'))
    } finally {
      setSaving(false)
    }
  }

  async function remove(id) {
    if (!confirm('Delete this paper?')) return
    try {
      await adminDeleteQuestionPaper(id)
      await loadData()
    } catch (err) {
      setError(JSON.stringify(err.response?.data || 'Delete failed'))
    }
  }

  return (
    <>
      <Fonts />
      <main style={s.page}>
        <Header />

        <div style={s.container}>
          {/* Title */}
          <div style={s.titleRow}>
            <div>
              <p style={s.eyebrow}>Admin · Assessments</p>
              <h1 style={s.h1}>Question Papers</h1>
            </div>
            <BackBtn onClick={() => navigate('/admin/dashboard')} />
          </div>

          {error && <ErrorBanner msg={error} onClose={() => setError('')} />}

          {/* Create form */}
          <form onSubmit={handleSubmit} style={s.formCard}>
            <SectionTitle icon="📝" title="Create Paper" />

            <div style={s.grid2}>
              <FormField label="Course">
                <select style={s.input} value={form.course} onChange={e => set('course', e.target.value)} required>
                  <option value="">Select course…</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </FormField>

              <FormField label="Title">
                <input style={s.input} value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Mid-Year Exam 2025" required />
              </FormField>

              <FormField label="Duration (minutes)">
                <input type="number" style={s.input} value={form.duration_minutes} onChange={e => set('duration_minutes', e.target.value)} min="1" />
              </FormField>

              <FormField label="Ordering">
                <input type="number" style={s.input} value={form.ordering} onChange={e => set('ordering', e.target.value)} />
              </FormField>
            </div>

            <FormField label="Description">
              <textarea rows="3" style={{ ...s.input, resize: 'vertical' }} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Brief description of this paper…" />
            </FormField>

            <div style={s.checkRow}>
              <input
                type="checkbox" id="paper_active"
                checked={form.is_active}
                onChange={e => set('is_active', e.target.checked)}
                style={{ accentColor: '#4CAF50', width: 15, height: 15 }}
              />
              <label htmlFor="paper_active" style={s.checkLabel}>Active (visible to students)</label>
            </div>

            <button type="submit" style={s.btnPrimary} disabled={saving}
              onMouseEnter={e => { if (!saving) e.currentTarget.style.opacity = '0.88' }}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              {saving ? 'Creating…' : '+ Create Paper'}
            </button>
          </form>

          {/* Papers list */}
          <section style={s.listCard}>
            <SectionTitle icon="📚" title={`All Papers (${papers.length})`} />

            {papers.length === 0
              ? <Empty text="No question papers created yet." />
              : <div style={s.cardList}>
                  {papers.map(p => (
                    <div key={p.id} style={s.paperRow}
                      onMouseEnter={e => e.currentTarget.style.borderColor = '#A5D6A7'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = '#E8F5E9'}
                    >
                      {/* Icon */}
                      <div style={s.paperIcon}>📝</div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={s.rowTitle}>{p.title}</h3>
                        <p style={s.rowMeta}>
                          <span style={s.courseTag}>{p.courseTitle}</span>
                          <Dot />
                          <span>⏱ {p.duration_minutes} min</span>
                          <Dot />
                          <span>❓ {p.questionCount} questions</span>
                        </p>
                      </div>

                      {/* Actions */}
                      <div style={s.actionGroup}>
                        <button
                          onClick={() => navigate(`/admin/question-papers/${p.id}/questions`)}
                          style={s.btnPrimary}
                          onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                        >
                          + Questions
                        </button>
                        <button onClick={() => remove(p.id)} style={s.deleteBtn}
                          onMouseEnter={e => { e.currentTarget.style.background = '#FEE2E2'; e.currentTarget.style.color = '#991B1B' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#EF4444' }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
            }
          </section>
        </div>

        <Footer />
      </main>
    </>
  )
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

function Header() {
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

function SectionTitle({ icon, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
      <span style={{ fontSize: '1.1rem' }}>{icon}</span>
      <h2 style={s.sectionTitle}>{title}</h2>
    </div>
  )
}

function FormField({ label, children }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <label style={s.fieldLabel}>{label}</label>
      {children}
    </div>
  )
}

function ErrorBanner({ msg, onClose }) {
  return (
    <div style={s.errorBanner}>
      <span>{msg}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#991B1B', fontWeight: 700, fontSize: '1rem' }}>✕</button>
    </div>
  )
}

function Empty({ text }) {
  return <p style={{ fontSize: '0.875rem', color: '#7A9A7A', padding: '12px 0' }}>{text}</p>
}

function Dot() {
  return <span style={{ margin: '0 6px', opacity: 0.35 }}>·</span>
}

function Footer() {
  return (
    <footer style={s.footer}>
      <span style={s.footerBrand}>Study<span style={{ color: '#1A3A1A' }}>LK</span></span>
      <span style={s.footerText}>Admin Panel · {new Date().getFullYear()}</span>
    </footer>
  )
}

/* ── styles ── */
const BASE = "'Plus Jakarta Sans', sans-serif"
const DISPLAY = "'Nunito', sans-serif"

const s = {
  page: { minHeight: '100vh', background: '#F8FBF8', color: '#1A3A1A', fontFamily: BASE },
  header: { position: 'sticky', top: 0, zIndex: 50, background: 'rgba(248,251,248,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1.5px solid #E8F5E9' },
  headerInner: { maxWidth: 1240, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center' },
  brandRow: { display: 'flex', alignItems: 'center', gap: 10 },
  brandDot: { width: 10, height: 10, borderRadius: '50%', background: 'linear-gradient(135deg,#4CAF50,#2E7D32)', boxShadow: '0 0 8px rgba(76,175,80,0.5)' },
  brandName: { fontFamily: DISPLAY, fontWeight: 900, fontSize: '1.35rem', color: '#2E7D32' },
  adminBadge: { fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: '#E8F5E9', color: '#2E7D32', padding: '3px 8px', borderRadius: 50, border: '1px solid #C8E6C9' },
  container: { maxWidth: 1240, margin: '0 auto', padding: '36px 24px 60px' },
  titleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 28 },
  eyebrow: { fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4CAF50', marginBottom: 4 },
  h1: { fontFamily: DISPLAY, fontWeight: 900, fontSize: 'clamp(1.6rem,3vw,2.2rem)', color: '#1A3A1A', letterSpacing: '-0.01em' },
  backBtn: { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'white', border: '1.5px solid #D4E8D4', borderRadius: 50, padding: '8px 18px', fontSize: '0.82rem', fontWeight: 600, color: '#4A6A4A', cursor: 'pointer', fontFamily: BASE, transition: 'all 0.18s', whiteSpace: 'nowrap' },
  formCard: { background: 'white', borderRadius: 24, border: '1.5px solid #E8F5E9', padding: '28px', marginBottom: 20, boxShadow: '0 2px 12px rgba(76,175,80,0.05)' },
  listCard: { background: 'white', borderRadius: 24, border: '1.5px solid #E8F5E9', padding: '28px', boxShadow: '0 2px 12px rgba(76,175,80,0.05)' },
  sectionTitle: { fontFamily: DISPLAY, fontWeight: 800, fontSize: '1.05rem', color: '#1A3A1A' },
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0 20px' },
  fieldLabel: { display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#7A9A7A', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' },
  input: { width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #E8F5E9', background: '#FAFCFA', fontFamily: BASE, fontSize: '0.875rem', color: '#1A3A1A', outline: 'none', marginBottom: 16, transition: 'border-color 0.2s' },
  checkRow: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, marginBottom: 4 },
  checkLabel: { fontSize: '0.85rem', color: '#4A6A4A', fontWeight: 500, cursor: 'pointer' },
  btnPrimary: { display: 'inline-flex', alignItems: 'center', background: 'linear-gradient(135deg,#4CAF50,#2E7D32)', color: 'white', fontWeight: 700, fontSize: '0.82rem', padding: '9px 18px', borderRadius: 50, border: 'none', cursor: 'pointer', fontFamily: BASE, boxShadow: '0 3px 12px rgba(76,175,80,0.3)', transition: 'opacity 0.18s', marginTop: 8, whiteSpace: 'nowrap' },
  cardList: { display: 'flex', flexDirection: 'column', gap: 10 },
  paperRow: { display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', background: '#FAFCFA', border: '1.5px solid #E8F5E9', borderRadius: 16, padding: '14px 18px', transition: 'border-color 0.2s' },
  paperIcon: { width: 40, height: 40, borderRadius: 12, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 },
  rowTitle: { fontWeight: 700, fontSize: '0.875rem', color: '#1A3A1A', marginBottom: 4 },
  rowMeta: { fontSize: '0.775rem', color: '#7A9A7A', display: 'flex', alignItems: 'center', flexWrap: 'wrap' },
  courseTag: { background: '#E8F5E9', color: '#2E7D32', borderRadius: 50, padding: '2px 9px', fontSize: '0.7rem', fontWeight: 700, border: '1px solid #C8E6C9' },
  actionGroup: { display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 },
  deleteBtn: { fontSize: '0.78rem', fontWeight: 700, color: '#EF4444', background: 'transparent', border: '1.5px solid #EF4444', borderRadius: 50, padding: '7px 14px', cursor: 'pointer', fontFamily: BASE, transition: 'all 0.2s', whiteSpace: 'nowrap' },
  errorBanner: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, background: '#FEE2E2', border: '1.5px solid #FECACA', color: '#991B1B', borderRadius: 16, padding: '12px 18px', fontSize: '0.85rem', marginBottom: 20 },
  footer: { borderTop: '1.5px solid #E8F5E9', padding: '20px 24px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, background: 'white' },
  footerBrand: { fontFamily: DISPLAY, fontWeight: 900, fontSize: '1.1rem', color: '#2E7D32' },
  footerText: { fontSize: '0.78rem', color: '#AACAAA' },
}