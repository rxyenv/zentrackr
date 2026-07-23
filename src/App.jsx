import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { useAppData } from './hooks/useAppData'
import { useMockData } from './hooks/useMockData'
import Layout from './components/Layout'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Rust from './pages/Rust'
import EditRoadmap from './pages/EditRoadmap'
import Stats from './pages/Stats'
import History from './pages/History'
import Settings from './pages/Settings'

function AppRoutes() {
  const session = useAuth()
  const [demo, setDemo] = useState(false)

  if (demo) return <DemoApp onExitDemo={() => setDemo(false)} />

  if (session === undefined) {
    return <div className="loading" style={{ padding: 40 }}>Loading…</div>
  }

  if (!session) {
    return <Auth onDemo={() => setDemo(true)} />
  }

  return <AuthedApp userId={session.user.id} />
}

function DemoApp({ onExitDemo }) {
  const data = useMockData()
  return <AppShell data={data} demo onExitDemo={onExitDemo} />
}

function AuthedApp({ userId }) {
  const data = useAppData(userId)

  if (data.loading) {
    return <Layout><div className="loading">Loading your data…</div></Layout>
  }

  if (data.error) {
    return (
      <Layout>
        <div className="error-msg" style={{ maxWidth: 480 }}>
          Failed to load: {data.error}
          <button className="btn btn-secondary" style={{ marginLeft: 16 }} onClick={data.reload}>Retry</button>
        </div>
      </Layout>
    )
  }

  return <AppShell data={data} />
}

function AppShell({ data, demo, onExitDemo }) {
  return (
    <Layout demo={demo} onExitDemo={onExitDemo}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={
          <Dashboard modules={data.modules} sessions={data.sessions} language={data.language} />
        } />
        <Route path="/rust" element={
          <Rust modules={data.modules} toggleTopic={data.toggleTopic} />
        } />
        <Route path="/roadmap/edit" element={
          <EditRoadmap
            modules={data.modules}
            toggleTopic={data.toggleTopic}
            addModule={data.addModule}
            removeModule={data.removeModule}
            updateModuleName={data.updateModuleName}
            addTopic={data.addTopic}
            removeTopic={data.removeTopic}
            updateTopicField={data.updateTopicField}
          />
        } />
        <Route path="/stats" element={<Stats modules={data.modules} sessions={data.sessions} />} />
        <Route path="/history" element={
          <History sessions={data.sessions} modules={data.modules} logSession={data.logSession} />
        } />
        <Route path="/settings" element={
          <Settings
            profile={data.profile}
            language={data.language}
            updateProfile={data.updateProfile}
            updateGoal={data.updateGoal}
            resetProgress={data.resetProgress}
          />
        } />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
