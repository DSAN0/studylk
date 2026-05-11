import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'

export default function MathText({ text = '' }) {

  // Split text into LaTeX and normal text
  const parts = text.split(/(\$.*?\$)/g)

  return (
    <>
      {parts.map((part, index) => {

        // If wrapped with $
        if (part.startsWith('$') && part.endsWith('$')) {
          const math = part.slice(1, -1)

          return (
            <InlineMath
              key={index}
              math={math}
            />
          )
        }

        // Normal text
        return (
          <span key={index}>
            {part}
          </span>
        )
      })}
    </>
  )
}