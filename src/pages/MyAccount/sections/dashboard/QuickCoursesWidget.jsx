import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function QuickCoursesWidget({ enrollments = [], onGoToCourses }) {
  const navigate = useNavigate()

  return (
    <>
      <style>{`
        .qc-row:hover { border-color: #A5D6A7 !important; box-shadow: 0 4px 16px rgba(76,175,80,0.08) !important; }
        .qc-open-btn:hover { transform: translateY(-1px); box-shadow: 0 5px 14px rgba(76,175,80,0.32) !important; }
      `}</style>

      <div style={{
        background: 'white', border: '1.5px solid #E8F5E9',
        borderRadius: 22, padding: 24,
        boxShadow: '0 2px 14px rgba(0,0,0,0.04)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 18,
        }}>
          <h3 style={{
            fontFamily: "'Nunito', sans-serif", fontWeight: 900,
            fontSize: '1rem', color: '#1A3A1A',
            display: 'flex', alignItems: 'center', gap: 7,
          }}>
            📚 My Courses
          </h3>
          <button
            onClick={onGoToCourses}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '0.78rem', fontWeight: 700, color: '#4CAF50',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              display: 'flex', alignItems: 'center', gap: 3,
            }}
          >
            View All ({enrollments.length}) →
          </button>
        </div>

        {enrollments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px 0' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>📭</div>
            <p style={{ color: '#7A9A7A', fontWeight: 600, fontSize: '0.9rem', marginBottom: 16 }}>
              No enrolled courses yet.
            </p>
            <button
              onClick={() => navigate('/streams')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                color: 'white', border: 'none', borderRadius: 50,
                padding: '9px 20px', fontSize: '0.85rem', fontWeight: 700,
                cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
                boxShadow: '0 3px 12px rgba(76,175,80,0.28)',
              }}
            >
              📚 Browse Courses
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {enrollments.slice(0, 3).map(item => {
              const course = item.course || {}
              const isApproved = item.status === 'approved'
              const isPending  = item.status === 'pending'

              const statusBadge = isApproved
                ? { bg: '#F0FDF4', border: '#BBF7D0', color: '#16A34A', label: '✅ Approved' }
                : isPending
                ? { bg: '#FEF9E7', border: '#FDE68A', color: '#D97706', label: '⏳ Pending' }
                : { bg: '#FEF2F2', border: '#FECACA', color: '#DC2626', label: '❌ Rejected' }

              return (
                <div
                  key={item.id}
                  className="qc-row"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    gap: 12,
                    background: '#FAFDF9', border: '1.5px solid #E8F5E9',
                    borderRadius: 14, padding: '12px 16px',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 11, flexShrink: 0,
                      background: '#E8F5E9', border: '1.5px solid #C8E6C9',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1rem',
                    }}>📖</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center',
                          padding: '2px 9px', borderRadius: 50, fontSize: '0.68rem', fontWeight: 700,
                          background: statusBadge.bg, border: `1.5px solid ${statusBadge.border}`,
                          color: statusBadge.color,
                        }}>{statusBadge.label}</span>
                      </div>
                      <div style={{
                        fontFamily: "'Nunito', sans-serif", fontWeight: 900,
                        fontSize: '0.9rem', color: '#1A3A1A',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>{course.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#7A9A7A', marginTop: 1 }}>
                        {course.teacher?.name && `👤 ${course.teacher.name}`}
                        {course.mode && ` · 💻 ${course.mode}`}
                      </div>
                    </div>
                  </div>

                  <div style={{ flexShrink: 0 }}>
                    {isApproved ? (
                      <button
                        className="qc-open-btn"
                        onClick={() => navigate(`/my-courses/${course.id}/overview`)}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5,
                          background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                          color: 'white', border: 'none', borderRadius: 50,
                          padding: '7px 14px', fontSize: '0.78rem', fontWeight: 700,
                          cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
                          boxShadow: '0 3px 10px rgba(76,175,80,0.28)',
                          transition: 'transform 0.16s, box-shadow 0.16s',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Open →
                      </button>
                    ) : (
                      <span style={{
                        fontSize: '0.75rem', fontWeight: 600,
                        color: isPending ? '#D97706' : '#DC2626',
                      }}>
                        {isPending ? 'Pending' : 'Rejected'}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}