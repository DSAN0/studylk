import React, { useState, useEffect } from 'react'

const TYPE_CONFIG = {
  study: { label: '📖 Study',      bg: '#E8F5E9', color: '#2E7D32' },
  paper: { label: '📝 Paper',      bg: '#FEF9E7', color: '#D97706' },
  class: { label: '🎓 Live Class', bg: '#EFF6FF', color: '#1D4ED8' },
  exam:  { label: '🏆 Exam',       bg: '#FEF2F2', color: '#DC2626' },
}

export default function CalendarSection() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('studylk_calendar_events')
    return saved
      ? JSON.parse(saved)
      : [
          { id: '1', title: 'Physics Mechanics Past Paper', date: new Date().toISOString().split('T')[0], type: 'paper' },
          { id: '2', title: 'Combined Maths Live Revision', date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], type: 'class' },
        ]
  })
  const [newTitle, setNewTitle] = useState('')
  const [newDate, setNewDate]   = useState(new Date().toISOString().split('T')[0])
  const [newType, setNewType]   = useState('study')

  useEffect(() => {
    localStorage.setItem('studylk_calendar_events', JSON.stringify(events))
  }, [events])

  const handleAdd = e => {
    e.preventDefault()
    if (!newTitle.trim()) return
    setEvents(prev => [...prev, { id: Date.now().toString(), title: newTitle.trim(), date: newDate, type: newType }])
    setNewTitle('')
  }

  const handleDelete = id => setEvents(prev => prev.filter(ev => ev.id !== id))

  const year  = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const monthName = currentDate.toLocaleString('default', { month: 'long' })

  const firstDay    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const todayStr    = new Date().toISOString().split('T')[0]

  const daysArray = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const inputStyle = {
    width: '100%', padding: '9px 12px',
    border: '1.5px solid #E8F5E9', borderRadius: 12,
    fontSize: '0.85rem', color: '#1A3A1A',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    background: 'white',
  }
  const selectStyle = {
    ...inputStyle, cursor: 'pointer',
  }

  return (
    <>
      <style>{`
        .cal-input:focus, .cal-select:focus {
          border-color: #4CAF50 !important;
          outline: none;
          box-shadow: 0 0 0 3px rgba(76,175,80,0.12);
        }
        .cal-day:hover { background: #F1F8F1 !important; }
        .cal-nav-btn:hover { background: #E8F5E9 !important; }
        .cal-del-btn:hover { background: #FEF2F2 !important; color: #DC2626 !important; }
      `}</style>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* ── Month Calendar ────────────────────────────────────────────── */}
        <div style={{
          background: 'white', border: '1.5px solid #E8F5E9',
          borderRadius: 22, padding: 24,
          boxShadow: '0 2px 14px rgba(0,0,0,0.04)',
        }}>
          {/* Calendar header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{
              fontFamily: "'Nunito', sans-serif", fontWeight: 900,
              fontSize: '1.1rem', color: '#1A3A1A',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              📅 {monthName} {year}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                className="cal-nav-btn"
                style={{
                  width: 32, height: 32, borderRadius: 10,
                  border: '1.5px solid #E8F5E9', background: 'white',
                  cursor: 'pointer', fontSize: '0.9rem', color: '#5A7A5A',
                  transition: 'background 0.15s',
                }}
              >←</button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="cal-nav-btn"
                style={{
                  padding: '5px 12px', borderRadius: 10, fontSize: '0.75rem', fontWeight: 700,
                  border: '1.5px solid #E8F5E9', background: 'white',
                  cursor: 'pointer', color: '#2E7D32',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  transition: 'background 0.15s',
                }}
              >Today</button>
              <button
                onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                className="cal-nav-btn"
                style={{
                  width: 32, height: 32, borderRadius: 10,
                  border: '1.5px solid #E8F5E9', background: 'white',
                  cursor: 'pointer', fontSize: '0.9rem', color: '#5A7A5A',
                  transition: 'background 0.15s',
                }}
              >→</button>
            </div>
          </div>

          {/* Weekday labels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: 8 }}>
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
              <div key={d} style={{
                padding: '4px 0', fontSize: '0.7rem', fontWeight: 800,
                color: '#AACAAA', textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>{d}</div>
            ))}
          </div>

          {/* Day grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
            {daysArray.map((day, idx) => {
              if (day === null) return <div key={`e-${idx}`} />

              const curDayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const isToday   = curDayStr === todayStr
              const dayEvents = events.filter(e => e.date === curDayStr)

              return (
                <div
                  key={day}
                  className={!isToday ? 'cal-day' : ''}
                  style={{
                    minHeight: 72, borderRadius: 12, padding: '6px 7px',
                    border: `1.5px solid ${isToday ? '#4CAF50' : '#E8F5E9'}`,
                    background: isToday ? '#F0FDF4' : '#FAFDF9',
                    transition: 'background 0.15s',
                    overflow: 'hidden',
                  }}
                >
                  <span style={{
                    fontSize: '0.78rem', fontWeight: 800,
                    color: isToday ? '#2E7D32' : '#5A7A5A',
                    display: 'block', marginBottom: 3,
                  }}>{day}</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, overflow: 'hidden' }}>
                    {dayEvents.map(ev => (
                      <div
                        key={ev.id}
                        title={ev.title}
                        style={{
                          fontSize: '9px', fontWeight: 700,
                          padding: '1px 4px', borderRadius: 4,
                          background: TYPE_CONFIG[ev.type]?.bg || '#E8F5E9',
                          color: TYPE_CONFIG[ev.type]?.color || '#2E7D32',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}
                      >{ev.title}</div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Right column ──────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Add event */}
          <div style={{
            background: 'white', border: '1.5px solid #E8F5E9',
            borderRadius: 22, padding: 22,
            boxShadow: '0 2px 14px rgba(0,0,0,0.04)',
          }}>
            <h4 style={{
              fontFamily: "'Nunito', sans-serif", fontWeight: 900,
              fontSize: '0.95rem', color: '#1A3A1A', marginBottom: 14,
            }}>➕ Add Study Event</h4>

            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                className="cal-input"
                type="text"
                placeholder="Event title (e.g. Chemistry Paper)…"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                required
                style={inputStyle}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <input
                  className="cal-input"
                  type="date"
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  required
                  style={inputStyle}
                />
                <select
                  className="cal-select"
                  value={newType}
                  onChange={e => setNewType(e.target.value)}
                  style={selectStyle}
                >
                  <option value="study">📖 Study</option>
                  <option value="paper">📝 Paper</option>
                  <option value="class">🎓 Live Class</option>
                  <option value="exam">🏆 Exam</option>
                </select>
              </div>
              <button
                type="submit"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                  color: 'white', border: 'none', borderRadius: 50,
                  padding: '10px 0', fontSize: '0.85rem', fontWeight: 700,
                  cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
                  boxShadow: '0 3px 12px rgba(76,175,80,0.28)',
                }}
              >
                ➕ Add Event
              </button>
            </form>
          </div>

          {/* Events list */}
          <div style={{
            background: 'white', border: '1.5px solid #E8F5E9',
            borderRadius: 22, padding: 22, flex: 1,
            boxShadow: '0 2px 14px rgba(0,0,0,0.04)',
          }}>
            <h4 style={{
              fontFamily: "'Nunito', sans-serif", fontWeight: 900,
              fontSize: '0.95rem', color: '#1A3A1A', marginBottom: 14,
            }}>📋 Scheduled Events</h4>

            {events.length === 0 ? (
              <p style={{ fontSize: '0.82rem', color: '#AACAAA', textAlign: 'center', padding: '20px 0' }}>
                No events yet. Add your study schedule above!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 300, overflowY: 'auto' }}>
                {events.map(ev => {
                  const cfg = TYPE_CONFIG[ev.type] || TYPE_CONFIG.study
                  return (
                    <div
                      key={ev.id}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        background: '#FAFDF9', border: '1.5px solid #E8F5E9',
                        borderRadius: 14, padding: '11px 14px',
                      }}
                    >
                      <div>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center',
                          padding: '2px 9px', borderRadius: 50, fontSize: '0.68rem', fontWeight: 700,
                          background: cfg.bg, color: cfg.color, marginBottom: 5,
                        }}>{cfg.label}</span>
                        <div style={{
                          fontFamily: "'Nunito', sans-serif", fontWeight: 900,
                          fontSize: '0.87rem', color: '#1A3A1A',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          maxWidth: 170,
                        }}>{ev.title}</div>
                        <div style={{ fontSize: '0.72rem', color: '#7A9A7A', marginTop: 2 }}>📅 {ev.date}</div>
                      </div>
                      <button
                        onClick={() => handleDelete(ev.id)}
                        className="cal-del-btn"
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: '#AACAAA', borderRadius: 8, padding: '4px 6px',
                          fontSize: '0.85rem', transition: 'background 0.15s, color 0.15s',
                        }}
                      >🗑</button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}