import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';

export default function Customers() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [q, setQ] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { items } = await api.get('/api/admin/customers');
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

  const filtered = items.filter(
    (c) => !q || c.name.toLowerCase().includes(q.toLowerCase()) || c.phone.includes(q),
  );

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Konsumen</h1>
          <div className="sub">{items.length} terdaftar. Baca-saja — kata sandi tidak pernah dikirim ke hub.</div>
        </div>
        <input
          placeholder="Cari nama / HP…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--panel)' }}
        />
      </div>

      {err && <div className="banner err">{err}</div>}

      <div className="card table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama</th>
              <th>No. HP</th>
              <th className="right">Jml pesanan</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="muted">Memuat…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={4} className="muted">Tidak ada hasil.</td></tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.name}</td>
                  <td className="mono">{c.phone}</td>
                  <td className="right">{c.orders}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
