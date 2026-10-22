import { useStore } from '../store.jsx'
import { money } from '../tax.js'

export default function Fringe() {
  const { fringe, employees } = useStore()
  const name = id => employees.find(e => e.id === id).name
  return (
    <div>
      <h1>Fringe Benefits</h1>
      <p className="sub">Kept as a separate page. Taxable values feed into PAYE on the Payroll page.</p>
      <table>
        <thead>
          <tr><th>Employee</th><th>Benefit</th><th>Monthly value</th><th>Taxable</th></tr>
        </thead>
        <tbody>
          {fringe.map(f => (
            <tr key={f.id}>
              <td>{name(f.employeeId)}</td>
              <td>{f.benefit}</td>
              <td>{money(f.monthlyValue)}</td>
              <td>{f.taxable ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
