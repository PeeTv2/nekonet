export default function Restricted() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '20px',
        color: '#ddd'
      }}
    >
      <img
        src="logo.png"           // ← your logo path or URL
        alt="NekoNet Restricted Access"
        style={{
          width: 'min(380px, 75vw)',           // responsive size
          height: 'auto',
          marginBottom: '2.5rem',
          filter: 'brightness(0.9) contrast(1.1)', // optional subtle effect
          opacity: 0.92
        }}
      />

      <h1 style={{ 
        fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
        marginBottom: '1rem',
        letterSpacing: '1px'
      }}>
        ACCESS RESTRICTED
      </h1>

      <p style={{ 
        maxWidth: '640px',
        fontSize: '1.1rem',
        opacity: 0.85,
        lineHeight: 1.5
      }}>
        Only authenticated users with valid invitation can access this content<br/>
        due to strict content violation policies.
      </p>
    </div>
  );
}