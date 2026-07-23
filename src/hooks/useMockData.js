import { useState } from 'react'
import { todayIso } from '../lib/derive'

const MOCK_MODULES = [
  { name: 'Fundamentals', topics: ['Variables & Mutability', 'Data Types', 'Functions', 'Control Flow', 'Comments'], doneCount: 5 },
  { name: 'Ownership & Borrowing', topics: ['Ownership Rules', 'References & Borrowing', 'Slices', 'Lifetimes Intro'], doneCount: 3 },
  { name: 'Structs & Enums', topics: ['Defining Structs', 'Method Syntax', 'Enums & Pattern Matching', 'Option<T>'], doneCount: 3 },
  { name: 'Collections & Error Handling', topics: ['Vectors', 'Strings', 'HashMaps', 'Result<T, E>', 'panic! & Recoverable Errors'], doneCount: 3 },
  { name: 'Generics & Traits', topics: ['Generic Types', 'Traits & Default Methods', 'Trait Bounds', 'Lifetimes in Structs'], doneCount: 3 },
  { name: 'Testing & Cargo', topics: ['Writing Tests', 'Test Organization', 'Cargo Workspaces', 'Publishing Crates'], doneCount: 1 },
  { name: 'Smart Pointers & Concurrency', topics: ['Box<T>', 'Rc<T> & RefCell<T>', 'Threads', 'Message Passing', 'Mutex<T>'], doneCount: 2 },
  { name: 'Async Rust', topics: ['async/await Basics', 'Futures', 'Tokio Runtime', 'Streams'], doneCount: 0 },
  { name: 'Advanced Topics', topics: ['Unsafe Rust', 'Macros', 'Trait Objects & dyn', 'FFI Basics'], doneCount: 0 },
]

function buildModules() {
  return MOCK_MODULES.map((m, mi) => ({
    id: `m-${mi}`,
    name: m.name,
    position: mi,
    topics: m.topics.map((name, ti) => ({
      id: `m-${mi}-t-${ti}`,
      name,
      done: ti < m.doneCount,
      resource_url: '',
      position: ti,
    })),
  }))
}

function buildSessions() {
  const today = new Date()
  return [
    { id: 's-0', module_name: 'Ownership & Borrowing', session_date: todayIso(), duration_minutes: 45, notes: 'Lifetimes finally clicked' },
    { id: 's-1', module_name: 'Fundamentals', session_date: offset(today, -1), duration_minutes: 30, notes: '' },
    { id: 's-2', module_name: 'Fundamentals', session_date: offset(today, -2), duration_minutes: 60, notes: 'Flew through control flow' },
    { id: 's-3', module_name: 'Structs & Enums', session_date: offset(today, -4), duration_minutes: 50, notes: '' },
    { id: 's-4', module_name: 'Collections & Error Handling', session_date: offset(today, -6), duration_minutes: 40, notes: 'Result<T,E> is elegant' },
  ]
}

function offset(base, days) {
  const d = new Date(base)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export function useMockData() {
  const [modules, setModules] = useState(buildModules)
  const [sessions, setSessions] = useState(buildSessions)
  const [language] = useState({
    id: 'lang-demo',
    name: 'Rust',
    goal_date: offset(new Date(), 60),
    goal_note: 'Ship a Rust CLI tool',
  })
  const [profile] = useState({ user_id: 'demo', name: 'Demo User', notif_streak: true, notif_weekly: false })

  function toggleTopic(topicId, done) {
    setModules(prev => prev.map(m => ({
      ...m, topics: m.topics.map(t => t.id === topicId ? { ...t, done } : t),
    })))
  }

  function updateTopicField(topicId, field, value) {
    const col = field === 'resourceUrl' ? 'resource_url' : field
    setModules(prev => prev.map(m => ({
      ...m, topics: m.topics.map(t => t.id === topicId ? { ...t, [col]: value } : t),
    })))
  }

  function updateModuleName(moduleId, name) {
    setModules(prev => prev.map(m => m.id === moduleId ? { ...m, name } : m))
  }

  function addModule() {
    const id = `m-${Date.now()}`
    setModules(prev => [...prev, { id, name: 'New module', position: prev.length, topics: [] }])
  }

  function removeModule(moduleId) {
    setModules(prev => prev.filter(m => m.id !== moduleId))
  }

  function addTopic(moduleId) {
    const id = `t-${Date.now()}`
    setModules(prev => prev.map(m => m.id !== moduleId ? m : {
      ...m, topics: [...m.topics, { id, name: 'New topic', done: false, resource_url: '', position: m.topics.length }],
    }))
  }

  function removeTopic(topicId) {
    setModules(prev => prev.map(m => ({ ...m, topics: m.topics.filter(t => t.id !== topicId) })))
  }

  function logSession(form) {
    const id = `s-${Date.now()}`
    setSessions(prev => [{
      id,
      module_name: form.module,
      session_date: form.date,
      duration_minutes: parseInt(form.duration, 10),
      notes: form.notes || null,
    }, ...prev])
  }

  function resetProgress() {
    setModules(prev => prev.map(m => ({ ...m, topics: m.topics.map(t => ({ ...t, done: false })) })))
  }

  function updateGoal() {}
  function updateProfile() {}

  return {
    language, modules, sessions, profile,
    loading: false, error: null,
    toggleTopic, updateTopicField, updateModuleName,
    addModule, removeModule, addTopic, removeTopic,
    logSession, resetProgress, updateGoal, updateProfile,
    reload: () => {},
  }
}
