export default function EditRoadmap({
  modules,
  addModule, removeModule, updateModuleName,
  addTopic, removeTopic, updateTopicField, toggleTopic,
}) {
  return (
    <div>
      <div className="page-header">
        <h1>Edit Roadmap</h1>
        <button className="btn btn-primary" onClick={addModule}>+ Add module</button>
      </div>

      {modules.map(m => (
        <div className="module-section" key={m.id}>
          <div className="module-header" style={{ alignItems: 'flex-start' }}>
            <input
              className="input"
              style={{ fontSize: 18, fontWeight: 'var(--font-heading-weight)', fontFamily: 'var(--font-heading)', maxWidth: 360 }}
              value={m.name}
              onChange={e => updateModuleName(m.id, e.target.value)}
            />
            <button
              className="btn btn-ghost"
              onClick={() => {
                if (window.confirm(`Remove module "${m.name}" and all its topics?`)) removeModule(m.id)
              }}
            >
              Remove module
            </button>
          </div>

          {m.topics.map(t => (
            <div className="edit-topic-row" key={t.id}>
              <input
                type="checkbox"
                checked={t.done}
                onChange={e => toggleTopic(t.id, e.target.checked)}
                style={{ accentColor: 'var(--color-accent)', width: 16, height: 16, flexShrink: 0 }}
              />
              <input
                className="input edit-topic-name"
                value={t.name}
                onChange={e => updateTopicField(t.id, 'name', e.target.value)}
                placeholder="Topic name"
              />
              <input
                className="input edit-topic-url"
                value={t.resource_url || ''}
                onChange={e => updateTopicField(t.id, 'resourceUrl', e.target.value)}
                placeholder="Resource URL"
              />
              <button
                className="btn btn-icon"
                style={{ color: 'var(--color-neutral-600)', fontSize: 16 }}
                onClick={() => removeTopic(t.id)}
                title="Remove topic"
              >
                ✕
              </button>
            </div>
          ))}

          <button className="btn btn-ghost" style={{ marginTop: 'var(--space-2)' }} onClick={() => addTopic(m.id)}>
            + Add topic
          </button>
        </div>
      ))}
    </div>
  )
}
