import { useState, useEffect } from 'react';
import AIChat from './AIChat';
import { Bot, MessageSquare } from 'lucide-react';

import { 
  Download, AlertTriangle, Globe, Wifi, Shield, User, Phone, Database, 
  Terminal, Webcam, ShieldAlert, Scan, Link, Server, MailSearch, 
  GlobeLock, Activity, FileSearch, Settings, LogOut, Search, ExternalLink,
  ArrowRight, Menu, X
} from 'lucide-react';

const tools = [
  { id: 'ip', icon: Globe, label: 'IP Intelligence', url: 'https://ipinfo.io/', desc: 'Advanced IP geolocation & analysis' },
  { id: 'dns', icon: Wifi, label: 'DNS Analyzer', url: 'https://dns.google/', desc: 'DNS records & resolution' },
  { id: 'breach', icon: Shield, label: 'Breach Database', url: 'https://haveibeenpwned.com/', desc: 'Check compromised accounts' },
  { id: 'shodan', icon: Webcam, label: 'Shodan', url: 'https://www.shodan.io/', desc: 'IoT & device search engine' },
  { id: 'virustotal', icon: Scan, label: 'VirusTotal', url: 'https://www.virustotal.com/', desc: 'Multi-scanner analysis' },
  { id: 'urlscan', icon: Link, label: 'URLScan', url: 'https://urlscan.io/', desc: 'Website security scanner' },
  { id: 'censys', icon: Server, label: 'Censys', url: 'https://search.censys.io/', desc: 'Internet asset discovery' },
  { id: 'whois', icon: Database, label: 'WHOIS Lookup', url: 'https://who.is/', desc: 'Domain registration data' },
  { id: 'mxtoolbox', icon: MailSearch, label: 'MXToolbox', url: 'https://mxtoolbox.com/', desc: 'Email server diagnostics' },
  { id: 'ssllabs', icon: GlobeLock, label: 'SSL Labs', url: 'https://www.ssllabs.com/ssltest/', desc: 'SSL/TLS testing' },
  { id: 'otx', icon: Activity, label: 'AlienVault OTX', url: 'https://otx.alienvault.com/', desc: 'Threat intelligence platform' },
  { id: 'osint', icon: FileSearch, label: 'OSINT Framework', url: 'https://osintframework.com/', desc: 'OSINT tools directory' },
];

export default function Dashboard({ onLogout, cookiesAccepted }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [aiChatOpen, setAiChatOpen] = useState(false);

  const filteredTools = tools.filter(tool => 
    (selectedCategory === 'all' || tool.id === selectedCategory) &&
    (tool.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
     tool.desc.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const categories = [
    { id: 'all', label: 'All Tools' },
    { id: 'network', label: 'Network', items: ['ip', 'dns', 'whois'] },
    { id: 'security', label: 'Security', items: ['shodan', 'virustotal', 'urlscan', 'ssllabs'] },
    { id: 'intelligence', label: 'Intelligence', items: ['breach', 'otx', 'osint'] },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Navigation */}
      <nav className="border-b border-white/10 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-white/5 rounded-lg transition lg:hidden"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                  <Globe className="text-black" size={18} />
                </div>
                <span className="text-xl font-bold tracking-tight">NekoNet</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setAiChatOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition text-sm"
              >
                <Bot size={16} />
                <span className="hidden sm:inline">AI Chat</span>
              </button>
              <button 
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 border border-white/20 hover:bg-white/5 rounded-lg transition text-sm"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-black border-r border-white/10 
          transition-transform duration-300 z-40
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-6">
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-white/30 transition"
              />
            </div>

            <nav className="space-y-1">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                    selectedCategory === cat.id
                      ? 'bg-white text-black'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </nav>

            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="text-xs text-white/40 space-y-2">
                <p>© 2026 NekoNet</p>
                <p>Professional OSINT Suite</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-4rem)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Warning Banner */}
            <div className="mb-8 border border-white/20 rounded-lg p-5 bg-white/5">
              <div className="flex items-start gap-3">
                <AlertTriangle size={20} className="flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Professional Use Only</h3>
                  <p className="text-sm text-white/60">
                    These tools are for authorized security research, penetration testing with explicit permission, 
                    and educational purposes only. Unauthorized access or misuse is strictly prohibited.
                  </p>
                </div>
              </div>
            </div>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">Security Intelligence Tools</h1>
              <p className="text-white/60">Access professional-grade OSINT and security analysis platforms</p>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTools.map(tool => (
                <a
                  key={tool.id}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group border border-white/10 rounded-lg p-6 hover:border-white/30 hover:bg-white/5 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-white/10 transition">
                      <tool.icon size={24} className="text-white" />
                    </div>
                    <ExternalLink size={18} className="text-white/40 group-hover:text-white transition" />
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-white transition">
                    {tool.label}
                  </h3>
                  
                  <p className="text-sm text-white/60 mb-4">
                    {tool.desc}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-white/40 group-hover:text-white transition">
                    <span>Open tool</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>
              ))}
            </div>

            {filteredTools.length === 0 && (
              <div className="text-center py-16 text-white/40">
                <Search size={48} className="mx-auto mb-4 opacity-50" />
                <p>No tools found matching your search</p>
              </div>
            )}

            {/* Quick Links */}
            <div className="mt-12 border-t border-white/10 pt-8">
              <h2 className="text-xl font-semibold mb-4">Recommended Resources</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <a href="https://www.reddit.com/r/OSINT/" target="_blank" rel="noopener noreferrer" 
                   className="border border-white/10 rounded-lg p-4 hover:border-white/30 hover:bg-white/5 transition text-sm">
                  <div className="font-medium mb-1">r/OSINT</div>
                  <div className="text-white/60 text-xs">Community forum</div>
                </a>
                <a href="https://osintframework.com/" target="_blank" rel="noopener noreferrer"
                   className="border border-white/10 rounded-lg p-4 hover:border-white/30 hover:bg-white/5 transition text-sm">
                  <div className="font-medium mb-1">OSINT Framework</div>
                  <div className="text-white/60 text-xs">Tool directory</div>
                </a>
                <a href="https://inteltechniques.com/" target="_blank" rel="noopener noreferrer"
                   className="border border-white/10 rounded-lg p-4 hover:border-white/30 hover:bg-white/5 transition text-sm">
                  <div className="font-medium mb-1">IntelTechniques</div>
                  <div className="text-white/60 text-xs">Research tools</div>
                </a>
                <a href="https://github.com/jivoi/awesome-osint" target="_blank" rel="noopener noreferrer"
                   className="border border-white/10 rounded-lg p-4 hover:border-white/30 hover:bg-white/5 transition text-sm">
                  <div className="font-medium mb-1">Awesome OSINT</div>
                  <div className="text-white/60 text-xs">Curated list</div>
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <AIChat isOpen={aiChatOpen} onClose={() => setAiChatOpen(false)} />
    </div>
  );
}