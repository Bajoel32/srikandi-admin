import { useState } from 'react';
import { useAuth } from './AuthProvider.jsx';

function friendlyError() {
  return 'Gagal mengirim tautan masuk. Periksa email Anda lalu coba lagi.';
}

// Login khusus untuk modul Booking (Supabase), terpisah dari login utama
// admin hub (username/password ke backend lama).
export default function BookingLoginCard() {
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
    <div className="booking-page">
      <div className="page-head">
        <div>
          <h1>Booking</h1>
          <div className="sub">Masuk dengan email admin untuk mengelola booking.</div>
        </div>
      </div>

      <div className="card pad booking-login-card">
        {notAdminMessage && <div className="banner err">{notAdminMessage}</div>}
        {err && <div className="banner err">{err}</div>}

        {sent ? (
          <div className="banner ok">
            Tautan masuk sudah dikirim ke <strong>{email}</strong>. Buka email Anda dan
            ketuk tautannya untuk masuk.
            <div>
              <button
                type="button"
                className="btn sm"
                style={{ marginTop: 12 }}
                onClick={() => setSent(false)}
              >
                Kirim ulang
              </button>
            </div>
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
              Tidak perlu kata sandi. Login ini terpisah dari login admin hub utama.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
