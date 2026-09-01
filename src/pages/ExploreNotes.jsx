import { Link } from 'react-router-dom'

const categories = [
  { label: 'A/L Physics', count: 24, icon: '⚛️', color: '#E3F2FD', accent: '#1565C0' },
  { label: 'A/L Combined Maths', count: 18, icon: '📐', color: '#E8F5E9', accent: '#2E7D32' },
  { label: 'A/L Chemistry', count: 21, icon: '🧪', color: '#FFF8E1', accent: '#F57F17' },
  { label: 'A/L Biology', count: 15, icon: '🧬', color: '#FCE4EC', accent: '#880E4F' },
  { label: 'A/L Economics', count: 12, icon: '📊', color: '#E8EAF6', accent: '#283593' },
  { label: 'O/L Maths', count: 30, icon: '🔢', color: '#E0F7FA', accent: '#006064' },
]

const notes = [
  { id: 1, title: 'Mechanics — Chapter 1', subject: 'Physics', type: 'Summary', pages: 12, icon: '⚛️', color: '#1565C0' },
  { id: 2, title: 'Calculus Fundamentals', subject: 'Combined Maths', type: 'Full Notes', pages: 28, icon: '📐', color: '#2E7D32' },
  { id: 3, title: 'Organic Chemistry Basics', subject: 'Chemistry', type: 'Revision', pages: 16, icon: '🧪', color: '#F57F17' },
  { id: 4, title: 'Cell Biology — Detailed', subject: 'Biology', type: 'Full Notes', pages: 22, icon: '🧬', color: '#880E4F' },
  { id: 5, title: 'Microeconomics Summary', subject: 'Economics', type: 'Summary', pages: 10, icon: '📊', color: '#283593' },
  { id: 6, title: 'Algebra — Key Formulas', subject: 'O/L Maths', type: 'Cheat Sheet', pages: 4, icon: '🔢', color: '#006064' },
]

export default function ExploreNotes() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fff8e1 0%, #fce4ec 30%, #e8eaf6 100%)', paddingTop: 88 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .en-root { font-family: 'Plus Jakarta Sans', sans-serif; }

        .en-hero {
          background: linear-gradient(135deg, #B71C1C 0%, #C62828 40%, #D32F2F 100%);
          padding: 64px 24px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .en-hero::before {
          content: '';
          position: absolute; inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z' fill='%23ffffff' fill-opacity='0.06' fill-rule='evenodd'/%3E%3C/svg%3E");
        }
        .en-hero h1 {
          font-family: 'Nunito', sans-serif;
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 900;
          color: white;
          margin: 0 0 12px;
          position: relative;
        }
        .en-hero p {
          color: rgba(255,255,255,0.85);
          font-size: 1.1rem;
          max-width: 560px;
          margin: 0 auto;
          position: relative;
        }
        .en-badge {
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

        .en-body {
          max-width: 1200px;
          margin: 0 auto;
          padding: 48px 24px;
        }

        .en-section-title {
          font-family: 'Nunito', sans-serif;
          font-size: 1.4rem;
          font-weight: 800;
          color: #1A1A1A;
          margin-bottom: 20px;
        }

        /* Category cards */
        .en-cat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 16px;
          margin-bottom: 48px;
        }
        .en-cat-card {
          background: white;
          border-radius: 16px;
          padding: 22px 18px;
          text-align: center;
          border: 1.5px solid #F0F0F0;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
          cursor: pointer;
          text-decoration: none;
          color: inherit;
          transition: transform 0.2s, box-shadow 0.2s;
          display: block;
        }
        .en-cat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .en-cat-icon {
          font-size: 2rem;
          margin-bottom: 10px;
        }
        .en-cat-label {
          font-size: 0.88rem;
          font-weight: 700;
          color: #1A1A1A;
          margin-bottom: 4px;
        }
        .en-cat-count {
          font-size: 0.78rem;
          font-weight: 600;
          color: #9E9E9E;
        }

        /* Notes cards */
        .en-notes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        .en-note-card {
          background: white;
          border-radius: 18px;
          overflow: hidden;
          border: 1.5px solid #F0F0F0;
          box-shadow: 0 2px 14px rgba(0,0,0,0.05);
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          transition: transform 0.22s, box-shadow 0.22s;
        }
        .en-note-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 36px rgba(0,0,0,0.1);
        }
        .en-note-top {
          padding: 22px 24px 18px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }
        .en-note-icon-wrap {
          font-size: 1.6rem;
          width: 46px; height: 46px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .en-note-title { font-size: 0.98rem; font-weight: 700; color: #1A1A1A; margin-bottom: 4px; }
        .en-note-subject { font-size: 0.82rem; font-weight: 600; }
        .en-note-bottom {
          padding: 14px 24px 18px;
          border-top: 1.5px solid #F5F5F5;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .en-type-tag {
          font-size: 0.78rem;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 50px;
          background: #F5F5F5;
          color: #424242;
        }
        .en-pages { font-size: 0.82rem; color: #9E9E9E; font-weight: 600; }
        .en-dl-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #1A1A1A;
          color: white;
          font-size: 0.82rem;
          font-weight: 700;
          padding: 7px 14px;
          border-radius: 50px;
          text-decoration: none;
          transition: background 0.18s;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .en-dl-btn:hover { background: #333; }
      `}</style>

      <div className="en-root">
        <div className="en-hero">
          <div className="en-badge">📒 Notes</div>
          <h1>Study Notes &amp; Guides</h1>
          <p>Download comprehensive notes, summaries, and cheat sheets for all subjects.</p>
        </div>

        <div className="en-body">
          {/* Categories */}
          <div className="en-section-title">📚 Browse by Subject</div>
          <div className="en-cat-grid">
            {categories.map(c => (
              <Link key={c.label} to="/streams" className="en-cat-card" style={{ borderTop: `4px solid ${c.accent}` }}>
                <div className="en-cat-icon">{c.icon}</div>
                <div className="en-cat-label">{c.label}</div>
                <div className="en-cat-count">{c.count} notes</div>
              </Link>
            ))}
          </div>

          {/* Notes */}
          <div className="en-section-title">⭐ Latest Notes</div>
          <div className="en-notes-grid">
            {notes.map(n => (
              <Link key={n.id} to="/streams" className="en-note-card">
                <div className="en-note-top">
                  <div className="en-note-icon-wrap" style={{ background: `${n.color}18` }}>
                    {n.icon}
                  </div>
                  <div>
                    <div className="en-note-title">{n.title}</div>
                    <div className="en-note-subject" style={{ color: n.color }}>{n.subject}</div>
                  </div>
                </div>
                <div className="en-note-bottom">
                  <span className="en-type-tag">{n.type}</span>
                  <span className="en-pages">📄 {n.pages} pages</span>
                  <span className="en-dl-btn">⬇ Download</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
