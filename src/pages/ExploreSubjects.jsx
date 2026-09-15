import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import { getExploreSubjects } from '../api/api'

const GRADE_META = {
  ol: {
    label: 'O/L',
    fullName: 'Ordinary Level',
    emoji: '📘',
    textColor: 'text-[#1565C0]',
    bgColor: 'bg-[#eff6ff]',
    borderColor: 'border-[#bfdbfe]',
    chipBg: 'bg-[#eff6ff]',
    btnBg: 'bg-[#1565C0]',
    gradient: 'from-[#0D47A1] via-[#1565C0] to-[#1976D2]',
    stepLabel: 'Step 2 of 3 — Select Subject',
  },
  grade5: {
    label: 'Grade 5',
    fullName: 'Scholarship Exam',
    emoji: '⭐',
    textColor: 'text-[#E64A19]',
    bgColor: 'bg-[#fff0ec]',
    borderColor: 'border-[#fed7ca]',
    chipBg: 'bg-[#fff0ec]',
    btnBg: 'bg-[#E64A19]',
    gradient: 'from-[#BF360C] via-[#E64A19] to-[#FF5722]',
    stepLabel: 'Step 2 of 3 — Select Subject',
  },
}

const STREAM_META = {
  science: {
    name: 'Science',
    emoji: '🔬',
    textColor: 'text-[#1565C0]',
    bgColor: 'bg-[#eff6ff]',
    borderColor: 'border-[#bfdbfe]',
    chipBg: 'bg-[#eff6ff]',
    btnBg: 'bg-[#1565C0]',
    gradient: 'from-[#0D47A1] via-[#1565C0] to-[#1976D2]',
  },
  commerce: {
    name: 'Commerce',
    emoji: '📊',
    textColor: 'text-[#7B1FA2]',
    bgColor: 'bg-[#faf5ff]',
    borderColor: 'border-[#e9d5ff]',
    chipBg: 'bg-[#faf5ff]',
    btnBg: 'bg-[#7B1FA2]',
    gradient: 'from-[#6A1B9A] via-[#7B1FA2] to-[#9C27B0]',
  },
  arts: {
    name: 'Arts',
    emoji: '🎨',
    textColor: 'text-[#D84315]',
    bgColor: 'bg-[#fff7f5]',
    borderColor: 'border-[#fed7ca]',
    chipBg: 'bg-[#fff0ec]',
    btnBg: 'bg-[#D84315]',
    gradient: 'from-[#BF360C] via-[#D84315] to-[#E64A19]',
  },
  tech: {
    name: 'Technology',
    emoji: '⚙️',
    textColor: 'text-[#2E7D32]',
    bgColor: 'bg-[#f0fdf4]',
    borderColor: 'border-[#bbf7d0]',
    chipBg: 'bg-[#e6f4ea]',
    btnBg: 'bg-[#2E7D32]',
    gradient: 'from-[#1B5E20] via-[#2E7D32] to-[#43A047]',
  },
}

export default function ExploreSubjects({ grade: propGrade }) {
  const { grade: paramGrade, stream } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  // Determine active grade
  let resolvedGrade = propGrade || paramGrade
  if (!resolvedGrade) {
    if (location.pathname.startsWith('/explore/ol')) resolvedGrade = 'ol'
    else if (location.pathname.startsWith('/explore/grade5')) resolvedGrade = 'grade5'
    else if (location.pathname.startsWith('/explore/al') || stream) resolvedGrade = 'al'
    else resolvedGrade = 'ol'
  }
  const grade = resolvedGrade

  const [query, setQuery] = useState('')
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Determine metadata based on whether this is AL (has stream) or OL/Grade5
  const isAL = Boolean(stream) || grade === 'al'
  const meta = isAL
    ? (stream ? (STREAM_META[stream] || STREAM_META.science) : STREAM_META.science)
    : (GRADE_META[grade] || GRADE_META.ol)

  const apiGrade = isAL ? 'al' : grade
  const apiStream = stream ? stream : undefined

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    getExploreSubjects(apiGrade, apiStream)
      .then(res => { if (!cancelled) setSubjects(res.data) })
      .catch(err => { if (!cancelled) setError(err.response?.data?.detail || err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [apiGrade, apiStream])

  const filtered = useMemo(() =>
    subjects.filter(s => s.name.toLowerCase().includes(query.toLowerCase()))
  , [subjects, query])

  function handleSelect(subject) {
    if (isAL && stream) {
      navigate(`/explore/al/${stream}/${subject.id}/choose`, {
        state: { subjectName: subject.name, grade: 'al', stream, streamName: STREAM_META[stream]?.name }
      })
    } else {
      navigate(`/explore/${grade}/${subject.id}/choose`, {
        state: { subjectName: subject.name, grade }
      })
    }
  }

  // Build breadcrumb
  const breadcrumbs = isAL && stream
    ? [
        { label: '🔍 Explore', href: '/explore' },
        { label: '🎓 A/L', href: '/explore/al' },
        { label: `${meta.emoji} ${meta.name}` },
      ]
    : [
        { label: '🔍 Explore', href: '/explore' },
        { label: `${meta.emoji} ${meta.label}` },
      ]

  const stepLabel = isAL ? 'Step 3 of 3 — Select Subject' : meta.stepLabel

  return (
    <div className={`min-h-screen ${meta.bgColor} pt-[88px]`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .font-nunito { font-family: 'Nunito', sans-serif; }
        .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>

      <div className="font-jakarta">
        {/* Breadcrumb */}
        <nav className="sticky top-[68px] z-10 border-b border-black/5 bg-white/90 py-3.2 backdrop-blur-md" aria-label="Breadcrumb">
          <div className="mx-auto flex max-w-[1140px] flex-wrap items-center gap-2 px-6 text-[0.84rem]">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span className="text-slate-400">›</span>}
                {crumb.href ? (
                  <Link to={crumb.href} className={`font-semibold transition-opacity hover:opacity-70 ${meta.textColor}`}>
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-semibold text-slate-600">{crumb.label}</span>
                )}
              </span>
            ))}
          </div>
        </nav>

        {/* Hero Section */}
        <header className={`relative overflow-hidden bg-gradient-to-br ${meta.gradient} px-6 py-14 text-center max-sm:px-4 max-sm:pt-10 max-sm:pb-12`}>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg_width=\'60\'_height=\'60\'_viewBox=\'0_0_60_60\'_xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg_fill=\'none\'%3E%3Cg_fill=\'%23ffffff\'_fill-opacity=\'0.04\'%3E%3Cpath_d=\'M36_34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6_34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6_4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />

          <div className="relative mb-[18px] inline-flex items-center gap-1.75 rounded-full border border-white/30 bg-white/16 px-5 py-1.75 text-[0.8rem] font-bold text-white backdrop-blur-md">
            {meta.emoji} {isAL ? meta.name + ' Stream' : meta.fullName}
          </div>
          <h1 className="font-nunito relative mb-2.5 text-[clamp(1.9rem,4.5vw,3rem)] font-black text-white">
            Select a Subject
          </h1>
          <p className="relative mx-auto mb-7 max-w-[500px] text-[0.98rem] leading-relaxed text-white/85">
            Choose a subject to browse past papers, model papers, school papers, and notes.
          </p>

          {/* Search Bar */}
          <div className="relative mx-auto max-w-[480px]">
            <span className="pointer-events-none absolute left-[18px] top-1/2 -translate-y-1/2 text-[1rem] opacity-80">
              🔍
            </span>
            <input
              className="font-jakarta w-full rounded-full border-2 border-white/25 bg-white/18 py-3.5 right-11 left-12 px-12 text-[0.95rem] text-white outline-none backdrop-blur-md transition-all duration-200 placeholder:text-white/70 focus:border-white/65 focus:bg-white/28 focus:shadow-[0_6px_20px_rgba(0,0,0,0.12)]"
              placeholder="Search subjects…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Search subjects"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-[14px] top-1/2 flex h-5.5 w-5.5 -translate-y-1/2 items-center justify-center rounded-full bg-white/25 text-[0.75rem] text-white transition-colors hover:bg-white/42"
                title="Clear"
              >
                ✕
              </button>
            )}
          </div>
        </header>

        {/* Subject Grid Container */}
        <main className="mx-auto max-w-[1140px] px-6 py-12 pb-20">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className={`inline-block rounded-full px-4 py-1.25 text-[0.76rem] font-extrabold uppercase tracking-widest ${meta.textColor} ${meta.chipBg}`}>
                {stepLabel}
              </span>
              <h2 className="font-nunito mt-2 text-[1.4rem] font-extrabold text-[#1A2E50]">
                Which subject?
              </h2>
            </div>
            <div className={`rounded-full border px-4 py-1.25 text-[0.82rem] font-bold ${meta.textColor} ${meta.chipBg} ${meta.borderColor}`}>
              {loading ? '…' : `${filtered.length} ${filtered.length === 1 ? 'subject' : 'subjects'}`}
            </div>
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5 max-sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
            {loading ? (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center text-[0.95rem] text-slate-600">
                <span className="mb-3 block text-[2.8rem]">⏳</span>
                <div>Loading subjects…</div>
              </div>
            ) : error ? (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center text-[0.95rem] text-slate-600">
                <span className="mb-3 block text-[2.8rem]">⚠️</span>
                <div>Couldn't load subjects. {error}</div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center text-[0.95rem] text-slate-600">
                <span className="mb-3 block text-[2.8rem]">🔎</span>
                <div>No subjects found matching "<strong>{query}</strong>"</div>
                <button
                  onClick={() => setQuery('')}
                  className={`font-jakarta mt-4 rounded-full border-none px-5 py-2 text-[0.82rem] font-bold text-white transition-opacity hover:opacity-85 ${meta.btnBg}`}
                >
                  Clear Search
                </button>
              </div>
            ) : (
              filtered.map(s => (
                <button
                  key={s.id}
                  onClick={() => handleSelect(s)}
                  className={`group flex flex-col rounded-[20px] border border-solid ${meta.borderColor} font-jakarta bg-white p-[28px_24px] text-left shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-240 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1.5 hover:shadow-[0_16px_36px_rgba(0,0,0,0.13)]`}
                >
                  <span className="mb-3.5 inline-block text-[2.4rem] transition-transform duration-200 group-hover:scale-112">
                    {s.icon || meta.emoji}
                  </span>
                  <div className="mb-3 flex-1 text-[1rem] font-bold leading-snug text-[#1A2E50]">
                    {s.name}
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <span className={`rounded-full border border-solid ${meta.borderColor} ${meta.chipBg} ${meta.textColor} px-3 py-1 text-[0.76rem] font-bold`}>
                      {s.paperCount ?? '—'} Papers
                    </span>
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-[0.88rem] text-white transition-transform duration-180 group-hover:translate-x-1 ${meta.btnBg}`}>
                      →
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  )
}