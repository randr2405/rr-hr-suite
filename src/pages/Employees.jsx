import { useStore } from '../store.jsx'
import Cell from '../components/Cell.jsx'

export default function Employees() {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useStore()
  return (
    <div>
      <h1>Employees</h1>
      <p className="sub">Employment register. Click any cell to edit. Changes flow through leave, payroll and reports.</p>
      <div className="toolbar">
        <button className="primary" onClick={addEmployee}>+ Add employee</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Role</th><th>Department</th><th>Start date</th>
            <th>Age</th><th>Monthly basic (R)</th><th>Petrol allowance (R)</th><th></th>
          </tr>
        </thead>
        <tbody>
          {employees.map(e => (
            <tr key={e.id}>
              <td><Cell value={e.name} onChange={v => updateEmployee(e.id, { name: v })} /></td>
              <td><Cell value={e.role} onChange={v => updateEmployee(e.id, { role: v })} /></td>
              <td><Cell value={e.department} onChange={v => updateEmployee(e.id, { department: v })} /></td>
              <td><Cell type="date" value={e.start} onChange={v => updateEmployee(e.id, { start: v })} /></td>
              <td><Cell type="number" value={e.age} onChange={v => updateEmployee(e.id, { age: v })} /></td>
              <td><Cell type="number" value={e.monthlyGross} onChange={v => updateEmployee(e.id, { monthlyGross: v })} /></td>
              <td><Cell type="number" value={e.petrolAllowance} onChange={v => updateEmployee(e.id, { petrolAllowance: v })} /></td>
              <td><button className="danger" onClick={() => deleteEmployee(e.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
