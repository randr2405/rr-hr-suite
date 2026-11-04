import { useStore, fmtDate } from '../store.jsx'

export default function Home() {
  const { user, role, employees, leave, time, balances, decideLeave } = useStore()
  const mine = balances[user.employeeId] || { sick: 0, annual: 0, family: 0 }
  const name = id => (employees.find(e => e.id === id) || { name: 'Unknown' }).name
  const myLeave = leave.filter(l => l.employeeId === user.employeeId)
  const team = leave.filter(l => l.status === 'Pending' && l.employeeId !== user.employeeId)
  const hours = time.filter(t => t.employeeId === user.employeeId).reduce((s, t) => s + Number(t.hours), 0)

  return (
    <div>
      <div className="hero">
        <div>
          <span className="eyebrow">{fmtDate(new Date())}</span>
          <h1>Welcome, {user.name.split(' ')[0]}</h1>
          <p>{role === 'manager' ? 'Review your team’s requests and keep an eye on your own balances.' : 'Check your leave balances and capture your time.'}</p>
        </div>
        <div className="hero-side"><span>Signed in as</span><b>{role}</b></div>
      </div>
      <div className="cards">
        <div className="card"><span>Sick days left</span><strong>{mine.sick}</strong></div>
        <div className="card"><span>Annual days left</span><strong>{mine.annual}</strong></div>
        <div className="card"><span>Family days left</span><strong>{mine.family}</strong></div>
        <div className="card"><span>Hours captured</span><strong>{hours}</strong></div>
      </div>
      <div className="grid2 gap">
        {role === 'manager' && (
          <div className="panel">
            <h2>Team approvals</h2>
            {team.length === 0 && <p className="empty">No requests waiting for you.</p>}
            {team.map(l => (
              <div className="row" key={l.id}>
                <div><b>{name(l.employeeId)}</b><small>{l.type} leave · {l.from} to {l.to} · {l.days} day(s)</small></div>
                <div>
                  <button className="primary" onClick={() => decideLeave(l.id, 'Approved')}>Approve</button>
                  <button className="danger" onClick={() => decideLeave(l.id, 'Declined')}>Decline</button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="panel">
          <h2>My leave requests</h2>
          {myLeave.length === 0 && <p className="empty">No requests yet.</p>}
          {myLeave.map(l => (
            <div className="row" key={l.id}>
              <div><b style={{ textTransform: 'capitalize' }}>{l.type}</b><small>{l.from} to {l.to} · {l.days} day(s)</small></div>
              <span className={'tag ' + l.status.toLowerCase()}>{l.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
