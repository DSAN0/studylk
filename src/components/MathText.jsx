import 'katex/dist/katex.min.css'
import { InlineMath } from 'react-katex'

// Convert \times, \div etc. that are NOT inside $...$ to their Unicode equivalents
// so plain text rendering looks correct even without LaTeX
function renderPart(text) {
  return text
    .replace(/\\times/g, '×')
    .replace(/\\div/g, '÷')
    .replace(/\\cdot/g, '·')
    .replace(/\\pm/g, '±')
    .replace(/\\leq/g, '≤')
    .replace(/\\geq/g, '≥')
    .replace(/\\neq/g, '≠')
    .replace(/\\approx/g, '≈')
    .replace(/\\infty/g, '∞')
}

export default function MathText({ text = '' }) {
  const value = String(text).trim()

  // Split on $...$ but handle it carefully
  // This regex captures both the delimiters and content
  const parts = value.split(/(\$[^$]+\$)/g)

  return (
    <span className="math-text">
      {parts.map((part, index) => {
        if (!part) return null

        if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
          const math = part.slice(1, -1).trim()
          return (
            <InlineMath
              key={index}
              math={math}
              renderError={(error) => (
                <span style={{ color: 'red', fontSize: '0.85em' }}>{math}</span>
              )}
            />
          )
        }

        // Plain text — convert any stray LaTeX commands to Unicode
        return <span key={index}>{renderPart(part)}</span>
      })}
    </span>
  )
}