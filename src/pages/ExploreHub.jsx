import { Link } from 'react-router-dom'

const GRADES = [
  {
    id: 'al',
    label: 'A/L',
    fullName: 'Advanced Level',
    subtitle: 'Grade 12 & 13',
    emoji: '🎓',
    desc: 'Science, Commerce, Arts & Technology streams. Choose your stream and subject for past papers, model papers, school papers, and notes.',
    route: '/explore/al',
    gradient: 'linear-gradient(145deg, #1B5E20 0%, #2E7D32 55%, #43A047 100%)',
    shadow: 'rgba(46,125,50,0.40)',
    tag: '4 Streams · 30+ Subjects',
  },
  {
    id: 'ol',
    label: 'O/L',
    fullName: 'Ordinary Level',
    subtitle: 'Grade 10 & 11',
    emoji: '📘',
    desc: 'Mathematics, Science, English, History and all other Ordinary Level subjects with a rich library of resources.',
    route: '/explore/ol',
    gradient: 'linear-gradient(145deg, #0D47A1 0%, #1565C0 55%, #1976D2 100%)',
    shadow: 'rgba(21,101,192,0.40)',
    tag: '20+ Subjects',
  },
  {
    id: 'grade5',
    label: 'Grade 5',
    fullName: 'Scholarship Exam',
    subtitle: 'Scholarship Examination',
    emoji: '⭐',
    desc: 'Past papers for the Grade 5 Scholarship Examination — Maths, Language, Environment & General Competency.',
    route: '/explore/grade5',
    gradient: 'linear-gradient(145deg, #BF360C 0%, #E64A19 55%, #FF5722 100%)',
    shadow: 'rgba(230,74,25,0.40)',
    tag: 'Scholarship Papers',
  },
]

const S = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(160deg,#f0fdf4 0%,#ecfdf5 40%,#f0faf0 100%)',
    paddingTop: 88,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  hero: {
    background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 55%, #388E3C 100%)',
    padding: '72px 24px 68px',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 7,
    background: 'rgba(255,255,255,0.14)',
    border: '1.5px solid rgba(255,255,255,0.28)',
    color: 'white',
    fontSize: '0.8rem',
    fontWeight: 700,
    padding: '7px 20px',
    borderRadius: 50,
    marginBottom: 22,
    position: 'relative',
    backdropFilter: 'blur(10px)',
  },
  heroH1: {
    fontFamily: "'Nunito', sans-serif",
    fontSize: 'clamp(2.2rem, 5.5vw, 3.4rem)',
    fontWeight: 900,
    color: 'white',
    margin: '0 0 16px',
    position: 'relative',
    letterSpacing: '-0.5px',
    lineHeight: 1.12,
  },
  heroP: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: '1.05rem',
    maxWidth: 520,
    margin: '0 auto',
    position: 'relative',
    lineHeight: 1.72,
  },
  body: {
    maxWidth: 1140,
    margin: '0 auto',
    padding: '64px 24px 80px',
  },
  intro: {
    textAlign: 'center',
    marginBottom: 48,
  },
  stepTag: {
    display: 'inline-block',
    fontSize: '0.76rem',
    fontWeight: 800,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: '#2E7D32',
    background: '#e6f4ea',
    padding: '5px 16px',
    borderRadius: 50,
    marginBottom: 14,
  },
  sectionH: {
    fontFamily: "'Nunito', sans-serif",
    fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
    fontWeight: 900,
    color: '#1A3A1A',
    margin: 0,
    lineHeight: 1.25,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 28,
  },
  card: {
    borderRadius: 28,
    overflow: 'hidden',
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.32s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease',
    position: 'relative',
  },
  cardBody: {
    padding: '44px 32px 32px',
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  emoji: {
    fontSize: '3.4rem',
    marginBottom: 18,
    display: 'block',
    position: 'relative',
    filter: 'drop-shadow(0 4px 14px rgba(0,0,0,0.28))',
  },
  gradeLabel: {
    fontFamily: "'Nunito', sans-serif",
    fontSize: '2.8rem',
    fontWeight: 900,
    color: 'white',
    lineHeight: 1,
    marginBottom: 4,
    position: 'relative',
  },
  gradeFullName: {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: 'rgba(255,255,255,0.72)',
    marginBottom: 5,
    position: 'relative',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  gradeSub: {
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.55)',
    marginBottom: 20,
    position: 'relative',
  },
  gradeDesc: {
    fontSize: '0.92rem',
    color: 'rgba(255,255,255,0.88)',
    lineHeight: 1.7,
    position: 'relative',
    margin: 0,
  },
  cardFooter: {
    padding: '20px 32px',
    background: 'rgba(0,0,0,0.18)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTop: '1px solid rgba(255,255,255,0.12)',
  },
  chip: {
    fontSize: '0.78rem',
    fontWeight: 700,
    color: 'rgba(255,255,255,0.92)',
    background: 'rgba(255,255,255,0.16)',
    border: '1px solid rgba(255,255,255,0.22)',
    padding: '5px 14px',
    borderRadius: 50,
  },
  cta: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: '0.88rem',
    fontWeight: 700,
    color: 'white',
  },
  ctaArrow: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.22)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.9rem',
  },
  statsBar: {
    display: 'flex',
    justifyContent: 'center',
    gap: 48,
    marginTop: 64,
    padding: 32,
    background: 'white',
    borderRadius: 20,
    border: '1.5px solid #E8F5E9',
    boxShadow: '0 4px 24px rgba(46,125,50,0.07)',
    flexWrap: 'wrap',
  },
  statNum: {
    fontFamily: "'Nunito', sans-serif",
    fontSize: '1.9rem',
    fontWeight: 900,
    color: '#2E7D32',
    display: 'block',
    lineHeight: 1,
  },
  statLbl: {
    fontSize: '0.82rem',
    fontWeight: 600,
    color: '#7A9A7A',
    marginTop: 5,
    display: 'block',
  },
}

export default function ExploreHub() {
  return (
    <div style={S.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .ehub-card:hover { transform: translateY(-14px) scale(1.025) !important; }
        .ehub-card:hover .ehub-cta-arrow { background: rgba(255,255,255,0.38) !important; }
        @media (max-width: 640px) {
          .ehub-grid { grid-template-columns: 1fr !important; }
          .ehub-stats { gap: 24px !important; }
        }
      `}</style>

      {/* Hero */}
      <div style={S.hero}>
        <div style={S.heroBadge}>🔍 Explore Resources</div>
        <h1 style={S.heroH1}>What are you studying for?</h1>
        <p style={S.heroP}>Select your grade level to browse past papers, model papers, school papers, and notes tailored for your exam.</p>
      </div>

      {/* Grade Cards */}
      <div style={S.body}>
        <div style={S.intro}>
          <div style={S.stepTag}>Step 1 of 3 — Select Grade</div>
          <h2 style={S.sectionH}>Which examination are you preparing for?</h2>
        </div>

        <div className="ehub-grid" style={S.grid}>
          {GRADES.map(g => (
            <Link
              key={g.id}
              to={g.route}
              className="ehub-card"
              style={{ ...S.card, background: g.gradient, boxShadow: `0 24px 64px ${g.shadow}` }}
            >
              <div style={S.cardBody}>
                {/* decorative bubble */}
                <div style={{
                  position: 'absolute', width: 220, height: 220,
                  borderRadius: '50%', top: -70, right: -70,
                  background: 'rgba(255,255,255,0.07)', pointerEvents: 'none',
                }} />
                <span style={S.emoji}>{g.emoji}</span>
                <div style={S.gradeLabel}>{g.label}</div>
                <div style={S.gradeFullName}>{g.fullName}</div>
                <div style={S.gradeSub}>{g.subtitle}</div>
                <p style={S.gradeDesc}>{g.desc}</p>
              </div>
              <div style={S.cardFooter}>
                <span style={S.chip}>{g.tag}</span>
                <span style={S.cta}>
                  Select Grade
                  <span className="ehub-cta-arrow" style={S.ctaArrow}>→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Stats bar */}
        <div className="ehub-stats" style={S.statsBar}>
          {[
            { num: '3', lbl: 'Exam Levels' },
            { num: '500+', lbl: 'Past Papers' },
            { num: '30+', lbl: 'Subjects' },
            { num: '4', lbl: 'Resource Types' },
          ].map(s => (
            <div key={s.lbl} style={{ textAlign: 'center' }}>
              <span style={S.statNum}>{s.num}</span>
              <span style={S.statLbl}>{s.lbl}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
