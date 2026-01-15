export default function CookieBanner({ onAccept, onReject }) {
  return (
    <div id="cookie-banner">
      <p>We use cookies for basic functionality. Accept?</p>
      <div style={{ marginTop: '12px' }}>
        <button 
          onClick={onAccept} 
          className="primary" 
          style={{ marginRight: '16px' }}
        >
          Accept
        </button>
        <button onClick={onReject}>Reject</button>
      </div>
    </div>
  )
}