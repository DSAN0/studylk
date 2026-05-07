import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  adminCreateMaterial,
  adminDeleteMaterial,
  adminGetCourses,
  adminGetMaterials,
} from '../../api/api'

const emptyForm = {
  course: '',
  title: '',
  material_type: 'note',
  description: '',
  video_url: '',
  file: null,
  is_active: true,
  ordering: 0,
}

export default function AdminMaterials() {
  const navigate = useNavigate()

  const [courses, setCourses] = useState([])
  const [materials, setMaterials] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      const coursesRes = await adminGetCourses()
      const materialsRes = await adminGetMaterials()

      setCourses(coursesRes.data)
      setMaterials(materialsRes.data)
    } catch (err) {
      console.error(err)
      setError(JSON.stringify(err.response?.data || err.message))
    } finally {
      setLoading(false)
    }
  }

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!form.course) return setError('Please select a course')
    if (!form.title.trim()) return setError('Title is required')

    const data = new FormData()
    data.append('course', form.course)
    data.append('title', form.title)
    data.append('material_type', form.material_type)
    data.append('description', form.description)
    data.append('video_url', form.video_url)
    data.append('is_active', form.is_active)
    data.append('ordering', form.ordering)

    if (form.file) {
      data.append('file', form.file)
    }

    try {
      await adminCreateMaterial(data)
      setForm(emptyForm)
      await loadData()
    } catch (err) {
      console.error(err)
      setError(JSON.stringify(err.response?.data || 'Material save failed'))
    }
  }

  async function removeMaterial(id) {
    if (!confirm('Delete this material?')) return

    try {
      await adminDeleteMaterial(id)
      await loadData()
    } catch (err) {
      setError(JSON.stringify(err.response?.data || 'Delete failed'))
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-bg pt-[90px] px-6">
        <p className="text-muted text-center">Loading materials...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-bg pt-[90px] px-6 py-12">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="section-label">Admin</p>
            <h1 className="font-display font-bold text-3xl">Course Materials</h1>
          </div>

          <button
            onClick={() => navigate('/admin/dashboard')}
            className="bg-surface2 border border-white/10 rounded-xl px-4 py-2 text-sm text-muted"
          >
            Back Dashboard
          </button>
        </div>

        {error && (
          <div className="bg-arts/10 border border-arts/30 text-arts rounded-xl p-3 text-sm mb-5">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-surface border border-white/[0.08] rounded-2xl p-6 mb-8"
        >
          <h2 className="font-display font-bold text-xl mb-5">Add Material</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Course">
              <select
                className="admin-input"
                value={form.course}
                onChange={e => set('course', e.target.value)}
              >
                <option value="">Select course</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Material Type">
              <select
                className="admin-input"
                value={form.material_type}
                onChange={e => set('material_type', e.target.value)}
              >
                <option value="note">Note</option>
                <option value="paper">Paper</option>
                <option value="video">Video</option>
                <option value="other">Other</option>
              </select>
            </Field>

            <Field label="Title">
              <input
                className="admin-input"
                value={form.title}
                onChange={e => set('title', e.target.value)}
                placeholder="Unit 01 Notes"
              />
            </Field>

            <Field label="Video URL">
              <input
                className="admin-input"
                value={form.video_url}
                onChange={e => set('video_url', e.target.value)}
                placeholder="https://youtube.com/..."
              />
            </Field>

            <Field label="File">
              <input
                type="file"
                className="admin-input"
                onChange={e => set('file', e.target.files[0])}
              />
            </Field>

            <Field label="Ordering">
              <input
                type="number"
                className="admin-input"
                value={form.ordering}
                onChange={e => set('ordering', e.target.value)}
              />
            </Field>
          </div>

          <Field label="Description">
            <textarea
              rows="3"
              className="admin-input"
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </Field>

          <label className="flex items-center gap-2 text-sm text-muted mt-4">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={e => set('is_active', e.target.checked)}
            />
            Active
          </label>

          <button className="btn-primary mt-5">
            Add Material
          </button>
        </form>

        <section className="bg-surface border border-white/[0.08] rounded-2xl p-6">
          <h2 className="font-display font-bold text-xl mb-5">All Materials</h2>

          {materials.length === 0 ? (
            <p className="text-muted text-sm">No materials added yet.</p>
          ) : (
            <div className="space-y-3">
              {materials.map(m => (
                <div
                  key={m.id}
                  className="bg-surface2 border border-white/[0.07] rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div>
                    <span className="text-xs bg-accent/10 text-accent border border-accent/25 rounded-full px-3 py-1">
                      {m.material_type}
                    </span>

                    <h3 className="font-semibold mt-3">{m.title}</h3>

                    <p className="text-muted text-xs">
                      {m.courseTitle}
                    </p>

                    {m.fileUrl && (
                      <a
                        href={m.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-accent text-xs"
                      >
                        Open file
                      </a>
                    )}

                    {m.video_url && (
                      <a
                        href={m.video_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-accent text-xs ml-3"
                      >
                        Open video
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => removeMaterial(m.id)}
                    className="bg-arts/10 border border-arts/30 text-arts rounded-xl px-4 py-2 text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

function Field({ label, children }) {
  return (
    <label className="block mb-4">
      <span className="block text-xs text-muted mb-1.5">{label}</span>
      {children}
    </label>
  )
}