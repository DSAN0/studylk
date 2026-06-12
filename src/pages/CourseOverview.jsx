import { useNavigate, useParams } from 'react-router-dom'

const SECTIONS = [
  {
    key: 'materials',
    icon: '📄',
    title: 'Materials',
    description: 'Access all course notes, PDFs, videos and reading resources uploaded by your teacher.',
    color: '#2E7D32',
    bg: 'linear-gradient(135deg, #E8F5E9 0%, #F0FAF0 100%)',
    border: '#C8E6C9',
    btnBg: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
    btnShadow: 'rgba(76,175,80,0.30)',
    path: (id) => `/my-courses/${id}/materials`,
  },
  {
    key: 'theory',
    icon: '📖',
    title: 'Theory',
    description: 'Read structured theory notes topic by topic, with definitions, examples, formulas and more.',
    color: '#0E7490',
    bg: 'linear-gradient(135deg, #ECFEFF 0%, #F0FEFF 100%)',
    border: '#A5F3FC',
    btnBg: 'linear-gradient(135deg, #06B6D4, #0E7490)',
    btnShadow: 'rgba(6,182,212,0.30)',
    path: (id) => `/my-courses/${id}/theory`,
  },
  {
  key: 'topic-practice',
  icon: '📚',
  title: 'Topic Practice',
  description: 'Practice topic-by-topic MCQ questions anytime with instant answers and explanations.',
  color: '#7C3AED',
  bg: 'linear-gradient(135deg, #F3E8FF 0%, #FAF5FF 100%)',
  border: '#D8B4FE',
  btnBg: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
  btnShadow: 'rgba(139,92,246,0.30)',
  path: (id) => `/my-courses/${id}/topic-practice`,
  },
  {
    key: 'daily-questions',
    icon: '✏️',
    title: 'Daily Questions',
    description: 'Practice with daily questions set by your teacher to sharpen your understanding.',
    color: '#B45309',
    bg: 'linear-gradient(135deg, #FEF9E7 0%, #FFFBF0 100%)',
    border: '#FDE68A',
    btnBg: 'linear-gradient(135deg, #F59E0B, #B45309)',
    btnShadow: 'rgba(245,158,11,0.30)',
    path: (id) => `/my-courses/${id}/daily-questions`,
  },
  {
    key: 'papers',
    icon: '📝',
    title: 'Papers',
    description: 'Attempt past papers and mock exams to evaluate and improve your exam readiness.',
    color: '#1D4ED8',
    bg: 'linear-gradient(135deg, #EFF6FF 0%, #F5F8FF 100%)',
    border: '#BFDBFE',
    btnBg: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
    btnShadow: 'rgba(59,130,246,0.30)',
    path: (id) => `/my-courses/${id}/papers`,
  },
  {
  key: 'past-papers',
  icon: '🗂️',
  title: 'Past Papers',
  description: 'Browse and attempt real past exam papers year by year, including MCQ and essay sections with model answers.',
  color: '#1D4ED8',
  bg: 'linear-gradient(135deg, #EFF6FF 0%, #F5F8FF 100%)',
  border: '#BFDBFE',
  btnBg: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
  btnShadow: 'rgba(59,130,246,0.30)',
  path: (id) => `/my-courses/${id}/past-papers`,
  }
]

export default function CourseOverview() {
  const { courseId } = useParams()
  const navigate = useNavigate()

  return (
    <>
      <BaseStyles />
      <style>{`
        .co-section-card {
          background: white;
          border-radius: 24px;
          border: 1.5px solid #E8F5E9;
          padding: 32px 28px;
          display: flex;
          flex-direction: column;
          gap: 0;
          box-shadow: 0 2px 14px rgba(0,0,0,0.04);
          transition: transform 0.22s, box-shadow 0.22s;
          animation: fadeUp 0.4s ease both;
        }
        .co-section-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 42px rgba(0,0,0,0.08);
        }
        .co-section-card:nth-child(1) { animation-delay: 0.05s; }
        .co-section-card:nth-child(2) { animation-delay: 0.13s; }
        .co-section-card:nth-child(3) { animation-delay: 0.21s; }
        .co-section-card:nth-child(4) { animation-delay: 0.29s; }
        .co-section-card:nth-child(5) { animation-delay: 0.37s; }

        .co-go-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 7px;
          font-size: 0.88rem; font-weight: 700;
          padding: 11px 22px; border-radius: 50px; border: none;
          cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif;
          color: white;
          transition: transform 0.16s, box-shadow 0.16s;
          margin-top: auto;
          width: 100%;
        }
        .co-go-btn:hover {
          transform: translateY(-2px);
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

          <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative' }}>

            {/* Back button */}
            <button
              onClick={() => navigate('/my-courses')}
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
              ← Back to My Courses
            </button>

            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: '#E8F5E9', color: '#2E7D32',
              fontWeight: 700, fontSize: '0.75rem',
              padding: '4px 13px', borderRadius: 50,
              letterSpacing: '0.07em', textTransform: 'uppercase',
              marginBottom: 14, border: '1.5px solid #A5D6A7',
              display: 'block',
            }}>
              🎓 Course Content
            </div>

            <h1 style={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
              color: '#1A3A1A', letterSpacing: '-0.02em',
              marginBottom: 8, lineHeight: 1.1,
            }}>
              What's in Your Course
            </h1>
            <p style={{ fontSize: '0.95rem', color: '#5A7A5A' }}>
              Select a section below to access your course resources.
            </p>
          </div>
        </section>

        {/* ── Section cards ── */}
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px 80px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 22,
          }}>
            {SECTIONS.map(section => (
              <div key={section.key} className="co-section-card">

                {/* Icon block */}
                <div style={{
                  width: 58, height: 58, borderRadius: 18,
                  background: section.bg,
                  border: `1.5px solid ${section.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.7rem', marginBottom: 20,
                }}>
                  {section.icon}
                </div>

                <h2 style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 900, fontSize: '1.2rem',
                  color: '#1A3A1A', marginBottom: 10, lineHeight: 1.2,
                }}>
                  {section.title}
                </h2>

                <p style={{
                  fontSize: '0.85rem', color: '#5A7A5A',
                  lineHeight: 1.6, marginBottom: 24, flex: 1,
                }}>
                  {section.description}
                </p>

                <button
                  className="co-go-btn"
                  style={{
                    background: section.btnBg,
                    boxShadow: `0 4px 14px ${section.btnShadow}`,
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = `0 8px 22px ${section.btnShadow}`}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = `0 4px 14px ${section.btnShadow}`}
                  onClick={() => navigate(section.path(courseId))}
                >
                  {section.icon} Go to {section.title} →
                </button>
              </div>
            ))}
          </div>
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
        from { opacity: 0; transform: translateY(18px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `}</style>
  )
}