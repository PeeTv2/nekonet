// CookieBanner.jsx
export default function CookieBanner({ onAccept, onReject }) {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-gray-900 to-black border border-gray-700/50 rounded-2xl max-w-lg w-full p-8 text-center shadow-2xl">
        <div className="mb-6">
          <img 
            src="/logo.png" 
            alt="NekoNet Logo" 
            className="w-28 h-28 mx-auto object-contain"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/112?text=NekoNet";
              e.target.alt = "Logo fallback";
            }}
          />
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-4">NekoNet</h2>
        
        <p className="text-gray-400 mb-8">
          This tool uses cookies only for basic functionality and settings.<br/>
          No tracking, no analytics.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onAccept}
            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium py-3.5 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-purple-900/30"
          >
            Accept & Continue
          </button>
          
          <button
            onClick={onReject}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium py-3.5 px-8 rounded-xl transition-all duration-300 border border-gray-600"
          >
            Reject (limited features)
          </button>
        </div>
      </div>
    </div>
  );
}