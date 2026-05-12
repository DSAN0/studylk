import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  adminCreateTopicQuestion,
  adminDeleteTopicQuestion,
  adminGetTopicQuestions,
} from '../../api/api'

const emptyForm = {
  question_text: '',
  option_a: '',
  option_b: '',
  option_c: '',
  option_d: '',
  correct_answer: 'A',
  explanation: '',
  ordering: 0,
}

export default function AdminTopicQuestions() {
  const { topicId } = useParams()
  const navigate = useNavigate()

  const [questions, setQuestions] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [topicId])

  async function loadData() {
    try {
      const res = await adminGetTopicQuestions(topicId)
      setQuestions(res.data)
    } catch (err) {
      setError(JSON.stringify(err.response?.data || 'Could not load questions'))
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
      await adminCreateTopicQuestion(topicId, {
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
    if (!confirm('Delete this question?')) return

    try {
      await adminDeleteTopicQuestion(id)
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
            <p className="section-label">Admin · Topic Practice</p>
            <h1 className="font-display font-bold text-3xl">
              Topic Questions
            </h1>
          </div>

          <button
            onClick={() => navigate('/admin/topic-practice')}
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
          <h2 className="font-bold text-xl mb-5">Add Topic Question</h2>

          <Field label="Question Text">
            <textarea
              rows="4"
              className="admin-input"
              value={form.question_text}
              onChange={e => set('question_text', e.target.value)}
              required
            />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Option A" value={form.option_a} onChange={v => set('option_a', v)} />
            <Input label="Option B" value={form.option_b} onChange={v => set('option_b', v)} />
            <Input label="Option C" value={form.option_c} onChange={v => set('option_c', v)} />
            <Input label="Option D" value={form.option_d} onChange={v => set('option_d', v)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Correct Answer">
              <select
                className="admin-input"
                value={form.correct_answer}
                onChange={e => set('correct_answer', e.target.value)}
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </Field>

            <Input
              type="number"
              label="Ordering"
              value={form.ordering}
              onChange={v => set('ordering', v)}
            />
          </div>

          <Field label="Explanation">
            <textarea
              rows="3"
              className="admin-input"
              value={form.explanation}
              onChange={e => set('explanation', e.target.value)}
              placeholder="Explain the correct answer"
            />
          </Field>

          <button className="btn-primary mt-4" disabled={saving}>
            {saving ? 'Saving…' : 'Add Question'}
          </button>
        </form>

        <section className="bg-surface border border-white/[0.08] rounded-2xl p-6">
          <h2 className="font-bold text-xl mb-5">
            Questions ({questions.length})
          </h2>

          <div className="space-y-3">
            {questions.map((q, index) => (
              <div
                key={q.id}
                className="bg-surface2 border border-white/[0.07] rounded-xl p-4"
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">
                      {q.ordering || index + 1}. {q.question_text}
                    </h3>

                    <p className="text-muted text-xs mt-1">
                      Correct Answer: {q.correct_answer}
                    </p>

                    <div className="text-muted text-sm mt-3 space-y-1">
                      <p>A. {q.option_a}</p>
                      <p>B. {q.option_b}</p>
                      <p>C. {q.option_c}</p>
                      <p>D. {q.option_d}</p>
                    </div>

                    {q.explanation && (
                      <p className="text-muted text-sm mt-3">
                        Explanation: {q.explanation}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => remove(q.id)}
                    className="bg-arts/10 border border-arts/30 text-arts rounded-xl px-4 py-2 text-sm h-fit"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {questions.length === 0 && (
              <p className="text-muted text-sm">
                No topic questions added yet.
              </p>
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