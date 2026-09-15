import React, { useState, useEffect, useMemo } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { getExploreNotes } from '../api/api'

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
  science:  { color: '#B71C1C', bg: '#fbe9e7', gradient: 'linear-gradient(135deg,#B71C1C,#D32F2F)' },
  commerce: { color: '#6A1B9A', bg: '#f3e5f5', gradient: 'linear-gradient(135deg,#4A148C,#7B1FA2)' },
  arts:     { color: '#BF360C', bg: '#fbe9e7', gradient: 'linear-gradient(135deg,#870000,#D84315)' },
  tech:     { color: '#1B5E20', bg: '#e8f5e9', gradient: 'linear-gradient(135deg,#0d3810,#2E7D32)' },
}

const GRADE_META = {
  OL:     { label: 'O/L',                color: '#B71C1C', gradient: 'linear-gradient(135deg,#B71C1C,#D32F2F)', bg: '#fbe9e7' },
  AL:     { label: 'A/L',                color: '#B71C1C', gradient: 'linear-gradient(135deg,#B71C1C,#D32F2F)', bg: '#fbe9e7' },
  Grade5: { label: 'Grade 5 Scholarship', color: '#BF360C', gradient: 'linear-gradient(135deg,#870000,#D84315)', bg: '#fbe9e7' },
}

const GRADE_ID = { OL: 'ol', AL: 'al', Grade5: 'grade5' }

const NOTE_TYPES = ['All', 'Full Notes', 'Summary', 'Short Notes', 'Revision', 'Cheat Sheet']

export default function ExploreNotes({ grade = 'AL' }) {
  const { stream, subject } = useParams()
  const location = useLocation()

  const subjectKey = subject || ''
  const subjectName = location.state?.subjectName || SUBJECT_LABELS[subjectKey] || subjectKey
  const streamName  = stream ? (STREAM_LABELS[stream] || stream) : null
  const gradeMeta   = GRADE_META[grade] || GRADE_META.AL
  const streamMeta  = stream ? (STREAM_META[stream] || STREAM_META.science) : null
  const heroGradient = streamMeta ? streamMeta.gradient : gradeMeta.gradient
  const heroColor    = streamMeta ? streamMeta.color    : gradeMeta.color

  const [selType, setSelType] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const [previewNote, setPreviewNote] = useState(null)
  const [allNotes, setAllNotes] = useState([])
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

    getExploreNotes(gradeId, subjectKey, grade === 'AL' ? stream : undefined)
      .then(res => { if (!cancelled) setAllNotes(res.data) })
      .catch(err => { if (!cancelled) setError(err.response?.data?.detail || err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [gradeId, subjectKey, stream, grade])

  const filtered = useMemo(() => {
    return allNotes.filter(n => {
      if (selType !== 'All' && n.note_type !== selType) return false
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase()
        const matches = (n.title || '').toLowerCase().includes(q) ||
                        (n.note_type || '').toLowerCase().includes(q) ||
                        (n.description || '').toLowerCase().includes(q)
        if (!matches) return false
      }
      return true
    })
  }, [allNotes, selType, searchQuery])

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
    { label: '📒 Notes & Guides', to: null }
  ]

  if (!subjectKey) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fff8e1 0%, #fce4ec 30%, #e8eaf6 100%)', paddingTop: 88 }}>
        <div style={{ maxWidth: 800, margin: '60px auto', padding: '0 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>📒</div>
          <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '2.4rem', fontWeight: 900, color: '#B71C1C', marginBottom: 16 }}>
            Browse Study Notes &amp; Revision Guides
          </h1>
          <p style={{ color: '#C62828', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: 32 }}>
            Please select your grade and subject to download comprehensive notes, chapter summaries, and formula sheets.
          </p>
          <Link
            to="/explore"
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #B71C1C, #D32F2F)',
              color: 'white',
              padding: '14px 32px',
              borderRadius: 50,
              fontWeight: 800,
              textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(183,28,28,0.3)',
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
        .en-root { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        .en-bread {
          background: rgba(255,255,255,0.9); backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(0,0,0,0.07); padding: 12px 0;
          position: sticky; top: 88px; z-index: 10;
        }
        .en-bread-inner {
          max-width: 1260px; margin: 0 auto; padding: 0 24px;
          display: flex; align-items: center; gap: 8px; font-size: 0.85rem; flex-wrap: wrap;
        }
        .en-bread a { font-weight: 600; text-decoration: none; color: ${heroColor}; }
        .en-bread a:hover { opacity: 0.7; }
        .en-bread-sep { color: #94a3b8; }
        .en-bread-cur { color: #475569; font-weight: 700; }

        .en-hero {
          background: ${heroGradient};
          padding: 48px 24px; position: relative; overflow: hidden; color: white;
        }
        .en-hero-inner { max-width: 1260px; margin: 0 auto; position: relative; z-index: 1; }
        .en-hero-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.3);
          color: white; font-size: 0.82rem; font-weight: 700;
          padding: 5px 14px; border-radius: 50px; margin-bottom: 14px;
        }
        .en-hero-title {
          font-family: 'Nunito', sans-serif; font-size: clamp(1.8rem, 4vw, 2.6rem);
          font-weight: 900; margin: 0 0 10px;
        }
        .en-hero-sub {
          color: rgba(255,255,255,0.88); font-size: 1rem; margin: 0;
        }

        .en-body { max-width: 1260px; margin: 0 auto; padding: 36px 24px 64px; }

        .en-filters {
          background: white; border-radius: 16px; padding: 18px 22px;
          border: 1px solid #e2e8f0; box-shadow: 0 2px 10px rgba(0,0,0,0.03);
          display: flex; flex-wrap: wrap; gap: 16px; align-items: center; justify-content: space-between;
          margin-bottom: 24px;
        }
        .en-filter-group { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
        .en-type-btn {
          padding: 7px 16px; border-radius: 50px; font-size: 0.84rem; font-weight: 700;
          border: 1.5px solid #fee2e2; background: white; color: #B71C1C; cursor: pointer;
          transition: all 0.16s;
        }
        .en-type-btn:hover, .en-type-btn.active {
          background: #B71C1C; color: white; border-color: #B71C1C;
        }
        .en-search {
          padding: 8px 16px; border-radius: 10px; border: 1.5px solid #cbd5e1;
          font-size: 0.86rem; width: 220px; outline: none;
        }

        .en-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 22px;
        }
        .en-card {
          background: white; border-radius: 18px; border: 1.5px solid #e2e8f0;
          box-shadow: 0 4px 18px rgba(183,28,28,0.06); overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          display: flex; flex-direction: column;
        }
        .en-card:hover {
          transform: translateY(-4px); box-shadow: 0 12px 30px rgba(183,28,28,0.12);
        }
        .en-card-head {
          padding: 20px 22px 14px; background: #fffdfd; border-bottom: 1px solid #f1f5f9;
        }
        .en-card-title { font-size: 1.12rem; font-weight: 800; color: #0f172a; margin-bottom: 6px; }
        .en-card-meta { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-top: 8px; }
        .en-chip {
          font-size: 0.76rem; font-weight: 700; padding: 3px 10px; border-radius: 50px;
        }
        .en-card-body { padding: 18px 22px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
        .en-card-desc { color: #64748b; font-size: 0.86rem; margin: 0 0 14px; line-height: 1.5; }
        .en-card-actions { display: flex; gap: 10px; margin-top: 18px; }
        .en-btn-preview {
          flex: 1; padding: 9px 16px; border-radius: 10px; font-weight: 700; font-size: 0.86rem;
          background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; cursor: pointer;
          text-align: center; transition: all 0.16s;
        }
        .en-btn-preview:hover { background: #e2e8f0; }
        .en-btn-dl {
          flex: 1; padding: 9px 16px; border-radius: 10px; font-weight: 700; font-size: 0.86rem;
          background: linear-gradient(135deg, #B71C1C, #D32F2F); color: white;
          text-decoration: none; text-align: center; transition: opacity 0.16s;
          display: inline-flex; align-items: center; justify-content: center; gap: 5px;
        }
        .en-btn-dl:hover { opacity: 0.92; }

        /* PDF Preview Modal */
        .en-modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.65); backdrop-filter: blur(6px);
          z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px;
        }
        .en-modal {
          background: white; width: 100%; max-width: 900px; height: 85vh; border-radius: 20px;
          display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,0.3);
        }
        .en-modal-head {
          padding: 16px 24px; border-bottom: 1px solid #e2e8f0; display: flex;
          align-items: center; justify-content: space-between; background: #f8fafc;
        }
        .en-modal-body { flex: 1; background: #334155; }
      `}</style>

      <div className="en-root">
        {/* Breadcrumbs */}
        <nav className="en-bread">
          <div className="en-bread-inner">
            {breadcrumbs.map((b, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="en-bread-sep">›</span>}
                {b.to ? (
                  <Link to={b.to}>{b.label}</Link>
                ) : (
                  <span className="en-bread-cur">{b.label}</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </nav>

        {/* Hero */}
        <div className="en-hero">
          <div className="en-hero-inner">
            <div className="en-hero-badge">📒 Study Notes · {gradeMeta.label}</div>
            <h1 className="en-hero-title">{subjectName} Notes &amp; Study Guides</h1>
            <p className="en-hero-sub">
              Summaries, revision sheets, and full chapter notes to help you master {subjectName}.
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="en-body">
          {/* Filter Bar */}
          <div className="en-filters">
            <div className="en-filter-group">
              {NOTE_TYPES.map(t => (
                <button
                  key={t}
                  className={`en-type-btn ${selType === t ? 'active' : ''}`}
                  onClick={() => setSelType(t)}
                >
                  {t === 'All' ? '📑 All Types' : t}
                </button>
              ))}
            </div>

            <div className="en-filter-group">
              <input
                type="text"
                className="en-search"
                placeholder="Search notes, chapters..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Content state */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
              <div style={{ fontSize: '2rem', marginBottom: 12 }}>⏳</div>
              <p style={{ fontWeight: 600 }}>Loading notes for {subjectName}…</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#dc2626' }}>
              <p style={{ fontWeight: 700 }}>Error loading notes: {error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: 20, border: '1.5px dashed #cbd5e1' }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>📒</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1e293b', marginBottom: 8 }}>
                No Notes Available Yet
              </h3>
              <p style={{ color: '#64748b', maxWidth: 450, margin: '0 auto 20px' }}>
                There are currently no notes uploaded for {subjectName}. Check back soon or browse other subjects!
              </p>
              <Link
                to={grade === 'AL' && stream ? `/explore/al/${stream}` : `/explore/${grade.toLowerCase()}`}
                style={{
                  display: 'inline-block',
                  background: '#B71C1C',
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
            <div className="en-grid">
              {filtered.map(note => (
                <div key={note.id} className="en-card">
                  <div className="en-card-head">
                    <div className="en-card-title">{note.title}</div>
                    <div className="en-card-meta">
                      <span className="en-chip" style={{ background: '#fee2e2', color: '#B71C1C' }}>
                        🏷 {note.note_type}
                      </span>
                      {note.page_count > 0 && (
                        <span className="en-chip" style={{ background: '#f1f5f9', color: '#475569' }}>
                          📄 {note.page_count} Pages
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="en-card-body">
                    {note.description ? (
                      <p className="en-card-desc">{note.description}</p>
                    ) : (
                      <p className="en-card-desc" style={{ fontStyle: 'italic', opacity: 0.7 }}>
                        Comprehensive study guide for {subjectName}.
                      </p>
                    )}

                    <div className="en-card-actions">
                      {note.pdfUrl ? (
                        <>
                          <button
                            className="en-btn-preview"
                            onClick={() => setPreviewNote(note)}
                          >
                            👁 Preview
                          </button>
                          <a
                            href={note.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="en-btn-dl"
                          >
                            ⬇ Download
                          </a>
                        </>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '0.84rem', fontStyle: 'italic' }}>File not available</span>
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
      {previewNote && (
        <div className="en-modal-overlay" onClick={() => setPreviewNote(null)}>
          <div className="en-modal" onClick={e => e.stopPropagation()}>
            <div className="en-modal-head">
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  {previewNote.title}
                </h3>
                <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  {subjectName} · {previewNote.note_type} {previewNote.page_count ? `(${previewNote.page_count} pages)` : ''}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <a
                  href={previewNote.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  style={{
                    background: '#B71C1C',
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
                  onClick={() => setPreviewNote(null)}
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
            <div className="en-modal-body">
              <iframe
                src={`${previewNote.pdfUrl}#toolbar=1`}
                title={previewNote.title}
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
