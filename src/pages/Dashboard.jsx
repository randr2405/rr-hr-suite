import { useStore } from '../store.jsx'
import { money } from '../tax.js'

export default function Dashboard() {
  const { employees, leave, payslips, table } = useStore()
  const totalNet = payslips.reduce((s, p) => s + p.slip.net, 0)
  const totalPaye = payslips.reduce((s, p) => s + p.slip.paye, 0)
  const pending = leave.filter(l => l.status === 'Pending').length

  return (
    <div>
      <h1>Dashboard</h1>
      <p className="sub">Active SARS table: {table.label}, effective from {table.effectiveFrom}</p>
      <div className="cards">
        <div className="card"><span>Employees</span><strong>{employees.length}</strong></div>
        <div className="card"><span>Pending leave requests</span><strong>{pending}</strong></div>
        <div className="card"><span>Monthly net payroll</span><strong>{money(totalNet)}</strong></div>
        <div className="card"><span>Monthly PAYE</span><strong>{money(totalPaye)}</strong></div>
      </div>
    </div>
  )
}
