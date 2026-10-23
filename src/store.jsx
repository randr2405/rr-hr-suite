import { createContext, useContext, useMemo, useState } from 'react'
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

const nextId = list => list.reduce((m, x) => Math.max(m, x.id), 0) + 1
const patchList = (setter, id, patch) => setter(prev => prev.map(x => (x.id === id ? { ...x, ...patch } : x)))
const removeFrom = (setter, id) => setter(prev => prev.filter(x => x.id !== id))
const today = () => new Date().toISOString().slice(0, 10)

export function StoreProvider({ children }) {
  const [employees, setEmployees] = useState(seedEmployees)
  const [allowances, setAllowances] = useState(leaveAllowances)
  const [leave, setLeave] = useState(initialLeave)
  const [time, setTime] = useState(initialTime)
  const [fringe, setFringe] = useState(initialFringe)
  const [taxTables, setTaxTables] = useState(initialTaxTables)
  const [payDate, setPayDate] = useState('2026-10-25')

  const table = activeTable(taxTables, payDate)

  const balances = useMemo(() => {
    const result = {}
    employees.forEach(e => {
      result[e.id] = { ...allowances }
      leave
        .filter(l => l.employeeId === e.id && l.status === 'Approved')
        .forEach(l => {
          result[e.id][l.type] -= Number(l.days)
        })
    })
    return result
  }, [employees, leave, allowances])

  const payslips = useMemo(() => {
    return employees.map(e => ({
      employee: e,
      slip: payslip(e, fringe.filter(f => f.employeeId === e.id), table)
    }))
  }, [employees, fringe, table])

  const firstId = employees.length ? employees[0].id : 0

  const value = {
    employees,
    allowances,
    leave,
    time,
    fringe,
    taxTables,
    table,
    balances,
    payslips,
    payDate,
    setPayDate,
    setAllowance: (type, v) => setAllowances(prev => ({ ...prev, [type]: v })),
    addEmployee: () =>
      setEmployees(prev => [
        ...prev,
        { id: nextId(prev), name: 'New employee', role: 'Role', department: 'Audit', start: today(), monthlyGross: 30000, petrolAllowance: 0, age: 30 }
      ]),
    updateEmployee: (id, patch) => patchList(setEmployees, id, patch),
    deleteEmployee: id => {
      removeFrom(setEmployees, id)
      setLeave(prev => prev.filter(x => x.employeeId !== id))
      setTime(prev => prev.filter(x => x.employeeId !== id))
      setFringe(prev => prev.filter(x => x.employeeId !== id))
    },
    addLeave: request => setLeave(prev => [...prev, { ...request, id: nextId(prev), status: request.status || 'Pending' }]),
    updateLeave: (id, patch) => patchList(setLeave, id, patch),
    deleteLeave: id => removeFrom(setLeave, id),
    addTime: entry => setTime(prev => [...prev, { ...entry, id: nextId(prev) }]),
    updateTime: (id, patch) => patchList(setTime, id, patch),
    deleteTime: id => removeFrom(setTime, id),
    addFringe: () =>
      setFringe(prev => [
        ...prev,
        { id: nextId(prev), employeeId: firstId, benefit: 'New benefit', monthlyValue: 1000, taxable: true }
      ]),
    updateFringe: (id, patch) => patchList(setFringe, id, patch),
    deleteFringe: id => removeFrom(setFringe, id),
    addTaxTable: t => setTaxTables(prev => [...prev, { ...t, id: nextId(prev) }]),
    updateTaxTable: (id, patch) => patchList(setTaxTables, id, patch),
    updateRebate: (id, key, v) =>
      setTaxTables(prev => prev.map(t => (t.id === id ? { ...t, rebates: { ...t.rebates, [key]: v } } : t))),
    updateBracket: (id, index, patch) =>
      setTaxTables(prev =>
        prev.map(t =>
          t.id === id ? { ...t, brackets: t.brackets.map((b, i) => (i === index ? { ...b, ...patch } : b)) } : t
        )
      ),
    deleteTaxTable: id => setTaxTables(prev => (prev.length > 1 ? prev.filter(t => t.id !== id) : prev))
  }

  return <Store.Provider value={value}>{children}</Store.Provider>
}

export const useStore = () => useContext(Store)
