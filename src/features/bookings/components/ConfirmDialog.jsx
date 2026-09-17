import Modal from '../../../components/Modal.jsx';

export default function ConfirmDialog({ title, message, confirmLabel, danger, busy, onConfirm, onCancel }) {
  return (
    <Modal
      title={title}
      onClose={onCancel}
      footer={
        <>
          <button type="button" className="btn" onClick={onCancel} disabled={busy}>
            Batal
          </button>
          <button
            type="button"
            className={'btn primary' + (danger ? ' danger-solid' : '')}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? 'Memproses…' : confirmLabel}
          </button>
        </>
      }
    >
      <p style={{ margin: 0 }}>{message}</p>
    </Modal>
  );
}
