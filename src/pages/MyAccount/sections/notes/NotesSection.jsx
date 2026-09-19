import React, { useState, useEffect } from 'react'

// Each note stores a color key ('emerald'|'amber'|'sky'|'purple')
// Backward compat: detect old Tailwind class strings from localStorage
const COLOR_STYLES = {
  emerald: { background: '#ECFDF5', border: '1.5px solid #A7F3D0', color: '#064E3B', dot: '#4CAF50' },
  amber:   { background: '#FFFBEB', border: '1.5px solid #FDE68A', color: '#78350F', dot: '#D97706' },
  sky:     { background: '#F0F9FF', border: '1.5px solid #BAE6FD', color: '#0C4A6E', dot: '#0EA5E9' },
  purple:  { background: '#FAF5FF', border: '1.5px solid #E9D5FF', color: '#3B0764', dot: '#7C3AED' },
}

function getNoteStyle(colorKey) {
  if (COLOR_STYLES[colorKey]) return COLOR_STYLES[colorKey]
  if (colorKey?.includes('amber'))  return COLOR_STYLES.amber
  if (colorKey?.includes('sky'))    return COLOR_STYLES.sky
  if (colorKey?.includes('purple')) return COLOR_STYLES.purple
  return COLOR_STYLES.emerald
}

const COLOR_DOTS = ['emerald', 'amber', 'sky', 'purple']
const TAGS = ['Physics', 'Chemistry', 'Maths', 'Biology', 'General']

export default function NotesSection() {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('studylk_notes')
    return saved ? JSON.parse(saved) : [
      {
        id: '1', title: 'Newtonian Mechanics Formulas',
        content: 'F = ma\nv = u + at\ns = ut + 0.5at²\nv² = u² + 2as',
        color: 'emerald', tag: 'Physics', updatedAt: 'Today',
      },
      {
        id: '2', title: 'Important Organic Chemistry Reagents',
        content: '1. PCl5: converts OH → Cl\n2. KMnO4 / H+: strong oxidizer\n3. LiAlH4: reduces acids → primary alcohols',
        color: 'amber', tag: 'Chemistry', updatedAt: 'Yesterday',
      },
    ]
  })

  const [search,       setSearch]       = useState('')
  const [newTitle,     setNewTitle]     = useState('')
  const [newContent,   setNewContent]   = useState('')
  const [newTag,       setNewTag]       = useState('Physics')
  const [newColorKey,  setNewColorKey]  = useState('emerald')
  const [isCreating,   setIsCreating]   = useState(false)

  useEffect(() => {
    localStorage.setItem('studylk_notes', JSON.stringify(notes))
  }, [notes])

  const handleCreate = e => {
    e.preventDefault()
    if (!newTitle.trim() && !newContent.trim()) return
    setNotes(prev => [{
      id: Date.now().toString(),
      title: newTitle.trim() || 'Untitled Note',
      content: newContent.trim(),
      tag: newTag, color: newColorKey,
      updatedAt: 'Just now',
    }, ...prev])
    setNewTitle(''); setNewContent(''); setIsCreating(false)
  }

  const handleDelete = id => setNotes(prev => prev.filter(n => n.id !== id))

  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase()) ||
    n.tag.toLowerCase().includes(search.toLowerCase())
  )

  const inputBase = {
    width: '100%', padding: '9px 14px',
    border: '1.5px solid #E8F5E9', borderRadius: 12,
    fontSize: '0.87rem', color: '#1A3A1A',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    background: 'white',
  }

  return (
    <>
      <style>{`
        .ns-input:focus, .ns-textarea:focus, .ns-select:focus {
          border-color: #4CAF50 !important; outline: none;
          box-shadow: 0 0 0 3px rgba(76,175,80,0.12);
        }
        .ns-note-card:hover  { transform: translateY(-3px) !important; box-shadow: 0 8px 24px rgba(0,0,0,0.09) !important; }
        .ns-del-btn:hover    { color: #DC2626 !important; }
        .ns-clear:hover      { color: #2E7D32 !important; }
        .ns-search:focus     { border-color: #4CAF50 !important; outline: none; box-shadow: 0 0 0 3px rgba(76,175,80,0.12); }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* ── Top bar ─────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          {/* Search */}
          <div style={{ position: 'relative', minWidth: 240 }}>
            <span style={{
              position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
              fontSize: '0.9rem', pointerEvents: 'none', color: '#9ABA9A',
            }}>🔍</span>
            <input
              className="ns-search"
              type="text"
              placeholder="Search notes or formulas…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ ...inputBase, paddingLeft: 36, paddingRight: 32 }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="ns-clear"
                style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#AACAAA', fontSize: '0.9rem', transition: 'color 0.15s',
                }}
              >✕</button>
            )}
          </div>

          <button
            onClick={() => setIsCreating(c => !c)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: isCreating
                ? 'white'
                : 'linear-gradient(135deg, #4CAF50, #2E7D32)',
              color: isCreating ? '#DC2626' : 'white',
              border: isCreating ? '1.5px solid #FECACA' : 'none',
              borderRadius: 50, padding: '10px 22px',
              fontSize: '0.87rem', fontWeight: 700,
              cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
              boxShadow: isCreating ? 'none' : '0 3px 12px rgba(76,175,80,0.28)',
            }}
          >
            {isCreating ? '✕ Cancel' : '➕ Create New Note'}
          </button>
        </div>

        {/* ── Create form ──────────────────────────────────────────────── */}
        {isCreating && (
          <div style={{
            background: 'white', border: '1.5px solid #4CAF50',
            borderRadius: 22, padding: 24,
            boxShadow: '0 4px 20px rgba(76,175,80,0.12)',
            animation: 'fadeUp 0.25s ease',
          }}>
            <h4 style={{
              fontFamily: "'Nunito', sans-serif", fontWeight: 900,
              fontSize: '0.98rem', color: '#1A3A1A', marginBottom: 14,
            }}>📝 New Quick Study Note</h4>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                className="ns-input"
                type="text"
                placeholder="Note title (e.g. Waves & Doppler Effect Summary)…"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                required
                style={inputBase}
              />
              <textarea
                className="ns-textarea"
                placeholder="Write equations, key bullet points, or revision tips…"
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                rows={4}
                required
                style={{ ...inputBase, resize: 'vertical', lineHeight: 1.6 }}
              />
              <div style={{
                display: 'flex', flexWrap: 'wrap',
                alignItems: 'center', justifyContent: 'space-between', gap: 10,
              }}>
                {/* Color dots */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7A9A7A' }}>Color:</span>
                  {COLOR_DOTS.map(col => {
                    const s = COLOR_STYLES[col]
                    return (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setNewColorKey(col)}
                        style={{
                          width: 20, height: 20, borderRadius: '50%',
                          background: s.dot, border: 'none',
                          cursor: 'pointer', flexShrink: 0,
                          outline: newColorKey === col ? `3px solid ${s.dot}` : 'none',
                          outlineOffset: 2,
                          transition: 'outline 0.15s',
                        }}
                      />
                    )
                  })}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <select
                    className="ns-select"
                    value={newTag}
                    onChange={e => setNewTag(e.target.value)}
                    style={{
                      padding: '7px 10px', borderRadius: 10,
                      border: '1.5px solid #E8F5E9', background: 'white',
                      fontSize: '0.82rem', color: '#1A3A1A',
                      fontFamily: "'Plus Jakarta Sans', sans-serif", cursor: 'pointer',
                    }}
                  >
                    {TAGS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <button
                    type="submit"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                      color: 'white', border: 'none', borderRadius: 50,
                      padding: '8px 18px', fontSize: '0.82rem', fontWeight: 700,
                      cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
                      boxShadow: '0 3px 10px rgba(76,175,80,0.28)',
                    }}
                  >💾 Save Note</button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* ── Notes grid ───────────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '56px 32px',
            background: 'white', borderRadius: 22,
            border: '1.5px solid #E8F5E9',
            boxShadow: '0 2px 14px rgba(0,0,0,0.04)',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>📭</div>
            <h3 style={{
              fontFamily: "'Nunito', sans-serif", fontWeight: 900,
              fontSize: '1.2rem', color: '#1A3A1A', marginBottom: 8,
            }}>No study notes found</h3>
            <p style={{ color: '#7A9A7A', fontSize: '0.88rem', marginBottom: 20 }}>
              Create formula sheets, memory shortcuts, or exam reminders.
            </p>
            <button
              onClick={() => setIsCreating(true)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                color: 'white', border: 'none', borderRadius: 50,
                padding: '10px 22px', fontSize: '0.87rem', fontWeight: 700,
                cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
                boxShadow: '0 3px 12px rgba(76,175,80,0.28)',
              }}
            >➕ Create First Note</button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: 16,
          }}>
            {filtered.map((note, i) => {
              const s = getNoteStyle(note.color)
              return (
                <div
                  key={note.id}
                  className="ns-note-card"
                  style={{
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    background: s.background, border: s.border,
                    borderRadius: 18, padding: 20,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    animation: `fadeUp 0.3s ${i * 0.05}s ease both`,
                  }}
                >
                  <div>
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      marginBottom: 10,
                    }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center',
                        padding: '2px 9px', borderRadius: 50, fontSize: '0.68rem', fontWeight: 700,
                        background: 'rgba(255,255,255,0.6)', color: s.color,
                        border: `1px solid rgba(0,0,0,0.08)`,
                      }}>{note.tag}</span>
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="ns-del-btn"
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: 'rgba(0,0,0,0.25)', fontSize: '0.85rem',
                          transition: 'color 0.15s',
                        }}
                      >🗑</button>
                    </div>
                    <h4 style={{
                      fontFamily: "'Nunito', sans-serif", fontWeight: 900,
                      fontSize: '0.95rem', color: s.color, marginBottom: 8, lineHeight: 1.3,
                    }}>{note.title}</h4>
                    <p style={{
                      fontSize: '0.82rem', lineHeight: 1.75,
                      color: s.color, opacity: 0.85,
                      whiteSpace: 'pre-line',
                    }}>{note.content}</p>
                  </div>
                  <div style={{
                    marginTop: 14,
                    borderTop: '1px solid rgba(0,0,0,0.07)',
                    paddingTop: 8,
                    fontSize: '0.7rem', color: s.color, opacity: 0.6,
                  }}>
                    Updated: {note.updatedAt}
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