import { Link } from 'react-router-dom'

const schools = [
  'Royal College', "D.S. Senanayake College", 'Ananda College', 'Nalanda College',
  'Visakha Vidyalaya', "Devi Balika Vidyalaya", "Bishops' College", 'Trinity College'
]

const papers = [
  { id: 1, school: 'Royal College', subject: 'Combined Maths', year: 2023, term: 'Term 1', icon: '📐' },
  { id: 2, school: "D.S. Senanayake College", subject: 'Physics', year: 2023, term: 'Term 2', icon: '⚛️' },
  { id: 3, school: 'Ananda College', subject: 'Biology', year: 2022, term: 'Term 1', icon: '🧬' },
  { id: 4, school: 'Nalanda College', subject: 'Chemistry', year: 2023, term: 'Term 3', icon: '🧪' },
  { id: 5, school: 'Visakha Vidyalaya', subject: 'Economics', year: 2022, term: 'Term 2', icon: '📊' },
  { id: 6, school: "Devi Balika Vidyalaya", subject: 'Business Studies', year: 2023, term: 'Term 1', icon: '💼' },
  { id: 7, school: "Bishops' College", subject: 'Mathematics', year: 2023, term: 'Term 2', icon: '🔢' },
  { id: 8, school: 'Trinity College', subject: 'Science', year: 2022, term: 'Term 3', icon: '🔬' },
]

export default function ExploreSchoolPapers() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f3e5f5 0%, #e8eaf6 50%, #e3f2fd 100%)', paddingTop: 88 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .esp-root { font-family: 'Plus Jakarta Sans', sans-serif; }

        .esp-hero {
          background: linear-gradient(135deg, #311B92 0%, #4527A0 50%, #512DA8 100%);
          padding: 64px 24px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .esp-hero::after {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.07) 0%, transparent 60%);
        }
        .esp-hero h1 {
          font-family: 'Nunito', sans-serif;
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 900;
          color: white;
          margin: 0 0 12px;
          position: relative; z-index: 1;
        }
        .esp-hero p {
          color: rgba(255,255,255,0.85);
          font-size: 1.1rem;
          max-width: 560px;
          margin: 0 auto;
          position: relative; z-index: 1;
        }
        .esp-badge {
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
          position: relative; z-index: 1;
        }

        .esp-body {
          max-width: 1200px;
          margin: 0 auto;
          padding: 48px 24px;
        }

        .esp-school-strip {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 40px;
          padding: 20px;
          background: white;
          border-radius: 16px;
          border: 1.5px solid #E8EAF6;
          box-shadow: 0 2px 12px rgba(81,45,168,0.06);
        }
        .esp-school-chip {
          padding: 7px 16px;
          border-radius: 50px;
          background: #EDE7F6;
          color: #4527A0;
          font-size: 0.84rem;
          font-weight: 600;
          cursor: pointer;
          border: none;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.18s;
        }
        .esp-school-chip:hover {
          background: #4527A0;
          color: white;
        }

        .esp-section-title {
          font-family: 'Nunito', sans-serif;
          font-size: 1.5rem;
          font-weight: 800;
          color: #1A1A3A;
          margin-bottom: 24px;
        }

        .esp-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .esp-row {
          display: flex;
          align-items: center;
          gap: 20px;
          background: white;
          border-radius: 16px;
          padding: 20px 24px;
          border: 1.5px solid #EDE7F6;
          box-shadow: 0 2px 12px rgba(81,45,168,0.04);
          text-decoration: none;
          color: inherit;
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
        }
        .esp-row:hover {
          transform: translateX(6px);
          box-shadow: 0 6px 24px rgba(81,45,168,0.1);
          border-color: #B39DDB;
        }
        .esp-row-icon {
          font-size: 1.8rem;
          flex-shrink: 0;
          background: #EDE7F6;
          width: 48px; height: 48px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
        }
        .esp-row-info { flex: 1 }
        .esp-row-title { font-size: 1rem; font-weight: 700; color: #1A1A3A; }
        .esp-row-school { font-size: 0.84rem; color: #6A6A9A; font-weight: 600; margin-top: 2px; }
        .esp-row-tags { display: flex; gap: 8px; }
        .esp-tag {
          font-size: 0.78rem;
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 50px;
          background: #EDE7F6;
          color: #4527A0;
        }
        .esp-tag.year { background: #FFF3E0; color: #E65100; }
        .esp-arrow {
          font-size: 1.2rem;
          color: #9575CD;
          flex-shrink: 0;
        }
      `}</style>

      <div className="esp-root">
        <div className="esp-hero">
          <div className="esp-badge">🏫 School Papers</div>
          <h1>School Term Papers</h1>
          <p>Practice with original term test papers from top Sri Lankan schools.</p>
        </div>

        <div className="esp-body">
          {/* School chips */}
          <div className="esp-school-strip">
            {schools.map(s => (
              <button key={s} className="esp-school-chip">{s}</button>
            ))}
          </div>

          <div className="esp-section-title">🏅 Featured School Papers</div>

          <div className="esp-list">
            {papers.map(p => (
              <Link key={p.id} to="/streams" className="esp-row">
                <div className="esp-row-icon">{p.icon}</div>
                <div className="esp-row-info">
                  <div className="esp-row-title">{p.subject} — {p.term}</div>
                  <div className="esp-row-school">🏫 {p.school}</div>
                </div>
                <div className="esp-row-tags">
                  <span className="esp-tag year">{p.year}</span>
                  <span className="esp-tag">{p.term}</span>
                </div>
                <div className="esp-arrow">→</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
