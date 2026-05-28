import React, { useState } from 'react'
import CodeEditor from '../components/CodeEditor.jsx'
import { detectAPI } from '../services/api.js'

const LANGUAGES = ['C', 'C++', 'Java', 'Python']

export default function ComparePage() {
  const [humanCode, setHumanCode] = useState('')
  const [aiCode, setAiCode] = useState('')
  const [language, setLanguage] = useState('C++')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const handleCompare = async () => {
    if (!humanCode.trim() || !aiCode.trim()) return setError('Please paste both code samples.')
    setError(''); setLoading(true)
    try {
      const res = await detectAPI.compare({ humanCode, aiCode, language })
      setResult(res.data.comparison)
    } catch (err) {
      setError(err.response?.data?.error || 'Comparison failed. Please try again.')
    } finally { setLoading(false) }
  }

  const getColor = (s) => s >= 70 ? '#ef4444' : s >= 40 ? '#f59e0b' : '#10b981'
  const getBg = (s) => s >= 70 ? '#fee2e2' : s >= 40 ? '#fef3c7' : '#dcfce7'

  return (
    <div style={{ background: '#f8f9ff', minHeight: '80vh', padding: '48px 0' }}>
      <div className="container" style={{ maxWidth: 1080 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h1 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 800, color: '#1e1b4b', marginBottom: 10 }}>Compare Two Codes</h1>
          <p style={{ color: '#6b7280', fontSize: 16 }}>Compare human-written code vs potentially AI-generated code side by side</p>
        </div>

        <div className="card" style={{ padding: 32, marginBottom: 20 }}>
          <div className="form-group" style={{ maxWidth: 280 }}>
            <label className="form-label">Programming Language:</label>
            <select value={language} onChange={e => setLanguage(e.target.value)}>
              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div>
              <label className="form-label">Original Human Code:</label>
              <CodeEditor value={humanCode} onChange={setHumanCode} language={language.toLowerCase().replace('++', 'pp')} placeholder="Paste the original human-written code here ..." height={320} />
            </div>
            <div>
              <label className="form-label">Potentially AI-Generated Code:</label>
              <CodeEditor value={aiCode} onChange={setAiCode} language={language.toLowerCase().replace('++', 'pp')} placeholder="Paste the potentially AI-generated code here ..." height={320} />
            </div>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <button onClick={handleCompare} disabled={loading || !humanCode.trim() || !aiCode.trim()} className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '15px', fontSize: 17 }}>
            {loading ? <><div className="loading-spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />Comparing...</> : '⚖️ Compare & Detect AI Code'}
          </button>
        </div>

        {result && (
          <div style={{ animation: 'fadeUp 0.6s ease' }}>
            {/* Verdict */}
            <div className="card" style={{ marginBottom: 20, textAlign: 'center', padding: 32 }}>
              <h2 style={{ fontWeight: 800, fontSize: 20, marginBottom: 12, color: '#1e1b4b' }}>Comparison Result</h2>
              <p style={{ fontSize: 17, color: '#4b5563', lineHeight: 1.7, maxWidth: 660, margin: '0 auto 24px' }}>{result.verdict}</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
                {[['Code A — AI Probability', result.codeAScore], ['Similarity', result.similarity, '#6366f1', '#eef2ff'], ['Code B — AI Probability', result.codeBScore]].map(([label, val, col, bg], i) => (
                  <div key={i} style={{ padding: '14px 24px', borderRadius: 12, background: bg || getBg(val), textAlign: 'center' }}>
                    <div style={{ fontSize: 34, fontWeight: 900, color: col || getColor(val) }}>{val}%</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: col || getColor(val), marginTop: 3 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Diff table */}
            {result.differences && result.differences.length > 0 && (
              <div className="card" style={{ padding: 28 }}>
                <h3 style={{ fontWeight: 700, marginBottom: 18, fontSize: 17 }}>Detailed Comparison</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'rgba(99,102,241,0.06)' }}>
                        {['Aspect', 'Code A (Human)', 'Code B (AI)'].map((h, i) => (
                          <th key={h} style={{ padding: '11px 15px', textAlign: 'left', fontSize: 13, fontWeight: 700, color: i === 0 ? '#6366f1' : i === 1 ? '#10b981' : '#ef4444', borderBottom: '2px solid rgba(99,102,241,0.12)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.differences.map((diff, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #f3f4f6', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                          <td style={{ padding: '12px 15px', fontWeight: 700, fontSize: 13, color: '#4b5563', whiteSpace: 'nowrap' }}>{diff.aspect}</td>
                          <td style={{ padding: '12px 15px', fontSize: 13, color: '#4b5563', lineHeight: 1.6 }}>{diff.codeA}</td>
                          <td style={{ padding: '12px 15px', fontSize: 13, color: '#4b5563', lineHeight: 1.6 }}>{diff.codeB}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`@media(max-width:700px){.grid-2{grid-template-columns:1fr !important}}`}</style>
    </div>
  )
}
