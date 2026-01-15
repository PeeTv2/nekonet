// Dashboard.jsx - Expanded version (~800 lines target with features)
import { useState, useEffect } from 'react';
import { 
  Download, AlertTriangle, Globe, Wifi, Shield, User, Phone, Database, 
  Terminal, Mail, Webcam, Image as ImageIcon, ShieldAlert, Scan, Link,
  Server, MailSearch, GlobeLock, Activity, FileSearch, Settings, History,
  Star, Moon, Sun, LogOut, Info, Search, Bell, ChevronDown, ChevronUp
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────
// CONFIG & TABS
// ──────────────────────────────────────────────────────────────
const tabs = [
  { id: 'ip', icon: Globe, label: 'IP Lookup', desc: 'Geolocation & ISP info' },
  { id: 'dns', icon: Wifi, label: 'DNS Resolve', desc: 'A records & more' },
  { id: 'breach', icon: Shield, label: 'Breach Check', desc: 'HIBP lookup' },
  { id: 'username', icon: User, label: 'Sherlock', desc: 'Multi-platform username search' },
  { id: 'phone', icon: Phone, label: 'Phone Analyzer', desc: 'Basic carrier/country guess' },
  { id: 'whois', icon: Database, label: 'WHOIS', desc: 'Domain registration info' },
  { id: 'dorks', icon: Terminal, label: 'Google Dorks', desc: 'Advanced search helper' },
  { id: 'shodan', icon: Webcam, label: 'Shodan', desc: 'Internet-connected devices' },
  { id: 'abuseip', icon: ShieldAlert, label: 'AbuseIPDB', desc: 'IP reputation check' },
  { id: 'virustotal', icon: Scan, label: 'VirusTotal', desc: 'URL/File scanner' },
  { id: 'urlscan', icon: Link, label: 'urlscan.io', desc: 'Website scan reports' },
  { id: 'censys', icon: Server, label: 'Censys', desc: 'Internet-wide asset search' },
  { id: 'mxtoolbox', icon: MailSearch, label: 'MXToolbox', desc: 'Email/DNS diagnostics' },
  { id: 'ssllabs', icon: GlobeLock, label: 'SSL Labs', desc: 'TLS/SSL configuration test' },
  { id: 'otx', icon: Activity, label: 'AlienVault OTX', desc: 'Threat intelligence pulses' },
  { id: 'osintframework', icon: FileSearch, label: 'OSINT Framework', desc: 'Tool directory' },
  { id: 'nmap', icon: Terminal, label: 'Nmap Docs', desc: 'Network scanner reference' },
  { id: 'metasploit', icon: ShieldAlert, label: 'Metasploit Info', desc: 'Penetration testing resources' },
];

const THEMES = {
  dark: { bg: 'from-black via-gray-950 to-black', text: 'text-white', card: 'bg-gray-900/40 border-gray-800' },
  neon: { bg: 'from-purple-950 via-indigo-950 to-black', text: 'text-purple-200', card: 'bg-black/60 border-purple-800/50 shadow-purple-900/30' },
};

export default function Dashboard({ onLogout, cookiesAccepted }) {
  const [activeTab, setActiveTab] = useState('ip');
  const [inputs, setInputs] = useState({});
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});
  const [history, setHistory] = useState([]);           // New: search history
  const [favorites, setFavorites] = useState([]);       // New: favorite tabs
  const [theme, setTheme] = useState('dark');           // New: theme switcher
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeys, setApiKeys] = useState({});           // New: future API key storage

  // ──────────────────────────────────────────────────────────────
  // PERSISTENCE
  // ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem('neko-favorites');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('neko-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // ──────────────────────────────────────────────────────────────
  // CORE ACTION HANDLER
  // ──────────────────────────────────────────────────────────────
  const runAction = async (tabId) => {
    const value = (inputs[tabId] || '').trim();
    if (!value) return;

    setLoading(prev => ({ ...prev, [tabId]: true }));

    const timestamp = new Date().toLocaleString();
    let result = null;

    try {
      switch (tabId) {
        // ── Existing tools (shortened for brevity) ──
        case 'ip':
          const ipRes = await fetch(`https://ipapi.co/${value}/json/`);
          result = await ipRes.json();
          break;
        case 'dns':
          const dnsRes = await fetch(`https://dns.google/resolve?name=${value}&type=A`);
          result = await dnsRes.json();
          break;
        case 'breach':
          const breachRes = await fetch(`https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(value)}`, {
            headers: { 'User-Agent': 'NekoNet-OSINT' }
          });
          if (breachRes.status === 404) result = { safe: true };
          else if (breachRes.ok) result = { safe: false, breaches: await breachRes.json() };
          else result = { error: 'Rate limit or API error' };
          break;
        case 'username':
          const sites = ['github.com','twitter.com','instagram.com','reddit.com/user','tiktok.com/@','linkedin.com/in','facebook.com','twitch.tv','steamcommunity.com/id','youtube.com/@','medium.com/@'];
          sites.forEach(s => window.open(`https://${s}/${value}`, '_blank'));
          result = { message: 'Opened 11 profiles in new tabs' };
          break;
        case 'phone':
          const cleaned = value.replace(/\D/g, '');
          let country = 'Unknown';
          if (cleaned.startsWith('1')) country = 'US/Canada';
          else if (cleaned.startsWith('44')) country = 'UK';
          else if (cleaned.startsWith('91')) country = 'India';
          result = { number: value, digits: cleaned.length, country };
          break;
        // ... (all other cases like whois, shodan, abuseip, virustotal, etc. remain the same)
        case 'osintframework':
          window.open('https://osintframework.com/', '_blank');
          result = { message: 'OSINT Framework directory opened' };
          break;
        case 'nmap':
          window.open('https://nmap.org/nsedoc/', '_blank');
          result = { message: 'Nmap documentation opened (ethical use only)' };
          break;
        default:
          result = { error: 'Tool not implemented yet' };
      }

      setResults(prev => ({ ...prev, [tabId]: result }));
      
      // Add to history
      setHistory(prev => [{
        tab: tabId,
        input: value,
        timestamp,
        success: !result?.error
      }, ...prev.slice(0, 49)]); // keep last 50
    } catch (err) {
      setResults(prev => ({ ...prev, [tabId]: { error: 'Network error or rate limit' } }));
    }

    setLoading(prev => ({ ...prev, [tabId]: false }));
  };

  const toggleFavorite = (tabId) => {
    setFavorites(prev => 
      prev.includes(tabId)
        ? prev.filter(id => id !== tabId)
        : [...prev, tabId]
    );
  };

  const exportResults = () => {
    const data = { results, history, favorites, timestamp: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neko-export-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentTab = tabs.find(t => t.id === activeTab);
  const currentTheme = THEMES[theme] || THEMES.dark;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bg} ${currentTheme.text} p-6 transition-colors duration-500`}>
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="NekoNet" className="w-16 h-16 object-contain" onError={e => e.target.src = 'https://via.placeholder.com/64?text=NN'} />
          <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
            NekoNet Pro
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={exportResults} className="flex items-center gap-2 px-5 py-2.5 bg-gray-800/80 hover:bg-gray-700 rounded-lg border border-gray-700 transition">
            <Download size={18} /> Export
          </button>
          <button onClick={() => setShowSettings(!showSettings)} className="p-2.5 bg-gray-800/80 hover:bg-gray-700 rounded-lg border border-gray-700">
            <Settings size={20} />
          </button>
          <button onClick={onLogout} className="px-5 py-2.5 bg-red-900/60 hover:bg-red-800/60 text-red-200 rounded-lg border border-red-700/50 transition">
            <LogOut size={18} className="inline mr-2" /> Logout
          </button>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mb-8 p-6 bg-gray-900/70 border border-gray-700 rounded-xl">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Settings size={20} /> Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Theme</label>
              <select 
                value={theme} 
                onChange={e => setTheme(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5"
              >
                <option value="dark">Dark (default)</option>
                <option value="neon">Neon Purple</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">API Keys (future)</label>
              <input 
                type="text" 
                placeholder="e.g. VirusTotal API key" 
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Coming in next update</p>
            </div>
          </div>
        </div>
      )}

      {/* Warning & Legal */}
      <div className="bg-amber-950/50 border border-amber-800/60 text-amber-300 p-5 rounded-xl mb-8 flex items-start gap-4">
        <AlertTriangle size={24} className="mt-1 flex-shrink-0" />
        <div>
          <p className="font-semibold mb-2">Important – Ethical & Legal Notice</p>
          <p className="text-sm">
            This tool is for authorized security research, penetration testing with permission, and personal education only. 
            Unauthorized access, data scraping, or any illegal activity is strictly prohibited.
          </p>
        </div>
      </div>

      {/* Quick Links / Affiliates */}
      <div className="mb-8 p-5 bg-gray-900/50 rounded-xl border border-gray-800">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Star size={18} /> Recommended & High-Traffic Resources
        </h3>
        <div className="flex flex-wrap gap-5 text-sm">
          <a href="https://shodan.io" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">Shodan</a>
          <a href="https://cyble.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">Cyble</a>
          <a href="https://www.reddit.com/r/OSINT/" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">r/OSINT</a>
          <a href="https://nordlayer.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">NordLayer VPN (aff)</a>
        </div>
      </div>

      {/* Tabs with Favorites */}
      <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`group relative flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all border flex-shrink-0 ${
              activeTab === tab.id
                ? 'bg-purple-700/40 border-purple-500 text-white shadow-sm'
                : 'bg-gray-900/60 border-gray-700 text-gray-400 hover:bg-gray-800'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
            <button
              onClick={(e) => { e.stopPropagation(); toggleFavorite(tab.id); }}
              className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Star size={14} className={favorites.includes(tab.id) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-500'} />
            </button>
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <main className={`bg-gray-900/40 border border-gray-800 rounded-2xl p-6 md:p-8 min-h-[600px] ${currentTheme.card}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-purple-300">{currentTab.label}</h2>
          <p className="text-sm text-gray-500">{currentTab.desc}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder={`Enter target for ${currentTab.label.toLowerCase()}...`}
            value={inputs[activeTab] || ''}
            onChange={e => setInput(activeTab, e.target.value)}
            onKeyDown={e => e.key === 'Enter' && runAction(activeTab)}
            className="flex-1 bg-gray-950 border border-gray-700 rounded-lg px-5 py-3.5 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/50"
          />
          <button
            onClick={() => runAction(activeTab)}
            disabled={loading[activeTab]}
            className="bg-purple-700 hover:bg-purple-600 px-8 py-3.5 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] flex items-center justify-center gap-2"
          >
            {loading[activeTab] ? (
              <>Loading...</>
            ) : (
              <>Run <Search size={16} /></>
            )}
          </button>
        </div>

        {results[activeTab] && (
          <div className="mt-6 bg-gray-950/70 p-6 rounded-xl border border-gray-800">
            <pre className="text-sm text-gray-300 overflow-auto max-h-[500px] font-mono leading-relaxed whitespace-pre-wrap">
              {JSON.stringify(results[activeTab], null, 2)}
            </pre>
          </div>
        )}

        {/* History Sidebar (collapsible) */}
        {history.length > 0 && (
          <div className="mt-10 border-t border-gray-800 pt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <History size={18} /> Recent Searches
            </h3>
            <ul className="space-y-2 text-sm">
              {history.slice(0, 10).map((item, i) => (
                <li key={i} className="flex justify-between items-center bg-gray-900/50 p-3 rounded-lg">
                  <span className="text-gray-400">
                    {item.timestamp} – <strong>{tabs.find(t => t.id === item.tab)?.label}</strong>: {item.input}
                  </span>
                  <span className={item.success ? 'text-green-400' : 'text-red-400'}>
                    {item.success ? 'OK' : 'Error'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="mt-12 text-center text-gray-600 text-sm">
        NekoNet Pro © 2026 • Ethical OSINT & Security Research Tool • Use responsibly
      </footer>
    </div>
  );
}