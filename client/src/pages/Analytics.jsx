import { useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PieChart, Pie, Cell, Legend,
  LineChart, Line, CartesianGrid,
} from 'recharts'
import useAppStore from '../store/useAppStore'

const TOOLTIP_STYLE = {
  contentStyle: {
    background: '#1a1a24',
    border: '1px solid #35354a',
    borderRadius: 10,
    fontFamily: 'DM Mono',
    fontSize: 12,
    color: '#f0f0fa',
  },
}

export default function Analytics() {
  const { stats, fetchStats, modules, fetchModules, sessions, fetchSessions } = useAppStore()

  useEffect(() => {
    fetchStats()
    fetchModules()
    fetchSessions()
  }, [])

  // Module score bar data
  const moduleScores = (stats?.modules?.stats || []).map(m => ({
    name: m.code || m.name.slice(0, 8),
    score: m.score ? Math.round(m.score * 10) / 10 : 0,
    gpa:   m.gpa  || 0,
    color: m.color,
  }))

  // GPA radar (fake multi-semester for demo)
  const radarData = (stats?.modules?.stats || []).map(m => ({
    module: m.code || m.name.slice(0, 6),
    score:  m.score ? Math.round(m.score) : 0,
  }))

  // Study sessions by type (pie)
  const sessionTypeCounts = {}
  sessions.forEach(s => {
    sessionTypeCounts[s.type] = (sessionTypeCounts[s.type] || 0) + Math.round(s.duration / 60 * 10) / 10
  })
  const pieData = Object.entries(sessionTypeCounts).map(([name, value]) => ({ name, value }))
  const PIE_COLORS = ['#c8f050','#7b5ea7','#50b4f0','#f05050','#f0a050','#50f0b0']

  // Weekly hours line chart
  const weeklyData = stats?.study?.weeklyHours || []

  // Task completion trend (mock per-status counts)
  const taskData = [
    { label: 'Todo',        count: (stats?.tasks?.total || 0) - (stats?.tasks?.done || 0) },
    { label: 'Done',        count: stats?.tasks?.done || 0 },
    { label: 'Overdue',     count: stats?.tasks?.overdue || 0 },
    { label: 'Upcoming',    count: stats?.tasks?.upcoming || 0 },
  ]

  return (
    <div className="flex flex-col gap-5 animate-fade-up">
      <div>
        <h1 className="font-display font-black text-xl text-text1">Analytics</h1>
        <p className="text-text3 text-xs font-mono mt-0.5">Visual breakdown of your academic performance</p>
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Module Scores Bar */}
        <div className="card">
          <p className="section-title mb-4">Module Scores</p>
          {moduleScores.length === 0 ? (
            <p className="text-text3 text-sm font-mono text-center py-8">No module data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={moduleScores} barSize={28}>
                <XAxis dataKey="name" stroke="#555568" tick={{ fontSize: 11, fontFamily: 'DM Mono' }} />
                <YAxis domain={[0, 100]} stroke="#555568" tick={{ fontSize: 11, fontFamily: 'DM Mono' }} />
                <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [v + '%', 'Score']} />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {moduleScores.map((entry, i) => (
                    <Cell key={i} fill={entry.color || '#c8f050'} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Weekly Study Hours Line */}
        <div className="card">
          <p className="section-title mb-4">Weekly Study Hours</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={weeklyData}>
              <CartesianGrid stroke="#252535" strokeDasharray="4 4" />
              <XAxis dataKey="day" stroke="#555568" tick={{ fontSize: 11, fontFamily: 'DM Mono' }} />
              <YAxis stroke="#555568" tick={{ fontSize: 11, fontFamily: 'DM Mono' }} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [v + 'h', 'Hours']} />
              <Line
                type="monotone" dataKey="hours" stroke="#c8f050"
                strokeWidth={2} dot={{ fill: '#c8f050', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Radar chart */}
        <div className="card">
          <p className="section-title mb-4">Performance Radar</p>
          {radarData.length < 3 ? (
            <p className="text-text3 text-sm font-mono text-center py-8">Add 3+ modules to see radar</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#252535" />
                <PolarAngleAxis dataKey="module" tick={{ fontSize: 10, fontFamily: 'DM Mono', fill: '#9090a8' }} />
                <Radar dataKey="score" stroke="#c8f050" fill="#c8f050" fillOpacity={0.2} strokeWidth={2} />
                <Tooltip {...TOOLTIP_STYLE} />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie: study session types */}
        <div className="card">
          <p className="section-title mb-4">Study Session Types</p>
          {pieData.length === 0 ? (
            <p className="text-text3 text-sm font-mono text-center py-8">No sessions logged yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} dataKey="value" cx="50%" cy="50%"
                  innerRadius={55} outerRadius={80} paddingAngle={4}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} fillOpacity={0.85} />
                  ))}
                </Pie>
                <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [v + 'h', 'Hours']} />
                <Legend iconType="circle" iconSize={8}
                  formatter={(v) => <span style={{ fontSize: 11, fontFamily: 'DM Mono', color: '#9090a8' }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Task breakdown bar */}
        <div className="card">
          <p className="section-title mb-4">Task Breakdown</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={taskData} layout="vertical" barSize={18}>
              <XAxis type="number" stroke="#555568" tick={{ fontSize: 11, fontFamily: 'DM Mono' }} />
              <YAxis type="category" dataKey="label" stroke="#555568" tick={{ fontSize: 11, fontFamily: 'DM Mono' }} width={60} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                {taskData.map((entry, i) => {
                  const colors = ['#50b4f0','#c8f050','#f05050','#f0a050']
                  return <Cell key={i} fill={colors[i]} fillOpacity={0.85} />
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* GPA summary table */}
      <div className="card">
        <p className="section-title mb-4">GPA Calculation Breakdown</p>
        {(stats?.modules?.stats || []).length === 0 ? (
          <p className="text-text3 text-sm font-mono text-center py-6">Add modules and grades to see GPA breakdown</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {['Module','Code','Credits','Score','GPA Points','Weighted'].map(h => (
                    <th key={h} className="text-left py-2 px-3 text-xs font-mono text-text3 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(stats?.modules?.stats || []).map(mod => (
                  <tr key={mod.id} className="border-b border-border/50 hover:bg-bg3 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-text1">{mod.name}</td>
                    <td className="py-2.5 px-3 font-mono text-text3 text-xs">{mod.code || '—'}</td>
                    <td className="py-2.5 px-3 font-mono text-text2">{mod.credits}</td>
                    <td className="py-2.5 px-3 font-mono" style={{ color: mod.color }}>
                      {mod.score !== null ? mod.score.toFixed(1) + '%' : '—'}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-accent">
                      {mod.gpa !== null ? mod.gpa.toFixed(1) : '—'}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-text2">
                      {mod.gpa !== null ? (mod.gpa * mod.credits).toFixed(2) : '—'}
                    </td>
                  </tr>
                ))}
                <tr className="bg-bg3">
                  <td colSpan={4} className="py-2.5 px-3 font-black text-text1 text-right">Overall GPA</td>
                  <td colSpan={2} className="py-2.5 px-3 font-black text-accent font-mono text-base">
                    {stats?.gpa?.current?.toFixed(2) || '—'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
