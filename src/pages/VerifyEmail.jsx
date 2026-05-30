import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { studentVerifyEmail, studentResendVerification } from '../api/api'

function maskEmail(email) {
  if (!email) return ''
  const [local, domain] = email.split('@')
  if (!domain) return email
  const visible = local.length <= 2 ? local[0] : local.slice(0, 2)
  return visible + '***@' + domain
}

export default function VerifyEmail() {
  const navigate  = useNavigate()
  const savedEmail = localStorage.getItem('verifyEmail') || ''

  const [email, setEmail]           = useState(savedEmail)
  const [digits, setDigits]         = useState(['', '', '', '', '', ''])
  const [error, setError]           = useState('')
  const [success, setSuccess]       = useState('')
  const [loading, setLoading]       = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [countdown, setCountdown]   = useState(60)
  const [canResend, setCanResend]   = useState(false)

  const inputRefs = useRef([])

  // Tick down the resend countdown
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true)
      return
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  // ── OTP input helpers ────────────────────────────────────────────────────

  function handleDigitChange(index, value) {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next  = [...digits]
    next[index] = digit
    setDigits(next)
    if (digit && index < 5) inputRefs.current[index + 1]?.focus()
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        const next = [...digits]
        next[index - 1] = ''
        setDigits(next)
        inputRefs.current[index - 1]?.focus()
      }
    } else if (e.key === 'ArrowLeft'  && index > 0) inputRefs.current[index - 1]?.focus()
      else if (e.key === 'ArrowRight' && index < 5) inputRefs.current[index + 1]?.focus()
  }

  function handlePaste(e) {
    e.preventDefault()
    const raw  = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const next = ['', '', '', '', '', '']
    for (let i = 0; i < raw.length; i++) next[i] = raw[i]
    setDigits(next)
    inputRefs.current[Math.min(raw.length, 5)]?.focus()
  }

  // ── Actions ──────────────────────────────────────────────────────────────

  const code = digits.join('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (code.length !== 6) {
      setError('Please enter the complete 6-digit code.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await studentVerifyEmail({ email, code })
      setSuccess('Email verified! Taking you to login…')
      localStorage.removeItem('verifyEmail')
      setTimeout(() => navigate('/login'), 1600)
    } catch (err) {
      setError(err.response?.data?.detail || 'Verification failed. Please check the code and try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    setResendLoading(true)
    setError('')
    try {
      await studentResendVerification({ email })
      setDigits(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
      setCountdown(60)
      setCanResend(false)
      setSuccess('A new code has been sent to your email.')
      setTimeout(() => setSuccess(''), 4000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not resend. Please try again.')
    } finally {
      setResendLoading(false)
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .vfy-root {
          min-height: 100vh;
          background: linear-gradient(160deg, #F0FAF0 0%, #FAFFFE 55%, #F0F5FF 100%);
          display: flex; align-items: center; justify-content: center;
          padding: 100px 24px 60px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #1A3A1A;
          position: relative; overflow: hidden;
        }
        .vfy-root::before {
          content: '';
          position: absolute; inset: 0; pointer-events: none;
          background-image: radial-gradient(circle, rgba(76,175,80,0.11) 1.5px, transparent 1.5px);
          background-size: 32px 32px;
          mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 0%, transparent 80%);
          -webkit-mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 0%, transparent 80%);
        }

        .vfy-card {
          width: 100%; max-width: 440px;
          background: white;
          border: 1.5px solid #C8E6C9;
          border-radius: 28px;
          padding: 44px 40px 48px;
          box-shadow: 0 8px 52px rgba(76,175,80,0.12);
          position: relative; z-index: 1;
          animation: vfyFadeUp 0.45s ease both;
        }
        @media (max-width: 480px) { .vfy-card { padding: 32px 22px 38px; } }

        /* Logo */
        .vfy-logo {
          font-family: 'Nunito', sans-serif;
          font-weight: 900; font-size: 1.6rem;
          color: #2E7D32; text-align: center;
          margin-bottom: 24px; letter-spacing: -0.02em;
        }
        .vfy-logo span { color: #1A3A1A; }

        /* Email icon */
        .vfy-icon-wrap {
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 20px;
        }
        .vfy-icon {
          width: 68px; height: 68px;
          background: linear-gradient(135deg, #E8F5E9, #C8E6C9);
          border: 2px solid #A5D6A7;
          border-radius: 22px;
          display: flex; align-items: center; justify-content: center;
          font-size: 2rem;
        }

        /* Eyebrow */
        .vfy-eyebrow {
          display: inline-flex; align-items: center; gap: 6px;
          background: #E8F5E9; color: #2E7D32;
          font-weight: 700; font-size: 0.75rem;
          padding: 4px 13px; border-radius: 50px;
          letter-spacing: 0.07em; text-transform: uppercase;
          margin-bottom: 10px; border: 1.5px solid #A5D6A7;
        }

        .vfy-title {
          font-family: 'Nunito', sans-serif;
          font-weight: 900; font-size: 1.9rem;
          color: #1A3A1A; letter-spacing: -0.02em;
          margin-bottom: 8px; line-height: 1.1;
        }

        .vfy-sub {
          font-size: 0.88rem; color: #5A7A5A;
          margin-bottom: 28px; line-height: 1.65;
        }
        .vfy-sub strong { color: #2E7D32; font-weight: 700; }

        /* Alerts */
        .vfy-error {
          background: #FEF2F2; border: 1.5px solid #FECACA;
          color: #DC2626; border-radius: 12px;
          padding: 12px 14px; font-size: 0.85rem;
          margin-bottom: 18px;
          display: flex; align-items: flex-start; gap: 8px;
        }
        .vfy-success {
          background: #ECFDF3; border: 1.5px solid #6EE7B7;
          color: #059669; border-radius: 12px;
          padding: 12px 14px; font-size: 0.85rem;
          margin-bottom: 18px;
          display: flex; align-items: center; gap: 8px;
          font-weight: 600;
        }

        /* OTP boxes */
        .otp-row {
          display: flex; gap: 10px; justify-content: center;
          margin-bottom: 26px;
        }
        .otp-box {
          width: 52px; height: 62px;
          border-radius: 14px;
          border: 2px solid #D1E9D1;
          background: #FAFFFE;
          font-family: 'Nunito', sans-serif;
          font-size: 1.55rem; font-weight: 900;
          color: #1A3A1A; text-align: center;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
          caret-color: transparent;
        }
        .otp-box:focus {
          border-color: #4CAF50;
          box-shadow: 0 0 0 3px rgba(76,175,80,0.15);
          background: white;
        }
        .otp-box.filled {
          border-color: #4CAF50;
          background: #F1FBF1;
          color: #2E7D32;
        }
        @media (max-width: 400px) {
          .otp-box  { width: 40px; height: 50px; font-size: 1.2rem; border-radius: 11px; }
          .otp-row  { gap: 6px; }
        }

        /* Submit */
        .vfy-submit {
          width: 100%; padding: 14px;
          border-radius: 14px; border: none;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 1rem; font-weight: 800;
          cursor: pointer;
          background: linear-gradient(135deg, #4CAF50, #2E7D32);
          color: white;
          box-shadow: 0 4px 20px rgba(76,175,80,0.3);
          transition: transform 0.18s, box-shadow 0.18s, opacity 0.18s;
          margin-bottom: 14px;
        }
        .vfy-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(76,175,80,0.42);
        }
        .vfy-submit:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

        /* Resend area */
        .vfy-resend {
          background: #F7FBF7; border: 1.5px solid #D6EED6;
          border-radius: 14px; padding: 14px 16px;
          text-align: center; font-size: 0.87rem; color: #7A9A7A;
        }
        .vfy-resend-btn {
          background: none; border: none; cursor: pointer;
          color: #2E7D32; font-weight: 700;
          font-family: inherit; font-size: inherit;
          padding: 0; text-decoration: underline;
          text-underline-offset: 2px;
        }
        .vfy-resend-btn:hover:not(:disabled) { color: #4CAF50; }
        .vfy-resend-btn:disabled { opacity: 0.5; cursor: not-allowed; text-decoration: none; }

        /* Back link */
        .vfy-back {
          display: block; text-align: center;
          margin-top: 20px; font-size: 0.84rem; color: #9AB49A;
        }
        .vfy-back button {
          background: none; border: none; cursor: pointer;
          color: #7A9A7A; font-family: inherit; font-size: inherit;
          padding: 0; font-weight: 600;
          transition: color 0.18s;
        }
        .vfy-back button:hover { color: #2E7D32; }

        @keyframes vfyFadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
      `}</style>

      <main className="vfy-root">
        <form onSubmit={handleSubmit} className="vfy-card">

          {/* Logo */}
          <div className="vfy-logo">Study<span>LK</span></div>

          {/* Icon */}
          <div className="vfy-icon-wrap">
            <div className="vfy-icon">📧</div>
          </div>

          {/* Heading */}
          <div className="vfy-eyebrow">✉️ Email Verification</div>
          <h1 className="vfy-title">Check your inbox</h1>
          <p className="vfy-sub">
            We sent a 6-digit code to{' '}
            <strong>{maskEmail(email) || 'your email'}</strong>.
            Enter it below to activate your account.
          </p>

          {/* Alerts */}
          {error && (
            <div className="vfy-error">
              <span>⚠️</span><span>{error}</span>
            </div>
          )}
          {success && (
            <div className="vfy-success">
              <span>✅</span><span>{success}</span>
            </div>
          )}

          {/* OTP inputs */}
          <div className="otp-row" onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={el => (inputRefs.current[i] = el)}
                className={`otp-box${d ? ' filled' : ''}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={e => handleDigitChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                autoFocus={i === 0}
                autoComplete={i === 0 ? 'one-time-code' : 'off'}
              />
            ))}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="vfy-submit"
            disabled={loading || code.length !== 6}
          >
            {loading ? '⏳ Verifying…' : '✓ Verify Email'}
          </button>

          {/* Resend */}
          <div className="vfy-resend">
            {canResend ? (
              <>
                Didn't get it?{' '}
                <button
                  type="button"
                  className="vfy-resend-btn"
                  onClick={handleResend}
                  disabled={resendLoading}
                >
                  {resendLoading ? 'Sending…' : 'Resend code'}
                </button>
              </>
            ) : (
              <>
                Resend available in{' '}
                <strong style={{ color: '#2E7D32' }}>{countdown}s</strong>
              </>
            )}
          </div>

          {/* Back */}
          <div className="vfy-back">
            <button type="button" onClick={() => navigate('/login')}>
              ← Back to Login
            </button>
          </div>

        </form>
      </main>
    </>
  )
}