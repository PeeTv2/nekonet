import { useState } from 'react';

export default function Login({ onSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === 'nekoadmin123') { // ← must match const PASSWORD above
      onSuccess();
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <div className="container">
      <img
        src="https://via.placeholder.com/300x100/000/fff?text=NekoNet"
        alt="NekoNet Logo"
        className="logo"
      />
      <h1>NekoNet</h1>
      <p>Please enter password:</p>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
        />
        <button type="submit">Enter</button>
      </form>

      {error && <p style={{ color: '#ff5555', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
}