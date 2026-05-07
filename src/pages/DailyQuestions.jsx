import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { studentDailyQuestions, studentSubmitDailyQuestion } from '../api/api'

export default function DailyQuestions() {
  const { courseId } = useParams()
  const navigate = useNavigate()

  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [results, setResults] = useState({})

  useEffect(() => {
    async function loadData() {
      try {
        const res = await studentDailyQuestions(courseId)
        setQuestions(res.data)
      } catch (err) {
        console.error(err)
        navigate('/my-courses')
      }
    }

    loadData()
  }, [courseId, navigate])

  async function submit(questionId) {
    const selected = answers[questionId]
    if (!selected) return alert('Select an answer first')

    try {
      const res = await studentSubmitDailyQuestion({
        questionId,
        selected_answer: selected,
      })

      setResults(prev => ({ ...prev, [questionId]: res.data }))
    } catch (err) {
      alert(JSON.stringify(err.response?.data || 'Submit failed'))
    }
  }

  return (
    <main className="min-h-screen bg-bg pt-[90px] px-6 py-12">
      <div className="max-w-[900px] mx-auto">
        <button onClick={() => navigate('/my-courses')} className="text-muted mb-6">
          ← Back
        </button>

        <h1 className="font-display font-bold text-3xl mb-8">Daily Questions</h1>

        {questions.length === 0 ? (
          <p className="text-muted">No daily questions for today.</p>
        ) : (
          <div className="space-y-5">
            {questions.map(q => (
              <div key={q.id} className="bg-surface border border-white/[0.08] rounded-2xl p-6">
                <h2 className="font-semibold mb-4">{q.question_text}</h2>

                {['A', 'B', 'C', 'D'].map(opt => (
                  <label key={opt} className="block bg-surface2 border border-white/[0.07] rounded-xl p-3 mb-2">
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      className="mr-2"
                      disabled={!!results[q.id]}
                      onChange={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                    />
                    {opt}. {q[`option_${opt.toLowerCase()}`]}
                  </label>
                ))}

                {results[q.id] ? (
                  <div className={`mt-4 p-3 rounded-xl ${results[q.id].is_correct ? 'bg-commerce/10 text-commerce' : 'bg-arts/10 text-arts'}`}>
                    {results[q.id].is_correct ? 'Correct answer!' : 'Wrong answer.'}
                  </div>
                ) : (
                  <button onClick={() => submit(q.id)} className="btn-primary mt-4">
                    Submit Answer
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}