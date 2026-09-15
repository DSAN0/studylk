import React, { useState, useEffect, useMemo } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { getExploreSchoolPapers } from '../api/api'

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
  science:  { color: '#4527A0', bg: '#ede7f6', gradient: 'linear-gradient(135deg,#311B92,#512DA8)' },
  commerce: { color: '#6A1B9A', bg: '#f3e5f5', gradient: 'linear-gradient(135deg,#4A148C,#7B1FA2)' },
  arts:     { color: '#BF360C', bg: '#fbe9e7', gradient: 'linear-gradient(135deg,#870000,#D84315)' },
  tech:     { color: '#1B5E20', bg: '#e8f5e9', gradient: 'linear-gradient(135deg,#0d3810,#2E7D32)' },
}

const GRADE_META = {
  OL:     { label: 'O/L',                color: '#4527A0', gradient: 'linear-gradient(135deg,#311B92,#512DA8)', bg: '#ede7f6' },
  AL:     { label: 'A/L',                color: '#4527A0', gradient: 'linear-gradient(135deg,#311B92,#512DA8)', bg: '#ede7f6' },
  Grade5: { label: 'Grade 5 Scholarship', color: '#BF360C', gradient: 'linear-gradient(135deg,#870000,#D84315)', bg: '#fbe9e7' },
}

const GRADE_ID = { OL: 'ol', AL: 'al', Grade5: 'grade5' }

export default function ExploreSchoolPapers({ grade = 'AL' }) {
  const { stream, subject } = useParams()
  const location = useLocation()

  const subjectKey = subject || ''
  const subjectName = location.state?.subjectName || SUBJECT_LABELS[subjectKey] || subjectKey
  const streamName  = stream ? (STREAM_LABELS[stream] || stream) : null
  const gradeMeta   = GRADE_META[grade] || GRADE_META.AL
  const streamMeta  = stream ? (STREAM_META[stream] || STREAM_META.science) : null
  const heroGradient = streamMeta ? streamMeta.gradient : gradeMeta.gradient
  const heroColor    = streamMeta ? streamMeta.color    : gradeMeta.color

  const [selSchool, setSelSchool] = useState('All')
  const [selTerm,   setSelTerm]   = useState('All')
  const [selMedium, setSelMedium] = useState('All')
  const [selYear,   setSelYear]   = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState('newest')

  const [previewPaper, setPreviewPaper] = useState(null)
  const [allPapers, setAllPapers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const gradeId = GRADE_ID[grade] || 'al'

  useEffect(() => {
    if (!subjectKey) {
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)

    getExploreSchoolPapers(gradeId, subjectKey, grade === 'AL' ? stream : undefined)
      .then(res => { if (!cancelled) setAllPapers(res.data) })
      .catch(err => { if (!cancelled) setError(err.response?.data?.detail || err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [gradeId, subjectKey, stream, grade])

  const SCHOOLS = useMemo(
    () => [...new Set(allPapers.map(p => p.school_name))].sort(),
    [allPapers]
  )
  const TERMS = useMemo(
    () => [...new Set(allPapers.map(p => p.term))].sort(),
    [allPapers]
  )
  const YEARS = useMemo(
    () => [...new Set(allPapers.map(p => p.year))].sort((a, b) => b - a),
    [allPapers]
  )
  const MEDIUMS = useMemo(
    () => [...new Set(allPapers.map(p => p.medium))],
    [allPapers]
  )

  const filtered = useMemo(() => {
    let result = allPapers.filter(p => {
      if (selSchool !== 'All' && p.school_name !== selSchool) return false
      if (selTerm   !== 'All' && p.term !== selTerm) return false
      if (selMedium !== 'All' && p.medium !== selMedium) return false
      if (selYear   !== 'All' && p.year !== Number(selYear)) return false
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase()
        const matches = (p.school_name || '').toLowerCase().includes(q) ||
                        (p.term || '').toLowerCase().includes(q) ||
                        p.year.toString().includes(q) ||
                        p.medium.toLowerCase().includes(q)
        if (!matches) return false
      }
      return true
    })

    return result.sort((a, b) => sortOrder === 'newest' ? b.year - a.year : a.year - b.year)
  }, [allPapers, selSchool, selTerm, selMedium, selYear, searchQuery, sortOrder])

  // Breadcrumbs
  const breadcrumbs = [
    { label: '🔍 Explore', to: '/explore' },
    ...(grade === 'AL' && streamName
      ? [
          { label: '🎓 A/L', to: '/explore/al' },
          { label: `${streamName}`, to: `/explore/al/${stream}` },
        ]
      : grade === 'OL'
      ? [{ label: '📘 O/L', to: '/explore/ol' }]
      : [{ label: '⭐ Grade 5', to: '/explore/grade5' }]
    ),
    ...(subjectName ? [{ label: subjectName, to: null }] : []),
    { label: '🏫 School Papers', to: null }
  ]

  if (!subjectKey) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f3e5f5 0%, #ede7f6 50%, #e8eaf6 100%)', paddingTop: 88 }}>
        <div style={{ maxWidth: 800, margin: '60px auto', padding: '0 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🏫</div>
          <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '2.4rem', fontWeight: 900, color: '#311B92', marginBottom: 16 }}>
            Browse Top School Term Papers
          </h1>
          <p style={{ color: '#5E35B1', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: 32 }}>
            Please select your grade and subject to view authentic term test papers from leading schools across Sri Lanka.
          </p>
          <Link
            to="/explore"
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #4527A0, #311B92)',
              color: 'white',
              padding: '14px 32px',
              borderRadius: 50,
              fontWeight: 800,
              textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(69,39,160,0.3)',
            }}
          >
            Start Exploring →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingTop: 88 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .esp-root { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        .esp-bread {
          background: rgba(255,255,255,0.9); backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(0,0,0,0.07); padding: 12px 0;
          position: sticky; top: 88px; z-index: 10;
        }
        .esp-bread-inner {
          max-width: 1260px; margin: 0 auto; padding: 0 24px;
          display: flex; align-items: center; gap: 8px; font-size: 0.85rem; flex-wrap: wrap;
        }
        .esp-bread a { font-weight: 600; text-decoration: none; color: ${heroColor}; }
        .esp-bread a:hover { opacity: 0.7; }
        .esp-bread-sep { color: #94a3b8; }
        .esp-bread-cur { color: #475569; font-weight: 700; }

        .esp-hero {
          background: ${heroGradient};
          padding: 48px 24px; position: relative; overflow: hidden; color: white;
        }
        .esp-hero-inner { max-width: 1260px; margin: 0 auto; position: relative; z-index: 1; }
        .esp-hero-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.3);
          color: white; font-size: 0.82rem; font-weight: 700;
          padding: 5px 14px; border-radius: 50px; margin-bottom: 14px;
        }
        .esp-hero-title {
          font-family: 'Nunito', sans-serif; font-size: clamp(1.8rem, 4vw, 2.6rem);
          font-weight: 900; margin: 0 0 10px;
        }
        .esp-hero-sub {
          color: rgba(255,255,255,0.88); font-size: 1rem; margin: 0;
        }

        .esp-body { max-width: 1260px; margin: 0 auto; padding: 36px 24px 64px; }

        .esp-filters {
          background: white; border-radius: 16px; padding: 18px 22px;
          border: 1px solid #e2e8f0; box-shadow: 0 2px 10px rgba(0,0,0,0.03);
          display: flex; flex-wrap: wrap; gap: 16px; align-items: center; justify-content: space-between;
          margin-bottom: 24px;
        }
        .esp-filter-group { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
        .esp-select {
          padding: 8px 14px; border-radius: 10px; border: 1.5px solid #cbd5e1;
          font-size: 0.86rem; font-weight: 600; color: #334155; outline: none;
          background: white; cursor: pointer;
        }
        .esp-search {
          padding: 8px 16px; border-radius: 10px; border: 1.5px solid #cbd5e1;
          font-size: 0.86rem; width: 220px; outline: none;
        }

        /* School chips */
        .esp-school-chips {
          display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px;
        }
        .esp-chip-btn {
          padding: 6px 14px; border-radius: 50px; font-size: 0.82rem; font-weight: 700;
          border: 1.5px solid #ede7f6; background: white; color: #4527A0; cursor: pointer;
          transition: all 0.16s;
        }
        .esp-chip-btn:hover, .esp-chip-btn.active {
          background: #4527A0; color: white; border-color: #4527A0;
        }

        .esp-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 22px;
        }
        .esp-card {
          background: white; border-radius: 18px; border: 1.5px solid #e2e8f0;
          box-shadow: 0 4px 18px rgba(69,39,160,0.06); overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          display: flex; flex-direction: column;
        }
        .esp-card:hover {
          transform: translateY(-4px); box-shadow: 0 12px 30px rgba(69,39,160,0.12);
        }
        .esp-card-head {
          padding: 20px 22px 14px; background: #fdfcff; border-bottom: 1px solid #f1f5f9;
        }
        .esp-card-school { font-size: 1.12rem; font-weight: 800; color: #1e1b4b; margin-bottom: 4px; }
        .esp-card-meta { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-top: 8px; }
        .esp-chip {
          font-size: 0.76rem; font-weight: 700; padding: 3px 10px; border-radius: 50px;
        }
        .esp-card-body { padding: 18px 22px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
        .esp-card-actions { display: flex; gap: 10px; margin-top: 18px; }
        .esp-btn-preview {
          flex: 1; padding: 9px 16px; border-radius: 10px; font-weight: 700; font-size: 0.86rem;
          background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; cursor: pointer;
          text-align: center; transition: all 0.16s;
        }
        .esp-btn-preview:hover { background: #e2e8f0; }
        .esp-btn-dl {
          flex: 1; padding: 9px 16px; border-radius: 10px; font-weight: 700; font-size: 0.86rem;
          background: linear-gradient(135deg, #4527A0, #311B92); color: white;
          text-decoration: none; text-align: center; transition: opacity 0.16s;
          display: inline-flex; align-items: center; justify-content: center; gap: 5px;
        }
        .esp-btn-dl:hover { opacity: 0.92; }

        /* PDF Preview Modal */
        .esp-modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.65); backdrop-filter: blur(6px);
          z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px;
        }
        .esp-modal {
          background: white; width: 100%; max-width: 900px; height: 85vh; border-radius: 20px;
          display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,0.3);
        }
        .esp-modal-head {
          padding: 16px 24px; border-bottom: 1px solid #e2e8f0; display: flex;
          align-items: center; justify-content: space-between; background: #f8fafc;
        }
        .esp-modal-body { flex: 1; background: #334155; }
      `}</style>

      <div className="esp-root">
        {/* Breadcrumbs */}
        <nav className="esp-bread">
          <div className="esp-bread-inner">
            {breadcrumbs.map((b, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="esp-bread-sep">›</span>}
                {b.to ? (
                  <Link to={b.to}>{b.label}</Link>
                ) : (
                  <span className="esp-bread-cur">{b.label}</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </nav>

        {/* Hero */}
        <div className="esp-hero">
          <div className="esp-hero-inner">
            <div className="esp-hero-badge">🏫 School Papers · {gradeMeta.label}</div>
            <h1 className="esp-hero-title">{subjectName} Term Papers</h1>
            <p className="esp-hero-sub">
              Official term examination papers from leading national and provincial schools across Sri Lanka.
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="esp-body">
          {/* Filter Bar */}
          <div className="esp-filters">
            <div className="esp-filter-group">
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#64748b' }}>Filters:</label>
              
              {SCHOOLS.length > 0 && (
                <select className="esp-select" value={selSchool} onChange={e => setSelSchool(e.target.value)}>
                  <option value="All">All Schools</option>
                  {SCHOOLS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              )}

              {TERMS.length > 0 && (
                <select className="esp-select" value={selTerm} onChange={e => setSelTerm(e.target.value)}>
                  <option value="All">All Terms</option>
                  {TERMS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              )}

              <select className="esp-select" value={selMedium} onChange={e => setSelMedium(e.target.value)}>
                <option value="All">All Mediums</option>
                {MEDIUMS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>

              {YEARS.length > 0 && (
                <select className="esp-select" value={selYear} onChange={e => setSelYear(e.target.value)}>
                  <option value="All">All Years</option>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              )}
            </div>

            <div className="esp-filter-group">
              <input
                type="text"
                className="esp-search"
                placeholder="Search school, term..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <select className="esp-select" value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Quick School Chips */}
          {SCHOOLS.length > 1 && (
            <div className="esp-school-chips">
              <button
                className={`esp-chip-btn ${selSchool === 'All' ? 'active' : ''}`}
                onClick={() => setSelSchool('All')}
              >
                🏫 All Schools ({allPapers.length})
              </button>
              {SCHOOLS.map(s => {
                const count = allPapers.filter(p => p.school_name === s).length
                return (
                  <button
                    key={s}
                    className={`esp-chip-btn ${selSchool === s ? 'active' : ''}`}
                    onClick={() => setSelSchool(s)}
                  >
                    {s} ({count})
                  </button>
                )
              })}
            </div>
          )}

          {/* Content state */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
              <div style={{ fontSize: '2rem', marginBottom: 12 }}>⏳</div>
              <p style={{ fontWeight: 600 }}>Loading school papers for {subjectName}…</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#dc2626' }}>
              <p style={{ fontWeight: 700 }}>Error loading papers: {error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: 20, border: '1.5px dashed #cbd5e1' }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>🏫</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1e293b', marginBottom: 8 }}>
                No School Papers Available Yet
              </h3>
              <p style={{ color: '#64748b', maxWidth: 450, margin: '0 auto 20px' }}>
                There are currently no school papers uploaded for {subjectName}. Check back soon or browse other subjects!
              </p>
              <Link
                to={grade === 'AL' && stream ? `/explore/al/${stream}` : `/explore/${grade.toLowerCase()}`}
                style={{
                  display: 'inline-block',
                  background: '#4527A0',
                  color: 'white',
                  padding: '10px 22px',
                  borderRadius: 50,
                  fontWeight: 700,
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                }}
              >
                ← Back to Subjects
              </Link>
            </div>
          ) : (
            <div className="esp-grid">
              {filtered.map(paper => (
                <div key={paper.id} className="esp-card">
                  <div className="esp-card-head">
                    <div className="esp-card-school">{paper.school_name}</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#4527A0' }}>
                      {paper.term}
                    </div>
                    <div className="esp-card-meta">
                      <span className="esp-chip" style={{ background: '#ede7f6', color: '#4527A0' }}>
                        📅 {paper.year}
                      </span>
                      <span className="esp-chip" style={{ background: '#e0f2fe', color: '#0369a1' }}>
                        🌐 {paper.medium}
                      </span>
                    </div>
                  </div>

                  <div className="esp-card-body">
                    <p style={{ color: '#64748b', fontSize: '0.86rem', margin: 0, lineHeight: 1.5 }}>
                      Authentic term evaluation paper for {subjectName}.
                    </p>

                    <div className="esp-card-actions">
                      {paper.pdfUrl ? (
                        <>
                          <button
                            className="esp-btn-preview"
                            onClick={() => setPreviewPaper(paper)}
                          >
                            👁 Preview
                          </button>
                          <a
                            href={paper.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="esp-btn-dl"
                          >
                            ⬇ Download
                          </a>
                        </>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '0.84rem', fontStyle: 'italic' }}>PDF not available</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* PDF Preview Modal */}
      {previewPaper && (
        <div className="esp-modal-overlay" onClick={() => setPreviewPaper(null)}>
          <div className="esp-modal" onClick={e => e.stopPropagation()}>
            <div className="esp-modal-head">
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  {previewPaper.school_name} — {previewPaper.term}
                </h3>
                <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  {subjectName} · {previewPaper.year} · {previewPaper.medium}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <a
                  href={previewPaper.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  style={{
                    background: '#4527A0',
                    color: 'white',
                    padding: '6px 14px',
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    textDecoration: 'none',
                  }}
                >
                  ⬇ Download
                </a>
                <button
                  onClick={() => setPreviewPaper(null)}
                  style={{
                    background: '#e2e8f0',
                    border: 'none',
                    borderRadius: 8,
                    padding: '6px 12px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="esp-modal-body">
              <iframe
                src={`${previewPaper.pdfUrl}#toolbar=1`}
                title={previewPaper.school_name}
                width="100%"
                height="100%"
                style={{ border: 'none' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
