import { createContext, useContext, useEffect, useState } from 'react'

// Change this to your firm's real email domain. Only addresses ending in it can sign in.
export const DOMAIN = 'rr-accountants.co.za'

// Which pages each role may open. Edit freely.
const ACCESS = { admin: '*', manager: ['/', '/leave', '/time'], employee: ['/', '/leave', '/time'] }
export const can = (role, path) => ACCESS[role] === '*' || (ACCESS[role] || []).includes(path)

const seedUsers = [
  { id: 1, name: 'Thandi Mokoena', email: `thandi@${DOMAIN}`, password: 'Admin@123', role: 'admin', employeeId: 1, active: true },
  { id: 2, name: 'Aisha Naidoo', email: `aisha@${DOMAIN}`, password: 'Manager@123', role: 'manager', employeeId: 3, active: true },
  { id: 3, name: 'Sipho Dlamini', email: `sipho@${DOMAIN}`, password: 'Employee@123', role: 'employee', employeeId: 4, active: true }
]
const KEY = 'rr-hr-auth-v1'
const SESSION = 'rr-hr-session-v1'
const Auth = createContext(null)

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || seedUsers } catch { return seedUsers }
  })
  const [email, setEmail] = useState(() => localStorage.getItem(SESSION))
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(users)) } catch { /* ignore */ } }, [users])

  const user = users.find(u => u.email === email && u.active) || null

  const value = {
    user, users,
    login: (e, p) => {
      const em = e.trim().toLowerCase()
      if (!em.endsWith('@' + DOMAIN)) return `Please sign in with your @${DOMAIN} email address.`
      const u = users.find(x => x.email === em && x.password === p && x.active)
      if (!u) return 'Incorrect email or password, or the account is disabled.'
      localStorage.setItem(SESSION, em)
      setEmail(em)
      return null
    },
    logout: () => { localStorage.removeItem(SESSION); setEmail(null) },
    addUser: u => {
      const em = u.email.trim().toLowerCase()
      if (!em.endsWith('@' + DOMAIN)) return `Email must end in @${DOMAIN}`
      if (users.some(x => x.email === em)) return 'That email already has an account.'
      if (!u.name.trim() || u.password.length < 8) return 'Enter a name and a password of 8+ characters.'
      setUsers(p => [...p, { ...u, email: em, id: p.reduce((m, x) => Math.max(m, x.id), 0) + 1, active: true }])
      return null
    },
    updateUser: (id, patch) => setUsers(p => p.map(x => (x.id === id ? { ...x, ...patch } : x))),
    deleteUser: id => setUsers(p => p.filter(x => x.id !== id))
  }
  return <Auth.Provider value={value}>{children}</Auth.Provider>
}
export const useAuth = () => useContext(Auth)
