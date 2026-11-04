import { useState } from 'react'
import { useAuth, DOMAIN } from '../auth.jsx'

const SHOW_DEMO = true // set to false before real use to hide the demo sign-in buttons
const demos = [
  ['Admin', 'thandi', 'Admin@123'],
  ['Manager', 'aisha', 'Manager@123'],
  ['Employee', 'sipho', 'Employee@123']
]

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')

  const go = (e, p) => setErr(login(e, p) || '')

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={e => { e.preventDefault(); go(email, pw) }}>
        <span className="brand-mark">R&amp;R</span>
        <h1>Welcome back</h1>
        <p className="sub tight">Sign in with your company email to continue.</p>
        <label>Email<input type="email" autoFocus placeholder={`you@${DOMAIN}`} value={email} onChange={e => setEmail(e.target.value)} /></label>
        <label>Password<input type="password" value={pw} onChange={e => setPw(e.target.value)} /></label>
        {err && <div className="login-err">{err}</div>}
        <button className="primary wide" type="submit">Sign in</button>
        {SHOW_DEMO && (
          <div className="demo-accts">
            <span>Demo access</span>
            {demos.map(([label, user, p]) => (
              <button type="button" key={label} onClick={() => go(`${user}@${DOMAIN}`, p)}>{label}</button>
            ))}
          </div>
        )}
      </form>
    </div>
  )
}
