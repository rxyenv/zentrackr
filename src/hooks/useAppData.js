import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { seedRustLanguage } from '../lib/seed'

export function useAppData(userId) {
  const [language, setLanguage] = useState(null)
  const [modules, setModules] = useState([])
  const [sessions, setSessions] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    setError(null)

    try {
      // load language (first/only for MVP)
      let { data: langs } = await supabase
        .from('languages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at')
        .limit(1)

      let lang = langs?.[0]
      if (!lang) {
        const { languageId, error: seedErr } = await seedRustLanguage(userId)
        if (seedErr) throw seedErr
        const { data } = await supabase.from('languages').select('*').eq('id', languageId).single()
        lang = data
      }
      setLanguage(lang)

      // load modules + topics
      const { data: mods, error: modErr } = await supabase
        .from('modules')
        .select('*, topics(*)')
        .eq('language_id', lang.id)
        .order('position')

      if (modErr) throw modErr

      const sortedMods = (mods || []).map(m => ({
        ...m,
        topics: [...(m.topics || [])].sort((a, b) => a.position - b.position),
      }))
      setModules(sortedMods)

      // load sessions
      const { data: sess, error: sessErr } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', userId)
        .order('session_date', { ascending: false })

      if (sessErr) throw sessErr
      setSessions(sess || [])

      // load profile
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      setProfile(prof || { user_id: userId, name: '', notif_streak: true, notif_weekly: false })
    } catch (e) {
      setError(e.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => { load() }, [load])

  // --- mutations ---

  async function toggleTopic(topicId, done) {
    setModules(prev => prev.map(m => ({
      ...m,
      topics: m.topics.map(t => t.id === topicId ? { ...t, done } : t),
    })))
    await supabase.from('topics').update({ done }).eq('id', topicId)
  }

  async function updateTopicField(topicId, field, value) {
    setModules(prev => prev.map(m => ({
      ...m,
      topics: m.topics.map(t => t.id === topicId ? { ...t, [field]: value } : t),
    })))
    const col = field === 'resourceUrl' ? 'resource_url' : 'name'
    await supabase.from('topics').update({ [col]: value }).eq('id', topicId)
  }

  async function updateModuleName(moduleId, name) {
    setModules(prev => prev.map(m => m.id === moduleId ? { ...m, name } : m))
    await supabase.from('modules').update({ name }).eq('id', moduleId)
  }

  async function addModule() {
    const position = modules.length
    const { data } = await supabase
      .from('modules')
      .insert({ language_id: language.id, name: 'New module', position })
      .select()
      .single()
    if (data) setModules(prev => [...prev, { ...data, topics: [] }])
  }

  async function removeModule(moduleId) {
    setModules(prev => prev.filter(m => m.id !== moduleId))
    await supabase.from('modules').delete().eq('id', moduleId)
  }

  async function addTopic(moduleId) {
    const mod = modules.find(m => m.id === moduleId)
    const position = mod ? mod.topics.length : 0
    const { data } = await supabase
      .from('topics')
      .insert({ module_id: moduleId, name: 'New topic', done: false, resource_url: '', position })
      .select()
      .single()
    if (data) {
      setModules(prev => prev.map(m => m.id !== moduleId ? m : {
        ...m, topics: [...m.topics, data],
      }))
    }
  }

  async function removeTopic(topicId) {
    setModules(prev => prev.map(m => ({
      ...m, topics: m.topics.filter(t => t.id !== topicId),
    })))
    await supabase.from('topics').delete().eq('id', topicId)
  }

  async function logSession(form) {
    const { data } = await supabase
      .from('sessions')
      .insert({
        user_id: userId,
        language_id: language.id,
        module_name: form.module,
        session_date: form.date,
        duration_minutes: parseInt(form.duration, 10),
        notes: form.notes || null,
      })
      .select()
      .single()
    if (data) setSessions(prev => [data, ...prev])
  }

  async function resetProgress() {
    const allTopicIds = modules.flatMap(m => m.topics.map(t => t.id))
    if (!allTopicIds.length) return
    await supabase.from('topics').update({ done: false }).in('id', allTopicIds)
    setModules(prev => prev.map(m => ({
      ...m, topics: m.topics.map(t => ({ ...t, done: false })),
    })))
  }

  async function updateGoal(goalDate, goalNote) {
    setLanguage(prev => ({ ...prev, goal_date: goalDate, goal_note: goalNote }))
    await supabase.from('languages').update({ goal_date: goalDate, goal_note: goalNote }).eq('id', language.id)
  }

  async function updateProfile(fields) {
    const updated = { ...profile, ...fields }
    setProfile(updated)
    await supabase.from('profiles').upsert({ user_id: userId, ...updated })
  }

  return {
    language, modules, sessions, profile, loading, error,
    toggleTopic, updateTopicField, updateModuleName,
    addModule, removeModule, addTopic, removeTopic,
    logSession, resetProgress, updateGoal, updateProfile, reload: load,
  }
}
