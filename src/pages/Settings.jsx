import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { formatDate } from '../lib/derive'

export default function Settings({ profile, language, updateProfile, updateGoal, resetProgress }) {
  const [name, setName] = useState(profile?.name || '')
  const [email, setEmail] = useState('')
  const [notifStreak, setNotifStreak] = useState(profile?.notif_streak ?? true)
  const [notifWeekly, setNotifWeekly] = useState(profile?.notif_weekly ?? false)
  const [dailyGoal, setDailyGoal] = useState(profile?.daily_goal_minutes ?? 30)
  const [shareEnabled, setShareEnabled] = useState(profile?.share_enabled ?? false)
  const [shareSlug, setShareSlug] = useState(profile?.share_slug || '')
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
      setDailyGoal(profile.daily_goal_minutes ?? 30)
      setShareEnabled(profile.share_enabled ?? false)
      setShareSlug(profile.share_slug || '')
    }
  }, [profile])

  useEffect(() => {
    if (language) {
      setGoalDate(language.goal_date || '')
      setGoalNote(language.goal_note || '')
    }
  }, [language])

  function slugify(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  }

  async function handleSaveProfile(e) {
    e.preventDefault()
    setSaving(true)
    let slug = slugify(shareSlug)
    if (shareEnabled && !slug) {
      slug = slugify(name) || `learner-${Math.random().toString(36).slice(2, 8)}`
    }
    setShareSlug(slug)
    const res = await updateProfile({
      name,
      notif_streak: notifStreak,
      notif_weekly: notifWeekly,
      daily_goal_minutes: Math.max(0, parseInt(dailyGoal, 10) || 0),
      share_enabled: shareEnabled,
      share_slug: slug || null,
    })
    await updateGoal(goalDate || null, goalNote || null)
    if (res?.error) {
      setSavedMsg(res.error.code === '23505' ? 'That profile URL is taken — pick another.' : 'Save failed — try again.')
    } else {
      setSavedMsg('Saved.')
    }
    setSaving(false)
    setTimeout(() => setSavedMsg(null), 4000)
  }

  const shareUrl = shareSlug ? `${window.location.origin}/u/${shareSlug}` : null

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
          <div className="settings-field-row field">
            <label>Daily goal (minutes)</label>
            <input
              className="input"
              type="number"
              min="0"
              step="5"
              value={dailyGoal}
              onChange={e => setDailyGoal(e.target.value)}
            />
          </div>
        </div>

        <div className="settings-section">
          <h3>Public profile</h3>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={shareEnabled}
              onChange={e => setShareEnabled(e.target.checked)}
            />
            Share my progress publicly
          </label>
          {shareEnabled && (
            <>
              <div className="settings-field-row field" style={{ marginTop: 'var(--space-2)' }}>
                <label>Profile URL slug</label>
                <input
                  className="input"
                  value={shareSlug}
                  onChange={e => setShareSlug(e.target.value)}
                  placeholder="e.g. aman"
                />
              </div>
              {shareUrl && (
                <div style={{ fontSize: 13, marginTop: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                  <a href={shareUrl} target="_blank" rel="noopener noreferrer">{shareUrl}</a>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => navigator.clipboard.writeText(shareUrl)}
                  >
                    Copy link
                  </button>
                </div>
              )}
              <div style={{ fontSize: 12, color: 'var(--color-neutral-600)', marginTop: 'var(--space-1)' }}>
                Anyone with the link sees your name, roadmap progress, streak and hours — never your notes or session details.
              </div>
            </>
          )}
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
