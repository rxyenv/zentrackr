import { useNavigate } from 'react-router-dom'

export default function Rust({ modules, toggleTopic }) {
  const navigate = useNavigate()
  const allTopics = modules.flatMap(m => m.topics)
  const totalTopics = allTopics.length
  const doneTopics = allTopics.filter(t => t.done).length
  const overallPct = totalTopics ? Math.round((doneTopics / totalTopics) * 100) : 0

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Rust</h1>
          <div className="page-subtitle">
            {doneTopics} of {totalTopics} topics complete — {overallPct}%
          </div>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/roadmap/edit')}>
          Edit roadmap
        </button>
      </div>

      <div className="progress-track" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="progress-fill" style={{ width: `${overallPct}%` }} />
      </div>

      {modules.map(m => {
        const mDone = m.topics.filter(t => t.done).length
        return (
          <div className="module-section" key={m.id}>
            <div className="module-header">
              <h2 className="module-title">{m.name}</h2>
              <span className="module-count">{mDone}/{m.topics.length}</span>
            </div>
            {m.topics.map(t => (
              <div className="topic-row" key={t.id}>
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={e => toggleTopic(t.id, e.target.checked)}
                  id={`topic-${t.id}`}
                />
                <label htmlFor={`topic-${t.id}`} className={`topic-name${t.done ? ' done' : ''}`} style={{ cursor: 'pointer' }}>
                  {t.name}
                </label>
                {t.resource_url && (
                  <a
                    href={t.resource_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="topic-resource-link"
                  >
                    Resource ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
