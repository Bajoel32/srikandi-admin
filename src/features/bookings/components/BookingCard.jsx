import { buildWhatsAppUrl } from '../utils/whatsapp.js';
import { formatDateJakarta, formatDateTimeJakarta, formatRelativeTime } from '../utils/format.js';
import StatusBadge from './StatusBadge.jsx';

export default function BookingCard({ booking, onOpen }) {
  const waUrl = buildWhatsAppUrl({
    phoneNumber: booking.phone_number,
    customerName: booking.customer_name,
    serviceName: booking.service_name,
  });

  return (
    <div className="booking-card">
      <div className="booking-card-top">
        <div>
          <div className="booking-card-name">{booking.customer_name}</div>
          <div className="muted">{booking.service_name}</div>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <dl className="booking-card-meta">
        <div>
          <dt>Jumlah</dt>
          <dd>{booking.quantity}</dd>
        </div>
        <div>
          <dt>Perkiraan tanggal</dt>
          <dd>{booking.estimated_date ? formatDateJakarta(booking.estimated_date) : '—'}</dd>
        </div>
        <div>
          <dt>Cara bayar</dt>
          <dd>{booking.preferred_payment || '—'}</dd>
        </div>
      </dl>

      <div className="booking-card-time muted" title={formatDateTimeJakarta(booking.created_at)}>
        Masuk {formatDateTimeJakarta(booking.created_at)} · {formatRelativeTime(booking.created_at)}
      </div>

      <div className="booking-card-actions">
        <button type="button" className="btn" onClick={() => onOpen(booking)}>
          Lihat Detail
        </button>
        <a className="btn btn-whatsapp" href={waUrl} target="_blank" rel="noreferrer">
          Hubungi via WhatsApp
        </a>
      </div>
    </div>
  );
}
