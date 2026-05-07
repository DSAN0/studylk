import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [student, setStudent] = useState(null)

  const { buildWhatsAppLink } = useApp()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    const saved = localStorage.getItem('studentUser')
    setStudent(saved ? JSON.parse(saved) : null)
  }, [location])

  function logout() {
    localStorage.removeItem('studentToken')
    localStorage.removeItem('studentUser')
    setStudent(null)
    navigate('/login')
  }

  const isActive = (to) => location.pathname === to

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .navbar-root {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 50;
          height: 68px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: background 0.3s, box-shadow 0.3s, border-color 0.3s;
        }
        .navbar-root.scrolled {
          background: rgba(248, 251, 248, 0.92);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-bottom: 1.5px solid #C8E6C9;
          box-shadow: 0 2px 20px rgba(76,175,80,0.08);
        }
        .navbar-root.top {
          background: rgba(240, 250, 240, 0.6);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        .navbar-inner {
          max-width: 1280px;
          margin: 0 auto;
          height: 100%;
          padding: 0 24px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .navbar-logo {
          font-family: 'Nunito', sans-serif;
          font-weight: 900;
          font-size: 1.5rem;
          color: #2E7D32;
          text-decoration: none;
          flex-shrink: 0;
          letter-spacing: -0.02em;
          margin-right: 8px;
        }
        .navbar-logo span {
          color: #1A3A1A;
        }

        .navbar-links {
          display: flex;
          align-items: center;
          gap: 2px;
          margin-left: auto;
        }

        .nav-link {
          font-size: 0.9rem;
          font-weight: 600;
          padding: 7px 14px;
          border-radius: 50px;
          text-decoration: none;
          color: #5A7A5A;
          border: none;
          background: none;
          cursor: pointer;
          transition: color 0.18s, background 0.18s;
          white-space: nowrap;
        }
        .nav-link:hover {
          color: #2E7D32;
          background: #E8F5E9;
        }
        .nav-link.active {
          color: #2E7D32;
          background: #E8F5E9;
          font-weight: 700;
        }

        .nav-btn-register {
          font-size: 0.88rem;
          font-weight: 700;
          padding: 8px 20px;
          border-radius: 50px;
          background: linear-gradient(135deg, #4CAF50, #2E7D32);
          color: white;
          text-decoration: none;
          border: none;
          cursor: pointer;
          box-shadow: 0 3px 14px rgba(76,175,80,0.3);
          transition: transform 0.18s, box-shadow 0.18s;
          white-space: nowrap;
        }
        .nav-btn-register:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(76,175,80,0.4);
        }

        .nav-btn-whatsapp {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 0.88rem;
          font-weight: 700;
          padding: 8px 18px;
          border-radius: 50px;
          background: #25D366;
          color: white;
          text-decoration: none;
          box-shadow: 0 3px 14px rgba(37,211,102,0.28);
          transition: transform 0.18s, box-shadow 0.18s;
          white-space: nowrap;
          margin-left: 8px;
        }
        .nav-btn-whatsapp:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(37,211,102,0.38);
        }

        /* Hamburger */
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          padding: 6px;
          background: none;
          border: none;
          cursor: pointer;
          margin-left: auto;
        }
        .hamburger span {
          display: block;
          width: 22px;
          height: 2.5px;
          background: #2E7D32;
          border-radius: 2px;
          transition: transform 0.2s, opacity 0.2s;
        }
        .hamburger.open span:nth-child(1) { transform: translateY(7.5px) rotate(45deg); }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:nth-child(3) { transform: translateY(-7.5px) rotate(-45deg); }

        /* Mobile menu */
        .mobile-menu {
          position: fixed;
          top: 68px; left: 0; right: 0;
          background: rgba(248, 251, 248, 0.97);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-bottom: 1.5px solid #C8E6C9;
          box-shadow: 0 8px 30px rgba(76,175,80,0.1);
          padding: 12px 20px 20px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          z-index: 49;
        }
        .mobile-link {
          font-size: 0.95rem;
          font-weight: 600;
          color: #5A7A5A;
          text-decoration: none;
          padding: 11px 16px;
          border-radius: 12px;
          border: none;
          background: none;
          cursor: pointer;
          text-align: left;
          transition: color 0.18s, background 0.18s;
        }
        .mobile-link:hover, .mobile-link.active {
          color: #2E7D32;
          background: #E8F5E9;
        }
        .mobile-divider {
          height: 1px;
          background: #E8F5E9;
          margin: 8px 0;
        }
        .mobile-wa {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.95rem;
          font-weight: 700;
          color: white;
          background: #25D366;
          text-decoration: none;
          padding: 11px 16px;
          border-radius: 12px;
          margin-top: 4px;
        }

        @media (max-width: 767px) {
          .navbar-links { display: none; }
          .nav-btn-whatsapp { display: none; }
          .hamburger { display: flex; }
        }
        @media (min-width: 768px) {
          .mobile-menu { display: none !important; }
        }
      `}</style>

      <nav className={`navbar-root ${scrolled ? 'scrolled' : 'top'}`}>
        <div className="navbar-inner">

          {/* Logo */}
          <Link to="/" className="navbar-logo">
            Study<span>LK</span>
          </Link>

          {/* Desktop links */}
          <div className="navbar-links">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
            <Link to="/streams" className={`nav-link ${isActive('/streams') ? 'active' : ''}`}>Browse</Link>

            {student ? (
              <>
                <Link to="/my-courses" className={`nav-link ${isActive('/my-courses') ? 'active' : ''}`}>
                  My Courses
                </Link>
                <button onClick={logout} className="nav-link">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className={`nav-link ${isActive('/login') ? 'active' : ''}`}>Login</Link>
                <Link to="/register" className="nav-btn-register">Register</Link>
              </>
            )}
          </div>

          {/* WhatsApp CTA — desktop */}
          <a
            href={buildWhatsAppLink('Hi! I need help finding study materials.')}
            target="_blank"
            rel="noreferrer"
            className="nav-btn-whatsapp"
          >
            <WhatsAppIcon />
            Contact us
          </a>

          {/* Hamburger — mobile */}
          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/" className={`mobile-link ${isActive('/') ? 'active' : ''}`}>🏠 Home</Link>
          <Link to="/streams" className={`mobile-link ${isActive('/streams') ? 'active' : ''}`}>📚 Browse</Link>

          {student ? (
            <>
              <Link to="/my-courses" className={`mobile-link ${isActive('/my-courses') ? 'active' : ''}`}>
                🎓 My Courses
              </Link>
              <div className="mobile-divider" />
              <button onClick={logout} className="mobile-link">👋 Logout</button>
            </>
          ) : (
            <>
              <div className="mobile-divider" />
              <Link to="/login" className={`mobile-link ${isActive('/login') ? 'active' : ''}`}>🔑 Login</Link>
              <Link to="/register" className="mobile-link" style={{ color: '#2E7D32', fontWeight: 700 }}>
                ✨ Register
              </Link>
            </>
          )}

          <div className="mobile-divider" />
          <a
            href={buildWhatsAppLink('Hi! I need help finding study materials.')}
            target="_blank"
            rel="noreferrer"
            className="mobile-wa"
          >
            <WhatsAppIcon />
            Contact us on WhatsApp
          </a>
        </div>
      )}
    </>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}