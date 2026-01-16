import { useState, useEffect } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import Restricted from './Restricted';
import CookieBanner from './CookieBanner';
import AIBrainChat from './AIBrainChat';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasInvite, setHasInvite] = useState(false);
  const [cookiesAccepted, setCookiesAccepted] = useState(null);
  const [aiChatOpen, setAiChatOpen] = useState(false);

  useEffect(() => {
    // Check for invite code in URL
    const params = new URLSearchParams(window.location.search);
    const inviteCode = params.get('invite');
    
    if (inviteCode === 'secretneko2026') {
      setHasInvite(true);
    }

    // Check cookies acceptance
    const cookieStatus = localStorage.getItem('cookiesAccepted');
    if (cookieStatus !== null) {
      setCookiesAccepted(cookieStatus === 'true');
    }
  }, []);

  const handleCookieAccept = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setCookiesAccepted(true);
  };

  const handleCookieReject = () => {
    localStorage.setItem('cookiesAccepted', 'false');
    setCookiesAccepted(false);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAiChatOpen(false);
  };

  // Show cookie banner first
  if (cookiesAccepted === null) {
    return <CookieBanner onAccept={handleCookieAccept} onReject={handleCookieReject} />;
  }

  // Show restricted page if no invite or cookies rejected
  if (!hasInvite || cookiesAccepted === false) {
    return <Restricted />;
  }

  // Show login or dashboard
  if (!isAuthenticated) {
    return <Login onSuccess={handleLogin} />;
  }

  return (
    <>
      <Dashboard onLogout={handleLogout} onOpenAIChat={() => setAiChatOpen(true)} />
      <AIBrainChat isOpen={aiChatOpen} onClose={() => setAiChatOpen(false)} />
    </>
  );
}