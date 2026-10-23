import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Employees from './pages/Employees.jsx'
import Leave from './pages/Leave.jsx'
import Payroll from './pages/Payroll.jsx'
import Fringe from './pages/Fringe.jsx'
import TimeStudies from './pages/TimeStudies.jsx'
import Reports from './pages/Reports.jsx'
import TaxSettings from './pages/TaxSettings.jsx'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/leave" element={<Leave />} />
        <Route path="/payroll" element={<Payroll />} />
        <Route path="/fringe" element={<Fringe />} />
        <Route path="/time" element={<TimeStudies />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/tax" element={<TaxSettings />} />
      </Routes>
    </Layout>
  )
}
