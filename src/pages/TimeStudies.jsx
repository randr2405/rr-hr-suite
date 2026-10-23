import { useState } from 'react'
import { useStore } from '../store.jsx'
import Cell from '../components/Cell.jsx'

const taskOptions = ['Fieldwork', 'Review', 'Reporting', 'Planning'].map(t => ({ value: t, label: t }))

export default function TimeStudies() {
  const { time, employees, addTime, updateTime, deleteTime } = useStore()
  const [form, setForm] = useState({ employeeId: employees.length ? employees[0].id : 0, client: '', task: 'Fieldwork', hours: '', date: '2026-10-22' })
  const empOptions = employees.map(e => ({ value: e.id, label: e.name }))

  const submit = e => {
    e.preventDefault()
    if (!form.client || !form.hours) return
    addTime({ ...form, employeeId: Number(form.employeeId), hours: Number(form.hours) })
    setForm({ ...form, client: '', hours: '' })
  }

  const byClient = time.reduce((acc, t) => {
    acc[t.client] = (acc[t.client] || 0) + Number(t.hours)
    return acc
  }, {})

  return (
    <div>
      <h1>Time Studies</h1>
      <p className="sub">Hours captured per client and task. Every entry is editable.</p>
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
              {taskOptions.map(o => <option key={o.value}>{o.label}</option>)}
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
        <thead><tr><th>Date</th><th>Employee</th><th>Client</th><th>Task</th><th>Hours</th><th></th></tr></thead>
        <tbody>
          {time.map(t => (
            <tr key={t.id}>
              <td><Cell type="date" value={t.date} onChange={v => updateTime(t.id, { date: v })} /></td>
              <td><Cell value={t.employeeId} options={empOptions} onChange={v => updateTime(t.id, { employeeId: Number(v) })} /></td>
              <td><Cell value={t.client} onChange={v => updateTime(t.id, { client: v })} /></td>
              <td><Cell value={t.task} options={taskOptions} onChange={v => updateTime(t.id, { task: v })} /></td>
              <td><Cell type="number" value={t.hours} onChange={v => updateTime(t.id, { hours: v })} /></td>
              <td><button className="danger" onClick={() => deleteTime(t.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
