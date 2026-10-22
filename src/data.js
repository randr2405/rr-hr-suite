export const employees = [
  { id: 1, name: 'Thandi Mokoena', role: 'Audit Partner', department: 'Audit', start: '2019-03-01', monthlyGross: 78000, petrolAllowance: 4500, age: 44 },
  { id: 2, name: 'Pieter van Wyk', role: 'Senior Auditor', department: 'Audit', start: '2020-07-15', monthlyGross: 52000, petrolAllowance: 3000, age: 38 },
  { id: 3, name: 'Aisha Naidoo', role: 'Audit Manager', department: 'Audit', start: '2021-01-11', monthlyGross: 64000, petrolAllowance: 3500, age: 35 },
  { id: 4, name: 'Sipho Dlamini', role: 'Junior Auditor', department: 'Audit', start: '2023-02-06', monthlyGross: 28000, petrolAllowance: 1500, age: 26 },
  { id: 5, name: 'Lerato Khumalo', role: 'Office Administrator', department: 'Admin', start: '2022-05-02', monthlyGross: 22000, petrolAllowance: 0, age: 31 }
]

export const leaveAllowances = { sick: 30, annual: 15, family: 3 }

export const initialLeave = [
  { id: 1, employeeId: 2, type: 'annual', from: '2026-08-10', to: '2026-08-14', days: 5, status: 'Approved', note: null },
  { id: 2, employeeId: 4, type: 'sick', from: '2026-09-03', to: '2026-09-04', days: 2, status: 'Approved', note: 'sick-note-sipho.pdf' }
]

export const initialTime = [
  { id: 1, employeeId: 2, client: 'Greenfield Holdings', task: 'Fieldwork', hours: 7.5, date: '2026-10-19' },
  { id: 2, employeeId: 3, client: 'Greenfield Holdings', task: 'Review', hours: 4, date: '2026-10-19' },
  { id: 3, employeeId: 4, client: 'Harbour Logistics', task: 'Fieldwork', hours: 8, date: '2026-10-20' },
  { id: 4, employeeId: 2, client: 'Harbour Logistics', task: 'Reporting', hours: 3.5, date: '2026-10-21' }
]

export const initialFringe = [
  { id: 1, employeeId: 1, benefit: 'Medical aid employer contribution', monthlyValue: 6200, taxable: true },
  { id: 2, employeeId: 2, benefit: 'Medical aid employer contribution', monthlyValue: 4800, taxable: true },
  { id: 3, employeeId: 3, benefit: 'Medical aid employer contribution', monthlyValue: 5200, taxable: true },
  { id: 4, employeeId: 4, benefit: 'Medical aid employer contribution', monthlyValue: 2400, taxable: true }
]

export const initialTaxTables = [
  {
    id: 1,
    label: '2025/26 tax year',
    effectiveFrom: '2025-03-01',
    brackets: [
      { upTo: 237100, base: 0, rate: 0.18, over: 0 },
      { upTo: 370500, base: 42678, rate: 0.26, over: 237100 },
      { upTo: 512800, base: 77362, rate: 0.31, over: 370500 },
      { upTo: 673000, base: 121475, rate: 0.36, over: 512800 },
      { upTo: 857900, base: 179147, rate: 0.39, over: 673000 },
      { upTo: 1817000, base: 251258, rate: 0.41, over: 857900 },
      { upTo: Infinity, base: 644489, rate: 0.45, over: 1817000 }
    ],
    rebates: { primary: 17235, secondary: 9444, tertiary: 3145 },
    uifRate: 0.01,
    uifMonthlyCap: 177.12,
    sdlRate: 0.01,
    travelTaxablePercent: 0.8,
    petrolRatePerKm: 4.76
  }
]
