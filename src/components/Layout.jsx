import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/employees', label: 'Employees' },
  { to: '/leave', label: 'Leave' },
  { to: '/payroll', label: 'Payroll' },
  { to: '/fringe', label: 'Fringe Benefits' },
  { to: '/time', label: 'Time Studies' },
  { to: '/tax', label: 'SARS Tax Settings' }
]

export default function Layout({ children }) {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">R&R</span>
          <span className="brand-text">HR Suite</span>
        </div>
        <nav>
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({ isActive }) => (isActive ? 'nav active' : 'nav')}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-foot">Demo build · mock data</div>
      </aside>
      <main className="content">{children}</main>
    </div>
  )
}
