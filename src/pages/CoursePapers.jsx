import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { studentQuestionPapers } from '../api/api'

export default function CoursePapers() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [papers, setPapers] = useState([])

  useEffect(() => {
    async function loadData() {
      try {
        const res = await studentQuestionPapers(courseId)
        setPapers(res.data)
      } catch (err) {
        console.error(err)
        navigate('/my-courses')
      }
    }

    loadData()
  }, [courseId, navigate])

  return (
    <main className="min-h-screen bg-bg pt-[90px] px-6 py-12">
      <div className="max-w-[1000px] mx-auto">
        <button onClick={() => navigate('/my-courses')} className="text-muted mb-6">
          ← Back
        </button>

        <h1 className="font-display font-bold text-3xl mb-8">Question Papers</h1>

        {papers.length === 0 ? (
          <p className="text-muted">No papers available yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {papers.map(p => (
              <div key={p.id} className="bg-surface border border-white/[0.08] rounded-2xl p-6">
                <h2 className="font-display font-bold text-xl mb-2">{p.title}</h2>
                <p className="text-muted text-sm mb-4">{p.description}</p>
                <p className="text-muted text-sm mb-1">⏱ {p.duration_minutes} minutes</p>
                <p className="text-muted text-sm mb-5">📝 {p.questionCount} questions</p>

                <button onClick={() => navigate(`/papers/${p.id}/take`)} className="btn-primary">
                  Start Paper
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}