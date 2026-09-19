import React from 'react'

export default function ProfileSection({
  student,
  studentName = 'Student',
  studentEmail = '',
  enrollmentsCount = 0,
  approvedCount = 0,
  onLogout,
}) {
  const initial = studentName ? studentName.charAt(0).toUpperCase() : 'S'

  const InfoRow = ({ emoji, label, value }) => (
    value ? (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 16px', borderRadius: 14,
        background: '#FAFDF9', border: '1.5px solid #E8F5E9',
      }}>
        <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{emoji}</span>
        <div>
          <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#AACAAA', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 2 }}>
            {label}
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1A3A1A' }}>{value}</div>
        </div>
      </div>
    ) : null
  )

  return (
    <>
      <style>{`
        .ps-logout-btn:hover { box-shadow: 0 6px 18px rgba(220,38,38,0.3) !important; transform: translateY(-1px); }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* ── Profile card ──────────────────────────────────────────── */}
        <div style={{
          background: 'white', border: '1.5px solid #E8F5E9',
          borderRadius: 22, padding: 28,
          boxShadow: '0 2px 14px rgba(0,0,0,0.04)',
          animation: 'fadeUp 0.35s ease both',
        }}>
          {/* Avatar + name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 26 }}>
            <div style={{
              width: 72, height: 72, borderRadius: 20, flexShrink: 0,
              background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', fontWeight: 900, color: 'white',
              boxShadow: '0 6px 20px rgba(76,175,80,0.35)',
              position: 'relative',
            }}>
              {initial}
              <span style={{
                position: 'absolute', bottom: -2, right: -2,
                width: 16, height: 16, borderRadius: '50%',
                background: '#4CAF50', border: '2.5px solid white',
              }} />
            </div>
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                background: '#E8F5E9', border: '1.5px solid #C8E6C9',
                borderRadius: 50, padding: '3px 12px',
                fontSize: '0.7rem', fontWeight: 800, color: '#2E7D32',
                textTransform: 'uppercase', letterSpacing: '0.07em',
                marginBottom: 8,
              }}>✅ Verified Student</div>
              <h2 style={{
                fontFamily: "'Nunito', sans-serif", fontWeight: 900,
                fontSize: '1.5rem', color: '#1A3A1A', lineHeight: 1.15, marginBottom: 3,
              }}>{studentName}</h2>
              <p style={{ fontSize: '0.87rem', color: '#7A9A7A', fontWeight: 500 }}>{studentEmail}</p>
            </div>
          </div>

          {/* Stat pills row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 26 }}>
            {[
              { emoji: '📚', label: 'Enrolled', value: enrollmentsCount, bg: '#E8F5E9', border: '#C8E6C9', color: '#2E7D32' },
              { emoji: '✅', label: 'Active',   value: approvedCount,    bg: '#F0FDF4', border: '#BBF7D0', color: '#16A34A' },
            ].map(s => (
              <div key={s.label} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: s.bg, border: `1.5px solid ${s.border}`,
                borderRadius: 14, padding: '10px 16px',
              }}>
                <span style={{ fontSize: '1.1rem' }}>{s.emoji}</span>
                <div>
                  <div style={{
                    fontFamily: "'Nunito', sans-serif", fontWeight: 900,
                    fontSize: '1.3rem', color: s.color, lineHeight: 1,
                  }}>{s.value}</div>
                  <div style={{ fontSize: '0.7rem', color: s.color, fontWeight: 700, opacity: 0.8 }}>
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Info rows */}
          <h3 style={{
            fontFamily: "'Nunito', sans-serif", fontWeight: 900,
            fontSize: '0.95rem', color: '#1A3A1A',
            marginBottom: 12, display: 'flex', alignItems: 'center', gap: 7,
          }}>👤 Account Information</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <InfoRow emoji="📛" label="Full Name"    value={studentName} />
            <InfoRow emoji="📧" label="Email"        value={studentEmail} />
            <InfoRow emoji="📱" label="Phone"        value={student?.phone || student?.phone_number} />
            <InfoRow emoji="🎓" label="Stream"       value={student?.stream} />
            <InfoRow emoji="🆔" label="Student ID"   value={student?.student_id || student?.id} />
          </div>
        </div>

        {/* ── Security guidelines ──────────────────────────────────── */}
        <div style={{
          background: 'white', border: '1.5px solid #E8F5E9',
          borderRadius: 22, padding: 24,
          boxShadow: '0 2px 14px rgba(0,0,0,0.04)',
          animation: 'fadeUp 0.4s 0.05s ease both',
        }}>
          <h3 style={{
            fontFamily: "'Nunito', sans-serif", fontWeight: 900,
            fontSize: '0.95rem', color: '#1A3A1A',
            marginBottom: 14, display: 'flex', alignItems: 'center', gap: 7,
          }}>🔒 Security & Account Tips</h3>

          {[
            { emoji: '🔑', text: 'Never share your login credentials or password with anyone.' },
            { emoji: '📅', text: 'Check your calendar regularly so you never miss a live class.' },
            { emoji: '💬', text: 'Contact support via WhatsApp if you have any enrollment issues.' },
            { emoji: '📲', text: 'Keep your contact details up-to-date for important notifications.' },
          ].map((tip, i) => (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '12px 0',
                borderBottom: i < 3 ? '1px solid #F0F5F0' : 'none',
              }}
            >
              <span style={{ fontSize: '1rem', flexShrink: 0, marginTop: 1 }}>{tip.emoji}</span>
              <span style={{ fontSize: '0.87rem', color: '#5A7A5A', lineHeight: 1.5 }}>{tip.text}</span>
            </div>
          ))}
        </div>

        {/* ── Logout ───────────────────────────────────────────────── */}
        <div style={{
          background: '#FEF2F2', border: '1.5px solid #FECACA',
          borderRadius: 22, padding: 22,
          boxShadow: '0 2px 14px rgba(0,0,0,0.04)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14,
          animation: 'fadeUp 0.4s 0.1s ease both',
        }}>
          <div>
            <div style={{
              fontFamily: "'Nunito', sans-serif", fontWeight: 900,
              fontSize: '0.98rem', color: '#991B1B', marginBottom: 3,
            }}>🚪 Sign Out</div>
            <p style={{ fontSize: '0.82rem', color: '#DC2626', opacity: 0.8 }}>
              You'll be redirected to the login page.
            </p>
          </div>
          <button
            onClick={onLogout}
            className="ps-logout-btn"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: 'linear-gradient(135deg, #EF4444, #DC2626)',
              color: 'white', border: 'none', borderRadius: 50,
              padding: '10px 24px', fontSize: '0.87rem', fontWeight: 700,
              cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
              boxShadow: '0 3px 12px rgba(220,38,38,0.28)',
              transition: 'transform 0.16s, box-shadow 0.16s',
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </>
  )
}