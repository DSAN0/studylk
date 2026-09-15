import { useNavigate, Link } from 'react-router-dom'

const STREAMS = [
  {
    id: 'science',
    name: 'Science',
    emoji: '🔬',
    subjectCount: 7,
    previewSubjects: ['Combined Mathematics', 'Physics', 'Chemistry', 'Biology', 'ICT'],
    desc: 'Pure and applied sciences covering mathematics, physics, chemistry, and life sciences.',
    accentColor: 'text-[#1565C0]',
    lightBg: 'bg-[#E3F2FD]',
    badgeColor: 'text-[#0D47A1]',
    gradient: 'from-[#0D47A1] via-[#1565C0] to-[#1976D2]',
    shadow: 'shadow-[0_8px_32px_rgba(21,101,192,0.28)]',
  },
  {
    id: 'commerce',
    name: 'Commerce',
    emoji: '📊',
    subjectCount: 6,
    previewSubjects: ['Business Studies', 'Accounting', 'Economics', 'Business Statistics'],
    desc: 'Business, finance, and economic subjects for students pursuing a commerce career.',
    accentColor: 'text-[#7B1FA2]',
    lightBg: 'bg-[#F3E5F5]',
    badgeColor: 'text-[#6A1B9A]',
    gradient: 'from-[#6A1B9A] via-[#7B1FA2] to-[#9C27B0]',
    shadow: 'shadow-[0_8px_32px_rgba(123,31,162,0.28)]',
  },
  {
    id: 'arts',
    name: 'Arts',
    emoji: '🎨',
    subjectCount: 8,
    previewSubjects: ['History', 'Geography', 'Political Science', 'Logic & Scientific Method'],
    desc: 'Humanities, social sciences, and creative arts subjects for arts stream students.',
    accentColor: 'text-[#D84315]',
    lightBg: 'bg-[#FBE9E7]',
    badgeColor: 'text-[#BF360C]',
    gradient: 'from-[#BF360C] via-[#D84315] to-[#E64A19]',
    shadow: 'shadow-[0_8px_32px_rgba(216,67,21,0.28)]',
  },
  {
    id: 'tech',
    name: 'Technology',
    emoji: '⚙️',
    subjectCount: 5,
    previewSubjects: ['Engineering Technology', 'ICT', 'Bio-systems Technology'],
    desc: 'Practical technology and engineering subjects for students with a technical focus.',
    accentColor: 'text-[#2E7D32]',
    lightBg: 'bg-[#E8F5E9]',
    badgeColor: 'text-[#1B5E20]',
    gradient: 'from-[#1B5E20] via-[#2E7D32] to-[#43A047]',
    shadow: 'shadow-[0_8px_32px_rgba(46,125,50,0.28)]',
  },
]

export default function ExploreALStreams() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-[#ecfdf5] to-[#f0faf0] pt-[88px]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .font-nunito { font-family: 'Nunito', sans-serif; }
        .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>

      <div className="font-jakarta">
        {/* Breadcrumb */}
        <nav className="sticky top-[68px] z-10 border-b border-[#2E7D32]/15 bg-white/90 py-3.2 backdrop-blur-md" aria-label="Breadcrumb">
          <div className="mx-auto flex max-w-[1140px] items-center gap-2 px-6 text-[0.84rem]">
            <Link to="/explore" className="font-semibold text-[#2E7D32] transition-opacity hover:opacity-75">
              🔍 Explore
            </Link>
            <span className="text-slate-400">›</span>
            <span className="font-semibold text-slate-600">🎓 Advanced Level (A/L)</span>
          </div>
        </nav>

        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#43A047] px-6 py-16 text-center text-white pb-[70px]">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg_width=\'60\'_height=\'60\'_viewBox=\'0_0_60_60\'_xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg_fill=\'none\'%3E%3Cg_fill=\'%23ffffff\'_fill-opacity=\'0.04\'%3E%3Cpath_d=\'M36_34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6_34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6_4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
          
          <div className="relative mb-5 inline-flex items-center gap-1.75 rounded-full border border-white/30 bg-white/15 px-5 py-1.75 text-[0.8rem] font-bold text-white backdrop-blur-md">
            🎓 Advanced Level
          </div>
          <h1 className="font-nunito relative mb-3 text-[clamp(2rem,5vw,3.2rem)] font-black leading-tight tracking-tight text-white">
            Choose Your A/L Stream
          </h1>
          <p className="relative mx-auto max-w-[520px] text-[1rem] leading-relaxed text-white/85">
            Select your academic stream to browse subjects with past papers, model papers, school papers, and notes.
          </p>
        </div>

        {/* Main Body */}
        <div className="mx-auto max-w-[1140px] px-6 py-14 pb-20">
          <div className="mb-11 text-center">
            <span className="mb-3 inline-block rounded-full bg-[#e6f4ea] px-4 py-1.25 text-[0.76rem] font-extrabold uppercase tracking-widest text-[#2E7D32]">
              Step 2 of 3 — Select Stream
            </span>
            <h2 className="font-nunito text-[clamp(1.5rem,3vw,2rem)] font-black text-[#1A3A1A]">
              Which stream are you studying?
            </h2>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
            {STREAMS.map(st => (
              <button
                key={st.id}
                onClick={() => navigate(`/explore/al/${st.id}`)}
                className={`group flex flex-col overflow-hidden rounded-[22px] border-none bg-white text-left transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-2.5 ${st.shadow}`}
              >
                {/* Top Accent Line */}
                <div className={`h-1.75 w-full bg-gradient-to-r ${st.gradient}`} />

                {/* Card Body */}
                <div className="flex flex-1 flex-col p-6 pb-5">
                  <div className="mb-3.5 flex items-center justify-between">
                    <span className={`rounded-xl p-2.5 text-2xl ${st.lightBg}`}>
                      {st.emoji}
                    </span>
                    <span className={`rounded-full px-3 py-1 text-[0.76rem] font-bold ${st.badgeColor} ${st.lightBg}`}>
                      {st.subjectCount} Subjects
                    </span>
                  </div>

                  <div className="font-nunito mb-2 text-[1.4rem] font-black text-slate-900">
                    {st.name}
                  </div>
                  
                  <p className="mb-4 text.875rem text-xs leading-relaxed text-slate-500">
                    {st.desc}
                  </p>

                  <div className="mt-auto flex flex-wrap gap-1.5">
                    {st.previewSubjects.map(sub => (
                      <span key={sub} className="rounded-md border border-slate-200 bg-slate-100 px-2.5 py-0.75 text-[0.74rem] font-medium text-slate-600">
                        {sub}
                      </span>
                    ))}
                    {st.subjectCount > st.previewSubjects.length && (
                      <span className="rounded-md border border-slate-200 bg-slate-100 px-2.5 py-0.75 text-[0.74rem] font-medium text-slate-600">
                        +{st.subjectCount - st.previewSubjects.length} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-6 py-4">
                  <span className="text-[0.875rem] font-bold text-slate-900">Select Stream</span>
                  <span className={`text-[1.1rem] transition-transform duration-200 group-hover:translate-x-1.25 ${st.accentColor}`}>
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