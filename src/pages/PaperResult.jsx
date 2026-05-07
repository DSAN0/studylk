import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { studentPaperResult } from '../api/api'

export default function PaperResult() {
  const { attemptId } = useParams()
  const navigate = useNavigate()
  const [result, setResult] = useState(null)

  useEffect(() => {
    async function loadData() {
      const res = await studentPaperResult(attemptId)
      setResult(res.data)
    }

    loadData().catch(console.error)
  }, [attemptId])

  if (!result) {
    return (
      <main className="min-h-screen bg-bg pt-[90px] px-6">
        <p className="text-muted text-center">Loading result...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-bg pt-[90px] px-6 py-12">
      <div className="max-w-[900px] mx-auto">
        <h1 className="font-display font-bold text-3xl mb-2">Paper Result</h1>
        <p className="text-muted mb-8">{result.paper.title}</p>

        <div className="bg-surface border border-white/[0.08] rounded-2xl p-8 mb-8 text-center">
          <p className="text-muted text-sm mb-2">Your Score</p>
          <h2 className="font-display font-bold text-5xl text-accent">
            {result.score} / {result.total_marks}
          </h2>
        </div>

        <div className="space-y-4">
          {result.answers.map((a, index) => (
            <div key={a.id} className="bg-surface border border-white/[0.08] rounded-2xl p-6">
              <h3 className="font-semibold mb-3">
                {index + 1}. {a.question.question_text}
              </h3>

              <p className={a.is_correct ? 'text-commerce' : 'text-arts'}>
                Your answer: {a.selected_answer} — {a.is_correct ? 'Correct' : 'Wrong'}
              </p>

              <p className="text-muted text-sm mt-2">
                Correct answer: {a.question.correct_answer}
              </p>

              {a.question.explanation && (
                <p className="text-muted text-sm mt-3">
                  Explanation: {a.question.explanation}
                </p>
              )}
            </div>
          ))}
        </div>

        <button onClick={() => navigate('/my-courses')} className="btn-primary mt-8">
          Back to My Courses
        </button>
      </div>
    </main>
  )
}