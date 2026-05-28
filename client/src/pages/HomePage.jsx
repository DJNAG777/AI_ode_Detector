import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const FEATURES = [
  { icon: '⚡', title: 'Fast Analysis', desc: 'Analyze code in seconds using parallel AST parsing and Gemini AI — far faster than manual review.' },
  { icon: '🎯', title: 'Accurate Detection', desc: 'Dual-engine approach combines structural AST heuristics with Gemini language understanding.' },
  { icon: '🔒', title: 'Secure Detection', desc: 'Code is never stored without consent. Encrypted analysis with optional guest mode.' },
  { icon: '🌐', title: 'Multi-Language', desc: 'Deep support for C, C++, Java, and Python with language-specific AST parsers.' },
  { icon: '🌳', title: 'AST Analysis', desc: 'Examines identifier entropy, nesting variance, comment ratios, and repetition patterns.' },
  { icon: '🤖', title: 'Gemini AI', desc: 'Google Gemini 1.5 Flash evaluates naming conventions, business logic, and coding personality.' },
]

const STEPS = [
  { num: '01', title: 'Enter or Upload Code', desc: 'Paste code directly, drag-drop a file, or upload a ZIP with multiple source files.' },
  { num: '02', title: 'Click Analyze', desc: 'AST engine and Gemini AI run in parallel. Combined weighted score in under 3 seconds.' },
  { num: '03', title: 'View Full Report', desc: 'Score breakdown, factor analysis, radar chart, and downloadable PDF report.' },
]

const TESTIMONIALS = [
  { name: 'Kaushal', role: 'Software Engineer Payzoll', text: 'Finally a tool that actually works. Caught 12 AI-generated submissions with detailed per-factor reports.', avatar: 'K' },
  { name: 'Pushpendra Dangi', role: 'Software Engineer', text: 'We integrated it into our code review pipeline. Flags suspicious PRs automatically. The AST engine is impressive.', avatar: 'P' },
  { name: 'Rahul Singh', role: 'Software Engineer Amazon', text: 'The comparison view is outstanding. Side-by-side evidence is undeniable in academic review.', avatar: 'R' },
]

function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(); const started = useRef(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        let v = 0; const step = target / 55
        const t = setInterval(() => { v += step; if (v >= target) { setCount(target); clearInterval(t) } else setCount(Math.floor(v)) }, 18)
      }
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target])
  return <span ref={ref}>{count}{suffix}</span>
}

export default function HomePage() {
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)' } })
    }, { threshold: 0.08 })
    document.querySelectorAll('.reveal').forEach(el => {
      el.style.opacity = '0'; el.style.transform = 'translateY(36px)'
      el.style.transition = 'opacity 0.65s ease, transform 0.65s ease'; obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  return (
    <div>
      {/* ── HERO ── */}
      <section style={{ background: 'linear-gradient(160deg,#0f0c29 0%,#1a1a4e 45%,#24243e 100%)', padding: '110px 0 90px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -120, right: -80, width: 580, height: 580, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.22) 0%,transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -100, left: -60, width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,92,246,0.18) 0%,transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(99,102,241,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.04) 1px,transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 18px', borderRadius: 999, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', marginBottom: 28 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#c7d2fe', letterSpacing: 1 }}>POWERED BY GOOGLE GEMINI AI + AST ENGINE</span>
          </div>

          <h1 style={{ fontSize: 'clamp(38px,6.5vw,74px)', fontWeight: 900, lineHeight: 1.06, color: '#fff', marginBottom: 22, letterSpacing: '-2px' }}>
            Detect{' '}
            <span style={{ background: 'linear-gradient(135deg,#818cf8,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>AI-Generated</span>
            <br />Code Instantly
          </h1>

          <p style={{ fontSize: 'clamp(16px,2vw,20px)', color: 'rgba(199,210,254,0.75)', maxWidth: 540, margin: '0 auto 44px', lineHeight: 1.75 }}>
            Paste any C, C++, Java, or Python code and get a detailed AI vs Human analysis in seconds — powered by AST + Gemini.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center', marginBottom: 72 }}>
            {[
              { to: '/detect', label: '🔍 Detect Code Free', primary: true },
              { to: '/compare', label: '⚖️ Compare Codes', primary: false },
              { to: '/upload', label: '📁 Batch Upload', primary: false },
            ].map(({ to, label, primary }) => (
              <Link key={to} to={to} style={{
                background: primary ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'rgba(255,255,255,0.09)',
                color: primary ? '#fff' : '#c7d2fe',
                padding: '14px 30px', borderRadius: 11, fontWeight: 700, fontSize: 16,
                textDecoration: 'none', border: primary ? 'none' : '1px solid rgba(255,255,255,0.15)',
                boxShadow: primary ? '0 0 36px rgba(99,102,241,0.5)' : 'none',
                transition: 'all 0.3s', display: 'inline-flex', alignItems: 'center', gap: 8,
                backdropFilter: primary ? 'none' : 'blur(10px)',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; if (primary) e.currentTarget.style.boxShadow = '0 0 56px rgba(99,102,241,0.7)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; if (primary) e.currentTarget.style.boxShadow = '0 0 36px rgba(99,102,241,0.5)' }}
              >{label}</Link>
            ))}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 52 }}>
            {[['95', '%', 'Detection Accuracy'], ['3', 's', 'Avg Analysis Time'], ['4', '+', 'Languages'], ['0', '', 'Cost to Try']].map(([n, s, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 40, fontWeight: 900, color: '#818cf8', letterSpacing: '-1px' }}><Counter target={parseInt(n)} suffix={s} /></div>
                <div style={{ fontSize: 12, color: 'rgba(199,210,254,0.55)', fontWeight: 500, marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, overflow: 'hidden', lineHeight: 0 }}>
          <svg viewBox="0 0 1440 70" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: '100%', display: 'block' }}>
            <path d="M0 70L48 60C96 50 192 32 288 28C384 23 480 32 576 42C672 51 768 60 864 60C960 60 1056 51 1152 42C1248 32 1344 23 1392 19L1440 14V70H0Z" fill="#f8f9ff" />
          </svg>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ background: '#f8f9ff', padding: '90px 0' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', letterSpacing: 3, marginBottom: 10, textTransform: 'uppercase' }}>Simple Process</div>
            <h2 style={{ fontSize: 'clamp(26px,3.5vw,40px)', fontWeight: 800, color: '#1e1b4b', marginBottom: 14 }}>How to Use Our Code Detector</h2>
            <p style={{ color: '#6b7280', fontSize: 17 }}>Three steps to know if code was written by AI or a human</p>
          </div>
          <div className="grid-3">
            {STEPS.map((s, i) => (
              <div key={i} className="reveal card" style={{ padding: 32, textAlign: 'center', position: 'relative', overflow: 'hidden', cursor: 'default', transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 56px rgba(99,102,241,0.15)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
                <div style={{ position: 'absolute', top: -10, right: -8, fontSize: 96, fontWeight: 900, color: 'rgba(99,102,241,0.05)', lineHeight: 1, userSelect: 'none' }}>{s.num}</div>
                <div style={{ width: 60, height: 60, borderRadius: 16, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', fontSize: 20, color: '#fff', fontWeight: 800, boxShadow: '0 8px 22px rgba(99,102,241,0.4)' }}>{s.num}</div>
                <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 10, color: '#1e1b4b' }}>{s.title}</h3>
                <p style={{ color: '#6b7280', lineHeight: 1.7, fontSize: 14 }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="reveal" style={{ textAlign: 'center', marginTop: 44 }}>
            <Link to="/detect" className="btn btn-primary" style={{ fontSize: 16, padding: '14px 34px' }}>🚀 Start Analyzing Now</Link>
          </div>
        </div>
      </section>

      {/* ── WHY USE ── */}
      <section style={{ background: 'linear-gradient(160deg,#1e1b4b 0%,#312e81 100%)', padding: '90px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%,rgba(99,102,241,0.15) 0%,transparent 50%),radial-gradient(circle at 80% 50%,rgba(139,92,246,0.12) 0%,transparent 50%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(360px,1fr))', gap: 56, alignItems: 'center' }}>
            <div>
              <div className="reveal">
                <div style={{ fontSize: 11, fontWeight: 700, color: '#818cf8', letterSpacing: 3, marginBottom: 10, textTransform: 'uppercase' }}>Why Choose Us</div>
                <h2 style={{ fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 800, color: '#fff', marginBottom: 28, lineHeight: 1.2 }}>Why use AI Code Detectors?</h2>
              </div>
              {[
                { icon: '🎓', title: 'Academic Integrity', desc: 'Identify AI submissions with solid evidence. Per-factor breakdowns hold up in academic review.' },
                { icon: '⚙️', title: 'Development Efficiency', desc: 'Flag suspicious PRs before code review, saving hours of manual analysis time.' },
                { icon: '🔐', title: 'Code Security', desc: 'AI-generated code often skips edge cases. Identify code that needs closer security review.' },
              ].map((item, i) => (
                <div key={i} className="reveal" style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 22 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, minWidth: 44 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#c7d2fe', fontSize: 15, marginBottom: 5 }}>{item.title}</div>
                    <div style={{ color: 'rgba(199,210,254,0.6)', fontSize: 13, lineHeight: 1.7 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="reveal" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[['< 3s', 'per file', 'Speed'], ['8+', 'metrics', 'AST Depth'], ['4', 'languages', 'Coverage'], ['95%', 'accuracy', 'Precision']].map(([v, s, l], i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 14, padding: 24, border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', textAlign: 'center' }}>
                  <div style={{ fontSize: 32, fontWeight: 900, color: '#818cf8', lineHeight: 1 }}>{v}</div>
                  <div style={{ fontSize: 11, color: 'rgba(199,210,254,0.4)', marginTop: 3 }}>{s}</div>
                  <div style={{ fontSize: 13, color: '#c7d2fe', fontWeight: 600, marginTop: 7 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ background: '#f8f9ff', padding: '90px 0' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', letterSpacing: 3, marginBottom: 10, textTransform: 'uppercase' }}>Platform Advantages</div>
            <h2 style={{ fontSize: 'clamp(26px,3.5vw,40px)', fontWeight: 800, color: '#1e1b4b' }}>Advantages of AI Code Detector</h2>
          </div>
          <div className="grid-3">
            {FEATURES.map((f, i) => (
              <div key={i} className="reveal card" style={{ padding: 30, transition: 'all 0.3s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 56px rgba(99,102,241,0.13)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(99,102,241,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 18 }}>{f.icon}</div>
                <h3 style={{ fontWeight: 800, fontSize: 17, marginBottom: 10, color: '#1e1b4b' }}>{f.title}</h3>
                <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.75 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LANGUAGES ── */}
      <section style={{ background: '#fff', padding: '72px 0' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 800, color: '#1e1b4b', marginBottom: 10 }}>Multi-Language Detection</h2>
            <p style={{ color: '#6b7280', fontSize: 16 }}>Specialized parsers and Gemini prompts for each language</p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 18 }}>
            {[{ name: 'C', icon: '©', desc: 'ANSI C struct & pointer analysis' }, { name: 'C++', icon: '⊕', desc: 'OOP, templates & STL patterns' }, { name: 'Java', icon: '☕', desc: 'Class hierarchy & JVM patterns' }, { name: 'Python', icon: '🐍', desc: 'PEP8 & duck typing analysis' }].map(lang => (
              <div key={lang.name} className="reveal card" style={{ textAlign: 'center', width: 200, padding: '28px 20px', transition: 'all 0.3s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(99,102,241,0.12)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
                <div style={{ fontSize: 42, marginBottom: 10 }}>{lang.icon}</div>
                <div style={{ fontWeight: 800, fontSize: 20, color: '#1e1b4b', marginBottom: 6 }}>{lang.name}</div>
                <div style={{ fontSize: 12, color: '#9ca3af', lineHeight: 1.5 }}>{lang.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ background: 'linear-gradient(135deg,#f8f9ff,#eef2ff)', padding: '90px 0' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', letterSpacing: 3, marginBottom: 10, textTransform: 'uppercase' }}>User Stories</div>
            <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 800, color: '#1e1b4b' }}>Trusted by Educators & Engineers</h2>
          </div>
          <div className="grid-3">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="reveal card" style={{ padding: 28, transition: 'all 0.3s', cursor: 'default' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = ''}>
                <div style={{ fontSize: 44, color: '#e0e7ff', marginBottom: 6, lineHeight: 1, fontFamily: 'Georgia,serif' }}>"</div>
                <p style={{ color: '#4b5563', lineHeight: 1.8, fontSize: 14, marginBottom: 22 }}>{t.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 17, minWidth: 42 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#1e1b4b' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: '#9ca3af' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', padding: '90px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 30% 50%,rgba(255,255,255,0.08) 0%,transparent 50%)', pointerEvents: 'none' }} />
        <div className="container" style={{ textAlign: 'center', position: 'relative' }}>
          <h2 className="reveal" style={{ fontSize: 'clamp(26px,4.5vw,50px)', fontWeight: 900, color: '#fff', marginBottom: 14, letterSpacing: '-1px' }}>Ready to Detect AI Code?</h2>
          <p className="reveal" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 18, maxWidth: 500, margin: '0 auto 44px', lineHeight: 1.7 }}>
            No sign-up needed. Start analyzing code instantly — free forever for basic detection.
          </p>
          <div className="reveal" style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
            <Link to="/detect" style={{ background: '#fff', color: '#6366f1', padding: '15px 38px', borderRadius: 11, fontWeight: 800, fontSize: 16, textDecoration: 'none', boxShadow: '0 8px 28px rgba(0,0,0,0.18)', transition: 'all 0.3s', display: 'inline-flex', alignItems: 'center', gap: 8 }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform = ''}>🔍 Start Detecting Free</Link>
            <Link to="/register" style={{ background: 'rgba(255,255,255,0.14)', color: '#fff', padding: '15px 34px', borderRadius: 11, fontWeight: 700, fontSize: 16, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)', transition: 'all 0.3s', display: 'inline-flex', alignItems: 'center', gap: 8 }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.24)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}>Create Free Account →</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
