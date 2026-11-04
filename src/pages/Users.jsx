import { useState } from 'react'
import { useAuth, DOMAIN } from '../auth.jsx'
import { useStore } from '../store.jsx'
import Cell from '../components/Cell.jsx'

const roles = ['admin', 'manager', 'employee'].map(r => ({ value: r, label: r[0].toUpperCase() + r.slice(1) }))
const blank = { name: '', email: '', password: '', role: 'employee', employeeId: 1 }

export default function Users() {
  const { user, users, addUser, updateUser, deleteUser } = useAuth()
  const { employees, notify } = useStore()
  const [f, setF] = useState(blank)
  const empOptions = employees.map(e => ({ value: e.id, label: e.name }))

  const submit = e => {
    e.preventDefault()
    const err = addUser({ ...f, employeeId: Number(f.employeeId) })
    if (err) return notify(err)
    notify('Account created. Share the email and password with the person.')
    setF(blank)
  }

  return (
    <div>
      <h1>Access Control</h1>
      <p className="sub">Admins see everything. Managers approve team leave and see team time. Employees only see their own leave and time. Only @{DOMAIN} emails can sign in.</p>
      <form className="panel gap" onSubmit={submit}>
        <h2>Add a user</h2>
        <div className="cards">
          <label>Full name<input value={f.name} onChange={e => setF({ ...f, name: e.target.value })} /></label>
          <label>Company email<input value={f.email} placeholder={`name@${DOMAIN}`} onChange={e => setF({ ...f, email: e.target.value })} /></label>
          <label>Temporary password<input value={f.password} onChange={e => setF({ ...f, password: e.target.value })} /></label>
          <label>Role<select value={f.role} onChange={e => setF({ ...f, role: e.target.value })}>{roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}</select></label>
          <label>Linked employee<select value={f.employeeId} onChange={e => setF({ ...f, employeeId: e.target.value })}>{empOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></label>
        </div>
        <button className="primary" type="submit">Create account</button>
      </form>
      <table>
        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Employee record</th><th>Password</th><th>Active</th><th></th></tr></thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td><Cell value={u.name} onChange={v => updateUser(u.id, { name: v })} /></td>
              <td>{u.email}</td>
              <td><Cell value={u.role} options={roles} onChange={v => updateUser(u.id, { role: v })} /></td>
              <td><Cell value={u.employeeId} options={empOptions} onChange={v => updateUser(u.id, { employeeId: Number(v) })} /></td>
              <td><Cell value={u.password} onChange={v => updateUser(u.id, { password: v })} /></td>
              <td><Cell value={u.active ? 'yes' : 'no'} options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]} onChange={v => updateUser(u.id, { active: v === 'yes' })} /></td>
              <td><button className="danger" disabled={u.id === user.id} onClick={() => deleteUser(u.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
