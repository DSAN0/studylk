import React from 'react'
import { Link } from 'react-router-dom'

const SHORTCUTS = [
  { title: 'Past Papers Hub',       desc: 'Browse official exam papers and practice MCQs',           to: '/explore/past-papers',  emoji: '📄', bg: '#E8F5E9', border: '#C8E6C9', color: '#2E7D32' },
  { title: 'Model Papers',          desc: 'Master structured revision and model questions',           to: '/explore/model-papers', emoji: '🏆', bg: '#FEF9E7', border: '#FDE68A', color: '#D97706' },
  { title: 'Study Notes & Sheets',  desc: 'Concise short notes and formula summaries',               to: '/explore/notes',        emoji: '📋', bg: '#EFF6FF', border: '#BFDBFE', color: '#1D4ED8' },
  { title: 'Course Catalog',        desc: 'Discover top teachers across A/L and O/L streams',        to: '/streams',              emoji: '🧭', bg: '#F5F3FF', border: '#DDD6FE', color: '#6D28D9' },
]

export default function ShortcutsGrid() {
  return (
    <>
      <style>{`
        .sc-link:hover { transform: translateY(-3px) !important; border-color: #A5D6A7 !important; box-shadow: 0 8px 24px rgba(76,175,80,0.1) !important; }
        .sc-link:hover .sc-title { color: #2E7D32 !important; }
      `}</style>

      <div style={{
        background: 'white', border: '1.5px solid #E8F5E9',
        borderRadius: 22, padding: 24,
        boxShadow: '0 2px 14px rgba(0,0,0,0.04)',
      }}>
        <h3 style={{
          fontFamily: "'Nunito', sans-serif", fontWeight: 900,
          fontSize: '1rem', color: '#1A3A1A',
          marginBottom: 16, display: 'flex', alignItems: 'center', gap: 7,
        }}>
          🚀 Quick Study Shortcuts
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 12,
        }}>
          {SHORTCUTS.map((item, idx) => (
            <Link
              key={idx}
              to={item.to}
              className="sc-link"
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: '#FAFDF9', border: '1.5px solid #E8F5E9',
                borderRadius: 16, padding: '14px 16px', textDecoration: 'none',
                transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s',
              }}
            >
              <div style={{
                width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                background: item.bg, border: `1.5px solid ${item.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.1rem',
              }}>{item.emoji}</div>
              <div>
                <div
                  className="sc-title"
                  style={{
                    fontFamily: "'Nunito', sans-serif", fontWeight: 900,
                    fontSize: '0.88rem', color: '#1A3A1A',
                    marginBottom: 2, transition: 'color 0.15s',
                  }}
                >{item.title}</div>
                <div style={{
                  fontSize: '0.72rem', color: '#7A9A7A', lineHeight: 1.4,
                  display: '-webkit-box', WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>{item.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}