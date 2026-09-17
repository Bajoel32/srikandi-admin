import { useEffect, useState } from 'react';
import { api, token, setUnauthorizedHandler } from './api.js';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Services from './pages/Services.jsx';
import Gallery from './pages/Gallery.jsx';
import KnowledgeBase from './pages/KnowledgeBase.jsx';
import Orders from './pages/Orders.jsx';
import Customers from './pages/Customers.jsx';
import ConsultLogs from './pages/ConsultLogs.jsx';
import RagSettings from './pages/RagSettings.jsx';
import BookingSection from './features/bookings/BookingSection.jsx';
import { ToastProvider } from './lib/ToastProvider.jsx';

const NAV = [
  { key: 'dashboard', label: 'Dashboard', ico: '▦', el: Dashboard },
  { key: 'services', label: 'Layanan', ico: '✦', el: Services },
  { key: 'gallery', label: 'Galeri', ico: '▧', el: Gallery },
  { key: 'kb', label: 'Knowledge Base', ico: '❋', el: KnowledgeBase },
  { key: 'rag', label: 'Pengaturan RAG', ico: '⚙', el: RagSettings },
  { key: 'bookings', label: 'Booking', ico: '✎', el: BookingSection },
  { key: 'orders', label: 'Pesanan', ico: '☰', el: Orders },
  { key: 'customers', label: 'Konsumen', ico: '◍', el: Customers },
  { key: 'logs', label: 'Log Chatbot', ico: '❝', el: ConsultLogs },
];

function Hub() {
  const [authed, setAuthed] = useState(Boolean(token.get()));
  const [checking, setChecking] = useState(Boolean(token.get()));
  const [me, setMe] = useState(null);
  const [page, setPage] = useState('dashboard');

  useEffect(() => {
    setUnauthorizedHandler(() => {
      token.clear();
      setAuthed(false);
      setMe(null);
    });
  }, []);

  // Validasi token yang tersimpan saat pertama load.
  useEffect(() => {
    if (!token.get()) return;
    api
      .get('/api/admin/me')
      .then((m) => {
        setMe(m);
        setAuthed(true);
      })
      .catch(() => {
        token.clear();
        setAuthed(false);
      })
      .finally(() => setChecking(false));
  }, []);

  const logout = async () => {
    try {
      await api.post('/api/admin/logout');
    } catch {
      /* abaikan */
    }
    token.clear();
    setAuthed(false);
    setMe(null);
  };

  if (!authed) {
    return (
      <Login
        onLoggedIn={(res) => {
          setMe(res);
          setAuthed(true);
          setChecking(false);
        }}
      />
    );
  }

  if (checking) return <div style={{ padding: 40 }} className="muted">Memeriksa sesi…</div>;

  const Current = NAV.find((n) => n.key === page)?.el || Dashboard;

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          Srikandi
          <small>Admin Hub{me?.username ? ` · ${me.username}` : ''}</small>
        </div>
        {NAV.map((n) => (
          <button
            key={n.key}
            className={'nav-item' + (page === n.key ? ' active' : '')}
            onClick={() => setPage(n.key)}
          >
            <span className="ico">{n.ico}</span>
            {n.label}
          </button>
        ))}
        <div className="nav-spacer" />
        <button className="nav-item" onClick={logout}>
          <span className="ico">⏻</span>
          Keluar
        </button>
      </aside>
      <main className="main">
        <Current />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <Hub />
    </ToastProvider>
  );
}
