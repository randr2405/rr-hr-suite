import { useState } from 'react'
import { useStore } from '../store.jsx'
import Cell from '../components/Cell.jsx'

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

const typeOptions = [
  { value: 'sick', label: 'Sick' },
  { value: 'annual', label: 'Annual' },
  { value: 'family', label: 'Family responsibility' }
]

const statusOptions = ['Pending', 'Approved', 'Declined'].map(s => ({ value: s, label: s }))

export default function Leave() {
  const { employees, leave, balances, allowances, setAllowance, addLeave, updateLeave, deleteLeave } = useStore()
  const [form, setForm] = useState({ employeeId: employees.length ? employees[0].id : 0, type: 'sick', from: '', to: '', note: null })

  const submit = e => {
    e.preventDefault()
    if (!form.from || !form.to) return
    addLeave({ ...form, employeeId: Number(form.employeeId), days: daysBetween(form.from, form.to) })
    setForm({ ...form, from: '', to: '', note: null })
  }

  const empOptions = employees.map(e => ({ value: e.id, label: e.name }))
  const name = id => {
    const found = employees.find(e => e.id === id)
    return found ? found.name : 'Unknown'
  }
  const bal = balances[Number(form.employeeId)] || { sick: 0, annual: 0, family: 0 }

  return (
    <div>
      <h1>Leave</h1>
      <p className="sub">Balances deduct automatically from approved requests. Everything below is editable.</p>
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
              {typeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
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
          <h2>Yearly allowance (days)</h2>
          <div className="cards small">
            <div className="card"><span>Sick</span><Cell type="number" value={allowances.sick} onChange={v => setAllowance('sick', v)} /></div>
            <div className="card"><span>Annual</span><Cell type="number" value={allowances.annual} onChange={v => setAllowance('annual', v)} /></div>
            <div className="card"><span>Family</span><Cell type="number" value={allowances.family} onChange={v => setAllowance('family', v)} /></div>
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
              <td><Cell value={l.employeeId} options={empOptions} onChange={v => updateLeave(l.id, { employeeId: Number(v) })} /></td>
              <td><Cell value={l.type} options={typeOptions} onChange={v => updateLeave(l.id, { type: v })} /></td>
              <td><Cell type="date" value={l.from} onChange={v => updateLeave(l.id, { from: v })} /></td>
              <td><Cell type="date" value={l.to} onChange={v => updateLeave(l.id, { to: v })} /></td>
              <td><Cell type="number" value={l.days} onChange={v => updateLeave(l.id, { days: v })} /></td>
              <td><Cell value={l.note || ''} onChange={v => updateLeave(l.id, { note: v || null })} /></td>
              <td><Cell value={l.status} options={statusOptions} onChange={v => updateLeave(l.id, { status: v })} /></td>
              <td><button className="danger" onClick={() => deleteLeave(l.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
