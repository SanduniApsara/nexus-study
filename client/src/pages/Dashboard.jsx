import { useEffect } from 'react'
import { BookOpen, CheckSquare, Clock, TrendingUp, AlertTriangle, Calendar } from 'lucide-react'
import { RadialBarChart, RadialBar, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts'
import { format, parseISO } from 'date-fns'
import useAppStore from '../store/useAppStore'
import useAuthStore from '../store/useAuthStore'
import KPICard from '../components/KPICard'

export default function Dashboard() {
  const { stats, fetchStats, tasks, fetchTasks } = useAppStore()
  const user = useAuthStore(s => s.user)

  useEffect(() => {
    fetchStats()
    fetchTasks()
  }, [])

  const gpaData = stats ? [
    { name: 'GPA', value: ((stats.gpa.current || 0) / 4) * 100, fill: '#c8f050' },
  ] : []

  const weeklyData = stats?.study?.weeklyHours || []

  const upcomingTasks = tasks
    .filter(t => t.status !== 'Done' && new Date(t.dueDate) >= new Date())
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5)

  const priorityColor = {
    Critical: 'text-danger',
    High:     'text-orange-400',
    Medium:   'text-yellow-400',
    Low:      'text-sky',
  }

  return (
    <div className="flex flex-col gap-5 animate-fade-up">
      {/* Greeting */}
      <div>
        <h1 className="font-display font-black text-2xl text-text1">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
          <span className="text-accent">{user?.name?.split(' ')[0]}</span> 👋
        </h1>
        <p className="text-text3 font-mono text-sm mt-0.5">{user?.university} · {user?.degree}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Current GPA"
          value={stats?.gpa?.current?.toFixed(2) || '—'}
          sub={`Target: ${user?.targetGPA}`}
          badge={stats?.gpa?.current ? {
            text: stats.gpa.current >= user?.targetGPA ? '✓ On Track' : 'Below Target',
            type: stats.gpa.current >= user?.targetGPA ? 'up' : 'down',
          } : null}
          color="green"
          icon={TrendingUp}
        />
        <KPICard
          label="Modules"
          value={stats?.modules?.total || 0}
          sub="this semester"
          color="violet"
          icon={BookOpen}
        />
        <KPICard
          label="Tasks Done"
          value={`${stats?.tasks?.done || 0}/${stats?.tasks?.total || 0}`}
          sub="completed"
          badge={stats?.tasks?.overdue ? { text: `${stats.tasks.overdue} overdue`, type: 'down' } : null}
          color="sky"
          icon={CheckSquare}
        />
        <KPICard
          label="Study Hours"
          value={stats?.study?.totalHours || 0}
          sub="total logged"
          badge={{ text: `Avg ${stats?.study?.avgProductivity || 0}/5`, type: 'neutral' }}
          color="red"
          icon={Clock}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* GPA Radial */}
        <div className="card flex flex-col items-center">
          <p className="section-title self-start mb-4">GPA Progress</p>
          <div className="relative">
            <ResponsiveContainer width={180} height={180}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="65%" outerRadius="90%"
                data={gpaData} startAngle={90} endAngle={-270}>
                <RadialBar dataKey="value" cornerRadius={8} background={{ fill: '#1a1a24' }} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-black text-2xl text-text1">{stats?.gpa?.current?.toFixed(2) || '—'}</span>
              <span className="text-xs font-mono text-text3">/ 4.0</span>
            </div>
          </div>
          <div className="mt-3 text-center">
            <p className="text-xs font-mono text-text3">Target: <span className="text-accent">{user?.targetGPA}</span></p>
            <div className="mt-2 w-full bg-bg3 rounded-full h-1.5 overflow-hidden">
              <div className="h-full bg-accent rounded-full transition-all"
                   style={{ width: `${stats?.gpa?.progress || 0}%` }} />
            </div>
            <p className="text-xs font-mono text-text3 mt-1">{stats?.gpa?.progress || 0}% of target</p>
          </div>
        </div>

        {/* Weekly study hours */}
        <div className="card lg:col-span-2">
          <p className="section-title mb-4">Weekly Study Hours</p>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="studyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#c8f050" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#c8f050" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#555568" tick={{ fontSize: 11, fontFamily: 'DM Mono' }} />
              <YAxis stroke="#555568" tick={{ fontSize: 11, fontFamily: 'DM Mono' }} />
              <Tooltip contentStyle={{ background: '#1a1a24', border: '1px solid #35354a', borderRadius: 10, fontFamily: 'DM Mono', fontSize: 12 }} />
              <Area type="monotone" dataKey="hours" stroke="#c8f050" fill="url(#studyGrad)" strokeWidth={2} dot={{ fill: '#c8f050', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Upcoming tasks & Overdue alert */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Upcoming */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={16} className="text-accent" />
            <p className="section-title">Upcoming Deadlines</p>
          </div>
          {upcomingTasks.length === 0 ? (
            <p className="text-text3 text-sm font-mono text-center py-4">No upcoming tasks 🎉</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {upcomingTasks.map(task => (
                <li key={task._id} className="flex items-center gap-3 p-2.5 rounded-xl border border-border hover:border-borderHi transition-colors">
                  <div className="w-2 h-2 rounded-full flex-shrink-0"
                       style={{ background: task.module?.color || '#9090a8' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text1 truncate">{task.title}</p>
                    <p className="text-xs font-mono text-text3">{task.module?.name || 'No module'}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-mono font-semibold ${priorityColor[task.priority]}`}>{task.priority}</p>
                    <p className="text-xs font-mono text-text3">{format(parseISO(task.dueDate), 'MMM d')}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Module scores */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={16} className="text-violet" />
            <p className="section-title">Module Scores</p>
          </div>
          {(stats?.modules?.stats || []).length === 0 ? (
            <p className="text-text3 text-sm font-mono text-center py-4">No modules added yet</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {(stats?.modules?.stats || []).slice(0, 5).map(mod => (
                <li key={mod.id}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-semibold text-text1">{mod.name}</span>
                    <span className="text-xs font-mono text-text2">
                      {mod.score !== null ? `${mod.score.toFixed(1)}%` : 'No grades'}
                    </span>
                  </div>
                  <div className="h-1.5 bg-bg3 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all"
                         style={{ width: `${mod.score || 0}%`, background: mod.color || '#c8f050' }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
