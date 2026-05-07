import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  adminCreatePaperQuestion,
  adminDeletePaperQuestion,
  adminGetPaperQuestions,
} from '../../api/api'

const emptyForm = {
  question_text: '',
  option_a: '',
  option_b: '',
  option_c: '',
  option_d: '',
  correct_answer: 'A',
  explanation: '',
  marks: 1,
  ordering: 0,
}

export default function AdminPaperQuestions() {
  const { paperId } = useParams()
  const navigate = useNavigate()

  const [questions, setQuestions] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [paperId])

  async function loadData() {
    const res = await adminGetPaperQuestions(paperId)
    setQuestions(res.data)
  }

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    try {
      await adminCreatePaperQuestion(paperId, {
        ...form,
        marks: Number(form.marks),
        ordering: Number(form.ordering),
      })
      setForm(emptyForm)
      await loadData()
    } catch (err) {
      setError(JSON.stringify(err.response?.data || 'Save failed'))
    }
  }

  async function remove(id) {
    if (!confirm('Delete this question?')) return
    await adminDeletePaperQuestion(id)
    await loadData()
  }

  return (
    <main className="min-h-screen bg-bg pt-[90px] px-6 py-12">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between mb-8">
          <div>
            <p className="section-label">Admin</p>
            <h1 className="font-display font-bold text-3xl">Paper Questions</h1>
          </div>
          <button onClick={() => navigate('/admin/question-papers')} className="text-muted">Back</button>
        </div>

        {error && <div className="bg-arts/10 border border-arts/30 text-arts rounded-xl p-3 mb-5">{error}</div>}

        <form onSubmit={handleSubmit} className="bg-surface border border-white/[0.08] rounded-2xl p-6 mb-8">
          <h2 className="font-bold text-xl mb-5">Add Question</h2>

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

            <Input type="number" label="Marks" value={form.marks} onChange={v => set('marks', v)} />
            <Input type="number" label="Ordering" value={form.ordering} onChange={v => set('ordering', v)} />
          </div>

          <Field label="Explanation">
            <textarea rows="3" className="admin-input" value={form.explanation} onChange={e => set('explanation', e.target.value)} />
          </Field>

          <button className="btn-primary mt-4">Add Question</button>
        </form>

        <section className="bg-surface border border-white/[0.08] rounded-2xl p-6">
          <h2 className="font-bold text-xl mb-5">Questions</h2>

          <div className="space-y-3">
            {questions.map(q => (
              <div key={q.id} className="bg-surface2 border border-white/[0.07] rounded-xl p-4 flex justify-between gap-4">
                <div>
                  <p className="font-semibold">Q{q.ordering}: {q.question_text}</p>
                  <p className="text-muted text-xs">Answer: {q.correct_answer} · Marks: {q.marks}</p>
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