import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { studentLogin } from '../api/api'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm]     = useState({ email: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await studentLogin(form)
      localStorage.setItem('studentAccessToken', res.data.access)
      localStorage.setItem('studentRefreshToken', res.data.refresh)
      localStorage.setItem('studentUser', JSON.stringify(res.data.student))
      navigate('/my-courses')
    } catch (err) {
      const data = err.response?.data

      // Backend signals that the account exists but email isn't verified yet
      if (data?.needsVerification) {
        localStorage.setItem('verifyEmail', data.email || form.email)
        navigate('/verify-email')
        return
      }

      setError(data?.detail || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .login-root {
          min-height: 100vh;
          background: linear-gradient(160deg, #F0FAF0 0%, #FAFFFE 55%, #F0F5FF 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 100px 24px 60px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #1A3A1A;
          position: relative;
          overflow: hidden;
        }
        .login-root::before {
          content: '';
          position: absolute; inset: 0; pointer-events: none;
          background-image: radial-gradient(circle, rgba(76,175,80,0.11) 1.5px, transparent 1.5px);
          background-size: 32px 32px;
          mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 0%, transparent 80%);
          -webkit-mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 0%, transparent 80%);
        }

        .login-card {
          width: 100%;
          max-width: 440px;
          background: white;
          border: 1.5px solid #C8E6C9;
          border-radius: 28px;
          padding: 44px 40px 48px;
          box-shadow: 0 8px 52px rgba(76,175,80,0.12);
          position: relative;
          z-index: 1;
          animation: fadeUp 0.45s ease both;
        }
        @media (max-width: 480px) {
          .login-card { padding: 32px 24px 38px; }
        }

        .login-logo {
          font-family: 'Nunito', sans-serif;
          font-weight: 900; font-size: 1.6rem;
          color: #2E7D32; text-align: center;
          margin-bottom: 28px; letter-spacing: -0.02em;
        }
        .login-logo span { color: #1A3A1A; }

        .login-eyebrow {
          display: inline-flex; align-items: center; gap: 6px;
          background: #E8F5E9; color: #2E7D32;
          font-weight: 700; font-size: 0.75rem;
          padding: 4px 13px; border-radius: 50px;
          letter-spacing: 0.07em; text-transform: uppercase;
          margin-bottom: 12px; border: 1.5px solid #A5D6A7;
        }

        .login-title {
          font-family: 'Nunito', sans-serif;
          font-weight: 900; font-size: 1.9rem;
          color: #1A3A1A; letter-spacing: -0.02em;
          margin-bottom: 6px; line-height: 1.1;
        }

        .login-sub {
          font-size: 0.88rem; color: #5A7A5A;
          margin-bottom: 28px; line-height: 1.6;
        }

        .login-error {
          background: #FEF2F2; border: 1.5px solid #FECACA;
          color: #DC2626; border-radius: 12px;
          padding: 12px 14px; font-size: 0.85rem;
          margin-bottom: 20px;
          display: flex; align-items: flex-start; gap: 8px;
        }

        .login-field { margin-bottom: 18px; }
        .login-field label {
          display: block;
          font-size: 0.8rem; font-weight: 700;
          color: #5A7A5A; margin-bottom: 6px;
          letter-spacing: 0.01em;
        }

        .login-input-wrap { position: relative; }

        .login-input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1.5px solid #D1E9D1;
          background: #FAFFFE;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.93rem; color: #1A3A1A;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
          box-sizing: border-box;
        }
        .login-input.has-toggle { padding-right: 46px; }
        .login-input::placeholder { color: #A8C4A8; }
        .login-input:focus {
          border-color: #4CAF50;
          box-shadow: 0 0 0 3px rgba(76,175,80,0.12);
          background: white;
        }
        .login-input:hover:not(:focus) { border-color: #A5D6A7; }

        .pw-toggle {
          position: absolute; right: 13px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: #7A9A7A; padding: 4px;
          transition: color 0.18s; font-size: 1rem;
          display: flex; align-items: center;
        }
        .pw-toggle:hover { color: #2E7D32; }

        .login-submit {
          width: 100%; padding: 14px;
          border-radius: 14px; border: none;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 1rem; font-weight: 800;
          cursor: pointer;
          background: linear-gradient(135deg, #4CAF50, #2E7D32);
          color: white;
          box-shadow: 0 4px 20px rgba(76,175,80,0.3);
          transition: transform 0.18s, box-shadow 0.18s, opacity 0.18s;
          margin-top: 8px;
        }
        .login-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(76,175,80,0.4);
        }
        .login-submit:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }

        .login-divider {
          display: flex; align-items: center; gap: 12px;
          margin: 22px 0 18px;
          color: #A8C4A8; font-size: 0.78rem; font-weight: 600;
        }
        .login-divider::before, .login-divider::after {
          content: ''; flex: 1; height: 1.5px; background: #E8F5E9;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <main className="login-root">
        <form onSubmit={handleSubmit} className="login-card">

          {/* Logo */}
          <div className="login-logo">Study<span>LK</span></div>

          {/* Heading */}
          <div className="login-eyebrow">🔑 Student Portal</div>
          <h1 className="login-title">Welcome back!</h1>
          <p className="login-sub">Login to enrol in courses and access your study materials.</p>

          {/* Error */}
          {error && (
            <div className="login-error">
              <span>⚠️</span><span>{error}</span>
            </div>
          )}

          {/* Email */}
          <div className="login-field">
            <label>Email Address</label>
            <div className="login-input-wrap">
              <input
                className="login-input"
                type="email"
                placeholder="you@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="login-field">
            <label>Password</label>
            <div className="login-input-wrap">
              <input
                className="login-input has-toggle"
                type={showPw ? 'text' : 'password'}
                placeholder="Your password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
              <button
                type="button"
                className="pw-toggle"
                onClick={() => setShowPw(v => !v)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? '⏳ Logging in…' : '→ Login'}
          </button>

          <div className="login-divider">or</div>

          {/* Register CTA */}
          <div style={{
            background: '#F1F8F1', border: '1.5px solid #C8E6C9',
            borderRadius: 14, padding: '16px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.88rem', color: '#5A7A5A', marginBottom: 10, lineHeight: 1.5 }}>
              New to StudyLK? Create a free account and start learning.
            </div>
            <button
              type="button"
              onClick={() => navigate('/register')}
              style={{
                background: 'white',
                border: '1.5px solid #4CAF50',
                color: '#2E7D32',
                fontWeight: 700, fontSize: '0.9rem',
                padding: '9px 24px', borderRadius: 50,
                cursor: 'pointer', fontFamily: 'inherit',
                transition: 'background 0.18s, color 0.18s',
              }}
              onMouseEnter={e => { e.target.style.background = '#4CAF50'; e.target.style.color = 'white' }}
              onMouseLeave={e => { e.target.style.background = 'white'; e.target.style.color = '#2E7D32' }}
            >
              ✨ Create Account
            </button>
          </div>

        </form>
      </main>
    </>
  )
}