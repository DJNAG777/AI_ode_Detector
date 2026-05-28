import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { useAuth } from '../App.jsx'
import { reportsAPI } from '../services/api.js'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const COLORS = ['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b']

export default function DashboardPage() {
  const { user } = useAuth()
  const [reports, setReports] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('all')

  useEffect(() => {
    Promise.all([reportsAPI.getUser({ limit: 20 }), reportsAPI.getStats()])
      .then(([r, s]) => { setReports(r.data.reports || []); setStats(s.data) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this report?')) return
    try { await reportsAPI.delete(id); setReports(p => p.filter(r => r._id !== id)) } catch {}
  }

  const handleFav = async (id) => {
    try { await reportsAPI.toggleFavorite(id); setReports(p => p.map(r => r._id === id ? { ...r, isFavorite: !r.isFavorite } : r)) } catch {}
  }

  const getColor = (s) => s >= 70 ? '#ef4444' : s >= 40 ? '#f59e0b' : '#10b981'

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="loading-spinner" style={{ width: 44, height: 44 }} />
    </div>
  )

  const monthlyData = (stats?.monthly || []).map(m => ({ name: MONTHS[m._id.month - 1], count: m.count }))
  const langData = (stats?.languageBreakdown || []).map((l, i) => ({ name: l._id, value: l.count, color: COLORS[i % COLORS.length] }))
  const filtered = tab === 'favorites' ? reports.filter(r => r.isFavorite) : reports

  return (
    <div style={{ background: '#f8f9ff', minHeight: '80vh', padding: '44px 0' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 14 }}>
          <div>
            <h1 style={{ fontSize: 'clamp(22px,3vw,30px)', fontWeight: 800, color: '#1e1b4b', marginBottom: 6 }}>Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
            <p style={{ color: '#6b7280', fontSize: 14 }}>Your detection history and analytics</p>
          </div>
          <Link to="/detect" className="btn btn-primary">+ New Detection</Link>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Total Reports', value: stats?.total || 0, icon: '📊', color: '#6366f1' },
            { label: 'AI Detected', value: stats?.aiDetected || 0, icon: '🤖', color: '#ef4444' },
            { label: 'Human Written', value: stats?.humanDetected || 0, icon: '👤', color: '#10b981' },
            { label: 'Favorites', value: reports.filter(r => r.isFavorite).length, icon: '⭐', color: '#f59e0b' },
          ].map((stat) => (
            <div key={stat.label} className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 13, background: `${stat.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{stat.icon}</div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 800, color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 500 }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        {(monthlyData.length > 0 || langData.length > 0) && (
          <div className="grid-2" style={{ marginBottom: 24 }}>
            <div className="card">
              <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Monthly Detections</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={monthlyData}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366f1" radius={[5,5,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {langData.length > 0 && (
              <div className="card">
                <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>By Language</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={langData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={72} label>
                      {langData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {/* Reports */}
        <div className="card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, borderBottom: '1px solid #f3f4f6', paddingBottom: 14 }}>
            {[['all','All Reports'],['favorites','⭐ Favorites']].map(([t, label]) => (
              <button key={t} onClick={() => setTab(t)} style={{ padding: '7px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'Space Grotesk,sans-serif', background: tab === t ? '#6366f1' : 'rgba(99,102,241,0.08)', color: tab === t ? '#fff' : '#6366f1', transition: 'all 0.2s' }}>{label}</button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '52px 20px' }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>📋</div>
              <p style={{ color: '#9ca3af', fontWeight: 500 }}>No reports yet</p>
              <Link to="/detect" className="btn btn-primary" style={{ marginTop: 16, display: 'inline-flex' }}>Start Detecting</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtered.map(report => (
                <div key={report._id} style={{ padding: '14px 18px', borderRadius: 11, background: '#f9fafb', border: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                  <div style={{ width: 50, height: 50, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${getColor(report.aiScore)}18`, fontSize: 18, fontWeight: 800, color: getColor(report.aiScore), minWidth: 50 }}>
                    {report.aiScore}%
                  </div>
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{report.result}</div>
                    <div style={{ fontSize: 12, color: '#9ca3af' }}>{report.language} • {report.type} • {new Date(report.createdAt).toLocaleDateString()}</div>
                  </div>
                  <span style={{ padding: '3px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: `${getColor(report.aiScore)}18`, color: getColor(report.aiScore) }}>{report.language}</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => handleFav(report._id)} style={{ background: report.isFavorite ? '#fef3c7' : 'rgba(99,102,241,0.08)', border: 'none', borderRadius: 7, padding: '5px 10px', cursor: 'pointer', fontSize: 14 }}>{report.isFavorite ? '⭐' : '☆'}</button>
                    <button onClick={() => handleDelete(report._id)} style={{ background: '#fee2e2', border: 'none', borderRadius: 7, padding: '5px 10px', cursor: 'pointer', color: '#ef4444', fontSize: 14 }}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
