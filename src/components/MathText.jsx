import 'katex/dist/katex.min.css'
import { InlineMath } from 'react-katex'

// Step 1: Normalize spacing around LaTeX commands
function normalizeText(text = '') {
  return String(text)
    .replace(/\\times/g, ' \\times ')
    .replace(/\\div/g, ' \\div ')
    .replace(/\s+/g, ' ')
    .trim()
}

// Step 2: Fix broken patterns like: $5.0 $\times$ V_{1}$  =>  $5.0 \times V_{1}$
function fixBrokenMath(text) {
  let result = text
  const mergePattern = /\$([^$]+)\$\s*(\\[a-zA-Z]+(?:\{[^}]*\})*)\s*\$([^$]+)\$/g
  let prev
  do {
    prev = result
    result = result.replace(mergePattern, '$$$1 $2 $3$$')
  } while (result !== prev)
  return result
}

// Step 3: Auto-wrap bare LaTeX expressions with $...$ (only if no $ present)
function autoWrapMath(text = '') {
  let value = normalizeText(text)

  // already has $...$ — fix broken math then return
  if (value.includes('$')) return fixBrokenMath(value)

  // auto wrap scientific notation: 19.92 \times 10^{-27} kg
  value = value.replace(
    /(\d+(\.\d+)?\s*\\times\s*10\^\{?-?\d+\}?\s*[a-zA-Z]*)/g,
    '$$$1$$'
  )

  // auto wrap common LaTeX expressions: \frac, \sqrt, superscripts, subscripts
  value = value.replace(
    /(\\frac\{.*?\}\{.*?\}|\\sqrt\{.*?\}|[a-zA-Z]\^\{?.*?\}?|[a-zA-Z]_\{?.*?\}?)/g,
    '$$$1$$'
  )

  return value
}

// Fallback: convert any remaining bare LaTeX commands to Unicode in plain text
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
  const prepared = autoWrapMath(text)

  // Safer split: [^$]+ avoids crossing $ boundaries
  const parts = prepared.split(/(\$[^$]+\$)/g)

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