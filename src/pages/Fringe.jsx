import { useStore } from '../store.jsx'
import Cell from '../components/Cell.jsx'

export default function Fringe() {
  const { fringe, employees, addFringe, updateFringe, deleteFringe } = useStore()
  const empOptions = employees.map(e => ({ value: e.id, label: e.name }))
  const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]

  return (
    <div>
      <h1>Fringe Benefits</h1>
      <p className="sub">Kept as a separate page. Taxable values feed into PAYE on the Payroll page. Everything is editable.</p>
      <div className="toolbar">
        <button className="primary" onClick={addFringe} disabled={!employees.length}>+ Add benefit</button>
      </div>
      <table>
        <thead>
          <tr><th>Employee</th><th>Benefit</th><th>Monthly value (R)</th><th>Taxable</th><th></th></tr>
        </thead>
        <tbody>
          {fringe.map(f => (
            <tr key={f.id}>
              <td><Cell value={f.employeeId} options={empOptions} onChange={v => updateFringe(f.id, { employeeId: Number(v) })} /></td>
              <td><Cell value={f.benefit} onChange={v => updateFringe(f.id, { benefit: v })} /></td>
              <td><Cell type="number" value={f.monthlyValue} onChange={v => updateFringe(f.id, { monthlyValue: v })} /></td>
              <td><Cell value={f.taxable ? 'yes' : 'no'} options={yesNo} onChange={v => updateFringe(f.id, { taxable: v === 'yes' })} /></td>
              <td><button className="danger" onClick={() => deleteFringe(f.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
