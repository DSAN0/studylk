import React from 'react'

export const ACCOUNT_TABS = [
  { id: 'dashboard', label: 'Dashboard',          emoji: '📊' },
  { id: 'courses',   label: 'My Courses',         emoji: '🎓' },
  { id: 'calendar',  label: 'Calendar',           emoji: '📅' },
  { id: 'focus',     label: 'Focus Zone',         emoji: '⏱️' },
  { id: 'goals',     label: 'Goals & Targets',    emoji: '🎯' },
  { id: 'notes',     label: 'Study Notes',        emoji: '📝' },
  { id: 'profile',   label: 'Profile & Settings', emoji: '👤' },
]

// Props:
//   mobile        – true → render horizontal pill bar only (for index.jsx's mobile row)
//   activeTab, onTabChange, enrollmentsCount, studentName, studentEmail, onLogout
export default function AccountNav({
  activeTab,
  onTabChange,
  enrollmentsCount = 0,
  studentName = 'Student',
  studentEmail = '',
  onLogout,
  mobile = false,
}) {
  const initial = studentName ? studentName.charAt(0).toUpperCase() : 'S'

  // ── Mobile pill bar ──────────────────────────────────────────────────────
  if (mobile) {
    return (
      <>
        {ACCOUNT_TABS.map(tab => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '7px 15px', borderRadius: 50, whiteSpace: 'nowrap', flexShrink: 0,
                background: isActive
                  ? 'linear-gradient(135deg, #4CAF50, #2E7D32)'
                  : 'white',
                border: isActive ? 'none' : '1.5px solid #E8F5E9',
                color: isActive ? 'white' : '#4A6A4A',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.8rem', fontWeight: 700,
                cursor: 'pointer',
                boxShadow: isActive ? '0 3px 10px rgba(76,175,80,0.28)' : 'none',
              }}
            >
              {tab.emoji} {tab.label}
              {tab.id === 'courses' && enrollmentsCount > 0 && (
                <span style={{
                  background: isActive ? 'rgba(255,255,255,0.3)' : '#E8F5E9',
                  color: isActive ? 'white' : '#2E7D32',
                  borderRadius: 50, padding: '0 7px',
                  fontSize: '0.68rem', fontWeight: 800,
                }}>{enrollmentsCount}</span>
              )}
            </button>
          )
        })}
      </>
    )
  }

  // ── Desktop sidebar ──────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        .ma-nav-btn:hover  { background: #F1F8F1 !important; color: #2E7D32 !important; }
        .ma-nav-btn.active { background: #E8F5E9 !important; }
        .ma-logout-btn:hover { background: #FEF2F2 !important; }
      `}</style>

      <div style={{ position: 'sticky', top: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* ── Student profile card ── */}
        <div style={{
          background: 'white', border: '1.5px solid #E8F5E9',
          borderRadius: 22, padding: 20,
          boxShadow: '0 2px 14px rgba(0,0,0,0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            {/* Avatar */}
            <div style={{
              width: 46, height: 46, borderRadius: 13, flexShrink: 0,
              background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.15rem', fontWeight: 900, color: 'white',
              position: 'relative',
              boxShadow: '0 3px 12px rgba(76,175,80,0.3)',
            }}>
              {initial}
              <span style={{
                position: 'absolute', bottom: -2, right: -2,
                width: 11, height: 11, borderRadius: '50%',
                background: '#4CAF50', border: '2px solid white',
              }} />
            </div>

            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{
                fontSize: '0.65rem', fontWeight: 800, color: '#4CAF50',
                textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2,
              }}>✨ Student Portal</div>
              <div style={{
                fontFamily: "'Nunito', sans-serif", fontWeight: 900,
                fontSize: '0.92rem', color: '#1A3A1A',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{studentName}</div>
              <div style={{
                fontSize: '0.72rem', color: '#9ABA9A',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{studentEmail}</div>
            </div>
          </div>

          {/* Enrolled count */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: '#E8F5E9', borderRadius: 12,
            padding: '8px 14px', border: '1.5px solid #C8E6C9',
          }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#2E7D32' }}>
              Enrolled Courses
            </span>
            <span style={{
              background: '#2E7D32', color: 'white',
              borderRadius: 50, padding: '2px 9px',
              fontSize: '0.7rem', fontWeight: 800,
            }}>{enrollmentsCount}</span>
          </div>
        </div>

        {/* ── Navigation menu card ── */}
        <div style={{
          background: 'white', border: '1.5px solid #E8F5E9',
          borderRadius: 22, padding: 12,
          boxShadow: '0 2px 14px rgba(0,0,0,0.04)',
        }}>
          <div style={{
            padding: '6px 10px 8px',
            fontSize: '0.65rem', fontWeight: 800, color: '#C0D8C0',
            textTransform: 'uppercase', letterSpacing: '0.1em',
          }}>Navigation</div>

          {ACCOUNT_TABS.map(tab => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`ma-nav-btn${isActive ? ' active' : ''}`}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', textAlign: 'left',
                  background: isActive ? '#E8F5E9' : 'transparent',
                  border: 'none', borderRadius: 14,
                  padding: '10px 12px', marginBottom: 2,
                  cursor: 'pointer',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '0.87rem', fontWeight: isActive ? 700 : 600,
                  color: isActive ? '#1A3A1A' : '#4A6A4A',
                  transition: 'background 0.15s',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <span style={{ fontSize: '0.95rem' }}>{tab.emoji}</span>
                  <span>{tab.label}</span>
                </span>
                {tab.id === 'courses' && enrollmentsCount > 0 && (
                  <span style={{
                    background: isActive ? '#2E7D32' : '#E8F5E9',
                    color: isActive ? 'white' : '#2E7D32',
                    borderRadius: 50, padding: '1px 8px',
                    fontSize: '0.68rem', fontWeight: 800,
                    transition: 'background 0.15s',
                  }}>{enrollmentsCount}</span>
                )}
              </button>
            )
          })}

          <div style={{ borderTop: '1.5px solid #F0F5F0', margin: '8px 0 6px' }} />

          {onLogout && (
            <button
              onClick={onLogout}
              className="ma-logout-btn"
              style={{
                display: 'flex', alignItems: 'center', gap: 9,
                width: '100%', textAlign: 'left',
                background: 'transparent', border: 'none', borderRadius: 14,
                padding: '10px 12px', cursor: 'pointer',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.87rem', fontWeight: 700,
                color: '#DC2626', transition: 'background 0.15s',
              }}
            >
              🚪 Logout
            </button>
          )}
        </div>
      </div>
    </>
  )
}