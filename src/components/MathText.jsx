import 'katex/dist/katex.min.css'
import { InlineMath } from 'react-katex'

function normalizeText(text = '') {
  return String(text)
    .replace(/\\times/g, ' \\times ')
    .replace(/\\div/g, ' \\div ')
    .replace(/\s+/g, ' ')
    .trim()
}

function autoWrapMath(text = '') {
  let value = normalizeText(text)

  // Already contains explicit math
  if (value.includes('$')) return value

  // Scientific notation
  value = value.replace(
    /(\d+(\.\d+)?\s*\\times\s*10\^\{?-?\d+\}?\s*[a-zA-Z]*)/g,
    '$$$1$$'
  )

  // Chemical formulas
  value = value.replace(
    /\b(?:[A-Z][a-z]?(?:_\{?\d+\}?|\d+)?)+\b/g,
    '$$$&$$'
  )

  // Fractions
  value = value.replace(
    /(\\frac\{.*?\}\{.*?\})/g,
    '$$$1$$'
  )

  // Square roots
  value = value.replace(
    /(\\sqrt\{.*?\})/g,
    '$$$1$$'
  )

  // Superscripts
  value = value.replace(
    /([a-zA-Z]\^\{?.+?\}?)/g,
    '$$$1$$'
  )

  // Subscripts
  value = value.replace(
    /([a-zA-Z]_\{?.+?\}?)/g,
    '$$$1$$'
  )

  return value
}

export default function MathText({ text = '' }) {
  const prepared = autoWrapMath(text)

  const parts = prepared.split(/(\$.*?\$)/g)

  return (
    <span className="math-text">
      {parts.map((part, index) => {
        if (!part) return null

        if (part.startsWith('$') && part.endsWith('$')) {
          const math = part.slice(1, -1).trim()

          try {
            return (
              <InlineMath
                key={index}
                math={math}
              />
            )
          } catch {
            return <span key={index}>{part}</span>
          }
        }

        return (
          <span key={index}>
            {part}
          </span>
        )
      })}
    </span>
  )
}