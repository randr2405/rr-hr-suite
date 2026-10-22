import { useState } from 'react'
import { useStore } from '../store.jsx'

export default function TimeStudies() {
  const { time, employees, addTime } = useStore()
  const [form, setForm] = useState({ employeeId: 2, client: '', task: 'Fieldwork', hours: '', date: '2026-10-22' })
  const name = id => employees.find(e => e.id === id).name

  const submit = e => {
    e.preventDefault()
    if (!form.client || !form.hours) return
    addTime({ ...form, employeeId: Number(form.employeeId), hours: Number(form.hours) })
    setForm({ ...form, client: '', hours: '' })
  }

  const byClient = time.reduce((acc, t) => {
    acc[t.client] = (acc[t.client] || 0) + t.hours
    return acc
  }, {})

  return (
    <div>
      <h1>Time Studies</h1>
      <p className="sub">Hours captured per client and task</p>
      <div className="grid2">
        <form className="panel" onSubmit={submit}>
          <h2>Capture time</h2>
          <label>Employee
            <select value={form.employeeId} onChange={e => setForm({ ...form, employeeId: e.target.value })}>
              {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          </label>
          <label>Client<input value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} /></label>
          <label>Task
            <select value={form.task} onChange={e => setForm({ ...form, task: e.target.value })}>
              <option>Fieldwork</option>
              <option>Review</option>
              <option>Reporting</option>
              <option>Planning</option>
            </select>
          </label>
          <label>Hours<input type="number" step="0.5" value={form.hours} onChange={e => setForm({ ...form, hours: e.target.value })} /></label>
          <label>Date<input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></label>
          <button type="submit" className="primary">Add entry</button>
        </form>
        <div className="panel">
          <h2>Hours per client</h2>
          <table>
            <thead><tr><th>Client</th><th>Hours</th></tr></thead>
            <tbody>
              {Object.entries(byClient).map(([client, hours]) => (
                <tr key={client}><td>{client}</td><td>{hours}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <h2>Entries</h2>
      <table>
        <thead><tr><th>Date</th><th>Employee</th><th>Client</th><th>Task</th><th>Hours</th></tr></thead>
        <tbody>
          {time.map(t => (
            <tr key={t.id}><td>{t.date}</td><td>{name(t.employeeId)}</td><td>{t.client}</td><td>{t.task}</td><td>{t.hours}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
