import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { studentGoogleAuth } from '../api/api'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

export default function GoogleAuthButton({ text = 'signin_with', label = 'Continue with Google', onError, onSuccess }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState('')

  async function handleCredentialResponse(response) {
    if (!response?.credential) {
      const msg = 'Google authentication failed (no credential received).'
      setAuthError(msg)
      if (onError) onError(msg)
      return
    }

    setLoading(true)
    setAuthError('')

    try {
      const res = await studentGoogleAuth(response.credential)
      localStorage.setItem('studentAccessToken', res.data.access)
      localStorage.setItem('studentRefreshToken', res.data.refresh)
      localStorage.setItem('studentUser', JSON.stringify(res.data.student))

      if (onSuccess) {
        onSuccess(res.data)
      } else {
        navigate('/my-account')
      }
    } catch (err) {
      console.error('Google Auth backend error:', err)
      const data = err.response?.data
      const msg = data?.detail || 'Google sign-in failed. Please try again.'
      setAuthError(msg)
      if (onError) onError(msg)
    } finally {
      setLoading(false)
    }
  }

  function handleGoogleError() {
    const msg = 'Google sign-in popup was closed or encountered an error.'
    setAuthError(msg)
    if (onError) onError(msg)
  }

  return (
    <div className="google-auth-container" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {authError && (
        <div style={{
          width: '100%',
          background: '#FEF2F2',
          border: '1.5px solid #FECACA',
          color: '#DC2626',
          borderRadius: 12,
          padding: '10px 14px',
          fontSize: '0.84rem',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxSizing: 'border-box',
        }}>
          <span>⚠️</span>
          <span>{authError}</span>
        </div>
      )}

      {loading ? (
        <div style={{
          width: '100%',
          padding: '12px',
          borderRadius: '12px',
          border: '1.5px solid #D1E9D1',
          background: '#FAFFFE',
          color: '#2E7D32',
          fontSize: '0.9rem',
          fontWeight: '700',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}>
          <span className="google-spinner">⏳</span> Authenticating with Google…
        </div>
      ) : GOOGLE_CLIENT_ID ? (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin
            onSuccess={handleCredentialResponse}
            onError={handleGoogleError}
            text={text}
            shape="pill"
            theme="outline"
            size="large"
            width="100%"
            useOneTap={false}
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            alert(
              'Google Sign-In is configured on the backend!\n\nTo enable the Google popup button on the frontend, please add your Google OAuth Client ID to studylk/.env:\n\nVITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com'
            )
          }}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '11px 18px',
            borderRadius: '50px',
            border: '1.5px solid #D1E9D1',
            background: 'white',
            color: '#2D3748',
            fontSize: '0.92rem',
            fontWeight: '700',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#4CAF50'
            e.currentTarget.style.background = '#F9FDF9'
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(76,175,80,0.12)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#D1E9D1'
            e.currentTarget.style.background = 'white'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.04)'
          }}
        >
          {/* Google SVG icon */}
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>{label}</span>
        </button>
      )}
    </div>
  )
}
