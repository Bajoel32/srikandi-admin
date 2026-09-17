import { AuthProvider, useAuth } from './features/auth/AuthProvider.jsx';
import LoginPage from './features/auth/LoginPage.jsx';
import { ToastProvider } from './lib/ToastProvider.jsx';
import BookingsPage from './features/bookings/BookingsPage.jsx';

const MODULES = [
  { key: 'bookings', label: 'Booking', enabled: true },
  { key: 'orders', label: 'Pesanan', enabled: false },
  { key: 'gallery', label: 'Galeri', enabled: false },
  { key: 'consult', label: 'Konsultasi', enabled: false },
];

function Shell() {
  const { admin, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="app-bar">
        <div className="app-bar-brand">
          Srikandi Admin
          {admin?.nama && <small>{admin.nama}</small>}
        </div>
        <button type="button" className="btn" onClick={logout}>
          Keluar
        </button>
      </header>

      <nav className="module-chips">
        {MODULES.map((m) => (
          <span key={m.key} className={'module-chip' + (m.enabled ? ' active' : ' disabled')}>
            {m.label}
            {!m.enabled && <small>Segera hadir</small>}
          </span>
        ))}
      </nav>

      <main className="main">
        <BookingsPage />
      </main>
    </div>
  );
}

function Gate() {
  const { status } = useAuth();

  if (status === 'checking') {
    return <div className="center-page muted">Memeriksa sesi…</div>;
  }
  if (status === 'signedOut') {
    return <LoginPage />;
  }
  return <Shell />;
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Gate />
      </AuthProvider>
    </ToastProvider>
  );
}
