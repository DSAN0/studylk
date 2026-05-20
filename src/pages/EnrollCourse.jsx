import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createEnrollment, getCourseDetail } from '../api/api'

const COMPANY_ACCOUNT = {
  bank: 'Bank of Ceylon',
  branch: 'Kandy',
  name: 'W.M.B.J.B.Wijekoon',
  number: '87418221',
  whatsapp: '0724082156',
}

export default function EnrollCourse() {
  const { streamId, subjectId, courseId } = useParams()
  const navigate = useNavigate()

  const [course, setCourse]       = useState(null)
  const [student, setStudent]     = useState(null)
  const [loading, setLoading]     = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]         = useState('')

  useEffect(() => {
    async function loadData() {
      const token = localStorage.getItem('studentAccessToken')
      const savedStudent = localStorage.getItem('studentUser')
      if (!token || !savedStudent) { navigate('/login'); return }
      setStudent(JSON.parse(savedStudent))
      try {
        const res = await getCourseDetail(streamId, subjectId, courseId)
        setCourse(res.data)
      } catch (err) {
        console.error(err)
        setError('Course not found')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [streamId, subjectId, courseId, navigate])

  async function handleConfirm() {
    setError('')
    setSubmitting(true)
    try {
      const res = await createEnrollment({
        courseId: course.id,
        payment_note: 'Student confirmed enrollment. Payment receipt will be sent via WhatsApp within one week.',
      })
      const whatsappUrl =
        res.data.whatsappUrl ||
        `https://wa.me/${COMPANY_ACCOUNT.whatsapp}?text=Hi%20StudyLK%2C%20I%20confirmed%20my%20course%20enrollment.%20I%20will%20send%20payment%20receipt.`
      window.open(whatsappUrl, '_blank')
      navigate('/my-courses')
    } catch (err) {
      setError(JSON.stringify(err.response?.data || 'Enrollment failed'))
    } finally {
      setSubmitting(false)
    }
  }

  /* ── Loading ── */
  if (loading) {
    return (
      <>
        <BaseStyles />
        <main style={{
          minHeight: '100vh', paddingTop: 90,
          background: 'linear-gradient(160deg, #F0FAF0 0%, #FAFFFE 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 14,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
          <div style={{ fontSize: '2.2rem' }}>📋</div>
          <p style={{ color: '#5A7A5A', fontWeight: 600, fontSize: '0.95rem' }}>Loading enrolment…</p>
          <div style={{ display: 'flex', gap: 6 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: '50%', background: '#4CAF50',
                animation: `bounce 1.2s ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
        </main>
      </>
    )
  }

  /* ── Not found ── */
  if (!course) {
    return (
      <>
        <BaseStyles />
        <main style={{
          minHeight: '100vh', paddingTop: 90,
          background: 'linear-gradient(160deg, #F0FAF0 0%, #FAFFFE 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: '3rem', marginBottom: 14 }}>🔍</div>
            <p style={{ color: '#5A7A5A', marginBottom: 24 }}>{error || 'Course not found'}</p>
            <GreenButton onClick={() => navigate('/streams')}>Go to streams</GreenButton>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <BaseStyles />
      <style>{`
        .enroll-root {
          min-height: 100vh;
          background: linear-gradient(160deg, #F0FAF0 0%, #FAFFFE 55%, #F0F5FF 100%);
          padding: 100px 24px 60px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #1A3A1A;
        }

        .enroll-card {
          max-width: 860px;
          margin: 0 auto;
          animation: fadeUp 0.45s ease both;
        }

        .enroll-header {
          margin-bottom: 32px;
        }

        .enroll-eyebrow {
          display: inline-flex; align-items: center; gap: 7px;
          background: #E8F5E9; color: #2E7D32;
          font-weight: 700; font-size: 0.75rem;
          padding: 4px 13px; border-radius: 50px;
          letter-spacing: 0.07em; text-transform: uppercase;
          margin-bottom: 14px; border: 1.5px solid #A5D6A7;
        }

        .enroll-title {
          font-family: 'Nunito', sans-serif;
          font-weight: 900;
          font-size: clamp(1.8rem, 4vw, 2.4rem);
          color: #1A3A1A; letter-spacing: -0.02em;
          margin-bottom: 8px; line-height: 1.1;
        }

        .enroll-subtitle {
          font-size: 0.92rem; color: #5A7A5A; line-height: 1.6;
        }

        .enroll-error {
          background: #FEF2F2; border: 1.5px solid #FECACA;
          color: #DC2626; border-radius: 14px;
          padding: 13px 16px; font-size: 0.87rem;
          margin-bottom: 20px;
          display: flex; align-items: flex-start; gap: 8px;
        }

        /* Section card */
        .enroll-section {
          background: white;
          border: 1.5px solid #E8F5E9;
          border-radius: 22px;
          padding: 28px;
          margin-bottom: 18px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        }

        .enroll-section-header {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 20px; padding-bottom: 14px;
          border-bottom: 1.5px solid #F0F7F0;
        }

        .enroll-section-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: #E8F5E9; border: 1.5px solid #C8E6C9;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem; flex-shrink: 0;
        }

        .enroll-section-title {
          font-family: 'Nunito', sans-serif;
          font-weight: 900; font-size: 1.05rem; color: #1A3A1A;
        }

        /* Info row */
        .enroll-info-row {
          display: flex; justify-content: space-between;
          gap: 16px; padding: 10px 0;
          border-bottom: 1.5px solid #F5FAF5;
          font-size: 0.88rem;
        }
        .enroll-info-row:last-of-type { border-bottom: none; padding-bottom: 0; }
        .enroll-info-label { color: #7A9A7A; font-weight: 500; }
        .enroll-info-value { color: #1A3A1A; font-weight: 700; text-align: right; }

        /* Bank account number highlight */
        .bank-number {
          font-family: 'Courier New', monospace;
          font-size: 1rem; font-weight: 800;
          color: #2E7D32; letter-spacing: 0.08em;
          background: #E8F5E9; border: 1.5px solid #C8E6C9;
          padding: 4px 12px; border-radius: 8px;
        }

        /* Payment notice */
        .payment-notice {
          background: linear-gradient(135deg, #E8F5E9, #E3F2FD);
          border: 1.5px solid #A5D6A7;
          border-radius: 14px; padding: 16px;
          margin-top: 16px;
          display: flex; gap: 12px; align-items: flex-start;
        }
        .payment-notice-icon {
          font-size: 1.3rem; flex-shrink: 0; margin-top: 1px;
        }
        .payment-notice-text {
          font-size: 0.87rem; color: #2E5A2E; line-height: 1.65; font-weight: 500;
        }

        /* Steps */
        .steps-list {
          display: flex; flex-direction: column; gap: 12px;
          margin-top: 16px;
        }
        .step-item {
          display: flex; align-items: flex-start; gap: 12px;
          font-size: 0.87rem; color: #4A6A4A; line-height: 1.55;
        }
        .step-num {
          width: 24px; height: 24px; border-radius: '50%';
          background: linear-gradient(135deg, #4CAF50, #2E7D32);
          color: white; font-weight: 800; font-size: 0.72rem;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; border-radius: 50%;
        }

        /* Confirm button */
        .enroll-confirm-btn {
          width: 100%; padding: 16px;
          border-radius: 16px; border: none;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 1.05rem; font-weight: 800;
          cursor: pointer;
          background: linear-gradient(135deg, #4CAF50, #2E7D32);
          color: white;
          box-shadow: 0 4px 20px rgba(76,175,80,0.32);
          transition: transform 0.18s, box-shadow 0.18s, opacity 0.18s;
          margin-top: 8px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .enroll-confirm-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(76,175,80,0.42);
        }
        .enroll-confirm-btn:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }

        .enroll-back-btn {
          width: 100%; padding: 13px;
          border-radius: 14px;
          background: white; border: 1.5px solid #D1E9D1;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.92rem; font-weight: 600;
          color: #5A7A5A; cursor: pointer; margin-top: 10px;
          transition: background 0.18s, color 0.18s;
        }
        .enroll-back-btn:hover { background: #E8F5E9; color: #2E7D32; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <main className="enroll-root">
        <div className="enroll-card">

          {/* Header */}
          <div className="enroll-header">
            <div className="enroll-eyebrow">🎓 Course Enrolment</div>
            <h1 className="enroll-title">Confirm Enrolment</h1>
            <p className="enroll-subtitle">
              Review your course and student details, then complete payment to confirm your place.
            </p>
          </div>

          {error && (
            <div className="enroll-error">
              <span>⚠️</span><span>{error}</span>
            </div>
          )}

          {/* Course details */}
          <div className="enroll-section">
            <div className="enroll-section-header">
              <div className="enroll-section-icon">📚</div>
              <div className="enroll-section-title">Course Details</div>
            </div>
            {[
              { label: 'Course',    value: course.title },
              { label: 'Teacher',   value: course.teacher?.name },
              { label: 'Schedule',  value: course.schedule },
              { label: 'Mode',      value: course.mode },
              { label: 'Duration',  value: course.duration },
              { label: 'Language',  value: course.language },
            ].map(row => (
              <div key={row.label} className="enroll-info-row">
                <span className="enroll-info-label">{row.label}</span>
                <span className="enroll-info-value">{row.value || '—'}</span>
              </div>
            ))}
            {/* Fee highlighted */}
            <div style={{
              marginTop: 16, padding: '14px 18px',
              background: '#F1F8F1', border: '1.5px solid #C8E6C9',
              borderRadius: 14,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#5A7A5A' }}>💰 Course Fee</span>
              <span style={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 900, fontSize: '1.4rem', color: '#2E7D32',
              }}>
                {course.price}
              </span>
            </div>
          </div>

          {/* Student details */}
          <div className="enroll-section">
            <div className="enroll-section-header">
              <div className="enroll-section-icon">👤</div>
              <div className="enroll-section-title">Student Details</div>
            </div>
            {[
              { label: 'Name',  value: `${student?.first_name || ''} ${student?.last_name || ''}`.trim() },
              { label: 'Email', value: student?.email },
              { label: 'Phone', value: student?.phone },
            ].map(row => (
              <div key={row.label} className="enroll-info-row">
                <span className="enroll-info-label">{row.label}</span>
                <span className="enroll-info-value">{row.value || '—'}</span>
              </div>
            ))}
          </div>

          {/* Payment */}
          <div className="enroll-section">
            <div className="enroll-section-header">
              <div className="enroll-section-icon">🏦</div>
              <div className="enroll-section-title">Payment Details</div>
            </div>

            {[
              { label: 'Bank',           value: COMPANY_ACCOUNT.bank },
              { label: 'Branch',         value: COMPANY_ACCOUNT.branch },
              { label: 'Account Name',   value: COMPANY_ACCOUNT.name },
            ].map(row => (
              <div key={row.label} className="enroll-info-row">
                <span className="enroll-info-label">{row.label}</span>
                <span className="enroll-info-value">{row.value}</span>
              </div>
            ))}

            {/* Account number highlighted */}
            <div className="enroll-info-row" style={{ alignItems: 'center' }}>
              <span className="enroll-info-label">Account Number</span>
              <span className="bank-number">{COMPANY_ACCOUNT.number}</span>
            </div>

            {/* Payment notice */}
            <div className="payment-notice">
              <span className="payment-notice-icon">💡</span>
              <div className="payment-notice-text">
                Please deposit the course fee to the account above and send your payment receipt via WhatsApp within <strong>2 weeks</strong> to complete your enrolment.
              </div>
            </div>

            {/* Steps */}
            <div className="steps-list">
              {[
                'Click "Confirm Enrolment" below to submit your request',
                'You will be redirected to WhatsApp to notify us',
                'Make your bank deposit and send us the receipt',
                'Your enrolment will be approved within 1–2 business days',
              ].map((step, i) => (
                <div key={i} className="step-item">
                  <div className="step-num">{i + 1}</div>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <button
            className="enroll-confirm-btn"
            disabled={submitting}
            onClick={handleConfirm}
          >
            {submitting
              ? '⏳ Confirming…'
              : <><WhatsAppIcon /> Confirm Enrolment & Open WhatsApp</>
            }
          </button>

          <button
            className="enroll-back-btn"
            onClick={() => navigate(-1)}
          >
            ← Go Back
          </button>

        </div>
      </main>
    </>
  )
}

/* ── Helpers ── */

function GreenButton({ onClick, children }) {
  return (
    <button onClick={onClick} style={{
      background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
      color: 'white', fontWeight: 700, fontSize: '0.92rem',
      padding: '11px 24px', borderRadius: 50, border: 'none', cursor: 'pointer',
      boxShadow: '0 4px 16px rgba(76,175,80,0.28)',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      {children}
    </button>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

function BaseStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50%       { transform: translateY(-8px); }
      }
    `}</style>
  )
}