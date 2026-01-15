import { useState } from 'react';
import { Download, AlertTriangle, Globe, Wifi, Shield, User, Phone } from 'lucide-react';

export default function Dashboard({ onLogout, cookiesAccepted }) {
  const [activeTab, setActiveTab] = useState('ip');
  
  const [ipAddress, setIpAddress] = useState('');
  const [ipResult, setIpResult] = useState(null);
  const [ipLoading, setIpLoading] = useState(false);
  
  const [domain, setDomain] = useState('');
  const [dnsResult, setDnsResult] = useState(null);
  const [dnsLoading, setDnsLoading] = useState(false);
  
  const [email, setEmail] = useState('');
  const [breachResult, setBreachResult] = useState(null);
  const [breachLoading, setBreachLoading] = useState(false);
  
  const [phone, setPhone] = useState('');
  const [phoneResult, setPhoneResult] = useState(null);
  
  const [username, setUsername] = useState('');

  const lookupIP = async () => {
    if (!ipAddress.trim()) return;
    setIpLoading(true);
    try {
      const res = await fetch(`https://ipapi.co/${ipAddress}/json/`);
      const data = await res.json();
      setIpResult(data);
    } catch (err) {
      setIpResult({ error: 'Failed' });
    }
    setIpLoading(false);
  };

  const lookupDNS = async () => {
    if (!domain.trim()) return;
    setDnsLoading(true);
    try {
      const res = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
      const data = await res.json();
      setDnsResult(data);
    } catch (err) {
      setDnsResult({ error: 'Failed' });
    }
    setDnsLoading(false);
  };

  const checkBreaches = async () => {
    if (!email.trim()) return;
    setBreachLoading(true);
    try {
      const res = await fetch(`https://haveibeenpwned.com/api/v3/breachedaccount/${email}`, {
        headers: { 'User-Agent': 'NekoNet-OSINT' }
      });
      if (res.status === 404) {
        setBreachResult({ safe: true });
      } else {
        const data = await res.json();
        setBreachResult({ safe: false, breaches: data });
      }
    } catch (err) {
      setBreachResult({ error: 'API limit or network error' });
    }
    setBreachLoading(false);
  };

  const searchUsername = () => {
    if (!username.trim()) return;
    window.open(`https://github.com/${username}`, '_blank');
    window.open(`https://twitter.com/${username}`, '_blank');
    window.open(`https://instagram.com/${username}`, '_blank');
    window.open(`https://reddit.com/user/${username}`, '_blank');
  };

  const analyzePhone = () => {
    if (!phone.trim()) return;
    const cleaned = phone.replace(/\D/g, '');
    const country = cleaned.startsWith('1') ? 'US/Canada' : 
                    cleaned.startsWith('44') ? 'UK' :
                    cleaned.startsWith('91') ? 'India' : 'Unknown';
    setPhoneResult({ number: phone, digits: cleaned.length, country });
  };

  const exportData = () => {
    const data = { ipResult, dnsResult, breachResult, phoneResult };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'neko-export.json';
    a.click();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto p-6">
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="Logo" className="w-16 h-16" />
            <h1 className="text-2xl font-bold">NekoNet Pro</h1>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={exportData}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
            >
              <Download size={16} className="inline mr-2" /> Export
            </button>
            <button 
              onClick={onLogout}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-700 p-4 rounded mb-6">
          <p className="text-sm text-gray-300">
            <AlertTriangle size={16} className="inline mr-2" />
            Ethical use only. Use on your own systems or with permission.
          </p>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'ip', icon: Globe, label: 'IP Lookup' },
            { id: 'dns', icon: Wifi, label: 'DNS' },
            { id: 'breach', icon: Shield, label: 'Breach' },
            { id: 'username', icon: User, label: 'Username' },
            { id: 'phone', icon: Phone, label: 'Phone' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded ${
                activeTab === tab.id 
                  ? 'bg-white text-black' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <tab.icon size={16} className="inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded p-6 min-h-96">
          {activeTab === 'ip' && (
            <div>
              <h2 className="text-xl font-bold mb-4">IP Geolocation</h2>
              <input
                type="text"
                placeholder="Enter IP (e.g., 8.8.8.8)"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded mb-4 text-white"
                onKeyPress={(e) => e.key === 'Enter' && lookupIP()}
              />
              <button
                onClick={lookupIP}
                disabled={ipLoading}
                className="bg-white text-black px-6 py-3 rounded hover:bg-gray-300"
              >
                {ipLoading ? 'Loading...' : 'Lookup'}
              </button>

              {ipResult && (
                <div className="mt-6 bg-gray-800 p-4 rounded">
                  {ipResult.error ? (
                    <p className="text-gray-300">{ipResult.error}</p>
                  ) : (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between border-b border-gray-700 pb-2">
                        <span className="text-gray-400">IP</span>
                        <span className="text-white">{ipResult.ip}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-700 pb-2">
                        <span className="text-gray-400">Country</span>
                        <span className="text-white">{ipResult.country_name}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-700 pb-2">
                        <span className="text-gray-400">City</span>
                        <span className="text-white">{ipResult.city}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-700 pb-2">
                        <span className="text-gray-400">ISP</span>
                        <span className="text-white">{ipResult.org}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Coordinates</span>
                        <span className="text-white">{ipResult.latitude}, {ipResult.longitude}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'dns' && (
            <div>
              <h2 className="text-xl font-bold mb-4">DNS Resolution</h2>
              <input
                type="text"
                placeholder="Enter domain (e.g., google.com)"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded mb-4 text-white"
                onKeyPress={(e) => e.key === 'Enter' && lookupDNS()}
              />
              <button
                onClick={lookupDNS}
                disabled={dnsLoading}
                className="bg-white text-black px-6 py-3 rounded hover:bg-gray-300"
              >
                {dnsLoading ? 'Loading...' : 'Resolve'}
              </button>

              {dnsResult && (
                <div className="mt-6 bg-gray-800 p-4 rounded">
                  {dnsResult.error ? (
                    <p className="text-gray-300">{dnsResult.error}</p>
                  ) : (
                    <div className="space-y-2">
                      {dnsResult.Answer?.map((record, i) => (
                        <div key={i} className="p-3 bg-gray-700 rounded text-sm">
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-400">Type</span>
                            <span className="text-white">{record.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Address</span>
                            <span className="text-white">{record.data}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'breach' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Data Breach Check</h2>
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded mb-4 text-white"
                onKeyPress={(e) => e.key === 'Enter' && checkBreaches()}
              />
              <button
                onClick={checkBreaches}
                disabled={breachLoading}
                className="bg-white text-black px-6 py-3 rounded hover:bg-gray-300"
              >
                {breachLoading ? 'Checking...' : 'Check'}
              </button>

              {breachResult && (
                <div className="mt-6 bg-gray-800 p-4 rounded">
                  {breachResult.error ? (
                    <p className="text-gray-300">{breachResult.error}</p>
                  ) : breachResult.safe ? (
                    <p className="text-white">No breaches found</p>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-white font-bold mb-3">
                        Found in {breachResult.breaches?.length} breaches
                      </p>
                      {breachResult.breaches?.map((breach, i) => (
                        <div key={i} className="p-3 bg-gray-700 rounded text-sm">
                          <p className="text-white font-bold">{breach.Name}</p>
                          <p className="text-gray-400">{breach.Domain}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'username' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Username Search</h2>
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded mb-4 text-white"
              />
              <button
                onClick={searchUsername}
                className="bg-white text-black px-6 py-3 rounded hover:bg-gray-300"
              >
                Search Platforms
              </button>
              <p className="text-sm text-gray-400 mt-4">
                Opens GitHub, Twitter, Instagram, Reddit
              </p>
            </div>
          )}

          {activeTab === 'phone' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Phone Analysis</h2>
              <input
                type="text"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded mb-4 text-white"
              />
              <button
                onClick={analyzePhone}
                className="bg-white text-black px-6 py-3 rounded hover:bg-gray-300"
              >
                Analyze
              </button>

              {phoneResult && (
                <div className="mt-6 bg-gray-800 p-4 rounded text-sm">
                  <div className="flex justify-between border-b border-gray-700 pb-2 mb-2">
                    <span className="text-gray-400">Number</span>
                    <span className="text-white">{phoneResult.number}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-700 pb-2 mb-2">
                    <span className="text-gray-400">Digits</span>
                    <span className="text-white">{phoneResult.digits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Country</span>
                    <span className="text-white">{phoneResult.country}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}