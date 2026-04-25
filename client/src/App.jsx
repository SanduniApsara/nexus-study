import { Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './store/useAuthStore'
import Layout    from './components/Layout'
import Toast     from './components/Toast'
import Login     from './pages/Login'
import Register  from './pages/Register'
import Dashboard from './pages/Dashboard'
import Modules   from './pages/Modules'
import Tasks     from './pages/Tasks'
import Planner   from './pages/Planner'
import Analytics from './pages/Analytics'
import Profile   from './pages/Profile'

const PrivateRoute = ({ children }) => {
  const token = useAuthStore(s => s.token)
  return token ? children : <Navigate to="/login" replace />
}

const PublicRoute = ({ children }) => {
  const token = useAuthStore(s => s.token)
  return !token ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <>
      <Toast />
      <Routes>
        <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index          element={<Dashboard />} />
          <Route path="modules" element={<Modules />} />
          <Route path="tasks"   element={<Tasks />} />
          <Route path="planner" element={<Planner />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </>
  )
}
