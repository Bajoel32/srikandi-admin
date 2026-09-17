import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';

const STATUSES = ['baru', 'diproses', 'selesai', 'batal'];
const toneOf = (s) => (s === 'selesai' ? 'ok' : s === 'batal' ? 'err' : 'warn');

export default function Bookings() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { items } = await api.get('/api/admin/bookings');
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

  const setStatus = async (ref, status) => {
    try {
      await api.patch(`/api/admin/bookings/${ref}`, { status });
      setItems((rows) => rows.map((r) => (r.ref === ref ? { ...r, status } : r)));
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Booking</h1>
          <div className="sub">Form "Buat Janji" dari storefront (POST /api/bookings).</div>
        </div>
        <button className="btn sm" onClick={load}>
          ↻ Muat ulang
        </button>
      </div>

      {err && <div className="banner err">{err}</div>}

      <div className="card table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>Ref</th>
              <th>Masuk</th>
              <th>Nama</th>
              <th>Kontak</th>
              <th>Layanan</th>
              <th>Qty</th>
              <th>Estimasi</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="muted">Memuat…</td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={8} className="muted">Belum ada booking masuk.</td>
              </tr>
            ) : (
              items.map((b) => (
                <tr key={b.ref}>
                  <td className="mono">{b.ref}</td>
                  <td className="muted">{String(b.createdAt || '').slice(0, 10)}</td>
                  <td>{b.customerName}</td>
                  <td>
                    <div>{b.phoneNumber}</div>
                    <div className="muted">{b.email}</div>
                  </td>
                  <td>{b.serviceName}</td>
                  <td>{b.quantity}</td>
                  <td className="muted">{b.estimatedDate}</td>
                  <td>
                    <span className={'dot ' + toneOf(b.status || 'baru')} />
                    <select
                      value={b.status || 'baru'}
                      onChange={(e) => setStatus(b.ref, e.target.value)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
