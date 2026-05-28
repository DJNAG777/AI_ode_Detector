import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../App.jsx'
import { authAPI } from '../services/api.js'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) return setError('All fields are required.')
    setError(''); setLoading(true)
    try {
      const res = await authAPI.login(form)
      login(res.data.user, res.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#f8f9ff,#eef2ff)', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div className="card" style={{ padding: 36 }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, margin: '0 auto 14px', boxShadow: '0 8px 22px rgba(99,102,241,0.35)' }}>⚡</div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1e1b4b' }}>Welcome Back</h1>
            <p style={{ color: '#6b7280', marginTop: 6, fontSize: 14 }}>Sign in to access your dashboard</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 15, marginTop: 4 }}>
              {loading ? <><div className="loading-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />Signing in...</> : '🔐 Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20, color: '#6b7280', fontSize: 14 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#6366f1', fontWeight: 700, textDecoration: 'none' }}>Sign Up Free</Link>
          </div>

          <div style={{ marginTop: 20, padding: 14, background: 'rgba(99,102,241,0.05)', borderRadius: 10, fontSize: 12, color: '#6b7280', lineHeight: 1.8 }}>
            <strong>Demo Admin:</strong> admin@demo.com / admin123<br />
            <strong>Demo User:</strong> user@demo.com / user123<br />
            <span style={{ fontSize: 11, color: '#9ca3af' }}>Run <code>npm run seed</code> in /server first</span>
          </div>
        </div>
      </div>
    </div>
  )
}
