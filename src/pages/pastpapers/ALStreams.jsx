import { Link } from 'react-router-dom';

const STREAMS = [
  {
    id: 'science',
    name: 'Science',
    emoji: '🔬',
    subjectCount: 7,
    previewSubjects: ['Combined Mathematics', 'Physics', 'Chemistry', 'Biology', 'ICT'],
    desc: 'Pure and applied sciences covering mathematics, physics, chemistry, and life sciences.',
    accentColor: '#2196F3',
    lightBg: '#E3F2FD',
    badgeColor: '#1565C0',
  },
  {
    id: 'commerce',
    name: 'Commerce',
    emoji: '📊',
    subjectCount: 6,
    previewSubjects: ['Business Studies', 'Accounting', 'Economics', 'Business Statistics'],
    desc: 'Business, finance, and economic subjects for students pursuing a commerce career.',
    accentColor: '#9C27B0',
    lightBg: '#F3E5F5',
    badgeColor: '#6A1B9A',
  },
  {
    id: 'arts',
    name: 'Arts',
    emoji: '🎨',
    subjectCount: 8,
    previewSubjects: ['History', 'Geography', 'Political Science', 'Logic & Scientific Method'],
    desc: 'Humanities, social sciences, and creative arts subjects for arts stream students.',
    accentColor: '#E64A19',
    lightBg: '#FBE9E7',
    badgeColor: '#BF360C',
  },
  {
    id: 'tech',
    name: 'Technology',
    emoji: '⚙️',
    subjectCount: 5,
    previewSubjects: ['Engineering Technology', 'ICT', 'Bio-systems Technology'],
    desc: 'Practical technology and engineering subjects for students with a technical focus.',
    accentColor: '#2E7D32',
    lightBg: '#E8F5E9',
    badgeColor: '#1B5E20',
  },
];

export default function ALStreams() {
  return (
    <div className="als-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .als-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background-color: #f8fafc;
          min-height: 100vh;
          color: #0f172a;
        }

        /* Layout Container */
        .als-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Navigation / Breadcrumb */
        .als-nav-bar {
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          padding: 14px 0;
        }

        .als-bread {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.875rem;
        }

        .als-bread a {
          color: #475569;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .als-bread a:hover {
          color: #0f172a;
        }

        .als-bread-sep {
          color: #94a3b8;
        }

        .als-bread-cur {
          color: #0f172a;
          font-weight: 600;
        }

        /* Hero Header */
        .als-hero {
          padding: 48px 0 32px;
          text-align: center;
        }

        .als-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #e2e8f0;
          color: #334155;
          font-size: 0.8125rem;
          font-weight: 700;
          padding: 6px 14px;
          border-radius: 9999px;
          margin-bottom: 16px;
        }

        .als-hero h1 {
          font-size: clamp(2rem, 4vw, 2.75rem);
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.025em;
          margin: 0 0 12px;
        }

        .als-hero p {
          color: #475569;
          font-size: 1.0625rem;
          max-width: 580px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Stream Cards Grid */
        .als-grid-section {
          padding-bottom: 64px;
        }

        .als-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-top: 24px;
        }

        .als-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }

        .als-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px -4px rgba(15, 23, 42, 0.08);
          border-color: var(--card-accent);
        }

        .als-card:focus-visible {
          outline: 3px solid var(--card-accent);
          outline-offset: 2px;
        }

        .als-card-top-bar {
          height: 6px;
          background-color: var(--card-accent);
          width: 100%;
        }

        .als-card-body {
          padding: 24px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .als-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .als-stream-emoji {
          font-size: 2rem;
          line-height: 1;
          padding: 10px;
          background: var(--card-light-bg);
          border-radius: 12px;
        }

        .als-count-chip {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--card-badge);
          background: var(--card-light-bg);
          padding: 4px 10px;
          border-radius: 9999px;
        }

        .als-stream-name {
          font-size: 1.375rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .als-stream-desc {
          font-size: 0.875rem;
          color: #64748b;
          line-height: 1.5;
          margin: 0 0 20px;
          flex: 1;
        }

        .als-subjects-preview {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 8px;
        }

        .als-sub-tag {
          font-size: 0.75rem;
          font-weight: 500;
          color: #334155;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          padding: 3px 10px;
          border-radius: 6px;
        }

        .als-card-foot {
          padding: 16px 24px;
          background: #f8fafc;
          border-top: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .als-select-text {
          font-size: 0.875rem;
          font-weight: 700;
          color: #0f172a;
        }

        .als-select-arrow {
          font-size: 1.1rem;
          color: var(--card-accent);
          transition: transform 0.2s ease;
        }

        .als-card:hover .als-select-arrow {
          transform: translateX(4px);
        }

        @media (max-width: 640px) {
          .als-hero { padding: 32px 0 20px; }
          .als-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Navigation / Breadcrumb */}
      <nav className="als-nav-bar" aria-label="Breadcrumb">
        <div className="als-container">
          <div className="als-bread">
            <Link to="/explore/past-papers">Past Papers</Link>
            <span className="als-bread-sep">/</span>
            <span className="als-bread-cur" aria-current="page">Advanced Level (A/L)</span>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="als-hero">
        <div className="als-container">
          <span className="als-hero-badge">🎓 Advanced Level</span>
          <h1>A/L Past Papers</h1>
          <p>Choose your academic stream to access organized subject-specific past papers and marking schemes.</p>
        </div>
      </header>

      {/* Stream Selection */}
      <main className="als-container als-grid-section">
        <div className="als-grid" role="list">
          {STREAMS.map((st) => (
            <Link
              key={st.id}
              to={`/explore/past-papers/al/${st.id}`}
              className="als-card"
              role="listitem"
              style={{
                '--card-accent': st.accentColor,
                '--card-light-bg': st.lightBg,
                '--card-badge': st.badgeColor,
              }}
            >
              <div className="als-card-top-bar" />
              <div className="als-card-body">
                <div className="als-card-header">
                  <span className="als-stream-emoji" role="img" aria-label={st.name}>
                    {st.emoji}
                  </span>
                  <span className="als-count-chip">{st.subjectCount} Subjects</span>
                </div>
                <h2 className="als-stream-name">{st.name}</h2>
                <p className="als-stream-desc">{st.desc}</p>
                <div className="als-subjects-preview">
                  {st.previewSubjects.map((sub) => (
                    <span key={sub} className="als-sub-tag">
                      {sub}
                    </span>
                  ))}
                  {st.subjectCount > st.previewSubjects.length && (
                    <span className="als-sub-tag">
                      +{st.subjectCount - st.previewSubjects.length} more
                    </span>
                  )}
                </div>
              </div>
              <div className="als-card-foot">
                <span className="als-select-text">Explore Papers</span>
                <span className="als-select-arrow" aria-hidden="true">→</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}