import { useState } from 'react'
import { useStore } from '../store.jsx'
import Cell from '../components/Cell.jsx'

export default function TaxSettings() {
  const { taxTables, table, addTaxTable, updateTaxTable, updateRebate, updateBracket, deleteTaxTable } = useStore()
  const [effectiveFrom, setEffectiveFrom] = useState('2026-03-01')
  const [label, setLabel] = useState('2026/27 tax year')
  const [bump, setBump] = useState(0)

  const create = e => {
    e.preventDefault()
    const factor = 1 + Number(bump) / 100
    const base = table
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
      <p className="sub">Edit any rate below and PAYE recalculates for every employee instantly. Add a new table with a later effective date and it takes over automatically.</p>
      <div className="grid2">
        <form className="panel" onSubmit={create}>
          <h2>Add new tax table (copies the active one)</h2>
          <label>Label<input value={label} onChange={e => setLabel(e.target.value)} /></label>
          <label>Effective from<input type="date" value={effectiveFrom} onChange={e => setEffectiveFrom(e.target.value)} /></label>
          <label>Bracket adjustment (%)<input type="number" step="0.1" value={bump} onChange={e => setBump(e.target.value)} /></label>
          <button type="submit" className="primary">Save tax table</button>
        </form>
        <div className="panel">
          <h2>Tax tables</h2>
          <table>
            <thead><tr><th>Label</th><th>Effective from</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {taxTables.map(t => (
                <tr key={t.id}>
                  <td><Cell value={t.label} onChange={v => updateTaxTable(t.id, { label: v })} /></td>
                  <td><Cell type="date" value={t.effectiveFrom} onChange={v => updateTaxTable(t.id, { effectiveFrom: v })} /></td>
                  <td>{t.id === table.id ? 'Active' : 'Stored'}</td>
                  <td><button className="danger" onClick={() => deleteTaxTable(t.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <h2>Active table: general rates</h2>
      <div className="cards">
        <div className="card"><span>Primary rebate (R)</span><Cell type="number" value={table.rebates.primary} onChange={v => updateRebate(table.id, 'primary', v)} /></div>
        <div className="card"><span>Secondary rebate (R)</span><Cell type="number" value={table.rebates.secondary} onChange={v => updateRebate(table.id, 'secondary', v)} /></div>
        <div className="card"><span>Tertiary rebate (R)</span><Cell type="number" value={table.rebates.tertiary} onChange={v => updateRebate(table.id, 'tertiary', v)} /></div>
        <div className="card"><span>UIF rate (%)</span><Cell type="number" value={Math.round(table.uifRate * 10000) / 100} onChange={v => updateTaxTable(table.id, { uifRate: v / 100 })} /></div>
        <div className="card"><span>UIF monthly cap (R)</span><Cell type="number" value={table.uifMonthlyCap} onChange={v => updateTaxTable(table.id, { uifMonthlyCap: v })} /></div>
        <div className="card"><span>SDL rate (%)</span><Cell type="number" value={Math.round(table.sdlRate * 10000) / 100} onChange={v => updateTaxTable(table.id, { sdlRate: v / 100 })} /></div>
        <div className="card"><span>Travel allowance taxable (%)</span><Cell type="number" value={Math.round(table.travelTaxablePercent * 10000) / 100} onChange={v => updateTaxTable(table.id, { travelTaxablePercent: v / 100 })} /></div>
      </div>
      <h2>Active table: PAYE brackets</h2>
      <table>
        <thead>
          <tr><th>Taxable income up to (R)</th><th>Base tax (R)</th><th>Rate on excess (%)</th><th>Excess over (R)</th></tr>
        </thead>
        <tbody>
          {table.brackets.map((b, i) => (
            <tr key={i}>
              <td>
                {b.upTo === Infinity
                  ? 'Above'
                  : <Cell type="number" value={b.upTo} onChange={v => updateBracket(table.id, i, { upTo: v })} />}
              </td>
              <td><Cell type="number" value={b.base} onChange={v => updateBracket(table.id, i, { base: v })} /></td>
              <td><Cell type="number" value={Math.round(b.rate * 10000) / 100} onChange={v => updateBracket(table.id, i, { rate: v / 100 })} /></td>
              <td><Cell type="number" value={b.over} onChange={v => updateBracket(table.id, i, { over: v })} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
