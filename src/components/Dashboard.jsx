import { useState } from 'react';
import AIBrainChat from './AIBrainChat';
import { 
  Globe, Wifi, Shield, Webcam, Scan, Link, Server, Database, 
  MailSearch, GlobeLock, Activity, FileSearch, LogOut, Search, 
  ExternalLink, ArrowRight, Menu, X, Bot, AlertTriangle, Sparkles,
  Image as ImageIcon, Loader
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

export default function Dashboard({ onLogout }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [aiChatOpen, setAiChatOpen] = useState(false);
  
  // Smart Search State
  const [smartSearchQuery, setSmartSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);

  const filteredTools = tools.filter(tool => 
    (selectedCategory === 'all' || tool.id === selectedCategory) &&
    (tool.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
     tool.desc.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const categories = [
    { id: 'all', label: 'All Tools' },
    { id: 'network', label: 'Network' },
    { id: 'security', label: 'Security' },
    { id: 'intelligence', label: 'Intelligence' },
  ];

  const performSmartSearch = async () => {
    if (!smartSearchQuery.trim()) return;
    
    setSearching(true);
    setSearchResults(null);

    try {
      // Search Wikipedia
      const wikiResponse = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(smartSearchQuery)}`
      );
      const wikiData = await wikiResponse.json();

      // Search Reddit
      const redditResponse = await fetch(
        `https://www.reddit.com/search.json?q=${encodeURIComponent(smartSearchQuery)}&limit=5`
      );
      const redditData = await redditResponse.json();

      setSearchResults({
        wikipedia: wikiData,
        reddit: redditData?.data?.children || [],
        query: smartSearchQuery
      });
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults({
        error: 'Failed to fetch search results. Please try again.',
        query: smartSearchQuery
      });
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-white/10 bg-black/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-white/10 rounded-lg transition lg:hidden"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center">
                  <Globe className="text-black" size={18} />
                </div>
                <span className="text-xl font-bold tracking-tight">NekoNet</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setAiChatOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition text-sm font-medium"
              >
                <Bot size={16} />
                <span className="hidden sm:inline">AI Chat</span>
              </button>
              <button 
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 border border-white/20 hover:bg-white/10 rounded-lg transition text-sm font-medium"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside className={`
          fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-black border-r border-white/10 
          transition-transform duration-300 z-30
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
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </nav>

            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="text-xs text-white/40 space-y-1">
                <p>© 2026 NekoNet</p>
                <p>Professional OSINT Suite</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-h-[calc(100vh-4rem)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Smart Search Section */}
            <div className="mb-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-white/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="text-purple-400" size={24} />
                <h2 className="text-2xl font-bold">Smart Search</h2>
              </div>
              <p className="text-white/60 mb-4 text-sm">
                Search across Wikipedia and Reddit. Get instant answers with images and summaries.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={smartSearchQuery}
                  onChange={(e) => setSmartSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && performSmartSearch()}
                  placeholder="Search anything... (e.g., 'Quantum Computing', 'Cybersecurity')"
                  className="flex-1 bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition"
                />
                <button
                  onClick={performSmartSearch}
                  disabled={searching || !smartSearchQuery.trim()}
                  className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-white/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {searching ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search size={18} />
                      Search
                    </>
                  )}
                </button>
              </div>

              {/* Search Results */}
              {searchResults && (
                <div className="mt-6 space-y-6">
                  {searchResults.error ? (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
                      {searchResults.error}
                    </div>
                  ) : (
                    <>
                      {/* Wikipedia Result */}
                      {searchResults.wikipedia && !searchResults.wikipedia.type?.includes('disambiguation') && (
                        <div className="bg-black/50 border border-white/20 rounded-xl p-6">
                          <div className="flex items-start gap-4">
                            {searchResults.wikipedia.thumbnail && (
                              <img
                                src={searchResults.wikipedia.thumbnail.source}
                                alt={searchResults.wikipedia.title}
                                className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                              />
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Globe size={16} className="text-blue-400" />
                                <span className="text-xs text-blue-400 font-medium">WIKIPEDIA</span>
                              </div>
                              <h3 className="text-xl font-bold mb-2">{searchResults.wikipedia.title}</h3>
                              <p className="text-white/80 text-sm leading-relaxed mb-3">
                                {searchResults.wikipedia.extract}
                              </p>
                              {searchResults.wikipedia.content_urls && (
                                <a
                                  href={searchResults.wikipedia.content_urls.desktop.page}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition"
                                >
                                  Read more on Wikipedia
                                  <ExternalLink size={14} />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Reddit Results */}
                      {searchResults.reddit && searchResults.reddit.length > 0 && (
                        <div className="bg-black/50 border border-white/20 rounded-xl p-6">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold">r/</span>
                            </div>
                            <span className="text-xs text-orange-400 font-medium">REDDIT DISCUSSIONS</span>
                          </div>
                          <div className="space-y-4">
                            {searchResults.reddit.slice(0, 3).map((post, idx) => (
                              <div key={idx} className="border-l-2 border-orange-500/30 pl-4 py-2">
                                <h4 className="font-semibold mb-1 text-sm">
                                  {post.data.title}
                                </h4>
                                <div className="flex items-center gap-3 text-xs text-white/50 mb-2">
                                  <span>r/{post.data.subreddit}</span>
                                  <span>•</span>
                                  <span>👍 {post.data.ups}</span>
                                  <span>•</span>
                                  <span>💬 {post.data.num_comments}</span>
                                </div>
                                {post.data.thumbnail && post.data.thumbnail.startsWith('http') && (
                                  <img
                                    src={post.data.thumbnail}
                                    alt=""
                                    className="w-20 h-20 object-cover rounded mb-2"
                                  />
                                )}
                                <a
                                  href={`https://reddit.com${post.data.permalink}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300 transition"
                                >
                                  View discussion
                                  <ExternalLink size={12} />
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Warning Banner */}
            <div className="mb-8 border border-yellow-500/20 rounded-xl p-5 bg-yellow-500/5">
              <div className="flex items-start gap-3">
                <AlertTriangle size={20} className="flex-shrink-0 mt-0.5 text-yellow-500" />
                <div>
                  <h3 className="font-semibold mb-1 text-white">Professional Use Only</h3>
                  <p className="text-sm text-white/60">
                    These tools are for authorized security research, penetration testing with explicit permission, 
                    and educational purposes only. Unauthorized access or misuse is strictly prohibited.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">Security Intelligence Tools</h1>
              <p className="text-white/60">Access professional-grade OSINT and security analysis platforms</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTools.map(tool => (
                <a
                  key={tool.id}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group border border-white/10 rounded-xl p-6 hover:border-white/30 hover:bg-white/5 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-white/10 transition">
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

            <div className="mt-12 border-t border-white/10 pt-8">
              <h2 className="text-xl font-semibold mb-4">Recommended Resources</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <a href="https://www.reddit.com/r/OSINT/" target="_blank" rel="noopener noreferrer" 
                   className="border border-white/10 rounded-xl p-4 hover:border-white/30 hover:bg-white/5 transition text-sm">
                  <div className="font-medium mb-1">r/OSINT</div>
                  <div className="text-white/60 text-xs">Community forum</div>
                </a>
                <a href="https://osintframework.com/" target="_blank" rel="noopener noreferrer"
                   className="border border-white/10 rounded-xl p-4 hover:border-white/30 hover:bg-white/5 transition text-sm">
                  <div className="font-medium mb-1">OSINT Framework</div>
                  <div className="text-white/60 text-xs">Tool directory</div>
                </a>
                <a href="https://inteltechniques.com/" target="_blank" rel="noopener noreferrer"
                   className="border border-white/10 rounded-xl p-4 hover:border-white/30 hover:bg-white/5 transition text-sm">
                  <div className="font-medium mb-1">IntelTechniques</div>
                  <div className="text-white/60 text-xs">Research tools</div>
                </a>
                <a href="https://github.com/jivoi/awesome-osint" target="_blank" rel="noopener noreferrer"
                   className="border border-white/10 rounded-xl p-4 hover:border-white/30 hover:bg-white/5 transition text-sm">
                  <div className="font-medium mb-1">Awesome OSINT</div>
                  <div className="text-white/60 text-xs">Curated list</div>
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>

      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <AIBrainChat isOpen={aiChatOpen} onClose={() => setAiChatOpen(false)} />
    </div>
  );
}