import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { streakFromDates } from '../lib/derive'

export default function Share() {
  const { slug } = useParams()
  const [data, setData] = useState(undefined) // undefined = loading, null = not found

  useEffect(() => {
    supabase.rpc('get_public_profile', { slug }).then(({ data, error }) => {
      setData(error ? null : data)
    })
  }, [slug])

  if (data === undefined) {
    return <div className="share-page"><div className="loading">Loading…</div></div>
  }

  if (data === null) {
    return (
      <div className="share-page">
        <div className="share-card">
          <div className="auth-wordmark">ZENTRACKR</div>
          <h1 style={{ fontSize: 22 }}>Profile not found</h1>
          <p className="text-muted">This profile doesn't exist or isn't shared publicly.</p>
          <Link to="/">Go to ZenTrackr →</Link>
        </div>
      </div>
    )
  }

  const modules = data.modules || []
  const total = modules.reduce((s, m) => s + m.total, 0)
  const done = modules.reduce((s, m) => s + m.done, 0)
  const pct = total ? Math.round((done / total) * 100) : 0
  const streak = streakFromDates(data.session_dates || [])
  const hours = (data.total_minutes / 60).toFixed(1)

  return (
    <div className="share-page">
      <div className="share-card">
        <div className="auth-wordmark">ZENTRACKR</div>
        <h1 style={{ marginTop: 'var(--space-3)' }}>
          {data.name || 'Anonymous learner'}
        </h1>
        <p className="text-muted" style={{ marginBottom: 'var(--space-4)' }}>
          Learning {data.language || 'a language'}
          {data.goal_note ? ` — ${data.goal_note}` : ''}
        </p>

        <div className="stat-strip" style={{ marginBottom: 'var(--space-6)' }}>
          <div className="stat-cell">
            <div className="stat-label">Progress</div>
            <div className="stat-value">{pct}%</div>
          </div>
          <div className="stat-cell">
            <div className="stat-label">Streak</div>
            <div className="stat-value">{streak > 0 && '🔥'}{streak}d</div>
          </div>
          <div className="stat-cell">
            <div className="stat-label">Hours</div>
            <div className="stat-value">{hours}h</div>
          </div>
          <div className="stat-cell">
            <div className="stat-label">Topics done</div>
            <div className="stat-value">{done}/{total}</div>
          </div>
        </div>

        {modules.map((m, i) => {
          const mPct = m.total ? Math.round((m.done / m.total) * 100) : 0
          return (
            <div key={i} className="module-stat-row">
              <div className="module-stat-header">
                <span>{m.name}</span>
                <span className="text-muted">{m.done}/{m.total}</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${mPct}%` }} />
              </div>
            </div>
          )
        })}

        <p style={{ marginTop: 'var(--space-6)', fontSize: 13 }}>
          <Link to="/">Track your own grind with ZenTrackr →</Link>
        </p>
      </div>
    </div>
  )
}
