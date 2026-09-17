import { useState } from 'react';
import { api, token } from '../api.js';

export default function Login({ onLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    try {
      const res = await api.post('/api/admin/login', { username, password });
      token.set(res.token);
      onLoggedIn(res);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-wrap">
      <form className="card pad login-card" onSubmit={submit}>
        <h1>Srikandi Admin Hub</h1>
        <p>Masuk untuk mengelola data & memantau sistem.</p>
        {err && <div className="banner err">{err}</div>}
        <div className="field">
          <label>Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} autoFocus autoComplete="username" />
        </div>
        <div className="field">
          <label>Kata sandi</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        <button className="btn primary" style={{ width: '100%' }} disabled={busy}>
          {busy ? 'Memproses…' : 'Masuk'}
        </button>
        <div className="muted" style={{ fontSize: 11, marginTop: 12 }}>
          API: <span className="mono">{api.base}</span>
        </div>
      </form>
    </div>
  );
}
