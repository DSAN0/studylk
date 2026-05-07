import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  adminCreateCourse,
  adminDeleteCourse,
  adminGetCourses,
  adminGetSubjects,
  adminGetTeachers,
  adminUpdateCourse,
} from '../../api/api'

const emptyForm = {
  id: '',
  subject: '',
  teacher: '',
  title: '',
  desc: '',
  schedule: '',
  mode: 'Online',
  language: 'Sinhala',
  duration: '24 months',
  start_date: '',
  seats: 30,
  seats_left: 30,
  price: 'Rs. 3,500 / month',
  rating: 0,
  review_count: 0,
  tag: '',
  tag_color: 'accent',
  features: '',
  is_active: true,
  ordering: 0,
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ icon, title, children }) {
  return (
    <div className="bg-surface border border-white/[0.08] rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-accent text-base">{icon}</span>
        <h2 className="font-semibold text-sm text-muted uppercase tracking-widest">{title}</h2>
      </div>
      {children}
    </div>
  )
}

// ── Field wrapper ─────────────────────────────────────────────────────────────
function Field({ label, required, hint, error, children }) {
  return (
    <label className="block">
      <span className="flex items-center gap-1 text-xs text-muted mb-1.5 font-medium">
        {label}
        {required && <span className="text-arts">*</span>}
      </span>
      {children}
      {hint && !error && (
        <p className="text-[11px] text-muted/60 mt-1">{hint}</p>
      )}
      {error && (
        <p className="text-[11px] text-arts mt-1 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </label>
  )
}

// ── Inline radio group ────────────────────────────────────────────────────────
function RadioGroup({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
            value === opt
              ? 'bg-accent text-bg border-accent font-medium'
              : 'border-white/[0.12] text-muted hover:border-white/30'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

// ── Stepper ───────────────────────────────────────────────────────────────────
function Stepper({ value, onChange, min = 0, max = 999 }) {
  return (
    <div className="flex items-center gap-0 border border-white/[0.12] rounded-xl overflow-hidden w-fit">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, Number(value) - 1))}
        className="px-3 py-2 text-muted hover:bg-white/5 transition-colors text-lg leading-none"
      >
        −
      </button>
      <input
        type="number"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-14 text-center bg-transparent py-2 text-sm focus:outline-none"
      />
      <button
        type="button"
        onClick={() => onChange(Math.min(max, Number(value) + 1))}
        className="px-3 py-2 text-muted hover:bg-white/5 transition-colors text-lg leading-none"
      >
        +
      </button>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function AdminCourseForm() {
  const { courseId } = useParams()
  const isNew = !courseId || courseId === 'new'
  const navigate = useNavigate()

  const [subjects, setSubjects] = useState([])
  const [teachers, setTeachers] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [fieldErrors, setFieldErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [subjectsRes, teachersRes] = await Promise.all([
          adminGetSubjects(),
          adminGetTeachers(),
        ])
        setSubjects(subjectsRes.data)
        setTeachers(teachersRes.data)

        if (!isNew) {
          const coursesRes = await adminGetCourses()
          const c = coursesRes.data.find(item => item.id === courseId)
          if (!c) { setServerError('Course not found'); return }
          setForm({
            ...emptyForm,
            id: c.id || '',
            subject: c.subject || '',
            teacher: c.teacher ? String(c.teacher) : '',
            title: c.title || '',
            desc: c.desc || '',
            schedule: c.schedule || '',
            mode: c.mode || 'Online',
            language: c.language || 'Sinhala',
            duration: c.duration || '24 months',
            start_date: c.start_date || '',
            seats: c.seats ?? 30,
            seats_left: c.seats_left ?? 30,
            price: c.price || 'Rs. 3,500 / month',
            rating: c.rating ?? 0,
            review_count: c.review_count ?? 0,
            tag: c.tag || '',
            tag_color: c.tag_color || 'accent',
            features: Array.isArray(c.features) ? c.features.join('\n') : '',
            is_active: c.is_active ?? true,
            ordering: c.ordering ?? 0,
          })
        }
      } catch (err) {
        setServerError(JSON.stringify(err.response?.data || err.message))
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [courseId, isNew])

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    // Clear field error on change
    if (fieldErrors[field]) {
      setFieldErrors(prev => { const n = { ...prev }; delete n[field]; return n })
    }
  }

  function validate() {
    const errs = {}
    if (!form.id.trim()) errs.id = 'Required'
    if (!form.subject) errs.subject = 'Please select a subject'
    if (!form.teacher || Number(form.teacher) <= 0) errs.teacher = 'Please select a teacher'
    if (!form.title.trim()) errs.title = 'Required'
    if (!form.schedule.trim()) errs.schedule = 'Required'
    if (!form.start_date.trim()) errs.start_date = 'Required'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setServerError('')
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs)
      // Scroll to first error
      document.querySelector('[data-error]')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    const payload = {
      id: form.id.trim(),
      subject: form.subject,
      teacher: Number(form.teacher),
      title: form.title.trim(),
      desc: form.desc,
      schedule: form.schedule.trim(),
      mode: form.mode,
      language: form.language,
      duration: form.duration,
      start_date: form.start_date.trim(),
      seats: Number(form.seats),
      seats_left: Number(form.seats_left),
      price: form.price,
      rating: Number(form.rating),
      review_count: Number(form.review_count),
      tag: form.tag,
      tag_color: form.tag_color,
      features: form.features.split('\n').map(x => x.trim()).filter(Boolean),
      is_active: form.is_active,
      ordering: Number(form.ordering),
    }

    try {
      setSaving(true)
      if (isNew) {
        await adminCreateCourse(payload)
      } else {
        await adminUpdateCourse(courseId, payload)
      }
      navigate('/admin/dashboard')
    } catch (err) {
      setServerError(JSON.stringify(err.response?.data || 'Save failed'))
    } finally {
      setSaving(false)
    }
  }

  async function removeCourse() {
    try {
      await adminDeleteCourse(courseId)
      navigate('/admin/dashboard')
    } catch (err) {
      setServerError(JSON.stringify(err.response?.data || 'Delete failed'))
      setDeleteConfirm(false)
    }
  }

  // Seats left should never exceed seats
  const seatsLeftMax = Number(form.seats)

  if (loading) {
    return (
      <main className="min-h-screen bg-bg pt-[68px] px-6 py-12">
        <div className="max-w-[780px] mx-auto space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-surface border border-white/[0.08] rounded-2xl p-6 animate-pulse h-40" />
          ))}
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-bg pt-[68px] px-4 md:px-6 py-12">
      <form onSubmit={handleSubmit} noValidate className="max-w-[780px] mx-auto space-y-5">

        {/* ── Header ── */}
        <div className="flex justify-between items-center">
          <div>
            <p className="section-label mb-1">Admin · Courses</p>
            <h1 className="font-display font-bold text-2xl">
              {isNew ? 'Add new course' : 'Edit course'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Active toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <div
                onClick={() => set('is_active', !form.is_active)}
                className={`relative w-10 h-[22px] rounded-full transition-colors ${
                  form.is_active ? 'bg-accent' : 'bg-white/10'
                }`}
              >
                <span
                  className={`absolute top-[3px] left-[3px] w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    form.is_active ? 'translate-x-[18px]' : 'translate-x-0'
                  }`}
                />
              </div>
              <span className="text-sm text-muted">
                {form.is_active ? 'Active' : 'Inactive'}
              </span>
            </label>
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="text-sm text-muted hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-white/[0.08] hover:border-white/20"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* ── Server error ── */}
        {serverError && (
          <div className="bg-arts/10 border border-arts/30 text-arts rounded-xl p-4 text-sm flex items-start gap-3">
            <span className="text-lg leading-none mt-0.5">⚠</span>
            <p>{serverError}</p>
          </div>
        )}

        {/* ── Section 1: Identity ── */}
        <Section icon="🪪" title="Course identity">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div data-error={fieldErrors.id || undefined}>
              <Field label="Course ID" required hint="Unique slug, e.g. phy-003. Cannot be changed later." error={fieldErrors.id}>
                <input
                  disabled={!isNew}
                  className={`admin-input ${!isNew ? 'opacity-40 cursor-not-allowed' : ''}`}
                  value={form.id}
                  onChange={e => set('id', e.target.value)}
                  placeholder="phy-003"
                />
              </Field>
            </div>

            <div data-error={fieldErrors.title || undefined}>
              <Field label="Course title" required error={fieldErrors.title}>
                <input
                  className="admin-input"
                  value={form.title}
                  onChange={e => set('title', e.target.value)}
                  placeholder="Physics — A/L Complete Course"
                />
              </Field>
            </div>

            <div data-error={fieldErrors.subject || undefined}>
              <Field label="Subject" required error={fieldErrors.subject}>
                <select
                  className="admin-input"
                  value={form.subject}
                  onChange={e => set('subject', e.target.value)}
                >
                  <option value="">Select subject…</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </Field>
            </div>

            <div data-error={fieldErrors.teacher || undefined}>
              <Field label="Teacher" required error={fieldErrors.teacher}>
                <select
                  className="admin-input"
                  value={form.teacher}
                  onChange={e => set('teacher', e.target.value)}
                >
                  <option value="">Select teacher…</option>
                  {teachers.map(t => (
                    <option key={t.id} value={String(t.id)}>{t.name}</option>
                  ))}
                </select>
              </Field>
            </div>
          </div>

          <Field label="Description">
            <textarea
              rows="3"
              className="admin-input"
              value={form.desc}
              onChange={e => set('desc', e.target.value)}
              placeholder="Brief overview shown on the course card…"
            />
          </Field>
        </Section>

        {/* ── Section 2: Schedule ── */}
        <Section icon="📅" title="Schedule & delivery">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div data-error={fieldErrors.schedule || undefined}>
              <Field label="Schedule" required hint="E.g. Saturdays · 2:00 PM – 5:00 PM" error={fieldErrors.schedule}>
                <input
                  className="admin-input"
                  value={form.schedule}
                  onChange={e => set('schedule', e.target.value)}
                  placeholder="Saturdays · 2:00 PM – 5:00 PM"
                />
              </Field>
            </div>

            <div data-error={fieldErrors.start_date || undefined}>
              <Field label="Start date" required hint="E.g. June 2026" error={fieldErrors.start_date}>
                <input
                  className="admin-input"
                  value={form.start_date}
                  onChange={e => set('start_date', e.target.value)}
                  placeholder="June 2026"
                />
              </Field>
            </div>

            <Field label="Duration">
              <input
                className="admin-input"
                value={form.duration}
                onChange={e => set('duration', e.target.value)}
                placeholder="24 months"
              />
            </Field>

            <Field label="Price">
              <input
                className="admin-input"
                value={form.price}
                onChange={e => set('price', e.target.value)}
                placeholder="Rs. 3,500 / month"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Mode">
              <RadioGroup
                options={['Online', 'In-person', 'Hybrid']}
                value={form.mode}
                onChange={v => set('mode', v)}
              />
            </Field>

            <Field label="Language">
              <RadioGroup
                options={['Sinhala', 'English', 'Tamil']}
                value={form.language}
                onChange={v => set('language', v)}
              />
            </Field>
          </div>
        </Section>

        {/* ── Section 3: Capacity ── */}
        <Section icon="💺" title="Capacity">
          <div className="grid grid-cols-2 gap-8">
            <Field label="Total seats" hint="Maximum enrolments for this batch">
              <Stepper value={form.seats} onChange={v => {
                set('seats', v)
                // Keep seats_left ≤ seats
                if (form.seats_left > v) set('seats_left', v)
              }} min={1} max={500} />
            </Field>

            <Field label="Seats remaining" hint={`Out of ${form.seats} total`}>
              <Stepper
                value={form.seats_left}
                onChange={v => set('seats_left', Math.min(v, seatsLeftMax))}
                min={0}
                max={seatsLeftMax}
              />
            </Field>
          </div>

          {/* Capacity bar */}
          <div>
            <div className="flex justify-between text-xs text-muted mb-1.5">
              <span>Filled</span>
              <span>
                {form.seats - form.seats_left} / {form.seats} seats
                ({form.seats > 0 ? Math.round(((form.seats - form.seats_left) / form.seats) * 100) : 0}%)
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.07] overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-300"
                style={{ width: form.seats > 0 ? `${((form.seats - form.seats_left) / form.seats) * 100}%` : '0%' }}
              />
            </div>
          </div>
        </Section>

        {/* ── Section 4: Tag & Display ── */}
        <Section icon="🏷️" title="Tag & display">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Tag label" hint="Short badge text, e.g. Most Popular">
              <input
                className="admin-input"
                value={form.tag}
                onChange={e => set('tag', e.target.value)}
                placeholder="Most Popular"
              />
            </Field>

            <Field label="Tag color">
              <div className="flex gap-2 flex-wrap mt-1">
                {['accent', 'arts', 'science', 'commerce', 'muted'].map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => set('tag_color', color)}
                    className={`px-3 py-1.5 rounded-lg text-sm border capitalize transition-all ${
                      form.tag_color === color
                        ? 'bg-white/10 border-white/40 text-white'
                        : 'border-white/[0.12] text-muted hover:border-white/30'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Rating" hint="0.0 – 5.0">
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={form.rating}
                  onChange={e => set('rating', e.target.value)}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-8 text-right">
                  {Number(form.rating).toFixed(1)}
                </span>
              </div>
            </Field>

            <Field label="Review count">
              <input
                type="number"
                min="0"
                className="admin-input"
                value={form.review_count}
                onChange={e => set('review_count', e.target.value)}
              />
            </Field>

            <Field label="Ordering" hint="Lower number = appears first">
              <input
                type="number"
                className="admin-input"
                value={form.ordering}
                onChange={e => set('ordering', e.target.value)}
              />
            </Field>
          </div>
        </Section>

        {/* ── Section 5: Features ── */}
        <Section icon="✅" title="Features">
          <Field label="One feature per line" hint="These appear as bullet points on the course card">
            <textarea
              rows="6"
              className="admin-input font-mono text-sm"
              value={form.features}
              onChange={e => set('features', e.target.value)}
              placeholder={`Live online classes\nWeekly paper class\nMock exams\nRecorded sessions`}
            />
          </Field>

          {/* Preview */}
          {form.features.trim() && (
            <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
              <p className="text-xs text-muted mb-2 uppercase tracking-wider">Preview</p>
              <ul className="space-y-1.5">
                {form.features.split('\n').map(f => f.trim()).filter(Boolean).map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-accent mt-0.5">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Section>

        {/* ── Actions ── */}
        <div className="flex items-center justify-between pt-2 pb-8">
          {!isNew ? (
            deleteConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-arts">Are you sure?</span>
                <button
                  type="button"
                  onClick={removeCourse}
                  className="bg-arts/20 border border-arts/40 text-arts rounded-xl px-4 py-2 text-sm hover:bg-arts/30 transition-colors"
                >
                  Yes, delete
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(false)}
                  className="text-sm text-muted hover:text-white px-3 py-2"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setDeleteConfirm(true)}
                className="text-arts/70 hover:text-arts text-sm transition-colors flex items-center gap-1.5"
              >
                <span>🗑</span> Delete course
              </button>
            )
          ) : (
            <div />
          )}

          <button
            type="submit"
            disabled={saving}
            className="btn-primary min-w-[120px] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Saving…
              </>
            ) : (
              isNew ? 'Create course' : 'Save changes'
            )}
          </button>
        </div>
      </form>
    </main>
  )
}