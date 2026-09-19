import React from 'react'

export default function AccountHeader({ studentName = 'Student', enrollmentsCount = 0, approvedCount = 0 }) {
  const initial = studentName ? studentName.charAt(0).toUpperCase() : 'S'

  return (
    <header style={{
      background: 'linear-gradient(135deg, #E8F5E9 0%, #F0FAF0 100%)',
      borderBottom: '1.5px solid #C8E6C9',
      padding: '44px 24px 40px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Dot pattern overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(76,175,80,0.11) 1.5px, transparent 1.5px)',
        backgroundSize: '28px 28px',
        maskImage: 'radial-gradient(ellipse 80% 100% at 0% 50%, black 0%, transparent 75%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 100% at 0% 50%, black 0%, transparent 75%)',
      }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
        <div style={{
          display: 'flex', flexWrap: 'wrap',
          alignItems: 'center', justifyContent: 'space-between',
          gap: 24,
        }}>
          {/* Left: Identity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Avatar */}
            <div style={{
              width: 64, height: 64, borderRadius: 18, flexShrink: 0,
              background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.7rem', fontWeight: 900, color: 'white',
              boxShadow: '0 6px 20px rgba(76,175,80,0.35)',
              position: 'relative',
            }}>
              {initial}
              <span style={{
                position: 'absolute', bottom: -2, right: -2,
                width: 15, height: 15, borderRadius: '50%',
                background: '#4CAF50', border: '2.5px solid white',
              }} />
            </div>

            <div>
              {/* Pill badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                background: 'white', border: '1.5px solid #C8E6C9',
                borderRadius: 50, padding: '3px 12px',
                fontSize: '0.72rem', fontWeight: 800, color: '#2E7D32',
                letterSpacing: '0.06em', textTransform: 'uppercase',
                marginBottom: 8,
              }}>
                ✨ Student Learning Hub
              </div>

              <h1 style={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 900,
                fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)',
                color: '#1A3A1A', letterSpacing: '-0.02em',
                lineHeight: 1.15, marginBottom: 4,
              }}>
                Welcome back, {studentName}!
              </h1>
              <p style={{ fontSize: '0.9rem', color: '#5A7A5A', fontWeight: 500 }}>
                Track courses, plan your study routine, and stay focused.
              </p>
            </div>
          </div>

          {/* Right: Stat pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'white', border: '1.5px solid #E8F5E9',
              borderRadius: 18, padding: '14px 20px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: '#E8F5E9', border: '1.5px solid #C8E6C9',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.1rem',
              }}>📚</div>
              <div>
                <div style={{
                  fontFamily: "'Nunito', sans-serif", fontWeight: 900,
                  fontSize: '1.5rem', color: '#2E7D32', lineHeight: 1,
                }}>{enrollmentsCount}</div>
                <div style={{
                  fontSize: '0.7rem', color: '#7A9A7A', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>Enrolled</div>
              </div>
            </div>

            {approvedCount > 0 && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: '#F0FDF4', border: '1.5px solid #BBF7D0',
                borderRadius: 18, padding: '14px 20px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: '#E8F5E9', border: '1.5px solid #A5D6A7',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.1rem',
                }}>✅</div>
                <div>
                  <div style={{
                    fontFamily: "'Nunito', sans-serif", fontWeight: 900,
                    fontSize: '1.5rem', color: '#16A34A', lineHeight: 1,
                  }}>{approvedCount}</div>
                  <div style={{
                    fontSize: '0.7rem', color: '#4CAF50', fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}>Active</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}