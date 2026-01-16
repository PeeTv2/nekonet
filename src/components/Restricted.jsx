import { useState } from 'react';
import { ShieldAlert, Globe } from 'lucide-react';

export default function Restricted() {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* Logo with fallback */}
        <div className="w-48 h-48 mx-auto mb-8 relative">
          {!imageError ? (
            <img
              src="/logo.png"
              alt="NekoNet"
              className="w-full h-full object-contain"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-white rounded-3xl flex items-center justify-center">
              <Globe className="text-black" size={96} />
            </div>
          )}
        </div>

        <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
          ACCESS RESTRICTED
        </h1>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
          <p className="text-white/80 text-lg mb-3">
            Valid invitation required to access this system
          </p>
          
          <p className="text-white/50 text-sm">
            Only authenticated users with valid invitation can access this content
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-white/40 text-sm">
          <ShieldAlert size={16} />
          <span>Secure System • Authorized Access Only</span>
        </div>
      </div>
    </div>
  );
}