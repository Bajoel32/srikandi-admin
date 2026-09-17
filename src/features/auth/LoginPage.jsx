import { useState } from 'react';
import { useAuth } from './AuthProvider.jsx';

function friendlyError() {
  return 'Gagal mengirim tautan masuk. Periksa email Anda lalu coba lagi.';
}

export default function LoginPage() {
  const { requestLoginLink, notAdminMessage } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    try {
      await requestLoginLink(email.trim());
      setSent(true);
    } catch {
      setErr(friendlyError());
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-wrap">
      <div className="card pad login-card">
        <h1>Srikandi Admin</h1>
        <p>Kelola booking pelanggan Toko Srikandi.</p>

        {notAdminMessage && <div className="banner err">{notAdminMessage}</div>}
        {err && <div className="banner err">{err}</div>}

        {sent ? (
          <div className="banner ok">
            Tautan masuk sudah dikirim ke <strong>{email}</strong>. Buka email Anda dan
            ketuk tautannya untuk masuk.
            <button
              type="button"
              className="btn sm"
              style={{ marginTop: 12 }}
              onClick={() => setSent(false)}
            >
              Kirim ulang
            </button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="field">
              <label>Email admin</label>
              <input
                type="email"
                required
                autoFocus
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@tokosrikandi.com"
              />
            </div>
            <button className="btn primary" style={{ width: '100%' }} disabled={busy}>
              {busy ? 'Mengirim…' : 'Kirim Tautan Masuk'}
            </button>
            <p className="muted" style={{ fontSize: 13, marginTop: 14 }}>
              Tidak perlu kata sandi. Kami akan mengirim tautan masuk ke email Anda.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
