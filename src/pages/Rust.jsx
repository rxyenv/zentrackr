import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function TopicNotes({ topic, updateTopicField }) {
  const [draft, setDraft] = useState(topic.notes || '')

  return (
    <div className="topic-notes">
      <textarea
        className="input"
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={() => {
          if (draft !== (topic.notes || '')) updateTopicField(topic.id, 'notes', draft)
        }}
        placeholder="What did you learn? Gotchas, snippets, links…"
        rows={3}
      />
    </div>
  )
}

export default function Rust({ modules, toggleTopic, updateTopicField }) {
  const navigate = useNavigate()
  const [openNotes, setOpenNotes] = useState(() => new Set())
  const allTopics = modules.flatMap(m => m.topics)
  const totalTopics = allTopics.length
  const doneTopics = allTopics.filter(t => t.done).length
  const overallPct = totalTopics ? Math.round((doneTopics / totalTopics) * 100) : 0

  function toggleNotes(topicId) {
    setOpenNotes(prev => {
      const next = new Set(prev)
      next.has(topicId) ? next.delete(topicId) : next.add(topicId)
      return next
    })
  }

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
              <div key={t.id}>
                <div className="topic-row">
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
                  <button
                    className={`topic-notes-toggle${t.notes ? ' has-notes' : ''}`}
                    onClick={() => toggleNotes(t.id)}
                    title={t.notes ? 'View notes' : 'Add notes'}
                  >
                    {openNotes.has(t.id) ? 'Notes ▴' : t.notes ? 'Notes ●' : 'Notes +'}
                  </button>
                </div>
                {openNotes.has(t.id) && (
                  <TopicNotes topic={t} updateTopicField={updateTopicField} />
                )}
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
