import { createContext, useContext, useMemo, useState } from 'react'
import {
  employees,
  leaveAllowances,
  initialLeave,
  initialTime,
  initialFringe,
  initialTaxTables
} from './data.js'
import { activeTable, payslip } from './tax.js'

const Store = createContext(null)

export function StoreProvider({ children }) {
  const [leave, setLeave] = useState(initialLeave)
  const [time, setTime] = useState(initialTime)
  const [fringe] = useState(initialFringe)
  const [taxTables, setTaxTables] = useState(initialTaxTables)
  const [payDate] = useState('2026-10-25')

  const table = activeTable(taxTables, payDate)

  const balances = useMemo(() => {
    const result = {}
    employees.forEach(e => {
      result[e.id] = { ...leaveAllowances }
      leave
        .filter(l => l.employeeId === e.id && l.status === 'Approved')
        .forEach(l => {
          result[e.id][l.type] -= l.days
        })
    })
    return result
  }, [leave])

  const payslips = useMemo(() => {
    return employees.map(e => ({
      employee: e,
      slip: payslip(e, fringe.filter(f => f.employeeId === e.id), table)
    }))
  }, [fringe, table])

  const value = {
    employees,
    leave,
    time,
    fringe,
    taxTables,
    table,
    balances,
    payslips,
    payDate,
    addLeave: request => setLeave(prev => [...prev, { ...request, id: prev.length + 1, status: 'Pending' }]),
    decideLeave: (id, status) => setLeave(prev => prev.map(l => (l.id === id ? { ...l, status } : l))),
    addTime: entry => setTime(prev => [...prev, { ...entry, id: prev.length + 1 }]),
    addTaxTable: t => setTaxTables(prev => [...prev, { ...t, id: prev.length + 1 }])
  }

  return <Store.Provider value={value}>{children}</Store.Provider>
}

export const useStore = () => useContext(Store)
