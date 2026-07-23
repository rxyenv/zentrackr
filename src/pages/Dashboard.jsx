import { useNavigate } from 'react-router-dom'
import { computeStats, daysToGoal, formatDate } from '../lib/derive'

export default function Dashboard({ modules, sessions, language }) {
  const navigate = useNavigate()
  const { overallPct, streak, hoursLogged, nextTopic, moduleStats } = computeStats(modules, sessions)
  const days = daysToGoal(language?.goal_date)
  const recentSessions = sessions.slice(0, 5)

  const nextMod = nextTopic
    ? moduleStats.find(m => m.id === nextTopic.module.id)
    : null

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/rust')}>
          Continue learning
        </button>
      </div>

      <div className="stat-strip">
        <div className="stat-cell">
          <div className="stat-label">Overall progress</div>
          <div className="stat-value">{overallPct}%</div>
        </div>
        <div className="stat-cell">
          <div className="stat-label">Current streak</div>
          <div className="stat-value">{streak}d</div>
        </div>
        <div className="stat-cell">
          <div className="stat-label">Hours logged</div>
          <div className="stat-value">{hoursLogged.toFixed(1)}h</div>
        </div>
        <div className="stat-cell">
          <div className="stat-label">Days to goal</div>
          <div className="stat-value">{days !== null ? days : '—'}</div>
        </div>
      </div>

      <div className="two-col">
        <div className="two-col-left">
          <span className="tag tag-neutral" style={{ marginBottom: 'var(--space-3)', display: 'inline-block' }}>Up next</span>
          {nextTopic ? (
            <>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 'var(--font-heading-weight)', fontSize: 20, marginBottom: 4 }}>
                {nextTopic.topic.name}
              </div>
              <div style={{ fontSize: 13, color: 'var(--color-neutral-700)', marginBottom: 'var(--space-3)' }}>
                {nextTopic.module.name}
              </div>
              {nextMod && (
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${nextMod.pct}%` }} />
                </div>
              )}
              <button className="btn btn-secondary" style={{ marginTop: 'var(--space-3)' }} onClick={() => navigate('/rust')}>
                Open roadmap
              </button>
            </>
          ) : (
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 'var(--font-heading-weight)', fontSize: 20 }}>
              All topics complete!
            </div>
          )}
        </div>
        <div className="two-col-right">
          <span className="tag tag-outline" style={{ marginBottom: 'var(--space-3)', display: 'inline-block' }}>Goal</span>
          {language?.goal_note ? (
            <>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 'var(--font-heading-weight)', fontSize: 18, marginBottom: 4 }}>
                {language.goal_note}
              </div>
              <div style={{ fontSize: 13, color: 'var(--color-neutral-700)' }}>
                Target: {formatDate(language.goal_date)}
              </div>
            </>
          ) : (
            <div style={{ fontSize: 14, color: 'var(--color-neutral-600)', fontStyle: 'italic' }}>
              No goal set — add one in Settings.
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="section-header-row">
          <span className="section-title">Recent sessions</span>
          <button className="btn btn-ghost" onClick={() => navigate('/history')}>View all →</button>
        </div>
        {recentSessions.length === 0 ? (
          <div className="empty-state">No sessions logged yet.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Module</th>
                <th>Duration</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {recentSessions.map(s => (
                <tr key={s.id}>
                  <td>{formatDate(s.session_date)}</td>
                  <td>{s.module_name}</td>
                  <td>{s.duration_minutes}m</td>
                  <td style={{ color: 'var(--color-neutral-700)' }}>{s.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
