import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { formatDate } from '../lib/derive'

export default function Settings({ profile, language, updateProfile, updateGoal, resetProgress }) {
  const [name, setName] = useState(profile?.name || '')
  const [email, setEmail] = useState('')
  const [notifStreak, setNotifStreak] = useState(profile?.notif_streak ?? true)
  const [notifWeekly, setNotifWeekly] = useState(profile?.notif_weekly ?? false)
  const [goalDate, setGoalDate] = useState(language?.goal_date || '')
  const [goalNote, setGoalNote] = useState(language?.goal_note || '')
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email || ''))
  }, [])

  useEffect(() => {
    if (profile) {
      setName(profile.name || '')
      setNotifStreak(profile.notif_streak ?? true)
      setNotifWeekly(profile.notif_weekly ?? false)
    }
  }, [profile])

  useEffect(() => {
    if (language) {
      setGoalDate(language.goal_date || '')
      setGoalNote(language.goal_note || '')
    }
  }, [language])

  async function handleSaveProfile(e) {
    e.preventDefault()
    setSaving(true)
    await updateProfile({ name, notif_streak: notifStreak, notif_weekly: notifWeekly })
    await updateGoal(goalDate || null, goalNote || null)
    setSavedMsg('Saved.')
    setSaving(false)
    setTimeout(() => setSavedMsg(null), 2000)
  }

  function handleReset() {
    if (window.confirm('Reset all topic progress? This cannot be undone (session history is kept).')) {
      resetProgress()
    }
  }

  return (
    <div style={{ maxWidth: 560 }}>
      <div className="page-header">
        <h1>Settings</h1>
      </div>

      <form onSubmit={handleSaveProfile}>
        <div className="settings-section">
          <h3>Profile</h3>
          <div className="settings-field-row field">
            <label>Name</label>
            <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div className="settings-field-row field">
            <label>Email</label>
            <input className="input" value={email} readOnly style={{ opacity: 0.6, cursor: 'default' }} />
          </div>
        </div>

        <div className="settings-section">
          <h3>Goal</h3>
          <div className="settings-field-row field">
            <label>Goal</label>
            <input className="input" value={goalNote} onChange={e => setGoalNote(e.target.value)} placeholder="e.g. Ship a Rust CLI tool" />
          </div>
          <div className="settings-field-row field">
            <label>Target date</label>
            <input className="input" type="date" value={goalDate} onChange={e => setGoalDate(e.target.value)} />
          </div>
        </div>

        <div className="settings-section">
          <h3>Plan</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <span style={{ fontSize: 14 }}>Free — Rust only</span>
            <span className="tag tag-outline">Upgrade soon</span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--color-neutral-600)', marginTop: 'var(--space-2)' }}>
            Multi-language support coming in a future tier.
          </div>
        </div>

        <div className="settings-section">
          <h3>Notifications</h3>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={notifStreak}
              onChange={e => setNotifStreak(e.target.checked)}
            />
            Streak reminders
          </label>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={notifWeekly}
              onChange={e => setNotifWeekly(e.target.checked)}
            />
            Weekly summary
          </label>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-4) 0' }}>
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save settings'}
          </button>
          {savedMsg && <span style={{ fontSize: 13, color: 'var(--color-neutral-700)' }}>{savedMsg}</span>}
        </div>
      </form>

      <div className="settings-section">
        <h3 style={{ color: 'var(--color-accent)' }}>Danger zone</h3>
        <p style={{ fontSize: 14, marginBottom: 'var(--space-3)' }}>
          Reset all topic checkboxes to unchecked. Session history is not affected.
        </p>
        <button className="btn btn-secondary" style={{ borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }} onClick={handleReset}>
          Reset roadmap progress
        </button>
      </div>
    </div>
  )
}
