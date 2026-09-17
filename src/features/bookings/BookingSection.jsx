import { AuthProvider, useAuth } from '../auth/AuthProvider.jsx';
import BookingLoginCard from '../auth/BookingLoginCard.jsx';
import BookingsPage from './BookingsPage.jsx';

function Gate() {
  const { status } = useAuth();

  if (status === 'checking') {
    return <div className="muted" style={{ padding: 40 }}>Memeriksa sesi booking…</div>;
  }
  if (status === 'signedOut') {
    return <BookingLoginCard />;
  }
  return <BookingsPage />;
}

// Modul Booking punya sesi login sendiri (Supabase OTP), terpisah dari
// login utama admin hub, karena RLS Supabase butuh sesi Supabase asli.
export default function BookingSection() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  );
}
