import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getExploreSubjects } from '../../api/api'

export default function OLPapers() {
  const [query, setQuery] = useState('')
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    getExploreSubjects('ol')
      .then(res => { if (!cancelled) setSubjects(res.data) })
      .catch(err => { if (!cancelled) setError(err.response?.data?.detail || err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [])

  const filtered = useMemo(() => {
    return subjects.filter(s =>
      s.name.toLowerCase().includes(query.toLowerCase())
    )
  }, [subjects, query])

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#eff6ff 0%,#e8f4ff 40%,#f0f7ff 100%)', paddingTop: 88 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .ol-root { font-family:'Plus Jakarta Sans',sans-serif; }

        /* Breadcrumb */
        .ol-bread {
          background:rgba(255,255,255,0.85);backdrop-filter:blur(12px);
          border-bottom:1px solid rgba(21,101,192,0.12);
          padding:12px 0;position:sticky;top:88px;z-index:10;
        }
        .ol-bread-inner {
          max-width:1140px;margin:0 auto;padding:0 24px;
          display:flex;align-items:center;gap:8px;
          font-size:0.85rem;
        }
        .ol-bread a {
          color:#1565C0;font-weight:600;text-decoration:none;
          transition:color 0.18s;
        }
        .ol-bread a:hover { color:#0D47A1; }
        .ol-bread-sep { color:#94a3b8; }
        .ol-bread-cur { color:#475569;font-weight:600; }

        /* Hero */
        .ol-hero {
          background:linear-gradient(135deg,#0D47A1 0%,#1565C0 55%,#1976D2 100%);
          padding:56px 24px 64px;text-align:center;
          position:relative;overflow:hidden;
        }
        .ol-hero::before {
          content:'';position:absolute;inset:0;
          background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .ol-hero-badge {
          display:inline-flex;align-items:center;gap:7px;
          background:rgba(255,255,255,0.14);border:1.5px solid rgba(255,255,255,0.28);
          color:white;font-size:0.8rem;font-weight:700;padding:7px 20px;
          border-radius:50px;margin-bottom:16px;position:relative;
          backdrop-filter:blur(8px);
        }
        .ol-hero h1 {
          font-family:'Nunito',sans-serif;
          font-size:clamp(1.9rem,4.5vw,3rem);font-weight:900;
          color:white;margin:0 0 10px;position:relative;
        }
        .ol-hero p {
          color:rgba(255,255,255,0.85);font-size:0.98rem;
          max-width:520px;margin:0 auto 28px;position:relative;line-height:1.6;
        }

        /* Search */
        .ol-search-wrap {
          position:relative;max-width:480px;margin:0 auto;
        }
        .ol-search-icon {
          position:absolute;left:18px;top:50%;transform:translateY(-50%);
          font-size:1rem;pointer-events:none;opacity:0.8;
        }
        .ol-search {
          width:100%;padding:14px 44px 14px 48px;
          border-radius:50px;border:2px solid rgba(255,255,255,0.25);
          background:rgba(255,255,255,0.18);backdrop-filter:blur(10px);
          color:white;font-size:0.95rem;font-family:'Plus Jakarta Sans',sans-serif;
          outline:none;box-sizing:border-box;
          transition:border-color 0.2s,background 0.2s,box-shadow 0.2s;
        }
        .ol-search::placeholder { color:rgba(255,255,255,0.7); }
        .ol-search:focus {
          border-color:rgba(255,255,255,0.65);
          background:rgba(255,255,255,0.28);
          box-shadow:0 6px 20px rgba(0,0,0,0.12);
        }
        .ol-clear-btn {
          position:absolute;right:14px;top:50%;transform:translateY(-50%);
          border:none;background:rgba(255,255,255,0.25);color:white;
          width:22px;height:22px;border-radius:50%;font-size:0.75rem;
          display:flex;align-items:center;justify-content:center;
          cursor:pointer;transition:background 0.18s;
        }
        .ol-clear-btn:hover { background:rgba(255,255,255,0.4); }

        /* Body */
        .ol-body { max-width:1140px;margin:0 auto;padding:48px 24px 80px; }
        .ol-count-row {
          display:flex;align-items:center;justify-content:space-between;
          margin-bottom:24px;flex-wrap:wrap;gap:12px;
        }
        .ol-count-h {
          font-family:'Nunito',sans-serif;font-size:1.4rem;font-weight:800;
          color:#1A2E50;
        }
        .ol-count-badge {
          font-size:0.82rem;font-weight:700;color:#1565C0;
          background:#e0ecff;padding:5px 16px;border-radius:50px;
        }

        /* Grid */
        .ol-grid {
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(250px,1fr));
          gap:20px;
        }
        .ol-card {
          background:white;border-radius:20px;
          border:1.5px solid #dbeafe;
          box-shadow:0 4px 20px rgba(21,101,192,0.07);
          padding:28px 24px;text-decoration:none;color:inherit;
          display:flex;flex-direction:column;
          transition:transform 0.24s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.24s,border-color 0.2s;
        }
        .ol-card:focus-visible {
          outline:3px solid #1565C0;outline-offset:2px;
        }
        .ol-card:hover {
          transform:translateY(-6px);
          box-shadow:0 16px 36px rgba(21,101,192,0.15);
          border-color:#93c5fd;
        }
        .ol-card-icon {
          font-size:2.4rem;margin-bottom:14px;display:inline-block;
          filter:drop-shadow(0 2px 8px rgba(21,101,192,0.12));
          transition:transform 0.2s;
        }
        .ol-card:hover .ol-card-icon { transform:scale(1.1); }
        .ol-card-name {
          font-size:1rem;font-weight:700;color:#1A2E50;
          margin-bottom:12px;line-height:1.35;
        }
        .ol-card-foot {
          display:flex;align-items:center;justify-content:space-between;
          margin-top:auto;
        }
        .ol-chip {
          font-size:0.76rem;font-weight:700;
          color:#1565C0;background:#eff6ff;
          padding:4px 12px;border-radius:50px;
          border:1px solid #bfdbfe;
        }
        .ol-card-arrow {
          width:32px;height:32px;border-radius:50%;
          background:#1565C0;color:white;
          display:flex;align-items:center;justify-content:center;
          font-size:0.85rem;
          transition:background 0.18s,transform 0.18s;
        }
        .ol-card:hover .ol-card-arrow { background:#0D47A1;transform:translateX(4px); }

        /* Empty State */
        .ol-empty {
          text-align:center;padding:56px 24px;color:#475569;
          font-size:0.95rem;grid-column:1/-1;background:white;
          border-radius:20px;border:1px dashed #bfdbfe;
        }
        .ol-empty-icon { font-size:2.8rem;margin-bottom:12px;display:block; }
        .ol-reset-btn {
          margin-top:16px;background:#1565C0;color:white;border:none;
          padding:8px 20px;border-radius:50px;font-size:0.82rem;font-weight:700;
          cursor:pointer;transition:background 0.18s;
        }
        .ol-reset-btn:hover { background:#0D47A1; }

        @media(max-width:640px) {
          .ol-grid { grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); }
          .ol-hero { padding:40px 16px 48px; }
        }
      `}</style>

      <div className="ol-root">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="ol-bread">
          <div className="ol-bread-inner">
            <Link to="/explore/past-papers">📄 Past Papers</Link>
            <span className="ol-bread-sep">›</span>
            <span className="ol-bread-cur">Ordinary Level (O/L)</span>
          </div>
        </nav>

        {/* Hero Banner */}
        <header className="ol-hero">
          <div className="ol-hero-badge">📘 Ordinary Level</div>
          <h1>O/L Past Papers</h1>
          <p>Choose a subject to explore past papers with your preferred medium, year, and paper part.</p>
          
          <div className="ol-search-wrap">
            <span className="ol-search-icon">🔍</span>
            <input
              className="ol-search"
              placeholder="Search Ordinary Level subjects…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Search Ordinary Level subjects"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="ol-clear-btn"
                title="Clear search"
                aria-label="Clear search input"
              >
                ✕
              </button>
            )}
          </div>
        </header>

        {/* Main Subjects Content */}
        <main className="ol-body">
          <div className="ol-count-row">
            <h2 className="ol-count-h">Select a Subject</h2>
            <div className="ol-count-badge">
              {filtered.length} {filtered.length === 1 ? 'subject' : 'subjects'}
            </div>
          </div>

          <div className="ol-grid">
            {loading ? (
              <div className="ol-empty">
                <span className="ol-empty-icon">⏳</span>
                <div>Loading subjects…</div>
              </div>
            ) : error ? (
              <div className="ol-empty">
                <span className="ol-empty-icon">⚠️</span>
                <div>Couldn't load subjects. {error}</div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="ol-empty">
                <span className="ol-empty-icon">🔎</span>
                <div>No subjects found matching "<strong>{query}</strong>"</div>
                <button
                  onClick={() => setQuery('')}
                  className="ol-reset-btn"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              filtered.map(s => (
                <Link
                  key={s.id}
                  to={`/explore/past-papers/ol/${s.id}`}
                  state={{ subjectName: s.name, grade: 'OL' }}
                  className="ol-card"
                >
                  <span className="ol-card-icon">{s.icon || '📘'}</span>
                  <div className="ol-card-name">{s.name}</div>
                  <div className="ol-card-foot">
                    <span className="ol-chip">{s.paperCount} Papers</span>
                    <div className="ol-card-arrow">→</div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  )
}