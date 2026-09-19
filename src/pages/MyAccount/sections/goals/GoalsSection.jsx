import React, { useState, useEffect } from 'react'

const CATEGORIES = ['Physics', 'Maths', 'Chemistry', 'Biology', 'Daily Practice', 'Revision']

const CATEGORY_COLORS = {
  Physics:        { bg: '#EFF6FF', border: '#BFDBFE', color: '#1D4ED8' },
  Maths:          { bg: '#F5F3FF', border: '#DDD6FE', color: '#6D28D9' },
  Chemistry:      { bg: '#FEF9E7', border: '#FDE68A', color: '#D97706' },
  Biology:        { bg: '#F0FDF4', border: '#BBF7D0', color: '#16A34A' },
  'Daily Practice':{ bg: '#E8F5E9', border: '#C8E6C9', color: '#2E7D32' },
  Revision:       { bg: '#FEF2F2', border: '#FECACA', color: '#DC2626' },
}

export default function GoalsSection() {
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('studylk_goals')
    return saved ? JSON.parse(saved) : [
      { id: '1', text: 'Complete Physics Mechanics past paper MCQ practice', category: 'Physics',        done: true  },
      { id: '2', text: 'Practice 2022 Combined Mathematics structured problems', category: 'Maths',     done: false },
      { id: '3', text: 'Review Chemistry Organic Reaction Notes & Reagents',    category: 'Chemistry',  done: false },
      { id: '4', text: 'Solve 20 Daily Questions',                              category: 'Daily Practice', done: false },
    ]
  })
  const [newText,     setNewText]     = useState('')
  const [newCategory, setNewCategory] = useState('Physics')

  useEffect(() => {
    localStorage.setItem('studylk_goals', JSON.stringify(goals))
  }, [goals])

  const handleToggle = id => setGoals(prev => prev.map(g => g.id === id ? { ...g, done: !g.done } : g))
  const handleDelete = id => setGoals(prev => prev.filter(g => g.id !== id))

  const handleAdd = e => {
    e.preventDefault()
    if (!newText.trim()) return
    setGoals(prev => [{ id: Date.now().toString(), text: newText.trim(), category: newCategory, done: false }, ...prev])
    setNewText('')
  }

  const completedCount = goals.filter(g => g.done).length
  const percentDone    = goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0

  const inputStyle = {
    flex: 1, padding: '10px 14px',
    border: '1.5px solid #E8F5E9', borderRadius: 14,
    fontSize: '0.87rem', color: '#1A3A1A',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    background: 'white',
  }

  return (
    <>
      <style>{`
        .goal-input:focus, .goal-select:focus {
          border-color: #4CAF50 !important;
          outline: none;
          box-shadow: 0 0 0 3px rgba(76,175,80,0.12);
        }
        .goal-row:hover { border-color: #A5D6A7 !important; }
        .goal-del:hover  { background: #FEF2F2 !important; color: #DC2626 !important; }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* ── Header + Progress Card ───────────────────────────────────── */}
        <div style={{
          background: 'white', border: '1.5px solid #E8F5E9',
          borderRadius: 22, padding: 24,
          boxShadow: '0 2px 14px rgba(0,0,0,0.04)',
        }}>
          <h2 style={{
            fontFamily: "'Nunito', sans-serif", fontWeight: 900,
            fontSize: '1.15rem', color: '#1A3A1A',
            marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8,
          }}>🎯 Goals & Study Milestones</h2>
          <p style={{ fontSize: '0.83rem', color: '#7A9A7A', marginBottom: 18 }}>
            Set daily targets, track revision milestones, and monitor your exam preparation.
          </p>

          {/* Progress bar */}
          <div style={{ marginBottom: 18 }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: '0.77rem', fontWeight: 700, marginBottom: 7,
            }}>
              <span style={{ color: '#7A9A7A' }}>
                {completedCount} of {goals.length} targets completed
              </span>
              <span style={{ color: '#4CAF50' }}>{percentDone}% Achieved</span>
            </div>
            <div style={{
              height: 10, background: '#E8F5E9', borderRadius: 5, overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', borderRadius: 5,
                background: 'linear-gradient(90deg, #4CAF50, #2E7D32)',
                width: `${percentDone}%`,
                transition: 'width 0.4s ease',
              }} />
            </div>
          </div>

          {/* Add goal form */}
          <form onSubmit={handleAdd} style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <input
              className="goal-input"
              type="text"
              placeholder="Add new study goal or target…"
              value={newText}
              onChange={e => setNewText(e.target.value)}
              required
              style={inputStyle}
            />
            <select
              className="goal-select"
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              style={{
                padding: '10px 12px', borderRadius: 14,
                border: '1.5px solid #E8F5E9', background: 'white',
                fontSize: '0.85rem', color: '#1A3A1A',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                cursor: 'pointer',
              }}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button
              type="submit"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                color: 'white', border: 'none', borderRadius: 50,
                padding: '10px 22px', fontSize: '0.87rem', fontWeight: 700,
                cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
                boxShadow: '0 3px 12px rgba(76,175,80,0.28)', whiteSpace: 'nowrap',
              }}
            >
              ➕ Add Goal
            </button>
          </form>
        </div>

        {/* ── Checklist ────────────────────────────────────────────────── */}
        <div style={{
          background: 'white', border: '1.5px solid #E8F5E9',
          borderRadius: 22, padding: 24,
          boxShadow: '0 2px 14px rgba(0,0,0,0.04)',
        }}>
          <h3 style={{
            fontFamily: "'Nunito', sans-serif", fontWeight: 900,
            fontSize: '0.98rem', color: '#1A3A1A',
            marginBottom: 14, display: 'flex', alignItems: 'center', gap: 7,
          }}>📋 Your Active Targets</h3>

          {goals.length === 0 ? (
            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#AACAAA', padding: '28px 0' }}>
              No goals yet. Add your first goal above!
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {goals.map((goal, i) => {
                const cat = CATEGORY_COLORS[goal.category] || CATEGORY_COLORS.Physics
                return (
                  <div
                    key={goal.id}
                    className="goal-row"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      background: goal.done ? '#FAFDF9' : 'white',
                      border: '1.5px solid #E8F5E9', borderRadius: 14,
                      padding: '13px 14px',
                      opacity: goal.done ? 0.65 : 1,
                      transition: 'border-color 0.15s',
                      animation: `fadeUp 0.3s ${i * 0.04}s ease both`,
                    }}
                  >
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={goal.done}
                      onChange={() => handleToggle(goal.id)}
                      style={{
                        width: 17, height: 17, cursor: 'pointer', flexShrink: 0,
                        accentColor: '#4CAF50',
                      }}
                    />

                    {/* Text + category */}
                    <label style={{
                      flex: 1, display: 'flex', flexWrap: 'wrap',
                      alignItems: 'center', gap: 8, cursor: 'pointer',
                    }} onClick={() => handleToggle(goal.id)}>
                      <span style={{
                        fontSize: '0.88rem', fontWeight: 600, color: '#1A3A1A',
                        textDecoration: goal.done ? 'line-through' : 'none',
                        textDecorationColor: '#AACAAA',
                      }}>{goal.text}</span>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center',
                        padding: '2px 9px', borderRadius: 50, fontSize: '0.68rem', fontWeight: 700,
                        background: cat.bg, border: `1.5px solid ${cat.border}`, color: cat.color,
                        flexShrink: 0,
                      }}>{goal.category}</span>
                    </label>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="goal-del"
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: '#AACAAA', borderRadius: 8, padding: '4px 6px',
                        fontSize: '0.85rem', transition: 'background 0.15s, color 0.15s',
                        flexShrink: 0,
                      }}
                    >🗑</button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}