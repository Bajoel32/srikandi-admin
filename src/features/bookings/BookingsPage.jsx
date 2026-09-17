import { useMemo, useState } from 'react';
import { useBookings } from './hooks/useBookings.js';
import { STATUS_TABS } from './constants.js';
import StatusTabs from './components/StatusTabs.jsx';
import SearchBox from './components/SearchBox.jsx';
import BookingCard from './components/BookingCard.jsx';
import BookingDetailModal from './components/BookingDetailModal.jsx';
import { formatRelativeTime } from './utils/format.js';

function matchesSearch(booking, term) {
  if (!term) return true;
  const lower = term.trim().toLowerCase();
  const name = (booking.customer_name || '').toLowerCase();
  const phoneDigits = (booking.phone_number || '').replace(/\D/g, '');
  const termDigits = term.replace(/\D/g, '');
  return name.includes(lower) || (termDigits.length > 0 && phoneDigits.includes(termDigits));
}

export default function BookingsPage() {
  const { status, items, lastUpdated, reload, applyLocalUpdate } = useBookings();
  const [tab, setTab] = useState('Baru');
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState(null);

  const counts = useMemo(() => {
    const c = { Semua: items.length };
    for (const t of STATUS_TABS) {
      if (t.key === 'Semua') continue;
      c[t.key] = items.filter((b) => b.status === t.key).length;
    }
    return c;
  }, [items]);

  const filtered = useMemo(() => {
    return items
      .filter((b) => tab === 'Semua' || b.status === tab)
      .filter((b) => matchesSearch(b, search));
  }, [items, tab, search]);

  const openBooking = items.find((b) => b.id === openId) || null;

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Booking</h1>
          <div className="sub">
            {lastUpdated ? `Diperbarui ${formatRelativeTime(lastUpdated)}` : 'Memuat…'}
          </div>
        </div>
        <button type="button" className="btn" onClick={reload}>
          ↻ Muat ulang
        </button>
      </div>

      <SearchBox value={search} onChange={setSearch} />
      <StatusTabs active={tab} onChange={setTab} counts={counts} />

      {status === 'error' && (
        <div className="banner err">
          Tidak bisa memuat data booking. Periksa koneksi internet Anda.{' '}
          <button type="button" className="btn sm" onClick={reload}>
            Coba lagi
          </button>
        </div>
      )}

      {status === 'loading' && (
        <div className="booking-list">
          {[1, 2, 3].map((n) => (
            <div key={n} className="booking-card skeleton" />
          ))}
        </div>
      )}

      {status === 'ready' && filtered.length === 0 && (
        <div className="empty-state">
          {tab === 'Baru' && !search ? 'Belum ada booking baru 🎉' : 'Tidak ada booking yang cocok.'}
        </div>
      )}

      {status === 'ready' && filtered.length > 0 && (
        <div className="booking-list">
          {filtered.map((booking) => (
            <BookingCard key={booking.id} booking={booking} onOpen={(b) => setOpenId(b.id)} />
          ))}
        </div>
      )}

      {openBooking && (
        <BookingDetailModal
          booking={openBooking}
          onClose={() => setOpenId(null)}
          onUpdated={(updated) => applyLocalUpdate(updated.id, updated)}
        />
      )}
    </div>
  );
}
