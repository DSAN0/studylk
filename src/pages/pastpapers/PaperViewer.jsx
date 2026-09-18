import React, { useState, useEffect, useMemo } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { getExplorePapers, getExplorePaperDetail } from '../../api/api'
import MathText from '../../components/MathText'

/* ── Static label maps ──────────────────────────────────── */
const SUBJECT_LABELS = {
  // O/L
  'mathematics': 'Mathematics', 'science': 'Science',
  'sinhala': 'Sinhala Language & Literature', 'english': 'English Language',
  'history': 'History', 'geography': 'Geography', 'civic': 'Civic Education',
  'buddhism': 'Buddhism / Religion', 'health-pe': 'Health & Physical Education',
  'art': 'Art', 'ict': 'ICT', 'tamil': 'Tamil Language & Literature',
  // A/L Science
  'combined-maths': 'Combined Mathematics', 'physics': 'Physics',
  'chemistry': 'Chemistry', 'biology': 'Biology',
  'agriculture': 'Agriculture & Applied Sciences',
  'engineering-technology': 'Engineering Technology',
  // A/L Commerce
  'business-studies': 'Business Studies', 'accounting': 'Accounting',
  'economics': 'Economics', 'business-stats': 'Business Statistics',
  // A/L Arts
  'political-science': 'Political Science',
  'buddhist-civilisation': 'Buddhist Civilisation',
  'logic': 'Logic & Scientific Method',
  'drama': 'Drama & Theatre', 'home-economics': 'Home Economics',
  'sinhala-literature': 'Sinhala Literature',
  // A/L Tech
  'bio-systems': 'Bio-systems Technology',
  'science-for-tech': 'Science for Technology',
  // Grade 5
  'environment': 'Environmental Studies',
  'general-competency': 'General Competency',
}

const STREAM_LABELS = {
  science: 'Science', commerce: 'Commerce', arts: 'Arts', tech: 'Technology',
}

const STREAM_META = {
  science:  { color: '#1565C0', bg: '#eff6ff',  gradient: 'linear-gradient(135deg,#0D47A1,#1976D2)' },
  commerce: { color: '#7B1FA2', bg: '#faf5ff',  gradient: 'linear-gradient(135deg,#6A1B9A,#9C27B0)' },
  arts:     { color: '#D84315', bg: '#fff7f5',  gradient: 'linear-gradient(135deg,#BF360C,#E64A19)' },
  tech:     { color: '#2E7D32', bg: '#f0fdf4',  gradient: 'linear-gradient(135deg,#1B5E20,#43A047)' },
}

const GRADE_META = {
  OL:     { label: 'O/L',                color: '#1565C0', gradient: 'linear-gradient(135deg,#0D47A1,#1976D2)', bg: '#eff6ff' },
  AL:     { label: 'A/L',                color: '#2E7D32', gradient: 'linear-gradient(135deg,#1B5E20,#43A047)', bg: '#f0fdf4' },
  Grade5: { label: 'Grade 5 Scholarship', color: '#E64A19', gradient: 'linear-gradient(135deg,#BF360C,#FF5722)', bg: '#fff7f5' },
}

/* ── Grade prop → backend grade slug ────────────────────── */
const GRADE_ID = { OL: 'ol', AL: 'al', Grade5: 'grade5' }

const MEDIUM_ICONS = { Sinhala: '🇱🇰', English: '🇬🇧', Tamil: '🌿' }
const PART_COLOR = { 
  'Part 1': { bg: '#e0f2fe', color: '#0369a1' }, 
  'Part 2': { bg: '#fef3c7', color: '#92400e' } 
}

export default function PaperViewer({ grade = 'AL' }) {
  const { stream, subject } = useParams()
  const location = useLocation()

  // Resolve display names
  const subjectKey = subject || 'physics'
  const subjectName = location.state?.subjectName || SUBJECT_LABELS[subjectKey] || subjectKey
  const streamName  = stream ? (STREAM_LABELS[stream] || stream) : null
  const gradeMeta   = GRADE_META[grade] || GRADE_META.OL
  const streamMeta  = stream ? (STREAM_META[stream] || STREAM_META.science) : null
  const heroGradient = streamMeta ? streamMeta.gradient : gradeMeta.gradient
  const heroColor    = streamMeta ? streamMeta.color    : gradeMeta.color

  // Filter & Search states
  const [selMedium, setSelMedium] = useState('All')
  const [selYear,   setSelYear]   = useState('All')
  const [selPart,   setSelPart]   = useState('All')
  const [filterMcqOnly, setFilterMcqOnly] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState('newest')
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Preview Modal state
  const [previewPaper, setPreviewPaper] = useState(null)

  // MCQ Practice Modal state
  const [mcqPaper, setMcqPaper] = useState(null)
  const [mcqLoading, setMcqLoading] = useState(false)
  const [mcqQuestions, setMcqQuestions] = useState([])
  const [userAnswers, setUserAnswers] = useState({})
  const [showExplanations, setShowExplanations] = useState({})

  // Real papers, fetched from the backend for this grade/stream/subject
  const [allPapers, setAllPapers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const gradeId = GRADE_ID[grade] || 'ol'

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    getExplorePapers(gradeId, subjectKey, grade === 'AL' ? stream : undefined)
      .then(res => { if (!cancelled) setAllPapers(res.data) })
      .catch(err => { if (!cancelled) setError(err.response?.data?.detail || err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [gradeId, subjectKey, stream, grade])

  async function openMcqPractice(paper) {
    setMcqPaper(paper)
    setMcqLoading(true)
    setMcqQuestions([])
    setUserAnswers({})
    setShowExplanations({})
    try {
      const res = await getExplorePaperDetail(paper.id)
      setMcqQuestions(res.data.mcq_questions || [])
    } catch (err) {
      console.error('Failed to load MCQ questions', err)
    } finally {
      setMcqLoading(false)
    }
  }

  function handleSelectOption(qId, choice) {
    setUserAnswers(prev => ({ ...prev, [qId]: choice }))
    setShowExplanations(prev => ({ ...prev, [qId]: true }))
  }

  function resetQuiz() {
    setUserAnswers({})
    setShowExplanations({})
  }

  // Filter option lists, derived from the papers actually returned
  const YEARS = useMemo(
    () => [...new Set(allPapers.map(p => p.year))].sort((a, b) => b - a),
    [allPapers]
  )
  const MEDIUMS = useMemo(
    () => [...new Set(allPapers.map(p => p.medium))],
    [allPapers]
  )
  const PARTS = useMemo(
    () => [...new Set(allPapers.map(p => p.part))],
    [allPapers]
  )

  const filtered = useMemo(() => {
    let result = allPapers.filter(p => {
      if (filterMcqOnly && !p.hasMcq) return false
      if (selMedium !== 'All' && p.medium !== selMedium) return false
      if (selYear   !== 'All' && p.year   !== Number(selYear)) return false
      if (selPart   !== 'All' && p.part   !== selPart) return false
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase()
        const matches = p.year.toString().includes(q) || p.part.toLowerCase().includes(q) || p.medium.toLowerCase().includes(q)
        if (!matches) return false
      }
      return true
    })

    return result.sort((a, b) => sortOrder === 'newest' ? b.year - a.year : a.year - b.year)
  }, [allPapers, filterMcqOnly, selMedium, selYear, selPart, searchQuery, sortOrder])

  const hasFilters = filterMcqOnly || selMedium !== 'All' || selYear !== 'All' || selPart !== 'All' || searchQuery !== ''

  function clearAll() {
    setFilterMcqOnly(false); setSelMedium('All'); setSelYear('All'); setSelPart('All'); setSearchQuery('')
  }

  /* Breadcrumb links */
  const breadcrumbs = [
    { label: '📄 Past Papers', to: '/explore/past-papers' },
    ...(grade === 'AL' && streamName
      ? [
          { label: 'A/L', to: '/explore/past-papers/al' },
          { label: `${streamName}`, to: `/explore/past-papers/al/${stream}` },
        ]
      : grade === 'OL'
      ? [{ label: 'O/L', to: '/explore/past-papers/ol' }]
      : [{ label: 'Grade 5 Scholarship', to: '/explore/past-papers/grade5' }]
    ),
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingTop: 88 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .pv-root { font-family:'Plus Jakarta Sans',sans-serif; }

        /* Breadcrumb */
        .pv-bread {
          background:rgba(255,255,255,0.88);backdrop-filter:blur(12px);
          border-bottom:1px solid rgba(0,0,0,0.07);padding:12px 0;
          position:sticky;top:88px;z-index:10;
        }
        .pv-bread-inner {
          max-width:1260px;margin:0 auto;padding:0 24px;
          display:flex;align-items:center;gap:8px;font-size:0.85rem;flex-wrap:wrap;
        }
        .pv-bread a { font-weight:600;text-decoration:none;transition:opacity 0.18s; }
        .pv-bread a:hover { opacity:0.7; }
        .pv-bread-sep { color:#94a3b8; }
        .pv-bread-cur { color:#475569;font-weight:700; }

        /* Hero */
        .pv-hero {
          padding:48px 24px;position:relative;overflow:hidden;
        }
        .pv-hero::before {
          content:'';position:absolute;inset:0;
          background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .pv-hero-inner {
          max-width:1260px;margin:0 auto;
          display:flex;align-items:center;gap:24px;flex-wrap:wrap;position:relative;
        }
        .pv-hero-icon {
          width:68px;height:68px;border-radius:18px;
          background:rgba(255,255,255,0.18);backdrop-filter:blur(10px);
          border:1.5px solid rgba(255,255,255,0.28);
          display:flex;align-items:center;justify-content:center;font-size:2rem;
          flex-shrink:0;
        }
        .pv-hero-label {
          font-size:0.8rem;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;
          color:rgba(255,255,255,0.72);margin-bottom:6px;
        }
        .pv-hero h1 {
          font-family:'Nunito',sans-serif;
          font-size:clamp(1.6rem,3.5vw,2.4rem);font-weight:900;
          color:white;margin:0 0 6px;line-height:1.15;
        }
        .pv-hero-sub { font-size:0.9rem;color:rgba(255,255,255,0.85); }
        .pv-hero-count {
          margin-left:auto;text-align:right;flex-shrink:0;
        }
        .pv-hero-count-num {
          font-family:'Nunito',sans-serif;font-size:2.6rem;font-weight:900;
          color:white;line-height:1;
        }
        .pv-hero-count-lbl {
          font-size:0.82rem;color:rgba(255,255,255,0.75);margin-top:4px;
        }

        /* Layout */
        .pv-layout {
          max-width:1260px;margin:0 auto;padding:32px 24px 80px;
          display:grid;grid-template-columns:280px 1fr;gap:28px;align-items:start;
        }

        /* Mobile Toggle */
        .pv-mobile-toggle {
          display:none;width:100%;padding:12px;border-radius:12px;
          background:white;border:1.5px solid #e2e8f0;font-weight:700;
          color:#1e293b;cursor:pointer;margin-bottom:16px;
          align-items:center;justify-content:space-between;
        }

        /* Sidebar Filters */
        .pv-sidebar {
          background:white;border-radius:20px;padding:24px;
          border:1.5px solid #e2e8f0;
          box-shadow:0 4px 20px rgba(0,0,0,0.04);
          position:sticky;top:150px;
        }
        .pv-sidebar-title {
          font-family:'Nunito',sans-serif;font-size:1rem;font-weight:800;
          color:#1e293b;margin:0 0 20px;
          display:flex;align-items:center;justify-content:space-between;
        }
        .pv-clear-btn {
          font-size:0.75rem;font-weight:700;color:#ef4444;
          background:none;border:none;cursor:pointer;padding:3px 8px;
          border-radius:6px;transition:background 0.18s;
        }
        .pv-clear-btn:hover { background:#fff0f0; }

        .pv-search-box {
          width:100%;padding:10px 14px;border-radius:10px;
          border:1.5px solid #e2e8f0;font-size:0.85rem;outline:none;
          margin-bottom:20px;box-sizing:border-box;
          transition:border-color 0.2s;
        }
        .pv-search-box:focus { border-color:#2563eb; }

        .pv-filter-group { margin-bottom:20px; }
        .pv-filter-label {
          font-size:0.76rem;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;
          color:#94a3b8;margin-bottom:10px;
        }
        .pv-filter-pills { display:flex;flex-wrap:wrap;gap:8px; }
        .pv-pill {
          padding:7px 14px;border-radius:50px;
          border:1.5px solid #e2e8f0;background:white;
          font-size:0.82rem;font-weight:600;color:#64748b;
          cursor:pointer;transition:all 0.18s;
        }
        .pv-pill:hover { border-color:#cbd5e1; color:#1e293b; }
        .pv-pill.active { border-color:transparent !important; color:white !important; }

        /* Results Header */
        .pv-results-header {
          display:flex;align-items:center;justify-content:space-between;
          margin-bottom:16px;flex-wrap:wrap;gap:12px;
        }
        .pv-results-title {
          font-family:'Nunito',sans-serif;font-size:1.3rem;font-weight:800;color:#1e293b;
        }
        .pv-sort-select {
          padding:6px 12px;border-radius:10px;border:1.5px solid #e2e8f0;
          font-size:0.82rem;font-weight:700;color:#475569;outline:none;
          background:white;cursor:pointer;
        }

        /* Active Filters Bar */
        .pv-active-filters {
          display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px;
        }
        .pv-af-tag {
          display:inline-flex;align-items:center;gap:6px;
          font-size:0.78rem;font-weight:700;
          background:#e2e8f0;color:#334155;
          padding:4px 12px;border-radius:50px;
        }
        .pv-af-x {
          cursor:pointer;opacity:0.6;transition:opacity 0.15s;
          font-size:0.9rem;line-height:1;
        }
        .pv-af-x:hover { opacity:1; }

        /* Paper Grid */
        .pv-grid {
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(260px,1fr));
          gap:16px;
        }
        .pv-paper-card {
          background:white;border-radius:18px;
          border:1.5px solid #e2e8f0;
          box-shadow:0 2px 10px rgba(0,0,0,0.04);
          padding:20px;display:flex;flex-direction:column;justify-content:space-between;
          transition:transform 0.22s,box-shadow 0.22s,border-color 0.18s;
        }
        .pv-paper-card:hover {
          transform:translateY(-4px);
          box-shadow:0 12px 28px rgba(0,0,0,0.08);
          border-color:#cbd5e1;
        }
        .pv-paper-top {
          display:flex;align-items:center;gap:12px;margin-bottom:16px;
        }
        .pv-paper-year-badge {
          width:50px;height:50px;border-radius:14px;
          display:flex;align-items:center;justify-content:center;
          font-family:'Nunito',sans-serif;font-size:0.92rem;font-weight:900;
          color:white;flex-shrink:0;
        }
        .pv-paper-info { flex:1;min-width:0; }
        .pv-paper-subject {
          font-size:0.9rem;font-weight:700;color:#1e293b;
          margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
        }
        .pv-paper-meta { font-size:0.78rem;color:#94a3b8; }
        .pv-paper-tags {
          display:flex;gap:6px;margin-bottom:18px;flex-wrap:wrap;
        }
        .pv-tag {
          display:inline-flex;align-items:center;gap:4px;
          font-size:0.74rem;font-weight:700;
          padding:3px 10px;border-radius:50px;
        }
        .pv-paper-actions { display:flex;gap:8px; }
        .pv-btn {
          flex:1;padding:9px 12px;border-radius:10px;
          font-size:0.8rem;font-weight:700;cursor:pointer;
          border:none;font-family:'Plus Jakarta Sans',sans-serif;
          display:flex;align-items:center;justify-content:center;gap:5px;
          transition:opacity 0.18s,transform 0.15s;
        }
        .pv-btn:hover { opacity:0.9; transform:scale(0.98); }
        .pv-btn-view { color:white; }
        .pv-btn-dl {
          background:#f1f5f9;color:#475569;
          border:1.5px solid #e2e8f0;text-decoration:none;
        }
        .pv-btn-dl:hover { background:#e2e8f0; }

        /* Empty State */
        .pv-empty {
          grid-column:1/-1;text-align:center;
          padding:64px 24px;color:#64748b;background:white;
          border-radius:20px;border:1px dashed #cbd5e1;
        }
        .pv-empty-icon { font-size:3rem;margin-bottom:12px;display:block; }

        /* Modal Preview */
        .pv-modal-overlay {
          position:fixed;inset:0;background:rgba(15,23,42,0.7);
          backdrop-filter:blur(4px);z-index:100;
          display:flex;align-items:center;justify-content:center;padding:24px;
        }
        .pv-modal {
          background:white;width:100%;max-width:900px;height:85vh;
          border-radius:24px;overflow:hidden;display:flex;flex-direction:column;
          box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);
        }
        .pv-modal-header {
          padding:16px 24px;border-bottom:1px solid #e2e8f0;
          display:flex;align-items:center;justify-content:space-between;
          background:#f8fafc;
        }
        .pv-modal-close {
          border:none;background:#e2e8f0;width:32px;height:32px;
          border-radius:50%;font-weight:700;cursor:pointer;
        }

        @media(max-width:900px) {
          .pv-layout { grid-template-columns:1fr; }
          .pv-mobile-toggle { display:flex; }
          .pv-sidebar { display:${showMobileFilters ? 'block' : 'none'}; position:static; }
        }
        @media(max-width:640px) {
          .pv-hero-count { display:none; }
          .pv-grid { grid-template-columns:1fr; }
        }
      `}</style>

      <div className="pv-root">
        {/* Navigation Breadcrumb */}
        <nav aria-label="Breadcrumb" className="pv-bread">
          <div className="pv-bread-inner">
            {breadcrumbs.map((b, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Link to={b.to} style={{ color: heroColor }}>{b.label}</Link>
                <span className="pv-bread-sep">›</span>
              </span>
            ))}
            <span className="pv-bread-cur">{subjectName}</span>
          </div>
        </nav>

        {/* Hero Header */}
        <header className="pv-hero" style={{ background: heroGradient }}>
          <div className="pv-hero-inner">
            <div className="pv-hero-icon">📄</div>
            <div>
              <div className="pv-hero-label">
                {grade === 'AL' && streamName ? `A/L · ${streamName} Stream` : gradeMeta.label} · Past Papers
              </div>
              <h1>{subjectName}</h1>
              <div className="pv-hero-sub">
                Official past examination papers, marking schemes, and revision resources.
              </div>
            </div>
            <div className="pv-hero-count">
              <div className="pv-hero-count-num">{filtered.length}</div>
              <div className="pv-hero-count-lbl">Available papers</div>
            </div>
          </div>
        </header>

        {/* Main Grid & Filters Layout */}
        <div className="pv-layout">
          {/* Mobile Filter Toggle */}
          <button 
            className="pv-mobile-toggle" 
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <span>🎛️ Filter & Search Papers</span>
            <span>{showMobileFilters ? '▲ Close' : '▼ Expand'}</span>
          </button>

          {/* Sidebar Filters */}
          <aside className="pv-sidebar">
            <div className="pv-sidebar-title">
              <span>🎛 Filters</span>
              {hasFilters && (
                <button className="pv-clear-btn" onClick={clearAll}>Clear all</button>
              )}
            </div>

            {/* Quick Keyword Search */}
            <input
              type="text"
              className="pv-search-box"
              placeholder="Search year or part..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* Practice Mode Filter */}
            <div className="pv-filter-group">
              <div className="pv-filter-label">Practice Mode</div>
              <div className="pv-filter-pills">
                <button
                  className={`pv-pill${!filterMcqOnly ? ' active' : ''}`}
                  style={!filterMcqOnly ? { background: heroColor, borderColor: heroColor } : {}}
                  onClick={() => setFilterMcqOnly(false)}
                >
                  All Papers
                </button>
                <button
                  className={`pv-pill${filterMcqOnly ? ' active' : ''}`}
                  style={filterMcqOnly ? { background: '#16a34a', borderColor: '#16a34a' } : {}}
                  onClick={() => setFilterMcqOnly(true)}
                >
                  🎯 MCQ Quiz Available
                </button>
              </div>
            </div>

            {/* Medium Filter */}
            <div className="pv-filter-group">
              <div className="pv-filter-label">Medium</div>
              <div className="pv-filter-pills">
                {['All', ...MEDIUMS].map(m => (
                  <button
                    key={m}
                    className={`pv-pill${selMedium === m ? ' active' : ''}`}
                    style={selMedium === m ? { background: heroColor, borderColor: heroColor } : {}}
                    onClick={() => setSelMedium(m)}
                  >
                    {m !== 'All' && MEDIUM_ICONS[m]} {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Year Filter */}
            <div className="pv-filter-group">
              <div className="pv-filter-label">Year</div>
              <div className="pv-filter-pills">
                <button
                  className={`pv-pill${selYear === 'All' ? ' active' : ''}`}
                  style={selYear === 'All' ? { background: heroColor, borderColor: heroColor } : {}}
                  onClick={() => setSelYear('All')}
                >
                  All Years
                </button>
                {YEARS.map(y => (
                  <button
                    key={y}
                    className={`pv-pill${selYear === String(y) ? ' active' : ''}`}
                    style={selYear === String(y) ? { background: heroColor, borderColor: heroColor } : {}}
                    onClick={() => setSelYear(String(y))}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>

            {/* Part Filter */}
            <div className="pv-filter-group">
              <div className="pv-filter-label">Paper Part</div>
              <div className="pv-filter-pills">
                {['All', ...PARTS].map(p => (
                  <button
                    key={p}
                    className={`pv-pill${selPart === p ? ' active' : ''}`}
                    style={selPart === p ? { background: heroColor, borderColor: heroColor } : {}}
                    onClick={() => setSelPart(p)}
                  >
                    {p === 'All' ? 'All Parts' : p}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Paper Content Grid */}
          <main>
            <div className="pv-results-header">
              <div className="pv-results-title">Past Papers List</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <select 
                  className="pv-sort-select" 
                  value={sortOrder} 
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="newest">Sort: Newest First</option>
                  <option value="oldest">Sort: Oldest First</option>
                </select>
              </div>
            </div>

            {/* Active Filter Tags */}
            {hasFilters && (
              <div className="pv-active-filters">
                {filterMcqOnly && (
                  <div className="pv-af-tag" style={{ background: '#dcfce7', color: '#166534' }}>
                    🎯 MCQ Quiz Only
                    <span className="pv-af-x" onClick={() => setFilterMcqOnly(false)}>×</span>
                  </div>
                )}
                {selMedium !== 'All' && (
                  <div className="pv-af-tag">
                    {MEDIUM_ICONS[selMedium]} {selMedium}
                    <span className="pv-af-x" onClick={() => setSelMedium('All')}>×</span>
                  </div>
                )}
                {selYear !== 'All' && (
                  <div className="pv-af-tag">
                    📅 {selYear}
                    <span className="pv-af-x" onClick={() => setSelYear('All')}>×</span>
                  </div>
                )}
                {selPart !== 'All' && (
                  <div className="pv-af-tag">
                    📄 {selPart}
                    <span className="pv-af-x" onClick={() => setSelPart('All')}>×</span>
                  </div>
                )}
                {searchQuery && (
                  <div className="pv-af-tag">
                    🔍 "{searchQuery}"
                    <span className="pv-af-x" onClick={() => setSearchQuery('')}>×</span>
                  </div>
                )}
              </div>
            )}

            {/* Paper Cards Grid */}
            <div className="pv-grid">
              {loading ? (
                <div className="pv-empty">
                  <span className="pv-empty-icon">⏳</span>
                  <h3 style={{ margin: '0 0 6px', color: '#1e293b' }}>Loading papers…</h3>
                </div>
              ) : error ? (
                <div className="pv-empty">
                  <span className="pv-empty-icon">⚠️</span>
                  <h3 style={{ margin: '0 0 6px', color: '#1e293b' }}>Couldn't load papers</h3>
                  <p style={{ margin: 0, fontSize: '0.85rem' }}>{error}</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="pv-empty">
                  <span className="pv-empty-icon">🔎</span>
                  <h3 style={{ margin: '0 0 6px', color: '#1e293b' }}>No papers match your filters</h3>
                  <p style={{ margin: 0, fontSize: '0.85rem' }}>Try clearing active filters or searching for another year.</p>
                  <button className="pv-clear-btn" style={{ marginTop: 12, fontSize: '0.85rem' }} onClick={clearAll}>Reset Filters</button>
                </div>
              ) : (
                filtered.map(paper => (
                  <div key={paper.id} className="pv-paper-card">
                    <div>
                      <div className="pv-paper-top">
                        <div
                          className="pv-paper-year-badge"
                          style={{ background: heroGradient }}
                        >
                          {paper.year}
                        </div>
                        <div className="pv-paper-info">
                          <div className="pv-paper-subject">{subjectName}</div>
                          <div className="pv-paper-meta">
                            {gradeMeta.label}{streamName ? ` · ${streamName}` : ''}
                          </div>
                        </div>
                      </div>

                      <div className="pv-paper-tags">
                        <span className="pv-tag" style={{ background: '#f0fdf4', color: '#166534' }}>
                          {MEDIUM_ICONS[paper.medium]} {paper.medium}
                        </span>
                        <span className="pv-tag" style={PART_COLOR[paper.part] || { bg: '#f1f5f9', color: '#475569' }}>
                          📄 {paper.part}
                        </span>
                        {paper.hasMcq && (
                          <span className="pv-tag" style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #86efac', fontWeight: 800 }}>
                            ✨ MCQ Quiz
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pv-paper-actions" style={{ flexWrap: 'wrap' }}>
                      {paper.hasMcq && (
                        <button
                          className="pv-btn"
                          style={{
                            background: 'linear-gradient(135deg, #16a34a, #15803d)',
                            color: 'white',
                            fontWeight: 800,
                            boxShadow: '0 2px 8px rgba(22,163,74,0.25)',
                            flex: '1 0 100%',
                            marginBottom: 4,
                          }}
                          onClick={() => openMcqPractice(paper)}
                        >
                          🎯 Practice MCQs
                        </button>
                      )}
                      <button
                        className="pv-btn pv-btn-view"
                        style={{ background: heroColor }}
                        onClick={() => setPreviewPaper(paper)}
                      >
                        👁 PDF
                      </button>
                      <a 
                        href={paper.pdfUrl} 
                        download 
                        className="pv-btn pv-btn-dl"
                      >
                        ⬇ Download
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </main>
        </div>

        {/* Modal PDF Viewer */}
        {previewPaper && (
          <div className="pv-modal-overlay" onClick={() => setPreviewPaper(null)}>
            <div className="pv-modal" onClick={(e) => e.stopPropagation()}>
              <div className="pv-modal-header">
                <div>
                  <strong style={{ color: '#1e293b' }}>{subjectName} — {previewPaper.year}</strong>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', marginLeft: 8 }}>({previewPaper.medium} Medium / {previewPaper.part})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {previewPaper.hasMcq && (
                    <button
                      className="pv-btn"
                      style={{
                        background: 'linear-gradient(135deg, #16a34a, #15803d)',
                        color: 'white',
                        padding: '6px 14px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                      }}
                      onClick={() => {
                        const p = previewPaper
                        setPreviewPaper(null)
                        openMcqPractice(p)
                      }}
                    >
                      🎯 Start MCQ Quiz
                    </button>
                  )}
                  <button className="pv-modal-close" onClick={() => setPreviewPaper(null)}>✕</button>
                </div>
              </div>
              <iframe
                src={previewPaper.pdfUrl}
                title="Paper Preview"
                style={{ width: '100%', height: '100%', border: 'none' }}
              />
            </div>
          </div>
        )}

        {/* Interactive MCQ Practice Modal */}
        {mcqPaper && (
          <div className="pv-modal-overlay" onClick={() => setMcqPaper(null)}>
            <div className="pv-modal" style={{ maxWidth: 860, height: '90vh' }} onClick={e => e.stopPropagation()}>
              <div className="pv-modal-header" style={{ background: '#f8fafc', padding: '16px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: 'linear-gradient(135deg,#16a34a,#15803d)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontSize: '1.2rem', flexShrink: 0
                  }}>
                    🎯
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#1e293b' }}>
                      {subjectName} — {mcqPaper.year} MCQ Practice
                    </h3>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2 }}>
                      {mcqPaper.medium} Medium · {mcqPaper.part} · {mcqQuestions.length} Questions
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {Object.keys(userAnswers).length > 0 && (
                    <button
                      onClick={resetQuiz}
                      style={{
                        background: '#f1f5f9', border: '1px solid #cbd5e1',
                        borderRadius: 8, padding: '6px 12px', fontSize: '0.78rem',
                        fontWeight: 700, color: '#475569', cursor: 'pointer'
                      }}
                    >
                      🔄 Reset
                    </button>
                  )}
                  <button className="pv-modal-close" onClick={() => setMcqPaper(null)}>✕</button>
                </div>
              </div>

              {/* Quiz progress / stats bar */}
              {!mcqLoading && mcqQuestions.length > 0 && (
                <div style={{
                  padding: '12px 24px', background: '#f0fdf4',
                  borderBottom: '1px solid #bbf7d0', display: 'flex',
                  alignItems: 'center', justifyContent: 'space-between',
                  flexWrap: 'wrap', gap: 10
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#166534' }}>
                      Answered: {Object.keys(userAnswers).length} / {mcqQuestions.length}
                    </span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#15803d' }}>
                      Correct: {mcqQuestions.filter(q => userAnswers[q.id] === q.correct_answer).length}
                    </span>
                  </div>
                  <div style={{
                    background: '#dcfce7', border: '1px solid #86efac',
                    borderRadius: 50, padding: '3px 12px', fontSize: '0.78rem',
                    fontWeight: 800, color: '#166534'
                  }}>
                    Score: {Object.keys(userAnswers).length > 0
                      ? Math.round((mcqQuestions.filter(q => userAnswers[q.id] === q.correct_answer).length / Object.keys(userAnswers).length) * 100)
                      : 0}%
                  </div>
                </div>
              )}

              {/* Questions List Body */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '24px', background: '#fafafa' }}>
                {mcqLoading ? (
                  <div style={{ textAlign: 'center', padding: '60px 0' }}>
                    <div style={{
                      width: 36, height: 36, border: '3px solid #bbf7d0',
                      borderTopColor: '#16a34a', borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite', margin: '0 auto 12px'
                    }} />
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Loading questions…</p>
                  </div>
                ) : mcqQuestions.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
                    <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: 8 }}>📋</span>
                    <h4 style={{ margin: '0 0 4px', color: '#1e293b' }}>No MCQ questions found</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem' }}>Questions have not been published for this paper yet.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {mcqQuestions
                      .slice()
                      .sort((a, b) => (a.ordering || 0) - (b.ordering || 0))
                      .map((q, idx) => {
                        const answered = userAnswers[q.id]
                        const isCorrect = answered === q.correct_answer
                        const choices = [
                          { letter: 'A', text: q.option_a },
                          { letter: 'B', text: q.option_b },
                          { letter: 'C', text: q.option_c },
                          { letter: 'D', text: q.option_d },
                        ]
                        if (q.option_e) choices.push({ letter: 'E', text: q.option_e })

                        return (
                          <div
                            key={q.id}
                            style={{
                              background: 'white', borderRadius: 16,
                              border: '1.5px solid #e2e8f0', padding: 20,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
                              <span style={{
                                width: 32, height: 32, borderRadius: 8,
                                background: answered ? (isCorrect ? '#22c55e' : '#ef4444') : '#1e293b',
                                color: 'white', fontWeight: 800, fontSize: '0.82rem',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0, marginTop: 2
                              }}>
                                {idx + 1}
                              </span>
                              <div style={{ flex: 1, fontSize: '0.94rem', fontWeight: 600, color: '#1e293b', lineHeight: 1.6 }}>
                                <MathText text={q.question_text} />
                              </div>
                            </div>

                            {/* Options */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10, marginBottom: 12 }}>
                              {choices.map(c => {
                                const isSelected = answered === c.letter
                                const isRightChoice = c.letter === q.correct_answer
                                let bg = '#f8fafc'
                                let border = '1.5px solid #e2e8f0'
                                let color = '#334155'
                                let badgeBg = '#e2e8f0'
                                let badgeColor = '#475569'

                                if (answered) {
                                  if (isSelected) {
                                    if (isCorrect) {
                                      bg = '#f0fdf4'
                                      border = '1.5px solid #22c55e'
                                      color = '#15803d'
                                      badgeBg = '#22c55e'
                                      badgeColor = 'white'
                                    } else {
                                      bg = '#fef2f2'
                                      border = '1.5px solid #ef4444'
                                      color = '#b91c1c'
                                      badgeBg = '#ef4444'
                                      badgeColor = 'white'
                                    }
                                  } else if (isRightChoice) {
                                    bg = '#f0fdf4'
                                    border = '1.5px dashed #22c55e'
                                    color = '#15803d'
                                    badgeBg = '#86efac'
                                    badgeColor = '#166534'
                                  }
                                }

                                return (
                                  <button
                                    key={c.letter}
                                    type="button"
                                    onClick={() => handleSelectOption(q.id, c.letter)}
                                    style={{
                                      display: 'flex', alignItems: 'center', gap: 10,
                                      padding: '10px 14px', borderRadius: 12,
                                      background: bg, border: border, color: color,
                                      cursor: 'pointer', textAlign: 'left',
                                      transition: 'all 0.18s', outline: 'none'
                                    }}
                                  >
                                    <span style={{
                                      width: 26, height: 26, borderRadius: 6,
                                      background: badgeBg, color: badgeColor,
                                      fontWeight: 800, fontSize: '0.75rem',
                                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                                      flexShrink: 0
                                    }}>
                                      {c.letter}
                                    </span>
                                    <span style={{ fontSize: '0.86rem', fontWeight: 500, flex: 1 }}>
                                      <MathText text={c.text} />
                                    </span>
                                    {answered && isSelected && (
                                      <span>{isCorrect ? '✓' : '✕'}</span>
                                    )}
                                    {answered && !isSelected && isRightChoice && (
                                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16a34a' }}>Correct</span>
                                    )}
                                  </button>
                                )
                              })}
                            </div>

                            {/* Explanation */}
                            {answered && q.explanation && (
                              <div style={{
                                background: '#eff6ff', border: '1px solid #bfdbfe',
                                borderRadius: 10, padding: '10px 14px',
                                fontSize: '0.84rem', color: '#1e40af', lineHeight: 1.5,
                                marginTop: 8
                              }}>
                                <strong style={{ color: '#1d4ed8' }}>💡 Explanation: </strong>
                                <MathText text={q.explanation} />
                              </div>
                            )}
                          </div>
                        )
                      })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}