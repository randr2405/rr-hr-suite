import { useState } from 'react'
import { useStore } from '../store.jsx'

function daysBetween(from, to) {
  const a = new Date(from)
  const b = new Date(to)
  let count = 0
  for (let d = new Date(a); d <= b; d.setDate(d.getDate() + 1)) {
    const day = d.getDay()
    if (day !== 0 && day !== 6) count++
  }
  return count
}

export default function Leave() {
  const { employees, leave, balances, addLeave, decideLeave } = useStore()
  const [form, setForm] = useState({ employeeId: 1, type: 'sick', from: '', to: '', note: null })

  const submit = e => {
    e.preventDefault()
    if (!form.from || !form.to) return
    addLeave({ ...form, employeeId: Number(form.employeeId), days: daysBetween(form.from, form.to) })
    setForm({ ...form, from: '', to: '', note: null })
  }

  const name = id => employees.find(e => e.id === id).name
  const bal = balances[Number(form.employeeId)]

  return (
    <div>
      <h1>Leave</h1>
      <p className="sub">Balances deduct automatically when a request is approved</p>
      <div className="grid2">
        <form className="panel" onSubmit={submit}>
          <h2>New request</h2>
          <label>Employee
            <select value={form.employeeId} onChange={e => setForm({ ...form, employeeId: e.target.value })}>
              {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          </label>
          <label>Type
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              <option value="sick">Sick</option>
              <option value="annual">Annual</option>
              <option value="family">Family responsibility</option>
            </select>
          </label>
          <label>From<input type="date" value={form.from} onChange={e => setForm({ ...form, from: e.target.value })} /></label>
          <label>To<input type="date" value={form.to} onChange={e => setForm({ ...form, to: e.target.value })} /></label>
          {form.type === 'sick' && (
            <label>Sick note
              <input type="file" onChange={e => setForm({ ...form, note: e.target.files[0] ? e.target.files[0].name : null })} />
            </label>
          )}
          <button type="submit" className="primary">Submit request</button>
        </form>
        <div className="panel">
          <h2>Balances for {name(Number(form.employeeId))}</h2>
          <div className="cards small">
            <div className="card"><span>Sick days left</span><strong>{bal.sick}</strong></div>
            <div className="card"><span>Annual days left</span><strong>{bal.annual}</strong></div>
            <div className="card"><span>Family days left</span><strong>{bal.family}</strong></div>
          </div>
        </div>
      </div>
      <h2>Requests</h2>
      <table>
        <thead>
          <tr><th>Employee</th><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Sick note</th><th>Status</th><th></th></tr>
        </thead>
        <tbody>
          {leave.map(l => (
            <tr key={l.id}>
              <td>{name(l.employeeId)}</td>
              <td>{l.type}</td>
              <td>{l.from}</td>
              <td>{l.to}</td>
              <td>{l.days}</td>
              <td>{l.note || '-'}</td>
              <td><span className={'tag ' + l.status.toLowerCase()}>{l.status}</span></td>
              <td>
                {l.status === 'Pending' && (
                  <>
                    <button onClick={() => decideLeave(l.id, 'Approved')}>Approve</button>
                    <button className="ghost" onClick={() => decideLeave(l.id, 'Declined')}>Decline</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
