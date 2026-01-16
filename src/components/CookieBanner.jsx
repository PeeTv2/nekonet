import { Cookie, Shield } from 'lucide-react';

export default function CookieBanner({ onAccept, onReject }) {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black border border-white/20 rounded-2xl max-w-lg w-full p-8 text-center shadow-2xl">
        <div className="mb-6">
          <div className="w-20 h-20 bg-white rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg">
            <Cookie className="text-black" size={36} />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-3">NekoNet</h2>
        <p className="text-lg text-white/80 mb-2">Cookie Policy</p>
        
        <p className="text-white/60 mb-8 leading-relaxed">
          This tool uses cookies only for basic functionality and settings.
          <br/>
          No tracking, no analytics, no third-party cookies.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onAccept}
            className="flex-1 bg-white text-black font-semibold py-3.5 px-8 rounded-xl hover:bg-white/90 transition shadow-lg"
          >
            Accept & Continue
          </button>
          
          <button
            onClick={onReject}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3.5 px-8 rounded-xl transition border border-white/20"
          >
            Reject
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center justify-center gap-2 text-xs text-white/40">
            <Shield size={14} />
            <span>Your privacy is protected</span>
          </div>
        </div>
      </div>
    </div>
  );
}