import { useStore } from '../store.jsx'
import { money } from '../tax.js'

export default function Employees() {
  const { employees } = useStore()
  return (
    <div>
      <h1>Employees</h1>
      <p className="sub">Employment register</p>
      <table>
        <thead>
          <tr><th>Name</th><th>Role</th><th>Department</th><th>Start date</th><th>Monthly basic</th></tr>
        </thead>
        <tbody>
          {employees.map(e => (
            <tr key={e.id}>
              <td>{e.name}</td>
              <td>{e.role}</td>
              <td>{e.department}</td>
              <td>{e.start}</td>
              <td>{money(e.monthlyGross)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
