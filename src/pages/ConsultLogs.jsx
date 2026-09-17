import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';

export default function ConsultLogs() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { items, total } = await api.get('/api/admin/consult-logs?limit=200');
      setItems(items || []);
      setTotal(total || 0);
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

  const clear = async () => {
    if (!confirm('Hapus semua log konsultasi?')) return;
    try {
      await api.del('/api/admin/consult-logs');
      load();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Log Chatbot</h1>
          <div className="sub">
            {total} transkrip ringkas tersimpan (maks 200 terakhir). Tandai <span className="pill warn">eskalasi</span> = diminta ke admin.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn sm" onClick={load}>↻ Muat ulang</button>
          <button className="btn sm danger" onClick={clear}>Bersihkan</button>
        </div>
      </div>

      {err && <div className="banner err">{err}</div>}

      <div className="card table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>Waktu</th>
              <th>Pertanyaan</th>
              <th>Balasan</th>
              <th>Sumber RAG</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="muted">Memuat…</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={5} className="muted">Belum ada log.</td></tr>
            ) : (
              items.map((l) => (
                <tr key={l.id}>
                  <td className="muted" style={{ whiteSpace: 'nowrap' }}>
                    {new Date(l.at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td><div className="clamp">{l.question || '—'}</div></td>
                  <td><div className="clamp muted">{l.replyPreview || '—'}</div></td>
                  <td className="muted" style={{ fontSize: 12 }}>{(l.sources || []).join(' · ') || '—'}</td>
                  <td>{l.escalated && <span className="pill warn">eskalasi</span>}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
