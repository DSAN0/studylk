import { Link } from 'react-router-dom'

const modelPapers = [
  { id: 1, title: 'Combined Maths Model Paper 1', subject: 'Combined Maths', difficulty: 'Hard', questions: 50, icon: '📐' },
  { id: 2, title: 'Physics Model Paper 2', subject: 'Physics', difficulty: 'Medium', questions: 40, icon: '⚛️' },
  { id: 3, title: 'Biology Model Paper 1', subject: 'Biology', difficulty: 'Medium', questions: 50, icon: '🧬' },
  { id: 4, title: 'Chemistry Model Paper 3', subject: 'Chemistry', difficulty: 'Hard', questions: 45, icon: '🧪' },
  { id: 5, title: 'Economics Model Paper 1', subject: 'Economics', difficulty: 'Easy', questions: 40, icon: '📊' },
  { id: 6, title: 'Business Studies Model Paper 2', subject: 'Business Studies', difficulty: 'Easy', questions: 50, icon: '💼' },
]

const diffColor = { Easy: '#4CAF50', Medium: '#FF9800', Hard: '#F44336' }
const diffBg   = { Easy: '#E8F5E9', Medium: '#FFF3E0', Hard: '#FFEBEE' }

export default function ExploreModelPapers() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0faf0 0%, #e8f5e9 50%, #f1f8e9 100%)', paddingTop: 88 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .emp-root { font-family: 'Plus Jakarta Sans', sans-serif; }

        .emp-hero {
          background: linear-gradient(135deg, #004D40 0%, #00695C 50%, #00796B 100%);
          padding: 64px 24px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .emp-hero::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(circle at 70% 50%, rgba(255,255,255,0.06) 0%, transparent 60%);
        }
        .emp-hero h1 {
          font-family: 'Nunito', sans-serif;
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 900;
          color: white;
          margin: 0 0 12px;
          position: relative;
        }
        .emp-hero p {
          color: rgba(255,255,255,0.85);
          font-size: 1.1rem;
          max-width: 560px;
          margin: 0 auto;
          position: relative;
        }
        .emp-badge {
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

        .emp-body {
          max-width: 1200px;
          margin: 0 auto;
          padding: 48px 24px;
        }
        .emp-section-title {
          font-family: 'Nunito', sans-serif;
          font-size: 1.5rem;
          font-weight: 800;
          color: #1A3A1A;
          margin-bottom: 28px;
        }

        .emp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }
        .emp-card {
          background: white;
          border-radius: 20px;
          border: 1.5px solid #E8F5E9;
          box-shadow: 0 4px 20px rgba(0,105,92,0.06);
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          transition: transform 0.22s, box-shadow 0.22s;
          display: block;
        }
        .emp-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 14px 40px rgba(0,105,92,0.14);
        }
        .emp-card-header {
          background: linear-gradient(135deg, #E0F2F1, #B2DFDB);
          padding: 24px 28px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .emp-icon {
          font-size: 2rem;
          background: white;
          width: 52px; height: 52px;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          flex-shrink: 0;
        }
        .emp-card-title { font-size: 1rem; font-weight: 700; color: #004D40; }
        .emp-card-sub { font-size: 0.84rem; color: #4CAF50; font-weight: 600; margin-top: 2px; }

        .emp-card-body { padding: 20px 28px 24px; }
        .emp-meta { display: flex; gap: 12px; align-items: center; margin-bottom: 18px; }
        .emp-diff-tag {
          font-size: 0.78rem;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 50px;
        }
        .emp-q-count {
          font-size: 0.84rem;
          color: #6A8A6A;
          font-weight: 600;
        }
        .emp-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, #00796B, #004D40);
          color: white;
          border: none;
          padding: 10px 22px;
          border-radius: 50px;
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          transition: transform 0.18s, box-shadow 0.18s;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .emp-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(0,121,107,0.35); }
      `}</style>

      <div className="emp-root">
        <div className="emp-hero">
          <div className="emp-badge">📝 Model Papers</div>
          <h1>Model Examination Papers</h1>
          <p>Practice with expertly crafted model papers designed to match exam standards.</p>
        </div>

        <div className="emp-body">
          <div className="emp-section-title">🎯 Browse Model Papers</div>
          <div className="emp-grid">
            {modelPapers.map(p => (
              <Link key={p.id} to="/streams" className="emp-card">
                <div className="emp-card-header">
                  <div className="emp-icon">{p.icon}</div>
                  <div>
                    <div className="emp-card-title">{p.title}</div>
                    <div className="emp-card-sub">{p.subject}</div>
                  </div>
                </div>
                <div className="emp-card-body">
                  <div className="emp-meta">
                    <span className="emp-diff-tag" style={{ background: diffBg[p.difficulty], color: diffColor[p.difficulty] }}>
                      {p.difficulty}
                    </span>
                    <span className="emp-q-count">📋 {p.questions} Questions</span>
                  </div>
                  <span className="emp-btn">Start Paper →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
