import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { studentCourseMaterials } from '../api/api'

const TYPE_LABELS = {
  note: 'Notes',
  paper: 'Papers',
  video: 'Videos',
  other: 'Other',
}

export default function CourseMaterials() {
  const { courseId } = useParams()
  const navigate = useNavigate()

  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        const res = await studentCourseMaterials(courseId)
        setMaterials(res.data)
      } catch (err) {
        console.error(err)
        setError(err.response?.data?.detail || 'Could not load materials')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [courseId])

  if (loading) {
    return (
      <main className="min-h-screen bg-bg pt-[90px] px-6">
        <p className="text-muted text-center">Loading materials...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-bg pt-[90px] px-6 flex justify-center">
        <div className="max-w-md bg-surface border border-white/[0.08] rounded-2xl p-7 h-fit text-center">
          <p className="text-arts mb-4">{error}</p>
          <button onClick={() => navigate('/my-courses')} className="btn-primary">
            Back to My Courses
          </button>
        </div>
      </main>
    )
  }

  const grouped = {
    note: materials.filter(m => m.material_type === 'note'),
    paper: materials.filter(m => m.material_type === 'paper'),
    video: materials.filter(m => m.material_type === 'video'),
    other: materials.filter(m => m.material_type === 'other'),
  }

  return (
    <main className="min-h-screen bg-bg pt-[90px] px-6 py-12">
      <div className="max-w-[1100px] mx-auto">
        <button
          onClick={() => navigate('/my-courses')}
          className="text-muted text-sm mb-6"
        >
          ← Back to My Courses
        </button>

        <h1 className="font-display font-bold text-3xl mb-2">Course Materials</h1>
        <p className="text-muted mb-8">
          Notes, papers, videos, and other learning materials.
        </p>

        {materials.length === 0 ? (
          <div className="bg-surface border border-white/[0.08] rounded-2xl p-8 text-center">
            <p className="text-muted">No materials added for this course yet.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([type, items]) => (
              <section key={type}>
                <h2 className="font-display font-bold text-xl mb-4">
                  {TYPE_LABELS[type]}
                </h2>

                {items.length === 0 ? (
                  <p className="text-muted text-sm">No {TYPE_LABELS[type].toLowerCase()} available.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {items.map(material => (
                      <div
                        key={material.id}
                        className="bg-surface border border-white/[0.08] rounded-2xl p-6"
                      >
                        <span className="text-xs bg-accent/10 text-accent border border-accent/25 rounded-full px-3 py-1">
                          {material.material_type}
                        </span>

                        <h3 className="font-display font-bold text-lg mt-4 mb-2">
                          {material.title}
                        </h3>

                        <p className="text-muted text-sm mb-5">
                          {material.description || 'No description'}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {material.fileUrl && (
                            <a
                              href={material.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="btn-primary text-sm"
                            >
                              Open File
                            </a>
                          )}

                          {material.video_url && (
                            <a
                              href={material.video_url}
                              target="_blank"
                              rel="noreferrer"
                              className="bg-surface2 border border-white/10 rounded-xl px-4 py-2 text-sm text-muted hover:text-white"
                            >
                              Watch Video
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}