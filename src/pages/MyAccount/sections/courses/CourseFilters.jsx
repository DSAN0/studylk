import React from 'react'

export default function CourseFilters({
  searchQuery,
  setSearchQuery,
  courseFilter,
  setCourseFilter,
  allCount = 0,
  approvedCount = 0,
  pendingCount = 0,
}) {
  const filters = [
    { id: 'all',      label: `All (${allCount})` },
    { id: 'approved', label: `✅ Approved (${approvedCount})` },
    { id: 'pending',  label: `⏳ Pending (${pendingCount})` },
  ]

  return (
    <>
      <style>{`
        .cf-pill:hover   { background: #E8F5E9 !important; color: #2E7D32 !important; border-color: #A5D6A7 !important; }
        .cf-search:focus { border-color: #4CAF50 !important; outline: none; box-shadow: 0 0 0 3px rgba(76,175,80,0.12); }
        .cf-clear:hover  { color: #2E7D32 !important; }
      `}</style>

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        {/* Filter pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {filters.map(f => {
            const isActive = courseFilter === f.id
            return (
              <button
                key={f.id}
                onClick={() => setCourseFilter(f.id)}
                className={!isActive ? 'cf-pill' : ''}
                style={{
                  padding: '7px 16px', borderRadius: 50, fontSize: '0.8rem', fontWeight: 700,
                  border: isActive ? 'none' : '1.5px solid #E8F5E9',
                  background: isActive
                    ? 'linear-gradient(135deg, #4CAF50, #2E7D32)'
                    : 'white',
                  color: isActive ? 'white' : '#4A6A4A',
                  cursor: 'pointer',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  boxShadow: isActive ? '0 3px 10px rgba(76,175,80,0.28)' : 'none',
                  transition: 'background 0.15s, color 0.15s, border-color 0.15s',
                }}
              >
                {f.label}
              </button>
            )
          })}
        </div>

        {/* Search input */}
        <div style={{ position: 'relative', minWidth: 240 }}>
          <span style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            fontSize: '0.9rem', pointerEvents: 'none', color: '#9ABA9A',
          }}>🔍</span>
          <input
            type="text"
            placeholder="Search course or teacher..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="cf-search"
            style={{
              width: '100%',
              padding: '9px 36px 9px 36px',
              border: '1.5px solid #E8F5E9', borderRadius: 14,
              fontSize: '0.85rem', color: '#1A3A1A',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              background: 'white',
              transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="cf-clear"
              style={{
                position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '0.9rem', color: '#AACAAA',
                transition: 'color 0.15s',
              }}
            >✕</button>
          )}
        </div>
      </div>
    </>
  )
}