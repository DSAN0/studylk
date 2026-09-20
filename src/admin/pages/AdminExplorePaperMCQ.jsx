import { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  adminGetExplorePaper,
  adminGetExplorePaperMCQQuestions,
  adminCreateExplorePaperMCQQuestion,
  adminUpdateExplorePaperMCQQuestion,
  adminDeleteExplorePaperMCQQuestion,
} from '../../api/api'

const CHOICES = ['A', 'B', 'C', 'D', 'E']

const emptyQ = {
  question_text: '',
  question_image: null,
  question_image_preview: null,
  clear_question_image: false,

  option_a: '',
  option_a_image: null,
  option_a_preview: null,
  clear_option_a_image: false,

  option_b: '',
  option_b_image: null,
  option_b_preview: null,
  clear_option_b_image: false,

  option_c: '',
  option_c_image: null,
  option_c_preview: null,
  clear_option_c_image: false,

  option_d: '',
  option_d_image: null,
  option_d_preview: null,
  clear_option_d_image: false,

  option_e: '',
  option_e_image: null,
  option_e_preview: null,
  clear_option_e_image: false,

  correct_answer: 'A',
  explanation: '',
  ordering: 0,
}

export default function AdminExplorePaperMCQ() {
  const { paperId } = useParams()
  const navigate    = useNavigate()

  const [paper,     setPaper]     = useState(null)
  const [questions, setQuestions] = useState([])
  const [form,      setForm]      = useState(emptyQ)
  const [editingId, setEditingId] = useState(null)
  const [error,     setError]     = useState('')
  const [saving,    setSaving]    = useState(false)
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')
  const [zoomImage, setZoomImage] = useState(null) // { src: string, title: string }

  const fileInputRefs = {
    question: useRef(null),
    A: useRef(null),
    B: useRef(null),
    C: useRef(null),
    D: useRef(null),
    E: useRef(null),
  }

  useEffect(() => { loadAll() }, [paperId])

  async function loadAll() {
    setLoading(true)
    try {
      const [pRes, qRes] = await Promise.all([
        adminGetExplorePaper(paperId),
        adminGetExplorePaperMCQQuestions(paperId),
      ])
      setPaper(pRes.data)
      setQuestions(qRes.data || [])
    } catch (err) {
      setError('Failed to load: ' + JSON.stringify(err.response?.data || err.message))
    } finally {
      setLoading(false)
    }
  }

  function setF(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleFileChange(field, file) {
    if (!file) return
    const previewUrl = URL.createObjectURL(file)
    setForm(prev => ({
      ...prev,
      [field]: file,
      [`${field.replace('_image', '')}_preview`]: previewUrl,
      [`clear_${field}`]: false,
    }))
  }

  function handleClearImage(field) {
    const previewKey = field === 'question_image' ? 'question_image_preview' : `${field.replace('_image', '')}_preview`
    setForm(prev => ({
      ...prev,
      [field]: null,
      [previewKey]: null,
      [`clear_${field}`]: true,
    }))
  }

  function startEdit(q) {
    setEditingId(q.id)
    setForm({
      question_text:          q.question_text || '',
      question_image:         null,
      question_image_preview: q.question_image_url || q.question_image || null,
      clear_question_image:   false,

      option_a:               q.option_a || '',
      option_a_image:         null,
      option_a_preview:       q.option_a_image_url || q.option_a_image || null,
      clear_option_a_image:   false,

      option_b:               q.option_b || '',
      option_b_image:         null,
      option_b_preview:       q.option_b_image_url || q.option_b_image || null,
      clear_option_b_image:   false,

      option_c:               q.option_c || '',
      option_c_image:         null,
      option_c_preview:       q.option_c_image_url || q.option_c_image || null,
      clear_option_c_image:   false,

      option_d:               q.option_d || '',
      option_d_image:         null,
      option_d_preview:       q.option_d_image_url || q.option_d_image || null,
      clear_option_d_image:   false,

      option_e:               q.option_e || '',
      option_e_image:         null,
      option_e_preview:       q.option_e_image_url || q.option_e_image || null,
      clear_option_e_image:   false,

      correct_answer:         q.correct_answer || 'A',
      explanation:            q.explanation || '',
      ordering:               q.ordering ?? 0,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyQ)
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    // Validation: question must have either text or image
    const hasQuestionContent = form.question_text?.trim() || form.question_image || form.question_image_preview
    if (!hasQuestionContent) {
      setError('Please provide either question text, a question image, or both.')
      return
    }

    // Choices A-D must have text or image
    for (const ch of ['a', 'b', 'c', 'd']) {
      const hasContent = form[`option_${ch}`]?.trim() || form[`option_${ch}_image`] || form[`option_${ch}_preview`]
      if (!hasContent) {
        setError(`Choice ${ch.toUpperCase()} must have text or an image.`)
        return
      }
    }

    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('question_text', form.question_text || '')
      fd.append('option_a', form.option_a || '')
      fd.append('option_b', form.option_b || '')
      fd.append('option_c', form.option_c || '')
      fd.append('option_d', form.option_d || '')
      fd.append('option_e', form.option_e || '')
      fd.append('correct_answer', form.correct_answer)
      fd.append('explanation', form.explanation || '')
      fd.append('ordering', String(Number(form.ordering) || 0))

      // Append image files or clear markers
      const imageFields = [
        'question_image',
        'option_a_image',
        'option_b_image',
        'option_c_image',
        'option_d_image',
        'option_e_image',
      ]

      for (const field of imageFields) {
        if (form[field] instanceof File) {
          fd.append(field, form[field])
        } else if (form[`clear_${field}`]) {
          fd.append(field, '')
        }
      }

      if (editingId) {
        await adminUpdateExplorePaperMCQQuestion(editingId, fd)
      } else {
        await adminCreateExplorePaperMCQQuestion(paperId, fd)
      }

      setForm(emptyQ)
      setEditingId(null)
      await loadAll()
    } catch (err) {
      setError(JSON.stringify(err.response?.data || err.message || 'Save failed'))
    } finally {
      setSaving(false)
    }
  }

  async function remove(id) {
    if (!confirm('Are you sure you want to delete this MCQ question?')) return
    try {
      await adminDeleteExplorePaperMCQQuestion(id)
      if (editingId === id) cancelEdit()
      await loadAll()
    } catch (err) {
      setError(JSON.stringify(err.response?.data || err.message || 'Delete failed'))
    }
  }

  const filteredQs = search.trim()
    ? questions.filter(q =>
        (q.question_text || '').toLowerCase().includes(search.toLowerCase()) ||
        String(q.ordering || '').includes(search)
      )
    : questions

  const hasOptionE = Boolean(form.option_e?.trim() || form.option_e_image || form.option_e_preview)

  if (loading) {
    return (
      <>
        <Fonts />
        <main style={s.page}>
          <Header />
          <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
            <div style={s.spinner} />
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Fonts />
      <main style={s.page}>
        <Header />

        <div style={s.container}>
          {/* Title Row */}
          <div style={s.titleRow}>
            <div>
              <p style={s.eyebrow}>Admin · Explore Papers · MCQ Practice Editor</p>
              <h1 style={s.h1}>
                {paper
                  ? `${paper.subject_name || 'Subject'} — ${paper.year} · ${paper.medium} · ${paper.part || 'Part 1'}`
                  : 'MCQ Questions'}
              </h1>
              {paper && (
                <div style={s.paperMeta}>
                  <span style={s.pillGrade}>{paper.grade_name || paper.grade || 'Paper'}</span>
                  {paper.stream_name && <span style={s.pillStream}>{paper.stream_name}</span>}
                  {paper.pdfUrl && (
                    <a href={paper.pdfUrl} target="_blank" rel="noopener noreferrer" style={s.pdfLink}>
                      📄 View Original PDF ↗
                    </a>
                  )}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <BackBtn label="← All Explore Papers" onClick={() => navigate('/admin/explore-papers')} />
            </div>
          </div>

          {error && <ErrorBanner msg={error} onClose={() => setError('')} />}

          {/* Question count summary banner */}
          <div style={s.countBanner}>
            <span style={s.countNum}>{questions.length}</span>
            <div>
              <span style={s.countLbl}>MCQ Question{questions.length !== 1 ? 's' : ''} in this Paper</span>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 3 }}>
                Supports text questions, diagram/picture questions, text choices, and image-based choices.
              </div>
            </div>
            <div style={{ flex: 1 }} />
            <div style={{
              background: '#f0fdf4', border: '1px solid #bbf7d0',
              borderRadius: 12, padding: '8px 14px', fontSize: '0.78rem',
              color: '#166534', fontWeight: 700
            }}>
              ✨ Dual-Mode Student Practice Active
            </div>
          </div>

          {/* ── Form Card ── */}
          <form onSubmit={handleSubmit} style={s.formCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <SectionTitle
                icon="✍️"
                title={editingId ? `Editing Question #${questions.findIndex(q => q.id === editingId) + 1}` : 'Add New MCQ Question'}
              />
              {editingId && (
                <span style={{ fontSize: '0.78rem', color: '#3b82f6', fontWeight: 700, background: '#eff6ff', padding: '4px 10px', borderRadius: 20 }}>
                  Editing Mode Active
                </span>
              )}
            </div>

            {/* 1. Question Text & Question Image */}
            <div style={{ background: '#f8fafc', borderRadius: 16, border: '1.5px solid #e2e8f0', padding: 18, marginBottom: 20 }}>
              <FormField label="Question Text (Optional if Question is an Image)">
                <textarea
                  style={{ ...s.input, minHeight: 90, resize: 'vertical' }}
                  value={form.question_text}
                  onChange={e => setF('question_text', e.target.value)}
                  placeholder="Type the question or problem statement here (supports LaTeX/math syntax)..."
                />
              </FormField>

              {/* Question Image Dropzone */}
              <div>
                <label style={s.fieldLabel}>Question Picture / Diagram (Optional)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  <input
                    type="file"
                    ref={fileInputRefs.question}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={e => handleFileChange('question_image', e.target.files[0])}
                  />
                  <button
                    type="button"
                    style={s.uploadBtn}
                    onClick={() => fileInputRefs.question.current?.click()}
                  >
                    📷 {form.question_image_preview ? 'Change Question Image' : 'Upload Question Image'}
                  </button>

                  {form.question_image_preview && (
                    <div style={s.previewThumbContainer}>
                      <img
                        src={form.question_image_preview}
                        alt="Question Preview"
                        style={s.previewThumb}
                        onClick={() => setZoomImage({ src: form.question_image_preview, title: 'Question Diagram' })}
                      />
                      <button
                        type="button"
                        style={s.clearImgBtn}
                        onClick={() => handleClearImage('question_image')}
                        title="Remove Image"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {form.question_image && (
                    <span style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 600 }}>
                      ✓ {form.question_image.name} ({(form.question_image.size / 1024).toFixed(1)} KB)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Choices Section (A through E) */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: '1rem' }}>🔤</span>
                <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#1e293b' }}>
                  Answer Choices (A – E)
                </span>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  (Each choice can have text, an image, or both. Option E is optional)
                </span>
              </div>

              <div style={s.choicesGrid}>
                {CHOICES.map(ch => {
                  const lower = ch.toLowerCase()
                  const isE = ch === 'E'
                  const isCorrect = form.correct_answer === ch
                  const preview = form[`option_${lower}_preview`]
                  const file = form[`option_${lower}_image`]
                  const textVal = form[`option_${lower}`]

                  return (
                    <div
                      key={ch}
                      style={{
                        ...s.choiceBox,
                        borderColor: isCorrect ? '#86efac' : '#e2e8f0',
                        background: isCorrect ? '#f0fdf4' : '#ffffff',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span
                            style={{
                              ...s.choiceBadge,
                              background: isCorrect ? '#22c55e' : '#e2e8f0',
                              color: isCorrect ? 'white' : '#475569',
                            }}
                          >
                            {ch}
                          </span>
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                            Choice {ch} {isE && <span style={{ fontWeight: 400, color: '#94a3b8' }}>(Optional)</span>}
                          </span>
                        </div>
                        {isCorrect && (
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#16a34a', background: '#dcfce7', padding: '2px 8px', borderRadius: 20 }}>
                            ✓ Correct Answer
                          </span>
                        )}
                      </div>

                      {/* Text Input */}
                      <input
                        style={{ ...s.input, marginBottom: 8 }}
                        value={textVal}
                        onChange={e => {
                          const val = e.target.value
                          setF(`option_${lower}`, val)
                          if (isE && !val.trim() && !form.option_e_preview && form.correct_answer === 'E') {
                            setF('correct_answer', 'A')
                          }
                        }}
                        placeholder={`Option ${ch} text / formula...`}
                      />

                      {/* Image Upload for Option */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                        <input
                          type="file"
                          ref={fileInputRefs[ch]}
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={e => handleFileChange(`option_${lower}_image`, e.target.files[0])}
                        />
                        <button
                          type="button"
                          style={s.uploadMiniBtn}
                          onClick={() => fileInputRefs[ch].current?.click()}
                        >
                          📷 {preview ? 'Change Image' : `Upload Image ${ch}`}
                        </button>

                        {preview && (
                          <div style={s.previewMiniContainer}>
                            <img
                              src={preview}
                              alt={`Option ${ch}`}
                              style={s.previewMiniThumb}
                              onClick={() => setZoomImage({ src: preview, title: `Choice ${ch} Image` })}
                            />
                            <button
                              type="button"
                              style={s.clearImgBtnMini}
                              onClick={() => handleClearImage(`option_${lower}_image`)}
                              title="Remove Image"
                            >
                              ✕
                            </button>
                          </div>
                        )}

                        {file && (
                          <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>
                            ✓ {file.name}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 3. Correct Answer Picker */}
            <div style={s.correctRow}>
              <span style={s.fieldLabel}>Select Correct Answer:</span>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {CHOICES.map(ch => {
                  const isEDisabled = ch === 'E' && !hasOptionE
                  return (
                    <button
                      key={ch}
                      type="button"
                      disabled={isEDisabled}
                      style={{
                        ...(form.correct_answer === ch ? s.correctBtnActive : s.correctBtn),
                        ...(isEDisabled ? { opacity: 0.35, cursor: 'not-allowed' } : {}),
                      }}
                      onClick={() => setF('correct_answer', ch)}
                    >
                      {ch}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 4. Explanation & Ordering */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, marginBottom: 16 }}>
              <FormField label="Explanation (shown to students in Review Mode or Instant Feedback)">
                <textarea
                  style={{ ...s.input, minHeight: 70, resize: 'vertical' }}
                  value={form.explanation}
                  onChange={e => setF('explanation', e.target.value)}
                  placeholder="Explain why the correct answer is right and detail the solution steps..."
                />
              </FormField>

              <FormField label="Order #">
                <input
                  type="number"
                  style={{ ...s.input, width: 100 }}
                  value={form.ordering}
                  onChange={e => setF('ordering', e.target.value)}
                  min={0}
                />
              </FormField>
            </div>

            {/* Submit & Cancel Buttons */}
            <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
              <button
                type="submit"
                style={s.btnPrimary}
                disabled={saving}
                onMouseEnter={e => { if (!saving) e.currentTarget.style.opacity = '0.9' }}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                {saving ? 'Saving Question…' : editingId ? '✓ Update Question' : '+ Save Question'}
              </button>
              {editingId && (
                <button
                  type="button"
                  style={s.cancelBtn}
                  onClick={cancelEdit}
                  onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                  onMouseLeave={e => e.currentTarget.style.background = 'white'}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>

          {/* ── Questions List ── */}
          <section style={s.listCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, flexWrap: 'wrap' }}>
              <SectionTitle icon="📋" title={`Questions in this Paper (${filteredQs.length})`} />
              <div style={{ flex: 1 }} />
              <div style={{ position: 'relative' }}>
                <span style={s.searchIcon}>🔍</span>
                <input
                  style={s.searchInput}
                  placeholder="Search questions by text or number…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>

            {filteredQs.length === 0 ? (
              <Empty text={search ? `No questions match "${search}"` : 'No MCQ questions added yet. Add your first question above!'} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {filteredQs
                  .slice()
                  .sort((a, b) => (a.ordering || 0) - (b.ordering || 0))
                  .map((q, idx) => {
                    const qImg = q.question_image_url || q.question_image

                    return (
                      <div key={q.id} style={s.qCard}>
                        <div style={s.qHeader}>
                          <div style={s.qNum}>{idx + 1}</div>
                          <div style={{ flex: 1 }}>
                            {q.question_text && (
                              <div style={s.qText}>{q.question_text}</div>
                            )}
                            {qImg && (
                              <div style={{ marginTop: 8 }}>
                                <img
                                  src={qImg}
                                  alt="Question diagram"
                                  style={s.cardImgThumb}
                                  onClick={() => setZoomImage({ src: qImg, title: `Question ${idx + 1} Diagram` })}
                                />
                                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 2 }}>
                                  🔍 Click image to enlarge
                                </div>
                              </div>
                            )}
                          </div>
                          <div style={s.actionGroup}>
                            <button
                              style={s.editBtn}
                              onClick={() => startEdit(q)}
                              onMouseEnter={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.color = '#1d4ed8' }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#3b82f6' }}
                            >
                              Edit
                            </button>
                            <button
                              style={s.deleteBtn}
                              onClick={() => remove(q.id)}
                              onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#991b1b' }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#ef4444' }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        {/* Choices preview */}
                        <div style={s.choicesList}>
                          {CHOICES.map(ch => {
                            const lower = ch.toLowerCase()
                            const optText = q[`option_${lower}`]
                            const optImg = q[`option_${lower}_image_url`] || q[`option_${lower}_image`]
                            if (!optText && !optImg) return null

                            const isRight = q.correct_answer === ch

                            return (
                              <div
                                key={ch}
                                style={{
                                  ...s.choiceItem,
                                  background: isRight ? '#f0fdf4' : '#fafafa',
                                  border: `1.5px solid ${isRight ? '#86efac' : '#e2e8f0'}`,
                                }}
                              >
                                <span
                                  style={{
                                    ...s.choiceLetter,
                                    background: isRight ? '#22c55e' : '#e2e8f0',
                                    color: isRight ? 'white' : '#64748b',
                                  }}
                                >
                                  {ch}
                                  {isRight && ' ✓'}
                                </span>

                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                                  {optText && <span style={s.choiceText}>{optText}</span>}
                                  {optImg && (
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                      <img
                                        src={optImg}
                                        alt={`Option ${ch}`}
                                        style={s.choiceImgThumb}
                                        onClick={() => setZoomImage({ src: optImg, title: `Question ${idx + 1} Choice ${ch} Image` })}
                                      />
                                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>🔍 Zoom</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>

                        {q.explanation && (
                          <div style={s.explanationBox}>
                            <span style={{ fontWeight: 700, color: '#0369a1' }}>💡 Explanation: </span>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    )
                  })}
              </div>
            )}
          </section>
        </div>

        {/* ── Zoom Lightbox Modal ── */}
        {zoomImage && (
          <div style={s.lightboxOverlay} onClick={() => setZoomImage(null)}>
            <div style={s.lightboxContent} onClick={e => e.stopPropagation()}>
              <div style={s.lightboxHeader}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>
                  {zoomImage.title || 'Image Preview'}
                </span>
                <button style={s.lightboxClose} onClick={() => setZoomImage(null)}>✕</button>
              </div>
              <div style={{ padding: 16, textAlign: 'center', background: '#f8fafc', overflow: 'auto', maxHeight: '80vh' }}>
                <img
                  src={zoomImage.src}
                  alt={zoomImage.title}
                  style={{ maxWidth: '100%', maxHeight: '72vh', objectFit: 'contain', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
              </div>
            </div>
          </div>
        )}

        <Footer />
      </main>
    </>
  )
}

/* ── Sub-Components ─────────────────────────────────────── */
function Fonts() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Nunito:wght@700;800;900&display=swap');
      * { box-sizing:border-box; margin:0; padding:0; }
      @keyframes spin { to { transform:rotate(360deg); } }
    `}</style>
  )
}

function Header() {
  return (
    <header style={s.header}>
      <div style={s.headerInner}>
        <div style={s.brandRow}>
          <div style={s.brandDot} />
          <span style={s.brandName}>Study<span style={{ color: '#1A3A1A' }}>LK</span></span>
          <span style={s.adminBadge}>Admin</span>
        </div>
      </div>
    </header>
  )
}

function BackBtn({ onClick, label = '← Back' }) {
  return (
    <button
      onClick={onClick}
      style={s.backBtn}
      onMouseEnter={e => { e.currentTarget.style.background = '#E8F5E9'; e.currentTarget.style.color = '#2E7D32' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#4A6A4A' }}
    >
      {label}
    </button>
  )
}

function SectionTitle({ icon, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: '1.1rem' }}>{icon}</span>
      <h2 style={s.sectionTitle}>{title}</h2>
    </div>
  )
}

function FormField({ label, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={s.fieldLabel}>{label}</label>
      {children}
    </div>
  )
}

function ErrorBanner({ msg, onClose }) {
  return (
    <div style={s.errorBanner}>
      <span>{msg}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#991B1B', fontWeight: 700, fontSize: '1rem' }}>✕</button>
    </div>
  )
}

function Empty({ text }) {
  return <p style={{ fontSize: '0.875rem', color: '#7A9A7A', padding: '36px 0', textAlign: 'center' }}>{text}</p>
}

function Footer() {
  return (
    <footer style={s.footer}>
      <span style={s.footerBrand}>Study<span style={{ color: '#1A3A1A' }}>LK</span></span>
      <span style={s.footerText}>Admin Panel · {new Date().getFullYear()}</span>
    </footer>
  )
}

/* ── Styles ─────────────────────────────────────────────── */
const BASE = "'Plus Jakarta Sans', sans-serif"
const DISPLAY = "'Nunito', sans-serif"

const s = {
  page: { minHeight: '100vh', background: '#F8FBF8', color: '#1A3A1A', fontFamily: BASE },
  spinner: { width: 40, height: 40, border: '4px solid #E8F5E9', borderTopColor: '#2E7D32', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  header: { position: 'sticky', top: 0, zIndex: 50, background: 'rgba(248,251,248,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1.5px solid #E8F5E9' },
  headerInner: { maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center' },
  brandRow: { display: 'flex', alignItems: 'center', gap: 10 },
  brandDot: { width: 10, height: 10, borderRadius: '50%', background: 'linear-gradient(135deg,#4CAF50,#2E7D32)', boxShadow: '0 0 8px rgba(76,175,80,0.5)' },
  brandName: { fontFamily: DISPLAY, fontWeight: 900, fontSize: '1.35rem', color: '#2E7D32' },
  adminBadge: { fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: '#E8F5E9', color: '#2E7D32', padding: '3px 8px', borderRadius: 50, border: '1px solid #C8E6C9' },
  container: { maxWidth: 1100, margin: '0 auto', padding: '36px 24px 60px' },
  titleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 },
  eyebrow: { fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#3B82F6', marginBottom: 4 },
  h1: { fontFamily: DISPLAY, fontWeight: 900, fontSize: 'clamp(1.4rem,3vw,2rem)', color: '#1A3A1A', letterSpacing: '-0.01em', marginBottom: 8 },
  paperMeta: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  pillGrade: { fontSize: '0.72rem', fontWeight: 700, background: '#DCFCE7', color: '#166534', border: '1px solid #BBF7D0', padding: '3px 10px', borderRadius: 50 },
  pillStream: { fontSize: '0.72rem', fontWeight: 700, background: '#EDE9FE', color: '#6D28D9', border: '1px solid #C4B5FD', padding: '3px 10px', borderRadius: 50 },
  pdfLink: { fontSize: '0.78rem', fontWeight: 700, color: '#3B82F6', textDecoration: 'none' },
  backBtn: { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'white', border: '1.5px solid #D4E8D4', borderRadius: 50, padding: '8px 18px', fontSize: '0.82rem', fontWeight: 600, color: '#4A6A4A', cursor: 'pointer', fontFamily: BASE, transition: 'all 0.18s', whiteSpace: 'nowrap' },

  countBanner: { display: 'flex', alignItems: 'center', gap: 16, background: 'white', border: '1.5px solid #E8F5E9', borderRadius: 20, padding: '18px 24px', marginBottom: 20, boxShadow: '0 2px 12px rgba(46,125,50,0.05)', flexWrap: 'wrap' },
  countNum: { fontFamily: DISPLAY, fontSize: '2.4rem', fontWeight: 900, color: '#2E7D32', lineHeight: 1 },
  countLbl: { fontSize: '0.92rem', fontWeight: 700, color: '#1e293b' },

  formCard: { background: 'white', borderRadius: 24, border: '1.5px solid #E8F5E9', padding: '28px', marginBottom: 24, boxShadow: '0 2px 12px rgba(76,175,80,0.05)' },
  listCard: { background: 'white', borderRadius: 24, border: '1.5px solid #E8F5E9', padding: '28px', boxShadow: '0 2px 12px rgba(76,175,80,0.05)' },
  sectionTitle: { fontFamily: DISPLAY, fontWeight: 800, fontSize: '1.05rem', color: '#1A3A1A' },
  fieldLabel: { display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' },
  input: { width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #E2E8F0', background: '#FAFCFA', fontFamily: BASE, fontSize: '0.875rem', color: '#1A3A1A', outline: 'none', transition: 'border-color 0.2s' },

  uploadBtn: { display: 'inline-flex', alignItems: 'center', gap: 6, background: '#eff6ff', border: '1.5px dashed #3b82f6', borderRadius: 10, padding: '8px 14px', fontSize: '0.8rem', fontWeight: 700, color: '#1d4ed8', cursor: 'pointer', transition: 'all 0.18s' },
  uploadMiniBtn: { display: 'inline-flex', alignItems: 'center', gap: 4, background: '#f8fafc', border: '1px dashed #94a3b8', borderRadius: 8, padding: '5px 10px', fontSize: '0.75rem', fontWeight: 600, color: '#475569', cursor: 'pointer' },

  previewThumbContainer: { position: 'relative', display: 'inline-block' },
  previewThumb: { width: 80, height: 60, objectFit: 'cover', borderRadius: 8, border: '1.5px solid #cbd5e1', cursor: 'pointer' },
  clearImgBtn: { position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: '#ef4444', color: 'white', border: 'none', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },

  previewMiniContainer: { position: 'relative', display: 'inline-block' },
  previewMiniThumb: { width: 44, height: 34, objectFit: 'cover', borderRadius: 6, border: '1px solid #cbd5e1', cursor: 'pointer' },
  clearImgBtnMini: { position: 'absolute', top: -5, right: -5, width: 16, height: 16, borderRadius: '50%', background: '#ef4444', color: 'white', border: 'none', fontSize: '0.6rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },

  choicesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14, marginBottom: 16 },
  choiceBox: { border: '1.5px solid #e2e8f0', borderRadius: 14, padding: 14, transition: 'all 0.2s' },
  choiceBadge: { width: 26, height: 26, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.78rem' },

  correctRow: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, flexWrap: 'wrap' },
  correctBtn: { width: 42, height: 42, borderRadius: 10, border: '1.5px solid #E2E8F0', background: '#F8FAFC', fontFamily: DISPLAY, fontWeight: 800, fontSize: '0.9rem', color: '#64748B', cursor: 'pointer', transition: 'all 0.18s' },
  correctBtnActive: { width: 42, height: 42, borderRadius: 10, border: '1.5px solid #22C55E', background: '#DCFCE7', fontFamily: DISPLAY, fontWeight: 800, fontSize: '0.9rem', color: '#166534', cursor: 'pointer', boxShadow: '0 2px 8px rgba(34,197,94,0.3)' },

  searchInput: { padding: '8px 14px 8px 36px', borderRadius: 10, border: '1.5px solid #E8F5E9', background: '#FAFCFA', fontFamily: BASE, fontSize: '0.82rem', color: '#1A3A1A', outline: 'none', width: 280 },
  searchIcon: { position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: '0.9rem', pointerEvents: 'none' },

  qCard: { background: '#FAFCFA', border: '1.5px solid #E8F5E9', borderRadius: 18, padding: '20px', transition: 'border-color 0.18s' },
  qHeader: { display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 },
  qNum: { width: 34, height: 34, borderRadius: 10, background: '#1A3A1A', color: 'white', fontFamily: DISPLAY, fontWeight: 900, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 },
  qText: { fontSize: '0.92rem', fontWeight: 600, color: '#1A3A1A', lineHeight: 1.55 },
  cardImgThumb: { maxWidth: 220, maxHeight: 120, objectFit: 'contain', borderRadius: 8, border: '1px solid #cbd5e1', cursor: 'pointer', background: 'white', padding: 4 },

  choicesList: { display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 10 },
  choiceItem: { display: 'flex', alignItems: 'center', gap: 12, borderRadius: 10, padding: '8px 14px' },
  choiceLetter: { width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontWeight: 800, fontSize: '0.75rem', flexShrink: 0, whiteSpace: 'nowrap' },
  choiceText: { fontSize: '0.85rem', color: '#374151' },
  choiceImgThumb: { height: 40, maxWidth: 100, objectFit: 'contain', borderRadius: 6, border: '1px solid #cbd5e1', cursor: 'pointer', background: 'white' },

  explanationBox: { background: '#EFF6FF', border: '1.5px solid #BFDBFE', borderRadius: 10, padding: '10px 14px', fontSize: '0.83rem', color: '#1e40af', lineHeight: 1.55, marginTop: 8 },

  actionGroup: { display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 },
  editBtn: { fontSize: '0.78rem', fontWeight: 700, color: '#3B82F6', background: 'transparent', border: '1.5px solid #3B82F6', borderRadius: 50, padding: '6px 14px', cursor: 'pointer', fontFamily: BASE, transition: 'all 0.2s', whiteSpace: 'nowrap' },
  deleteBtn: { fontSize: '0.78rem', fontWeight: 700, color: '#EF4444', background: 'transparent', border: '1.5px solid #EF4444', borderRadius: 50, padding: '6px 14px', cursor: 'pointer', fontFamily: BASE, transition: 'all 0.2s', whiteSpace: 'nowrap' },
  btnPrimary: { display: 'inline-flex', alignItems: 'center', background: 'linear-gradient(135deg,#3B82F6,#1D4ED8)', color: 'white', fontWeight: 700, fontSize: '0.85rem', padding: '10px 24px', borderRadius: 50, border: 'none', cursor: 'pointer', fontFamily: BASE, boxShadow: '0 3px 12px rgba(59,130,246,0.3)', transition: 'opacity 0.18s', whiteSpace: 'nowrap' },
  cancelBtn: { display: 'inline-flex', alignItems: 'center', background: 'white', color: '#64748B', fontWeight: 600, fontSize: '0.85rem', padding: '10px 20px', borderRadius: 50, border: '1.5px solid #E2E8F0', cursor: 'pointer', fontFamily: BASE, transition: 'background 0.18s', whiteSpace: 'nowrap' },
  errorBanner: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, background: '#FEE2E2', border: '1.5px solid #FECACA', color: '#991B1B', borderRadius: 16, padding: '12px 18px', fontSize: '0.85rem', marginBottom: 20 },
  footer: { borderTop: '1.5px solid #E8F5E9', padding: '20px 24px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, background: 'white' },
  footerBrand: { fontFamily: DISPLAY, fontWeight: 900, fontSize: '1.1rem', color: '#2E7D32' },
  footerText: { fontSize: '0.78rem', color: '#AACAAA' },

  lightboxOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  lightboxContent: { background: 'white', borderRadius: 16, maxWidth: 900, width: '100%', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' },
  lightboxHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderBottom: '1px solid #e2e8f0', background: '#ffffff' },
  lightboxClose: { background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 30, height: 30, fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer', color: '#475569' },
}
