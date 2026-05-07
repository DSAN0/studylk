import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  adminCreateQuestionPaper,
  adminDeleteQuestionPaper,
  adminGetCourses,
  adminGetQuestionPapers,
} from '../../api/api'

const emptyForm = {
  course: '',
  title: '',
  description: '',
  duration_minutes: 120,
  is_active: true,
  ordering: 0,
}

export default function AdminQuestionPapers() {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [papers, setPapers] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const coursesRes = await adminGetCourses()
    const papersRes = await adminGetQuestionPapers()
    setCourses(coursesRes.data)
    setPapers(papersRes.data)
  }

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    try {
      await adminCreateQuestionPaper({
        ...form,
        duration_minutes: Number(form.duration_minutes),
        ordering: Number(form.ordering),
      })
      setForm(emptyForm)
      await loadData()
    } catch (err) {
      setError(JSON.stringify(err.response?.data || 'Save failed'))
    }
  }

  async function remove(id) {
    if (!confirm('Delete this paper?')) return
    await adminDeleteQuestionPaper(id)
    await loadData()
  }

  return (
    <main className="min-h-screen bg-bg pt-[90px] px-6 py-12">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between mb-8">
          <div>
            <p className="section-label">Admin</p>
            <h1 className="font-display font-bold text-3xl">Question Papers</h1>
          </div>
          <button onClick={() => navigate('/admin/dashboard')} className="text-muted">Back</button>
        </div>

        {error && <div className="bg-arts/10 border border-arts/30 text-arts rounded-xl p-3 mb-5">{error}</div>}

        <form onSubmit={handleSubmit} className="bg-surface border border-white/[0.08] rounded-2xl p-6 mb-8">
          <h2 className="font-bold text-xl mb-5">Create Paper</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Course">
              <select className="admin-input" value={form.course} onChange={e => set('course', e.target.value)}>
                <option value="">Select course</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </Field>

            <Input label="Title" value={form.title} onChange={v => set('title', v)} />
            <Input type="number" label="Duration Minutes" value={form.duration_minutes} onChange={v => set('duration_minutes', v)} />
            <Input type="number" label="Ordering" value={form.ordering} onChange={v => set('ordering', v)} />
          </div>

          <Field label="Description">
            <textarea rows="3" className="admin-input" value={form.description} onChange={e => set('description', e.target.value)} />
          </Field>

          <button className="btn-primary mt-4">Create Paper</button>
        </form>

        <section className="bg-surface border border-white/[0.08] rounded-2xl p-6">
          <h2 className="font-bold text-xl mb-5">All Papers</h2>

          <div className="space-y-3">
            {papers.map(p => (
              <div key={p.id} className="bg-surface2 border border-white/[0.07] rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="text-muted text-xs">{p.courseTitle} · {p.duration_minutes} minutes · {p.questionCount} questions</p>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => navigate(`/admin/question-papers/${p.id}/questions`)} className="btn-primary text-sm">
                    Add Questions
                  </button>
                  <button onClick={() => remove(p.id)} className="bg-arts/10 border border-arts/30 text-arts rounded-xl px-4 py-2 text-sm">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

function Field({ label, children }) {
  return <label className="block mb-4"><span className="block text-xs text-muted mb-1.5">{label}</span>{children}</label>
}

function Input({ label, value, onChange, type = 'text' }) {
  return (
    <label className="block mb-4">
      <span className="block text-xs text-muted mb-1.5">{label}</span>
      <input type={type} className="admin-input" value={value} onChange={e => onChange(e.target.value)} />
    </label>
  )
}