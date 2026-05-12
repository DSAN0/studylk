import { useEffect, useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { studentQuestionPapers } from '../api/api'

export default function CoursePapers() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [papers, setPapers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('default') // 'default' | 'duration-asc' | 'duration-desc' | 'questions'

  useEffect(() => {
    async function loadData() {
      try {
        const res = await studentQuestionPapers(courseId)
        setPapers(res.data)
      } catch (err) {
        console.error(err)
        navigate('/my-courses')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [courseId, navigate])

  const filtered = useMemo(() => {
    let list = [...papers]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      )
    }
    if (sortBy === 'duration-asc')   list.sort((a, b) => a.duration_minutes - b.duration_minutes)
    if (sortBy === 'duration-desc')  list.sort((a, b) => b.duration_minutes - a.duration_minutes)
    if (sortBy === 'questions')      list.sort((a, b) => b.questionCount - a.questionCount)
    return list
  }, [papers, search, sortBy])

  const totalMinutes = papers.reduce((s, p) => s + (p.duration_minutes || 0), 0)
  const totalQuestions = papers.reduce((s, p) => s + (p.questionCount || 0), 0)

  if (loading) {
    return (
      <>
        <BaseStyles />
        <main style={{
          minHeight: '100vh', paddingTop: 90,
          background: 'linear-gradient(160deg, #F0FAF0 0%, #FAFFFE 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 14,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
          <div style={{ fontSize: '2.2rem' }}>📝</div>
          <p style={{ color: '#5A7A5A', fontWeight: 600, fontSize: '0.95rem' }}>Loading papers…</p>
          <div style={{ display: 'flex', gap: 6 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: '50%', background: '#4CAF50',
                animation: `bounce 1.2s ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <BaseStyles />
      <style>{`
        .cp-paper-card {
          background: white;
          border: 1.5px solid #E8F5E9;
          border-radius: 22px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 2px 14px rgba(0,0,0,0.04);
          transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
          animation: fadeUp 0.4s ease both;
          position: relative;
          overflow: hidden;
        }
        .cp-paper-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: linear-gradient(90deg, #4CAF50, #2E7D32);
          border-radius: 22px 22px 0 0;
          opacity: 0;
          transition: opacity 0.22s;
        }
        .cp-paper-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 42px rgba(76,175,80,0.10);
          border-color: #A5D6A7;
        }
        .cp-paper-card:hover::before {
          opacity: 1;
        }
        .cp-paper-card:nth-child(1) { animation-delay: 0.04s; }
        .cp-paper-card:nth-child(2) { animation-delay: 0.10s; }
        .cp-paper-card:nth-child(3) { animation-delay: 0.16s; }
        .cp-paper-card:nth-child(4) { animation-delay: 0.22s; }
        .cp-paper-card:nth-child(5) { animation-delay: 0.28s; }
        .cp-paper-card:nth-child(6) { animation-delay: 0.34s; }

        .cp-start-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 7px;
          font-size: 0.88rem; font-weight: 700;
          padding: 11px 22px; border-radius: 50px; border: none;
          cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif;
          color: white;
          background: linear-gradient(135deg, #4CAF50, #2E7D32);
          box-shadow: 0 4px 14px rgba(76,175,80,0.28);
          transition: transform 0.16s, box-shadow 0.16s;
          width: 100%;
          margin-top: auto;
        }
        .cp-start-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(76,175,80,0.38);
        }

        .cp-search-input {
          width: 100%;
          padding: 11px 16px 11px 42px;
          border: 1.5px solid #D1E9D1;
          border-radius: 50px;
          font-size: 0.9rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #1A3A1A;
          background: white;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .cp-search-input:focus {
          border-color: #4CAF50;
          box-shadow: 0 0 0 3px rgba(76,175,80,0.12);
        }
        .cp-search-input::placeholder { color: #9AB89A; }

        .cp-sort-select {
          padding: 10px 36px 10px 14px;
          border: 1.5px solid #D1E9D1;
          border-radius: 50px;
          font-size: 0.85rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #3A5A3A;
          background: white;
          outline: none;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%234CAF50' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          transition: border-color 0.18s;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .cp-sort-select:focus { border-color: #4CAF50; }

        .cp-stat-pill {
          display: inline-flex; align-items: center; gap: 8px;
          background: white; border: 1.5px solid #E8F5E9;
          border-radius: 14px; padding: 14px 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.04);
        }

        .cp-meta-chip {
          display: inline-flex; align-items: center; gap: 5px;
          background: #F0FAF0; border: 1px solid #C8E6C9;
          border-radius: 50px; padding: 5px 12px;
          font-size: 0.78rem; font-weight: 600; color: #3A5A3A;
        }

        .cp-no-results {
          text-align: center;
          padding: 60px 32px;
          background: white;
          border-radius: 24px;
          border: 1.5px solid #E8F5E9;
          box-shadow: 0 2px 14px rgba(0,0,0,0.04);
          animation: fadeUp 0.4s ease both;
        }
      `}</style>

      <main style={{
        minHeight: '100vh',
        background: '#F8FBF8',
        paddingTop: 68,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: '#1A3A1A',
      }}>

        {/* ── Hero strip ── */}
        <section style={{
          background: 'linear-gradient(135deg, #E8F5E9 0%, #F0FAF0 100%)',
          borderBottom: '1.5px solid #C8E6C9',
          padding: '44px 24px 40px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'radial-gradient(circle, rgba(76,175,80,0.11) 1.5px, transparent 1.5px)',
            backgroundSize: '28px 28px',
            maskImage: 'radial-gradient(ellipse 80% 100% at 0% 50%, black 0%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 100% at 0% 50%, black 0%, transparent 75%)',
          }} />

          <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>

            {/* Back button */}
            <button
              onClick={() => navigate(`/my-courses/${courseId}/overview`)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'white', color: '#2E7D32',
                border: '1.5px solid #A5D6A7', borderRadius: 50,
                padding: '6px 16px', fontSize: '0.8rem', fontWeight: 700,
                cursor: 'pointer', marginBottom: 20,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                transition: 'background 0.16s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#E8F5E9'}
              onMouseLeave={e => e.currentTarget.style.background = 'white'}
            >
              ← Back to Course
            </button>

            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: '#E8F5E9', color: '#2E7D32',
              fontWeight: 700, fontSize: '0.75rem',
              padding: '4px 13px', borderRadius: 50,
              letterSpacing: '0.07em', textTransform: 'uppercase',
              marginBottom: 14, border: '1.5px solid #A5D6A7',
            }}>
              📝 Question Papers
            </div>

            <h1 style={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
              color: '#1A3A1A', letterSpacing: '-0.02em',
              marginBottom: 8, lineHeight: 1.1,
            }}>
              Question Papers
            </h1>
            <p style={{ fontSize: '0.95rem', color: '#5A7A5A', marginBottom: 28 }}>
              Attempt past papers and mock exams to prepare for your assessments.
            </p>

            {/* Stats row */}
            {papers.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <div className="cp-stat-pill">
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: '#E8F5E9', border: '1.5px solid #C8E6C9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem',
                  }}>📝</div>
                  <div>
                    <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: '1.3rem', color: '#2E7D32', lineHeight: 1 }}>
                      {papers.length}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#7A9A7A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Papers
                    </div>
                  </div>
                </div>

                <div className="cp-stat-pill">
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: '#EFF6FF', border: '1.5px solid #BFDBFE',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem',
                  }}>❓</div>
                  <div>
                    <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: '1.3rem', color: '#1D4ED8', lineHeight: 1 }}>
                      {totalQuestions}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#7A9A7A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Questions
                    </div>
                  </div>
                </div>

                <div className="cp-stat-pill">
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: '#FEF9E7', border: '1.5px solid #FDE68A',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem',
                  }}>⏱️</div>
                  <div>
                    <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: '1.3rem', color: '#B45309', lineHeight: 1 }}>
                      {totalMinutes}m
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#7A9A7A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Total Time
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── Content ── */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '36px 24px 80px' }}>

          {papers.length === 0 ? (
            <div className="cp-no-results">
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>📭</div>
              <h2 style={{
                fontFamily: "'Nunito', sans-serif", fontWeight: 900,
                fontSize: '1.4rem', color: '#1A3A1A', marginBottom: 10,
              }}>No papers yet</h2>
              <p style={{ color: '#5A7A5A', fontSize: '0.9rem', maxWidth: 320, margin: '0 auto' }}>
                Your teacher hasn't uploaded any papers yet. Check back soon!
              </p>
            </div>
          ) : (
            <>
              {/* Search & Sort bar */}
              <div style={{
                display: 'flex', gap: 12, marginBottom: 28,
                flexWrap: 'wrap', alignItems: 'center',
              }}>
                {/* Search */}
                <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 200 }}>
                  <span style={{
                    position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                    fontSize: '1rem', pointerEvents: 'none',
                  }}>🔍</span>
                  <input
                    className="cp-search-input"
                    placeholder="Search papers…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>

                {/* Sort */}
                <select
                  className="cp-sort-select"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                >
                  <option value="default">Default order</option>
                  <option value="duration-asc">⏱ Shortest first</option>
                  <option value="duration-desc">⏱ Longest first</option>
                  <option value="questions">❓ Most questions</option>
                </select>
              </div>

              {/* Results count */}
              {search && (
                <p style={{ fontSize: '0.85rem', color: '#7A9A7A', marginBottom: 18, fontWeight: 600 }}>
                  {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"
                </p>
              )}

              {filtered.length === 0 ? (
                <div className="cp-no-results">
                  <div style={{ fontSize: '2.4rem', marginBottom: 12 }}>🔍</div>
                  <h2 style={{
                    fontFamily: "'Nunito', sans-serif", fontWeight: 900,
                    fontSize: '1.2rem', color: '#1A3A1A', marginBottom: 8,
                  }}>No papers found</h2>
                  <p style={{ color: '#5A7A5A', fontSize: '0.88rem' }}>
                    Try a different search term.
                  </p>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: 20,
                }}>
                  {filtered.map((p, idx) => (
                    <div
                      key={p.id}
                      className="cp-paper-card"
                      style={{ animationDelay: `${0.04 + idx * 0.06}s` }}
                    >
                      {/* Paper number badge */}
                      <div style={{
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between', marginBottom: 18,
                      }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: 13,
                          background: 'linear-gradient(135deg, #E8F5E9, #F0FAF0)',
                          border: '1.5px solid #C8E6C9',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: "'Nunito', sans-serif", fontWeight: 900,
                          fontSize: '1rem', color: '#2E7D32',
                        }}>
                          #{idx + 1}
                        </div>
                        {/* Duration badge */}
                        <div style={{
                          background: '#FEF9E7', border: '1px solid #FDE68A',
                          color: '#B45309', borderRadius: 50,
                          padding: '4px 11px', fontSize: '0.75rem', fontWeight: 700,
                        }}>
                          ⏱ {p.duration_minutes} min
                        </div>
                      </div>

                      {/* Title */}
                      <h2 style={{
                        fontFamily: "'Nunito', sans-serif",
                        fontWeight: 900, fontSize: '1.1rem',
                        color: '#1A3A1A', marginBottom: 8, lineHeight: 1.3,
                      }}>
                        {p.title}
                      </h2>

                      {/* Description */}
                      {p.description && (
                        <p style={{
                          fontSize: '0.84rem', color: '#5A7A5A',
                          lineHeight: 1.6, marginBottom: 18, flex: 1,
                        }}>
                          {p.description}
                        </p>
                      )}

                      {/* Meta chips */}
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                        <span className="cp-meta-chip">
                          ❓ {p.questionCount} questions
                        </span>
                        <span className="cp-meta-chip">
                          ⏱ {p.duration_minutes} min
                        </span>
                      </div>

                      {/* Divider */}
                      <div style={{
                        height: '1px', background: '#F0F7F0',
                        marginBottom: 18,
                      }} />

                      {/* Start button */}
                      <button
                        className="cp-start-btn"
                        onClick={() => navigate(`/papers/${p.id}/take`)}
                      >
                        🚀 Start Paper
                      </button>
                    </div>
                  ))}
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
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50%       { transform: translateY(-8px); }
      }
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(18px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `}</style>
  )
}