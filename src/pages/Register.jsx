import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
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
    setForm(prev => ({
      ...prev,
      [field]: value,
    }))
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
      await studentRegister(form)

      localStorage.setItem('verifyEmail', form.email)
      navigate('/verify-email')
    } catch (err) {
      const data = err.response?.data

      if (typeof data === 'object') {
        const firstError = Object.values(data)[0]

        if (Array.isArray(firstError)) {
          setError(firstError[0])
        } else if (typeof firstError === 'string') {
          setError(firstError)
        } else {
          setError(JSON.stringify(data))
        }
      } else {
        setError('Registration failed.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
        }

        .reg-root {
          min-height: 100vh;
          background:
            radial-gradient(circle at top right, rgba(76,175,80,0.08), transparent 30%),
            radial-gradient(circle at bottom left, rgba(59,130,246,0.08), transparent 30%),
            linear-gradient(160deg, #F0FAF0 0%, #FAFFFE 50%, #F5F9FF 100%);
          padding: 100px 20px 60px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #1A3A1A;
        }

        .reg-card {
          max-width: 760px;
          margin: 0 auto;
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(16px);
          border: 1.5px solid rgba(200,230,201,0.9);
          border-radius: 30px;
          padding: 44px;
          box-shadow:
            0 10px 40px rgba(76,175,80,0.10),
            0 2px 10px rgba(0,0,0,0.04);
          animation: fadeUp 0.45s ease;
        }

        @media (max-width: 700px) {
          .reg-card {
            padding: 28px 20px 36px;
          }
        }

        .reg-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #E8F5E9;
          color: #2E7D32;
          border: 1.5px solid #A5D6A7;
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .reg-title {
          font-family: 'Nunito', sans-serif;
          font-size: clamp(2rem, 4vw, 2.8rem);
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 10px;
          color: #163316;
          letter-spacing: -0.03em;
        }

        .reg-subtitle {
          color: #5A7A5A;
          line-height: 1.7;
          font-size: 0.95rem;
          margin-bottom: 34px;
          max-width: 580px;
        }

        .reg-section {
          margin-bottom: 34px;
        }

        .reg-section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
          padding-bottom: 12px;
          border-bottom: 1px solid #E8F5E9;
        }

        .reg-section-icon {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: #F0FAF0;
          border: 1.5px solid #C8E6C9;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
        }

        .reg-section-title {
          font-weight: 800;
          font-size: 1rem;
          color: #1A3A1A;
        }

        .reg-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
        }

        .reg-field label {
          display: block;
          font-size: 0.8rem;
          font-weight: 700;
          color: #567056;
          margin-bottom: 7px;
        }

        .reg-input {
          width: 100%;
          padding: 13px 14px;
          border-radius: 14px;
          border: 1.5px solid #D6EED6;
          background: rgba(250,255,254,0.9);
          font-size: 0.93rem;
          color: #1A3A1A;
          outline: none;
          transition: 0.18s ease;
          font-family: inherit;
        }

        .reg-input:focus {
          border-color: #4CAF50;
          box-shadow: 0 0 0 4px rgba(76,175,80,0.12);
          background: white;
        }

        .reg-input::placeholder {
          color: #A8C4A8;
        }

        .reg-error {
          background: #FEF2F2;
          color: #DC2626;
          border: 1px solid #FECACA;
          padding: 13px 14px;
          border-radius: 14px;
          margin-bottom: 18px;
          font-size: 0.88rem;
          font-weight: 600;
        }

        .reg-submit {
          width: 100%;
          border: none;
          border-radius: 16px;
          padding: 15px 18px;
          background: linear-gradient(135deg, #4CAF50, #2E7D32);
          color: white;
          font-weight: 800;
          font-size: 0.96rem;
          cursor: pointer;
          transition: 0.2s ease;
          box-shadow: 0 10px 30px rgba(76,175,80,0.25);
        }

        .reg-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 34px rgba(76,175,80,0.32);
        }

        .reg-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .reg-footer {
          text-align: center;
          margin-top: 22px;
          color: #6B7E6B;
          font-size: 0.9rem;
        }

        .reg-footer a {
          color: #2E7D32;
          text-decoration: none;
          font-weight: 700;
        }

        .reg-footer a:hover {
          text-decoration: underline;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <main className="reg-root">
        <div className="reg-card">
          <div className="reg-eyebrow">
            🎓 Student Registration
          </div>

          <h1 className="reg-title">
            Create your StudyLK account
          </h1>

          <p className="reg-subtitle">
            Join StudyLK and verify your email to access your enrolled courses,
            notes, papers, daily questions and more.
          </p>

          {error && (
            <div className="reg-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {SECTIONS.map(section => (
              <div className="reg-section" key={section.title}>
                <div className="reg-section-header">
                  <div className="reg-section-icon">
                    {section.icon}
                  </div>

                  <div className="reg-section-title">
                    {section.title}
                  </div>
                </div>

                <div className="reg-grid">
                  {section.fields.map(field => (
                    <div className="reg-field" key={field.key}>
                      <label>
                        {field.label}
                      </label>

                      <input
                        type={field.type || 'text'}
                        className="reg-input"
                        placeholder={field.placeholder || ''}
                        value={form[field.key]}
                        onChange={e => set(field.key, e.target.value)}
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button
              type="submit"
              className="reg-submit"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="reg-footer">
            Already have an account?{' '}
            <Link to="/login">
              Login
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}