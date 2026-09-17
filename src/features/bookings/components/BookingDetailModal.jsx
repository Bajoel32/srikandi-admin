import { useState } from 'react';
import Modal from '../../../components/Modal.jsx';
import { useToast } from '../../../lib/ToastProvider.jsx';
import { updateBooking } from '../api.js';
import { buildWhatsAppUrl } from '../utils/whatsapp.js';
import { formatDateJakarta, formatDateTimeJakarta, formatRelativeTime } from '../utils/format.js';
import StatusBadge from './StatusBadge.jsx';
import QuantityStepper from './QuantityStepper.jsx';
import PaymentPicker from './PaymentPicker.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';

const STATUS_ACTIONS = {
  Baru: [
    { next: 'Diproses', label: 'Proses', title: 'Proses booking?', message: 'Yakin ingin memproses booking ini?', confirmLabel: 'Ya, Proses' },
    { next: 'Dibatalkan', label: 'Batalkan', danger: true, title: 'Batalkan booking?', message: 'Yakin ingin membatalkan booking ini? Anda tetap bisa membukanya kembali nanti bila diperlukan.', confirmLabel: 'Ya, Batalkan' },
  ],
  Diproses: [
    { next: 'Selesai', label: 'Tandai Selesai', title: 'Tandai selesai?', message: 'Yakin menandai booking ini selesai?', confirmLabel: 'Ya, Selesai' },
    { next: 'Dibatalkan', label: 'Batalkan', danger: true, title: 'Batalkan booking?', message: 'Yakin ingin membatalkan booking ini? Anda tetap bisa membukanya kembali nanti bila diperlukan.', confirmLabel: 'Ya, Batalkan' },
  ],
  Selesai: [
    { next: 'Diproses', label: 'Buka Kembali', title: 'Buka kembali booking?', message: 'Booking akan dikembalikan ke status Diproses. Lanjutkan?', confirmLabel: 'Ya, Buka Kembali' },
  ],
  Dibatalkan: [
    { next: 'Diproses', label: 'Buka Kembali', title: 'Buka kembali booking?', message: 'Booking akan dikembalikan ke status Diproses. Lanjutkan?', confirmLabel: 'Ya, Buka Kembali' },
  ],
};

export default function BookingDetailModal({ booking, onClose, onUpdated }) {
  const showToast = useToast();
  const [estimatedDate, setEstimatedDate] = useState(booking.estimated_date || '');
  const [quantity, setQuantity] = useState(booking.quantity);
  const [payment, setPayment] = useState(booking.preferred_payment || '');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [pendingAction, setPendingAction] = useState(null);
  const [statusBusy, setStatusBusy] = useState(false);

  const dirty =
    estimatedDate !== (booking.estimated_date || '') ||
    quantity !== booking.quantity ||
    payment !== (booking.preferred_payment || '');

  const saveEdits = async () => {
    setSaving(true);
    setSaveError('');
    try {
      const patch = {
        estimated_date: estimatedDate || null,
        quantity,
        preferred_payment: payment,
      };
      const updated = await updateBooking(booking.id, patch);
      onUpdated(updated);
      showToast('Tersimpan');
    } catch {
      setSaveError('Gagal menyimpan perubahan. Coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  const confirmStatusChange = async () => {
    if (!pendingAction) return;
    setStatusBusy(true);
    try {
      const updated = await updateBooking(booking.id, { status: pendingAction.next });
      onUpdated(updated);
      showToast('Tersimpan');
      setPendingAction(null);
    } catch {
      setSaveError('Gagal mengubah status. Coba lagi.');
      setPendingAction(null);
    } finally {
      setStatusBusy(false);
    }
  };

  const waUrl = buildWhatsAppUrl({
    phoneNumber: booking.phone_number,
    customerName: booking.customer_name,
    serviceName: booking.service_name,
  });

  const actions = STATUS_ACTIONS[booking.status] || [];

  return (
    <>
      <Modal title="Detail Booking" onClose={onClose}>
        <div className="detail-head">
          <div>
            <div className="booking-card-name">{booking.customer_name}</div>
            <div className="muted">{booking.phone_number}</div>
            {booking.email && <div className="muted">{booking.email}</div>}
          </div>
          <StatusBadge status={booking.status} />
        </div>

        <div className="group-title">Layanan</div>
        <div className="field">
          <label>Nama layanan</label>
          <div>{booking.service_name}</div>
        </div>
        {booking.service_details && (
          <div className="field">
            <label>Detail layanan</label>
            <div>{booking.service_details}</div>
          </div>
        )}
        {booking.notes && (
          <div className="field">
            <label>Catatan pelanggan</label>
            <div>{booking.notes}</div>
          </div>
        )}

        <div className="group-title">Yang bisa diubah</div>
        <div className="field">
          <label>Perkiraan tanggal</label>
          <input
            type="date"
            value={estimatedDate ? estimatedDate.slice(0, 10) : ''}
            onChange={(e) => setEstimatedDate(e.target.value)}
            disabled={saving}
          />
        </div>
        <div className="field">
          <label>Jumlah</label>
          <QuantityStepper value={quantity} onChange={setQuantity} disabled={saving} />
        </div>
        <div className="field">
          <label>Cara bayar</label>
          <PaymentPicker value={payment} onChange={setPayment} disabled={saving} />
        </div>

        {saveError && (
          <div className="banner err">
            {saveError}{' '}
            <button type="button" className="btn sm" onClick={saveEdits}>
              Coba lagi
            </button>
          </div>
        )}

        <button className="btn primary" style={{ width: '100%' }} disabled={!dirty || saving} onClick={saveEdits}>
          {saving ? 'Menyimpan…' : 'Simpan Perubahan'}
        </button>

        <div className="group-title">Ubah status</div>
        <div className="status-actions">
          {actions.map((action) => (
            <button
              key={action.next}
              type="button"
              className={'btn' + (action.danger ? ' danger-solid' : ' primary')}
              onClick={() => setPendingAction(action)}
            >
              {action.label}
            </button>
          ))}
        </div>

        <a className="btn btn-whatsapp" style={{ width: '100%', marginTop: 14, justifyContent: 'center' }} href={waUrl} target="_blank" rel="noreferrer">
          Hubungi via WhatsApp
        </a>

        <div className="muted" style={{ fontSize: 12, marginTop: 14 }}>
          Masuk {formatDateTimeJakarta(booking.created_at)} · {formatRelativeTime(booking.created_at)}
          {booking.estimated_date && ` · Estimasi ${formatDateJakarta(booking.estimated_date)}`}
        </div>
      </Modal>

      {pendingAction && (
        <ConfirmDialog
          title={pendingAction.title}
          message={pendingAction.message}
          confirmLabel={pendingAction.confirmLabel}
          danger={pendingAction.danger}
          busy={statusBusy}
          onConfirm={confirmStatusChange}
          onCancel={() => setPendingAction(null)}
        />
      )}
    </>
  );
}
