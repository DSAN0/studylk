import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'

const CONTENT_TYPES = [
  {
    id: 'past-papers',
    label: 'Past Papers',
    emoji: '📄',
    desc: 'Official examination papers from previous years with marking schemes.',
    gradient: 'from-[#1B5E20] via-[#2E7D32] to-[#43A047]',
    shadow: 'shadow-[0_16px_48px_rgba(46,125,50,0.32)]',
    iconBg: 'bg-white/16',
  },
  {
    id: 'model-papers',
    label: 'Model Papers',
    emoji: '📝',
    desc: 'Expert-crafted practice papers designed to match current exam standards.',
    gradient: 'from-[#004D40] via-[#00695C] to-[#00796B]',
    shadow: 'shadow-[0_16px_48px_rgba(0,105,92,0.32)]',
    iconBg: 'bg-white/16',
  },
  {
    id: 'school-papers',
    label: 'School Papers',
    emoji: '🏫',
    desc: 'Term test papers from top schools across Sri Lanka.',
    gradient: 'from-[#311B92] via-[#4527A0] to-[#512DA8]',
    shadow: 'shadow-[0_16px_48px_rgba(81,45,168,0.32)]',
    iconBg: 'bg-white/16',
  },
  {
    id: 'notes',
    label: 'Notes',
    emoji: '📒',
    desc: 'Summaries, study guides, and cheat sheets for every topic.',
    gradient: 'from-[#B71C1C] via-[#C62828] to-[#D32F2F]',
    shadow: 'shadow-[0_16px_48px_rgba(183,28,28,0.32)]',
    iconBg: 'bg-white/16',
  },
]

export default function ExploreContentType({ grade: propGrade }) {
  const { grade: paramGrade, stream, subjectId } = useParams()
  const grade = propGrade || paramGrade || (stream ? 'al' : 'ol')
  const location  = useLocation()
  const navigate  = useNavigate()
  const state     = location.state || {}

  const subjectName  = state.subjectName  || subjectId
  const streamName   = state.streamName   || stream
  const gradeLabel   = grade === 'al' ? 'A/L' : grade === 'ol' ? 'O/L' : 'Grade 5'
  const gradeUpper   = grade === 'al' ? 'AL' : grade === 'ol' ? 'OL' : 'Grade5'

  // Build breadcrumb
  const breadcrumbs = grade === 'al'
    ? [
        { label: '🔍 Explore',               href: '/explore' },
        { label: '🎓 A/L',                    href: '/explore/al' },
        { label: `${streamName || stream}`,    href: `/explore/al/${stream}` },
        { label: subjectName },
      ]
    : [
        { label: '🔍 Explore', href: '/explore' },
        { label: grade === 'ol' ? '📘 O/L' : '⭐ Grade 5', href: `/explore/${grade}` },
        { label: subjectName },
      ]

  function handleSelect(typeId) {
    const routePrefix = {
      'past-papers': '/explore/past-papers',
      'model-papers': '/explore/model-papers',
      'school-papers': '/explore/school-papers',
      'notes': '/explore/notes',
    }[typeId] || '/explore/past-papers'

    if (grade === 'al') {
      navigate(`${routePrefix}/al/${stream}/${subjectId}`, {
        state: { subjectName, streamName, grade: 'AL' }
      })
    } else if (grade === 'ol') {
      navigate(`${routePrefix}/ol/${subjectId}`, {
        state: { subjectName, grade: 'OL' }
      })
    } else {
      navigate(`${routePrefix}/grade5/${subjectId}`, {
        state: { subjectName, grade: 'Grade5' }
      })
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-[#ecfdf5] to-[#f0faf0] pt-[88px]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .font-nunito { font-family: 'Nunito', sans-serif; }
        .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>

      <div className="font-jakarta">
        {/* Breadcrumb */}
        <nav className="sticky top-[68px] z-10 border-b border-[#2E7D32]/10 bg-white/90 py-3.2 backdrop-blur-md" aria-label="Breadcrumb">
          <div className="mx-auto flex max-w-[1140px] flex-wrap items-center gap-1.5 px-6 text-[0.84rem]">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-slate-400">›</span>}
                {crumb.href ? (
                  <Link to={crumb.href} className="font-semibold text-[#2E7D32] transition-opacity hover:opacity-70">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-semibold text-slate-600">{crumb.label}</span>
                )}
              </span>
            ))}
          </div>
        </nav>

        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#388E3C] px-6 py-15 text-center text-white pb-16">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg_width=\'60\'_height=\'60\'_viewBox=\'0_0_60_60\'_xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg_fill=\'none\'%3E%3Cg_fill=\'%23ffffff\'_fill-opacity=\'0.04\'%3E%3Cpath_d=\'M36_34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6_34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6_4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />

          <div className="relative mb-[18px] inline-flex items-center gap-2 rounded-full border border-white/28 bg-white/14 px-5 py-1.75 text-[0.82rem] font-bold text-white backdrop-blur-md">
            📚 {gradeLabel}{streamName ? ` · ${streamName}` : ''} · {subjectName}
          </div>
          <h1 className="font-nunito relative mb-3 text-[clamp(2rem,5vw,3.2rem)] font-black text-white">
            What would you like?
          </h1>
          <p className="relative mx-auto max-w-[500px] text-[1rem] leading-relaxed text-white/84">
            Choose the type of resource you want to access for <strong className="text-white">{subjectName}</strong>.
          </p>
        </div>

        {/* Main Content Body */}
        <div className="mx-auto max-w-[1000px] px-6 py-15 pb-20">
          <div className="mb-11 text-center">
            <span className="mb-3 inline-block rounded-full bg-[#e6f4ea] px-4 py-1.25 text-[0.76rem] font-extrabold uppercase tracking-widest text-[#2E7D32]">
              Final Step — Choose Resource Type
            </span>
            <h2 className="font-nunito text-[clamp(1.5rem,3vw,2rem)] font-black text-[#1A3A1A]">
              Select a resource type
            </h2>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 gap-[22px] min-[440px]:grid-cols-2 sm:grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
            {CONTENT_TYPES.map(ct => (
              <button
                key={ct.id}
                onClick={() => handleSelect(ct.id)}
                className={`group relative flex flex-col overflow-hidden rounded-[24px] border-none bg-gradient-to-br ${ct.gradient} ${ct.shadow} transition-all duration-320 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-3 hover:scale-[1.03]`}
              >
                {/* Card Body */}
                <div className="relative flex flex-1 flex-col overflow-hidden px-[28px] pt-[36px] pb-[28px] max-sm:px-5 max-sm:pt-6 max-sm:pb-5">
                  <div className={`pointer-events-none absolute -top-10 -right-10 h-[140px] w-[140px] rounded-full ${ct.iconBg}`} />
                  <span className="relative mb-4 block text-[3rem] drop-shadow-[0_3px_10px_rgba(0,0,0,0.22)] transition-transform duration-220 group-hover:scale-112 group-hover:-rotate-4">
                    {ct.emoji}
                  </span>
                  <div className="font-nunito relative mb-2 text-[1.4rem] font-black text-white">
                    {ct.label}
                  </div>
                  <p className="relative m-0 text-[0.88rem] leading-relaxed text-white/84">
                    {ct.desc}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="flex items-center justify-between border-t border-white/12 bg-black/20 px-[28px] py-4">
                  <span className="text-[0.88rem] font-bold text-white/92">Browse {ct.label}</span>
                  <span className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-white/20 text-[0.9rem] text-white transition-colors duration-200 group-hover:bg-white/36 group-hover:translate-x-0.75">
                    →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}