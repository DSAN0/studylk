import React, { useState, useEffect, useRef } from 'react'

const PRESETS = [
  { label: '25m Focus (Pomodoro)', duration: 25 * 60, type: 'focus' },
  { label: '50m Deep Work',        duration: 50 * 60, type: 'deep'  },
  { label: '5m Quick Break',       duration:  5 * 60, type: 'break' },
  { label: '15m Long Break',       duration: 15 * 60, type: 'longBreak' },
]

export default function FocusSection() {
  const [selectedPreset,     setSelectedPreset]     = useState(PRESETS[0])
  const [timeLeft,           setTimeLeft]           = useState(PRESETS[0].duration)
  const [isRunning,          setIsRunning]          = useState(false)
  const [completedSessions,  setCompletedSessions]  = useState(() =>
    parseInt(localStorage.getItem('studylk_focus_sessions') || '0', 10)
  )
  const [ambientSound, setAmbientSound] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            setIsRunning(false)
            if (selectedPreset.type === 'focus' || selectedPreset.type === 'deep') {
              setCompletedSessions(s => {
                const updated = s + 1
                localStorage.setItem('studylk_focus_sessions', updated.toString())
                return updated
              })
            }
            alert(`🎉 Well done! Completed session: ${selectedPreset.label}`)
            return selectedPreset.duration
          }
          return prev - 1
        })
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [isRunning, selectedPreset])

  const handleSelectPreset = preset => {
    setIsRunning(false)
    setSelectedPreset(preset)
    setTimeLeft(preset.duration)
  }

  const handleReset = () => {
    setIsRunning(false)
    setTimeLeft(selectedPreset.duration)
  }

  const minutes         = Math.floor(timeLeft / 60)
  const seconds         = timeLeft % 60
  const formattedTime   = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  const progressPercent = ((selectedPreset.duration - timeLeft) / selectedPreset.duration) * 100

  return (
    <>
      <style>{`
        .fp-preset-btn:hover  { background: #E8F5E9 !important; color: #2E7D32 !important; }
        .fp-control-btn:hover { transform: translateY(-1px); }
        .fp-ambient:hover     { background: #E8F5E9 !important; }
      `}</style>

      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <div style={{
          background: 'white', border: '1.5px solid #E8F5E9',
          borderRadius: 22, padding: '40px 32px',
          boxShadow: '0 2px 14px rgba(0,0,0,0.04)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          textAlign: 'center',
        }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#E8F5E9', border: '1.5px solid #C8E6C9',
            borderRadius: 50, padding: '4px 14px',
            fontSize: '0.73rem', fontWeight: 800, color: '#2E7D32',
            letterSpacing: '0.06em', textTransform: 'uppercase',
            marginBottom: 16,
          }}>
            ✨ Deep Work & Study Mode
          </div>

          <h2 style={{
            fontFamily: "'Nunito', sans-serif", fontWeight: 900,
            fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#1A3A1A',
            marginBottom: 6,
          }}>Focus Zone</h2>
          <p style={{ fontSize: '0.85rem', color: '#7A9A7A', marginBottom: 28, maxWidth: 360, lineHeight: 1.6 }}>
            Maximize study retention with interval-based focus cycles and structured breaks.
          </p>

          {/* Preset pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
            {PRESETS.map((p, idx) => {
              const isSelected = selectedPreset.label === p.label
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(p)}
                  className={!isSelected ? 'fp-preset-btn' : ''}
                  style={{
                    padding: '7px 16px', borderRadius: 50, fontSize: '0.8rem', fontWeight: 700,
                    border: isSelected ? 'none' : '1.5px solid #E8F5E9',
                    background: isSelected
                      ? 'linear-gradient(135deg, #4CAF50, #2E7D32)'
                      : 'white',
                    color: isSelected ? 'white' : '#4A6A4A',
                    cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
                    boxShadow: isSelected ? '0 3px 10px rgba(76,175,80,0.28)' : 'none',
                    transition: 'background 0.15s, color 0.15s',
                  }}
                >
                  {p.label}
                </button>
              )
            })}
          </div>

          {/* Circular SVG timer */}
          <div style={{ position: 'relative', width: 240, height: 240, marginBottom: 32 }}>
            <svg
              style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}
              viewBox="0 0 260 260"
            >
              <circle
                cx="130" cy="130" r="110"
                fill="none" stroke="rgba(187,247,208,0.6)" strokeWidth="10"
              />
              <circle
                cx="130" cy="130" r="110"
                fill="none" stroke="#4CAF50" strokeWidth="10"
                strokeLinecap="round"
                style={{
                  strokeDasharray: 691,
                  strokeDashoffset: 691 - (691 * progressPercent) / 100,
                  transition: 'stroke-dashoffset 0.7s linear',
                }}
              />
            </svg>

            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{
                fontFamily: "'Nunito', sans-serif", fontWeight: 900,
                fontSize: '3rem', color: '#1A3A1A', letterSpacing: '-0.02em', lineHeight: 1,
              }}>{formattedTime}</span>
              <span style={{
                fontSize: '0.7rem', fontWeight: 800, color: '#4CAF50',
                textTransform: 'uppercase', letterSpacing: '0.09em', marginTop: 6,
              }}>
                {isRunning ? '🔥 In Progress' : '⏸ Paused'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <button
              className="fp-control-btn"
              onClick={() => setIsRunning(r => !r)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                color: 'white', border: 'none', borderRadius: 50,
                padding: '12px 28px', fontSize: '1rem', fontWeight: 800,
                cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
                boxShadow: '0 4px 16px rgba(76,175,80,0.35)',
                transition: 'transform 0.16s',
              }}
            >
              {isRunning ? '⏸ Pause' : '▶ Start Focus'}
            </button>
            <button
              className="fp-control-btn"
              onClick={handleReset}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'white', border: '1.5px solid #C8E6C9',
                color: '#3A5A3A', borderRadius: 50,
                padding: '12px 22px', fontSize: '0.9rem', fontWeight: 700,
                cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
                transition: 'transform 0.16s',
              }}
            >
              ↺ Reset
            </button>
          </div>

          {/* Footer metrics */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
            gap: 16, width: '100%',
            borderTop: '1.5px solid #E8F5E9', paddingTop: 24,
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: "'Nunito', sans-serif", fontWeight: 900,
                fontSize: '1.4rem', color: '#1A3A1A',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              }}>🔥 {completedSessions}</div>
              <div style={{ fontSize: '0.7rem', color: '#7A9A7A', fontWeight: 600, marginTop: 2 }}>
                Completed Sessions
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: "'Nunito', sans-serif", fontWeight: 900,
                fontSize: '1.4rem', color: '#1A3A1A',
              }}>
                {(completedSessions * 25) / 60 >= 1
                  ? `${((completedSessions * 25) / 60).toFixed(1)} hrs`
                  : `${completedSessions * 25} mins`}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#7A9A7A', fontWeight: 600, marginTop: 2 }}>
                Focus Time Logged
              </div>
            </div>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <button
                onClick={() => setAmbientSound(a => !a)}
                className="fp-ambient"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '6px 14px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 700,
                  background: ambientSound ? '#E8F5E9' : '#F8FBF8',
                  border: '1.5px solid #E8F5E9',
                  color: ambientSound ? '#2E7D32' : '#7A9A7A',
                  cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
                  transition: 'background 0.15s',
                }}
              >
                🎧 {ambientSound ? 'Ambient: ON' : 'Ambient: OFF'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}