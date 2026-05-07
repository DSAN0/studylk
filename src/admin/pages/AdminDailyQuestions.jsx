import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  adminCreateDailyQuestion,
  adminDeleteDailyQuestion,
  adminGetCourses,
  adminGetDailyQuestions,
} from '../../api/api'

const emptyForm = {
  course: '',
  question_text: '',
  option_a: '',
  option_b: '',
  option_c: '',
  option_d: '',
  correct_answer: 'A',
  explanation: '',
  active_date: '',
  is_active: true,
}

export default function AdminDailyQuestions() {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [questions, setQuestions] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const coursesRes = await adminGetCourses()
    const questionsRes = await adminGetDailyQuestions()
    setCourses(coursesRes.data)
    setQuestions(questionsRes.data)
  }

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    try {
      await adminCreateDailyQuestion(form)
      setForm(emptyForm)
      await loadData()
    } catch (err) {
      setError(JSON.stringify(err.response?.data || 'Save failed'))
    }
  }

  async function remove(id) {
    if (!confirm('Delete this question?')) return
    await adminDeleteDailyQuestion(id)
    await loadData()
  }

  return (
    <main className="min-h-screen bg-bg pt-[90px] px-6 py-12">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between mb-8">
          <div>
            <p className="section-label">Admin</p>
            <h1 className="font-display font-bold text-3xl">Daily Questions</h1>
          </div>

          <button onClick={() => navigate('/admin/dashboard')} className="text-muted">
            Back
          </button>
        </div>

        {error && <div className="bg-arts/10 border border-arts/30 text-arts rounded-xl p-3 mb-5">{error}</div>}

        <form onSubmit={handleSubmit} className="bg-surface border border-white/[0.08] rounded-2xl p-6 mb-8">
          <h2 className="font-bold text-xl mb-5">Add Daily Question</h2>

          <Field label="Course">
            <select className="admin-input" value={form.course} onChange={e => set('course', e.target.value)}>
              <option value="">Select course</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </Field>

          <Field label="Question">
            <textarea rows="4" className="admin-input" value={form.question_text} onChange={e => set('question_text', e.target.value)} />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Option A" value={form.option_a} onChange={v => set('option_a', v)} />
            <Input label="Option B" value={form.option_b} onChange={v => set('option_b', v)} />
            <Input label="Option C" value={form.option_c} onChange={v => set('option_c', v)} />
            <Input label="Option D" value={form.option_d} onChange={v => set('option_d', v)} />

            <Field label="Correct Answer">
              <select className="admin-input" value={form.correct_answer} onChange={e => set('correct_answer', e.target.value)}>
                <option>A</option>
                <option>B</option>
                <option>C</option>
                <option>D</option>
              </select>
            </Field>

            <Input type="date" label="Active Date" value={form.active_date} onChange={v => set('active_date', v)} />
          </div>

          <Field label="Explanation">
            <textarea rows="3" className="admin-input" value={form.explanation} onChange={e => set('explanation', e.target.value)} />
          </Field>

          <button className="btn-primary mt-4">Add Question</button>
        </form>

        <section className="bg-surface border border-white/[0.08] rounded-2xl p-6">
          <h2 className="font-bold text-xl mb-5">All Daily Questions</h2>

          <div className="space-y-3">
            {questions.map(q => (
              <div key={q.id} className="bg-surface2 border border-white/[0.07] rounded-xl p-4 flex justify-between gap-4">
                <div>
                  <p className="font-semibold">{q.question_text}</p>
                  <p className="text-muted text-xs mt-1">{q.courseTitle} · {q.active_date} · Answer: {q.correct_answer}</p>
                </div>
                <button onClick={() => remove(q.id)} className="text-arts text-sm">Delete</button>
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