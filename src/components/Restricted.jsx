import { ShieldAlert } from 'lucide-react';

export default function Restricted() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <img
          src="/logo.png"
          alt="NekoNet"
          className="w-48 h-48 mx-auto mb-8 object-contain"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/192x192/000/fff?text=NekoNet";
          }}
        />

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