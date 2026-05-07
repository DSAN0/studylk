import { useNavigate } from 'react-router-dom'

const STREAM_STYLES = {
  science:  { glow: 'group-hover:shadow-[0_16px_48px_rgba(91,164,232,0.15)]',  iconBg: 'bg-science/10 border-science/25',  glowColor: 'bg-science' },
  commerce: { glow: 'group-hover:shadow-[0_16px_48px_rgba(78,203,141,0.15)]',  iconBg: 'bg-commerce/10 border-commerce/25', glowColor: 'bg-commerce' },
  arts:     { glow: 'group-hover:shadow-[0_16px_48px_rgba(224,110,110,0.15)]', iconBg: 'bg-arts/10 border-arts/25',         glowColor: 'bg-arts' },
  technology:{ glow: 'group-hover:shadow-[0_16px_48px_rgba(165,125,224,0.15)]',iconBg: 'bg-tech/10 border-tech/25',         glowColor: 'bg-tech' },
}

export default function StreamCard({ stream }) {
  const navigate = useNavigate()
  const s = STREAM_STYLES[stream.id] || STREAM_STYLES.science

  return (
    <div
      className={`group relative bg-surface border border-white/[0.07] rounded-2xl p-7
                  cursor-pointer overflow-hidden flex flex-col gap-4
                  transition-all duration-250 hover:border-white/[0.13] hover:-translate-y-1
                  ${s.glow} outline-none focus-visible:ring-2 focus-visible:ring-accent`}
      onClick={() => navigate(`/streams/${stream.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && navigate(`/streams/${stream.id}`)}
    >
      {/* Ambient glow blob */}
      <div
        className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl
                    opacity-0 group-hover:opacity-100 transition-opacity duration-350
                    pointer-events-none ${s.glowColor}`}
        style={{ opacity: undefined }}
      />

      {/* Icon */}
      <div className={`w-14 h-14 rounded-[14px] flex items-center justify-center text-3xl
                       border ${s.iconBg} flex-shrink-0 transition-all duration-200`}>
        {stream.icon}
      </div>

      {/* Body */}
      <div className="flex-1">
        <h3 className="font-display font-bold text-xl tracking-tight mb-1.5">
          {stream.name}
        </h3>
        <p className="text-sm text-muted leading-relaxed">{stream.desc}</p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-white/[0.07] mt-auto">
        <div className="flex gap-5 text-xs text-muted">
          <span><strong className="text-white">{stream.subjectCount}</strong> Subjects</span>
          <span><strong className="text-white">{stream.materialCount}</strong> Materials</span>
        </div>
        <span className="text-subtle group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5
                         transition-all duration-200 text-lg">
          ↗
        </span>
      </div>
    </div>
  )
}
