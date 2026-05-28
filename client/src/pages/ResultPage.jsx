import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts'
import ScoreCircle from '../components/ScoreCircle.jsx'
import CodeEditor from '../components/CodeEditor.jsx'

function downloadReport(report, code, language) {
  const scoreColor = report.aiScore >= 70 ? '#ef4444' : report.aiScore >= 40 ? '#f59e0b' : '#10b981'
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>AI Detection Report</title>
  <style>
    body{font-family:Arial,sans-serif;padding:40px;color:#1e1b4b;max-width:800px;margin:0 auto}
    h1{color:#6366f1;font-size:26px;margin-bottom:4px}
    .subtitle{color:#6b7280;margin-bottom:28px;font-size:14px}
    .score-box{display:flex;align-items:center;gap:24px;background:#f8f9ff;border-radius:14px;padding:24px;margin-bottom:24px;border:1px solid #e5e7eb}
    .score-num{font-size:64px;font-weight:900;color:${scoreColor};line-height:1}
    .result-label{font-size:20px;font-weight:700;color:${scoreColor};margin-bottom:6px}
    .explanation{color:#4b5563;font-size:15px;line-height:1.7}
    .section{margin-bottom:28px}
    .section h2{font-size:17px;font-weight:700;color:#1e1b4b;border-bottom:2px solid #e5e7eb;padding-bottom:8px;margin-bottom:16px}
    .factor{background:#f9fafb;border-radius:10px;padding:14px;margin-bottom:10px;border:1px solid #f3f4f6}
    .factor-name{font-weight:700;color:#6366f1;margin-bottom:4px;font-size:14px}
    .factor-desc{color:#4b5563;font-size:13px;line-height:1.6}
    .badge{display:inline-block;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:700;background:${scoreColor}20;color:${scoreColor};margin-left:8px}
    table{width:100%;border-collapse:collapse}td,th{padding:10px 14px;border:1px solid #e5e7eb;text-align:left;font-size:14px}th{background:#f9fafb;font-weight:700}
    pre{background:#1a1a2e;color:#e2e8f0;padding:20px;border-radius:10px;font-family:monospace;font-size:12px;overflow:auto;line-height:1.6}
    @media print{body{padding:20px}.no-print{display:none}}
  </style></head><body>
  <h1>⚡ AI Code Detector — Detection Report</h1>
  <div class="subtitle">Generated: ${new Date().toLocaleString()} • Language: ${language}</div>
  <div class="score-box">
    <div class="score-num">${report.aiScore}%</div>
    <div>
      <div class="result-label">${report.result}</div>
      <div class="explanation">${report.explanation || ''}</div>
      <div style="margin-top:12px;display:flex;gap:12px;flex-wrap:wrap">
        <span style="background:#fee2e2;color:#ef4444;padding:5px 14px;border-radius:999px;font-weight:700;font-size:13px">🤖 AI: ${report.aiScore}%</span>
        <span style="background:#dcfce7;color:#10b981;padding:5px 14px;border-radius:999px;font-weight:700;font-size:13px">👤 Human: ${report.humanScore}%</span>
      </div>
    </div>
  </div>
  ${(report.factors || []).length > 0 ? `
  <div class="section">
    <h2>Detailed Factor Analysis</h2>
    ${report.factors.map(f => `
      <div class="factor">
        <div class="factor-name">${f.name} <span class="badge">${f.score}% AI</span></div>
        <div class="factor-desc">${f.description}</div>
      </div>`).join('')}
  </div>` : ''}
  ${code ? `<div class="section"><h2>Analyzed Code</h2><pre>${code.substring(0, 3000).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre></div>` : ''}
  <script>window.onload=()=>window.print()</script>
  </body></html>`

  const win = window.open('', '_blank')
  win.document.write(html)
  win.document.close()
}

export default function ResultPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [show, setShow] = useState(false)
  const { report, code, language } = location.state || {}

  useEffect(() => {
    if (!report) navigate('/detect')
    else setTimeout(() => setShow(true), 100)
  }, [report, navigate])

  if (!report) return null

  const getColor = (s) => s >= 70 ? '#ef4444' : s >= 40 ? '#f59e0b' : '#10b981'
  const getBg = (s) => s >= 70 ? '#fee2e2' : s >= 40 ? '#fef3c7' : '#dcfce7'

  const barData = [
    { name: 'AI Generated', value: report.aiScore, color: '#ef4444' },
    { name: 'Human Written', value: report.humanScore, color: '#10b981' },
  ]

  const factorData = (report.factors || []).slice(0, 6).map(f => ({
    name: f.name?.split(' ')[0] || '',
    value: f.score || 0,
  }))

  return (
    <div style={{ background: '#f8f9ff', minHeight: '80vh', padding: '44px 0' }}>
      <div className="container" style={{ maxWidth: 1080 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-block', padding: '5px 18px', borderRadius: 999, background: getBg(report.aiScore), marginBottom: 14 }}>
            <span style={{ fontWeight: 700, color: getColor(report.aiScore), fontSize: 13 }}>
              {report.aiScore >= 70 ? '⚠️' : report.aiScore >= 40 ? '⚡' : '✅'} Detection Complete
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(22px,3.5vw,34px)', fontWeight: 800, color: '#1e1b4b' }}>Detection Result</h1>
        </div>

        {/* Main result */}
        <div className="card" style={{ marginBottom: 20, padding: 32, opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease' }}>
          <div style={{ display: 'flex', gap: 36, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <ScoreCircle score={report.aiScore} size={148} label="AI Score" />
              <ScoreCircle score={report.humanScore} size={80} label="Human" color="#10b981" />
            </div>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: getColor(report.aiScore), marginBottom: 8 }}>
                Likelihood of AI Generation: {report.aiScore}%
              </div>
              <div style={{ display: 'inline-block', padding: '5px 16px', borderRadius: 999, marginBottom: 14, background: getBg(report.aiScore), fontWeight: 700, fontSize: 13, color: getColor(report.aiScore) }}>
                {report.result}
              </div>
              <p style={{ color: '#4b5563', lineHeight: 1.8, fontSize: 15, marginBottom: 20 }}>{report.explanation}</p>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                {[['AI Generated', report.aiScore + '%', '#ef4444', '#fee2e2'], ['Human Written', report.humanScore + '%', '#10b981', '#dcfce7'], [language, 'Language', '#6366f1', '#eef2ff']].map(([label, val, color, bg]) => (
                  <div key={label} style={{ padding: '10px 18px', borderRadius: 10, background: bg, textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color }}>{val}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color, marginTop: 2 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid-2" style={{ marginBottom: 20 }}>
          <div className="card" style={{ opacity: show ? 1 : 0, transition: 'all 0.8s ease 0.2s' }}>
            <h3 style={{ fontWeight: 700, marginBottom: 18, fontSize: 16 }}>AI Score Breakdown</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData} barCategoryGap="35%">
                <XAxis dataKey="name" tick={{ fontSize: 12, fontFamily: 'Space Grotesk, sans-serif' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip formatter={v => `${v}%`} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {barData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {factorData.length > 0 && (
            <div className="card" style={{ opacity: show ? 1 : 0, transition: 'all 0.8s ease 0.3s' }}>
              <h3 style={{ fontWeight: 700, marginBottom: 18, fontSize: 16 }}>Factor Analysis Radar</h3>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={factorData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <Radar name="AI Score" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Factors */}
        {report.factors && report.factors.length > 0 && (
          <div className="card" style={{ marginBottom: 20, opacity: show ? 1 : 0, transition: 'all 0.8s ease 0.4s' }}>
            <h3 style={{ fontWeight: 700, marginBottom: 18, fontSize: 18 }}>Detailed Factor Analysis</h3>
            <div className="grid-2" style={{ gap: 14 }}>
              {report.factors.map((factor, i) => (
                <div key={i} style={{ padding: 18, borderRadius: 12, background: '#f9fafb', border: '1px solid #f3f4f6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                    <span style={{ fontWeight: 700, color: '#6366f1', fontSize: 14 }}>{factor.name}:</span>
                    <span style={{ padding: '2px 9px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: getBg(factor.score), color: getColor(factor.score) }}>{factor.score}% AI</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.6, marginBottom: 8 }}>{factor.description}</p>
                  <div style={{ background: '#e5e7eb', borderRadius: 999, height: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 999, width: `${factor.score}%`, background: getColor(factor.score), transition: 'width 1s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Code view */}
        {code && (
          <div className="card" style={{ marginBottom: 20 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 14, fontSize: 16 }}>Analyzed Code</h3>
            <CodeEditor value={code} readOnly language={language?.toLowerCase().replace('++', 'pp') || 'cpp'} height={280} />
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <button onClick={() => downloadReport(report, code, language)} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center', minWidth: 180, padding: '13px' }}>
            ⬇️ Download Report (PDF)
          </button>
          <Link to="/detect" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', minWidth: 180, padding: '13px', textDecoration: 'none' }}>
            🔄 Analyze New Code
          </Link>
        </div>
      </div>
    </div>
  )
}
