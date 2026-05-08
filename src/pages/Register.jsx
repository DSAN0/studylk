import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { studentRegister } from '../api/api'

const SECTIONS = [
  {
    title: 'Personal Information',
    icon: '👤',
    fields: [
      { key: 'first_name', label: 'First Name', placeholder: 'Kavindu' },
      { key: 'last_name', label: 'Last Name', placeholder: 'Perera' },
      { key: 'email', label: 'Email Address', placeholder: 'you@email.com', type: 'email' },
      { key: 'phone', label: 'Phone Number', placeholder: '07XXXXXXXX' },
      { key: 'dob', label: 'Date of Birth', type: 'date' },
    ],
  },
  {
    title: 'Account Security',
    icon: '🔐',
    fields: [
      { key: 'password', label: 'Password', type: 'password', placeholder: 'Min. 6 characters' },
      { key: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: 'Repeat password' },
    ],
  },
]

export default function Register() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    dob: '',
    password: '',
    confirmPassword: '',
  })

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const res = await studentRegister(form)

      localStorage.setItem('verifyEmail', form.email)

      if (res.data?.verification_code) {
        localStorage.setItem('verifyCode', res.data.verification_code)
      }

      navigate('/verify-email')
    } catch (err) {
      setError(JSON.stringify(err.response?.data || 'Registration failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .reg-root {
          min-height: 100vh;
          background: linear-gradient(160deg, #F0FAF0 0%, #FAFFFE 50%, #F5F9FF 100%);
          padding: 100px 24px 60px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #1A3A1A;
        }

        .reg-card {
          max-width: 760px;
          margin: 0 auto;
          background: white;
          border: 1.5px solid #C8E6C9;
          border-radius: 28px;
          padding: 44px 44px 48px;
          box-shadow: 0 8px 48px rgba(76,175,80,0.1);
        }

        @media (max-width: 600px) {
          .reg-card {
            padding: 28px 20px 36px;
          }
        }

        .reg-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #E8F5E9;
          color: #2E7D32;
          font-weight: 700;
          font-size: 0.78rem;
          padding: 5px 14px;
          border-radius: 50px;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          margin-bottom: 14px;
          border: 1.5px solid #A5D6A7;
        }

        .reg-title {
          font-family: 'Nunito', sans-serif;
          font-weight: 900;
          font-size: clamp(1.8rem, 4vw, 2.4rem);
          color: #1A3A1A;
          margin-bottom: 8px;
          line-height: 1.1;
        }

        .reg-subtitle {
          font-size: 0.92rem;
          color: #5A7A5A;
          margin-bottom: 36px;
          line-height: 1.6;
        }

        .reg-section {
          margin-bottom: 32px;
        }

        .reg-section-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
          padding-bottom: 12px;
          border-bottom: 1.5px solid #E8F5E9;
        }

        .reg-section-icon {
          width: 34px;
          height: 34px;
          background: #E8F5E9;
          border: 1.5px solid #C8E6C9;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .reg-section-title {
          font-family: 'Nunito', sans-serif;
          font-weight: 800;
          font-size: 1rem;
          color: #1A3A1A;
        }

        .reg-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 16px;
        }

        .reg-field label {
          display: block;
          font-size: 0.8rem;
          font-weight: 700;
          color: #5A7A5A;
          margin-bottom: 6px;
        }

        .reg-input {
          width: 100%;
          padding: 11px 14px;
          border-radius: 12px;
          border: 1.5px solid #D1E9D1;
          background: #FAFFFE;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.92rem;
          color: #1A3A1A;
          outline: none;
          box-sizing: border-box;
        }

        .reg-input:focus {
          border-color: #4CAF50;
          box-shadow: 0 0 0 3px rgba(76,175,80,0.12);
          background: white;
        }

        .reg-error {
          background: #FEF2F2;
          border: 1.5px solid #FECACA;
          color: #DC2626;
          border-radius: 14px;
          padding: 13px 16px;
          font-size: 0.87rem;
          margin-bottom: 24px;
        }

        .reg-submit {
          width: 100%;
          padding: 15px;
          border-radius: 14px;
          border: none;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 1rem;
          font-weight: 800;
          cursor: pointer;
          background: linear-gradient(135deg, #4CAF50, #2E7D32);
          color: white;
          box-shadow: 0 4px 20px rgba(76,175,80,0.3);
          margin-top: 8px;
        }

        .reg-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .reg-login-hint {
          text-align: center;
          font-size: 0.88rem;
          color: #7A9A7A;
          margin-top: 22px;
        }

        .reg-login-link {
          background: none;
          border: none;
          color: #2E7D32;
          font-weight: 800;
          cursor: pointer;
        }
      `}</style>

      <main className="reg-root">
        <form onSubmit={handleSubmit} className="reg-card">
          <div className="reg-eyebrow">✨ Join StudyLK</div>

          <h1 className="reg-title">Create your student account</h1>

          <p className="reg-subtitle">
            Register to enroll in courses and access your learning materials.
          </p>

          {error && (
            <div className="reg-error">
              ⚠️ {error}
            </div>
          )}

          {SECTIONS.map(section => (
            <section key={section.title} className="reg-section">
              <div className="reg-section-header">
                <div className="reg-section-icon">{section.icon}</div>
                <div className="reg-section-title">{section.title}</div>
              </div>

              <div className="reg-grid">
                {section.fields.map(field => (
                  <div key={field.key} className="reg-field">
                    <label>{field.label}</label>
                    <input
                      className="reg-input"
                      type={field.type || 'text'}
                      placeholder={field.placeholder || ''}
                      value={form[field.key]}
                      onChange={e => set(field.key, e.target.value)}
                      required
                    />
                  </div>
                ))}
              </div>
            </section>
          ))}

          <button disabled={loading} className="reg-submit">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <div className="reg-login-hint">
            Already have an account?{' '}
            <button
              type="button"
              className="reg-login-link"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
          </div>
        </form>
      </main>
    </>
  )
}