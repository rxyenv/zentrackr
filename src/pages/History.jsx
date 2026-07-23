import { useState } from 'react'
import { formatDate, todayIso } from '../lib/derive'

export default function History({ sessions, modules, logSession }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ date: todayIso(), duration: '30', module: '', notes: '' })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState(null)

  const moduleNames = modules.map(m => m.name)

  function updateForm(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.date || !form.duration) { setErr('Date and duration are required.'); return }
    setSaving(true)
    setErr(null)
    await logSession({ ...form, module: form.module || (moduleNames[0] || '') })
    setSaving(false)
    setShowForm(false)
    setForm({ date: todayIso(), duration: '30', module: '', notes: '' })
  }

  return (
    <div>
      <div className="page-header">
        <h1>Session history</h1>
        <button
          className="btn btn-primary"
          onClick={() => { setShowForm(v => !v); setErr(null) }}
        >
          {showForm ? 'Cancel' : '+ Log session'}
        </button>
      </div>

      {showForm && (
        <form className="log-form" onSubmit={handleSave}>
          {err && <div className="error-msg">{err}</div>}
          <div className="log-form-row">
            <div className="field">
              <label>Date</label>
              <input className="input" type="date" value={form.date} onChange={e => updateForm('date', e.target.value)} required />
            </div>
            <div className="field">
              <label>Duration (minutes)</label>
              <input className="input" type="number" min="1" value={form.duration} onChange={e => updateForm('duration', e.target.value)} required />
            </div>
          </div>
          <div className="field" style={{ marginBottom: 'var(--space-3)' }}>
            <label>Module</label>
            <select
              className="input"
              value={form.module}
              onChange={e => updateForm('module', e.target.value)}
            >
              <option value="">Select module…</option>
              {moduleNames.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="field" style={{ marginBottom: 'var(--space-3)' }}>
            <label>Notes</label>
            <input className="input" type="text" value={form.notes} onChange={e => updateForm('notes', e.target.value)} placeholder="Optional notes" />
          </div>
          <div className="log-form-actions">
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button className="btn btn-secondary" type="button" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {sessions.length === 0 ? (
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
            {sessions.map(s => (
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
  )
}
