import { NavLink, useLocation } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { useAuth, can } from '../auth.jsx'

const groups = [
  { title: 'Overview', links: [{ to: '/', label: 'Dashboard' }] },
  { title: 'People', links: [{ to: '/employees', label: 'Employees' }, { to: '/leave', label: 'Leave' }, { to: '/time', label: 'Time Studies' }] },
  { title: 'Finance', links: [{ to: '/payroll', label: 'Payroll' }, { to: '/fringe', label: 'Fringe Benefits' }, { to: '/tax', label: 'SARS Tax Settings' }] },
  { title: 'Insight', links: [{ to: '/reports', label: 'Reports' }] },
  { title: 'Admin', links: [{ to: '/access', label: 'Access Control' }] }
]
const initials = n => n.split(' ').map(w => w[0]).slice(0, 2).join('')

export default function Layout({ children }) {
  const { toast } = useStore()
  const { user, logout } = useAuth()
  const { pathname } = useLocation()
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">R&amp;R</span>
          <span className="brand-text">HR Suite<small>Chartered Accountants</small></span>
        </div>
        <nav>
          {groups.map(g => {
            const links = g.links.filter(l => can(user.role, l.to))
            return links.length ? (
              <div key={g.title} className="nav-group">
                <div className="nav-title">{g.title}</div>
                {links.map(l => (
                  <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({ isActive }) => (isActive ? 'nav active' : 'nav')}>
                    {l.label}
                  </NavLink>
                ))}
              </div>
            ) : null
          })}
        </nav>
        <div className="sidebar-foot">
          <span className="avatar">{initials(user.name)}</span>
          <span>{user.name}<small>{user.role}</small></span>
          <button className="signout" onClick={logout} title="Sign out">Sign out</button>
        </div>
      </aside>
      <main className="content">
        <div className="page" key={pathname}>{children}</div>
      </main>
      {toast && <div className="toast" key={toast.k}><i />{toast.msg}</div>}
    </div>
  )
}
