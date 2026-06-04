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

  // already has $...$
  if (value.includes('$')) return value

  // auto wrap common LaTeX/math expressions
  value = value.replace(
    /(\d+(\.\d+)?\s*\\times\s*10\^\{?-?\d+\}?\s*[a-zA-Z]*)/g,
    '$$$1$$'
  )

  value = value.replace(
    /(\\frac\{.*?\}\{.*?\}|\\sqrt\{.*?\}|[a-zA-Z]\^\{?.*?\}?|[a-zA-Z]_\{?.*?\}?)/g,
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

          return (
            <InlineMath
              key={index}
              math={math}
            />
          )
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