import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../App.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false) }
  const isActive = (path) => location.pathname === path

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/detect', label: 'Detect' },
    { path: '/compare', label: 'Compare' },
    { path: '/upload', label: 'Batch Upload' },
    ...(user ? [{ path: '/dashboard', label: 'Dashboard' }] : []),
    ...(user?.role === 'admin' ? [{ path: '/admin', label: 'Admin' }] : []),
  ]

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 1000,
      background: scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: scrolled ? '1px solid rgba(99,102,241,0.12)' : '1px solid transparent',
      boxShadow: scrolled ? '0 4px 24px rgba(99,102,241,0.08)' : 'none',
      transition: 'all 0.3s ease',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 11,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
          }}>⚡</div>
          <span style={{ fontWeight: 800, fontSize: 18, color: '#1e1b4b', letterSpacing: '-0.5px' }}>
            AI Code <span style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Detector</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="desktop-nav">
          {navLinks.map(({ path, label }) => (
            <Link key={path} to={path} style={{
              padding: '7px 15px', borderRadius: 8, textDecoration: 'none',
              fontWeight: 500, fontSize: 14, transition: 'all 0.2s',
              color: isActive(path) ? '#6366f1' : '#4b5563',
              background: isActive(path) ? 'rgba(99,102,241,0.09)' : 'transparent',
            }}>{label}</Link>
          ))}
        </div>

        {/* Auth Area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {user ? (
            <>
              <div style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(99,102,241,0.08)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700 }}>
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#1e1b4b' }}>{user.name?.split(' ')[0]}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '7px 14px', fontSize: 13 }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost" style={{ padding: '7px 14px', fontSize: 13 }}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '7px 16px', fontSize: 13 }}>Sign Up</Link>
            </>
          )}
          {/* Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="hamburger-btn" style={{
            display: 'none', background: 'none', border: 'none',
            cursor: 'pointer', fontSize: 22, color: '#4b5563', padding: 4,
          }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{ background: '#fff', borderTop: '1px solid #e5e7eb', padding: '12px 20px 16px' }}>
          {navLinks.map(({ path, label }) => (
            <Link key={path} to={path} onClick={() => setMenuOpen(false)} style={{
              display: 'block', padding: '10px 14px', borderRadius: 8,
              textDecoration: 'none', fontWeight: 500, fontSize: 15, marginBottom: 4,
              color: isActive(path) ? '#6366f1' : '#4b5563',
              background: isActive(path) ? 'rgba(99,102,241,0.08)' : 'transparent',
            }}>{label}</Link>
          ))}
          {!user && (
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Sign Up</Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}
