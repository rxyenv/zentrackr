import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Auth({ onDemo }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [msg, setMsg] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMsg(null)

    if (mode === 'login') {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) setError(err.message)
    } else {
      const { error: err } = await supabase.auth.signUp({ email, password })
      if (err) setError(err.message)
      else setMsg('Check your email to confirm your account.')
    }
    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-wordmark">
          Z<small>EN</small>T<small>RACKR</small>
        </div>
        <div style={{ fontSize: 13, color: 'var(--color-neutral-700)', marginBottom: 'var(--space-6)' }}>
          Programming progress
        </div>

        {error && <div className="error-msg">{error}</div>}
        {msg && (
          <div style={{ background: 'var(--color-neutral-100)', padding: 'var(--space-2) var(--space-3)', fontSize: 13, marginBottom: 'var(--space-3)', borderLeft: '3px solid var(--color-neutral-800)' }}>
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label>Email</label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>
          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? 'Loading…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <div className="auth-switch">
          {mode === 'login' ? (
            <>No account? <button onClick={() => setMode('signup')}>Sign up</button></>
          ) : (
            <>Have an account? <button onClick={() => setMode('login')}>Sign in</button></>
          )}
        </div>

        <div style={{ borderTop: '2px solid var(--color-divider)', marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)' }}>
          <button className="btn btn-secondary btn-block" onClick={onDemo} type="button">
            Try demo — no account needed
          </button>
        </div>
      </div>
    </div>
  )
}
