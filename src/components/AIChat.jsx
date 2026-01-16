import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader, X, Sparkles, Trash2, Download } from 'lucide-react';

class SimplifiedAIBrain {
  constructor() {
    this.knowledgeBase = {};
    this.conversationHistory = [];
    this.initializeKnowledge();
  }

  initializeKnowledge() {
    this.knowledgeBase = {
      greetings: {
        patterns: ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon'],
        response: `👋 Hi! I'm NOVA-SEEK, your advanced AI assistant. I can help you with:

• Answering questions on any topic
• Web searches for current information  
• Code debugging and programming help
• Creative problem-solving
• Technical explanations

What would you like to explore today?`,
        confidence: 95
      },
      capabilities: {
        patterns: ['what can you do', 'help', 'capabilities', 'features', 'abilities'],
        response: `🧠 **My Capabilities:**

• **Intelligence**: Natural language understanding with context awareness
• **Web Search**: Real-time information from multiple sources
• **Programming**: Debug code, explain algorithms, best practices
• **Analysis**: Research synthesis and detailed explanations
• **Learning**: I can learn new topics you teach me

Ask me anything and I'll provide detailed, helpful responses!`,
        confidence: 98
      },
      code: {
        patterns: ['code', 'programming', 'debug', 'python', 'javascript', 'react'],
        response: `💻 I can help with programming! I understand:

• Python, JavaScript, React, and many other languages
• Debugging and error resolution
• Code optimization and best practices
• Algorithm explanations
• Project architecture

Share your code or describe what you need help with!`,
        confidence: 90
      }
    };
  }

  async think(userInput) {
    const lower = userInput.toLowerCase();
    
    for (const [topic, data] of Object.entries(this.knowledgeBase)) {
      if (data.patterns.some(pattern => lower.includes(pattern))) {
        return {
          text: data.response,
          confidence: data.confidence,
          source: 'knowledge_base'
        };
      }
    }

    return {
      text: `I understand you're asking about "${userInput}". 

While I can provide general information, for the most accurate and current details, I recommend:

1. **Use the search tools** in the main dashboard
2. **Ask more specific questions** about what you need
3. **Provide context** so I can give better answers

How can I help you explore this topic further?`,
      confidence: 70,
      source: 'default'
    };
  }
}

export default function AIBrainChat({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedAI, setSelectedAI] = useState('nova');
  const messagesEndRef = useRef(null);
  const aiRef = useRef(new SimplifiedAIBrain());

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      let response;
      
      if (selectedAI === 'nova') {
        const result = await aiRef.current.think(currentInput);
        response = result.text;
      } else if (selectedAI === 'gpt') {
        const res = await fetch(`https://zellapi.autos/ai/chatbot?text=${encodeURIComponent(currentInput)}`);
        const data = await res.json();
        response = data.result || data.message || 'No response received';
      } else if (selectedAI === 'gemini') {
        const apis = [
          `https://vapis.my.id/api/gemini?q=${encodeURIComponent(currentInput)}`,
          `https://api.siputzx.my.id/api/ai/gemini-pro?content=${encodeURIComponent(currentInput)}`,
          `https://api.ryzendesu.vip/api/ai/gemini?text=${encodeURIComponent(currentInput)}`
        ];

        for (const api of apis) {
          try {
            const res = await fetch(api);
            const data = await res.json();
            if (data.message || data.data || data.answer || data.result) {
              response = data.message || data.data || data.answer || data.result;
              break;
            }
          } catch (e) {
            continue;
          }
        }
        
        if (!response) throw new Error('All APIs failed');
      }

      const aiMessage = { 
        role: 'assistant', 
        content: response, 
        timestamp: Date.now(),
        ai: selectedAI
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, { 
        role: 'error', 
        content: '⚠️ Failed to get response. Please try again.', 
        timestamp: Date.now() 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const exportChat = () => {
    const chatData = {
      messages,
      exportedAt: new Date().toISOString(),
      aiModel: selectedAI
    };
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-chat-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black border border-white/20 rounded-2xl w-full max-w-4xl h-[80vh] max-h-[700px] flex flex-col shadow-2xl">
        <div className="border-b border-white/10 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <Bot className="text-black" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white">AI Assistant</h3>
              <p className="text-xs text-white/60">Multi-model AI chat</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={exportChat}
              disabled={messages.length === 0}
              className="p-2 hover:bg-white/10 rounded-lg transition disabled:opacity-30"
              title="Export chat"
            >
              <Download size={18} className="text-white" />
            </button>
            <button 
              onClick={clearChat}
              disabled={messages.length === 0}
              className="p-2 hover:bg-white/10 rounded-lg transition disabled:opacity-30"
              title="Clear chat"
            >
              <Trash2 size={18} className="text-white" />
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
        </div>

        <div className="border-b border-white/10 p-3 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setSelectedAI('nova')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap flex items-center gap-2 ${
              selectedAI === 'nova' 
                ? 'bg-white text-black' 
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            <Sparkles size={14} />
            NOVA (Local)
          </button>
          <button
            onClick={() => setSelectedAI('gpt')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
              selectedAI === 'gpt' 
                ? 'bg-white text-black' 
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            ChatGPT
          </button>
          <button
            onClick={() => setSelectedAI('gemini')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
              selectedAI === 'gemini' 
                ? 'bg-white text-black' 
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            Gemini
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-white/40 py-12">
              <Bot size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Start a conversation with AI</p>
              <p className="text-xs mb-6">
                Current model: <span className="text-white font-medium">{selectedAI.toUpperCase()}</span>
              </p>
              <div className="mt-6 text-sm text-white/60 max-w-md mx-auto space-y-2">
                <p className="mb-3 font-medium text-white/80">Try asking:</p>
                <div className="space-y-1.5">
                  <p>• "What can you do?"</p>
                  <p>• "Explain quantum computing"</p>
                  <p>• "Help me debug Python code"</p>
                </div>
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bot size={16} className="text-white" />
                </div>
              )}
              
              <div
                className={`max-w-[75%] rounded-xl p-3.5 ${
                  msg.role === 'user'
                    ? 'bg-white text-black'
                    : msg.role === 'error'
                    ? 'bg-red-900/30 text-red-200 border border-red-800/50'
                    : 'bg-white/5 text-white border border-white/10'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-current/10">
                  <p className="text-xs opacity-50">
                    {msg.ai ? `via ${msg.ai.toUpperCase()}` : ''}
                  </p>
                  <p className="text-xs opacity-50">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                  <User size={16} className="text-black" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <Loader size={14} className="animate-spin text-white" />
                  <span className="text-sm text-white/60">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-white/10 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Type your message... (Enter to send)"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/30 text-sm"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-white/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send size={16} />
            </button>
          </div>
          <p className="text-xs text-white/40 mt-2">
            Model: <span className="text-white font-medium">{selectedAI.toUpperCase()}</span> • 
            Messages: {messages.filter(m => m.role !== 'error').length}
          </p>
        </div>
      </div>
    </div>
  );
}