import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, BookOpen, CheckSquare, Calendar, BarChart2, User, LogOut, Menu, X, GraduationCap } from 'lucide-react'
import useAuthStore from '../store/useAuthStore'
import clsx from 'clsx'

const NAV_ITEMS = [
  { to: '/',          label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/modules',   label: 'Modules',   icon: BookOpen },
  { to: '/tasks',     label: 'Tasks',     icon: CheckSquare },
  { to: '/planner',   label: 'Planner',   icon: Calendar },
  { to: '/analytics', label: 'Analytics', icon: BarChart2 },
  { to: '/profile',   label: 'Profile',   icon: User },
]

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen bg-bg">

      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden"
             onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={clsx(
        'fixed top-0 left-0 h-full w-56 bg-bg2 border-r border-border z-50',
        'flex flex-col transition-transform duration-300',
        'lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border">
          <GraduationCap size={22} className="text-accent" />
          <span className="font-display font-black text-base tracking-widest text-text1">NEXUS</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 flex flex-col gap-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => clsx('nav-link', isActive && 'active')}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={17} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User & logout */}
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet to-accent flex items-center justify-center text-xs font-black text-black">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text1 truncate">{user?.name}</p>
              <p className="text-xs text-text3 font-mono truncate">Year {user?.year}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="nav-link w-full text-danger hover:bg-danger/10 hover:text-danger">
            <LogOut size={17} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col lg:ml-56">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-bg2 border-b border-border px-5 py-3 flex items-center justify-between gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-text2">
            <Menu size={22} />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs font-mono text-text3">
              Target GPA: <span className="text-accent">{user?.targetGPA?.toFixed(1)}</span>
            </span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet to-accent flex items-center justify-center text-xs font-black text-black">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
