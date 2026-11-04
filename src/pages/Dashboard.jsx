import { Link } from 'react-router-dom'
import { useStore, fmtDate, prevWorkingDay } from '../store.jsx'
import { money } from '../tax.js'

const greet = () => {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}

export default function Dashboard() {
  const { employees, leave, time, payslips, table, balances, payDate, settings, setSettings, decideLeave, resetDemo, user } = useStore()
  const sum = k => payslips.reduce((s, p) => s + p.slip[k], 0)
  const name = id => (employees.find(e => e.id === id) || { name: 'Unknown' }).name
  const pending = leave.filter(l => l.status === 'Pending')
  const pd = new Date(payDate + 'T00:00')
  const daysToPay = Math.round((pd - new Date(new Date().toDateString())) / 864e5)
  const due = prevWorkingDay(new Date(pd.getFullYear(), pd.getMonth() + 1, 7))
  const sars = sum('paye') + sum('uif') * 2 + sum('sdl')

  const alerts = []
  leave.filter(l => l.type === 'sick' && l.days > 2 && !l.note).forEach(l => alerts.push(`${name(l.employeeId)}: sick leave of ${l.days} days has no sick note attached.`))
  employees.forEach(e => {
    const b = balances[e.id]
    if (b) Object.entries(b).forEach(([t, v]) => v < 0 && alerts.push(`${e.name} is ${Math.abs(v)} day(s) over their ${t} leave allowance.`))
  })

  const byClient = Object.entries(time.reduce((a, t) => ({ ...a, [t.client]: (a[t.client] || 0) + Number(t.hours) }), {})).sort((a, b) => b[1] - a[1])
  const max = byClient.length ? byClient[0][1] : 1

  return (
    <div>
      <div className="hero">
        <div>
          <span className="eyebrow">{fmtDate(new Date())}</span>
          <h1>{greet()}, {user.name.split(' ')[0]}</h1>
          <p>
            {pending.length ? `${pending.length} item${pending.length > 1 ? 's' : ''} need your attention. ` : 'Everything is handled. '}
            Payroll runs on <b>{fmtDate(pd)}</b>{daysToPay >= 0 ? ` (${daysToPay} day${daysToPay === 1 ? '' : 's'} away)` : ' and has been processed'}.
          </p>
        </div>
        <div className="hero-side"><span>Active SARS table</span><b>{table.label}</b></div>
      </div>

      <div className="cards">
        <div className="card"><span>Team members</span><strong>{employees.length}</strong></div>
        <div className="card"><span>Monthly gross payroll</span><strong>{money(sum('grossPay'))}</strong></div>
        <div className="card"><span>Payable to SARS (EMP201)</span><strong>{money(sars)}</strong><em>Due {fmtDate(due)}</em></div>
        <div className="card"><span>Awaiting approval</span><strong>{pending.length}</strong></div>
      </div>

      <div className="grid2 gap">
        <div className="panel">
          <h2>Action centre</h2>
          {pending.length === 0 && alerts.length === 0 && <p className="empty">All clear. Nothing needs you right now.</p>}
          {pending.map(l => (
            <div className="row" key={l.id}>
              <div><b>{name(l.employeeId)}</b><small>{l.type} leave · {l.from} to {l.to} · {l.days} day(s)</small></div>
              <div>
                <button className="primary" onClick={() => decideLeave(l.id, 'Approved')}>Approve</button>
                <button className="danger" onClick={() => decideLeave(l.id, 'Declined')}>Decline</button>
              </div>
            </div>
          ))}
          {alerts.map((a, i) => <div className="row warn" key={i}><div>{a}</div><Link to="/leave">Review</Link></div>)}
        </div>
        <div className="panel">
          <h2>Hours by client</h2>
          {byClient.length === 0 && <p className="empty">No time captured yet.</p>}
          {byClient.map(([c, h]) => (
            <div className="bar" key={c}><div className="bar-head"><span>{c}</span><b>{h}h</b></div><div className="bar-track"><div style={{ width: (h / max) * 100 + '%' }} /></div></div>
          ))}
        </div>
      </div>

      <div className="panel auto">
        <div>
          <h2>Automation</h2>
          <p className="sub tight">Leave is routed for you: balances are checked, weekends and SA public holidays are skipped, and sick leave over 2 days is held for a note. PAYE, UIF, SDL and the EMP201 due date calculate themselves. Everything saves automatically.</p>
        </div>
        <div className="auto-actions">
          <label className="switch">
            <input type="checkbox" checked={settings.autoApprove} onChange={e => setSettings({ ...settings, autoApprove: e.target.checked })} />
            <i />Auto-approve eligible leave
          </label>
          <button onClick={resetDemo}>Reset demo data</button>
        </div>
      </div>
    </div>
  )
}
