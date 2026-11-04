import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Home from './pages/Home.jsx'
import Employees from './pages/Employees.jsx'
import Leave from './pages/Leave.jsx'
import Payroll from './pages/Payroll.jsx'
import Fringe from './pages/Fringe.jsx'
import TimeStudies from './pages/TimeStudies.jsx'
import Reports from './pages/Reports.jsx'
import TaxSettings from './pages/TaxSettings.jsx'
import Users from './pages/Users.jsx'
import { useAuth, can } from './auth.jsx'

export default function App() {
  const { user } = useAuth()
  if (!user) return <Login />
  const guard = (path, el) => (can(user.role, path) ? el : <Navigate to="/" replace />)
  return (
    <Layout>
      <Routes>
        <Route path="/" element={user.role === 'admin' ? <Dashboard /> : <Home />} />
        <Route path="/employees" element={guard('/employees', <Employees />)} />
        <Route path="/leave" element={guard('/leave', <Leave />)} />
        <Route path="/payroll" element={guard('/payroll', <Payroll />)} />
        <Route path="/fringe" element={guard('/fringe', <Fringe />)} />
        <Route path="/time" element={guard('/time', <TimeStudies />)} />
        <Route path="/reports" element={guard('/reports', <Reports />)} />
        <Route path="/tax" element={guard('/tax', <TaxSettings />)} />
        <Route path="/access" element={guard('/access', <Users />)} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
