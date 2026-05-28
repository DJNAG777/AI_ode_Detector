import React from 'react'

export default function CodeEditor({ value, onChange, language = 'cpp', placeholder, readOnly = false, height = 340 }) {
  const lines = (value || '').split('\n')
  const lineCount = Math.max(lines.length, 15)

  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', border: '1.5px solid #374151', background: '#1a1a2e', fontFamily: "'JetBrains Mono', monospace" }}>
      {/* Header */}
      <div style={{ background: '#16213e', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #374151' }}>
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }} />
        <span style={{ marginLeft: 12, fontSize: 12, color: '#6b7280', fontFamily: 'Space Grotesk, sans-serif' }}>
          {language.toUpperCase()} • {lines.length} lines
        </span>
      </div>
      {/* Body */}
      <div style={{ display: 'flex', height }}>
        {/* Line numbers */}
        <div style={{
          background: '#111827', padding: '12px 8px 12px 4px', minWidth: 48,
          textAlign: 'right', fontSize: 12, lineHeight: '21px',
          color: '#4b5563', userSelect: 'none', borderRight: '1px solid #374151',
          overflowY: 'hidden',
        }}>
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i} style={{ height: 21, paddingRight: 8 }}>{i + 1}</div>
          ))}
        </div>
        {/* Textarea */}
        <textarea
          value={value || ''}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          readOnly={readOnly}
          placeholder={placeholder}
          spellCheck={false}
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            color: '#e2e8f0', fontSize: 13, lineHeight: '21px',
            padding: '12px 16px', resize: 'none',
            fontFamily: "'JetBrains Mono', monospace", height: '100%', overflowY: 'auto',
          }}
        />
      </div>
    </div>
  )
}
