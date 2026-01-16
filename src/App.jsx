import { useState, useEffect } from 'react'
import Restricted from './components/Restricted'
import Dashboard from './components/Dashboard'
import CookieBanner from './components/CookieBanner'

const INVITE_CODE = 'secretneko2026'  // Change this to your invite code

function App() {
  const [stage, setStage] = useState('checking')
  const [cookiesAccepted, setCookiesAccepted] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const invite = params.get('invite')

    if (invite !== INVITE_CODE) {
      setStage('restricted')
    } else {
      setStage('dashboard')
    }
  }, [])

  const handleLogout = () => {
    window.location.href = window.location.origin
  }

  const acceptCookies = () => {
    setCookiesAccepted(true)
  }

  const rejectCookies = () => {
    setCookiesAccepted(false)
  }

  if (stage === 'checking') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white/60">Verifying access...</div>
      </div>
    )
  }

  return (
    <>
      {stage === 'restricted' && <Restricted />}
      {stage === 'dashboard' && (
        <Dashboard onLogout={handleLogout} cookiesAccepted={cookiesAccepted} />
      )}

      {stage !== 'restricted' && cookiesAccepted === null && (
        <CookieBanner onAccept={acceptCookies} onReject={rejectCookies} />
      )}
    </>
  )
}

export default App