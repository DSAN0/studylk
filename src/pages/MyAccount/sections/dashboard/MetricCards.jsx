import React from 'react'

const METRICS_CONFIG = [
  { emoji: '📚', label: 'Enrolled Courses', color: '#2E7D32', bg: '#E8F5E9', border: '#C8E6C9', tab: 'courses',   valueKey: 'enrollmentsCount' },
  { emoji: '✅', label: 'Active & Approved', color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0', tab: 'courses',   valueKey: 'approvedCount' },
  { emoji: '⏳', label: 'Pending Review',    color: '#D97706', bg: '#FEF9E7', border: '#FDE68A', tab: 'courses',   valueKey: 'pendingCount' },
  { emoji: '🎯', label: 'Goals & Targets',   color: '#6D28D9', bg: '#F5F3FF', border: '#DDD6FE', tab: 'goals',    valueKey: null },
]

export default function MetricCards({ enrollmentsCount = 0, approvedCount = 0, pendingCount = 0, onGoToTab }) {
  const values = { enrollmentsCount, approvedCount, pendingCount }

  return (
    <>
      <style>{`
        .metric-card:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 10px 30px rgba(76,175,80,0.12) !important;
          border-color: #A5D6A7 !important;
        }
      `}</style>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 14,
      }}>
        {METRICS_CONFIG.map((m, i) => (
          <div
            key={i}
            className="metric-card"
            onClick={() => onGoToTab(m.tab)}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              background: 'white', border: '1.5px solid #E8F5E9',
              borderRadius: 18, padding: '18px 20px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
              animation: `fadeUp 0.35s ${i * 0.07}s ease both`,
            }}
          >
            <div style={{
              width: 46, height: 46, borderRadius: 13, flexShrink: 0,
              background: m.bg, border: `1.5px solid ${m.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.2rem',
            }}>
              {m.emoji}
            </div>
            <div>
              <div style={{
                fontFamily: "'Nunito', sans-serif", fontWeight: 900,
                fontSize: '1.7rem', color: m.color, lineHeight: 1,
              }}>
                {m.valueKey ? values[m.valueKey] : '📋'}
              </div>
              <div style={{ fontSize: '0.73rem', color: '#7A9A7A', fontWeight: 700, marginTop: 2 }}>
                {m.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}