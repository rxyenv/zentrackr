// Pure derivation functions — no React, no Supabase

export function computeStats(modules, sessions) {
  const allTopics = modules.flatMap(m => m.topics)
  const totalTopics = allTopics.length
  const doneTopics = allTopics.filter(t => t.done).length
  const overallPct = totalTopics ? Math.round((doneTopics / totalTopics) * 100) : 0

  const hoursLogged = sessions.reduce((s, r) => s + r.duration_minutes, 0) / 60

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  let streak = 0
  const sessionDays = new Set(sessions.map(s => s.session_date))
  for (let d = 0; ; d++) {
    const day = new Date(today)
    day.setDate(today.getDate() - d)
    const key = day.toISOString().slice(0, 10)
    if (sessionDays.has(key)) streak++
    else break
  }

  const nextTopic = (() => {
    for (const m of modules) {
      const t = m.topics.find(t => !t.done)
      if (t) return { topic: t, module: m }
    }
    return null
  })()

  const moduleStats = modules.map(m => {
    const total = m.topics.length
    const done = m.topics.filter(t => t.done).length
    return { ...m, total, done, pct: total ? Math.round((done / total) * 100) : 0 }
  })

  return { totalTopics, doneTopics, overallPct, hoursLogged, streak, nextTopic, moduleStats }
}

export function last7DaysBars(sessions) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - 6 + i)
    const key = d.toISOString().slice(0, 10)
    const mins = sessions
      .filter(s => s.session_date === key)
      .reduce((sum, s) => sum + s.duration_minutes, 0)
    const label = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][d.getDay()]
    return { key, mins, label }
  })
}

export function last14DaysHeatmap(sessions) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const sessionDays = new Set(sessions.map(s => s.session_date))
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - 13 + i)
    const key = d.toISOString().slice(0, 10)
    return { key, active: sessionDays.has(key) }
  })
}

export function daysToGoal(goalDate) {
  if (!goalDate) return null
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const goal = new Date(goalDate)
  goal.setHours(0, 0, 0, 0)
  return Math.ceil((goal - now) / (1000 * 60 * 60 * 24))
}

export function formatDate(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10)
}
