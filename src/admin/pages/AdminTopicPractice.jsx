import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  adminCreateTopic,
  adminDeleteTopic,
  adminGetCourses,
  adminGetTopics,
} from '../../api/api'

const emptyForm = {
  course: '',
  title: '',
  description: '',
  ordering: 0,
  is_active: true,
}

export default function AdminTopicPractice() {
  const navigate = useNavigate()

  const [courses, setCourses] = useState([])
  const [topics, setTopics] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const coursesRes = await adminGetCourses()
      const topicsRes = await adminGetTopics()

      setCourses(coursesRes.data)
      setTopics(topicsRes.data)
    } catch (err) {
      setError(JSON.stringify(err.response?.data || 'Could not load data'))
    }
  }

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      await adminCreateTopic({
        ...form,
        ordering: Number(form.ordering),
      })

      setForm(emptyForm)
      await loadData()
    } catch (err) {
      setError(JSON.stringify(err.response?.data || 'Save failed'))
    } finally {
      setSaving(false)
    }
  }

  async function remove(id) {
    if (!confirm('Delete this topic?')) return

    try {
      await adminDeleteTopic(id)
      await loadData()
    } catch (err) {
      setError(JSON.stringify(err.response?.data || 'Delete failed'))
    }
  }

  return (
    <main className="min-h-screen bg-bg pt-[90px] px-6 py-12">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between mb-8">
          <div>
            <p className="section-label">Admin</p>
            <h1 className="font-display font-bold text-3xl">Topic Practice</h1>
          </div>

          <button
            onClick={() => navigate('/admin/dashboard')}
            className="text-muted"
          >
            Back
          </button>
        </div>

        {error && (
          <div className="bg-arts/10 border border-arts/30 text-arts rounded-xl p-3 mb-5">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-surface border border-white/[0.08] rounded-2xl p-6 mb-8"
        >
          <h2 className="font-bold text-xl mb-5">Create Topic</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Course">
              <select
                className="admin-input"
                value={form.course}
                onChange={e => set('course', e.target.value)}
                required
              >
                <option value="">Select course</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </Field>

            <Input
              label="Topic Title"
              value={form.title}
              onChange={v => set('title', v)}
            />

            <Input
              type="number"
              label="Ordering"
              value={form.ordering}
              onChange={v => set('ordering', v)}
            />
          </div>

          <Field label="Description">
            <textarea
              rows="3"
              className="admin-input"
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Small description about this topic"
            />
          </Field>

          <button className="btn-primary mt-4" disabled={saving}>
            {saving ? 'Saving…' : 'Create Topic'}
          </button>
        </form>

        <section className="bg-surface border border-white/[0.08] rounded-2xl p-6">
          <h2 className="font-bold text-xl mb-5">All Topics</h2>

          <div className="space-y-3">
            {topics.map(topic => (
              <div
                key={topic.id}
                className="bg-surface2 border border-white/[0.07] rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div>
                  <h3 className="font-semibold">{topic.title}</h3>
                  <p className="text-muted text-xs">
                    {topic.courseTitle || topic.course_title || 'Course'} ·{' '}
                    {topic.questionCount || topic.question_count || 0} questions
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      navigate(`/admin/topic-practice/${topic.id}/questions`)
                    }
                    className="btn-primary text-sm"
                  >
                    Add Questions
                  </button>

                  <button
                    onClick={() => remove(topic.id)}
                    className="bg-arts/10 border border-arts/30 text-arts rounded-xl px-4 py-2 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {topics.length === 0 && (
              <p className="text-muted text-sm">No topics created yet.</p>
            )}
          </div>
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

function Input({ label, value, onChange, type = 'text' }) {
  return (
    <label className="block mb-4">
      <span className="block text-xs text-muted mb-1.5">{label}</span>
      <input
        type={type}
        className="admin-input"
        value={value}
        onChange={e => onChange(e.target.value)}
        required={label !== 'Ordering'}
      />
    </label>
  )
}