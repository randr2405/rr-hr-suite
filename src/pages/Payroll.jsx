import { useStore } from '../store.jsx'
import { money } from '../tax.js'
import Cell from '../components/Cell.jsx'

export default function Payroll() {
  const { payslips, table, payDate, setPayDate } = useStore()
  const sum = key => payslips.reduce((s, p) => s + p.slip[key], 0)

  return (
    <div>
      <h1>Payroll</h1>
      <p className="sub">PAYE calculated automatically from the {table.label}. Edit salaries and allowances on the Employees page.</p>
      <div className="toolbar">
        <label className="inline">Pay date
          <Cell type="date" value={payDate} onChange={setPayDate} />
        </label>
      </div>
      <table>
        <thead>
          <tr>
            <th>Employee</th><th>Basic</th><th>Taxable travel</th><th>Non-taxable travel</th>
            <th>Taxable fringe</th><th>PAYE</th><th>UIF</th><th>SDL (employer)</th><th>Net pay</th>
          </tr>
        </thead>
        <tbody>
          {payslips.map(({ employee, slip }) => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>{money(slip.basic)}</td>
              <td>{money(slip.travelTaxable)}</td>
              <td>{money(slip.travelNonTaxable)}</td>
              <td>{money(slip.fringeTaxable)}</td>
              <td>{money(slip.paye)}</td>
              <td>{money(slip.uif)}</td>
              <td>{money(slip.sdl)}</td>
              <td><strong>{money(slip.net)}</strong></td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>Totals</td>
            <td>{money(sum('basic'))}</td>
            <td>{money(sum('travelTaxable'))}</td>
            <td>{money(sum('travelNonTaxable'))}</td>
            <td>{money(sum('fringeTaxable'))}</td>
            <td>{money(sum('paye'))}</td>
            <td>{money(sum('uif'))}</td>
            <td>{money(sum('sdl'))}</td>
            <td>{money(sum('net'))}</td>
          </tr>
        </tfoot>
      </table>
      <button className="primary" onClick={() => window.print()}>Print payroll</button>
    </div>
  )
}
