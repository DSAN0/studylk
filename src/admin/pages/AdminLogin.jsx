import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin } from '../../api/api'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await adminLogin(form)
      localStorage.setItem('adminAccessToken', res.data.access)
      localStorage.setItem('adminRefreshToken', res.data.refresh)
      localStorage.setItem('adminUser', JSON.stringify(res.data.user))
      navigate('/admin/dashboard')
    } catch (err) {
      console.error(err.response?.data || err.message)
      alert(JSON.stringify(err.response?.data || err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-bg pt-[68px] flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-surface border border-white/[0.08] rounded-2xl p-8">
        <h1 className="font-display font-bold text-2xl mb-2">Admin Login</h1>
        <p className="text-muted text-sm mb-6">Login using your Django superuser account.</p>
        {error && <div className="bg-arts/10 border border-arts/30 text-arts rounded-xl p-3 text-sm mb-4">{error}</div>}
        <label className="block text-xs text-muted mb-1">Username</label>
        <input className="w-full bg-surface2 border border-white/10 rounded-xl px-4 py-3 mb-4 text-white" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
        <label className="block text-xs text-muted mb-1">Password</label>
        <input type="password" className="w-full bg-surface2 border border-white/10 rounded-xl px-4 py-3 mb-6 text-white" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        <button disabled={loading} className="btn-primary w-full">{loading ? 'Logging in...' : 'Login'}</button>
      </form>
    </main>
  )
}
