import { useState } from 'react'
import { useStore } from '../store.jsx'
import { money } from '../tax.js'

const toCsv = (columns, rows) =>
  [columns, ...rows].map(r => r.map(c => '"' + String(c).replace(/"/g, '""') + '"').join(',')).join('\n')

function download(filename, text) {
  const blob = new Blob([text], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function Reports() {
  const { employees, payslips, leave, balances, time, fringe, table, payDate } = useStore()
  const [active, setActive] = useState('payroll')

  const name = id => {
    const found = employees.find(e => e.id === id)
    return found ? found.name : 'Unknown'
  }
  const sum = key => payslips.reduce((s, p) => s + p.slip[key], 0)

  const hoursBy = keyFn => {
    const acc = {}
    time.forEach(t => {
      const k = keyFn(t)
      acc[k] = (acc[k] || 0) + Number(t.hours)
    })
    return Object.entries(acc).map(([k, v]) => [k, v])
  }

  const reports = {
    payroll: {
      title: 'Payroll summary',
      columns: ['Employee', 'Basic', 'Taxable travel', 'Non-taxable travel', 'Taxable fringe', 'PAYE', 'UIF', 'SDL', 'Net pay'],
      rows: payslips.map(({ employee, slip }) => [
        employee.name,
        money(slip.basic),
        money(slip.travelTaxable),
        money(slip.travelNonTaxable),
        money(slip.fringeTaxable),
        money(slip.paye),
        money(slip.uif),
        money(slip.sdl),
        money(slip.net)
      ])
    },
    taxable: {
      title: 'Taxable and non-taxable earnings',
      columns: ['Employee', 'Taxable income', 'Non-taxable allowances', 'Gross pay'],
      rows: payslips.map(({ employee, slip }) => [
        employee.name,
        money(slip.taxableMonthly),
        money(slip.travelNonTaxable),
        money(slip.grossPay)
      ])
    },
    emp201: {
      title: 'Monthly SARS return summary (EMP201 style)',
      columns: ['Item', 'Amount'],
      rows: [
        ['Tax table used', table.label],
        ['Pay date', payDate],
        ['PAYE', money(sum('paye'))],
        ['UIF (employee and employer)', money(sum('uif') * 2)],
        ['SDL', money(sum('sdl'))],
        ['Total payable to SARS', money(sum('paye') + sum('uif') * 2 + sum('sdl'))]
      ]
    },
    balances: {
      title: 'Leave balances',
      columns: ['Employee', 'Sick days left', 'Annual days left', 'Family days left'],
      rows: employees.map(e => {
        const b = balances[e.id]
        return [e.name, b.sick, b.annual, b.family]
      })
    },
    register: {
      title: 'Leave register',
      columns: ['Employee', 'Type', 'From', 'To', 'Days', 'Status', 'Sick note'],
      rows: leave.map(l => [name(l.employeeId), l.type, l.from, l.to, l.days, l.status, l.note || '-'])
    },
    timeClient: {
      title: 'Time studies by client',
      columns: ['Client', 'Hours'],
      rows: hoursBy(t => t.client)
    },
    timeEmployee: {
      title: 'Time studies by employee',
      columns: ['Employee', 'Hours'],
      rows: hoursBy(t => name(t.employeeId))
    },
    fringe: {
      title: 'Fringe benefits',
      columns: ['Employee', 'Benefit', 'Monthly value', 'Taxable'],
      rows: fringe.map(f => [name(f.employeeId), f.benefit, money(f.monthlyValue), f.taxable ? 'Yes' : 'No'])
    }
  }

  const current = reports[active]

  return (
    <div>
      <h1>Reports</h1>
      <p className="sub">Generated automatically from the live data. Export to CSV or print.</p>
      <div className="tabs">
        {Object.entries(reports).map(([key, r]) => (
          <button key={key} className={key === active ? 'tab active' : 'tab'} onClick={() => setActive(key)}>
            {r.title}
          </button>
        ))}
      </div>
      <div className="toolbar">
        <button className="primary" onClick={() => download(active + '.csv', toCsv(current.columns, current.rows))}>Export CSV</button>
        <button onClick={() => window.print()}>Print</button>
      </div>
      <h2>{current.title}</h2>
      <table>
        <thead>
          <tr>{current.columns.map(c => <th key={c}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {current.rows.map((row, i) => (
            <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
