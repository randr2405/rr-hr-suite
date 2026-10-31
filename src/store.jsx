import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  employees as seedEmployees,
  leaveAllowances,
  initialLeave,
  initialTime,
  initialFringe,
  initialTaxTables
} from './data.js'
import { activeTable, payslip } from './tax.js'

const Store = createContext(null)
const KEY = 'rr-hr-suite-v2'

const nextId = list => list.reduce((m, x) => Math.max(m, x.id), 0) + 1
const patchList = (setter, id, patch) => setter(prev => prev.map(x => (x.id === id ? { ...x, ...patch } : x)))
const removeFrom = (setter, id) => setter(prev => prev.filter(x => x.id !== id))

const pad = n => String(n).padStart(2, '0')
export const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const today = () => iso(new Date())
export const fmtDate = d => d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })

// South African public holidays 2026 (Women's Day observed Monday 10 Aug as the 9th is a Sunday)
const HOLIDAYS = new Set([
  '2026-01-01', '2026-03-21', '2026-04-03', '2026-04-06', '2026-04-27', '2026-05-01',
  '2026-06-16', '2026-08-10', '2026-09-24', '2026-12-16', '2026-12-25', '2026-12-26'
])
const isOff = d => d.getDay() === 0 || d.getDay() === 6 || HOLIDAYS.has(iso(d))

export function workingDays(from, to) {
  if (!from || !to) return 0
  let n = 0
  for (let d = new Date(from + 'T00:00'); d <= new Date(to + 'T00:00'); d.setDate(d.getDate() + 1)) if (!isOff(d)) n++
  return n
}
export function prevWorkingDay(d) {
  const x = new Date(d)
  while (isOff(x)) x.setDate(x.getDate() - 1)
  return x
}
const payDay = () => iso(prevWorkingDay(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)))

const saved = (() => {
  try { return JSON.parse(localStorage.getItem(KEY)) } catch { return null }
})()
const init = (k, seed) => (saved && saved[k] !== undefined ? saved[k] : seed)
const revive = tables => tables.map(t => ({ ...t, brackets: t.brackets.map(b => ({ ...b, upTo: b.upTo == null ? Infinity : b.upTo })) }))

export function StoreProvider({ children }) {
  const [employees, setEmployees] = useState(() => init('employees', seedEmployees))
  const [allowances, setAllowances] = useState(() => init('allowances', leaveAllowances))
  const [leave, setLeave] = useState(() => init('leave', initialLeave))
  const [time, setTime] = useState(() => init('time', initialTime))
  const [fringe, setFringe] = useState(() => init('fringe', initialFringe))
  const [taxTables, setTaxTables] = useState(() => revive(init('taxTables', initialTaxTables)))
  const [payDate, setPayDate] = useState(() => init('payDate', payDay()))
  const [settings, setSettings] = useState(() => init('settings', { autoApprove: true }))
  const [toast, setToast] = useState(null)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ employees, allowances, leave, time, fringe, taxTables, payDate, settings }))
    } catch { /* storage unavailable */ }
  }, [employees, allowances, leave, time, fringe, taxTables, payDate, settings])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3800)
    return () => clearTimeout(t)
  }, [toast])
  const notify = msg => setToast({ msg, k: Date.now() })

  const table = activeTable(taxTables, payDate)

  const balances = useMemo(() => {
    const result = {}
    employees.forEach(e => {
      result[e.id] = { ...allowances }
      leave
        .filter(l => l.employeeId === e.id && l.status === 'Approved')
        .forEach(l => { result[e.id][l.type] -= Number(l.days) })
    })
    return result
  }, [employees, leave, allowances])

  const payslips = useMemo(
    () => employees.map(e => ({ employee: e, slip: payslip(e, fringe.filter(f => f.employeeId === e.id), table) })),
    [employees, fringe, table]
  )

  const firstId = employees.length ? employees[0].id : 0

  const value = {
    employees, allowances, leave, time, fringe, taxTables, table, balances, payslips, payDate, setPayDate,
    settings, setSettings, toast, notify,
    resetDemo: () => { localStorage.removeItem(KEY); window.location.reload() },
    setAllowance: (type, v) => setAllowances(prev => ({ ...prev, [type]: v })),
    addEmployee: () => {
      setEmployees(prev => [...prev, { id: nextId(prev), name: 'New employee', role: 'Role', department: 'Audit', start: today(), monthlyGross: 30000, petrolAllowance: 0, age: 30 }])
      notify('Employee added. Payroll, leave balances and reports updated.')
    },
    updateEmployee: (id, patch) => patchList(setEmployees, id, patch),
    deleteEmployee: id => {
      removeFrom(setEmployees, id)
      setLeave(prev => prev.filter(x => x.employeeId !== id))
      setTime(prev => prev.filter(x => x.employeeId !== id))
      setFringe(prev => prev.filter(x => x.employeeId !== id))
    },
    // Smart intake: working days exclude weekends and SA public holidays, then the request is routed automatically.
    addLeave: r => {
      const days = workingDays(r.from, r.to)
      const left = balances[r.employeeId] ? balances[r.employeeId][r.type] : 0
      const needsNote = r.type === 'sick' && days > 2 && !r.note
      const fits = days <= left
      const status = settings.autoApprove && fits && !needsNote ? 'Approved' : 'Pending'
      setLeave(prev => [...prev, { ...r, days, id: nextId(prev), status }])
      notify(
        status === 'Approved'
          ? `Auto-approved: ${days} working day${days === 1 ? '' : 's'}. Balance updated.`
          : needsNote
            ? 'Sent for review: a sick note is required for 3 or more days.'
            : !fits
              ? 'Sent for review: request exceeds the available balance.'
              : 'Request submitted for review.'
      )
    },
    updateLeave: (id, patch) =>
      setLeave(prev => prev.map(x => {
        if (x.id !== id) return x
        const m = { ...x, ...patch }
        if ('from' in patch || 'to' in patch) m.days = workingDays(m.from, m.to)
        return m
      })),
    decideLeave: (id, status) => { patchList(setLeave, id, { status }); notify(`Request ${status.toLowerCase()}.`) },
    deleteLeave: id => removeFrom(setLeave, id),
    addTime: entry => { setTime(prev => [...prev, { ...entry, id: nextId(prev) }]); notify('Time captured.') },
    updateTime: (id, patch) => patchList(setTime, id, patch),
    deleteTime: id => removeFrom(setTime, id),
    addFringe: () => setFringe(prev => [...prev, { id: nextId(prev), employeeId: firstId, benefit: 'New benefit', monthlyValue: 1000, taxable: true }]),
    updateFringe: (id, patch) => patchList(setFringe, id, patch),
    deleteFringe: id => removeFrom(setFringe, id),
    addTaxTable: t => { setTaxTables(prev => [...prev, { ...t, id: nextId(prev) }]); notify('Tax table saved. It activates automatically on its effective date.') },
    updateTaxTable: (id, patch) => patchList(setTaxTables, id, patch),
    updateRebate: (id, key, v) => setTaxTables(prev => prev.map(t => (t.id === id ? { ...t, rebates: { ...t.rebates, [key]: v } } : t))),
    updateBracket: (id, index, patch) =>
      setTaxTables(prev => prev.map(t => (t.id === id ? { ...t, brackets: t.brackets.map((b, i) => (i === index ? { ...b, ...patch } : b)) } : t))),
    deleteTaxTable: id => setTaxTables(prev => (prev.length > 1 ? prev.filter(t => t.id !== id) : prev))
  }

  return <Store.Provider value={value}>{children}</Store.Provider>
}

export const useStore = () => useContext(Store)
