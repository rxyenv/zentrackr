import { computeStats, last7DaysBars, last14DaysHeatmap } from '../lib/derive'

export default function Stats({ modules, sessions }) {
  const { moduleStats } = computeStats(modules, sessions)
  const bars = last7DaysBars(sessions)
  const heatmap = last14DaysHeatmap(sessions)
  const maxMins = Math.max(...bars.map(b => b.mins), 1)

  return (
    <div>
      <div className="page-header">
        <h1>Stats</h1>
      </div>

      <div className="panel">
        <div className="panel-header">Minutes studied, last 7 days</div>
        <div className="panel-body">
          <div className="bar-chart">
            {bars.map(b => (
              <div className="bar-col" key={b.key}>
                <div className="bar-value">{b.mins || ''}</div>
                <div className="bar-fill" style={{ height: `${Math.round((b.mins / maxMins) * 100)}px` }} />
                <div className="bar-label">{b.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">Completion by module</div>
        <div className="panel-body">
          {moduleStats.map(m => (
            <div className="module-stat-row" key={m.id}>
              <div className="module-stat-header">
                <span>{m.name}</span>
                <span style={{ color: 'var(--color-neutral-700)' }}>{m.pct}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${m.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">Last 14 days</div>
        <div className="panel-body">
          <div className="heatmap">
            {heatmap.map(cell => (
              <div
                key={cell.key}
                className={`heatmap-cell${cell.active ? ' active' : ''}`}
                title={cell.key}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
