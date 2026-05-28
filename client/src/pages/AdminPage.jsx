import React, { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { adminAPI } from '../services/api.js'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const COLORS = ['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b']

export default function AdminPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('overview')

  useEffect(() => {
    adminAPI.getStats().then(res => setData(res.data)).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="loading-spinner" style={{ width: 44, height: 44 }} />
    </div>
  )

  if (!data) return (
    <div style={{ textAlign: 'center', padding: 80, color: '#6b7280' }}>
      <div style={{ fontSize: 56 }}>🔐</div>
      <h2 style={{ marginTop: 16 }}>Admin access required</h2>
      <p style={{ marginTop: 8, fontSize: 14 }}>Make sure you're logged in as an admin user.</p>
    </div>
  )

  const monthlyData = (data.monthlyReports || []).map(m => ({ name: MONTHS[m._id.month - 1], count: m.count }))
  const langData = (data.topLanguages || []).map((l, i) => ({ name: l._id, value: l.count, color: COLORS[i % COLORS.length] }))

  return (
    <div style={{ background: '#f8f9ff', minHeight: '80vh', padding: '44px 0' }}>
      <div className="container">
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 'clamp(22px,3vw,30px)', fontWeight: 800, color: '#1e1b4b', marginBottom: 6 }}>Admin Dashboard</h1>
          <p style={{ color: '#6b7280', fontSize: 14 }}>Platform analytics and management</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Total Users', value: data.stats?.totalUsers || 0, icon: '👥', color: '#6366f1' },
            { label: 'Total Reports', value: data.stats?.totalReports || 0, icon: '📊', color: '#8b5cf6' },
            { label: 'AI Detected', value: data.stats?.aiReports || 0, icon: '🤖', color: '#ef4444' },
            { label: 'Human Written', value: data.stats?.humanReports || 0, icon: '👤', color: '#10b981' },
          ].map(stat => (
            <div key={stat.label} className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 13, background: `${stat.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{stat.icon}</div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 800, color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 500 }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 2, marginBottom: 20, borderBottom: '2px solid #e5e7eb' }}>
          {[['overview','📊 Overview'],['users','👥 Users'],['reports','📋 Reports']].map(([t, label]) => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '10px 18px', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'Space Grotesk,sans-serif', background: 'none', color: tab === t ? '#6366f1' : '#6b7280', borderBottom: tab === t ? '2px solid #6366f1' : '2px solid transparent', marginBottom: -2, transition: 'all 0.2s' }}>{label}</button>
          ))}
        </div>

        {tab === 'overview' && (
          <div className="grid-2">
            <div className="card">
              <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Monthly Reports</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlyData}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366f1" radius={[5,5,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Top Languages</h3>
              {langData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={langData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={72} label>
                      {langData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : <div style={{ textAlign: 'center', color: '#9ca3af', padding: 52, fontSize: 14 }}>No data yet</div>}
            </div>
          </div>
        )}

        {tab === 'users' && (
          <div className="card" style={{ padding: 28 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 18, fontSize: 16 }}>Recent Users</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(99,102,241,0.06)' }}>
                    {['Name','Email','Role','Joined'].map(h => (
                      <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#6366f1', borderBottom: '2px solid rgba(99,102,241,0.12)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(data.recentUsers || []).map((u, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 600, fontSize: 13 }}>{u.name}</td>
                      <td style={{ padding: '12px 14px', color: '#6b7280', fontSize: 13 }}>{u.email}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ padding: '2px 9px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: u.role === 'admin' ? '#fee2e2' : '#eef2ff', color: u.role === 'admin' ? '#ef4444' : '#6366f1' }}>{u.role}</span>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#9ca3af', fontSize: 12 }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {(!data.recentUsers || data.recentUsers.length === 0) && (
                    <tr><td colSpan={4} style={{ textAlign: 'center', color: '#9ca3af', padding: 36, fontSize: 14 }}>No users found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'reports' && (
          <div className="card" style={{ padding: 28 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 18, fontSize: 16 }}>Recent Reports</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(99,102,241,0.06)' }}>
                    {['Language','Type','AI Score','Result','Date'].map(h => (
                      <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#6366f1', borderBottom: '2px solid rgba(99,102,241,0.12)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(data.recentReports || []).map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f3f4f6', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 600, fontSize: 13 }}>{r.language}</td>
                      <td style={{ padding: '12px 14px', color: '#6b7280', fontSize: 13, textTransform: 'capitalize' }}>{r.type}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 700, fontSize: 13, color: r.aiScore >= 70 ? '#ef4444' : r.aiScore >= 40 ? '#f59e0b' : '#10b981' }}>{r.aiScore}%</td>
                      <td style={{ padding: '12px 14px', fontSize: 12, color: '#4b5563' }}>{r.result}</td>
                      <td style={{ padding: '12px 14px', color: '#9ca3af', fontSize: 12 }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {(!data.recentReports || data.recentReports.length === 0) && (
                    <tr><td colSpan={5} style={{ textAlign: 'center', color: '#9ca3af', padding: 36, fontSize: 14 }}>No reports found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
