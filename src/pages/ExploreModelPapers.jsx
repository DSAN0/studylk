import React, { useState, useEffect, useMemo } from 'react'
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom'
import { getExploreModelPapers } from '../api/api'

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
  science:  { color: '#00695C', bg: '#e0f2f1', gradient: 'linear-gradient(135deg,#004D40,#00796B)' },
  commerce: { color: '#6A1B9A', bg: '#f3e5f5', gradient: 'linear-gradient(135deg,#4A148C,#7B1FA2)' },
  arts:     { color: '#BF360C', bg: '#fbe9e7', gradient: 'linear-gradient(135deg,#870000,#D84315)' },
  tech:     { color: '#1B5E20', bg: '#e8f5e9', gradient: 'linear-gradient(135deg,#0d3810,#2E7D32)' },
}

const GRADE_META = {
  OL:     { label: 'O/L',                color: '#00695C', gradient: 'linear-gradient(135deg,#004D40,#00796B)', bg: '#e0f2f1' },
  AL:     { label: 'A/L',                color: '#00796B', gradient: 'linear-gradient(135deg,#004D40,#00695C)', bg: '#e0f2f1' },
  Grade5: { label: 'Grade 5 Scholarship', color: '#BF360C', gradient: 'linear-gradient(135deg,#870000,#D84315)', bg: '#fbe9e7' },
}

const GRADE_ID = { OL: 'ol', AL: 'al', Grade5: 'grade5' }
const DIFF_BG = { Easy: '#E8F5E9', Medium: '#FFF3E0', Hard: '#FFEBEE' }
const DIFF_COLOR = { Easy: '#2E7D32', Medium: '#E65100', Hard: '#C62828' }

export default function ExploreModelPapers({ grade = 'AL' }) {
  const { stream, subject } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const subjectKey = subject || ''
  const subjectName = location.state?.subjectName || SUBJECT_LABELS[subjectKey] || subjectKey
  const streamName  = stream ? (STREAM_LABELS[stream] || stream) : null
  const gradeMeta   = GRADE_META[grade] || GRADE_META.AL
  const streamMeta  = stream ? (STREAM_META[stream] || STREAM_META.science) : null
  const heroGradient = streamMeta ? streamMeta.gradient : gradeMeta.gradient
  const heroColor    = streamMeta ? streamMeta.color    : gradeMeta.color

  const [selMedium, setSelMedium] = useState('All')
  const [selDifficulty, setSelDifficulty] = useState('All')
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

    getExploreModelPapers(gradeId, subjectKey, grade === 'AL' ? stream : undefined)
      .then(res => { if (!cancelled) setAllPapers(res.data) })
      .catch(err => { if (!cancelled) setError(err.response?.data?.detail || err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [gradeId, subjectKey, stream, grade])

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
      if (selMedium !== 'All' && p.medium !== selMedium) return false
      if (selDifficulty !== 'All' && p.difficulty !== selDifficulty) return false
      if (selYear   !== 'All' && p.year !== Number(selYear)) return false
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase()
        const matches = (p.title || '').toLowerCase().includes(q) ||
                        p.year.toString().includes(q) ||
                        p.medium.toLowerCase().includes(q) ||
                        p.difficulty.toLowerCase().includes(q)
        if (!matches) return false
      }
      return true
    })

    return result.sort((a, b) => sortOrder === 'newest' ? b.year - a.year : a.year - b.year)
  }, [allPapers, selMedium, selDifficulty, selYear, searchQuery, sortOrder])

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
    { label: '📝 Model Papers', to: null }
  ]

  // If accessed directly with no subject selected, prompt student
  if (!subjectKey) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0faf0 0%, #e8f5e9 50%, #f1f8e9 100%)', paddingTop: 88 }}>
        <div style={{ maxWidth: 800, margin: '60px auto', padding: '0 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>📝</div>
          <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '2.4rem', fontWeight: 900, color: '#004D40', marginBottom: 16 }}>
            Browse Model Examination Papers
          </h1>
          <p style={{ color: '#4A6A4A', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: 32 }}>
            Please select your grade and subject to view relevant model papers prepared by expert educators.
          </p>
          <Link
            to="/explore"
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #00796B, #004D40)',
              color: 'white',
              padding: '14px 32px',
              borderRadius: 50,
              fontWeight: 800,
              textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(0,105,92,0.3)',
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
        .emp-root { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        .emp-bread {
          background: rgba(255,255,255,0.9); backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(0,0,0,0.07); padding: 12px 0;
          position: sticky; top: 88px; z-index: 10;
        }
        .emp-bread-inner {
          max-width: 1260px; margin: 0 auto; padding: 0 24px;
          display: flex; align-items: center; gap: 8px; font-size: 0.85rem; flex-wrap: wrap;
        }
        .emp-bread a { font-weight: 600; text-decoration: none; color: ${heroColor}; }
        .emp-bread a:hover { opacity: 0.7; }
        .emp-bread-sep { color: #94a3b8; }
        .emp-bread-cur { color: #475569; font-weight: 700; }

        .emp-hero {
          background: ${heroGradient};
          padding: 48px 24px; position: relative; overflow: hidden; color: white;
        }
        .emp-hero-inner { max-width: 1260px; margin: 0 auto; position: relative; z-index: 1; }
        .emp-hero-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.3);
          color: white; font-size: 0.82rem; font-weight: 700;
          padding: 5px 14px; border-radius: 50px; margin-bottom: 14px;
        }
        .emp-hero-title {
          font-family: 'Nunito', sans-serif; font-size: clamp(1.8rem, 4vw, 2.6rem);
          font-weight: 900; margin: 0 0 10px;
        }
        .emp-hero-sub {
          color: rgba(255,255,255,0.88); font-size: 1rem; margin: 0;
        }

        .emp-body { max-width: 1260px; margin: 0 auto; padding: 36px 24px 64px; }

        .emp-filters {
          background: white; border-radius: 16px; padding: 18px 22px;
          border: 1px solid #e2e8f0; box-shadow: 0 2px 10px rgba(0,0,0,0.03);
          display: flex; flex-wrap: wrap; gap: 16px; align-items: center; justify-content: space-between;
          margin-bottom: 30px;
        }
        .emp-filter-group { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
        .emp-select {
          padding: 8px 14px; border-radius: 10px; border: 1.5px solid #cbd5e1;
          font-size: 0.86rem; font-weight: 600; color: #334155; outline: none;
          background: white; cursor: pointer;
        }
        .emp-search {
          padding: 8px 16px; border-radius: 10px; border: 1.5px solid #cbd5e1;
          font-size: 0.86rem; width: 220px; outline: none;
        }

        .emp-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 22px;
        }
        .emp-card {
          background: white; border-radius: 18px; border: 1.5px solid #e2e8f0;
          box-shadow: 0 4px 18px rgba(0,105,92,0.06); overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          display: flex; flex-direction: column;
        }
        .emp-card:hover {
          transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,105,92,0.12);
        }
        .emp-card-head {
          padding: 20px 22px 14px; background: #f8fafc; border-bottom: 1px solid #f1f5f9;
          display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;
        }
        .emp-card-title { font-size: 1.08rem; font-weight: 800; color: #0f172a; margin-bottom: 6px; }
        .emp-card-meta { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
        .emp-chip {
          font-size: 0.76rem; font-weight: 700; padding: 3px 10px; border-radius: 50px;
        }
        .emp-card-body { padding: 18px 22px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
        .emp-card-actions { display: flex; gap: 10px; margin-top: 18px; }
        .emp-btn-preview {
          flex: 1; padding: 9px 16px; border-radius: 10px; font-weight: 700; font-size: 0.86rem;
          background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; cursor: pointer;
          text-align: center; transition: all 0.16s;
        }
        .emp-btn-preview:hover { background: #e2e8f0; }
        .emp-btn-dl {
          flex: 1; padding: 9px 16px; border-radius: 10px; font-weight: 700; font-size: 0.86rem;
          background: linear-gradient(135deg, #00796B, #004D40); color: white;
          text-decoration: none; text-align: center; transition: opacity 0.16s;
          display: inline-flex; align-items: center; justify-content: center; gap: 5px;
        }
        .emp-btn-dl:hover { opacity: 0.92; }

        /* PDF Preview Modal */
        .emp-modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.65); backdrop-filter: blur(6px);
          z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px;
        }
        .emp-modal {
          background: white; width: 100%; max-width: 900px; height: 85vh; border-radius: 20px;
          display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,0.3);
        }
        .emp-modal-head {
          padding: 16px 24px; border-bottom: 1px solid #e2e8f0; display: flex;
          align-items: center; justify-content: space-between; background: #f8fafc;
        }
        .emp-modal-body { flex: 1; background: #334155; }
      `}</style>

      <div className="emp-root">
        {/* Breadcrumbs */}
        <nav className="emp-bread">
          <div className="emp-bread-inner">
            {breadcrumbs.map((b, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="emp-bread-sep">›</span>}
                {b.to ? (
                  <Link to={b.to}>{b.label}</Link>
                ) : (
                  <span className="emp-bread-cur">{b.label}</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </nav>

        {/* Hero */}
        <div className="emp-hero">
          <div className="emp-hero-inner">
            <div className="emp-hero-badge">📝 Model Papers · {gradeMeta.label}</div>
            <h1 className="emp-hero-title">{subjectName} Model Papers</h1>
            <p className="emp-hero-sub">
              Expert-crafted model examination papers designed to match Sri Lankan syllabus and current exam patterns.
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="emp-body">
          {/* Filter Bar */}
          <div className="emp-filters">
            <div className="emp-filter-group">
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#64748b' }}>Filters:</label>
              <select className="emp-select" value={selMedium} onChange={e => setSelMedium(e.target.value)}>
                <option value="All">All Mediums</option>
                {MEDIUMS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>

              <select className="emp-select" value={selDifficulty} onChange={e => setSelDifficulty(e.target.value)}>
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              {YEARS.length > 0 && (
                <select className="emp-select" value={selYear} onChange={e => setSelYear(e.target.value)}>
                  <option value="All">All Years</option>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              )}
            </div>

            <div className="emp-filter-group">
              <input
                type="text"
                className="emp-search"
                placeholder="Search title, year..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <select className="emp-select" value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Content state */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
              <div style={{ fontSize: '2rem', marginBottom: 12 }}>⏳</div>
              <p style={{ fontWeight: 600 }}>Loading model papers for {subjectName}…</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#dc2626' }}>
              <p style={{ fontWeight: 700 }}>Error loading papers: {error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: 20, border: '1.5px dashed #cbd5e1' }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>📝</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1e293b', marginBottom: 8 }}>
                No Model Papers Available Yet
              </h3>
              <p style={{ color: '#64748b', maxWidth: 450, margin: '0 auto 20px' }}>
                There are currently no model papers uploaded for {subjectName}. Check back soon or browse other subjects!
              </p>
              <Link
                to={grade === 'AL' && stream ? `/explore/al/${stream}` : `/explore/${grade.toLowerCase()}`}
                style={{
                  display: 'inline-block',
                  background: '#00695C',
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
            <div className="emp-grid">
              {filtered.map(paper => (
                <div key={paper.id} className="emp-card">
                  <div className="emp-card-head">
                    <div>
                      <div className="emp-card-title">{paper.title}</div>
                      <div className="emp-card-meta">
                        <span className="emp-chip" style={{ background: DIFF_BG[paper.difficulty] || '#f1f5f9', color: DIFF_COLOR[paper.difficulty] || '#475569' }}>
                          🎯 {paper.difficulty}
                        </span>
                        <span className="emp-chip" style={{ background: '#e0f2fe', color: '#0369a1' }}>
                          🌐 {paper.medium}
                        </span>
                        <span className="emp-chip" style={{ background: '#fef3c7', color: '#92400e' }}>
                          📅 {paper.year}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="emp-card-body">
                    <p style={{ color: '#64748b', fontSize: '0.86rem', margin: 0, lineHeight: 1.5 }}>
                      Practice with full questions &amp; marking standards for {subjectName}.
                    </p>

                    <div className="emp-card-actions">
                      {paper.pdfUrl ? (
                        <>
                          <button
                            className="emp-btn-preview"
                            onClick={() => setPreviewPaper(paper)}
                          >
                            👁 Preview
                          </button>
                          <a
                            href={paper.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="emp-btn-dl"
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
        <div className="emp-modal-overlay" onClick={() => setPreviewPaper(null)}>
          <div className="emp-modal" onClick={e => e.stopPropagation()}>
            <div className="emp-modal-head">
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  {previewPaper.title}
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
                    background: '#00695C',
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
            <div className="emp-modal-body">
              <iframe
                src={`${previewPaper.pdfUrl}#toolbar=1`}
                title={previewPaper.title}
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
