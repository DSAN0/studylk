import { InlineMath } from 'react-katex'

export default function MathText({ text = '' }) {
  const parts = text.split(/(\$[^$]+\$)/g)

  return (
    <span className="font-sinhala">
      {parts.map((part, index) => {
        if (part.startsWith('$') && part.endsWith('$')) {
          return (
            <InlineMath key={index} math={part.slice(1, -1)} />
          )
        }

        return <span key={index}>{part}</span>
      })}
    </span>
  )
}