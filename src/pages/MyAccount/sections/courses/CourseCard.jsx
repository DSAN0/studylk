import React from 'react'
import { useNavigate } from 'react-router-dom'

const STATUS = {
  approved: { bg: '#F0FDF4', border: '#BBF7D0', color: '#16A34A', icon: '✅', label: 'Approved' },
  pending:  { bg: '#FEF9E7', border: '#FDE68A', color: '#D97706', icon: '⏳', label: 'Pending Verification' },
  rejected: { bg: '#FEF2F2', border: '#FECACA', color: '#DC2626', icon: '❌', label: 'Rejected' },
}

export default function CourseCard({ enrollment }) {
  const navigate = useNavigate()
  const course    = enrollment.course || {}
  const status    = enrollment.status || 'pending'
  const st        = STATUS[status] || STATUS.pending
  const isApproved = status === 'approved'
  const isPending  = status === 'pending'

  return (
    <>
      <style>{`
        .cc-card { animation: fadeUp 0.35s ease both; }
        .cc-card:hover { transform: translateY(-4px) !important; box-shadow: 0 12px 36px rgba(76,175,80,0.1) !important; }
        .cc-primary-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(76,175,80,0.38) !important; }
        .cc-mini-btn:hover { background: #E8F5E9 !important; border-color: #A5D6A7 !important; color: #2E7D32 !important; }
      `}</style>

      <div
        className="cc-card"
        style={{
          background: 'white', border: '1.5px solid #E8F5E9',
          borderRadius: 22, padding: 22,
          boxShadow: '0 2px 14px rgba(0,0,0,0.04)',
          display: 'flex', flexDirection: 'column',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
      >
        {/* Status badge + price */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '4px 12px', borderRadius: 50, fontSize: '0.72rem', fontWeight: 700,
            background: st.bg, border: `1.5px solid ${st.border}`, color: st.color,
          }}>
            {st.icon} {st.label}
          </span>
          {course.price && (
            <span style={{
              background: '#E8F5E9', borderRadius: 50, padding: '3px 11px',
              fontSize: '0.75rem', fontWeight: 800, color: '#2E7D32',
            }}>{course.price}</span>
          )}
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: "'Nunito', sans-serif", fontWeight: 900,
          fontSize: '1.05rem', color: '#1A3A1A',
          lineHeight: 1.35, marginBottom: 6,
        }}>
          {course.title}
        </h3>

        {/* Teacher */}
        {course.teacher?.name && (
          <p style={{ fontSize: '0.82rem', color: '#7A9A7A', fontWeight: 600, marginBottom: 14 }}>
            👤 {course.teacher.name}
          </p>
        )}

        {/* Meta */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 5,
          fontSize: '0.8rem', color: '#5A7A5A', marginBottom: 18, flex: 1,
        }}>
          {course.schedule  && <span>📅 {course.schedule}</span>}
          {course.mode      && <span>💻 {course.mode}</span>}
          {course.startDate && <span>🚀 Starts: {course.startDate}</span>}
        </div>

        {/* Footer actions */}
        {isApproved ? (
          <>
            <button
              className="cc-primary-btn"
              onClick={() => navigate(`/my-courses/${course.id}/overview`)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                width: '100%', marginBottom: 10,
                background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                color: 'white', border: 'none', borderRadius: 50,
                padding: '10px 0', fontSize: '0.87rem', fontWeight: 700,
                cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
                boxShadow: '0 3px 12px rgba(76,175,80,0.28)',
                transition: 'transform 0.16s, box-shadow 0.16s',
              }}
            >
              📖 Open Course Portal
            </button>

            {/* 3-action grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {[
                { emoji: '📁', label: 'Materials',  path: 'materials' },
                { emoji: '❓', label: 'Questions',  path: 'daily-questions' },
                { emoji: '📄', label: 'Papers',     path: 'papers' },
              ].map(action => (
                <button
                  key={action.path}
                  className="cc-mini-btn"
                  onClick={() => navigate(`/my-courses/${course.id}/${action.path}`)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                    background: 'white', border: '1.5px solid #E8F5E9',
                    color: '#5A7A5A', borderRadius: 12,
                    padding: '7px 4px', fontSize: '0.75rem', fontWeight: 700,
                    cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
                    transition: 'background 0.15s, border-color 0.15s, color 0.15s',
                  }}
                >
                  {action.emoji} {action.label}
                </button>
              ))}
            </div>
          </>
        ) : isPending ? (
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 9,
            background: '#FEF9E7', border: '1.5px solid #FDE68A',
            borderRadius: 14, padding: '12px 14px',
            fontSize: '0.82rem', color: '#92400E',
          }}>
            <span style={{ flexShrink: 0, marginTop: 1 }}>⏳</span>
            <span>Your enrollment is awaiting admin confirmation. Access will be unlocked upon approval.</span>
          </div>
        ) : (
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 9,
            background: '#FEF2F2', border: '1.5px solid #FECACA',
            borderRadius: 14, padding: '12px 14px',
            fontSize: '0.82rem', color: '#991B1B',
          }}>
            <span style={{ flexShrink: 0, marginTop: 1 }}>❌</span>
            <span>Enrollment was rejected. Please contact support for assistance.</span>
          </div>
        )}
      </div>
    </>
  )
}