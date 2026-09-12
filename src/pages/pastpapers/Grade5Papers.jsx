import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getExploreSubjects } from '../../api/api'

export default function Grade5Papers() {
  const [query, setQuery] = useState('')
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    getExploreSubjects('grade5')
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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#fff7f5 0%,#fff3f0 40%,#fff8f5 100%)', paddingTop: 88 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .g5-root { font-family:'Plus Jakarta Sans',sans-serif; }

        /* Breadcrumb */
        .g5-bread {
          background:rgba(255,255,255,0.88);backdrop-filter:blur(12px);
          border-bottom:1px solid rgba(230,74,25,0.12);padding:12px 0;
          position:sticky;top:88px;z-index:10;
        }
        .g5-bread-inner {
          max-width:1140px;margin:0 auto;padding:0 24px;
          display:flex;align-items:center;gap:8px;font-size:0.85rem;
        }
        .g5-bread a { color:#E64A19;font-weight:600;text-decoration:none;transition:color 0.18s; }
        .g5-bread a:hover { color:#BF360C; }
        .g5-bread-sep { color:#94a3b8; }
        .g5-bread-cur { color:#475569;font-weight:600; }

        /* Hero */
        .g5-hero {
          background:linear-gradient(135deg,#BF360C 0%,#E64A19 55%,#FF5722 100%);
          padding:56px 24px 64px;text-align:center;
          position:relative;overflow:hidden;
        }
        .g5-hero::before {
          content:'';position:absolute;inset:0;
          background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .g5-hero-badge {
          display:inline-flex;align-items:center;gap:7px;
          background:rgba(255,255,255,0.14);border:1.5px solid rgba(255,255,255,0.28);
          color:white;font-size:0.8rem;font-weight:700;padding:7px 20px;
          border-radius:50px;margin-bottom:16px;position:relative;backdrop-filter:blur(8px);
        }
        .g5-hero h1 {
          font-family:'Nunito',sans-serif;
          font-size:clamp(1.9rem,4.5vw,3rem);font-weight:900;
          color:white;margin:0 0 10px;position:relative;
        }
        .g5-hero p {
          color:rgba(255,255,255,0.88);font-size:0.98rem;
          max-width:520px;margin:0 auto 28px;position:relative;line-height:1.6;
        }

        /* Search */
        .g5-search-wrap { position:relative;max-width:440px;margin:0 auto; }
        .g5-search-icon {
          position:absolute;left:18px;top:50%;transform:translateY(-50%);
          font-size:1rem;pointer-events:none;opacity:0.8;
        }
        .g5-search {
          width:100%;padding:14px 44px 14px 48px;
          border-radius:50px;border:2px solid rgba(255,255,255,0.25);
          background:rgba(255,255,255,0.18);backdrop-filter:blur(10px);
          color:white;font-size:0.95rem;font-family:'Plus Jakarta Sans',sans-serif;
          outline:none;box-sizing:border-box;
          transition:border-color 0.2s,background 0.2s,box-shadow 0.2s;
        }
        .g5-search::placeholder { color:rgba(255,255,255,0.7); }
        .g5-search:focus {
          border-color:rgba(255,255,255,0.65);
          background:rgba(255,255,255,0.28);
          box-shadow:0 6px 20px rgba(0,0,0,0.12);
        }
        .g5-clear-btn {
          position:absolute;right:14px;top:50%;transform:translateY(-50%);
          border:none;background:rgba(255,255,255,0.25);color:white;
          width:22px;height:22px;border-radius:50%;font-size:0.75rem;
          display:flex;align-items:center;justify-content:center;
          cursor:pointer;transition:background 0.18s;
        }
        .g5-clear-btn:hover { background:rgba(255,255,255,0.4); }

        /* Body */
        .g5-body { max-width:900px;margin:0 auto;padding:48px 24px 80px; }
        .g5-count-row {
          display:flex;align-items:center;justify-content:space-between;
          margin-bottom:24px;flex-wrap:wrap;gap:12px;
        }
        .g5-count-h {
          font-family:'Nunito',sans-serif;font-size:1.4rem;font-weight:800;color:#3D1200;
        }
        .g5-count-badge {
          font-size:0.82rem;font-weight:700;color:#BF360C;
          background:#fff0ec;padding:5px 16px;border-radius:50px;
          border:1px solid #fed7ca;
        }

        /* Grid */
        .g5-grid {
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(240px,1fr));
          gap:20px;
        }
        .g5-card {
          background:white;border-radius:20px;
          border:1.5px solid #fed7ca;
          box-shadow:0 4px 20px rgba(230,74,25,0.08);
          padding:28px 22px;text-decoration:none;color:inherit;
          display:flex;flex-direction:column;
          transition:transform 0.24s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.24s,border-color 0.2s;
        }
        .g5-card:focus-visible {
          outline:3px solid #BF360C;outline-offset:2px;
        }
        .g5-card:hover {
          transform:translateY(-6px);
          box-shadow:0 16px 36px rgba(230,74,25,0.16);
          border-color:#fb923c;
        }
        .g5-card-icon {
          font-size:2.6rem;margin-bottom:14px;display:inline-block;
          filter:drop-shadow(0 2px 8px rgba(230,74,25,0.15));
          transition:transform 0.2s;
        }
        .g5-card:hover .g5-card-icon { transform:scale(1.1); }
        .g5-card-name {
          font-size:1.05rem;font-weight:700;color:#3D1200;
          margin-bottom:16px;line-height:1.35;
        }
        .g5-card-foot {
          display:flex;align-items:center;justify-content:space-between;margin-top:auto;
        }
        .g5-chip {
          font-size:0.76rem;font-weight:700;
          color:#BF360C;background:#fff0ec;
          padding:4px 12px;border-radius:50px;
          border:1px solid #fed7ca;
        }
        .g5-card-arrow {
          width:32px;height:32px;border-radius:50%;
          background:#E64A19;color:white;
          display:flex;align-items:center;justify-content:center;
          font-size:0.85rem;transition:background 0.18s,transform 0.18s;
        }
        .g5-card:hover .g5-card-arrow { background:#BF360C;transform:translateX(4px); }

        /* Empty state */
        .g5-empty {
          text-align:center;padding:56px 24px;color:#7A3A2A;
          font-size:0.95rem;grid-column:1/-1;background:white;
          border-radius:20px;border:1px dashed #fed7ca;
        }
        .g5-empty-icon { font-size:2.8rem;margin-bottom:12px;display:block; }
        .g5-reset-btn {
          margin-top:16px;background:#BF360C;color:white;border:none;
          padding:8px 20px;border-radius:50px;font-size:0.82rem;font-weight:700;
          cursor:pointer;transition:opacity 0.18s;
        }
        .g5-reset-btn:hover { opacity:0.88; }

        /* Info Banner */
        .g5-info {
          margin-top:40px;padding:20px 24px;
          background:linear-gradient(135deg,#fff7f5,#fff0ec);
          border:1.5px solid #fed7ca;border-radius:16px;
          display:flex;align-items:flex-start;gap:14px;
        }
        .g5-info-icon { font-size:1.5rem;margin-top:2px; }
        .g5-info-text { font-size:0.88rem;color:#7A3A2A;line-height:1.65; }
        .g5-info-text strong { color:#BF360C; }

        @media(max-width:640px) {
          .g5-grid { grid-template-columns:1fr; }
          .g5-hero { padding:40px 16px 48px; }
        }
      `}</style>

      <div className="g5-root">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="g5-bread">
          <div className="g5-bread-inner">
            <Link to="/explore/past-papers">📄 Past Papers</Link>
            <span className="g5-bread-sep">›</span>
            <span className="g5-bread-cur">Grade 5 Scholarship</span>
          </div>
        </nav>

        {/* Hero */}
        <header className="g5-hero">
          <div className="g5-hero-badge">⭐ Grade 5 Scholarship</div>
          <h1>Grade 5 Scholarship Past Papers</h1>
          <p>Find past papers for all Grade 5 Scholarship subjects. Choose a subject below to start practicing.</p>
          
          <div className="g5-search-wrap">
            <span className="g5-search-icon">🔍</span>
            <input
              className="g5-search"
              placeholder="Search Grade 5 subjects…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Search Grade 5 subjects"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="g5-clear-btn"
                title="Clear search"
                aria-label="Clear search input"
              >
                ✕
              </button>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="g5-body">
          <div className="g5-count-row">
            <h2 className="g5-count-h">Select a Subject</h2>
            <div className="g5-count-badge">
              {filtered.length} {filtered.length === 1 ? 'subject' : 'subjects'}
            </div>
          </div>

          <div className="g5-grid">
            {loading ? (
              <div className="g5-empty">
                <span className="g5-empty-icon">⏳</span>
                <div>Loading subjects…</div>
              </div>
            ) : error ? (
              <div className="g5-empty">
                <span className="g5-empty-icon">⚠️</span>
                <div>Couldn't load subjects. {error}</div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="g5-empty">
                <span className="g5-empty-icon">🔎</span>
                <div>No subjects found matching "<strong>{query}</strong>"</div>
                <button
                  onClick={() => setQuery('')}
                  className="g5-reset-btn"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              filtered.map(s => (
                <Link
                  key={s.id}
                  to={`/explore/past-papers/grade5/${s.id}`}
                  state={{ subjectName: s.name, grade: 'Grade5' }}
                  className="g5-card"
                >
                  <span className="g5-card-icon">{s.icon || '⭐'}</span>
                  <div className="g5-card-name">{s.name}</div>
                  <div className="g5-card-foot">
                    <span className="g5-chip">{s.paperCount} Papers</span>
                    <div className="g5-card-arrow">→</div>
                  </div>
                </Link>
              ))
            )}
          </div>

          <div className="g5-info">
            <div className="g5-info-icon">💡</div>
            <div className="g5-info-text">
              <strong>Tip:</strong> Each paper can be filtered by Medium (Sinhala / English / Tamil),
              Year, and Paper Part. Use the filters on the next page to find exactly what you need.
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}