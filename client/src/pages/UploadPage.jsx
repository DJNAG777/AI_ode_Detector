import React, { useState, useRef } from 'react'
import { detectAPI } from '../services/api.js'

const ACCEPTED = ['.c', '.cpp', '.java', '.py', '.zip']

export default function UploadPage() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef()

  const addFiles = (newFiles) => {
    const filtered = Array.from(newFiles).filter(f => ACCEPTED.some(ext => f.name.toLowerCase().endsWith(ext)))
    setFiles(prev => [...prev, ...filtered])
  }

  const handleUpload = async () => {
    if (!files.length) return setError('Please add files to analyze.')
    setError(''); setLoading(true)
    const formData = new FormData()
    files.forEach(f => formData.append('files', f))
    try {
      const res = await detectAPI.upload(formData)
      setResults(res.data.results)
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Please try again.')
    } finally { setLoading(false) }
  }

  const getColor = (s) => s >= 70 ? '#ef4444' : s >= 40 ? '#f59e0b' : '#10b981'
  const getBg = (s) => s >= 70 ? '#fee2e2' : s >= 40 ? '#fef3c7' : '#dcfce7'

  const downloadCSV = () => {
    const csv = ['Filename,Language,AI Score,Human Score,Result,Lines',
      ...results.map(r => `"${r.filename}",${r.language},${r.aiScore}%,${r.humanScore}%,"${r.result}",${r.lines}`)
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'ai-detection-results.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ background: '#f8f9ff', minHeight: '80vh', padding: '48px 0' }}>
      <div className="container" style={{ maxWidth: 880 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h1 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 800, color: '#1e1b4b', marginBottom: 10 }}>Batch File Upload</h1>
          <p style={{ color: '#6b7280', fontSize: 16 }}>Upload multiple source files or a ZIP archive for batch AI detection</p>
        </div>

        <div className="card" style={{ padding: 32, marginBottom: 20 }}>
          {/* Drop Zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files) }}
            onClick={() => inputRef.current?.click()}
            style={{
              border: `2px dashed ${dragging ? '#6366f1' : '#d1d5db'}`,
              borderRadius: 14, padding: '52px 32px', textAlign: 'center', cursor: 'pointer', marginBottom: 20,
              background: dragging ? 'rgba(99,102,241,0.04)' : '#fafafa', transition: 'all 0.25s',
            }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>📁</div>
            <div style={{ fontWeight: 700, fontSize: 17, color: '#1e1b4b', marginBottom: 6 }}>Drop files here or click to browse</div>
            <div style={{ fontSize: 13, color: '#9ca3af' }}>Supported: {ACCEPTED.join(', ')} • Max 10 files • 10MB each</div>
            <input ref={inputRef} type="file" multiple accept={ACCEPTED.join(',')} onChange={e => addFiles(e.target.files)} style={{ display: 'none' }} />
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{files.length} file{files.length > 1 ? 's' : ''} selected</span>
                <button onClick={() => setFiles([])} className="btn btn-ghost" style={{ padding: '4px 11px', fontSize: 12 }}>Clear All</button>
              </div>
              {files.map((file, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 14px', background: '#f9fafb', borderRadius: 9, border: '1px solid #f3f4f6', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 18 }}>📄</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{file.name}</div>
                      <div style={{ fontSize: 11, color: '#9ca3af' }}>{(file.size / 1024).toFixed(1)} KB</div>
                    </div>
                  </div>
                  <button onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 16, padding: '2px 6px' }}>✕</button>
                </div>
              ))}
            </div>
          )}

          {error && <div className="alert alert-error">{error}</div>}

          <button onClick={handleUpload} disabled={loading || !files.length} className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '15px', fontSize: 17 }}>
            {loading ? <><div className="loading-spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />Processing Files...</> : '🚀 Analyze All Files'}
          </button>
        </div>

        {/* Results */}
        {results && results.length > 0 && (
          <div className="card" style={{ padding: 28, animation: 'fadeUp 0.6s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: 18 }}>Detection Results ({results.length} files)</h3>
              <button onClick={downloadCSV} className="btn btn-outline" style={{ padding: '7px 18px', fontSize: 13 }}>⬇️ Export CSV</button>
            </div>

            {/* Summary pills */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
              {[['AI Generated', results.filter(r => r.aiScore >= 60).length, '#ef4444', '#fee2e2'],
                ['Uncertain', results.filter(r => r.aiScore >= 40 && r.aiScore < 60).length, '#d97706', '#fef3c7'],
                ['Human Written', results.filter(r => r.aiScore < 40).length, '#10b981', '#dcfce7']].map(([label, count, color, bg]) => (
                <div key={label} style={{ padding: '10px 18px', background: bg, borderRadius: 10 }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color }}>{count}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color }}>{label}</div>
                </div>
              ))}
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(99,102,241,0.06)' }}>
                    {['Filename', 'Language', 'Lines', 'AI Score', 'Human %', 'Result'].map(h => (
                      <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#6366f1', borderBottom: '2px solid rgba(99,102,241,0.12)', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f3f4f6', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600, color: '#1e1b4b', maxWidth: 200 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span>📄</span><span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.filename}</span></div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ padding: '2px 9px', borderRadius: 999, background: '#eef2ff', color: '#6366f1', fontSize: 11, fontWeight: 700 }}>{r.language}</span>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: 13, color: '#6b7280' }}>{r.lines}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1, background: '#e5e7eb', borderRadius: 999, height: 5, overflow: 'hidden', minWidth: 50 }}>
                            <div style={{ height: '100%', background: getColor(r.aiScore), width: `${r.aiScore}%`, borderRadius: 999 }} />
                          </div>
                          <span style={{ fontWeight: 700, color: getColor(r.aiScore), fontSize: 13, minWidth: 34 }}>{r.aiScore}%</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 700, fontSize: 13, color: '#10b981' }}>{r.humanScore}%</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: getBg(r.aiScore), color: getColor(r.aiScore), whiteSpace: 'nowrap' }}>{r.result}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
