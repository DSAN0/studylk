import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { studentVerifyEmail } from '../api/api'

export default function VerifyEmail() {
  const navigate = useNavigate()
  const savedEmail = localStorage.getItem('verifyEmail') || ''

  const [email, setEmail] = useState(savedEmail)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await studentVerifyEmail({ email, code })
      localStorage.removeItem('verifyEmail')
      navigate('/login')
    } catch (err) {
      setError(JSON.stringify(err.response?.data || 'Verification failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-bg pt-22.5 px-6 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-surface border border-white/8 rounded-2xl p-7 h-fit"
      >
        <h1 className="font-display font-bold text-2xl mb-2">Verify Email</h1>
        <p className="text-muted text-sm mb-6">
          Enter the 6-digit code sent to your email.
        </p>

        {error && (
          <div className="bg-arts/10 border border-arts/30 text-arts rounded-xl p-3 text-sm mb-4">
            {error}
          </div>
        )}

        <label className="block mb-4">
          <span className="block text-xs text-muted mb-1.5">Email</span>
          <input className="admin-input" value={email} onChange={e => setEmail(e.target.value)} />
        </label>

        <label className="block mb-4">
          <span className="block text-xs text-muted mb-1.5">Verification Code</span>
          <input className="admin-input" value={code} onChange={e => setCode(e.target.value)} />
        </label>

        <button disabled={loading} className="btn-primary w-full">
          {loading ? 'Verifying...' : 'Verify Email'}
        </button>
      </form>
    </main>
  )
}