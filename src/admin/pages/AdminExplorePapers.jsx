import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  adminGetExploreSubjects,
  adminCreateExploreSubject,
  adminUpdateExploreSubject,
  adminDeleteExploreSubject,
  adminGetExplorePapers,
  adminCreateExplorePaper,
  adminUpdateExplorePaper,
  adminDeleteExplorePaper,
  adminGetExploreModelPapers,
  adminCreateModelPaper,
  adminUpdateModelPaper,
  adminDeleteModelPaper,
  adminGetExploreSchoolPapers,
  adminCreateSchoolPaper,
  adminUpdateSchoolPaper,
  adminDeleteSchoolPaper,
  adminGetExploreNotes,
  adminCreateNote,
  adminUpdateNote,
  adminDeleteNote,
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
const DIFFICULTIES = ['Easy', 'Medium', 'Hard']
const TERMS = ['Term 1', 'Term 2', 'Term 3', 'Mid Year', 'Final Term']
const NOTE_TYPES = ['Full Notes', 'Summary', 'Short Notes', 'Revision', 'Cheat Sheet']

const emptySubject     = { grade: 'ol', stream: '', name: '', slug: '', icon: '📖', ordering: 0, is_active: true }
const emptyPaper       = { grade: 'ol', stream: '', subject: '', year: 2025, medium: 'Sinhala', part_number: 1, part_label: '', pdf_file: null, is_active: true }
const emptyModelPaper  = { grade: 'ol', stream: '', subject: '', title: '', year: 2025, medium: 'Sinhala', difficulty: 'Medium', pdf_file: null, is_active: true, ordering: 0 }
const emptySchoolPaper = { grade: 'ol', stream: '', subject: '', school_name: '', term: 'Term 1', year: 2024, medium: 'Sinhala', pdf_file: null, is_active: true, ordering: 0 }
const emptyNote        = { grade: 'ol', stream: '', subject: '', title: '', note_type: 'Full Notes', description: '', page_count: 1, pdf_file: null, is_active: true, ordering: 0 }

export default function AdminExplorePapers() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('Papers') // 'Subjects' | 'Papers' | 'ModelPapers' | 'SchoolPapers' | 'Notes'

  /* data from backend */
  const [subjects,     setSubjects]     = useState([])
  const [papers,       setPapers]       = useState([])
  const [modelPapers,  setModelPapers]  = useState([])
  const [schoolPapers, setSchoolPapers] = useState([])
  const [notes,        setNotes]        = useState([])
  const [loading,      setLoading]      = useState(true)

  /* forms */
  const [subForm, setSubForm] = useState(emptySubject)
  const [pForm,   setPForm]   = useState(emptyPaper)
  const [mpForm,  setMpForm]  = useState(emptyModelPaper)
  const [spForm,  setSpForm]  = useState(emptySchoolPaper)
  const [nForm,   setNForm]   = useState(emptyNote)

  /* editing IDs */
  const [subEdit, setSubEdit] = useState(null)
  const [pEdit,   setPEdit]   = useState(null)
  const [mpEdit,  setMpEdit]  = useState(null)
  const [spEdit,  setSpEdit]  = useState(null)
  const [nEdit,   setNEdit]   = useState(null)

  /* ui feedback */
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState('')
  const [saving,  setSaving]  = useState(false)

  /* filters */
  const [filterGrade,   setFilterGrade]   = useState('')
  const [filterStream,  setFilterStream]  = useState('')
  const [filterSubject, setFilterSubject] = useState('')
  const [filterMedium,  setFilterMedium]  = useState('')
  const [filterYear,    setFilterYear]    = useState('')
  const [filterSearch,  setFilterSearch]  = useState('')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const [subRes, pRes, mpRes, spRes, nRes] = await Promise.all([
        adminGetExploreSubjects(),
        adminGetExplorePapers(),
        adminGetExploreModelPapers(),
        adminGetExploreSchoolPapers(),
        adminGetExploreNotes(),
      ])
      setSubjects(subRes.data)
      setPapers(pRes.data)
      setModelPapers(mpRes.data)
      setSchoolPapers(spRes.data)
      setNotes(nRes.data)
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
    if (!confirm('Are you sure you want to delete this subject and all its related resources?')) return
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

  /* ── Past Paper CRUD ────────────────────────────────────── */
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

  /* ── Model Paper CRUD ───────────────────────────────────── */
  async function saveModelPaper(e) {
    e.preventDefault()
    setError(''); setSuccess(''); setSaving(true)
    try {
      if (!mpForm.subject) {
        showMsg('Please select a subject.', true)
        setSaving(false)
        return
      }

      const fd = new FormData()
      fd.append('subject', mpForm.subject)
      fd.append('title', mpForm.title.trim() || `${mpForm.year} Model Paper`)
      fd.append('year', Number(mpForm.year))
      fd.append('medium', mpForm.medium)
      fd.append('difficulty', mpForm.difficulty)
      fd.append('ordering', Number(mpForm.ordering) || 0)
      fd.append('is_active', mpForm.is_active)
      if (mpForm.pdf_file) {
        fd.append('pdf_file', mpForm.pdf_file)
      }

      if (mpEdit) {
        await adminUpdateModelPaper(mpEdit, fd)
        showMsg('Model paper updated successfully!')
      } else {
        if (!mpForm.pdf_file) {
          showMsg('Please choose a PDF file to upload.', true)
          setSaving(false)
          return
        }
        await adminCreateModelPaper(fd)
        showMsg('Model paper uploaded successfully!')
      }

      setMpForm(emptyModelPaper)
      setMpEdit(null)
      await loadData()
    } catch (err) {
      showMsg(JSON.stringify(err.response?.data || 'Model paper save failed'), true)
    } finally {
      setSaving(false)
    }
  }

  async function deleteModelPaper(id) {
    if (!confirm('Are you sure you want to delete this model paper?')) return
    try {
      await adminDeleteModelPaper(id)
      showMsg('Model paper deleted.')
      if (mpEdit === id) {
        setMpEdit(null)
        setMpForm(emptyModelPaper)
      }
      await loadData()
    } catch (err) {
      showMsg(JSON.stringify(err.response?.data || 'Delete failed'), true)
    }
  }

  function startEditModelPaper(p) {
    setMpEdit(p.id)
    const subObj = subjects.find(s => s.id === p.subject)
    setMpForm({
      grade: subObj?.grade || 'ol',
      stream: subObj?.stream || '',
      subject: p.subject,
      title: p.title || '',
      year: p.year || 2025,
      medium: p.medium || 'Sinhala',
      difficulty: p.difficulty || 'Medium',
      ordering: p.ordering || 0,
      pdf_file: null,
      is_active: p.is_active,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /* ── School Paper CRUD ──────────────────────────────────── */
  async function saveSchoolPaper(e) {
    e.preventDefault()
    setError(''); setSuccess(''); setSaving(true)
    try {
      if (!spForm.subject) {
        showMsg('Please select a subject.', true)
        setSaving(false)
        return
      }
      if (!spForm.school_name.trim()) {
        showMsg('Please enter school name.', true)
        setSaving(false)
        return
      }

      const fd = new FormData()
      fd.append('subject', spForm.subject)
      fd.append('school_name', spForm.school_name.trim())
      fd.append('term', spForm.term)
      fd.append('year', Number(spForm.year))
      fd.append('medium', spForm.medium)
      fd.append('ordering', Number(spForm.ordering) || 0)
      fd.append('is_active', spForm.is_active)
      if (spForm.pdf_file) {
        fd.append('pdf_file', spForm.pdf_file)
      }

      if (spEdit) {
        await adminUpdateSchoolPaper(spEdit, fd)
        showMsg('School paper updated successfully!')
      } else {
        if (!spForm.pdf_file) {
          showMsg('Please choose a PDF file to upload.', true)
          setSaving(false)
          return
        }
        await adminCreateSchoolPaper(fd)
        showMsg('School paper uploaded successfully!')
      }

      setSpForm(emptySchoolPaper)
      setSpEdit(null)
      await loadData()
    } catch (err) {
      showMsg(JSON.stringify(err.response?.data || 'School paper save failed'), true)
    } finally {
      setSaving(false)
    }
  }

  async function deleteSchoolPaper(id) {
    if (!confirm('Are you sure you want to delete this school paper?')) return
    try {
      await adminDeleteSchoolPaper(id)
      showMsg('School paper deleted.')
      if (spEdit === id) {
        setSpEdit(null)
        setSpForm(emptySchoolPaper)
      }
      await loadData()
    } catch (err) {
      showMsg(JSON.stringify(err.response?.data || 'Delete failed'), true)
    }
  }

  function startEditSchoolPaper(p) {
    setSpEdit(p.id)
    const subObj = subjects.find(s => s.id === p.subject)
    setSpForm({
      grade: subObj?.grade || 'ol',
      stream: subObj?.stream || '',
      subject: p.subject,
      school_name: p.school_name || '',
      term: p.term || 'Term 1',
      year: p.year || 2024,
      medium: p.medium || 'Sinhala',
      ordering: p.ordering || 0,
      pdf_file: null,
      is_active: p.is_active,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /* ── Notes CRUD ─────────────────────────────────────────── */
  async function saveNote(e) {
    e.preventDefault()
    setError(''); setSuccess(''); setSaving(true)
    try {
      if (!nForm.subject) {
        showMsg('Please select a subject.', true)
        setSaving(false)
        return
      }
      if (!nForm.title.trim()) {
        showMsg('Please enter note title.', true)
        setSaving(false)
        return
      }

      const fd = new FormData()
      fd.append('subject', nForm.subject)
      fd.append('title', nForm.title.trim())
      fd.append('note_type', nForm.note_type)
      fd.append('description', nForm.description.trim())
      fd.append('page_count', Number(nForm.page_count) || 1)
      fd.append('ordering', Number(nForm.ordering) || 0)
      fd.append('is_active', nForm.is_active)
      if (nForm.pdf_file) {
        fd.append('pdf_file', nForm.pdf_file)
      }

      if (nEdit) {
        await adminUpdateNote(nEdit, fd)
        showMsg('Study note updated successfully!')
      } else {
        if (!nForm.pdf_file) {
          showMsg('Please choose a PDF file to upload.', true)
          setSaving(false)
          return
        }
        await adminCreateNote(fd)
        showMsg('Study note uploaded successfully!')
      }

      setNForm(emptyNote)
      setNEdit(null)
      await loadData()
    } catch (err) {
      showMsg(JSON.stringify(err.response?.data || 'Note save failed'), true)
    } finally {
      setSaving(false)
    }
  }

  async function deleteNote(id) {
    if (!confirm('Are you sure you want to delete this study note?')) return
    try {
      await adminDeleteNote(id)
      showMsg('Note deleted.')
      if (nEdit === id) {
        setNEdit(null)
        setNForm(emptyNote)
      }
      await loadData()
    } catch (err) {
      showMsg(JSON.stringify(err.response?.data || 'Delete failed'), true)
    }
  }

  function startEditNote(n) {
    setNEdit(n.id)
    const subObj = subjects.find(s => s.id === n.subject)
    setNForm({
      grade: subObj?.grade || 'ol',
      stream: subObj?.stream || '',
      subject: n.subject,
      title: n.title || '',
      note_type: n.note_type || 'Full Notes',
      description: n.description || '',
      page_count: n.page_count || 1,
      ordering: n.ordering || 0,
      pdf_file: null,
      is_active: n.is_active,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /* ── Filtered data helpers ──────────────────────────────── */
  const subjectMap = Object.fromEntries(subjects.map(s => [s.id, s]))

  function filterItem(item) {
    const sub = subjectMap[item.subject]
    if (filterGrade && sub?.grade !== filterGrade) return false
    if (filterStream && sub?.stream !== filterStream) return false
    if (filterSubject && item.subject !== Number(filterSubject)) return false
    if (filterMedium && item.medium !== filterMedium) return false
    if (filterYear && item.year !== Number(filterYear)) return false
    if (filterSearch) {
      const q = filterSearch.toLowerCase()
      const matches = (item.title || '').toLowerCase().includes(q) ||
                      (item.school_name || '').toLowerCase().includes(q) ||
                      (sub?.name || '').toLowerCase().includes(q)
      if (!matches) return false
    }
    return true
  }

  const filteredSubjects = subjects.filter(s => {
    if (filterGrade && s.grade !== filterGrade) return false
    if (filterStream && s.stream !== filterStream) return false
    if (filterSearch && !s.name.toLowerCase().includes(filterSearch.toLowerCase())) return false
    return true
  })

  const filteredPapers       = papers.filter(filterItem)
  const filteredModelPapers  = modelPapers.filter(filterItem)
  const filteredSchoolPapers = schoolPapers.filter(filterItem)
  const filteredNotes        = notes.filter(filterItem)

  function getSubjectsForForm(formGrade, formStream) {
    return subjects.filter(s => {
      if (s.grade !== formGrade) return false
      if (formGrade === 'al' && formStream && s.stream !== formStream) return false
      return true
    })
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f4f6f8', paddingTop: 88, paddingBottom: 60, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .ad-h1 { font-family: 'Nunito', sans-serif; font-size: 1.8rem; font-weight: 900; color: #0f172a; }
        .ad-tab-btn {
          padding: 10px 20px; border-radius: 12px; font-weight: 700; font-size: 0.92rem;
          cursor: pointer; border: 1.5px solid transparent; transition: all 0.18s;
          display: flex; align-items: center; gap: 8px;
        }
        .ad-tab-btn.active {
          background: #1e293b; color: white; border-color: #1e293b;
        }
        .ad-tab-btn:not(.active) {
          background: white; color: #475569; border-color: #e2e8f0;
        }
        .ad-tab-btn:not(.active):hover {
          background: #f1f5f9;
        }
        .ad-card {
          background: white; border-radius: 20px; border: 1.5px solid #e2e8f0;
          box-shadow: 0 4px 20px rgba(0,0,0,0.04); padding: 24px; margin-bottom: 24px;
        }
        .ad-label { font-size: 0.82rem; font-weight: 700; color: #475569; margin-bottom: 6px; display: block; }
        .ad-input, .ad-select {
          width: 100%; padding: 10px 14px; border-radius: 10px; border: 1.5px solid #cbd5e1;
          font-size: 0.88rem; outline: none; background: white; font-family: inherit;
        }
        .ad-input:focus, .ad-select:focus { border-color: #2563eb; }
        .ad-btn-save {
          background: linear-gradient(135deg, #16a34a, #15803d); color: white;
          padding: 11px 24px; border-radius: 12px; font-weight: 700; border: none; cursor: pointer;
          font-size: 0.92rem; transition: opacity 0.16s;
        }
        .ad-btn-save:hover { opacity: 0.92; }
        .ad-table { width: 100%; border-collapse: collapse; text-align: left; }
        .ad-table th {
          background: #f8fafc; padding: 12px 16px; font-size: 0.82rem; font-weight: 800;
          color: #475569; border-bottom: 2px solid #e2e8f0; text-transform: uppercase;
        }
        .ad-table td {
          padding: 14px 16px; font-size: 0.88rem; border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
        }
        .ad-badge {
          display: inline-block; font-size: 0.76rem; font-weight: 700; padding: 3px 10px; border-radius: 50px;
        }
        .ad-btn-sm {
          padding: 6px 12px; border-radius: 8px; font-size: 0.8rem; font-weight: 700;
          cursor: pointer; border: none; transition: opacity 0.16s;
        }
      `}</style>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#16a34a', background: '#dcfce7', padding: '3px 10px', borderRadius: 50 }}>
                Explore Management
              </span>
              <span style={{ color: '#94a3b8' }}>•</span>
              <button
                onClick={() => navigate('/admin/dashboard')}
                style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
              >
                ← Back to Dashboard
              </button>
            </div>
            <h1 className="ad-h1">Explore Resources &amp; Content Management</h1>
            <p style={{ color: '#64748b', fontSize: '0.94rem', margin: 0 }}>
              Upload and manage real Past Papers, Model Papers, School Papers, and Notes organized by Grade, Stream &amp; Subject.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={loadData}
              style={{ background: 'white', border: '1.5px solid #cbd5e1', padding: '9px 18px', borderRadius: 12, fontWeight: 700, fontSize: '0.86rem', cursor: 'pointer' }}
            >
              🔄 Refresh Data
            </button>
          </div>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div style={{ background: '#fee2e2', border: '1.5px solid #f87171', color: '#991b1b', padding: '12px 18px', borderRadius: 12, marginBottom: 20, fontWeight: 600 }}>
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div style={{ background: '#dcfce7', border: '1.5px solid #86efac', color: '#166534', padding: '12px 18px', borderRadius: 12, marginBottom: 20, fontWeight: 600 }}>
            ✅ {success}
          </div>
        )}

        {/* Tab Selector */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
          <button className={`ad-tab-btn ${tab === 'Papers' ? 'active' : ''}`} onClick={() => setTab('Papers')}>
            📄 Past Papers ({papers.length})
          </button>
          <button className={`ad-tab-btn ${tab === 'ModelPapers' ? 'active' : ''}`} onClick={() => setTab('ModelPapers')}>
            📝 Model Papers ({modelPapers.length})
          </button>
          <button className={`ad-tab-btn ${tab === 'SchoolPapers' ? 'active' : ''}`} onClick={() => setTab('SchoolPapers')}>
            🏫 School Papers ({schoolPapers.length})
          </button>
          <button className={`ad-tab-btn ${tab === 'Notes' ? 'active' : ''}`} onClick={() => setTab('Notes')}>
            📒 Study Notes ({notes.length})
          </button>
          <button className={`ad-tab-btn ${tab === 'Subjects' ? 'active' : ''}`} onClick={() => setTab('Subjects')}>
            📖 Subjects ({subjects.length})
          </button>
        </div>

        {/* Global Filter Bar */}
        <div className="ad-card" style={{ padding: 18, marginBottom: 24 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#334155' }}>Filter List:</span>

            <select className="ad-select" style={{ width: 'auto' }} value={filterGrade} onChange={e => { setFilterGrade(e.target.value); setFilterStream(''); setFilterSubject(''); }}>
              <option value="">All Grades</option>
              {FIXED_GRADES.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>

            {(!filterGrade || filterGrade === 'al') && (
              <select className="ad-select" style={{ width: 'auto' }} value={filterStream} onChange={e => { setFilterStream(e.target.value); setFilterSubject(''); }}>
                <option value="">All A/L Streams</option>
                {FIXED_STREAMS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            )}

            {tab !== 'Subjects' && (
              <select className="ad-select" style={{ width: 'auto' }} value={filterSubject} onChange={e => setFilterSubject(e.target.value)}>
                <option value="">All Subjects</option>
                {filteredSubjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.grade.toUpperCase()})</option>)}
              </select>
            )}

            {tab !== 'Subjects' && tab !== 'Notes' && (
              <>
                <select className="ad-select" style={{ width: 'auto' }} value={filterMedium} onChange={e => setFilterMedium(e.target.value)}>
                  <option value="">All Mediums</option>
                  {MEDIUMS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>

                <select className="ad-select" style={{ width: 'auto' }} value={filterYear} onChange={e => setFilterYear(e.target.value)}>
                  <option value="">All Years</option>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </>
            )}

            <input
              type="text"
              placeholder="Search by title/name..."
              className="ad-input"
              style={{ width: 220, marginLeft: 'auto' }}
              value={filterSearch}
              onChange={e => setFilterSearch(e.target.value)}
            />

            {(filterGrade || filterStream || filterSubject || filterMedium || filterYear || filterSearch) && (
              <button
                onClick={() => { setFilterGrade(''); setFilterStream(''); setFilterSubject(''); setFilterMedium(''); setFilterYear(''); setFilterSearch(''); }}
                style={{ background: '#fee2e2', border: 'none', color: '#991b1b', padding: '8px 14px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* ── TAB 1: SUBJECTS ── */}
        {tab === 'Subjects' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, alignItems: 'start' }}>
            {/* Form */}
            <div className="ad-card">
              <h3 style={{ margin: '0 0 16px', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                {subEdit ? '✏️ Edit Subject' : '➕ Add New Subject'}
              </h3>
              <form onSubmit={saveSubject} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label className="ad-label">Grade</label>
                  <select
                    className="ad-select"
                    value={subForm.grade}
                    onChange={e => setSubForm(prev => ({ ...prev, grade: e.target.value, stream: e.target.value === 'al' ? (prev.stream || 'science') : '' }))}
                  >
                    {FIXED_GRADES.map(g => <option key={g.id} value={g.id}>{g.fullName}</option>)}
                  </select>
                </div>

                {subForm.grade === 'al' && (
                  <div>
                    <label className="ad-label">A/L Stream</label>
                    <select
                      className="ad-select"
                      value={subForm.stream || 'science'}
                      onChange={e => setSubForm(prev => ({ ...prev, stream: e.target.value }))}
                    >
                      {FIXED_STREAMS.map(s => <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
                    </select>
                  </div>
                )}

                <div>
                  <label className="ad-label">Subject Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Physics, Combined Maths"
                    className="ad-input"
                    value={subForm.name}
                    onChange={e => handleSubjectNameChange(e.target.value)}
                  />
                </div>

                <div>
                  <label className="ad-label">URL Slug</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. physics, combined-maths"
                    className="ad-input"
                    value={subForm.slug}
                    onChange={e => setSubForm(prev => ({ ...prev, slug: e.target.value }))}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="ad-label">Icon (Emoji)</label>
                    <input
                      type="text"
                      className="ad-input"
                      value={subForm.icon}
                      onChange={e => setSubForm(prev => ({ ...prev, icon: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="ad-label">Ordering</label>
                    <input
                      type="number"
                      className="ad-input"
                      value={subForm.ordering}
                      onChange={e => setSubForm(prev => ({ ...prev, ordering: e.target.value }))}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                  <button type="submit" disabled={saving} className="ad-btn-save" style={{ flex: 1 }}>
                    {saving ? 'Saving…' : subEdit ? 'Update Subject' : 'Create Subject'}
                  </button>
                  {subEdit && (
                    <button
                      type="button"
                      onClick={() => { setSubEdit(null); setSubForm(emptySubject); }}
                      style={{ background: '#e2e8f0', border: 'none', padding: '10px 18px', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List */}
            <div className="ad-card" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>Icon &amp; Name</th>
                    <th>Grade / Stream</th>
                    <th>Slug</th>
                    <th>Order</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubjects.length === 0 ? (
                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: 32, color: '#64748b' }}>No subjects found.</td></tr>
                  ) : (
                    filteredSubjects.map(sub => (
                      <tr key={sub.id}>
                        <td>
                          <span style={{ fontSize: '1.2rem', marginRight: 8 }}>{sub.icon || '📖'}</span>
                          <strong>{sub.name}</strong>
                        </td>
                        <td>
                          <span className="ad-badge" style={{ background: '#e0f2fe', color: '#0369a1', marginRight: 4 }}>
                            {sub.grade.toUpperCase()}
                          </span>
                          {sub.stream && (
                            <span className="ad-badge" style={{ background: '#f3e8ff', color: '#6b21a8' }}>
                              {sub.stream}
                            </span>
                          )}
                        </td>
                        <td><code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 6 }}>{sub.slug}</code></td>
                        <td>{sub.ordering}</td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button
                              onClick={() => startEditSubject(sub)}
                              className="ad-btn-sm"
                              style={{ background: '#f1f5f9', color: '#334155' }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteSubject(sub.id)}
                              className="ad-btn-sm"
                              style={{ background: '#fee2e2', color: '#991b1b' }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB 2: PAST PAPERS ── */}
        {tab === 'Papers' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, alignItems: 'start' }}>
            {/* Form */}
            <div className="ad-card">
              <h3 style={{ margin: '0 0 16px', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                {pEdit ? '✏️ Edit Past Paper' : '➕ Upload Past Paper'}
              </h3>
              <form onSubmit={savePaper} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="ad-label">Grade</label>
                    <select
                      className="ad-select"
                      value={pForm.grade}
                      onChange={e => setPForm(prev => ({ ...prev, grade: e.target.value, stream: e.target.value === 'al' ? (prev.stream || 'science') : '', subject: '' }))}
                    >
                      {FIXED_GRADES.map(g => <option key={g.id} value={g.id}>{g.fullName}</option>)}
                    </select>
                  </div>

                  {pForm.grade === 'al' && (
                    <div>
                      <label className="ad-label">Stream</label>
                      <select
                        className="ad-select"
                        value={pForm.stream || 'science'}
                        onChange={e => setPForm(prev => ({ ...prev, stream: e.target.value, subject: '' }))}
                      >
                        {FIXED_STREAMS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                  )}
                </div>

                <div>
                  <label className="ad-label">Subject</label>
                  <select
                    className="ad-select"
                    required
                    value={pForm.subject}
                    onChange={e => setPForm(prev => ({ ...prev, subject: e.target.value }))}
                  >
                    <option value="">-- Select Subject --</option>
                    {getSubjectsForForm(pForm.grade, pForm.stream).map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="ad-label">Year</label>
                    <select
                      className="ad-select"
                      value={pForm.year}
                      onChange={e => setPForm(prev => ({ ...prev, year: e.target.value }))}
                    >
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="ad-label">Medium</label>
                    <select
                      className="ad-select"
                      value={pForm.medium}
                      onChange={e => setPForm(prev => ({ ...prev, medium: e.target.value }))}
                    >
                      {MEDIUMS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="ad-label">Part Number</label>
                    <select
                      className="ad-select"
                      value={pForm.part_number}
                      onChange={e => setPForm(prev => ({ ...prev, part_number: e.target.value, part_label: `Part ${e.target.value}` }))}
                    >
                      {PARTS.map(p => <option key={p.num} value={p.num}>{p.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="ad-label">Part Label</label>
                    <input
                      type="text"
                      className="ad-input"
                      placeholder="e.g. Part 1, MCQ"
                      value={pForm.part_label}
                      onChange={e => setPForm(prev => ({ ...prev, part_label: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="ad-label">PDF File {pEdit ? '(Leave empty to keep existing)' : ''}</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="ad-input"
                    onChange={e => setPForm(prev => ({ ...prev, pdf_file: e.target.files[0] }))}
                  />
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                  <button type="submit" disabled={saving} className="ad-btn-save" style={{ flex: 1 }}>
                    {saving ? 'Uploading…' : pEdit ? 'Update Past Paper' : 'Upload Past Paper'}
                  </button>
                  {pEdit && (
                    <button
                      type="button"
                      onClick={() => { setPEdit(null); setPForm(emptyPaper); }}
                      style={{ background: '#e2e8f0', border: 'none', padding: '10px 18px', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List */}
            <div className="ad-card" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Year &amp; Part</th>
                    <th>Medium</th>
                    <th>PDF</th>
                    <th>MCQ Questions</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPapers.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32, color: '#64748b' }}>No past papers uploaded yet.</td></tr>
                  ) : (
                    filteredPapers.map(p => (
                      <tr key={p.id}>
                        <td>
                          <strong>{p.subjectName || subjectMap[p.subject]?.name || '—'}</strong>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            {subjectMap[p.subject]?.grade?.toUpperCase()} {subjectMap[p.subject]?.stream ? `· ${subjectMap[p.subject]?.stream}` : ''}
                          </div>
                        </td>
                        <td>
                          <span className="ad-badge" style={{ background: '#fef3c7', color: '#92400e', marginRight: 4 }}>
                            📅 {p.year}
                          </span>
                          <span className="ad-badge" style={{ background: '#e0f2fe', color: '#0369a1' }}>
                            {p.part_label || `Part ${p.part_number}`}
                          </span>
                        </td>
                        <td>{p.medium}</td>
                        <td>
                          {p.pdfUrl || p.pdf_file ? (
                            <a href={p.pdfUrl || p.pdf_file} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'underline' }}>
                              View PDF
                            </a>
                          ) : '—'}
                        </td>
                        <td>
                          <button
                            onClick={() => navigate(`/admin/explore-papers/${p.id}/mcq`)}
                            className="ad-btn-sm"
                            style={{ background: '#ede7f6', color: '#4527A0' }}
                          >
                            📝 MCQs ({p.mcqQuestionCount || 0})
                          </button>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => startEditPaper(p)} className="ad-btn-sm" style={{ background: '#f1f5f9', color: '#334155' }}>
                              Edit
                            </button>
                            <button onClick={() => deletePaper(p.id)} className="ad-btn-sm" style={{ background: '#fee2e2', color: '#991b1b' }}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB 3: MODEL PAPERS ── */}
        {tab === 'ModelPapers' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, alignItems: 'start' }}>
            {/* Form */}
            <div className="ad-card">
              <h3 style={{ margin: '0 0 16px', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                {mpEdit ? '✏️ Edit Model Paper' : '➕ Upload Model Paper'}
              </h3>
              <form onSubmit={saveModelPaper} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="ad-label">Grade</label>
                    <select
                      className="ad-select"
                      value={mpForm.grade}
                      onChange={e => setMpForm(prev => ({ ...prev, grade: e.target.value, stream: e.target.value === 'al' ? (prev.stream || 'science') : '', subject: '' }))}
                    >
                      {FIXED_GRADES.map(g => <option key={g.id} value={g.id}>{g.fullName}</option>)}
                    </select>
                  </div>

                  {mpForm.grade === 'al' && (
                    <div>
                      <label className="ad-label">Stream</label>
                      <select
                        className="ad-select"
                        value={mpForm.stream || 'science'}
                        onChange={e => setMpForm(prev => ({ ...prev, stream: e.target.value, subject: '' }))}
                      >
                        {FIXED_STREAMS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                  )}
                </div>

                <div>
                  <label className="ad-label">Subject</label>
                  <select
                    className="ad-select"
                    required
                    value={mpForm.subject}
                    onChange={e => setMpForm(prev => ({ ...prev, subject: e.target.value }))}
                  >
                    <option value="">-- Select Subject --</option>
                    {getSubjectsForForm(mpForm.grade, mpForm.stream).map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="ad-label">Paper Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Physics Model Paper 01"
                    className="ad-input"
                    value={mpForm.title}
                    onChange={e => setMpForm(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                  <div>
                    <label className="ad-label">Difficulty</label>
                    <select
                      className="ad-select"
                      value={mpForm.difficulty}
                      onChange={e => setMpForm(prev => ({ ...prev, difficulty: e.target.value }))}
                    >
                      {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="ad-label">Year</label>
                    <select
                      className="ad-select"
                      value={mpForm.year}
                      onChange={e => setMpForm(prev => ({ ...prev, year: e.target.value }))}
                    >
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="ad-label">Medium</label>
                    <select
                      className="ad-select"
                      value={mpForm.medium}
                      onChange={e => setMpForm(prev => ({ ...prev, medium: e.target.value }))}
                    >
                      {MEDIUMS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="ad-label">PDF File {mpEdit ? '(Leave empty to keep existing)' : ''}</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="ad-input"
                    onChange={e => setMpForm(prev => ({ ...prev, pdf_file: e.target.files[0] }))}
                  />
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                  <button type="submit" disabled={saving} className="ad-btn-save" style={{ flex: 1 }}>
                    {saving ? 'Uploading…' : mpEdit ? 'Update Model Paper' : 'Upload Model Paper'}
                  </button>
                  {mpEdit && (
                    <button
                      type="button"
                      onClick={() => { setMpEdit(null); setMpForm(emptyModelPaper); }}
                      style={{ background: '#e2e8f0', border: 'none', padding: '10px 18px', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List */}
            <div className="ad-card" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>Title &amp; Subject</th>
                    <th>Difficulty</th>
                    <th>Year &amp; Medium</th>
                    <th>PDF</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredModelPapers.length === 0 ? (
                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: 32, color: '#64748b' }}>No model papers uploaded yet.</td></tr>
                  ) : (
                    filteredModelPapers.map(p => (
                      <tr key={p.id}>
                        <td>
                          <strong>{p.title}</strong>
                          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                            {p.subjectName || subjectMap[p.subject]?.name || '—'}
                          </div>
                        </td>
                        <td>
                          <span className="ad-badge" style={{
                            background: p.difficulty === 'Easy' ? '#dcfce7' : p.difficulty === 'Hard' ? '#fee2e2' : '#fef3c7',
                            color: p.difficulty === 'Easy' ? '#166534' : p.difficulty === 'Hard' ? '#991b1b' : '#92400e'
                          }}>
                            {p.difficulty}
                          </span>
                        </td>
                        <td>{p.year} · {p.medium}</td>
                        <td>
                          {p.pdfUrl || p.pdf_file ? (
                            <a href={p.pdfUrl || p.pdf_file} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'underline' }}>
                              View PDF
                            </a>
                          ) : '—'}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => startEditModelPaper(p)} className="ad-btn-sm" style={{ background: '#f1f5f9', color: '#334155' }}>
                              Edit
                            </button>
                            <button onClick={() => deleteModelPaper(p.id)} className="ad-btn-sm" style={{ background: '#fee2e2', color: '#991b1b' }}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB 4: SCHOOL PAPERS ── */}
        {tab === 'SchoolPapers' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, alignItems: 'start' }}>
            {/* Form */}
            <div className="ad-card">
              <h3 style={{ margin: '0 0 16px', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                {spEdit ? '✏️ Edit School Paper' : '➕ Upload School Paper'}
              </h3>
              <form onSubmit={saveSchoolPaper} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="ad-label">Grade</label>
                    <select
                      className="ad-select"
                      value={spForm.grade}
                      onChange={e => setSpForm(prev => ({ ...prev, grade: e.target.value, stream: e.target.value === 'al' ? (prev.stream || 'science') : '', subject: '' }))}
                    >
                      {FIXED_GRADES.map(g => <option key={g.id} value={g.id}>{g.fullName}</option>)}
                    </select>
                  </div>

                  {spForm.grade === 'al' && (
                    <div>
                      <label className="ad-label">Stream</label>
                      <select
                        className="ad-select"
                        value={spForm.stream || 'science'}
                        onChange={e => setSpForm(prev => ({ ...prev, stream: e.target.value, subject: '' }))}
                      >
                        {FIXED_STREAMS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                  )}
                </div>

                <div>
                  <label className="ad-label">Subject</label>
                  <select
                    className="ad-select"
                    required
                    value={spForm.subject}
                    onChange={e => setSpForm(prev => ({ ...prev, subject: e.target.value }))}
                  >
                    <option value="">-- Select Subject --</option>
                    {getSubjectsForForm(spForm.grade, spForm.stream).map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="ad-label">School Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal College, Colombo 07"
                    className="ad-input"
                    value={spForm.school_name}
                    onChange={e => setSpForm(prev => ({ ...prev, school_name: e.target.value }))}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                  <div>
                    <label className="ad-label">Term</label>
                    <select
                      className="ad-select"
                      value={spForm.term}
                      onChange={e => setSpForm(prev => ({ ...prev, term: e.target.value }))}
                    >
                      {TERMS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="ad-label">Year</label>
                    <select
                      className="ad-select"
                      value={spForm.year}
                      onChange={e => setSpForm(prev => ({ ...prev, year: e.target.value }))}
                    >
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="ad-label">Medium</label>
                    <select
                      className="ad-select"
                      value={spForm.medium}
                      onChange={e => setSpForm(prev => ({ ...prev, medium: e.target.value }))}
                    >
                      {MEDIUMS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="ad-label">PDF File {spEdit ? '(Leave empty to keep existing)' : ''}</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="ad-input"
                    onChange={e => setSpForm(prev => ({ ...prev, pdf_file: e.target.files[0] }))}
                  />
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                  <button type="submit" disabled={saving} className="ad-btn-save" style={{ flex: 1 }}>
                    {saving ? 'Uploading…' : spEdit ? 'Update School Paper' : 'Upload School Paper'}
                  </button>
                  {spEdit && (
                    <button
                      type="button"
                      onClick={() => { setSpEdit(null); setSpForm(emptySchoolPaper); }}
                      style={{ background: '#e2e8f0', border: 'none', padding: '10px 18px', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List */}
            <div className="ad-card" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>School &amp; Subject</th>
                    <th>Term &amp; Year</th>
                    <th>Medium</th>
                    <th>PDF</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchoolPapers.length === 0 ? (
                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: 32, color: '#64748b' }}>No school papers uploaded yet.</td></tr>
                  ) : (
                    filteredSchoolPapers.map(p => (
                      <tr key={p.id}>
                        <td>
                          <strong>{p.school_name}</strong>
                          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                            {p.subjectName || subjectMap[p.subject]?.name || '—'}
                          </div>
                        </td>
                        <td>
                          <span className="ad-badge" style={{ background: '#ede7f6', color: '#4527A0', marginRight: 4 }}>
                            {p.term}
                          </span>
                          <span className="ad-badge" style={{ background: '#fef3c7', color: '#92400e' }}>
                            {p.year}
                          </span>
                        </td>
                        <td>{p.medium}</td>
                        <td>
                          {p.pdfUrl || p.pdf_file ? (
                            <a href={p.pdfUrl || p.pdf_file} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'underline' }}>
                              View PDF
                            </a>
                          ) : '—'}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => startEditSchoolPaper(p)} className="ad-btn-sm" style={{ background: '#f1f5f9', color: '#334155' }}>
                              Edit
                            </button>
                            <button onClick={() => deleteSchoolPaper(p.id)} className="ad-btn-sm" style={{ background: '#fee2e2', color: '#991b1b' }}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB 5: NOTES ── */}
        {tab === 'Notes' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, alignItems: 'start' }}>
            {/* Form */}
            <div className="ad-card">
              <h3 style={{ margin: '0 0 16px', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                {nEdit ? '✏️ Edit Study Note' : '➕ Upload Study Note'}
              </h3>
              <form onSubmit={saveNote} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="ad-label">Grade</label>
                    <select
                      className="ad-select"
                      value={nForm.grade}
                      onChange={e => setNForm(prev => ({ ...prev, grade: e.target.value, stream: e.target.value === 'al' ? (prev.stream || 'science') : '', subject: '' }))}
                    >
                      {FIXED_GRADES.map(g => <option key={g.id} value={g.id}>{g.fullName}</option>)}
                    </select>
                  </div>

                  {nForm.grade === 'al' && (
                    <div>
                      <label className="ad-label">Stream</label>
                      <select
                        className="ad-select"
                        value={nForm.stream || 'science'}
                        onChange={e => setNForm(prev => ({ ...prev, stream: e.target.value, subject: '' }))}
                      >
                        {FIXED_STREAMS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                  )}
                </div>

                <div>
                  <label className="ad-label">Subject</label>
                  <select
                    className="ad-select"
                    required
                    value={nForm.subject}
                    onChange={e => setNForm(prev => ({ ...prev, subject: e.target.value }))}
                  >
                    <option value="">-- Select Subject --</option>
                    {getSubjectsForForm(nForm.grade, nForm.stream).map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="ad-label">Note Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mechanics Complete Summary"
                    className="ad-input"
                    value={nForm.title}
                    onChange={e => setNForm(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="ad-label">Note Type</label>
                    <select
                      className="ad-select"
                      value={nForm.note_type}
                      onChange={e => setNForm(prev => ({ ...prev, note_type: e.target.value }))}
                    >
                      {NOTE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="ad-label">Page Count</label>
                    <input
                      type="number"
                      min="1"
                      className="ad-input"
                      value={nForm.page_count}
                      onChange={e => setNForm(prev => ({ ...prev, page_count: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="ad-label">Description (Optional)</label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of covered topics..."
                    className="ad-input"
                    value={nForm.description}
                    onChange={e => setNForm(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="ad-label">PDF File {nEdit ? '(Leave empty to keep existing)' : ''}</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="ad-input"
                    onChange={e => setNForm(prev => ({ ...prev, pdf_file: e.target.files[0] }))}
                  />
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                  <button type="submit" disabled={saving} className="ad-btn-save" style={{ flex: 1 }}>
                    {saving ? 'Uploading…' : nEdit ? 'Update Study Note' : 'Upload Study Note'}
                  </button>
                  {nEdit && (
                    <button
                      type="button"
                      onClick={() => { setNEdit(null); setNForm(emptyNote); }}
                      style={{ background: '#e2e8f0', border: 'none', padding: '10px 18px', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List */}
            <div className="ad-card" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>Title &amp; Subject</th>
                    <th>Type</th>
                    <th>Pages</th>
                    <th>PDF</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNotes.length === 0 ? (
                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: 32, color: '#64748b' }}>No study notes uploaded yet.</td></tr>
                  ) : (
                    filteredNotes.map(n => (
                      <tr key={n.id}>
                        <td>
                          <strong>{n.title}</strong>
                          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                            {n.subjectName || subjectMap[n.subject]?.name || '—'}
                          </div>
                        </td>
                        <td>
                          <span className="ad-badge" style={{ background: '#fee2e2', color: '#991b1b' }}>
                            {n.note_type}
                          </span>
                        </td>
                        <td>{n.page_count} pages</td>
                        <td>
                          {n.pdfUrl || n.pdf_file ? (
                            <a href={n.pdfUrl || n.pdf_file} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'underline' }}>
                              View PDF
                            </a>
                          ) : '—'}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => startEditNote(n)} className="ad-btn-sm" style={{ background: '#f1f5f9', color: '#334155' }}>
                              Edit
                            </button>
                            <button onClick={() => deleteNote(n.id)} className="ad-btn-sm" style={{ background: '#fee2e2', color: '#991b1b' }}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
