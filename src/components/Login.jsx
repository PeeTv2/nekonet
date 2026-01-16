import { useState } from 'react';
import { Eye, EyeOff, Globe } from 'lucide-react';

export default function Login({ onSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleSubmit = () => {
    if (password === 'nekoadmin123') {
      onSuccess();
    } else {
      setError('Incorrect password');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          {/* Logo with fallback */}
          <div className="w-28 h-28 mx-auto mb-6 relative">
            {!imageError ? (
              <img 
                src="/logo.png" 
                alt="NekoNet Logo" 
                className="w-full h-full object-contain"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                <Globe className="text-black" size={56} />
              </div>
            )}
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">NekoNet</h1>
          <p className="text-white/60">Professional OSINT Suite</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Access Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="Enter password"
                  className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition pr-12"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              className="w-full bg-white text-black font-semibold py-3.5 rounded-lg hover:bg-white/90 transition"
            >
              Enter Dashboard
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-white/40 text-center">
              Authorized access only • All activities are logged
            </p>
          </div>
        </div>

        {/* Hint for demo */}
        <div className="mt-4 text-center">
          <p className="text-xs text-white/30">
            Demo password: nekoadmin123
          </p>
        </div>
      </div>
    </div>
  );
}