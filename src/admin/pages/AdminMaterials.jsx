import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  adminCreateMaterial,
  adminDeleteMaterial,
  adminGetCourses,
  adminGetMaterials,
} from '../../api/api'

const emptyForm = {
  course: '',
  title: '',
  material_type: 'note',
  description: '',
  video_url: '',
  file: null,
  is_active: true,
  ordering: 0,
}

const TYPE_META = {
  note:  { label: 'Note',  icon: '📄', bg: '#E8F5E9', color: '#2E7D32', border: '#C8E6C9' },
  paper: { label: 'Paper', icon: '📝', bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
  video: { label: 'Video', icon: '🎬', bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' },
  other: { label: 'Other', icon: '📦', bg: '#F3E8FF', color: '#6D28D9', border: '#DDD6FE' },
}

export default function AdminMaterials() {
  const navigate = useNavigate()
  const [courses, setCourses]     = useState([])
  const [materials, setMaterials] = useState([])
  const [form, setForm]           = useState(emptyForm)
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    try {
      setLoading(true)
      const [cRes, mRes] = await Promise.all([adminGetCourses(), adminGetMaterials()])
      setCourses(cRes.data)
      setMaterials(mRes.data)
    } catch (err) {
      console.error(err)
      setError(JSON.stringify(err.response?.data || err.message))
    } finally {
      setLoading(false)
    }
  }

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.course) return setError('Please select a course.')
    if (!form.title.trim()) return setError('Title is required.')
    setSaving(true)

    const data = new FormData()
    data.append('course', form.course)
    data.append('title', form.title)
    data.append('material_type', form.material_type)
    data.append('description', form.description)
    data.append('video_url', form.video_url)
    data.append('is_active', form.is_active)
    data.append('ordering', form.ordering)
    if (form.file) data.append('file', form.file)

    try {
      await adminCreateMaterial(data)
      setForm(emptyForm)
      await loadData()
    } catch (err) {
      setError(JSON.stringify(err.response?.data || 'Material save failed'))
    } finally {
      setSaving(false)
    }
  }

  async function removeMaterial(id) {
    if (!confirm('Delete this material?')) return
    try {
      await adminDeleteMaterial(id)
      await loadData()
    } catch (err) {
      setError(JSON.stringify(err.response?.data || 'Delete failed'))
    }
  }

  if (loading) {
    return (
      <>
        <Fonts />
        <main style={s.page}>
          <div style={s.loadingWrap}>
            <div style={s.spinner} />
            <p style={s.loadingText}>Loading materials…</p>
          </div>
        </main>
      </>
    )
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
              <p style={s.eyebrow}>Admin · Content</p>
              <h1 style={s.h1}>Course Materials</h1>
            </div>
            <BackBtn onClick={() => navigate('/admin/dashboard')} />
          </div>

          {error && <ErrorBanner msg={error} onClose={() => setError('')} />}

          {/* Add form */}
          <form onSubmit={handleSubmit} style={s.formCard}>
            <SectionTitle icon="➕" title="Add Material" />

            <div style={s.grid2}>
              <FormField label="Course">
                <select style={s.input} value={form.course} onChange={e => set('course', e.target.value)}>
                  <option value="">Select course…</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </FormField>

              <FormField label="Material Type">
                <select style={s.input} value={form.material_type} onChange={e => set('material_type', e.target.value)}>
                  <option value="note">Note</option>
                  <option value="paper">Paper</option>
                  <option value="video">Video</option>
                  <option value="other">Other</option>
                </select>
              </FormField>

              <FormField label="Title">
                <input style={s.input} value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Unit 01 Notes" />
              </FormField>

              <FormField label="Video URL">
                <input style={s.input} value={form.video_url} onChange={e => set('video_url', e.target.value)} placeholder="https://youtube.com/…" />
              </FormField>

              <FormField label="File">
                <input type="file" style={{ ...s.input, paddingTop: 7 }} onChange={e => set('file', e.target.files[0])} />
              </FormField>

              <FormField label="Ordering">
                <input type="number" style={s.input} value={form.ordering} onChange={e => set('ordering', e.target.value)} />
              </FormField>
            </div>

            <FormField label="Description">
              <textarea rows="3" style={{ ...s.input, resize: 'vertical' }} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Brief description of this material…" />
            </FormField>

            <div style={s.checkRow}>
              <input
                type="checkbox" id="is_active_mat"
                checked={form.is_active}
                onChange={e => set('is_active', e.target.checked)}
                style={{ accentColor: '#4CAF50', width: 15, height: 15 }}
              />
              <label htmlFor="is_active_mat" style={s.checkLabel}>Active (visible to students)</label>
            </div>

            <button type="submit" style={s.btnPrimary} disabled={saving}
              onMouseEnter={e => { if (!saving) e.currentTarget.style.opacity = '0.88' }}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              {saving ? 'Saving…' : '+ Add Material'}
            </button>
          </form>

          {/* Materials list */}
          <section style={s.listCard}>
            <SectionTitle icon="📚" title={`All Materials (${materials.length})`} />

            {materials.length === 0
              ? <Empty text="No materials added yet." />
              : <div style={s.cardList}>
                  {materials.map(m => {
                    const meta = TYPE_META[m.material_type] || TYPE_META.other
                    return (
                      <div key={m.id} style={s.matRow}
                        onMouseEnter={e => e.currentTarget.style.borderColor = '#A5D6A7'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = '#E8F5E9'}
                      >
                        <div style={{ ...s.typeChip, background: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}>
                          {meta.icon} {meta.label}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h3 style={s.matTitle}>{m.title}</h3>
                          <p style={s.matMeta}>{m.courseTitle}</p>
                          <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                            {m.fileUrl && (
                              <a href={m.fileUrl} target="_blank" rel="noreferrer" style={s.link}>📎 Open file</a>
                            )}
                            {m.video_url && (
                              <a href={m.video_url} target="_blank" rel="noreferrer" style={s.link}>▶ Open video</a>
                            )}
                          </div>
                        </div>

                        <button onClick={() => removeMaterial(m.id)} style={s.deleteBtn}
                          onMouseEnter={e => { e.currentTarget.style.background = '#FEE2E2'; e.currentTarget.style.color = '#991B1B' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#EF4444' }}
                        >
                          Delete
                        </button>
                      </div>
                    )
                  })}
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
  loadingWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 16 },
  spinner: { width: 36, height: 36, borderRadius: '50%', border: '3px solid #E8F5E9', borderTopColor: '#4CAF50', animation: 'spin 0.8s linear infinite' },
  loadingText: { color: '#7A9A7A', fontSize: '0.9rem' },
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
  input: {
    width: '100%', padding: '10px 14px', borderRadius: 12,
    border: '1.5px solid #E8F5E9', background: '#FAFCFA',
    fontFamily: BASE, fontSize: '0.875rem', color: '#1A3A1A',
    outline: 'none', marginBottom: 16, transition: 'border-color 0.2s',
  },
  checkRow: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, marginBottom: 4 },
  checkLabel: { fontSize: '0.85rem', color: '#4A6A4A', fontWeight: 500, cursor: 'pointer' },
  btnPrimary: { display: 'inline-flex', alignItems: 'center', background: 'linear-gradient(135deg,#4CAF50,#2E7D32)', color: 'white', fontWeight: 700, fontSize: '0.875rem', padding: '10px 22px', borderRadius: 50, border: 'none', cursor: 'pointer', fontFamily: BASE, boxShadow: '0 3px 12px rgba(76,175,80,0.3)', transition: 'opacity 0.18s', marginTop: 8 },
  cardList: { display: 'flex', flexDirection: 'column', gap: 10 },
  matRow: { display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', background: '#FAFCFA', border: '1.5px solid #E8F5E9', borderRadius: 16, padding: '14px 18px', transition: 'border-color 0.2s' },
  typeChip: { display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', fontWeight: 700, padding: '4px 10px', borderRadius: 50, whiteSpace: 'nowrap', flexShrink: 0 },
  matTitle: { fontWeight: 700, fontSize: '0.875rem', color: '#1A3A1A', marginBottom: 2 },
  matMeta: { fontSize: '0.775rem', color: '#7A9A7A' },
  link: { fontSize: '0.775rem', color: '#2E7D32', fontWeight: 600, textDecoration: 'none' },
  deleteBtn: { fontSize: '0.78rem', fontWeight: 700, color: '#EF4444', background: 'transparent', border: '1.5px solid #EF4444', borderRadius: 50, padding: '6px 14px', cursor: 'pointer', fontFamily: BASE, transition: 'all 0.2s', whiteSpace: 'nowrap', marginLeft: 'auto' },
  errorBanner: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, background: '#FEE2E2', border: '1.5px solid #FECACA', color: '#991B1B', borderRadius: 16, padding: '12px 18px', fontSize: '0.85rem', marginBottom: 20 },
  footer: { borderTop: '1.5px solid #E8F5E9', padding: '20px 24px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, background: 'white' },
  footerBrand: { fontFamily: DISPLAY, fontWeight: 900, fontSize: '1.1rem', color: '#2E7D32' },
  footerText: { fontSize: '0.78rem', color: '#AACAAA' },
}