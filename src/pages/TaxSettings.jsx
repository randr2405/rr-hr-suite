import { useState } from 'react'
import { useStore } from '../store.jsx'

export default function TaxSettings() {
  const { taxTables, table, addTaxTable } = useStore()
  const [effectiveFrom, setEffectiveFrom] = useState('2026-03-01')
  const [label, setLabel] = useState('2026/27 tax year')
  const [bump, setBump] = useState(0)

  const create = e => {
    e.preventDefault()
    const factor = 1 + Number(bump) / 100
    const base = taxTables[taxTables.length - 1]
    addTaxTable({
      ...base,
      label,
      effectiveFrom,
      brackets: base.brackets.map(b => ({
        ...b,
        upTo: b.upTo === Infinity ? Infinity : Math.round(b.upTo * factor),
        over: Math.round(b.over * factor),
        base: Math.round(b.base * factor)
      }))
    })
  }

  return (
    <div>
      <h1>SARS Tax Settings</h1>
      <p className="sub">Add a new tax table once and PAYE recalculates for every employee. No manual changes per payslip.</p>
      <div className="grid2">
        <form className="panel" onSubmit={create}>
          <h2>Add new tax table</h2>
          <label>Label<input value={label} onChange={e => setLabel(e.target.value)} /></label>
          <label>Effective from<input type="date" value={effectiveFrom} onChange={e => setEffectiveFrom(e.target.value)} /></label>
          <label>Bracket adjustment (%)<input type="number" step="0.1" value={bump} onChange={e => setBump(e.target.value)} /></label>
          <button type="submit" className="primary">Save tax table</button>
        </form>
        <div className="panel">
          <h2>Tax tables</h2>
          <table>
            <thead><tr><th>Label</th><th>Effective from</th><th>Status</th></tr></thead>
            <tbody>
              {taxTables.map(t => (
                <tr key={t.id}><td>{t.label}</td><td>{t.effectiveFrom}</td><td>{t.id === table.id ? 'Active' : 'Stored'}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <h2>Active brackets</h2>
      <table>
        <thead><tr><th>Taxable income up to</th><th>Base tax</th><th>Rate on excess</th></tr></thead>
        <tbody>
          {table.brackets.map((b, i) => (
            <tr key={i}>
              <td>{b.upTo === Infinity ? 'Above' : 'R ' + b.upTo.toLocaleString('en-ZA')}</td>
              <td>R {b.base.toLocaleString('en-ZA')}</td>
              <td>{Math.round(b.rate * 100)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
