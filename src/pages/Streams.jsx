import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StreamCard from '../components/StreamCard'
import { getStreams } from '../api/api'

const STREAM_META = {
  science:    { icon: '🔬', color: '#4CAF50', bg: '#F1F8F1', border: '#C8E6C9', tag: 'Most popular' },
  commerce:   { icon: '📊', color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A', tag: '' },
  arts:       { icon: '🎨', color: '#3B82F6', bg: '#EFF6FF', border: '#BFDBFE', tag: '' },
  technology: { icon: '⚙️', color: '#8B5CF6', bg: '#F5F3FF', border: '#DDD6FE', tag: '' },
}

export default function Streams() {
  const navigate = useNavigate()
  const [streams, setStreams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStreams()
      .then(res => { setStreams(res.data); setLoading(false) })
      .catch(err => { console.error(err); setLoading(false) })
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .streams-root {
          min-height: 100vh;
          background: linear-gradient(160deg, #F0FAF0 0%, #FAFFFE 50%, #F5F9FF 100%);
          padding-top: 68px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #1A3A1A;
        }

        .streams-hero {
          background: linear-gradient(160deg, #E8F5E9 0%, #F0FAF0 100%);
          border-bottom: 1.5px solid #C8E6C9;
          padding: 56px 24px 52px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .streams-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(76,175,80,0.13) 1.5px, transparent 1.5px);
          background-size: 30px 30px;
          mask-image: radial-gradient(ellipse 80% 100% at 50% 0%, black 0%, transparent 80%);
          -webkit-mask-image: radial-gradient(ellipse 80% 100% at 50% 0%, black 0%, transparent 80%);
          pointer-events: none;
        }

        .streams-eyebrow {
          display: inline-block;
          background: #E8F5E9;
          color: #2E7D32;
          font-weight: 700;
          font-size: 0.78rem;
          padding: 5px 14px;
          border-radius: 50px;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          margin-bottom: 16px;
          border: 1.5px solid #A5D6A7;
        }

        .streams-title {
          font-family: 'Nunito', sans-serif;
          font-weight: 900;
          font-size: clamp(2rem, 4vw, 3rem);
          color: #1A3A1A;
          letter-spacing: -0.02em;
          margin-bottom: 12px;
          line-height: 1.1;
        }

        .streams-desc {
          font-size: 1rem;
          color: #5A7A5A;
          max-width: 480px;
          margin: 0 auto;
          line-height: 1.7;
        }

        .streams-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 52px 24px 80px;
        }

        .streams-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 22px;
        }

        .stream-card {
          background: white;
          border-radius: 22px;
          padding: 30px 26px;
          cursor: pointer;
          transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
          box-shadow: 0 2px 14px rgba(0,0,0,0.05);
          position: relative;
          overflow: hidden;
          border: 1.5px solid #E8F5E9;
        }
        .stream-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 14px 40px rgba(76,175,80,0.14);
          border-color: #A5D6A7;
        }

        .stream-card-icon {
          width: 58px;
          height: 58px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.7rem;
          margin-bottom: 20px;
          border: 1.5px solid;
          flex-shrink: 0;
        }

        .stream-card-name {
          font-family: 'Nunito', sans-serif;
          font-weight: 900;
          font-size: 1.2rem;
          color: #1A3A1A;
          margin-bottom: 8px;
        }

        .stream-card-desc {
          font-size: 0.87rem;
          color: #5A7A5A;
          line-height: 1.65;
          margin-bottom: 20px;
        }

        .stream-card-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 22px;
        }

        .stream-pill {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 4px 11px;
          border-radius: 50px;
          background: #F1F8F1;
          color: #4CAF50;
          border: 1px solid #C8E6C9;
        }

        .stream-card-arrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.88rem;
          font-weight: 700;
          color: #4CAF50;
          transition: gap 0.18s;
        }
        .stream-card:hover .stream-card-arrow {
          gap: 10px;
        }

        .popular-tag {
          position: absolute;
          top: 16px;
          right: 16px;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 50px;
          background: #E8F5E9;
          color: #2E7D32;
          border: 1px solid #A5D6A7;
          letter-spacing: 0.04em;
        }

        /* Skeleton loader */
        .skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e8f5e9 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 22px;
          height: 240px;
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .stream-card { animation: fadeUp 0.4s ease both; }
        .stream-card:nth-child(1) { animation-delay: 0.05s; }
        .stream-card:nth-child(2) { animation-delay: 0.12s; }
        .stream-card:nth-child(3) { animation-delay: 0.19s; }
        .stream-card:nth-child(4) { animation-delay: 0.26s; }
      `}</style>

      <main className="streams-root">

        {/* ── Hero banner ── */}
        <div className="streams-hero">
          <div className="streams-eyebrow">All streams</div>
          <h1 className="streams-title">What are you studying?</h1>
          <p className="streams-desc">
            Choose your A/L stream below to browse all available subjects and materials.
          </p>
        </div>

        {/* ── Grid ── */}
        <div className="streams-content">
          {loading ? (
            <div className="streams-grid">
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton" />)}
            </div>
          ) : (
            <div className="streams-grid">
              {streams.map(stream => {
                const meta = STREAM_META[stream.id] ?? {
                  icon: '📘', color: '#4CAF50', bg: '#F1F8F1', border: '#C8E6C9', tag: '',
                }
                return (
                  <div
                    key={stream.id}
                    className="stream-card"
                    onClick={() => navigate(`/streams/${stream.id}`)}
                  >
                    {meta.tag && <div className="popular-tag">⭐ {meta.tag}</div>}

                    <div
                      className="stream-card-icon"
                      style={{ background: meta.bg, borderColor: meta.border }}
                    >
                      {meta.icon}
                    </div>

                    <div className="stream-card-name">{stream.name}</div>
                    <p className="stream-card-desc">{stream.description}</p>

                    <div className="stream-card-meta">
                      {stream.subjectCount && (
                        <span className="stream-pill" style={{ color: meta.color, borderColor: meta.border, background: meta.bg }}>
                          {stream.subjectCount} subjects
                        </span>
                      )}
                      {stream.materialCount && (
                        <span className="stream-pill" style={{ color: meta.color, borderColor: meta.border, background: meta.bg }}>
                          {stream.materialCount} materials
                        </span>
                      )}
                    </div>

                    <div className="stream-card-arrow" style={{ color: meta.color }}>
                      Explore subjects →
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </main>
    </>
  )
}