import { Link } from 'react-router-dom'

const papers = [
  { id: 1, year: 2023, subject: 'Combined Maths', stream: 'Physical Science', grade: 'A/L', icon: '📐' },
  { id: 2, year: 2022, subject: 'Physics', stream: 'Physical Science', grade: 'A/L', icon: '⚛️' },
  { id: 3, year: 2023, subject: 'Biology', stream: 'Biological Science', grade: 'A/L', icon: '🧬' },
  { id: 4, year: 2022, subject: 'Chemistry', stream: 'Physical Science', grade: 'A/L', icon: '🧪' },
  { id: 5, year: 2023, subject: 'Economics', stream: 'Commerce', grade: 'A/L', icon: '📊' },
  { id: 6, year: 2022, subject: 'Business Studies', stream: 'Commerce', grade: 'A/L', icon: '💼' },
  { id: 7, year: 2023, subject: 'Mathematics', stream: 'General', grade: 'O/L', icon: '🔢' },
  { id: 8, year: 2022, subject: 'Science', stream: 'General', grade: 'O/L', icon: '🔬' },
]

const streams = ['All', 'Physical Science', 'Biological Science', 'Commerce', 'General']

export default function ExplorePastPapers() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0faf0 0%, #e8f5e9 50%, #f1f8e9 100%)', paddingTop: 88 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .epp-root { font-family: 'Plus Jakarta Sans', sans-serif; }

        .epp-hero {
          background: linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #388E3C 100%);
          padding: 64px 24px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .epp-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .epp-hero h1 {
          font-family: 'Nunito', sans-serif;
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 900;
          color: white;
          margin: 0 0 12px;
          position: relative;
        }
        .epp-hero p {
          color: rgba(255,255,255,0.85);
          font-size: 1.1rem;
          max-width: 560px;
          margin: 0 auto 32px;
          position: relative;
        }
        .epp-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.25);
          color: white;
          font-size: 0.82rem;
          font-weight: 700;
          padding: 6px 16px;
          border-radius: 50px;
          margin-bottom: 20px;
          position: relative;
        }

        .epp-body {
          max-width: 1200px;
          margin: 0 auto;
          padding: 48px 24px;
        }

        .epp-filters {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 36px;
        }
        .epp-filter-btn {
          padding: 8px 20px;
          border-radius: 50px;
          border: 2px solid #C8E6C9;
          background: white;
          color: #5A7A5A;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .epp-filter-btn:hover, .epp-filter-btn.active {
          background: #2E7D32;
          border-color: #2E7D32;
          color: white;
        }

        .epp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }
        .epp-card {
          background: white;
          border-radius: 20px;
          padding: 28px;
          border: 1.5px solid #E8F5E9;
          box-shadow: 0 4px 20px rgba(76,175,80,0.06);
          transition: transform 0.22s, box-shadow 0.22s;
          cursor: pointer;
          text-decoration: none;
          display: block;
          color: inherit;
        }
        .epp-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 40px rgba(76,175,80,0.15);
          border-color: #A5D6A7;
        }
        .epp-card-icon {
          font-size: 2.2rem;
          margin-bottom: 14px;
        }
        .epp-card-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #1A3A1A;
          margin-bottom: 6px;
        }
        .epp-card-sub {
          font-size: 0.85rem;
          color: #6A8A6A;
          margin-bottom: 16px;
        }
        .epp-card-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .epp-tag {
          font-size: 0.78rem;
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 50px;
          background: #E8F5E9;
          color: #2E7D32;
        }
        .epp-tag.year { background: #FFF3E0; color: #E65100; }

        .epp-section-title {
          font-family: 'Nunito', sans-serif;
          font-size: 1.5rem;
          font-weight: 800;
          color: #1A3A1A;
          margin-bottom: 24px;
        }
      `}</style>

      <div className="epp-root">
        {/* Hero */}
        <div className="epp-hero">
          <div className="epp-badge">📄 Past Papers</div>
          <h1>Past Examination Papers</h1>
          <p>Access years of A/L and O/L past papers to master your exam preparation.</p>
        </div>

        {/* Body */}
        <div className="epp-body">
          {/* Filters */}
          <div className="epp-filters">
            {streams.map(s => (
              <button key={s} className="epp-filter-btn active">{s}</button>
            ))}
          </div>

          <div className="epp-section-title">Available Past Papers</div>

          <div className="epp-grid">
            {papers.map(p => (
              <Link key={p.id} to="/streams" className="epp-card">
                <div className="epp-card-icon">{p.icon}</div>
                <div className="epp-card-title">{p.subject}</div>
                <div className="epp-card-sub">{p.stream}</div>
                <div className="epp-card-tags">
                  <span className="epp-tag">{p.grade}</span>
                  <span className="epp-tag year">{p.year}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
