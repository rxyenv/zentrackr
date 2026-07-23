import { useState } from 'react'
import { supabase } from '../lib/supabase'

const HERO_STATS = [
  { value: '9', label: 'Rust curriculum modules, ready to go' },
  { value: '100%', label: 'Editable — make the roadmap yours' },
  { value: '1', label: 'Language today, more coming' },
]

const FEATURES = [
  { title: 'Topic roadmap', body: 'A Rust checklist from fundamentals to async, fully editable.' },
  { title: 'Session log', body: 'Log study time and notes, see your full history.' },
  { title: 'Streaks & goals', body: 'Track daily consistency against a target date.' },
  { title: 'Stats dashboard', body: 'Weekly minutes, completion by module, a 14-day heatmap.' },
]

export default function Landing({ onDemo }) {
  const [showAuth, setShowAuth] = useState(false)
  const [mode, setMode] = useState('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [msg, setMsg] = useState(null)

  function openSignIn() { setMode('signin'); setError(null); setMsg(null); setShowAuth(true) }
  function openSignUp() { setMode('signup'); setError(null); setMsg(null); setShowAuth(true) }
  function closeAuth() { setShowAuth(false); setError(null); setMsg(null) }
  function switchMode() { setMode(m => m === 'signup' ? 'signin' : 'signup'); setError(null); setMsg(null) }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMsg(null)
    if (mode === 'signup') {
      const { error: err } = await supabase.auth.signUp({ email, password })
      if (err) setError(err.message)
      else setMsg('Check your email to confirm your account.')
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) setError(err.message)
    }
    setLoading(false)
  }

  const isSignup = mode === 'signup'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 56px', borderBottom: '2px solid var(--color-divider)' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 20, letterSpacing: '0.02em' }}>
            Z<span style={{ fontSize: '0.72em' }}>EN</span>T<span style={{ fontSize: '0.72em' }}>RACKR</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-neutral-600)', marginTop: 3 }}>Track the grind.</div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-ghost" onClick={openSignIn}>Sign in</button>
          <button className="btn btn-primary" onClick={openSignUp}>Sign up</button>
        </div>
      </div>

      {/* Hero */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', borderBottom: '2px solid var(--color-divider)' }}>
        <div style={{ padding: '88px 56px', borderRight: '2px solid var(--color-divider)' }}>
          <span className="tag tag-outline" style={{ marginBottom: 24, display: 'inline-block' }}>Now tracking: Rust</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 52, lineHeight: 1.05, fontWeight: 600, margin: '0 0 24px', maxWidth: 600 }}>
            Track your programming language learning, one topic at a time
          </h1>
          <p style={{ fontSize: 16, color: 'var(--color-neutral-700)', maxWidth: 500, margin: '0 0 36px', lineHeight: 1.6 }}>
            A roadmap checklist, session log, streaks and stats for the language you're learning right now. Start with Rust — sign up free.
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={openSignUp}>Get started free</button>
            <button className="btn btn-secondary" onClick={openSignIn}>Sign in</button>
            <button className="btn btn-ghost" onClick={onDemo} style={{ color: 'var(--color-neutral-600)' }}>Try demo →</button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateRows: 'repeat(3, 1fr)' }}>
          {HERO_STATS.map((st, i) => (
            <div key={i} style={{ padding: '0 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderBottom: i < 2 ? '2px solid var(--color-divider)' : 'none' }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 40, fontWeight: 600 }}>{st.value}</div>
              <div style={{ fontSize: 13, color: 'var(--color-neutral-700)', marginTop: 6 }}>{st.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature grid */}
      <div style={{ padding: '72px 56px', borderBottom: '2px solid var(--color-divider)' }}>
        <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-neutral-700)', marginBottom: 12 }}>
          What you get
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: '2px solid var(--color-divider)', borderLeft: '2px solid var(--color-divider)' }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{ padding: 28, borderRight: '2px solid var(--color-divider)', borderBottom: '2px solid var(--color-divider)' }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: 'var(--color-neutral-700)', lineHeight: 1.55 }}>{f.body}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA band */}
      <div style={{ padding: '64px 56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 600, marginBottom: 8 }}>Ready to start your Rust roadmap?</div>
          <div style={{ fontSize: 14, color: 'var(--color-neutral-700)' }}>Free to use. No credit card.</div>
        </div>
        <button className="btn btn-primary" onClick={openSignUp}>Create your account</button>
      </div>

      {/* Auth dialog */}
      {showAuth && (
        <div
          className="dialog-backdrop"
          onClick={closeAuth}
          style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'color-mix(in srgb, var(--color-neutral-900) 50%, transparent)', zIndex: 100 }}
        >
          <div
            className="dialog"
            onClick={e => e.stopPropagation()}
            style={{ width: 400, padding: 32, background: 'var(--color-bg)', border: '2px solid var(--color-divider)' }}
          >
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 600, marginBottom: 4 }}>
              {isSignup ? 'Create your account' : 'Sign in'}
            </div>
            <div style={{ fontSize: 13, color: 'var(--color-neutral-700)', marginBottom: 24 }}>
              {isSignup ? 'Start tracking your Rust learning progress.' : 'Welcome back to ZenTrackr.'}
            </div>

            {error && <div className="error-msg" style={{ marginBottom: 16 }}>{error}</div>}
            {msg && (
              <div style={{ background: 'var(--color-neutral-100)', padding: '8px 12px', fontSize: 13, marginBottom: 16, borderLeft: '3px solid var(--color-neutral-800)' }}>
                {msg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="field" style={{ marginBottom: 16 }}>
                <label>Email</label>
                <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email" />
              </div>
              <div className="field" style={{ marginBottom: 24 }}>
                <label>Password</label>
                <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required autoComplete={isSignup ? 'new-password' : 'current-password'} minLength={6} />
              </div>
              <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
                {loading ? 'Loading…' : isSignup ? 'Sign up' : 'Sign in'}
              </button>
            </form>

            <div style={{ textAlign: 'left', marginTop: 18, fontSize: 13, color: 'var(--color-neutral-700)' }}>
              {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button onClick={switchMode} style={{ background: 'none', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', fontSize: 13, padding: 0, textDecoration: 'underline' }}>
                {isSignup ? 'Sign in' : 'Sign up'}
              </button>
            </div>

            <div style={{ borderTop: '1px solid var(--color-divider)', marginTop: 20, paddingTop: 16 }}>
              <button className="btn btn-ghost" style={{ fontSize: 12, color: 'var(--color-neutral-600)', padding: 0 }} onClick={() => { closeAuth(); onDemo() }}>
                Try demo instead — no account needed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
