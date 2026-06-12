import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getPastPaperYears } from '../api/api'

export default function PastPapers() {
  const { courseId } = useParams()
  const navigate = useNavigate()

  const [years, setYears] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await getPastPaperYears(courseId)
        // res.data expected: [{ year: 2023, papers: [{ id, part_number, part_label, question_count }] }, ...]
        const sorted = (res.data || []).sort((a, b) => b.year - a.year)
        setYears(sorted)
        if (sorted.length > 0) setSelectedYear(sorted[0].year)
      } catch (err) {
        alert('Could not load past papers')
        navigate(`/my-courses/${courseId}/overview`)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [courseId, navigate])

  const currentYearData = years.find(y => y.year === selectedYear)

  if (loading) {
    return (
      <>
        <BaseStyles />
        <main className="pp-loading">
          <div className="pp-loading-icon">📝</div>
          <p>Loading past papers…</p>
        </main>
      </>
    )
  }

  return (
    <>
      <BaseStyles />

      <main className="pp-shell">

        {/* ── Hero ── */}
        <section className="pp-hero">
          <div className="pp-hero-dots" />
          <div className="pp-hero-inner">
            <button
              className="pp-back-btn"
              onClick={() => navigate(`/my-courses/${courseId}/overview`)}
            >
              ← Back to Course
            </button>

            <div className="pp-hero-badge">📝 Past Papers</div>

            <h1 className="pp-hero-title">Past Exam Papers</h1>
            <p className="pp-hero-sub">
              Select a year below, then choose which part of the paper you'd like to attempt.
            </p>
          </div>
        </section>

        <div className="pp-body">

          {years.length === 0 ? (
            <div className="pp-empty">
              <div className="pp-empty-icon">📭</div>
              <p>No past papers have been added yet.</p>
            </div>
          ) : (
            <>
              {/* ── Year selector ── */}
              <div className="pp-year-section">
                <h2 className="pp-section-title">Select Year</h2>
                <div className="pp-year-grid">
                  {years.map(y => (
                    <button
                      key={y.year}
                      className={`pp-year-btn ${selectedYear === y.year ? 'active' : ''}`}
                      onClick={() => setSelectedYear(y.year)}
                    >
                      <span className="pp-year-num">{y.year}</span>
                      <span className="pp-year-parts">{y.papers.length} part{y.papers.length !== 1 ? 's' : ''}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Parts for selected year ── */}
              {currentYearData && (
                <div className="pp-parts-section">
                  <h2 className="pp-section-title">
                    {currentYearData.year} — Choose a Part
                  </h2>
                  <div className="pp-parts-grid">
                    {currentYearData.papers
                      .sort((a, b) => a.part_number - b.part_number)
                      .map((paper, idx) => {
                        const isMCQ = paper.part_number === 1
                        const partColors = [
                          { color: '#1D4ED8', bg: 'linear-gradient(135deg, #EFF6FF 0%, #F5F8FF 100%)', border: '#BFDBFE', btnBg: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', shadow: 'rgba(59,130,246,0.28)', icon: '📋' },
                          { color: '#7C3AED', bg: 'linear-gradient(135deg, #F3E8FF 0%, #FAF5FF 100%)', border: '#D8B4FE', btnBg: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', shadow: 'rgba(139,92,246,0.28)', icon: '✍️' },
                          { color: '#B45309', bg: 'linear-gradient(135deg, #FEF9E7 0%, #FFFBF0 100%)', border: '#FDE68A', btnBg: 'linear-gradient(135deg, #F59E0B, #B45309)', shadow: 'rgba(245,158,11,0.28)', icon: '📖' },
                          { color: '#0E7490', bg: 'linear-gradient(135deg, #ECFEFF 0%, #F0FEFF 100%)', border: '#A5F3FC', btnBg: 'linear-gradient(135deg, #06B6D4, #0E7490)', shadow: 'rgba(6,182,212,0.28)', icon: '🗒️' },
                        ]
                        const c = partColors[idx % partColors.length]

                        return (
                          <div
                            key={paper.id}
                            className="pp-part-card"
                            style={{ background: 'white', borderColor: c.border }}
                          >
                            <div className="pp-part-icon-wrap" style={{ background: c.bg, border: `1.5px solid ${c.border}` }}>
                              <span className="pp-part-icon">{c.icon}</span>
                            </div>

                            <div className="pp-part-info">
                              <h3 className="pp-part-title" style={{ color: c.color }}>
                                {paper.part_label || `Part ${paper.part_number}`}
                              </h3>
                              <p className="pp-part-type">
                                {isMCQ ? 'Multiple Choice Questions' : 'Structured / Essay Questions'}
                              </p>
                              <p className="pp-part-count">
                                {paper.question_count} question{paper.question_count !== 1 ? 's' : ''}
                              </p>
                            </div>

                            <button
                              className="pp-part-btn"
                              style={{ background: c.btnBg, boxShadow: `0 4px 14px ${c.shadow}` }}
                              onClick={() => navigate(`/my-courses/${courseId}/past-papers/${paper.id}`)}
                            >
                              Open Paper →
                            </button>
                          </div>
                        )
                      })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  )
}

function BaseStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(16px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      .pp-shell {
        min-height: 100vh;
        background: #F8FBF8;
        padding-top: 68px;
        font-family: 'Plus Jakarta Sans', sans-serif;
        color: #1A3A1A;
      }

      /* ── Loading ── */
      .pp-loading {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 14px;
        background: #F8FBF8;
        font-family: 'Plus Jakarta Sans', sans-serif;
        color: #5A7A5A;
        font-weight: 700;
      }
      .pp-loading-icon { font-size: 2.2rem; }

      /* ── Hero ── */
      .pp-hero {
        background: linear-gradient(135deg, #EFF6FF 0%, #F5F8FF 100%);
        border-bottom: 1.5px solid #BFDBFE;
        padding: 44px 24px 40px;
        position: relative;
        overflow: hidden;
      }

      .pp-hero-dots {
        position: absolute;
        inset: 0;
        pointer-events: none;
        background-image: radial-gradient(circle, rgba(59,130,246,0.10) 1.5px, transparent 1.5px);
        background-size: 28px 28px;
        mask-image: radial-gradient(ellipse 80% 100% at 100% 50%, black 0%, transparent 75%);
        -webkit-mask-image: radial-gradient(ellipse 80% 100% at 100% 50%, black 0%, transparent 75%);
      }

      .pp-hero-inner {
        max-width: 900px;
        margin: 0 auto;
        position: relative;
      }

      .pp-back-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: white;
        color: #1D4ED8;
        border: 1.5px solid #BFDBFE;
        border-radius: 50px;
        padding: 6px 16px;
        font-size: 0.8rem;
        font-weight: 700;
        cursor: pointer;
        margin-bottom: 20px;
        font-family: 'Plus Jakarta Sans', sans-serif;
        transition: background 0.16s;
      }
      .pp-back-btn:hover { background: #EFF6FF; }

      .pp-hero-badge {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        background: #EFF6FF;
        color: #1D4ED8;
        font-weight: 700;
        font-size: 0.75rem;
        padding: 4px 13px;
        border-radius: 50px;
        letter-spacing: 0.07em;
        text-transform: uppercase;
        margin-bottom: 14px;
        border: 1.5px solid #BFDBFE;
      }

      .pp-hero-title {
        font-family: 'Nunito', sans-serif;
        font-weight: 900;
        font-size: clamp(1.8rem, 4vw, 2.4rem);
        color: #1A3A1A;
        letter-spacing: -0.02em;
        margin-bottom: 8px;
        line-height: 1.1;
      }

      .pp-hero-sub {
        font-size: 0.95rem;
        color: #4A6A8A;
      }

      /* ── Body ── */
      .pp-body {
        max-width: 900px;
        margin: 0 auto;
        padding: 48px 24px 80px;
      }

      .pp-empty {
        text-align: center;
        padding: 80px 24px;
        color: #5A7A5A;
        font-weight: 600;
        font-size: 1rem;
      }
      .pp-empty-icon { font-size: 2.5rem; margin-bottom: 14px; }

      /* ── Section title ── */
      .pp-section-title {
        font-family: 'Nunito', sans-serif;
        font-weight: 900;
        font-size: 1.15rem;
        color: #1A3A1A;
        margin-bottom: 18px;
        letter-spacing: -0.01em;
      }

      /* ── Year selector ── */
      .pp-year-section {
        margin-bottom: 48px;
        animation: fadeUp 0.35s ease both;
      }

      .pp-year-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
      }

      .pp-year-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;
        padding: 14px 22px;
        border-radius: 16px;
        border: 1.5px solid #BFDBFE;
        background: white;
        cursor: pointer;
        font-family: 'Plus Jakarta Sans', sans-serif;
        transition: transform 0.16s, box-shadow 0.16s, background 0.16s;
        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      }

      .pp-year-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 22px rgba(59,130,246,0.12);
        background: #EFF6FF;
      }

      .pp-year-btn.active {
        background: linear-gradient(135deg, #3B82F6, #1D4ED8);
        border-color: transparent;
        box-shadow: 0 6px 20px rgba(59,130,246,0.35);
        transform: translateY(-3px);
      }

      .pp-year-num {
        font-size: 1.2rem;
        font-weight: 800;
        color: #1D4ED8;
        font-family: 'Nunito', sans-serif;
        line-height: 1;
      }

      .pp-year-btn.active .pp-year-num {
        color: white;
      }

      .pp-year-parts {
        font-size: 0.7rem;
        font-weight: 700;
        color: #7A9ABB;
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }

      .pp-year-btn.active .pp-year-parts {
        color: rgba(255,255,255,0.75);
      }

      /* ── Parts grid ── */
      .pp-parts-section {
        animation: fadeUp 0.35s ease both;
      }

      .pp-parts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 20px;
      }

      .pp-part-card {
        background: white;
        border-radius: 22px;
        border: 1.5px solid #BFDBFE;
        padding: 26px 22px;
        display: flex;
        flex-direction: column;
        gap: 0;
        box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        transition: transform 0.22s, box-shadow 0.22s;
        animation: fadeUp 0.4s ease both;
      }

      .pp-part-card:nth-child(1) { animation-delay: 0.05s; }
      .pp-part-card:nth-child(2) { animation-delay: 0.12s; }
      .pp-part-card:nth-child(3) { animation-delay: 0.19s; }
      .pp-part-card:nth-child(4) { animation-delay: 0.26s; }

      .pp-part-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 16px 40px rgba(0,0,0,0.09);
      }

      .pp-part-icon-wrap {
        width: 54px;
        height: 54px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 18px;
      }

      .pp-part-icon {
        font-size: 1.6rem;
      }

      .pp-part-info {
        flex: 1;
        margin-bottom: 20px;
      }

      .pp-part-title {
        font-family: 'Nunito', sans-serif;
        font-weight: 900;
        font-size: 1.15rem;
        margin-bottom: 6px;
        line-height: 1.2;
      }

      .pp-part-type {
        font-size: 0.8rem;
        color: #5A7A5A;
        font-weight: 600;
        margin-bottom: 4px;
      }

      .pp-part-count {
        font-size: 0.78rem;
        color: #8A9A8A;
        font-weight: 600;
      }

      .pp-part-btn {
        width: 100%;
        padding: 11px 22px;
        border-radius: 50px;
        border: none;
        color: white;
        font-weight: 700;
        font-size: 0.88rem;
        font-family: 'Plus Jakarta Sans', sans-serif;
        cursor: pointer;
        transition: transform 0.16s, box-shadow 0.16s;
      }

      .pp-part-btn:hover {
        transform: translateY(-2px);
      }

      /* ── Responsive ── */
      @media (max-width: 600px) {
        .pp-year-btn { padding: 12px 16px; }
        .pp-year-num { font-size: 1.05rem; }
        .pp-parts-grid { grid-template-columns: 1fr; }
      }
    `}</style>
  )
}