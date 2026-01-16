export default function CookieBanner({ onAccept, onReject }) {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black border border-white/20 rounded-2xl max-w-lg w-full p-8 text-center">
        <div className="mb-6">
          <img 
            src="/logo.png" 
            alt="NekoNet Logo" 
            className="w-28 h-28 mx-auto object-contain"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/112x112/000/fff?text=NN";
            }}
          />
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-4">NekoNet</h2>
        
        <p className="text-white/60 mb-8">
          This tool uses cookies only for basic functionality and settings.<br/>
          No tracking, no analytics.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onAccept}
            className="flex-1 bg-white text-black font-medium py-3.5 px-8 rounded-xl hover:bg-white/90 transition"
          >
            Accept & Continue
          </button>
          
          <button
            onClick={onReject}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-3.5 px-8 rounded-xl transition border border-white/20"
          >
            Reject (limited features)
          </button>
        </div>
      </div>
    </div>
  );
}