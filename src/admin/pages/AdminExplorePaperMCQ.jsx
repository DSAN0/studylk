import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  adminGetExplorePaper,
  adminGetExplorePaperMCQQuestions,
  adminCreateExplorePaperMCQQuestion,
  adminUpdateExplorePaperMCQQuestion,
  adminDeleteExplorePaperMCQQuestion,
} from '../../api/api'

const CHOICES = ['A', 'B', 'C', 'D', 'E']

const emptyQ = {
  question_text: '',
  option_a: '', option_b: '', option_c: '', option_d: '', option_e: '',
  correct_answer: 'A',
  explanation: '',
  ordering: 0,
}

export default function AdminExplorePaperMCQ() {
  const { paperId } = useParams()
  const navigate    = useNavigate()

  const [paper,     setPaper]     = useState(null)
  const [questions, setQuestions] = useState([])
  const [form,      setForm]      = useState(emptyQ)
  const [editingId, setEditingId] = useState(null)
  const [error,     setError]     = useState('')
  const [saving,    setSaving]    = useState(false)
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')

  useEffect(() => { loadAll() }, [paperId])

  async function loadAll() {
    setLoading(true)
    try {
      const [pRes, qRes] = await Promise.all([
        adminGetExplorePaper(paperId),
        adminGetExplorePaperMCQQuestions(paperId),
      ])
      setPaper(pRes.data)
      setQuestions(qRes.data)
    } catch (err) {
      setError('Failed to load: ' + JSON.stringify(err.response?.data || err.message))
    } finally {
      setLoading(false)
    }
  }

  function setF(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function startEdit(q) {
    setEditingId(q.id)
    setForm({
      question_text:  q.question_text,
      option_a:       q.option_a,
      option_b:       q.option_b,
      option_c:       q.option_c,
      option_d:       q.option_d,
      option_e:       q.option_e || '',
      correct_answer: q.correct_answer,
      explanation:    q.explanation || '',
      ordering:       q.ordering,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyQ)
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const payload = { ...form, ordering: Number(form.ordering) }
      if (editingId) {
        await adminUpdateExplorePaperMCQQuestion(editingId, payload)
      } else {
        await adminCreateExplorePaperMCQQuestion(paperId, payload)
      }
      setForm(emptyQ)
      setEditingId(null)
      await loadAll()
    } catch (err) {
      setError(JSON.stringify(err.response?.data || 'Save failed'))
    } finally {
      setSaving(false)
    }
  }

  async function remove(id) {
    if (!confirm('Delete this question?')) return
    try {
      await adminDeleteExplorePaperMCQQuestion(id)
      if (editingId === id) cancelEdit()
      await loadAll()
    } catch (err) {
      setError(JSON.stringify(err.response?.data || 'Delete failed'))
    }
  }

  const filteredQs = search.trim()
    ? questions.filter(q => q.question_text.toLowerCase().includes(search.toLowerCase()))
    : questions

  if (loading) {
    return (
      <>
        <Fonts />
        <main style={s.page}>
          <Header />
          <div style={{ display:'flex', justifyContent:'center', padding:80 }}>
            <div style={s.spinner} />
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
              <p style={s.eyebrow}>Admin · Explore Papers · MCQ Questions</p>
              <h1 style={s.h1}>
                {paper
                  ? `${paper.subject_name || 'Subject'} — ${paper.year} · ${paper.medium} · ${paper.part}`
                  : 'MCQ Questions'}
              </h1>
              {paper && (
                <div style={s.paperMeta}>
                  <span style={s.pillGrade}>{paper.grade_name || paper.grade}</span>
                  {paper.stream_name && <span style={s.pillStream}>{paper.stream_name}</span>}
                  {paper.pdf_url && (
                    <a href={paper.pdf_url} target="_blank" rel="noopener noreferrer" style={s.pdfLink}>
                      📄 View PDF ↗
                    </a>
                  )}
                </div>
              )}
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <BackBtn label="← All Papers" onClick={() => navigate('/admin/explore-papers')} />
            </div>
          </div>

          {error && <ErrorBanner msg={error} onClose={() => setError('')} />}

          {/* Question count banner */}
          <div style={s.countBanner}>
            <span style={s.countNum}>{questions.length}</span>
            <span style={s.countLbl}>MCQ Question{questions.length !== 1 ? 's' : ''} in this paper</span>
            <div style={{ flex:1 }} />
            <div style={{ fontSize:'0.8rem', color:'#7A9A7A' }}>
              Correct answers are auto-graded when students practise.
            </div>
          </div>

          {/* ── Question Form ── */}
          <form onSubmit={handleSubmit} style={s.formCard}>
            <SectionTitle
              icon="✍️"
              title={editingId ? `Editing Question #${questions.findIndex(q => q.id === editingId) + 1}` : 'Add MCQ Question'}
            />

            <FormField label="Question Text">
              <textarea
                style={{...s.input, minHeight:100, resize:'vertical'}}
                value={form.question_text}
                onChange={e => setF('question_text', e.target.value)}
                placeholder="Type the full question here…"
                required
              />
            </FormField>

            {/* Choices grid */}
            <div style={s.choicesGrid}>
              {CHOICES.map(ch => (
                <FormField key={ch} label={`Choice ${ch}`}>
                  <div style={{ position:'relative' }}>
                    <div style={{
                      ...s.choicePrefix,
                      background: form.correct_answer === ch ? '#DCFCE7' : '#F1F5F9',
                      color:      form.correct_answer === ch ? '#166534' : '#94a3b8',
                      border:     `1.5px solid ${form.correct_answer === ch ? '#86EFAC' : '#E2E8F0'}`,
                    }}>
                      {ch}
                    </div>
                    <input
                      style={{...s.input, paddingLeft:44, marginBottom:0}}
                      value={form[`option_${ch.toLowerCase()}`]}
                      onChange={e => {
                        const val = e.target.value
                        setF(`option_${ch.toLowerCase()}`, val)
                        if (ch === 'E' && !val.trim() && form.correct_answer === 'E') {
                          setF('correct_answer', 'A')
                        }
                      }}
                      placeholder={`Answer choice ${ch}${ch === 'E' ? ' (optional)' : ''}`}
                      required={ch !== 'E'}
                    />
                  </div>
                </FormField>
              ))}
            </div>

            <div style={s.correctRow}>
              <span style={s.fieldLabel}>Correct Answer:</span>
              <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                {CHOICES.map(ch => {
                  const isEDisabled = ch === 'E' && !form.option_e?.trim()
                  return (
                    <button
                      key={ch}
                      type="button"
                      disabled={isEDisabled}
                      style={{
                        ...(form.correct_answer === ch ? s.correctBtnActive : s.correctBtn),
                        ...(isEDisabled ? { opacity: 0.4, cursor: 'not-allowed' } : {}),
                      }}
                      onClick={() => setF('correct_answer', ch)}
                    >
                      {ch}
                    </button>
                  )
                })}
              </div>
            </div>

            <FormField label="Explanation (optional — shown after answer)">
              <textarea
                style={{...s.input, minHeight:72, resize:'vertical'}}
                value={form.explanation}
                onChange={e => setF('explanation', e.target.value)}
                placeholder="Explain why the correct answer is right…"
              />
            </FormField>

            <FormField label="Ordering">
              <input
                type="number"
                style={{...s.input, maxWidth:120}}
                value={form.ordering}
                onChange={e => setF('ordering', e.target.value)}
                min={0}
              />
            </FormField>

            <div style={{ display:'flex', gap:10, marginTop:8 }}>
              <button type="submit" style={s.btnPrimary} disabled={saving}
                onMouseEnter={e => { if (!saving) e.currentTarget.style.opacity='0.88' }}
                onMouseLeave={e => e.currentTarget.style.opacity='1'}
              >
                {saving ? 'Saving…' : editingId ? '✓ Update Question' : '+ Add Question'}
              </button>
              {editingId && (
                <button type="button" style={s.cancelBtn} onClick={cancelEdit}
                  onMouseEnter={e => e.currentTarget.style.background='#F1F5F9'}
                  onMouseLeave={e => e.currentTarget.style.background='white'}
                >Cancel</button>
              )}
            </div>
          </form>

          {/* ── Questions List ── */}
          <section style={s.listCard}>
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20, flexWrap:'wrap' }}>
              <SectionTitle icon="📋" title={`Questions (${filteredQs.length})`} />
              <div style={{ flex:1 }} />
              <div style={{ position:'relative' }}>
                <span style={s.searchIcon}>🔍</span>
                <input
                  style={s.searchInput}
                  placeholder="Search questions…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>

            {filteredQs.length === 0 ? (
              <Empty text={search ? `No questions match "${search}"` : "No questions yet. Add your first question above."} />
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                {filteredQs.map((q, idx) => (
                  <div key={q.id} style={s.qCard}>
                    <div style={s.qHeader}>
                      <div style={s.qNum}>Q{idx + 1}</div>
                      <div style={s.qText}>{q.question_text}</div>
                      <div style={s.actionGroup}>
                        <button style={s.editBtn} onClick={() => startEdit(q)}
                          onMouseEnter={e => { e.currentTarget.style.background='#EFF6FF'; e.currentTarget.style.color='#1D4ED8' }}
                          onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#3B82F6' }}
                        >Edit</button>
                        <button style={s.deleteBtn} onClick={() => remove(q.id)}
                          onMouseEnter={e => { e.currentTarget.style.background='#FEE2E2'; e.currentTarget.style.color='#991B1B' }}
                          onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#EF4444' }}
                        >Delete</button>
                      </div>
                    </div>

                    <div style={s.choicesList}>
                      {CHOICES.filter(ch => q[`option_${ch.toLowerCase()}`]).map(ch => (
                        <div
                          key={ch}
                          style={{
                            ...s.choiceItem,
                            background: q.correct_answer === ch ? '#F0FDF4' : '#FAFCFA',
                            border:     `1.5px solid ${q.correct_answer === ch ? '#86EFAC' : '#E8F5E9'}`,
                          }}
                        >
                          <span style={{
                            ...s.choiceLetter,
                            background: q.correct_answer === ch ? '#22C55E' : '#E2E8F0',
                            color:      q.correct_answer === ch ? 'white' : '#64748B',
                          }}>
                            {ch}
                            {q.correct_answer === ch && ' ✓'}
                          </span>
                          <span style={s.choiceText}>{q[`option_${ch.toLowerCase()}`]}</span>
                        </div>
                      ))}
                    </div>

                    {q.explanation && (
                      <div style={s.explanationBox}>
                        <span style={{ fontWeight:700, color:'#0369a1' }}>💡 Explanation: </span>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <Footer />
      </main>
    </>
  )
}

/* ── Sub-Components ─────────────────────────────────────── */
function Fonts() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Nunito:wght@700;800;900&display=swap');
      * { box-sizing:border-box; margin:0; padding:0; }
      @keyframes spin { to { transform:rotate(360deg); } }
    `}</style>
  )
}

function Header() {
  return (
    <header style={s.header}>
      <div style={s.headerInner}>
        <div style={s.brandRow}>
          <div style={s.brandDot} />
          <span style={s.brandName}>Study<span style={{color:'#1A3A1A'}}>LK</span></span>
          <span style={s.adminBadge}>Admin</span>
        </div>
      </div>
    </header>
  )
}

function BackBtn({ onClick, label='← Back' }) {
  return (
    <button onClick={onClick} style={s.backBtn}
      onMouseEnter={e => { e.currentTarget.style.background='#E8F5E9'; e.currentTarget.style.color='#2E7D32' }}
      onMouseLeave={e => { e.currentTarget.style.background='white'; e.currentTarget.style.color='#4A6A4A' }}
    >{label}</button>
  )
}

function SectionTitle({ icon, title }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:0 }}>
      <span style={{ fontSize:'1.1rem' }}>{icon}</span>
      <h2 style={s.sectionTitle}>{title}</h2>
    </div>
  )
}

function FormField({ label, children }) {
  return (
    <div style={{ marginBottom:12 }}>
      <label style={s.fieldLabel}>{label}</label>
      {children}
    </div>
  )
}

function ErrorBanner({ msg, onClose }) {
  return (
    <div style={s.errorBanner}>
      <span>{msg}</span>
      <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#991B1B', fontWeight:700, fontSize:'1rem' }}>✕</button>
    </div>
  )
}

function Empty({ text }) {
  return <p style={{ fontSize:'0.875rem', color:'#7A9A7A', padding:'24px 0', textAlign:'center' }}>{text}</p>
}

function Footer() {
  return (
    <footer style={s.footer}>
      <span style={s.footerBrand}>Study<span style={{color:'#1A3A1A'}}>LK</span></span>
      <span style={s.footerText}>Admin Panel · {new Date().getFullYear()}</span>
    </footer>
  )
}

/* ── Styles ─────────────────────────────────────────────── */
const BASE    = "'Plus Jakarta Sans', sans-serif"
const DISPLAY = "'Nunito', sans-serif"

const s = {
  page:         { minHeight:'100vh', background:'#F8FBF8', color:'#1A3A1A', fontFamily:BASE },
  spinner:      { width:40, height:40, border:'4px solid #E8F5E9', borderTopColor:'#2E7D32', borderRadius:'50%', animation:'spin 0.8s linear infinite' },
  header:       { position:'sticky', top:0, zIndex:50, background:'rgba(248,251,248,0.9)', backdropFilter:'blur(12px)', borderBottom:'1.5px solid #E8F5E9' },
  headerInner:  { maxWidth:1280, margin:'0 auto', padding:'0 24px', height:60, display:'flex', alignItems:'center' },
  brandRow:     { display:'flex', alignItems:'center', gap:10 },
  brandDot:     { width:10, height:10, borderRadius:'50%', background:'linear-gradient(135deg,#4CAF50,#2E7D32)', boxShadow:'0 0 8px rgba(76,175,80,0.5)' },
  brandName:    { fontFamily:DISPLAY, fontWeight:900, fontSize:'1.35rem', color:'#2E7D32' },
  adminBadge:   { fontSize:'0.68rem', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', background:'#E8F5E9', color:'#2E7D32', padding:'3px 8px', borderRadius:50, border:'1px solid #C8E6C9' },
  container:    { maxWidth:1100, margin:'0 auto', padding:'36px 24px 60px' },
  titleRow:     { display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:16, marginBottom:20 },
  eyebrow:      { fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'#3B82F6', marginBottom:4 },
  h1:           { fontFamily:DISPLAY, fontWeight:900, fontSize:'clamp(1.4rem,3vw,2rem)', color:'#1A3A1A', letterSpacing:'-0.01em', marginBottom:8 },
  paperMeta:    { display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' },
  pillGrade:    { fontSize:'0.72rem', fontWeight:700, background:'#DCFCE7', color:'#166534', border:'1px solid #BBF7D0', padding:'3px 10px', borderRadius:50 },
  pillStream:   { fontSize:'0.72rem', fontWeight:700, background:'#EDE9FE', color:'#6D28D9', border:'1px solid #C4B5FD', padding:'3px 10px', borderRadius:50 },
  pdfLink:      { fontSize:'0.78rem', fontWeight:700, color:'#3B82F6', textDecoration:'none' },
  backBtn:      { display:'inline-flex', alignItems:'center', gap:6, background:'white', border:'1.5px solid #D4E8D4', borderRadius:50, padding:'8px 18px', fontSize:'0.82rem', fontWeight:600, color:'#4A6A4A', cursor:'pointer', fontFamily:BASE, transition:'all 0.18s', whiteSpace:'nowrap' },

  countBanner:  { display:'flex', alignItems:'center', gap:14, background:'white', border:'1.5px solid #E8F5E9', borderRadius:20, padding:'18px 24px', marginBottom:20, boxShadow:'0 2px 12px rgba(46,125,50,0.05)' },
  countNum:     { fontFamily:DISPLAY, fontSize:'2.2rem', fontWeight:900, color:'#2E7D32', lineHeight:1 },
  countLbl:     { fontSize:'0.88rem', fontWeight:600, color:'#4A6A4A' },

  formCard:     { background:'white', borderRadius:24, border:'1.5px solid #E8F5E9', padding:'28px', marginBottom:20, boxShadow:'0 2px 12px rgba(76,175,80,0.05)' },
  listCard:     { background:'white', borderRadius:24, border:'1.5px solid #E8F5E9', padding:'28px', boxShadow:'0 2px 12px rgba(76,175,80,0.05)' },
  sectionTitle: { fontFamily:DISPLAY, fontWeight:800, fontSize:'1.05rem', color:'#1A3A1A' },
  fieldLabel:   { display:'block', fontSize:'0.72rem', fontWeight:700, color:'#7A9A7A', marginBottom:6, letterSpacing:'0.04em', textTransform:'uppercase' },
  input:        { width:'100%', padding:'10px 14px', borderRadius:12, border:'1.5px solid #E8F5E9', background:'#FAFCFA', fontFamily:BASE, fontSize:'0.875rem', color:'#1A3A1A', outline:'none', marginBottom:0, transition:'border-color 0.2s' },

  choicesGrid:  { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px,1fr))', gap:'0 20px', marginBottom:16 },
  choicePrefix: { position:'absolute', left:0, top:0, width:38, height:'100%', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'12px 0 0 12px', fontWeight:800, fontSize:'0.82rem', transition:'all 0.18s' },

  correctRow:   { display:'flex', alignItems:'center', gap:16, marginBottom:16, flexWrap:'wrap' },
  correctBtn:   { width:40, height:40, borderRadius:10, border:'1.5px solid #E2E8F0', background:'#F8FAFC', fontFamily:DISPLAY, fontWeight:800, fontSize:'0.9rem', color:'#64748B', cursor:'pointer', transition:'all 0.18s' },
  correctBtnActive: { width:40, height:40, borderRadius:10, border:'1.5px solid #22C55E', background:'#DCFCE7', fontFamily:DISPLAY, fontWeight:800, fontSize:'0.9rem', color:'#166534', cursor:'pointer' },

  searchInput:  { padding:'8px 14px 8px 36px', borderRadius:10, border:'1.5px solid #E8F5E9', background:'#FAFCFA', fontFamily:BASE, fontSize:'0.82rem', color:'#1A3A1A', outline:'none', width:240 },
  searchIcon:   { position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', fontSize:'0.9rem', pointerEvents:'none' },

  qCard:        { background:'#FAFCFA', border:'1.5px solid #E8F5E9', borderRadius:18, padding:'18px 20px', transition:'border-color 0.18s' },
  qHeader:      { display:'flex', alignItems:'flex-start', gap:12, marginBottom:14 },
  qNum:         { width:32, height:32, borderRadius:8, background:'#1A3A1A', color:'white', fontFamily:DISPLAY, fontWeight:900, fontSize:'0.82rem', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2 },
  qText:        { flex:1, fontSize:'0.9rem', fontWeight:600, color:'#1A3A1A', lineHeight:1.55 },
  choicesList:  { display:'flex', flexDirection:'column', gap:8, marginBottom:10 },
  choiceItem:   { display:'flex', alignItems:'center', gap:10, borderRadius:10, padding:'8px 14px' },
  choiceLetter: { width:28, height:28, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:DISPLAY, fontWeight:800, fontSize:'0.75rem', flexShrink:0, whiteSpace:'nowrap' },
  choiceText:   { fontSize:'0.84rem', color:'#374151', flex:1 },
  explanationBox: { background:'#EFF6FF', border:'1.5px solid #BFDBFE', borderRadius:10, padding:'10px 14px', fontSize:'0.83rem', color:'#1e40af', lineHeight:1.55, marginTop:4 },

  actionGroup:  { display:'flex', gap:8, alignItems:'center', flexShrink:0 },
  editBtn:      { fontSize:'0.78rem', fontWeight:700, color:'#3B82F6', background:'transparent', border:'1.5px solid #3B82F6', borderRadius:50, padding:'6px 14px', cursor:'pointer', fontFamily:BASE, transition:'all 0.2s', whiteSpace:'nowrap' },
  deleteBtn:    { fontSize:'0.78rem', fontWeight:700, color:'#EF4444', background:'transparent', border:'1.5px solid #EF4444', borderRadius:50, padding:'6px 14px', cursor:'pointer', fontFamily:BASE, transition:'all 0.2s', whiteSpace:'nowrap' },
  btnPrimary:   { display:'inline-flex', alignItems:'center', background:'linear-gradient(135deg,#3B82F6,#1D4ED8)', color:'white', fontWeight:700, fontSize:'0.82rem', padding:'9px 20px', borderRadius:50, border:'none', cursor:'pointer', fontFamily:BASE, boxShadow:'0 3px 12px rgba(59,130,246,0.3)', transition:'opacity 0.18s', whiteSpace:'nowrap' },
  cancelBtn:    { display:'inline-flex', alignItems:'center', background:'white', color:'#64748B', fontWeight:600, fontSize:'0.82rem', padding:'9px 18px', borderRadius:50, border:'1.5px solid #E2E8F0', cursor:'pointer', fontFamily:BASE, transition:'background 0.18s', whiteSpace:'nowrap' },
  errorBanner:  { display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12, background:'#FEE2E2', border:'1.5px solid #FECACA', color:'#991B1B', borderRadius:16, padding:'12px 18px', fontSize:'0.85rem', marginBottom:20 },
  footer:       { borderTop:'1.5px solid #E8F5E9', padding:'20px 24px', display:'flex', justifyContent:'center', alignItems:'center', gap:12, background:'white' },
  footerBrand:  { fontFamily:DISPLAY, fontWeight:900, fontSize:'1.1rem', color:'#2E7D32' },
  footerText:   { fontSize:'0.78rem', color:'#AACAAA' },
}
