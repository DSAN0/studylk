import 'katex/dist/katex.min.css'
import { InlineMath } from 'react-katex'

// Fix broken patterns like: $5.0 $\times$ V_{1}$
// These should be merged into: $5.0 \times V_{1}$
function fixBrokenMath(text) {
  // Merge adjacent $...$ blocks that have \times or \div between them
  // Pattern: $...$  \times  $...$ => $... \times ...$
  let result = text

  // Repeatedly merge: $A$ \command $B$ => $A \command B$
  // Also handles: $A$ \command{...} $B$
  const mergePattern = /\$([^$]+)\$\s*(\\[a-zA-Z]+(?:\{[^}]*\})*)\s*\$([^$]+)\$/g

  let prev
  do {
    prev = result
    result = result.replace(mergePattern, '$$$1 $2 $3$$')
  } while (result !== prev)

  return result
}

function renderPlainText(text) {
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
  const value = fixBrokenMath(String(text).trim())

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
              renderError={() => (
                <span style={{ color: 'red', fontSize: '0.85em' }}>{math}</span>
              )}
            />
          )
        }

        return <span key={index}>{renderPlainText(part)}</span>
      })}
    </span>
  )
}