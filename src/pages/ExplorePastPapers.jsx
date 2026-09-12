import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getExploreGrades, getExploreStreams } from '../api/api'

// Presentation-only metadata (colors, emoji, copy). Subject/stream counts
// in the badges are fetched live from the backend below.
const GRADE_META = [
  {
    id: 'ol',
    label: 'O/L',
    fullName: 'Ordinary Level',
    subtitle: 'Grade 10 & 11',
    emoji: '📘',
    desc: 'Mathematics, Science, English, History and all other Ordinary Level subjects with papers from 2015–2025.',
    route: '/explore/past-papers/ol',
    gradient: 'linear-gradient(145deg, #0D47A1 0%, #1565C0 55%, #1976D2 100%)',
    shadow: 'rgba(21,101,192,0.38)',
    bubble1: 'rgba(255,255,255,0.08)',
    bubble2: 'rgba(255,255,255,0.05)',
  },
  {
    id: 'al',
    label: 'A/L',
    fullName: 'Advanced Level',
    subtitle: 'Grade 12 & 13',
    emoji: '🎓',
    desc: 'Science, Commerce, Arts & Technology streams. Choose your stream and subject to find the exact papers you need.',
    route: '/explore/past-papers/al',
    gradient: 'linear-gradient(145deg, #1B5E20 0%, #2E7D32 55%, #43A047 100%)',
    shadow: 'rgba(46,125,50,0.38)',
    bubble1: 'rgba(255,255,255,0.08)',
    bubble2: 'rgba(255,255,255,0.05)',
  },
  {
    id: 'grade5',
    label: 'Grade 5',
    fullName: 'Scholarship Exam',
    subtitle: 'Scholarship Examination',
    emoji: '⭐',
    desc: 'Past papers for the Grade 5 Scholarship Examination — Maths, Language, Environment & General Competency.',
    route: '/explore/past-papers/grade5',
    gradient: 'linear-gradient(145deg, #BF360C 0%, #E64A19 55%, #FF5722 100%)',
    shadow: 'rgba(230,74,25,0.38)',
    bubble1: 'rgba(255,255,255,0.08)',
    bubble2: 'rgba(255,255,255,0.05)',
  },
]

export default function ExplorePastPapers() {
  const [counts, setCounts] = useState({}) // { ol: { subjectCount }, al: { subjectCount, streamCount }, ... }
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    getExploreGrades()
      .then(async res => {
        if (cancelled) return
        const grades = res.data
        const map = {}
        for (const g of grades) {
          map[g.id] = { subjectCount: g.subjectCount }
        }
        // A/L also shows stream count in its badge
        if (map.al) {
          try {
            const streamsRes = await getExploreStreams('al')
            map.al.streamCount = streamsRes.data.length
          } catch {
            map.al.streamCount = null
          }
        }
        if (!cancelled) setCounts(map)
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [])

  const GRADES = GRADE_META.map(g => {
    const c = counts[g.id]
    let badge = 'Loading…'
    if (!loading) {
      if (g.id === 'al') {
        badge = c ? `${c.streamCount ?? '–'} Streams · ${c.subjectCount ?? '–'} Subjects` : '—'
      } else {
        badge = c ? `${c.subjectCount} Subjects` : '—'
      }
    }
    return { ...g, badge }
  })

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#f0fdf4 0%,#ecfdf5 40%,#f0faf0 100%)', paddingTop: 88 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .gps-root { font-family:'Plus Jakarta Sans',sans-serif; }

        /* ── Hero ── */
        .gps-hero {
          background: linear-gradient(135deg,#1B5E20 0%,#2E7D32 55%,#388E3C 100%);
          padding: 84px 24px 80px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .gps-hero::before {
          content:'';
          position:absolute;inset:0;
          background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .gps-hero-badge {
          display:inline-flex;align-items:center;gap:7px;
          background:rgba(255,255,255,0.14);
          border:1.5px solid rgba(255,255,255,0.28);
          color:white;font-size:0.8rem;font-weight:700;letter-spacing:0.04em;
          padding:7px 20px;border-radius:50px;
          margin-bottom:22px;position:relative;
          backdrop-filter:blur(10px);
        }
        .gps-hero h1 {
          font-family:'Nunito',sans-serif;
          font-size:clamp(2.2rem,5.5vw,3.6rem);
          font-weight:900;color:white;margin:0 0 16px;
          position:relative;letter-spacing:-0.5px;line-height:1.12;
        }
        .gps-hero p {
          color:rgba(255,255,255,0.82);font-size:1.08rem;
          max-width:540px;margin:0 auto;position:relative;line-height:1.72;
        }

        /* ── Body ── */
        .gps-body {
          max-width:1140px;margin:0 auto;padding:72px 24px 80px;
        }
        .gps-intro {
          text-align:center;margin-bottom:52px;
        }
        .gps-step-tag {
          display:inline-block;
          font-size:0.76rem;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;
          color:#2E7D32;background:#e6f4ea;
          padding:5px 16px;border-radius:50px;margin-bottom:14px;
        }
        .gps-section-h {
          font-family:'Nunito',sans-serif;
          font-size:clamp(1.6rem,3vw,2.2rem);font-weight:900;
          color:#1A3A1A;margin:0;line-height:1.25;
        }

        /* ── Grade Cards ── */
        .gps-grid {
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(300px,1fr));
          gap:28px;
        }
        .gps-card {
          border-radius:28px;overflow:hidden;
          text-decoration:none;display:flex;flex-direction:column;
          transition:transform 0.32s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.3s ease;
          position:relative;
        }
        .gps-card:hover { transform:translateY(-12px) scale(1.025); }

        .gps-card-body {
          padding:44px 32px 32px;flex:1;position:relative;overflow:hidden;
        }
        .gps-bubble-a,.gps-bubble-b {
          position:absolute;border-radius:50%;pointer-events:none;
        }
        .gps-bubble-a { width:200px;height:200px;top:-60px;right:-60px; }
        .gps-bubble-b { width:100px;height:100px;top:30px;right:30px; }

        .gps-emoji {
          font-size:3.2rem;margin-bottom:18px;display:block;position:relative;
          filter:drop-shadow(0 4px 12px rgba(0,0,0,0.25));
        }
        .gps-grade-label {
          font-family:'Nunito',sans-serif;
          font-size:2.6rem;font-weight:900;color:white;
          line-height:1;margin-bottom:4px;position:relative;
        }
        .gps-grade-fullname {
          font-size:0.95rem;font-weight:700;
          color:rgba(255,255,255,0.72);margin-bottom:6px;position:relative;
          text-transform:uppercase;letter-spacing:0.06em;
        }
        .gps-grade-sub {
          font-size:0.82rem;color:rgba(255,255,255,0.6);
          margin-bottom:20px;position:relative;
        }
        .gps-grade-desc {
          font-size:0.92rem;color:rgba(255,255,255,0.88);
          line-height:1.68;position:relative;margin:0;
        }

        .gps-card-footer {
          padding:20px 32px;
          background:rgba(0,0,0,0.18);
          display:flex;align-items:center;justify-content:space-between;
          border-top:1px solid rgba(255,255,255,0.12);
        }
        .gps-chip {
          font-size:0.78rem;font-weight:700;
          color:rgba(255,255,255,0.92);
          background:rgba(255,255,255,0.16);
          border:1px solid rgba(255,255,255,0.22);
          padding:5px 14px;border-radius:50px;
        }
        .gps-explore {
          display:flex;align-items:center;gap:6px;
          font-size:0.88rem;font-weight:700;color:white;
          transition:gap 0.22s;
        }
        .gps-card:hover .gps-explore { gap:10px; }
        .gps-explore-arrow {
          width:26px;height:26px;border-radius:50%;
          background:rgba(255,255,255,0.2);
          display:flex;align-items:center;justify-content:center;
          font-size:0.85rem;transition:background 0.2s;
        }
        .gps-card:hover .gps-explore-arrow { background:rgba(255,255,255,0.35); }

        /* ── Stats row ── */
        .gps-stats {
          display:flex;justify-content:center;gap:48px;
          margin-top:72px;padding:32px;
          background:white;border-radius:20px;
          border:1.5px solid #E8F5E9;
          box-shadow:0 4px 24px rgba(46,125,50,0.07);
          flex-wrap:wrap;
        }
        .gps-stat { text-align:center; }
        .gps-stat-num {
          font-family:'Nunito',sans-serif;
          font-size:1.8rem;font-weight:900;color:#2E7D32;
          display:block;line-height:1;
        }
        .gps-stat-lbl {
          font-size:0.82rem;font-weight:600;color:#7A9A7A;margin-top:4px;
        }

        @media(max-width:640px) {
          .gps-grid { grid-template-columns:1fr; }
          .gps-card-body { padding:34px 24px 24px; }
          .gps-card-footer { padding:16px 24px; }
          .gps-stats { gap:24px; }
        }
      `}</style>

      <div className="gps-root">
        {/* ── Hero ── */}
        <div className="gps-hero">
          <div className="gps-hero-badge">📄 Past Examination Papers</div>
          <h1>Choose Your Grade Level</h1>
          <p>Select your examination grade to browse thousands of past papers and sharpen your exam preparation.</p>
        </div>

        {/* ── Grade Cards ── */}
        <div className="gps-body">
          <div className="gps-intro">
            <div className="gps-step-tag">Step 1 — Select Grade</div>
            <h2 className="gps-section-h">Which examination are you preparing for?</h2>
          </div>

          <div className="gps-grid">
            {GRADES.map(g => (
              <Link
                key={g.id}
                to={g.route}
                className="gps-card"
                style={{ background: g.gradient, boxShadow: `0 24px 64px ${g.shadow}` }}
              >
                <div className="gps-card-body">
                  <div
                    className="gps-bubble-a"
                    style={{ background: g.bubble1 }}
                  />
                  <div
                    className="gps-bubble-b"
                    style={{ background: g.bubble2 }}
                  />
                  <span className="gps-emoji">{g.emoji}</span>
                  <div className="gps-grade-label">{g.label}</div>
                  <div className="gps-grade-fullname">{g.fullName}</div>
                  <div className="gps-grade-sub">{g.subtitle}</div>
                  <p className="gps-grade-desc">{g.desc}</p>
                </div>
                <div className="gps-card-footer">
                  <span className="gps-chip">{g.badge}</span>
                  <span className="gps-explore">
                    Explore Papers
                    <span className="gps-explore-arrow">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* ── Stats ── */}
          <div className="gps-stats">
            {[
              { num: '500+', lbl: 'Past Papers' },
              { num: '3', lbl: 'Exam Levels' },
              { num: '30+', lbl: 'Subjects' },
              { num: '2019–2026', lbl: 'Years Covered' },
            ].map(s => (
              <div key={s.num} className="gps-stat">
                <span className="gps-stat-num">{s.num}</span>
                <div className="gps-stat-lbl">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}