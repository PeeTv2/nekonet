import { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, User, CornerDownLeft } from 'lucide-react';

export default function AIChat({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    if (input.trim() === '') return;

    const newMessages = [...messages, { text: input, sender: 'user' }];
    setMessages(newMessages);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { text: "This is a simulated AI response.", sender: 'ai' }]);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-[400px] h-[600px] bg-black border border-white/20 rounded-lg shadow-2xl flex flex-col z-50">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Bot size={20} />
          <h3 className="font-semibold">AI Assistant</h3>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
              {msg.sender === 'ai' && <Bot size={20} className="flex-shrink-0" />}
              <div className={`px-4 py-2.5 rounded-lg max-w-xs ${msg.sender === 'user' ? 'bg-white/10' : 'bg-transparent'}`}>
                <p className="text-sm">{msg.text}</p>
              </div>
              {msg.sender === 'user' && <User size={20} className="flex-shrink-0" />}
            </div>
          ))}
           <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything..."
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-white/30"
          />
          <button
            onClick={handleSend}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-lg"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-xs text-white/40 mt-2 text-center">
          AI responses may be inaccurate.
        </p>
      </div>
    </div>
  );
}
