import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  adminGetCourses,
  adminGetPastPapers,
  adminCreatePastPaper,
  adminUpdatePastPaper,
  adminDeletePastPaper,
} from '../../api/api'

const emptyForm = {
  course: '',
  year: new Date().getFullYear(),
  part_number: 1,
  part_label: '',
  is_mcq: true,
  ordering: 0,
  is_active: true,
}

export default function AdminPastPapers() {
  const navigate = useNavigate()

  const [courses, setCourses] = useState([])
  const [papers, setPapers]   = useState([])
  const [form, setForm]       = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError]     = useState('')
  const [saving, setSaving]   = useState(false)
  const [courseFilter, setCourseFilter] = useState('')

  useEffect(() => { loadData() }, [])

  async function loadData() {
    try {
      const [cRes, pRes] = await Promise.all([
        adminGetCourses(),
        adminGetPastPapers(),
      ])
      setCourses(cRes.data)
      setPapers(pRes.data)
    } catch (err) {
      setError(JSON.stringify(err.response?.data || 'Could not load data'))
    }
  }

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function startEdit(paper) {
    setEditingId(paper.id)
    setForm({
      course: paper.course,
      year: paper.year,
      part_number: paper.part_number,
      part_label: paper.part_label || '',
      is_mcq: paper.is_mcq,
      ordering: paper.ordering,
      is_active: paper.is_active,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyForm)
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const payload = {
        ...form,
        year: Number(form.year),
        part_number: Number(form.part_number),
        ordering: Number(form.ordering),
      }
      if (editingId) {
        await adminUpdatePastPaper(editingId, payload)
      } else {
        await adminCreatePastPaper(payload)
      }
      setForm(emptyForm)
      setEditingId(null)
      await loadData()
    } catch (err) {
      setError(JSON.stringify(err.response?.data || 'Save failed'))
    } finally {
      setSaving(false)
    }
  }

  async function remove(id) {
    if (!confirm('Delete this past paper part and all its questions?')) return
    try {
      await adminDeletePastPaper(id)
      if (editingId === id) cancelEdit()
      await loadData()
    } catch (err) {
      setError(JSON.stringify(err.response?.data || 'Delete failed'))
    }
  }

  const courseMap = Object.fromEntries(courses.map(c => [c.id, c.title]))

  const filteredPapers = courseFilter
    ? papers.filter(p => p.course === courseFilter)
    : papers

  // Group filtered papers by course then by year for readable display
  const grouped = {}
  filteredPapers.forEach(p => {
    const courseTitle = p.courseTitle || courseMap[p.course] || 'Unknown Course'
    grouped[courseTitle] = grouped[courseTitle] || {}
    grouped[courseTitle][p.year] = grouped[courseTitle][p.year] || []
    grouped[courseTitle][p.year].push(p)
  })

  return (
    <>
      <Fonts />
      <main style={s.page}>
        <Header />

        <div style={s.container}>
          {/* Title */}
          <div style={s.titleRow}>
            <div>
              <p style={s.eyebrow}>Admin · Past Papers</p>
              <h1 style={s.h1}>Past Papers</h1>
            </div>
            <BackBtn onClick={() => navigate('/admin/dashboard')} />
          </div>

          {error && <ErrorBanner msg={error} onClose={() => setError('')} />}

          {/* Create / Edit form */}
          <form onSubmit={handleSubmit} style={s.formCard}>
            <SectionTitle icon="🗂️" title={editingId ? 'Edit Past Paper Part' : 'Create Past Paper Part'} />

            <div style={s.grid2}>
              <FormField label="Course">
                <select style={s.input} value={form.course} onChange={e => set('course', e.target.value)} required>
                  <option value="">Select course…</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </FormField>

              <FormField label="Year">
                <input
                  type="number"
                  style={s.input}
                  value={form.year}
                  onChange={e => set('year', e.target.value)}
                  placeholder="e.g. 2023"
                  required
                />
              </FormField>

              <FormField label="Part Number">
                <input
                  type="number"
                  style={s.input}
                  value={form.part_number}
                  onChange={e => set('part_number', e.target.value)}
                  min={1}
                  required
                />
              </FormField>

              <FormField label="Part Label">
                <input
                  style={s.input}
                  value={form.part_label}
                  onChange={e => set('part_label', e.target.value)}
                  placeholder='e.g. "Part 1 – MCQ Paper" (optional)'
                />
              </FormField>

              <FormField label="Ordering">
                <input type="number" style={s.input} value={form.ordering} onChange={e => set('ordering', e.target.value)} min={0} />
              </FormField>
            </div>

            {/* Paper type selector */}
            <FormField label="Paper Type">
              <div style={s.typeGrid}>
                <button
                  type="button"
                  style={form.is_mcq ? s.typeBtnActiveBlue : s.typeBtn}
                  onClick={() => set('is_mcq', true)}
                >
                  📋 MCQ Paper <span style={s.typeBtnHint}>(A–E options, auto-graded)</span>
                </button>
                <button
                  type="button"
                  style={!form.is_mcq ? s.typeBtnActivePurple : s.typeBtn}
                  onClick={() => set('is_mcq', false)}
                >
                  ✍️ Essay / Structured <span style={s.typeBtnHint}>(long model answers)</span>
                </button>
              </div>
            </FormField>

            <div style={s.checkRow}>
              <input
                type="checkbox" id="paper_active"
                checked={form.is_active}
                onChange={e => set('is_active', e.target.checked)}
                style={{ accentColor: '#1D4ED8', width: 15, height: 15 }}
              />
              <label htmlFor="paper_active" style={s.checkLabel}>Active (visible to students)</label>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button type="submit" style={s.btnPrimary} disabled={saving}
                onMouseEnter={e => { if (!saving) e.currentTarget.style.opacity = '0.88' }}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                {saving ? 'Saving…' : editingId ? '✓ Update Part' : '+ Create Part'}
              </button>

              {editingId && (
                <button type="button" style={s.cancelBtn} onClick={cancelEdit}
                  onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'}
                  onMouseLeave={e => e.currentTarget.style.background = 'white'}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* Filter row */}
          <div style={s.filterRow}>
            <span style={s.filterLabel}>Filter by course:</span>
            <select
              style={{ ...s.input, marginBottom: 0, maxWidth: 280 }}
              value={courseFilter}
              onChange={e => setCourseFilter(e.target.value)}
            >
              <option value="">All Courses</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>

          {/* List, grouped by course → year */}
          <section style={s.listCard}>
            <SectionTitle icon="📋" title={`All Past Paper Parts (${filteredPapers.length})`} />

            {filteredPapers.length === 0 ? (
              <Empty text="No past papers created yet." />
            ) : (
              Object.entries(grouped).map(([courseTitle, years]) => (
                <div key={courseTitle} style={s.courseGroup}>
                  <h3 style={s.courseGroupTitle}>📖 {courseTitle}</h3>

                  {Object.entries(years)
                    .sort((a, b) => Number(b[0]) - Number(a[0]))
                    .map(([year, parts]) => (
                      <div key={year} style={s.yearGroup}>
                        <div style={s.yearBadge}>{year}</div>
                        <div style={s.cardList}>
                          {parts
                            .sort((a, b) => a.part_number - b.part_number)
                            .map(paper => (
                              <div key={paper.id} style={s.paperRow}
                                onMouseEnter={e => e.currentTarget.style.borderColor = paper.is_mcq ? '#BFDBFE' : '#D8B4FE'}
                                onMouseLeave={e => e.currentTarget.style.borderColor = '#E8F5E9'}
                              >
                                <div style={{
                                  ...s.paperIcon,
                                  background: paper.is_mcq ? '#EFF6FF' : '#F3E8FF',
                                  border: `1.5px solid ${paper.is_mcq ? '#BFDBFE' : '#D8B4FE'}`,
                                }}>
                                  {paper.is_mcq ? '📋' : '✍️'}
                                </div>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <h3 style={s.rowTitle}>
                                    {paper.part_label || `Part ${paper.part_number}`}
                                  </h3>
                                  <p style={s.rowMeta}>
                                    <span style={{
                                      ...s.typePill,
                                      background: paper.is_mcq ? '#EFF6FF' : '#F3E8FF',
                                      color: paper.is_mcq ? '#1D4ED8' : '#7C3AED',
                                      borderColor: paper.is_mcq ? '#BFDBFE' : '#D8B4FE',
                                    }}>
                                      {paper.is_mcq ? 'MCQ' : 'Essay'}
                                    </span>
                                    <Dot />
                                    <span>
                                      ❓ {paper.is_mcq
                                        ? (paper.mcqQuestionCount ?? 0)
                                        : (paper.essayQuestionCount ?? 0)} questions
                                    </span>
                                    <Dot />
                                    <span style={{
                                      ...s.statusPill,
                                      background: paper.is_active ? '#DCFCE7' : '#F1F5F9',
                                      color: paper.is_active ? '#166534' : '#64748B',
                                      border: `1px solid ${paper.is_active ? '#BBF7D0' : '#E2E8F0'}`,
                                    }}>
                                      {paper.is_active ? 'Active' : 'Hidden'}
                                    </span>
                                  </p>
                                </div>

                                <div style={s.actionGroup}>
                                  <button
                                    onClick={() => navigate(`/admin/past-papers/${paper.id}/questions`)}
                                    style={paper.is_mcq ? s.btnPrimary : s.btnPrimaryPurple}
                                    onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                  >
                                    + Questions
                                  </button>
                                  <button
                                    onClick={() => startEdit(paper)}
                                    style={s.editBtn}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#EFF6FF'; e.currentTarget.style.color = '#1D4ED8' }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#3B82F6' }}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => remove(paper.id)}
                                    style={s.deleteBtn}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#FEE2E2'; e.currentTarget.style.color = '#991B1B' }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#EF4444' }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                </div>
              ))
            )}
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
      @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
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
  eyebrow: { fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#3B82F6', marginBottom: 4 },
  h1: { fontFamily: DISPLAY, fontWeight: 900, fontSize: 'clamp(1.6rem,3vw,2.2rem)', color: '#1A3A1A', letterSpacing: '-0.01em' },
  backBtn: { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'white', border: '1.5px solid #D4E8D4', borderRadius: 50, padding: '8px 18px', fontSize: '0.82rem', fontWeight: 600, color: '#4A6A4A', cursor: 'pointer', fontFamily: BASE, transition: 'all 0.18s', whiteSpace: 'nowrap' },
  formCard: { background: 'white', borderRadius: 24, border: '1.5px solid #E8F5E9', padding: '28px', marginBottom: 20, boxShadow: '0 2px 12px rgba(76,175,80,0.05)' },
  listCard: { background: 'white', borderRadius: 24, border: '1.5px solid #E8F5E9', padding: '28px', boxShadow: '0 2px 12px rgba(76,175,80,0.05)' },
  sectionTitle: { fontFamily: DISPLAY, fontWeight: 800, fontSize: '1.05rem', color: '#1A3A1A' },
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0 20px' },
  fieldLabel: { display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#7A9A7A', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' },
  input: { width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #E8F5E9', background: '#FAFCFA', fontFamily: BASE, fontSize: '0.875rem', color: '#1A3A1A', outline: 'none', marginBottom: 16, transition: 'border-color 0.2s' },
  checkRow: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, marginBottom: 4 },
  checkLabel: { fontSize: '0.85rem', color: '#4A6A4A', fontWeight: 500, cursor: 'pointer' },
  typeGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10, marginBottom: 16 },
  typeBtn: {
    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2,
    padding: '12px 16px', borderRadius: 14, border: '1.5px solid #E8F5E9',
    background: '#FAFCFA', color: '#4A6A4A', fontWeight: 700, fontSize: '0.85rem',
    cursor: 'pointer', fontFamily: BASE, textAlign: 'left', transition: 'all 0.18s',
  },
  typeBtnActiveBlue: {
    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2,
    padding: '12px 16px', borderRadius: 14, border: '1.5px solid #3B82F6',
    background: '#EFF6FF', color: '#1D4ED8', fontWeight: 700, fontSize: '0.85rem',
    cursor: 'pointer', fontFamily: BASE, textAlign: 'left', transition: 'all 0.18s',
  },
  typeBtnActivePurple: {
    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2,
    padding: '12px 16px', borderRadius: 14, border: '1.5px solid #8B5CF6',
    background: '#F3E8FF', color: '#7C3AED', fontWeight: 700, fontSize: '0.85rem',
    cursor: 'pointer', fontFamily: BASE, textAlign: 'left', transition: 'all 0.18s',
  },
  typeBtnHint: { fontSize: '0.7rem', fontWeight: 500, opacity: 0.75 },
  btnPrimary: { display: 'inline-flex', alignItems: 'center', background: 'linear-gradient(135deg,#3B82F6,#1D4ED8)', color: 'white', fontWeight: 700, fontSize: '0.82rem', padding: '9px 18px', borderRadius: 50, border: 'none', cursor: 'pointer', fontFamily: BASE, boxShadow: '0 3px 12px rgba(59,130,246,0.3)', transition: 'opacity 0.18s', whiteSpace: 'nowrap' },
  btnPrimaryPurple: { display: 'inline-flex', alignItems: 'center', background: 'linear-gradient(135deg,#8B5CF6,#7C3AED)', color: 'white', fontWeight: 700, fontSize: '0.82rem', padding: '9px 18px', borderRadius: 50, border: 'none', cursor: 'pointer', fontFamily: BASE, boxShadow: '0 3px 12px rgba(139,92,246,0.3)', transition: 'opacity 0.18s', whiteSpace: 'nowrap' },
  cancelBtn: { display: 'inline-flex', alignItems: 'center', background: 'white', color: '#64748B', fontWeight: 600, fontSize: '0.82rem', padding: '9px 18px', borderRadius: 50, border: '1.5px solid #E2E8F0', cursor: 'pointer', fontFamily: BASE, transition: 'background 0.18s', whiteSpace: 'nowrap' },
  filterRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' },
  filterLabel: { fontSize: '0.8rem', fontWeight: 700, color: '#4A6A4A' },
  courseGroup: { marginBottom: 28 },
  courseGroupTitle: { fontFamily: DISPLAY, fontWeight: 800, fontSize: '0.95rem', color: '#2E7D32', marginBottom: 14, paddingBottom: 10, borderBottom: '1.5px solid #E8F5E9' },
  yearGroup: { display: 'flex', gap: 16, marginBottom: 16, alignItems: 'flex-start' },
  yearBadge: { background: '#1A3A1A', color: 'white', fontFamily: DISPLAY, fontWeight: 900, fontSize: '0.9rem', padding: '8px 14px', borderRadius: 12, flexShrink: 0, minWidth: 60, textAlign: 'center' },
  cardList: { display: 'flex', flexDirection: 'column', gap: 10, flex: 1 },
  paperRow: { display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', background: '#FAFCFA', border: '1.5px solid #E8F5E9', borderRadius: 16, padding: '14px 18px', transition: 'border-color 0.2s' },
  paperIcon: { width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 },
  rowTitle: { fontWeight: 700, fontSize: '0.875rem', color: '#1A3A1A', marginBottom: 4 },
  rowMeta: { fontSize: '0.775rem', color: '#7A9A7A', display: 'flex', alignItems: 'center', flexWrap: 'wrap' },
  typePill: { borderRadius: 50, padding: '2px 9px', fontSize: '0.7rem', fontWeight: 700, border: '1px solid' },
  statusPill: { borderRadius: 50, padding: '2px 9px', fontSize: '0.7rem', fontWeight: 700 },
  actionGroup: { display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 },
  editBtn: { fontSize: '0.78rem', fontWeight: 700, color: '#3B82F6', background: 'transparent', border: '1.5px solid #3B82F6', borderRadius: 50, padding: '7px 14px', cursor: 'pointer', fontFamily: BASE, transition: 'all 0.2s', whiteSpace: 'nowrap' },
  deleteBtn: { fontSize: '0.78rem', fontWeight: 700, color: '#EF4444', background: 'transparent', border: '1.5px solid #EF4444', borderRadius: 50, padding: '7px 14px', cursor: 'pointer', fontFamily: BASE, transition: 'all 0.2s', whiteSpace: 'nowrap' },
  errorBanner: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, background: '#FEE2E2', border: '1.5px solid #FECACA', color: '#991B1B', borderRadius: 16, padding: '12px 18px', fontSize: '0.85rem', marginBottom: 20 },
  footer: { borderTop: '1.5px solid #E8F5E9', padding: '20px 24px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, background: 'white' },
  footerBrand: { fontFamily: DISPLAY, fontWeight: 900, fontSize: '1.1rem', color: '#2E7D32' },
  footerText: { fontSize: '0.78rem', color: '#AACAAA' },
}