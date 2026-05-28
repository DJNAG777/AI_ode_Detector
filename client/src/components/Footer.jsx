import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ background: '#1e1b4b', color: '#c7d2fe', padding: '56px 0 28px', marginTop: 'auto' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 36, marginBottom: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⚡</div>
              <span style={{ fontWeight: 800, fontSize: 16, color: '#fff' }}>AI Code Detector</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, opacity: 0.6, maxWidth: 220 }}>
              Intelligent code analysis platform powered by Google Gemini AI and AST analysis.
            </p>
          </div>
          <div>
            <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: 14, fontSize: 14 }}>Features</h4>
            {[['/', 'Single Detection'], ['/compare', 'Code Compare'], ['/upload', 'Batch Upload'], ['/dashboard', 'Dashboard']].map(([path, label]) => (
              <Link key={path} to={path} style={{ display: 'block', color: '#c7d2fe', textDecoration: 'none', fontSize: 13, opacity: 0.65, marginBottom: 8, transition: 'opacity 0.2s' }}
                onMouseEnter={e => e.target.style.opacity = 1} onMouseLeave={e => e.target.style.opacity = 0.65}
              >{label}</Link>
            ))}
          </div>
          <div>
            <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: 14, fontSize: 14 }}>Languages</h4>
            {['C Language', 'C++', 'Java', 'Python'].map(l => (
              <div key={l} style={{ fontSize: 13, opacity: 0.65, marginBottom: 8 }}>{l}</div>
            ))}
          </div>
          <div>
            <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: 14, fontSize: 14 }}>Technology</h4>
            {['Google Gemini AI', 'AST Analysis', 'MERN Stack', 'JWT Auth', 'Vite + React'].map(t => (
              <div key={t} style={{ fontSize: 13, opacity: 0.65, marginBottom: 8 }}>{t}</div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: 13, opacity: 0.5 }}>© {new Date().getFullYear()} AI Code Detector. All rights reserved.</span>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy Policy', 'Terms of Service'].map(item => (
              <span key={item} style={{ fontSize: 13, opacity: 0.5, cursor: 'default' }}>{item}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
