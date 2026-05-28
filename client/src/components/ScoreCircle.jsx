import React, { useEffect, useState } from 'react'

export default function ScoreCircle({ score, size = 140, label = 'AI Score', color }) {
  const [animated, setAnimated] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 300)
    return () => clearTimeout(t)
  }, [score])

  const radius = (size - 20) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (animated / 100) * circumference

  const getColor = () => {
    if (color) return color
    if (score >= 70) return '#ef4444'
    if (score >= 40) return '#f59e0b'
    return '#10b981'
  }

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f0f0f0" strokeWidth={8} />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={getColor()} strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <div style={{ textAlign: 'center', zIndex: 1 }}>
        <div style={{ fontSize: size * 0.21, fontWeight: 800, color: getColor(), lineHeight: 1 }}>
          {Math.round(animated)}%
        </div>
        <div style={{ fontSize: size * 0.1, fontWeight: 600, color: '#6b7280', marginTop: 3 }}>{label}</div>
      </div>
    </div>
  )
}
