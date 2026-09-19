import React from 'react'
import MetricCards from './MetricCards'
import QuickCoursesWidget from './QuickCoursesWidget'
import ShortcutsGrid from './ShortcutsGrid'

export default function DashboardSection({
  studentName = 'Student',
  enrollments = [],
  approvedCourses = [],
  pendingCourses = [],
  onGoToTab,
}) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric', year: 'numeric',
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Welcome banner ──────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
        borderRadius: 22, padding: '32px 28px',
        boxShadow: '0 4px 20px rgba(46,125,50,0.3)',
        position: 'relative', overflow: 'hidden',
        animation: 'fadeUp 0.4s ease both',
      }}>
        {/* Subtle dot overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
        }} />

        <div style={{
          position: 'relative',
          display: 'flex', flexWrap: 'wrap',
          alignItems: 'center', justifyContent: 'space-between', gap: 20,
        }}>
          <div>
            <div style={{
              fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)',
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              📅 {today}
            </div>
            <h2 style={{
              fontFamily: "'Nunito', sans-serif", fontWeight: 900,
              fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)',
              color: 'white', marginBottom: 8, lineHeight: 1.2,
            }}>
              Ready to continue your study journey?
            </h2>
            <p style={{
              fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)',
              marginBottom: 20, maxWidth: 480,
            }}>
              You have <strong>{approvedCourses.length} active courses</strong> with theory, practice questions, and past papers ready.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              <button
                onClick={() => onGoToTab('courses')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'white', color: '#1B5E20',
                  border: 'none', borderRadius: 50, padding: '10px 20px',
                  fontSize: '0.87rem', fontWeight: 800,
                  cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
                  boxShadow: '0 3px 14px rgba(0,0,0,0.15)',
                  transition: 'transform 0.16s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}
              >
                🎓 Go to My Courses
              </button>
              <button
                onClick={() => onGoToTab('focus')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'rgba(255,255,255,0.15)',
                  border: '1.5px solid rgba(255,255,255,0.35)',
                  color: 'white', borderRadius: 50, padding: '10px 20px',
                  fontSize: '0.87rem', fontWeight: 700,
                  cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
              >
                ⏱️ Start Focus Session
              </button>
            </div>
          </div>

          <div style={{
            width: 88, height: 88, borderRadius: 20, flexShrink: 0,
            background: 'rgba(255,255,255,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.8rem',
          }}>
            🎓
          </div>
        </div>
      </div>

      {/* ── Metrics ────────────────────────────────────────────────────── */}
      <MetricCards
        enrollmentsCount={enrollments.length}
        approvedCount={approvedCourses.length}
        pendingCount={pendingCourses.length}
        onGoToTab={onGoToTab}
      />

      {/* ── Two-column grid ─────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Left: Quick courses */}
        <QuickCoursesWidget
          enrollments={enrollments}
          onGoToCourses={() => onGoToTab('courses')}
        />

        {/* Right: Mini Focus + Mini Notes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Focus mini-card */}
          <div style={{
            background: 'white', border: '1.5px solid #E8F5E9',
            borderRadius: 22, padding: 22,
            boxShadow: '0 2px 14px rgba(0,0,0,0.04)',
          }}>
            <h4 style={{
              fontFamily: "'Nunito', sans-serif", fontWeight: 900,
              fontSize: '0.95rem', color: '#1A3A1A', marginBottom: 8,
              display: 'flex', alignItems: 'center', gap: 7,
            }}>⏱️ Focus Zone</h4>
            <p style={{ fontSize: '0.8rem', color: '#7A9A7A', marginBottom: 14, lineHeight: 1.5 }}>
              25-minute deep study intervals with structured breaks.
            </p>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: '#E8F5E9', borderRadius: 12, padding: '10px 14px',
              border: '1.5px solid #C8E6C9', marginBottom: 12,
            }}>
              <span style={{
                fontFamily: "'Nunito', sans-serif", fontWeight: 900,
                fontSize: '1.5rem', color: '#2E7D32',
              }}>25:00</span>
            </div>
            <button
              onClick={() => onGoToTab('focus')}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                width: '100%',
                background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                color: 'white', border: 'none', borderRadius: 50,
                padding: '9px 0', fontSize: '0.82rem', fontWeight: 700,
                cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
                boxShadow: '0 3px 10px rgba(76,175,80,0.28)',
              }}
            >
              ▶ Launch Timer
            </button>
          </div>

          {/* Notes mini-card */}
          <div style={{
            background: 'white', border: '1.5px solid #E8F5E9',
            borderRadius: 22, padding: 22,
            boxShadow: '0 2px 14px rgba(0,0,0,0.04)',
          }}>
            <h4 style={{
              fontFamily: "'Nunito', sans-serif", fontWeight: 900,
              fontSize: '0.95rem', color: '#1A3A1A', marginBottom: 8,
              display: 'flex', alignItems: 'center', gap: 7,
            }}>📝 Study Scratchpad</h4>
            <p style={{ fontSize: '0.8rem', color: '#7A9A7A', marginBottom: 14, lineHeight: 1.5 }}>
              Save formula summaries, theorems, and exam checklists.
            </p>
            <button
              onClick={() => onGoToTab('notes')}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                width: '100%', background: '#E8F5E9',
                color: '#2E7D32', border: '1.5px solid #C8E6C9',
                borderRadius: 50, padding: '9px 0',
                fontSize: '0.82rem', fontWeight: 700,
                cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Open Study Notes →
            </button>
          </div>
        </div>
      </div>

      {/* ── Shortcuts ───────────────────────────────────────────────────── */}
      <ShortcutsGrid />
    </div>
  )
}