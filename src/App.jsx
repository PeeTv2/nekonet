import { useState, useEffect } from 'react'
import Restricted from './components/Restricted'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import CookieBanner from './components/CookieBanner'

const INVITE_CODE = 'secretneko2026'   // ← CHANGE THIS
const PASSWORD = 'nekoadmin123'         // ← CHANGE THIS

function App() {
  const [stage, setStage] = useState('checking') // checking → restricted → login → dashboard
  const [cookiesAccepted, setCookiesAccepted] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const invite = params.get('invite')

    if (invite !== INVITE_CODE) {
      setStage('restricted')
      return
    }

    const isLoggedIn = localStorage.getItem('nekoAuth') === 'true'
    setStage(isLoggedIn ? 'dashboard' : 'login')

    const consent = localStorage.getItem('cookieConsent')
    if (consent === 'accepted') setCookiesAccepted(true)
    else if (consent === 'rejected') setCookiesAccepted(false)
    else setCookiesAccepted(null)
  }, [])

  const handleLoginSuccess = () => {
    localStorage.setItem('nekoAuth', 'true')
    setStage('dashboard')
  }

  const handleLogout = () => {
    localStorage.removeItem('nekoAuth')
    setStage('login')
  }

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted')
    setCookiesAccepted(true)
  }

  const rejectCookies = () => {
    localStorage.setItem('cookieConsent', 'rejected')
    setCookiesAccepted(false)
  }

  if (stage === 'checking') {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Checking access...</div>
  }

  return (
    <>
      {stage === 'restricted' && <Restricted />}
      {stage === 'login' && <Login onSuccess={handleLoginSuccess} />}
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