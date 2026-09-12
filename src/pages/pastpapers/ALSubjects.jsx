import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { getExploreSubjects } from '../../api/api'

const STREAM_META = {
  science: {
    name: 'Science',
    emoji: '🔬',
    color: '#1565C0',
    lightBg: '#eff6ff',
    border: '#bfdbfe',
    chip: '#1565C0',
    chipBg: '#eff6ff',
    gradient: 'linear-gradient(135deg,#0D47A1 0%,#1565C0 55%,#1976D2 100%)',
    shadow: 'rgba(21,101,192,0.35)',
  },
  commerce: {
    name: 'Commerce',
    emoji: '📊',
    color: '#7B1FA2',
    lightBg: '#faf5ff',
    border: '#e9d5ff',
    chip: '#7B1FA2',
    chipBg: '#faf5ff',
    gradient: 'linear-gradient(135deg,#6A1B9A 0%,#7B1FA2 55%,#9C27B0 100%)',
    shadow: 'rgba(123,31,162,0.35)',
  },
  arts: {
    name: 'Arts',
    emoji: '🎨',
    color: '#D84315',
    lightBg: '#fff7f5',
    border: '#fed7ca',
    chip: '#BF360C',
    chipBg: '#fff0ec',
    gradient: 'linear-gradient(135deg,#BF360C 0%,#D84315 55%,#E64A19 100%)',
    shadow: 'rgba(216,67,21,0.35)',
  },
  tech: {
    name: 'Technology',
    emoji: '⚙️',
    color: '#2E7D32',
    lightBg: '#f0fdf4',
    border: '#bbf7d0',
    chip: '#1B5E20',
    chipBg: '#e6f4ea',
    gradient: 'linear-gradient(135deg,#1B5E20 0%,#2E7D32 55%,#43A047 100%)',
    shadow: 'rgba(46,125,50,0.35)',
  },
}

export default function ALSubjects() {
  const { stream } = useParams()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const activeStreamKey = stream && STREAM_META[stream] ? stream : 'science'
  const meta = STREAM_META[activeStreamKey]

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    getExploreSubjects('al', activeStreamKey)
      .then(res => { if (!cancelled) setSubjects(res.data) })
      .catch(err => { if (!cancelled) setError(err.response?.data?.detail || err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [activeStreamKey])

  const filtered = subjects.filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div
      style={{
        minHeight: '100vh',
        background: meta.lightBg,
        paddingTop: 88,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .alsub-root { font-family:'Plus Jakarta Sans',sans-serif; }

        /* Breadcrumb */
        .alsub-bread {
          background:rgba(255,255,255,0.88);backdrop-filter:blur(12px);
          border-bottom:1px solid rgba(0,0,0,0.07);padding:12px 0;
          position:sticky;top:88px;z-index:10;
        }
        .alsub-bread-inner {
          max-width:1140px;margin:0 auto;padding:0 24px;
          display:flex;align-items:center;gap:8px;font-size:0.85rem;flex-wrap:wrap;
        }
        .alsub-bread a { font-weight:600;text-decoration:none;transition:opacity 0.18s; }
        .alsub-bread a:hover { opacity:0.75; }
        .alsub-bread-sep { color:#94a3b8; }
        .alsub-bread-cur { color:#475569;font-weight:600; }

        /* Hero */
        .alsub-hero {
          padding:56px 24px 64px;text-align:center;
          position:relative;overflow:hidden;
        }
        .alsub-hero::before {
          content:'';position:absolute;inset:0;
          background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }

        /* Stream Switcher Tabs */
        .alsub-tabs {
          display:inline-flex;gap:6px;background:rgba(0,0,0,0.18);
          padding:5px;border-radius:50px;margin-bottom:20px;
          position:relative;backdrop-filter:blur(8px);
          border:1px solid rgba(255,255,255,0.2);flex-wrap:wrap;justify-content:center;
        }
        .alsub-tab {
          border:none;background:transparent;color:rgba(255,255,255,0.8);
          padding:6px 16px;border-radius:50px;font-size:0.8rem;font-weight:700;
          cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:6px;
        }
        .alsub-tab:hover { color:white;background:rgba(255,255,255,0.15); }
        .alsub-tab-active {
          background:white !important;color:#1A1A2E !important;
          box-shadow:0 4px 12px rgba(0,0,0,0.15);
        }

        .alsub-hero h1 {
          font-family:'Nunito',sans-serif;
          font-size:clamp(1.9rem,4.5vw,3rem);font-weight:900;
          color:white;margin:0 0 10px;position:relative;
        }
        .alsub-hero p {
          color:rgba(255,255,255,0.86);font-size:0.98rem;
          max-width:520px;margin:0 auto 28px;position:relative;line-height:1.6;
        }

        /* Search */
        .alsub-search-wrap { position:relative;max-width:460px;margin:0 auto; }
        .alsub-search-icon {
          position:absolute;left:18px;top:50%;transform:translateY(-50%);
          font-size:1rem;pointer-events:none;opacity:0.8;
        }
        .alsub-search {
          width:100%;padding:14px 44px 14px 48px;
          border-radius:50px;border:2px solid rgba(255,255,255,0.25);
          background:rgba(255,255,255,0.18);backdrop-filter:blur(10px);
          color:white;font-size:0.95rem;font-family:'Plus Jakarta Sans',sans-serif;
          outline:none;box-sizing:border-box;
          transition:border-color 0.2s,background 0.2s,box-shadow 0.2s;
        }
        .alsub-search::placeholder { color:rgba(255,255,255,0.7); }
        .alsub-search:focus {
          border-color:rgba(255,255,255,0.65);background:rgba(255,255,255,0.28);
          box-shadow:0 6px 20px rgba(0,0,0,0.15);
        }
        .alsub-clear-btn {
          position:absolute;right:14px;top:50%;transform:translateY(-50%);
          border:none;background:rgba(255,255,255,0.25);color:white;
          width:22px;height:22px;border-radius:50%;font-size:0.75rem;
          display:flex;align-items:center;justify-content:center;
          cursor:pointer;transition:background 0.18s;
        }
        .alsub-clear-btn:hover { background:rgba(255,255,255,0.4); }

        /* Body */
        .alsub-body { max-width:1140px;margin:0 auto;padding:48px 24px 80px; }
        .alsub-count-row {
          display:flex;align-items:center;justify-content:space-between;
          margin-bottom:24px;flex-wrap:wrap;gap:12px;
        }
        .alsub-count-h {
          font-family:'Nunito',sans-serif;font-size:1.4rem;font-weight:800;color:#1A1A2E;
        }

        /* Grid */
        .alsub-grid {
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(240px,1fr));
          gap:20px;
        }
        .alsub-card {
          background:white;border-radius:20px;
          padding:26px 22px;text-decoration:none;color:inherit;
          display:flex;flex-direction:column;
          transition:transform 0.24s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.24s,border-color 0.2s;
          box-shadow:0 4px 20px rgba(0,0,0,0.05);position:relative;
        }
        .alsub-card:focus-visible {
          outline:3px solid #1A1A2E;outline-offset:2px;
        }
        .alsub-card:hover {
          transform:translateY(-6px);
          box-shadow:0 16px 36px rgba(0,0,0,0.12);
        }
        .alsub-card-icon {
          font-size:2.4rem;margin-bottom:14px;display:inline-block;
          filter:drop-shadow(0 2px 8px rgba(0,0,0,0.08));
          transition:transform 0.2s;
        }
        .alsub-card:hover .alsub-card-icon { transform:scale(1.1); }
        .alsub-card-name {
          font-size:1.02rem;font-weight:700;color:#1A1A2E;
          margin-bottom:20px;line-height:1.4;
        }
        .alsub-card-foot {
          display:flex;align-items:center;justify-content:space-between;margin-top:auto;
        }
        .alsub-card-arrow {
          width:32px;height:32px;border-radius:50%;
          color:white;display:flex;align-items:center;justify-content:center;
          font-size:0.88rem;transition:transform 0.18s,filter 0.18s;
        }
        .alsub-card:hover .alsub-card-arrow {
          transform:translateX(4px);filter:brightness(0.9);
        }

        /* Empty State */
        .alsub-empty {
          text-align:center;padding:56px 24px;color:#64748b;
          font-size:0.95rem;grid-column:1/-1;background:white;
          border-radius:20px;border:1px dashed #cbd5e1;
        }
        .alsub-empty-icon { font-size:2.8rem;margin-bottom:12px;display:block; }
        .alsub-reset-btn {
          margin-top:16px;background:#1A1A2E;color:white;border:none;
          padding:8px 20px;border-radius:50px;font-size:0.82rem;font-weight:700;
          cursor:pointer;transition:opacity 0.18s;
        }
        .alsub-reset-btn:hover { opacity:0.85; }

        @media(max-width:640px) {
          .alsub-grid { grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); }
          .alsub-hero { padding:40px 16px 48px; }
        }
      `}</style>

      <div className="alsub-root">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="alsub-bread">
          <div className="alsub-bread-inner">
            <Link to="/explore/past-papers" style={{ color: meta.color }}>📄 Past Papers</Link>
            <span className="alsub-bread-sep">›</span>
            <Link to="/explore/past-papers/al" style={{ color: meta.color }}>A/L</Link>
            <span className="alsub-bread-sep">›</span>
            <span className="alsub-bread-cur">{meta.emoji} {meta.name}</span>
          </div>
        </nav>

        {/* Hero */}
        <header className="alsub-hero" style={{ background: meta.gradient }}>
          {/* Quick Stream Navigation Switcher */}
          <div className="alsub-tabs" role="tablist" aria-label="Select A/L Stream">
            {Object.entries(STREAM_META).map(([key, item]) => (
              <button
                key={key}
                onClick={() => navigate(`/explore/past-papers/al/${key}`)}
                className={`alsub-tab ${key === activeStreamKey ? 'alsub-tab-active' : ''}`}
                role="tab"
                aria-selected={key === activeStreamKey}
              >
                <span>{item.emoji}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </div>

          <h1>{meta.name} Stream Past Papers</h1>
          <p>Choose a subject below to browse past papers, marking schemes, and model papers.</p>
          
          <div className="alsub-search-wrap">
            <span className="alsub-search-icon">🔍</span>
            <input
              className="alsub-search"
              placeholder={`Search ${meta.name} subjects...`}
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Search subjects"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="alsub-clear-btn"
                title="Clear search"
                aria-label="Clear search input"
              >
                ✕
              </button>
            )}
          </div>
        </header>

        {/* Main Content Grid */}
        <main className="alsub-body">
          <div className="alsub-count-row">
            <h2 className="alsub-count-h">Select a Subject</h2>
            <div
              style={{
                fontSize: '0.82rem', fontWeight: 700,
                color: meta.chip, background: meta.chipBg,
                padding: '5px 16px', borderRadius: 50,
                border: `1px solid ${meta.border}`,
              }}
            >
              {filtered.length} {filtered.length === 1 ? 'subject' : 'subjects'}
            </div>
          </div>

          <div className="alsub-grid">
            {loading ? (
              <div className="alsub-empty">
                <span className="alsub-empty-icon">⏳</span>
                <div>Loading subjects…</div>
              </div>
            ) : error ? (
              <div className="alsub-empty">
                <span className="alsub-empty-icon">⚠️</span>
                <div>Couldn't load subjects. {error}</div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="alsub-empty">
                <span className="alsub-empty-icon">🔎</span>
                <div>No subjects found matching "<strong>{query}</strong>"</div>
                <button
                  onClick={() => setQuery('')}
                  className="alsub-reset-btn"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              filtered.map(s => (
                <Link
                  key={s.id}
                  to={`/explore/past-papers/al/${activeStreamKey}/${s.id}`}
                  state={{ subjectName: s.name, streamName: meta.name, grade: 'AL' }}
                  className="alsub-card"
                  style={{ border: `1.5px solid ${meta.border}` }}
                >
                  <span className="alsub-card-icon">{s.icon || meta.emoji}</span>
                  <div className="alsub-card-name">{s.name}</div>
                  <div className="alsub-card-foot">
                    <div
                      style={{
                        fontSize: '0.76rem', fontWeight: 700,
                        color: meta.chip, background: meta.chipBg,
                        padding: '4px 12px', borderRadius: 50,
                        border: `1px solid ${meta.border}`,
                      }}
                    >
                      {s.paperCount} Papers
                    </div>
                    <div
                      className="alsub-card-arrow"
                      style={{ background: meta.color }}
                    >
                      →
                    </div>
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