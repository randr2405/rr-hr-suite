import { NavLink, useLocation } from 'react-router-dom'
import { useStore } from '../store.jsx'

const groups = [
  { title: 'Overview', links: [{ to: '/', label: 'Dashboard' }] },
  { title: 'People', links: [{ to: '/employees', label: 'Employees' }, { to: '/leave', label: 'Leave' }, { to: '/time', label: 'Time Studies' }] },
  { title: 'Finance', links: [{ to: '/payroll', label: 'Payroll' }, { to: '/fringe', label: 'Fringe Benefits' }, { to: '/tax', label: 'SARS Tax Settings' }] },
  { title: 'Insight', links: [{ to: '/reports', label: 'Reports' }] }
]

export default function Layout({ children }) {
  const { toast } = useStore()
  const { pathname } = useLocation()
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">R&amp;R</span>
          <span className="brand-text">HR Suite<small>Chartered Accountants</small></span>
        </div>
        <nav>
          {groups.map(g => (
            <div key={g.title} className="nav-group">
              <div className="nav-title">{g.title}</div>
              {g.links.map(l => (
                <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({ isActive }) => (isActive ? 'nav active' : 'nav')}>
                  {l.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-foot">
          <span className="avatar">TM</span>
          <span>Thandi Mokoena<small>Audit Partner</small></span>
        </div>
      </aside>
      <main className="content">
        <div className="page" key={pathname}>{children}</div>
      </main>
      {toast && <div className="toast" key={toast.k}><i />{toast.msg}</div>}
    </div>
  )
}
