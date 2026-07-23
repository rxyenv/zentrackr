import { NavLink } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/rust', label: 'Rust' },
  { to: '/roadmap/edit', label: 'Edit Roadmap' },
  { to: '/stats', label: 'Stats' },
  { to: '/history', label: 'History' },
  { to: '/settings', label: 'Settings' },
]

export default function Layout({ children, demo, onExitDemo }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
    {demo && (
      <div style={{
        background: 'var(--color-neutral-800)', color: 'var(--color-bg)',
        fontSize: 13, padding: '6px var(--space-4)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span>Demo mode — changes are not saved</span>
        <button
          onClick={onExitDemo}
          style={{ background: 'none', border: '1px solid var(--color-bg)', color: 'var(--color-bg)', cursor: 'pointer', padding: '2px 10px', fontSize: 12, fontFamily: 'var(--font-heading)', fontWeight: 'var(--font-heading-weight)' }}
        >
          Sign in
        </button>
      </div>
    )}
    <div className="app-shell">
      <nav className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-wordmark">
            Z<small style={{ fontSize: '0.65em', letterSpacing: 2 }}>EN</small>T<small style={{ fontSize: '0.65em', letterSpacing: 2 }}>RACKR</small>
          </div>
          <div className="sidebar-tagline">Track the grind.</div>
        </div>

        <div className="sidebar-nav">
          {NAV_ITEMS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}
            >
              {label}
            </NavLink>
          ))}
        </div>

        <div className="sidebar-footer">
          <button className="sidebar-nav-item" disabled style={{ opacity: 0.45, width: '100%', display: 'flex', alignItems: 'center', gap: 8 }}>
            + Add language
            <span className="tag tag-outline" style={{ fontSize: 10, padding: '1px 6px' }}>Soon</span>
          </button>
          {!demo && (
            <button
              className="btn btn-ghost"
              style={{ fontSize: 12, marginTop: 'var(--space-2)', color: 'var(--color-neutral-600)' }}
              onClick={() => supabase.auth.signOut()}
            >
              Sign out
            </button>
          )}
        </div>
      </nav>

      <main className="main-content">
        {children}
      </main>
    </div>
    </div>
  )
}
