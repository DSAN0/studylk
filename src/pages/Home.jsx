import { useNavigate } from 'react-router-dom'
import StreamCard from '../components/StreamCard'
import { useApp } from '../context/AppContext'

/* ── Data (swap with API calls once backend is ready) ── */
const STREAMS = [
  {
    id: 'science',
    name: 'Science',
    icon: '🔬',
    desc: 'Physics, Chemistry, Biology, Combined Maths and more for the science stream.',
    subjectCount: 16,
    materialCount: 94,
  },
  {
    id: 'commerce',
    name: 'Commerce',
    icon: '📊',
    desc: 'Economics, Accounting, Business Studies, Statistics and more.',
    subjectCount: 12,
    materialCount: 76,
  },
  {
    id: 'arts',
    name: 'Arts',
    icon: '🎨',
    desc: 'History, Geography, Political Science, Sinhala, Logic and more.',
    subjectCount: 18,
    materialCount: 65,
  },
  {
    id: 'technology',
    name: 'Technology',
    icon: '⚙️',
    desc: 'Engineering Technology, Bio Systems Technology, Science for Tech and more.',
    subjectCount: 10,
    materialCount: 52,
  },
]

const EXPLORE_GRADES = [
  {
    id: 'al',
    label: 'G.C.E. A/L',
    subtitle: 'Grade 12 & 13',
    badge: '4 Streams · 30+ Subjects',
    icon: '🎓',
    desc: 'Science, Commerce, Arts & Technology streams with full past papers, model papers & revision notes.',
    to: '/explore/al',
    gradient: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 60%, #43A047 100%)',
    badgeBg: 'rgba(255,255,255,0.18)',
    badgeBorder: 'rgba(255,255,255,0.3)',
    shadow: '0 8px 30px rgba(46,125,50,0.22)',
  },
  {
    id: 'ol',
    label: 'G.C.E. O/L',
    subtitle: 'Grade 10 & 11',
    badge: '20+ Core Subjects',
    icon: '📘',
    desc: 'Maths, Science, English, Sinhala, History, ICT & commerce with comprehensive questions and answers.',
    to: '/explore/ol',
    gradient: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 60%, #1E88E5 100%)',
    badgeBg: 'rgba(255,255,255,0.18)',
    badgeBorder: 'rgba(255,255,255,0.3)',
    shadow: '0 8px 30px rgba(21,101,192,0.22)',
  },
  {
    id: 'grade5',
    label: 'Grade 5',
    subtitle: 'Scholarship Exam',
    badge: 'Scholarship Hub',
    icon: '⭐',
    desc: 'Specialized paper 1 & paper 2 past questions, model papers and evaluation schemes for young scholars.',
    to: '/explore/grade5',
    gradient: 'linear-gradient(135deg, #D97706 0%, #EA580C 60%, #F97316 100%)',
    badgeBg: 'rgba(255,255,255,0.18)',
    badgeBorder: 'rgba(255,255,255,0.3)',
    shadow: '0 8px 30px rgba(234,88,12,0.22)',
  },
]

const EXPLORE_CATEGORIES = [
  {
    title: 'Past Papers',
    desc: 'Official exam papers & MCQ practice',
    icon: '📄',
    to: '/explore/past-papers',
    badge: 'MCQ Practice',
    color: '#2E7D32',
    bg: '#F1F8F1',
    border: '#C8E6C9',
  },
  {
    title: 'Model Papers',
    desc: 'Structured questions & marking schemes',
    icon: '🏆',
    to: '/explore/model-papers',
    badge: 'Target Revision',
    color: '#D97706',
    bg: '#FFFBEB',
    border: '#FDE68A',
  },
  {
    title: 'School Papers',
    desc: 'Top schools term tests & provincial exams',
    icon: '🏫',
    to: '/explore/school-papers',
    badge: 'Term Tests',
    color: '#1D4ED8',
    bg: '#EFF6FF',
    border: '#BFDBFE',
  },
  {
    title: 'Study Notes',
    desc: 'Short notes, formulas & quick summaries',
    icon: '📋',
    to: '/explore/notes',
    badge: 'Summary Sheets',
    color: '#7C3AED',
    bg: '#F5F3FF',
    border: '#DDD6FE',
  },
]

const STATS = [
  { value: '4',     label: 'Streams',         icon: '📚' },
  { value: '56+',   label: 'Subjects',         icon: '📖' },
  { value: '287+',  label: 'Materials',        icon: '📄' },
  { value: '1.2k+', label: 'Students helped',  icon: '🎓' },
]

const HOW_STEPS = [
  { num: '01', title: 'Choose your stream',  desc: 'Select from Science, Commerce, Arts, or Technology to see all subjects available.', color: '#4CAF50' },
  { num: '02', title: 'Pick a subject',      desc: 'Browse subjects in your stream and choose the one you want to study.', color: '#66BB6A' },
  { num: '03', title: 'Preview contents',    desc: "View exactly what's included — topic list, page count, and what you'll get.", color: '#81C784' },
  { num: '04', title: 'Order via WhatsApp',  desc: "Tap the WhatsApp button and we'll deliver your materials straight to your phone.", color: '#25D366' },
]

const MATERIAL_TYPES = [
  {
    icon: '📄',
    type: 'Notes',
    accent: '#4CAF50',
    bg: '#F1F8F1',
    border: '#C8E6C9',
    tagBg: '#E8F5E9',
    tagText: '#2E7D32',
    desc: 'Comprehensive theory notes covering the full syllabus with diagrams, worked examples and revision summaries.',
    tags: ['Full syllabus', 'Diagrams', 'Exam tips'],
  },
  {
    icon: '📚',
    type: 'Tutorials',
    accent: '#F59E0B',
    bg: '#FFFBEB',
    border: '#FDE68A',
    tagBg: '#FEF3C7',
    tagText: '#92400E',
    desc: 'Step-by-step practice questions with full worked solutions, organised by topic and difficulty.',
    tags: ['Worked solutions', 'Topic-wise', 'Difficulty levels'],
  },
  {
    icon: '📝',
    type: 'Past Papers',
    accent: '#3B82F6',
    bg: '#EFF6FF',
    border: '#BFDBFE',
    tagBg: '#DBEAFE',
    tagText: '#1E40AF',
    desc: 'Complete collection of AL past papers with official marking schemes and model answers.',
    tags: ['Marking schemes', 'Model answers', 'Grade boundaries'],
  },
]

const TESTIMONIALS = [
  {
    name: 'Dinuki P.',
    stream: 'Science stream',
    text: 'The Physics notes are incredibly well-structured. I improved my grade from C to A within two months.',
    avatar: 'D',
    color: '#4CAF50',
  },
  {
    name: 'Kavindu R.',
    stream: 'Commerce stream',
    text: 'The past papers collection is exactly what I needed. Every paper had full marking schemes — so useful!',
    avatar: 'K',
    color: '#F59E0B',
  },
  {
    name: 'Nimasha S.',
    stream: 'Arts stream',
    text: 'History notes saved me so much time. Very easy to understand and really well-organised.',
    avatar: 'N',
    color: '#3B82F6',
  },
]

/* ─────────────────────────────────── */

export default function Home() {
  const navigate = useNavigate()
  const { buildWhatsAppLink } = useApp()

  return (
    <main style={{ minHeight: '100vh', background: '#F8FBF8', color: '#1A2E1A', fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" }}>

      {/* ── GOOGLE FONTS ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Nunito:wght@700;800;900&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .home-btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, #4CAF50, #2E7D32);
          color: white; font-weight: 700; font-size: 0.95rem;
          padding: 13px 26px; border-radius: 50px; border: none;
          cursor: pointer; text-decoration: none;
          box-shadow: 0 4px 20px rgba(76,175,80,0.35);
          transition: transform 0.18s, box-shadow 0.18s;
        }
        .home-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(76,175,80,0.45);
        }

        .home-btn-whatsapp {
          display: inline-flex; align-items: center; gap: 8px;
          background: #25D366; color: white; font-weight: 700; font-size: 0.95rem;
          padding: 13px 26px; border-radius: 50px; border: none;
          cursor: pointer; text-decoration: none;
          box-shadow: 0 4px 20px rgba(37,211,102,0.3);
          transition: transform 0.18s, box-shadow 0.18s;
        }
        .home-btn-whatsapp:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(37,211,102,0.42);
        }

        .home-btn-outline {
          display: inline-flex; align-items: center; gap: 8px;
          background: white; color: #2E7D32; font-weight: 700; font-size: 0.95rem;
          padding: 12px 26px; border-radius: 50px; border: 2px solid #4CAF50;
          cursor: pointer; text-decoration: none;
          transition: transform 0.18s, background 0.18s, color 0.18s;
        }
        .home-btn-outline:hover {
          background: #4CAF50; color: white; transform: translateY(-2px);
        }

        .home-explore-card {
          border-radius: 24px;
          padding: 32px 28px;
          color: white;
          cursor: pointer;
          transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.28s ease;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }
        .home-explore-card:hover {
          transform: translateY(-8px) scale(1.015);
        }
        .home-explore-shortcut {
          background: white;
          border-radius: 18px;
          padding: 20px 22px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
          box-shadow: 0 2px 10px rgba(0,0,0,0.03);
          text-decoration: none;
        }
        .home-explore-shortcut:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 28px rgba(0,0,0,0.08);
        }

        .stream-card-home {
          background: white;
          border: 1.5px solid #E8F5E9;
          border-radius: 20px;
          padding: 28px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
          box-shadow: 0 2px 12px rgba(76,175,80,0.06);
        }
        .stream-card-home:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 36px rgba(76,175,80,0.16);
          border-color: #A5D6A7;
        }

        .step-card {
          background: white;
          border: 1.5px solid #E8F5E9;
          border-radius: 20px;
          padding: 28px 24px;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 2px 10px rgba(0,0,0,0.04);
        }
        .step-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(76,175,80,0.12);
        }

        .material-card {
          background: white;
          border-radius: 20px;
          padding: 28px;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 2px 12px rgba(0,0,0,0.05);
        }
        .material-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 14px 40px rgba(0,0,0,0.1);
        }

        .testimonial-card {
          background: white;
          border-radius: 20px;
          padding: 28px;
          box-shadow: 0 2px 14px rgba(0,0,0,0.05);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .testimonial-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.1);
        }

        @keyframes floatUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-hero { animation: floatUp 0.7s ease both; }
        .animate-hero-delay { animation: floatUp 0.7s 0.15s ease both; }
        .animate-hero-delay2 { animation: floatUp 0.7s 0.3s ease both; }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        .live-dot { animation: pulse-dot 1.8s infinite; }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        .float-anim { animation: float 4s ease-in-out infinite; }
      `}</style>

      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: 80,
        paddingBottom: 60,
        background: 'linear-gradient(160deg, #F0FAF0 0%, #FAFFFE 50%, #F5F9FF 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* Decorative blobs */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-60px',
          width: 380, height: 380, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(76,175,80,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-40px', left: '-40px',
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        {/* Dots pattern */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(76,175,80,0.12) 1.5px, transparent 1.5px)',
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse 60% 70% at 80% 30%, black 0%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 70% at 80% 30%, black 0%, transparent 80%)',
        }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 48, alignItems: 'center' }}>

            {/* Left — text */}
            <div style={{ maxWidth: 600 }}>

              {/* Badge */}
              <div className="animate-hero" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#E8F5E9', border: '1.5px solid #A5D6A7',
                color: '#2E7D32', padding: '7px 16px', borderRadius: 50,
                fontSize: '0.83rem', fontWeight: 700, marginBottom: 24,
                letterSpacing: '0.01em',
              }}>
                <span className="live-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: '#4CAF50', display: 'inline-block' }} />
                🇱🇰 &nbsp; Made for Sri Lankan Students
              </div>

              {/* Headline */}
              <h1 className="animate-hero-delay" style={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 900,
                fontSize: 'clamp(2.6rem, 5.5vw, 4.2rem)',
                lineHeight: 1.1,
                color: '#1A3A1A',
                marginBottom: 20,
                letterSpacing: '-0.02em',
              }}>
                Your{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  shortcut
                </span>
                {' '}to<br />
                <span style={{
                  background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  Academic success
                </span>
              </h1>

              {/* Subtitle */}
              <p className="animate-hero-delay2" style={{
                fontSize: '1.08rem', color: '#4A6A4A', lineHeight: 1.7,
                marginBottom: 36, maxWidth: 480,
              }}>
                Learn, practice, and prepare with quality study resources made for students across Sri Lanka.               
              </p>

              {/* CTAs */}
              <div className="animate-hero-delay2" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 52 }}>
                <button className="home-btn-primary" onClick={() => navigate('/streams')}>
                  Browse Courses →
                </button>
                <a
                  href={buildWhatsAppLink('Hi! I need help finding study materials for my A/L subjects.')}
                  target="_blank" rel="noreferrer"
                  className="home-btn-whatsapp"
                >
                  <WhatsAppIcon />
                  Chat with us
                </a>
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28 }}>
                {STATS.map(s => (
                  <div key={s.label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: '1.4rem' }}>{s.icon}</span>
                      <span style={{
                        fontFamily: "'Nunito', sans-serif",
                        fontWeight: 900, fontSize: '1.7rem',
                        color: '#2E7D32', lineHeight: 1,
                      }}>{s.value}</span>
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#7A9A7A', fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase' }}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — floating illustration card */}
            <div className="float-anim" style={{
              display: 'none',
              '@media (min-width: 900px)': { display: 'block' },
            }}>
              <HeroIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* ── EXPLORE SECTION ── */}
      <section style={{
        padding: '84px 24px',
        background: 'linear-gradient(180deg, #F0FAF0 0%, #F8FBF8 50%, #FFFFFF 100%)',
        borderTop: '1px solid #E8F5E9',
        borderBottom: '1px solid #E8F5E9',
        position: 'relative',
      }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          
          <SectionHeader
            eyebrow="🔍 Free Study Resources"
            title="Explore Past Papers, Model Papers & Study Notes"
            desc="Select your grade or jump straight to our categorized library of official past papers, model papers, and revision notes."
          />

          {/* 3 Major Grade Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
            marginBottom: 32,
          }}>
            {EXPLORE_GRADES.map(grade => (
              <div
                key={grade.id}
                className="home-explore-card"
                style={{
                  background: grade.gradient,
                  boxShadow: grade.shadow,
                }}
                onClick={() => navigate(grade.to)}
              >
                {/* Decorative background glow */}
                <div style={{
                  position: 'absolute', top: -30, right: -30, width: 130, height: 130,
                  borderRadius: '50%', background: 'rgba(255,255,255,0.14)',
                  pointerEvents: 'none',
                }} />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <span style={{ fontSize: '2.8rem', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.2))' }}>
                    {grade.icon}
                  </span>
                  <span style={{
                    fontSize: '0.78rem', fontWeight: 700,
                    background: grade.badgeBg, border: `1px solid ${grade.badgeBorder}`,
                    color: 'white', padding: '5px 12px', borderRadius: 50,
                    backdropFilter: 'blur(6px)',
                  }}>
                    {grade.badge}
                  </span>
                </div>

                <div style={{ marginBottom: 4 }}>
                  <span style={{
                    fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.06em',
                    textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)',
                  }}>
                    {grade.subtitle}
                  </span>
                </div>

                <h3 style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 900, fontSize: '1.8rem',
                  color: 'white', marginBottom: 12, lineHeight: 1.1,
                }}>
                  {grade.label}
                </h3>

                <p style={{
                  fontSize: '0.88rem', color: 'rgba(255,255,255,0.9)',
                  lineHeight: 1.6, marginBottom: 26, flex: 1,
                }}>
                  {grade.desc}
                </p>

                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.2)',
                }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'white' }}>
                    Explore {grade.label}
                  </span>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.95rem',
                  }}>
                    →
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 4 Category Shortcuts Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 16,
            marginBottom: 32,
          }}>
            {EXPLORE_CATEGORIES.map(cat => (
              <div
                key={cat.title}
                className="home-explore-shortcut"
                style={{ border: `1.5px solid ${cat.border}` }}
                onClick={() => navigate(cat.to)}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: cat.bg, border: `1px solid ${cat.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', flexShrink: 0,
                }}>
                  {cat.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1A3A1A' }}>
                      {cat.title}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#6A8A6A', lineHeight: 1.4 }}>
                    {cat.desc}
                  </div>
                </div>
                <span style={{ color: cat.color, fontWeight: 800, fontSize: '1.1rem' }}>›</span>
              </div>
            ))}
          </div>

          {/* Centered Explore Hub action */}
          <div style={{
            background: 'white',
            borderRadius: 20,
            border: '1.5px solid #E8F5E9',
            padding: '24px 32px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 18,
            boxShadow: '0 4px 20px rgba(76,175,80,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: '2rem' }}>📚</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#1A3A1A' }}>
                  Looking for everything in one place?
                </div>
                <div style={{ fontSize: '0.85rem', color: '#5A7A5A' }}>
                  Visit the full Explore Hub to search across all grades, subjects, and resource collections.
                </div>
              </div>
            </div>
            <button
              className="home-btn-outline"
              style={{ padding: '11px 24px', fontSize: '0.9rem' }}
              onClick={() => navigate('/explore')}
            >
              Open Explore Hub →
            </button>
          </div>

        </div>
      </section>

      {/* ── STREAMS ── */}
      <section style={{ padding: '88px 24px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <SectionHeader
            eyebrow="All Courses"
            title="What are you studying?"
            desc="Choose your A/L stream to find exactly the materials you need."
          />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 20,
          }}>
            {STREAMS.map(stream => (
              <div
                key={stream.id}
                className="stream-card-home"
                onClick={() => navigate(`/streams/${stream.id}`)}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: '#F1F8F1', border: '1.5px solid #C8E6C9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.6rem', marginBottom: 18,
                }}>
                  {stream.icon}
                </div>
                <h3 style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1A3A1A', marginBottom: 8 }}>
                  {stream.name}
                </h3>
                <p style={{ fontSize: '0.87rem', color: '#5A7A5A', lineHeight: 1.65, marginBottom: 18 }}>
                  {stream.desc}
                </p>
                <div style={{ display: 'flex', gap: 12 }}>
                  <Pill label={`${stream.subjectCount} subjects`} />
                  <Pill label={`${stream.materialCount} materials`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{
        padding: '88px 24px',
        background: 'linear-gradient(160deg, #F0FAF0 0%, #F8FBF8 100%)',
      }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <SectionHeader
            eyebrow="Simple process"
            title="How to select course"
            desc="Getting your study materials is quick, easy, and done right on WhatsApp."
          />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 20,
            marginBottom: 44,
          }}>
            {HOW_STEPS.map((step, i) => (
              <div key={i} className="step-card">
                <div style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 900, fontSize: '3rem',
                  color: step.color, opacity: 0.18,
                  lineHeight: 1, marginBottom: 12,
                }}>
                  {step.num}
                </div>
                <div style={{
                  width: 36, height: 4, borderRadius: 2,
                  background: step.color, marginBottom: 14, opacity: 0.6,
                }} />
                <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#1A3A1A', marginBottom: 8 }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '0.87rem', color: '#5A7A5A', lineHeight: 1.65 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button className="home-btn-primary" onClick={() => navigate('/streams')}>
              Start browsing →
            </button>
          </div>
        </div>
      </section>

      {/* ── MATERIAL TYPES ── */}
      <section style={{ padding: '88px 24px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <SectionHeader
            eyebrow="What you get"
            title="Three types of materials"
            desc="Every subject has notes, tutorial packs, and past paper collections — buy what you need."
          />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20,
          }}>
            {MATERIAL_TYPES.map(m => (
              <div
                key={m.type}
                className="material-card"
                style={{ border: `1.5px solid ${m.border}` }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: m.bg, border: `1.5px solid ${m.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.7rem', marginBottom: 20,
                }}>
                  {m.icon}
                </div>
                <h3 style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1A3A1A', marginBottom: 10 }}>
                  {m.type}
                </h3>
                <p style={{ fontSize: '0.87rem', color: '#5A7A5A', lineHeight: 1.7, marginBottom: 20 }}>
                  {m.desc}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {m.tags.map(tag => (
                    <span key={tag} style={{
                      fontSize: '0.78rem', fontWeight: 600,
                      padding: '4px 12px', borderRadius: 50,
                      background: m.tagBg, color: m.tagText,
                      border: `1px solid ${m.border}`,
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{
        padding: '88px 24px',
        background: 'linear-gradient(160deg, #F0FAF0 0%, #F8FBF8 100%)',
      }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <SectionHeader
            eyebrow="Student reviews"
            title="What students say"
          />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20,
          }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testimonial-card">
                {/* Stars */}
                <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
                  {[...Array(5)].map((_, j) => (
                    <span key={j} style={{ color: '#F59E0B', fontSize: '1rem' }}>★</span>
                  ))}
                </div>
                <p style={{
                  fontSize: '0.92rem', color: '#3A5A3A', lineHeight: 1.75,
                  fontStyle: 'italic', marginBottom: 22, flex: 1,
                }}>
                  "{t.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: t.color, color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: '0.95rem', flexShrink: 0,
                  }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#1A3A1A' }}>{t.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#7A9A7A', fontWeight: 500 }}>{t.stream}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{
        padding: '80px 24px',
        background: 'linear-gradient(135deg, #E8F5E9 0%, #E3F2FD 100%)',
      }}>
        <div style={{ maxWidth: 620, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            fontSize: '2.8rem', marginBottom: 16,
          }}>🎓</div>
          <h2 style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(1.7rem, 4vw, 2.4rem)',
            color: '#1A3A1A', marginBottom: 14,
            lineHeight: 1.2,
          }}>
            Ready to level up your results?
          </h2>
          <p style={{
            fontSize: '1rem', color: '#4A6A4A', lineHeight: 1.7, marginBottom: 36,
          }}>
            Browse hundreds of materials across all four streams.
            Delivered straight to your WhatsApp.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            <button className="home-btn-primary" onClick={() => navigate('/streams')}>
              Browse all materials →
            </button>
            <a
              href={buildWhatsAppLink('Hi! I would like to know more about your study materials.')}
              target="_blank" rel="noreferrer"
              className="home-btn-whatsapp"
            >
              <WhatsAppIcon />
              Ask on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        padding: '52px 24px 32px',
        borderTop: '1.5px solid #E8F5E9',
        background: '#FFFFFF',
      }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 900, fontSize: '1.7rem',
            color: '#2E7D32', marginBottom: 10,
          }}>
            Study<span style={{ color: '#1A3A1A' }}>LK</span>
          </div>
          <p style={{
            fontSize: '0.88rem', color: '#7A9A7A', lineHeight: 1.7,
            maxWidth: 360, margin: '0 auto 24px',
          }}>
            Premium study materials for Sri Lankan students.
            <br />Delivered via WhatsApp — fast, easy and affordable.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center', marginBottom: 24 }}>
            {[
              { label: 'Browse', action: () => navigate('/streams') },
              { label: 'How it works', action: () => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }) },
            ].map(link => (
              <button
                key={link.label}
                onClick={link.action}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '0.88rem', color: '#7A9A7A', fontWeight: 600,
                  padding: '7px 14px', borderRadius: 8,
                  transition: 'color 0.2s, background 0.2s',
                }}
                onMouseEnter={e => { e.target.style.color = '#2E7D32'; e.target.style.background = '#F1F8F1'; }}
                onMouseLeave={e => { e.target.style.color = '#7A9A7A'; e.target.style.background = 'none'; }}
              >
                {link.label}
              </button>
            ))}
            <a
              href={buildWhatsAppLink('Hi!')}
              target="_blank" rel="noreferrer"
              style={{
                fontSize: '0.88rem', color: '#7A9A7A', fontWeight: 600,
                padding: '7px 14px', borderRadius: 8, textDecoration: 'none',
                transition: 'color 0.2s',
              }}
            >
              Contact
            </a>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#AACAAA' }}>
            © {new Date().getFullYear()} StudyLK. All rights reserved.
          </p>
        </div>
      </footer>

    </main>
  )
}

/* ── Sub-components ── */

function SectionHeader({ eyebrow, title, desc }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 52 }}>
      {eyebrow && (
        <div style={{
          display: 'inline-block',
          background: '#E8F5E9', color: '#2E7D32',
          fontWeight: 700, fontSize: '0.78rem',
          padding: '5px 14px', borderRadius: 50,
          letterSpacing: '0.07em', textTransform: 'uppercase',
          marginBottom: 14,
        }}>
          {eyebrow}
        </div>
      )}
      <h2 style={{
        fontFamily: "'Nunito', sans-serif",
        fontWeight: 900,
        fontSize: 'clamp(1.7rem, 3.5vw, 2.4rem)',
        color: '#1A3A1A',
        marginBottom: desc ? 14 : 0,
        letterSpacing: '-0.01em',
      }}>
        {title}
      </h2>
      {desc && (
        <p style={{
          fontSize: '1rem', color: '#5A7A5A', maxWidth: 520,
          margin: '0 auto', lineHeight: 1.7,
        }}>
          {desc}
        </p>
      )}
    </div>
  )
}

function Pill({ label }) {
  return (
    <span style={{
      fontSize: '0.75rem', fontWeight: 600,
      padding: '3px 10px', borderRadius: 50,
      background: '#F1F8F1', color: '#4CAF50',
      border: '1px solid #C8E6C9',
    }}>
      {label}
    </span>
  )
}

function HeroIllustration() {
  return (
    <div style={{
      width: 300, height: 300,
      background: 'linear-gradient(135deg, #E8F5E9, #E3F2FD)',
      borderRadius: 32, padding: 28,
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      gap: 16,
      boxShadow: '0 16px 60px rgba(76,175,80,0.15)',
      border: '1.5px solid #C8E6C9',
    }}>
      <div style={{ fontSize: '4rem' }}>🎓</div>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { label: 'Lesson 1 — Physics', color: '#4CAF50', w: '100%' },
          { label: 'Lesson 2 — Chemistry', color: '#F59E0B', w: '80%' },
          { label: 'Lesson 3 — Maths', color: '#3B82F6', w: '90%' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1A3A1A' }}>{item.label}</div>
            <div style={{ height: 6, borderRadius: 3, background: '#E0E0E0', overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: item.w,
                background: `linear-gradient(90deg, ${item.color}, ${item.color}88)`,
                borderRadius: 3,
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}