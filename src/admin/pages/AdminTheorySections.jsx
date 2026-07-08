import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  adminGetTheorySections,
  adminCreateTheorySection,
  adminUpdateTheorySection,
  adminDeleteTheorySection,
} from '../../api/api'

const SECTION_TYPES = [
  { value: 'text',       label: 'Text',       icon: '📝', bg: '#F8FAFC', border: '#E2E8F0', color: '#475569' },
  { value: 'definition', label: 'Definition', icon: '📘', bg: '#EFF6FF', border: '#BFDBFE', color: '#1D4ED8' },
  { value: 'example',    label: 'Example',    icon: '🔍', bg: '#FFFBEB', border: '#FDE68A', color: '#92400E' },
  { value: 'note',       label: 'Note',       icon: '💡', bg: '#FEF9E7', border: '#FCD34D', color: '#B45309' },
  { value: 'important',  label: 'Important',  icon: '⚠️', bg: '#FEF2F2', border: '#FECACA', color: '#991B1B' },
  { value: 'formula',    label: 'Formula',    icon: '🔢', bg: '#F0FDF4', border: '#BBF7D0', color: '#15803D' },
  { value: 'summary',    label: 'Summary',    icon: '📋', bg: '#F5F3FF', border: '#DDD6FE', color: '#6D28D9' },
]

const TYPE_MAP = Object.fromEntries(SECTION_TYPES.map(t => [t.value, t]))

const emptyForm = {
  title:     '',
  content:   '',
  type:      'text',
  ordering:  0,
  is_active: true,
}

export default function AdminTheorySections() {
  const { topicId } = useParams()
  const navigate    = useNavigate()

  const [sections,  setSections]  = useState([])
  const [topicName, setTopicName] = useState('')
  const [form,      setForm]      = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [error,     setError]     = useState('')
  const [saving,    setSaving]    = useState(false)
  const [expanded,  setExpanded]  = useState(null)

  useEffect(() => { loadData() }, [topicId])

  async function loadData() {
    try {
      const res = await adminGetTheorySections(topicId)
      setSections(res.data)
      // topic name comes back in first section or we leave it blank
      if (res.data.length > 0 && res.data[0].topic_title) {
        setTopicName(res.data[0].topic_title)
      }
    } catch (err) {
      setError(JSON.stringify(err.response?.data || 'Could not load sections'))
    }
  }

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function startEdit(section) {
    setEditingId(section.id)
    setExpanded(section.id)
    setForm({
      title:     section.title     || '',
      content:   section.content   || '',
      type:      section.type      || 'text',
      ordering:  section.ordering  ?? 0,
      is_active: section.is_active ?? true,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyForm)
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const payload = {
        ...form,
        topic:    Number(topicId),
        ordering: Number(form.ordering),
      }
      if (editingId) {
        await adminUpdateTheorySection(editingId, payload)
      } else {
        await adminCreateTheorySection(topicId, payload)
      }
      setForm(emptyForm)
      setEditingId(null)
      await loadData()
    } catch (err) {
      setError(JSON.stringify(err.response?.data || 'Save failed'))
    } finally {
      setSaving(false)
    }
  }

  async function remove(id) {
    if (!confirm('Delete this section?')) return
    try {
      await adminDeleteTheorySection(id)
      if (editingId === id) cancelEdit()
      await loadData()
    } catch (err) {
      setError(JSON.stringify(err.response?.data || 'Delete failed'))
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

        .ats-root {
          min-height: 100vh;
          background: #F3F7F3;
          padding-top: 68px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #1A3A1A;
        }
        .ats-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 36px 24px 72px;
        }
        .ats-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
          gap: 12px;
          flex-wrap: wrap;
        }
        .ats-title-sub {
          font-size: 0.75rem;
          color: #06B6D4;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          margin-bottom: 4px;
        }
        .ats-title {
          font-family: 'Nunito', sans-serif;
          font-weight: 900;
          font-size: 1.7rem;
          color: #1A3A1A;
          letter-spacing: -0.02em;
        }
        .ats-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: white;
          border: 1.5px solid #D1E9D1;
          color: #5A7A5A;
          font-weight: 600;
          font-size: 0.85rem;
          padding: 8px 16px;
          border-radius: 50px;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.18s;
        }
        .ats-back-btn:hover {
          background: #E8F5E9;
          color: #2E7D32;
          border-color: #A5D6A7;
        }
        .ats-count-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #ECFEFF;
          color: #0E7490;
          border: 1.5px solid #A5F3FC;
          font-size: 0.8rem;
          font-weight: 700;
          padding: 5px 13px;
          border-radius: 50px;
        }
        .ats-error {
          background: #FEF2F2;
          border: 1.5px solid #FECACA;
          color: #DC2626;
          border-radius: 14px;
          padding: 12px 16px;
          font-size: 0.87rem;
          margin-bottom: 20px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
        }
        .ats-card {
          background: white;
          border: 1.5px solid #E8F5E9;
          border-radius: 22px;
          padding: 28px;
          margin-bottom: 22px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
          animation: fadeUp 0.4s ease both;
        }
        .ats-card-title {
          font-family: 'Nunito', sans-serif;
          font-weight: 900;
          font-size: 1.1rem;
          color: #1A3A1A;
          margin-bottom: 22px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .ats-icon-box {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: #ECFEFF;
          border: 1.5px solid #A5F3FC;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
        }
        .ats-field { margin-bottom: 16px; }
        .ats-label {
          display: block;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #7A9A7A;
          margin-bottom: 6px;
        }
        .ats-input {
          width: 100%;
          padding: 10px 14px;
          border-radius: 12px;
          border: 1.5px solid #E8F5E9;
          background: #FAFCFA;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.875rem;
          color: #1A3A1A;
          outline: none;
          transition: border-color 0.2s;
        }
        .ats-input:focus { border-color: #A5F3FC; }
        .ats-textarea {
          width: 100%;
          padding: 10px 14px;
          border-radius: 12px;
          border: 1.5px solid #E8F5E9;
          background: #FAFCFA;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.875rem;
          color: #1A3A1A;
          outline: none;
          resize: vertical;
          line-height: 1.6;
          transition: border-color 0.2s;
        }
        .ats-textarea:focus { border-color: #A5F3FC; }

        /* Type selector grid */
        .ats-type-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 8px;
          margin-bottom: 4px;
        }
        .ats-type-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 10px 8px;
          border-radius: 12px;
          border: 1.5px solid #E8F5E9;
          background: white;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          color: #7A9A7A;
          transition: all 0.18s;
        }
        .ats-type-btn:hover {
          border-color: #A5F3FC;
          background: #ECFEFF;
          color: #0E7490;
        }
        .ats-type-btn.selected {
          border-color: currentColor;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
        }
        .ats-type-icon { font-size: 1.2rem; }

        /* Checkrow */
        .ats-check-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }
        .ats-check-label {
          font-size: 0.85rem;
          color: #4A6A4A;
          font-weight: 500;
          cursor: pointer;
        }

        /* Submit row */
        .ats-submit-row {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }
        .ats-submit-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, #06B6D4, #0E7490);
          color: white;
          font-weight: 700;
          font-size: 0.88rem;
          padding: 10px 22px;
          border-radius: 50px;
          border: none;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          box-shadow: 0 3px 12px rgba(6,182,212,0.3);
          transition: opacity 0.18s;
        }
        .ats-submit-btn:hover { opacity: 0.88; }
        .ats-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .ats-cancel-btn {
          display: inline-flex;
          align-items: center;
          background: white;
          color: #64748B;
          font-weight: 600;
          font-size: 0.85rem;
          padding: 9px 18px;
          border-radius: 50px;
          border: 1.5px solid #E2E8F0;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: background 0.18s;
        }
        .ats-cancel-btn:hover { background: #F1F5F9; }

        /* Section rows */
        .ats-section-row {
          border: 1.5px solid #E8F5E9;
          border-radius: 16px;
          margin-bottom: 10px;
          overflow: hidden;
          transition: border-color 0.2s;
          animation: fadeUp 0.3s ease both;
        }
        .ats-section-row:hover { border-color: #A5F3FC; }
        .ats-section-row.editing { border-color: #06B6D4; box-shadow: 0 0 0 3px rgba(6,182,212,0.1); }
        .ats-section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          cursor: pointer;
          background: #FAFCFA;
          flex-wrap: wrap;
        }
        .ats-section-num {
          width: 26px;
          height: 26px;
          border-radius: 8px;
          background: #ECFEFF;
          color: #0E7490;
          border: 1.5px solid #A5F3FC;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.72rem;
          font-weight: 800;
          flex-shrink: 0;
        }
        .ats-section-text {
          flex: 1;
          font-size: 0.875rem;
          font-weight: 600;
          color: #1A3A1A;
          min-width: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ats-section-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          flex-wrap: wrap;
        }
        .ats-type-pill {
          border-radius: 50px;
          padding: 3px 10px;
          font-size: 0.7rem;
          font-weight: 700;
          border: 1px solid;
        }
        .ats-edit-btn {
          font-size: 0.75rem;
          font-weight: 700;
          color: #06B6D4;
          background: transparent;
          border: 1.5px solid #06B6D4;
          border-radius: 50px;
          padding: 5px 12px;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.18s;
        }
        .ats-edit-btn:hover { background: #ECFEFF; }
        .ats-delete-btn {
          font-size: 0.85rem;
          background: transparent;
          border: none;
          cursor: pointer;
          color: #EF4444;
          padding: 4px 6px;
          border-radius: 8px;
          transition: background 0.15s;
        }
        .ats-delete-btn:hover { background: #FEE2E2; }
        .ats-section-body {
          padding: 0 18px 18px;
          border-top: 1.5px solid #F0F9F0;
        }
        .ats-section-content {
          margin-top: 14px;
          border-radius: 14px;
          padding: 16px 18px;
          font-size: 0.875rem;
          line-height: 1.7;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .ats-empty {
          text-align: center;
          padding: 40px 20px;
          color: #7A9A7A;
        }
        .ats-empty-icon { font-size: 2.5rem; margin-bottom: 10px; }
      `}</style>

      <main className="ats-root">
        <div className="ats-inner">

          {/* ── Top bar ── */}
          <div className="ats-topbar">
            <div>
              <p className="ats-title-sub">Admin · Theory</p>
              <h1 className="ats-title">
                {topicName ? `📖 ${topicName}` : '📖 Theory Sections'}
              </h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="ats-count-badge">📄 {sections.length} sections</span>
              <button className="ats-back-btn" onClick={() => navigate('/admin/theory')}>
                ← Back to Topics
              </button>
            </div>
          </div>

          {/* ── Error ── */}
          {error && (
            <div className="ats-error">
              <span>{error}</span>
              <button
                onClick={() => setError('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#991B1B', fontWeight: 700 }}
              >
                ✕
              </button>
            </div>
          )}

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="ats-card">
            <div className="ats-card-title">
              <span className="ats-icon-box">✏️</span>
              {editingId ? 'Edit Section' : 'Add Section'}
            </div>

            {/* Section type selector */}
            <div className="ats-field">
              <label className="ats-label">Section Type</label>
              <div className="ats-type-grid">
                {SECTION_TYPES.map(t => {
                  const selected = form.type === t.value
                  return (
                    <button
                      key={t.value}
                      type="button"
                      className={`ats-type-btn ${selected ? 'selected' : ''}`}
                      style={selected ? {
                        background: t.bg,
                        borderColor: t.border,
                        color: t.color,
                      } : {}}
                      onClick={() => set('type', t.value)}
                    >
                      <span className="ats-type-icon">{t.icon}</span>
                      {t.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Title (optional) */}
            <div className="ats-field">
              <label className="ats-label">Section Title <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
              <input
                className="ats-input"
                placeholder="e.g. What is an atom?"
                value={form.title}
                onChange={e => set('title', e.target.value)}
              />
            </div>

            {/* Content */}
            <div className="ats-field">
              <label className="ats-label">Content</label>
              <textarea
                className="ats-textarea"
                rows={6}
                placeholder="Write the section content here. You can use LaTeX for math: $E = mc^2$"
                value={form.content}
                onChange={e => set('content', e.target.value)}
                required
              />
            </div>

            {/* Ordering */}
            <div className="ats-field">
              <label className="ats-label">Ordering</label>
              <input
                type="number"
                className="ats-input"
                value={form.ordering}
                onChange={e => set('ordering', e.target.value)}
                min={0}
                style={{ maxWidth: 140 }}
              />
            </div>

            {/* Active */}
            <div className="ats-check-row">
              <input
                type="checkbox"
                id="section_active"
                checked={form.is_active}
                onChange={e => set('is_active', e.target.checked)}
                style={{ accentColor: '#0E7490', width: 15, height: 15 }}
              />
              <label htmlFor="section_active" className="ats-check-label">
                Active (visible to students)
              </label>
            </div>

            <div className="ats-submit-row">
              <button type="submit" className="ats-submit-btn" disabled={saving}>
                {saving ? '⏳ Saving…' : editingId ? '✓ Update Section' : '+ Add Section'}
              </button>
              {editingId && (
                <button type="button" className="ats-cancel-btn" onClick={cancelEdit}>
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* ── Sections list ── */}
          <div className="ats-card">
            <div className="ats-card-title">
              <span className="ats-icon-box">📋</span>
              Sections ({sections.length})
            </div>

            {sections.length === 0 ? (
              <div className="ats-empty">
                <div className="ats-empty-icon">📭</div>
                No sections added yet. Add your first section above.
              </div>
            ) : (
              sections.map((section, i) => {
                const typeInfo = TYPE_MAP[section.type] || TYPE_MAP.text
                const isOpen   = expanded === section.id

                return (
                  <div
                    key={section.id}
                    className={`ats-section-row ${editingId === section.id ? 'editing' : ''}`}
                  >
                    {/* Row header */}
                    <div
                      className="ats-section-header"
                      onClick={() => setExpanded(isOpen ? null : section.id)}
                    >
                      <div className="ats-section-num">{section.ordering || i + 1}</div>

                      <div className="ats-section-text">
                        {section.title || section.content.slice(0, 60) + (section.content.length > 60 ? '…' : '')}
                      </div>

                      <div className="ats-section-meta">
                        {/* Type pill */}
                        <span
                          className="ats-type-pill"
                          style={{
                            background:   typeInfo.bg,
                            color:        typeInfo.color,
                            borderColor:  typeInfo.border,
                          }}
                        >
                          {typeInfo.icon} {typeInfo.label}
                        </span>

                        {/* Active indicator */}
                        {!section.is_active && (
                          <span style={{
                            background: '#F1F5F9', color: '#64748B',
                            border: '1px solid #E2E8F0',
                            borderRadius: 50, padding: '2px 8px',
                            fontSize: '0.68rem', fontWeight: 700,
                          }}>
                            Hidden
                          </span>
                        )}

                        <button
                          className="ats-edit-btn"
                          onClick={ev => { ev.stopPropagation(); startEdit(section) }}
                        >
                          Edit
                        </button>
                        <button
                          className="ats-delete-btn"
                          onClick={ev => { ev.stopPropagation(); remove(section.id) }}
                        >
                          🗑
                        </button>
                        <span style={{ color: '#B0C4B0', fontSize: '0.9rem' }}>
                          {isOpen ? '▲' : '▼'}
                        </span>
                      </div>
                    </div>

                    {/* Expanded body */}
                    {isOpen && (
                      <div className="ats-section-body">
                        <div
                          className="ats-section-content"
                          style={{
                            background:  typeInfo.bg,
                            border:      `1.5px solid ${typeInfo.border}`,
                            color:       typeInfo.color || '#1A3A1A',
                          }}
                        >
                          {typeInfo.value !== 'text' && (
                            <div style={{
                              fontSize: '0.72rem', fontWeight: 800,
                              textTransform: 'uppercase', letterSpacing: '0.06em',
                              marginBottom: 8, opacity: 0.7,
                            }}>
                              {typeInfo.icon} {typeInfo.label}
                            </div>
                          )}
                          {section.title && (
                            <div style={{ fontWeight: 700, marginBottom: 6, fontSize: '0.92rem' }}>
                              {section.title}
                            </div>
                          )}
                          <div style={{ color: '#1A3A1A', lineHeight: 1.7 }}>
                            {section.content}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>

        </div>
      </main>
    </>
  )
}