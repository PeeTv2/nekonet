export default function CookieBanner({ onAccept, onReject }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
      <div className="bg-white text-black p-8 rounded max-w-md w-full text-center">
        <img src="/logo.png" alt="Logo" className="w-32 h-32 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">NekoNet</h2>
        <p className="mb-6 text-gray-700">We use cookies for basic functionality. Accept?</p>
        <div className="flex gap-4">
          <button 
            onClick={onAccept} 
            className="flex-1 bg-black text-white py-3 px-6 rounded hover:bg-gray-800"
          >
            Accept
          </button>
          <button 
            onClick={onReject}
            className="flex-1 bg-gray-500 text-white py-3 px-6 rounded hover:bg-gray-600"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  )
}