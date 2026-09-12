import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  adminGetExploreGrades,
  adminGetExploreStreams,
  adminGetExploreSubjects,
  adminCreateExploreSubject,
  adminUpdateExploreSubject,
  adminDeleteExploreSubject,
  adminGetExplorePapers,
  adminCreateExplorePaper,
  adminUpdateExplorePaper,
  adminDeleteExplorePaper,
} from '../../api/api'

/* ── Fixed constants for Grades & Streams ─────────────────── */
const FIXED_GRADES = [
  { id: 'ol',     name: 'O/L',     fullName: 'Ordinary Level (O/L)',       hasStreams: false },
  { id: 'al',     name: 'A/L',     fullName: 'Advanced Level (A/L)',       hasStreams: true },
  { id: 'grade5', name: 'Grade 5', fullName: 'Grade 5 Scholarship Exam',   hasStreams: false },
]

const FIXED_STREAMS = [
  { id: 'science',  gradeId: 'al', name: 'Science',    icon: '🔬' },
  { id: 'commerce', gradeId: 'al', name: 'Commerce',   icon: '📊' },
  { id: 'arts',     gradeId: 'al', name: 'Arts',       icon: '🎨' },
  { id: 'tech',     gradeId: 'al', name: 'Technology', icon: '⚙️' },
]

const MEDIUMS = ['Sinhala', 'English', 'Tamil']
const PARTS   = [
  { num: 1, label: 'Part 1' },
  { num: 2, label: 'Part 2' },
]
const YEARS   = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015]

const emptySubject = { grade: 'ol', stream: '', name: '', slug: '', icon: '📖', ordering: 0, is_active: true }
const emptyPaper   = { grade: 'ol', stream: '', subject: '', year: 2025, medium: 'Sinhala', part_number: 1, part_label: '', pdf_file: null, is_active: true }

export default function AdminExplorePapers() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('Papers') // 'Subjects' or 'Papers'

  /* data from backend */
  const [subjects, setSubjects] = useState([])
  const [papers,   setPapers]   = useState([])
  const [loading,  setLoading]  = useState(true)

  /* forms */
  const [subForm, setSubForm] = useState(emptySubject)
  const [pForm,   setPForm]   = useState(emptyPaper)

  /* editing IDs */
  const [subEdit, setSubEdit] = useState(null)
  const [pEdit,   setPEdit]   = useState(null)

  /* ui state */
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState('')
  const [saving,  setSaving]  = useState(false)

  /* filters */
  const [filterGrade,   setFilterGrade]   = useState('')
  const [filterStream,  setFilterStream]  = useState('')
  const [filterSubject, setFilterSubject] = useState('')
  const [filterMedium,  setFilterMedium]  = useState('')
  const [filterYear,    setFilterYear]    = useState('')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const [subRes, pRes] = await Promise.all([
        adminGetExploreSubjects(),
        adminGetExplorePapers(),
      ])
      setSubjects(subRes.data)
      setPapers(pRes.data)
    } catch (err) {
      setError('Could not load data: ' + JSON.stringify(err.response?.data || err.message))
    } finally {
      setLoading(false)
    }
  }

  function showMsg(msg, isError = false) {
    if (isError) {
      setError(msg)
      setSuccess('')
    } else {
      setSuccess(msg)
      setError('')
      setTimeout(() => setSuccess(''), 4000)
    }
  }

  /* ── Auto-slug generator ────────────────────────────────── */
  function handleSubjectNameChange(name) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    setSubForm(prev => ({
      ...prev,
      name,
      slug: subEdit ? prev.slug : slug,
    }))
  }

  /* ── Subject CRUD ───────────────────────────────────────── */
  async function saveSubject(e) {
    e.preventDefault()
    setError(''); setSuccess(''); setSaving(true)
    try {
      const payload = {
        grade: subForm.grade,
        stream: subForm.grade === 'al' ? (subForm.stream || null) : null,
        name: subForm.name.trim(),
        slug: subForm.slug.trim() || subForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        icon: subForm.icon || '📖',
        ordering: Number(subForm.ordering) || 0,
        is_active: subForm.is_active,
      }

      if (subEdit) {
        await adminUpdateExploreSubject(subEdit, payload)
        showMsg('Subject updated successfully!')
      } else {
        await adminCreateExploreSubject(payload)
        showMsg('Subject added successfully!')
      }
      setSubForm(emptySubject)
      setSubEdit(null)
      await loadData()
    } catch (err) {
      showMsg(JSON.stringify(err.response?.data || 'Subject save failed'), true)
    } finally {
      setSaving(false)
    }
  }

  async function deleteSubject(id) {
    if (!confirm('Are you sure you want to delete this subject and all its past papers?')) return
    try {
      await adminDeleteExploreSubject(id)
      showMsg('Subject deleted.')
      if (subEdit === id) {
        setSubEdit(null)
        setSubForm(emptySubject)
      }
      await loadData()
    } catch (err) {
      showMsg(JSON.stringify(err.response?.data || 'Delete failed'), true)
    }
  }

  function startEditSubject(sub) {
    setSubEdit(sub.id)
    setSubForm({
      grade: sub.grade,
      stream: sub.stream || '',
      name: sub.name,
      slug: sub.slug,
      icon: sub.icon || '📖',
      ordering: sub.ordering,
      is_active: sub.is_active,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /* ── Paper CRUD ─────────────────────────────────────────── */
  async function savePaper(e) {
    e.preventDefault()
    setError(''); setSuccess(''); setSaving(true)
    try {
      if (!pForm.subject) {
        showMsg('Please select a subject.', true)
        setSaving(false)
        return
      }

      const fd = new FormData()
      fd.append('subject', pForm.subject)
      fd.append('year', Number(pForm.year))
      fd.append('medium', pForm.medium)
      fd.append('part_number', Number(pForm.part_number))
      fd.append('part_label', pForm.part_label || `Part ${pForm.part_number}`)
      fd.append('is_active', pForm.is_active)
      if (pForm.pdf_file) {
        fd.append('pdf_file', pForm.pdf_file)
      }

      if (pEdit) {
        await adminUpdateExplorePaper(pEdit, fd)
        showMsg('Past paper updated successfully!')
      } else {
        if (!pForm.pdf_file) {
          showMsg('Please choose a PDF file to upload.', true)
          setSaving(false)
          return
        }
        await adminCreateExplorePaper(fd)
        showMsg('Past paper uploaded successfully!')
      }

      setPForm(emptyPaper)
      setPEdit(null)
      await loadData()
    } catch (err) {
      showMsg(JSON.stringify(err.response?.data || 'Paper save failed'), true)
    } finally {
      setSaving(false)
    }
  }

  async function deletePaper(id) {
    if (!confirm('Are you sure you want to delete this past paper?')) return
    try {
      await adminDeleteExplorePaper(id)
      showMsg('Past paper deleted.')
      if (pEdit === id) {
        setPEdit(null)
        setPForm(emptyPaper)
      }
      await loadData()
    } catch (err) {
      showMsg(JSON.stringify(err.response?.data || 'Delete failed'), true)
    }
  }

  function startEditPaper(p) {
    setPEdit(p.id)
    // Find subject's grade & stream
    const subObj = subjects.find(s => s.id === p.subject)
    setPForm({
      grade: subObj?.grade || 'ol',
      stream: subObj?.stream || '',
      subject: p.subject,
      year: p.year,
      medium: p.medium,
      part_number: p.part_number || 1,
      part_label: p.part_label || '',
      pdf_file: null,
      is_active: p.is_active,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /* ── Filtered data helpers ──────────────────────────────── */
  const subjectMap = Object.fromEntries(subjects.map(s => [s.id, s]))

  const pFormSubjects = subjects.filter(s => {
    if (pForm.grade === 'al') {
      return s.grade === 'al' && (!pForm.stream || s.stream === pForm.stream)
    }
    return s.grade === pForm.grade
  })

  const filteredPapers = papers.filter(p => {
    const sub = subjectMap[p.subject]
    if (filterGrade && sub?.grade !== filterGrade) return false
    if (filterStream && sub?.stream !== filterStream) return false
    if (filterSubject && String(p.subject) !== filterSubject) return false
    if (filterMedium && p.medium !== filterMedium) return false
    if (filterYear && String(p.year) !== filterYear) return false
    return true
  })

  const filteredSubjects = subjects.filter(s => {
    if (filterGrade && s.grade !== filterGrade) return false
    if (filterStream && s.stream !== filterStream) return false
    return true
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
              <p style={s.eyebrow}>Admin · Explore Past Papers</p>
              <h1 style={s.h1}>Explore Past Papers Management</h1>
              <p style={s.subText}>
                Grades and Streams are standard. Add subjects and upload past examination papers by choosing Grade, Stream, and Subject.
              </p>
            </div>
            <BackBtn onClick={() => navigate('/admin/dashboard')} />
          </div>

          {error && <ErrorBanner msg={error} onClose={() => setError('')} />}
          {success && <SuccessBanner msg={success} onClose={() => setSuccess('')} />}

          {/* Tabs */}
          <div style={s.tabRow}>
            <button
              style={tab === 'Papers' ? s.tabActive : s.tab}
              onClick={() => setTab('Papers')}
            >
              📄 Upload & Manage Past Papers ({papers.length})
            </button>
            <button
              style={tab === 'Subjects' ? s.tabActive : s.tab}
              onClick={() => setTab('Subjects')}
            >
              📚 Manage Subjects ({subjects.length})
            </button>
          </div>

          {/* ══════════════════════════════════════════════════════════
              TAB 1: PAST PAPERS
             ══════════════════════════════════════════════════════════ */}
          {tab === 'Papers' && (
            <>
              {/* Paper Upload Form */}
              <form onSubmit={savePaper} style={s.formCard}>
                <SectionTitle icon="📄" title={pEdit ? 'Edit Past Paper' : 'Upload New Past Paper'} />

                <div style={s.grid4}>
                  {/* Step 1: Grade */}
                  <FormField label="1. Select Grade">
                    <select
                      style={s.input}
                      value={pForm.grade}
                      onChange={e => {
                        const grade = e.target.value
                        const defaultStream = grade === 'al' ? 'science' : ''
                        setPForm(f => ({ ...f, grade, stream: defaultStream, subject: '' }))
                      }}
                      required
                    >
                      {FIXED_GRADES.map(g => (
                        <option key={g.id} value={g.id}>{g.fullName}</option>
                      ))}
                    </select>
                  </FormField>

                  {/* Step 2: Stream (if A/L) */}
                  {pForm.grade === 'al' ? (
                    <FormField label="2. Select Stream">
                      <select
                        style={s.input}
                        value={pForm.stream}
                        onChange={e => setPForm(f => ({ ...f, stream: e.target.value, subject: '' }))}
                        required
                      >
                        <option value="">Choose Stream…</option>
                        {FIXED_STREAMS.map(st => (
                          <option key={st.id} value={st.id}>{st.icon} {st.name} Stream</option>
                        ))}
                      </select>
                    </FormField>
                  ) : (
                    <FormField label="Stream">
                      <input style={{ ...s.input, opacity: 0.6 }} value="N/A for O/L & Grade 5" disabled />
                    </FormField>
                  )}

                  {/* Step 3: Subject */}
                  <FormField label="3. Select Subject">
                    <select
                      style={s.input}
                      value={pForm.subject}
                      onChange={e => setPForm(f => ({ ...f, subject: e.target.value }))}
                      required
                    >
                      <option value="">-- Choose Subject ({pFormSubjects.length} available) --</option>
                      {pFormSubjects.map(sub => (
                        <option key={sub.id} value={sub.id}>{sub.icon} {sub.name}</option>
                      ))}
                    </select>
                  </FormField>

                  {/* Step 4: Year */}
                  <FormField label="4. Exam Year">
                    <select
                      style={s.input}
                      value={pForm.year}
                      onChange={e => setPForm(f => ({ ...f, year: Number(e.target.value) }))}
                      required
                    >
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </FormField>
                </div>

                <div style={s.grid3}>
                  {/* Medium */}
                  <FormField label="Medium">
                    <select
                      style={s.input}
                      value={pForm.medium}
                      onChange={e => setPForm(f => ({ ...f, medium: e.target.value }))}
                    >
                      {MEDIUMS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </FormField>

                  {/* Part */}
                  <FormField label="Paper Part">
                    <select
                      style={s.input}
                      value={pForm.part_number}
                      onChange={e => {
                        const num = Number(e.target.value)
                        setPForm(f => ({ ...f, part_number: num, part_label: `Part ${num}` }))
                      }}
                    >
                      {PARTS.map(p => <option key={p.num} value={p.num}>{p.label}</option>)}
                    </select>
                  </FormField>

                  {/* PDF file */}
                  <FormField label="PDF File Upload">
                    <div style={s.fileWrap}>
                      <input
                        type="file"
                        accept=".pdf"
                        style={s.fileInput}
                        onChange={e => setPForm(f => ({ ...f, pdf_file: e.target.files[0] || null }))}
                      />
                      {pEdit && !pForm.pdf_file && (
                        <span style={s.fileHint}>Leave blank to keep existing PDF</span>
                      )}
                    </div>
                  </FormField>
                </div>

                <div style={s.checkRow}>
                  <input
                    type="checkbox"
                    id="p_active"
                    checked={pForm.is_active}
                    onChange={e => setPForm(f => ({ ...f, is_active: e.target.checked }))}
                    style={s.checkbox}
                  />
                  <label htmlFor="p_active" style={s.checkLabel}>Active (visible to students)</label>
                </div>

                <FormBtns
                  saving={saving}
                  editing={pEdit}
                  label="Past Paper"
                  onCancel={() => { setPEdit(null); setPForm(emptyPaper) }}
                />
              </form>

              {/* Filters for Papers */}
              <div style={s.filterCard}>
                <span style={s.filterLabel}>🔍 Filter Papers:</span>
                <select
                  style={s.filterInput}
                  value={filterGrade}
                  onChange={e => { setFilterGrade(e.target.value); setFilterStream(''); setFilterSubject('') }}
                >
                  <option value="">All Grades</option>
                  {FIXED_GRADES.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>

                {filterGrade === 'al' && (
                  <select
                    style={s.filterInput}
                    value={filterStream}
                    onChange={e => { setFilterStream(e.target.value); setFilterSubject('') }}
                  >
                    <option value="">All Streams</option>
                    {FIXED_STREAMS.map(st => <option key={st.id} value={st.id}>{st.name}</option>)}
                  </select>
                )}

                <select
                  style={s.filterInput}
                  value={filterMedium}
                  onChange={e => setFilterMedium(e.target.value)}
                >
                  <option value="">All Mediums</option>
                  {MEDIUMS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>

                <select
                  style={s.filterInput}
                  value={filterYear}
                  onChange={e => setFilterYear(e.target.value)}
                >
                  <option value="">All Years</option>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>

                {(filterGrade || filterStream || filterSubject || filterMedium || filterYear) && (
                  <button
                    style={s.clearBtn}
                    onClick={() => { setFilterGrade(''); setFilterStream(''); setFilterSubject(''); setFilterMedium(''); setFilterYear('') }}
                  >
                    ✕ Reset Filters
                  </button>
                )}
              </div>

              {/* Papers List */}
              <section style={s.listCard}>
                <SectionTitle icon="📋" title={`Uploaded Past Papers (${filteredPapers.length})`} />
                {filteredPapers.length === 0 ? (
                  <Empty text="No past papers match the selected criteria. Upload your first past paper using the form above." />
                ) : (
                  <div style={s.simpleList}>
                    {filteredPapers.map(p => {
                      const sub = subjectMap[p.subject]
                      return (
                        <div key={p.id} style={s.listRow}>
                          <div style={{ ...s.listIcon, background: '#EFF6FF', borderColor: '#BFDBFE' }}>
                            📄
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={s.rowTitle}>
                              {p.subjectName || sub?.name || 'Subject'}
                              <span style={s.slugBadge}>{sub?.grade?.toUpperCase() || 'OL'}</span>
                              {sub?.stream && (
                                <span style={{ ...s.slugBadge, background: '#EDE9FE', color: '#6D28D9', borderColor: '#C4B5FD' }}>
                                  {sub.stream}
                                </span>
                              )}
                            </div>
                            <div style={s.rowMeta}>
                              <span style={s.pillYear}>📅 {p.year}</span>
                              <span style={s.pillMedium}>{p.medium}</span>
                              <span style={s.pillPart}>📄 Part {p.part_number}</span>
                              <StatusPill active={p.is_active} />
                              {p.pdf_file && (
                                <a href={p.pdf_file} target="_blank" rel="noopener noreferrer" style={s.pdfLink}>
                                  View PDF ↗
                                </a>
                              )}
                            </div>
                          </div>
                          <RowActions
                            onEdit={() => startEditPaper(p)}
                            onDelete={() => deletePaper(p.id)}
                            extraBtn={
                              <button
                                style={s.mcqBtn}
                                onClick={() => navigate(`/admin/explore-papers/${p.id}/mcq`)}
                                onMouseEnter={e => { e.currentTarget.style.background = '#EFF6FF'; e.currentTarget.style.color = '#1D4ED8' }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#3B82F6' }}
                              >
                                ✍️ MCQ ({p.mcqQuestionCount ?? 0})
                              </button>
                            }
                          />
                        </div>
                      )
                    })}
                  </div>
                )}
              </section>
            </>
          )}

          {/* ══════════════════════════════════════════════════════════
              TAB 2: SUBJECTS
             ══════════════════════════════════════════════════════════ */}
          {tab === 'Subjects' && (
            <>
              {/* Subject Form */}
              <form onSubmit={saveSubject} style={s.formCard}>
                <SectionTitle icon="📚" title={subEdit ? 'Edit Subject' : 'Add New Subject'} />

                <div style={s.grid4}>
                  {/* Grade */}
                  <FormField label="1. Grade">
                    <select
                      style={s.input}
                      value={subForm.grade}
                      onChange={e => {
                        const grade = e.target.value
                        setSubForm(f => ({ ...f, grade, stream: grade === 'al' ? 'science' : '' }))
                      }}
                      required
                    >
                      {FIXED_GRADES.map(g => (
                        <option key={g.id} value={g.id}>{g.fullName}</option>
                      ))}
                    </select>
                  </FormField>

                  {/* Stream (only for A/L) */}
                  {subForm.grade === 'al' ? (
                    <FormField label="2. A/L Stream">
                      <select
                        style={s.input}
                        value={subForm.stream}
                        onChange={e => setSubForm(f => ({ ...f, stream: e.target.value }))}
                        required
                      >
                        {FIXED_STREAMS.map(st => (
                          <option key={st.id} value={st.id}>{st.icon} {st.name} Stream</option>
                        ))}
                      </select>
                    </FormField>
                  ) : (
                    <FormField label="Stream">
                      <input style={{ ...s.input, opacity: 0.6 }} value="N/A (O/L & Grade 5)" disabled />
                    </FormField>
                  )}

                  {/* Subject Name */}
                  <FormField label="3. Subject Name">
                    <input
                      style={s.input}
                      value={subForm.name}
                      onChange={e => handleSubjectNameChange(e.target.value)}
                      placeholder="e.g. Combined Mathematics"
                      required
                    />
                  </FormField>

                  {/* Icon Emoji */}
                  <FormField label="4. Emoji Icon">
                    <input
                      style={s.input}
                      value={subForm.icon}
                      onChange={e => setSubForm(f => ({ ...f, icon: e.target.value }))}
                      placeholder="📐, 🔬, 📖, 💼..."
                    />
                  </FormField>
                </div>

                <div style={s.grid2}>
                  <FormField label="Slug (URL identifier)">
                    <input
                      style={s.input}
                      value={subForm.slug}
                      onChange={e => setSubForm(f => ({ ...f, slug: e.target.value }))}
                      placeholder="combined-maths"
                      required
                    />
                  </FormField>

                  <FormField label="Display Order">
                    <input
                      type="number"
                      style={s.input}
                      value={subForm.ordering}
                      onChange={e => setSubForm(f => ({ ...f, ordering: e.target.value }))}
                      min={0}
                    />
                  </FormField>
                </div>

                <div style={s.checkRow}>
                  <input
                    type="checkbox"
                    id="sub_active"
                    checked={subForm.is_active}
                    onChange={e => setSubForm(f => ({ ...f, is_active: e.target.checked }))}
                    style={s.checkbox}
                  />
                  <label htmlFor="sub_active" style={s.checkLabel}>Active (visible in explore pages)</label>
                </div>

                <FormBtns
                  saving={saving}
                  editing={subEdit}
                  label="Subject"
                  onCancel={() => { setSubEdit(null); setSubForm(emptySubject) }}
                />
              </form>

              {/* Filter Subjects */}
              <div style={s.filterCard}>
                <span style={s.filterLabel}>🔍 Filter Subjects:</span>
                <select
                  style={s.filterInput}
                  value={filterGrade}
                  onChange={e => { setFilterGrade(e.target.value); setFilterStream('') }}
                >
                  <option value="">All Grades</option>
                  {FIXED_GRADES.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>

                {filterGrade === 'al' && (
                  <select
                    style={s.filterInput}
                    value={filterStream}
                    onChange={e => setFilterStream(e.target.value)}
                  >
                    <option value="">All Streams</option>
                    {FIXED_STREAMS.map(st => <option key={st.id} value={st.id}>{st.name}</option>)}
                  </select>
                )}

                {(filterGrade || filterStream) && (
                  <button
                    style={s.clearBtn}
                    onClick={() => { setFilterGrade(''); setFilterStream('') }}
                  >
                    ✕ Reset
                  </button>
                )}
              </div>

              {/* Subject List */}
              <section style={s.listCard}>
                <SectionTitle icon="📋" title={`Available Subjects (${filteredSubjects.length})`} />
                {filteredSubjects.length === 0 ? (
                  <Empty text="No subjects found for this selection." />
                ) : (
                  <div style={s.simpleList}>
                    {filteredSubjects.map(sub => (
                      <div key={sub.id} style={s.listRow}>
                        <div style={s.listIcon}>{sub.icon || '📖'}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={s.rowTitle}>
                            {sub.name}
                            <span style={s.slugBadge}>{sub.grade?.toUpperCase()}</span>
                            {sub.stream && (
                              <span style={{ ...s.slugBadge, background: '#EDE9FE', color: '#6D28D9', borderColor: '#C4B5FD' }}>
                                {sub.stream}
                              </span>
                            )}
                          </div>
                          <div style={s.rowMeta}>
                            <span>Slug: <code>{sub.slug}</code></span>
                            <Dot />
                            <StatusPill active={sub.is_active} />
                            <Dot />
                            <span>Order: {sub.ordering}</span>
                          </div>
                        </div>
                        <RowActions
                          onEdit={() => startEditSubject(sub)}
                          onDelete={() => deleteSubject(sub.id)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
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
      * { box-sizing: border-box; margin: 0; padding: 0; }
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
    <div style={{ marginBottom: 12 }}>
      <label style={s.fieldLabel}>{label}</label>
      {children}
    </div>
  )
}

function FormBtns({ saving, editing, label = '', onCancel }) {
  return (
    <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
      <button type="submit" style={s.btnPrimary} disabled={saving}
        onMouseEnter={e => { if (!saving) e.currentTarget.style.opacity = '0.88' }}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        {saving ? 'Saving…' : editing ? `✓ Update ${label}` : `+ Create ${label}`}
      </button>
      {editing && (
        <button type="button" style={s.cancelBtn} onClick={onCancel}
          onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'}
          onMouseLeave={e => e.currentTarget.style.background = 'white'}
        >
          Cancel
        </button>
      )}
    </div>
  )
}

function RowActions({ onEdit, onDelete, extraBtn }) {
  return (
    <div style={s.actionGroup}>
      {extraBtn}
      <button style={s.editBtn} onClick={onEdit}
        onMouseEnter={e => { e.currentTarget.style.background = '#EFF6FF'; e.currentTarget.style.color = '#1D4ED8' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#3B82F6' }}
      >
        Edit
      </button>
      <button style={s.deleteBtn} onClick={onDelete}
        onMouseEnter={e => { e.currentTarget.style.background = '#FEE2E2'; e.currentTarget.style.color = '#991B1B' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#EF4444' }}
      >
        Delete
      </button>
    </div>
  )
}

function StatusPill({ active }) {
  return (
    <span style={{
      borderRadius: 50, padding: '2px 9px', fontSize: '0.7rem', fontWeight: 700,
      background: active ? '#DCFCE7' : '#F1F5F9',
      color: active ? '#166534' : '#64748B',
      border: `1px solid ${active ? '#BBF7D0' : '#E2E8F0'}`,
    }}>
      {active ? 'Active' : 'Hidden'}
    </span>
  )
}

function ErrorBanner({ msg, onClose }) {
  return (
    <div style={s.errorBanner}>
      <span>⚠️ {msg}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#991B1B', fontWeight: 700, fontSize: '1rem' }}>✕</button>
    </div>
  )
}

function SuccessBanner({ msg, onClose }) {
  return (
    <div style={s.successBanner}>
      <span>✅ {msg}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#166534', fontWeight: 700, fontSize: '1rem' }}>✕</button>
    </div>
  )
}

function Empty({ text }) {
  return <p style={{ fontSize: '0.875rem', color: '#7A9A7A', padding: '16px 0', textAlign: 'center' }}>{text}</p>
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

/* ── Styles ─────────────────────────────────────────────── */
const BASE    = "'Plus Jakarta Sans', sans-serif"
const DISPLAY = "'Nunito', sans-serif"

const s = {
  page:         { minHeight: '100vh', background: '#F8FBF8', color: '#1A3A1A', fontFamily: BASE },
  header:       { position: 'sticky', top: 0, zIndex: 50, background: 'rgba(248,251,248,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1.5px solid #E8F5E9' },
  headerInner:  { maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center' },
  brandRow:     { display: 'flex', alignItems: 'center', gap: 10 },
  brandDot:     { width: 10, height: 10, borderRadius: '50%', background: 'linear-gradient(135deg,#4CAF50,#2E7D32)', boxShadow: '0 0 8px rgba(76,175,80,0.5)' },
  brandName:    { fontFamily: DISPLAY, fontWeight: 900, fontSize: '1.35rem', color: '#2E7D32' },
  adminBadge:   { fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: '#E8F5E9', color: '#2E7D32', padding: '3px 8px', borderRadius: 50, border: '1px solid #C8E6C9' },
  container:    { maxWidth: 1280, margin: '0 auto', padding: '36px 24px 60px' },
  titleRow:     { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 },
  eyebrow:      { fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#3B82F6', marginBottom: 4 },
  h1:           { fontFamily: DISPLAY, fontWeight: 900, fontSize: 'clamp(1.6rem,3vw,2.2rem)', color: '#1A3A1A', letterSpacing: '-0.01em', marginBottom: 6 },
  subText:      { fontSize: '0.88rem', color: '#6A8A6A', maxWidth: 640 },
  backBtn:      { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'white', border: '1.5px solid #D4E8D4', borderRadius: 50, padding: '8px 18px', fontSize: '0.82rem', fontWeight: 600, color: '#4A6A4A', cursor: 'pointer', fontFamily: BASE, transition: 'all 0.18s', whiteSpace: 'nowrap' },

  tabRow:       { display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 },
  tab:          { padding: '11px 24px', borderRadius: 50, border: '1.5px solid #E8F5E9', background: 'white', color: '#4A6A4A', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', fontFamily: BASE, transition: 'all 0.18s' },
  tabActive:    { padding: '11px 24px', borderRadius: 50, border: '1.5px solid #2E7D32', background: '#2E7D32', color: 'white', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', fontFamily: BASE },

  formCard:     { background: 'white', borderRadius: 24, border: '1.5px solid #E8F5E9', padding: '28px', marginBottom: 20, boxShadow: '0 2px 12px rgba(76,175,80,0.05)' },
  listCard:     { background: 'white', borderRadius: 24, border: '1.5px solid #E8F5E9', padding: '28px', boxShadow: '0 2px 12px rgba(76,175,80,0.05)' },
  filterCard:   { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap', background: 'white', padding: '14px 20px', borderRadius: 16, border: '1.5px solid #E8F5E9' },
  sectionTitle: { fontFamily: DISPLAY, fontWeight: 800, fontSize: '1.05rem', color: '#1A3A1A' },

  grid4:        { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0 20px' },
  grid3:        { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0 20px' },
  grid2:        { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0 20px' },
  fieldLabel:   { display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#7A9A7A', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' },
  input:        { width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #E8F5E9', background: '#FAFCFA', fontFamily: BASE, fontSize: '0.875rem', color: '#1A3A1A', outline: 'none', marginBottom: 0, transition: 'border-color 0.2s' },

  fileWrap:     { display: 'flex', flexDirection: 'column', gap: 4 },
  fileInput:    { fontSize: '0.85rem', color: '#1A3A1A', fontFamily: BASE },
  fileHint:     { fontSize: '0.75rem', color: '#7A9A7A' },

  checkRow:     { display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, marginBottom: 4 },
  checkbox:     { accentColor: '#2E7D32', width: 16, height: 16, cursor: 'pointer' },
  checkLabel:   { fontSize: '0.85rem', color: '#4A6A4A', fontWeight: 600, cursor: 'pointer' },

  filterLabel:  { fontSize: '0.82rem', fontWeight: 700, color: '#4A6A4A' },
  filterInput:  { padding: '8px 12px', borderRadius: 10, border: '1.5px solid #E8F5E9', background: '#FAFCFA', fontFamily: BASE, fontSize: '0.82rem', color: '#1A3A1A', outline: 'none' },
  clearBtn:     { padding: '8px 14px', borderRadius: 10, border: '1.5px solid #FECACA', background: '#FEF2F2', color: '#B91C1C', fontFamily: BASE, fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' },

  simpleList:   { display: 'flex', flexDirection: 'column', gap: 10 },
  listRow:      { display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', background: '#FAFCFA', border: '1.5px solid #E8F5E9', borderRadius: 16, padding: '14px 18px', transition: 'border-color 0.18s' },
  listIcon:     { width: 42, height: 42, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0, background: '#F0FDF4', border: '1.5px solid #BBF7D0' },
  rowTitle:     { fontWeight: 700, fontSize: '0.9rem', color: '#1A3A1A', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  rowMeta:      { fontSize: '0.775rem', color: '#7A9A7A', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6 },
  slugBadge:    { fontSize: '0.7rem', fontWeight: 700, background: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0', padding: '2px 9px', borderRadius: 50 },
  pillYear:     { fontSize: '0.72rem', fontWeight: 700, background: '#1A3A1A', color: 'white', padding: '2px 9px', borderRadius: 50 },
  pillMedium:   { fontSize: '0.72rem', fontWeight: 700, background: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0', padding: '2px 9px', borderRadius: 50 },
  pillPart:     { fontSize: '0.72rem', fontWeight: 700, background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A', padding: '2px 9px', borderRadius: 50 },
  pdfLink:      { fontSize: '0.78rem', fontWeight: 700, color: '#3B82F6', textDecoration: 'none' },

  actionGroup:  { display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 },
  editBtn:      { fontSize: '0.78rem', fontWeight: 700, color: '#3B82F6', background: 'transparent', border: '1.5px solid #3B82F6', borderRadius: 50, padding: '7px 14px', cursor: 'pointer', fontFamily: BASE, transition: 'all 0.2s', whiteSpace: 'nowrap' },
  deleteBtn:    { fontSize: '0.78rem', fontWeight: 700, color: '#EF4444', background: 'transparent', border: '1.5px solid #EF4444', borderRadius: 50, padding: '7px 14px', cursor: 'pointer', fontFamily: BASE, transition: 'all 0.2s', whiteSpace: 'nowrap' },
  mcqBtn:       { fontSize: '0.78rem', fontWeight: 700, color: '#3B82F6', background: 'transparent', border: '1.5px solid #3B82F6', borderRadius: 50, padding: '7px 14px', cursor: 'pointer', fontFamily: BASE, transition: 'all 0.2s', whiteSpace: 'nowrap' },
  btnPrimary:   { display: 'inline-flex', alignItems: 'center', background: 'linear-gradient(135deg,#3B82F6,#1D4ED8)', color: 'white', fontWeight: 700, fontSize: '0.82rem', padding: '10px 22px', borderRadius: 50, border: 'none', cursor: 'pointer', fontFamily: BASE, boxShadow: '0 3px 12px rgba(59,130,246,0.3)', transition: 'opacity 0.18s', whiteSpace: 'nowrap' },
  cancelBtn:    { display: 'inline-flex', alignItems: 'center', background: 'white', color: '#64748B', fontWeight: 600, fontSize: '0.82rem', padding: '10px 18px', borderRadius: 50, border: '1.5px solid #E2E8F0', cursor: 'pointer', fontFamily: BASE, transition: 'background 0.18s', whiteSpace: 'nowrap' },
  errorBanner:  { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, background: '#FEE2E2', border: '1.5px solid #FECACA', color: '#991B1B', borderRadius: 16, padding: '12px 18px', fontSize: '0.85rem', marginBottom: 20 },
  successBanner:{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, background: '#DCFCE7', border: '1.5px solid #BBF7D0', color: '#166534', borderRadius: 16, padding: '12px 18px', fontSize: '0.85rem', marginBottom: 20 },
  footer:       { borderTop: '1.5px solid #E8F5E9', padding: '20px 24px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, background: 'white' },
  footerBrand:  { fontFamily: DISPLAY, fontWeight: 900, fontSize: '1.1rem', color: '#2E7D32' },
  footerText:   { fontSize: '0.78rem', color: '#AACAAA' },
}
