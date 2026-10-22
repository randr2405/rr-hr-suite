export function activeTable(tables, onDate) {
  const sorted = [...tables].sort((a, b) => b.effectiveFrom.localeCompare(a.effectiveFrom))
  return sorted.find(t => t.effectiveFrom <= onDate) || sorted[sorted.length - 1]
}

export function annualTax(table, taxableAnnual, age) {
  const bracket = table.brackets.find(b => taxableAnnual <= b.upTo)
  const gross = bracket.base + (taxableAnnual - bracket.over) * bracket.rate
  let rebate = table.rebates.primary
  if (age >= 65) rebate += table.rebates.secondary
  if (age >= 75) rebate += table.rebates.tertiary
  return Math.max(0, gross - rebate)
}

export function payslip(employee, fringeItems, table) {
  const travelTaxable = employee.petrolAllowance * table.travelTaxablePercent
  const travelNonTaxable = employee.petrolAllowance - travelTaxable
  const fringeTaxable = fringeItems.filter(f => f.taxable).reduce((s, f) => s + f.monthlyValue, 0)
  const taxableMonthly = employee.monthlyGross + travelTaxable + fringeTaxable
  const paye = annualTax(table, taxableMonthly * 12, employee.age) / 12
  const uif = Math.min(employee.monthlyGross * table.uifRate, table.uifMonthlyCap)
  const sdl = employee.monthlyGross * table.sdlRate
  const grossPay = employee.monthlyGross + employee.petrolAllowance
  const net = grossPay - paye - uif
  return {
    basic: employee.monthlyGross,
    travelTaxable,
    travelNonTaxable,
    fringeTaxable,
    taxableMonthly,
    paye,
    uif,
    sdl,
    grossPay,
    net
  }
}

export const money = n =>
  'R ' + Number(n).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
