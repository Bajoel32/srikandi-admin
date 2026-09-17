import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';
import Modal from '../components/Modal.jsx';

const STATUSES = ['Belum Dimulai', 'Menunggu Approval', 'Sedang Dikerjakan', 'Selesai'];

export default function Orders() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { items } = await api.get('/api/admin/orders');
      setItems(items || []);
      setErr('');
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = items.filter((o) => {
    if (!q) return true;
    const s = q.toLowerCase();
    return (
      String(o.orderNumber).toLowerCase().includes(s) ||
      String(o.customerName).toLowerCase().includes(s) ||
      String(o.status).toLowerCase().includes(s)
    );
  });

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Pesanan</h1>
          <div className="sub">{items.length} pesanan. Ubah status & progres yang dilihat konsumen di portal.</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            placeholder="Cari nomor / nama / status…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--panel)' }}
          />
          <button className="btn sm" onClick={load}>↻</button>
        </div>
      </div>

      {err && <div className="banner err">{err}</div>}

      <div className="card table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>Nomor</th>
              <th>Konsumen</th>
              <th>Layanan</th>
              <th>Kadar</th>
              <th>Progres</th>
              <th>Status</th>
              <th>Dibuat</th>
              <th className="right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="muted">Memuat…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} className="muted">Tidak ada hasil.</td></tr>
            ) : (
              filtered.slice(0, 200).map((o) => (
                <tr key={o.id}>
                  <td className="mono">{o.orderNumber}</td>
                  <td>{o.customerName}</td>
                  <td>{o.serviceName}</td>
                  <td>{o.goldPurity}K</td>
                  <td style={{ minWidth: 120 }}>
                    <span className="bar-track" style={{ display: 'block' }}>
                      <span className="bar-fill" style={{ width: `${o.progress || 0}%` }} />
                    </span>
                    <span className="muted">{o.progress || 0}%</span>
                  </td>
                  <td>{o.status}</td>
                  <td className="muted">{o.createdDate}</td>
                  <td className="right">
                    <button className="btn sm" onClick={() => setEditing(o)}>Edit</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <EditOrder
          order={editing}
          onClose={() => setEditing(null)}
          onSaved={(patch) => {
            setItems((rows) => rows.map((r) => (r.id === editing.id ? { ...r, ...patch } : r)));
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function EditOrder({ order, onClose, onSaved }) {
  const [status, setStatus] = useState(order.status || STATUSES[0]);
  const [progress, setProgress] = useState(order.progress ?? 0);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const save = async () => {
    setSaving(true);
    setErr('');
    try {
      await api.patch(`/api/admin/orders/${order.id}`, { status, progress: Number(progress) });
      onSaved({ status, progress: Number(progress) });
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={`Pesanan ${order.orderNumber}`}
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose} disabled={saving}>Batal</button>
          <button className="btn primary" onClick={save} disabled={saving}>{saving ? 'Menyimpan…' : 'Simpan'}</button>
        </>
      }
    >
      {err && <div className="banner err">{err}</div>}
      <div className="field">
        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label>Progres (%)</label>
        <input type="number" min="0" max="100" value={progress} onChange={(e) => setProgress(e.target.value)} />
      </div>
    </Modal>
  );
}
