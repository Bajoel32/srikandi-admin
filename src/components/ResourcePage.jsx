import { useCallback, useEffect, useMemo, useState } from 'react';
import { api, ApiError } from '../api.js';
import Modal from './Modal.jsx';

// Halaman CRUD generik. Dipakai untuk Layanan, Galeri, Knowledge Base.
//
// fields: [{ name, label, type, required, placeholder, options?,
//            serialize?(formValue) -> apiValue, deserialize?(apiValue) -> formValue }]
// columns: [{ key, label, render?(row) }]
export default function ResourcePage({
  title,
  subtitle,
  endpoint,
  idKey = 'id',
  columns,
  fields = [],
  readOnly = false,
  emptyText = 'Belum ada data.',
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [editing, setEditing] = useState(null); // row | 'new' | null

  const load = useCallback(async () => {
    setLoading(true);
    setErr('');
    try {
      const { items } = await api.get(endpoint);
      setItems(items || []);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (row) => {
    if (!confirm(`Hapus "${row[columns[0].key] ?? row[idKey]}"?`)) return;
    try {
      await api.del(`${endpoint}/${row[idKey]}`);
      load();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>{title}</h1>
          {subtitle && <div className="sub">{subtitle}</div>}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn sm" onClick={load}>
            ↻ Muat ulang
          </button>
          {!readOnly && (
            <button className="btn primary sm" onClick={() => setEditing('new')}>
              + Tambah
            </button>
          )}
        </div>
      </div>

      {err && <div className="banner err">{err}</div>}

      <div className="card table-wrap">
        <table className="data">
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key}>{c.label}</th>
              ))}
              {!readOnly && <th className="right">Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className="muted">
                  Memuat…
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="muted">
                  {emptyText}
                </td>
              </tr>
            ) : (
              items.map((row) => (
                <tr key={row[idKey]}>
                  {columns.map((c) => (
                    <td key={c.key}>{c.render ? c.render(row) : String(row[c.key] ?? '—')}</td>
                  ))}
                  {!readOnly && (
                    <td className="actions right">
                      <button className="btn sm" onClick={() => setEditing(row)}>
                        Edit
                      </button>{' '}
                      <button className="btn sm danger" onClick={() => remove(row)}>
                        Hapus
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <RecordForm
          fields={fields}
          endpoint={endpoint}
          idKey={idKey}
          row={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}
    </div>
  );
}

function RecordForm({ fields, endpoint, idKey, row, onClose, onSaved }) {
  const initial = useMemo(() => {
    const o = {};
    for (const f of fields) {
      const raw = row ? row[f.name] : undefined;
      o[f.name] = f.deserialize ? f.deserialize(raw) : raw ?? '';
    }
    return o;
  }, [fields, row]);

  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [details, setDetails] = useState([]);

  const set = (name, v) => setForm((s) => ({ ...s, [name]: v }));

  const submit = async () => {
    setSaving(true);
    setErr('');
    setDetails([]);
    const payload = {};
    for (const f of fields) {
      let v = form[f.name];
      if (f.serialize) v = f.serialize(v);
      if (v === '' && !f.required) continue;
      payload[f.name] = v;
    }
    try {
      if (row) await api.put(`${endpoint}/${row[idKey]}`, payload);
      else await api.post(endpoint, payload);
      onSaved();
    } catch (e) {
      setErr(e.message);
      if (e instanceof ApiError && e.details) setDetails(e.details);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={row ? 'Edit data' : 'Tambah data'}
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose} disabled={saving}>
            Batal
          </button>
          <button className="btn primary" onClick={submit} disabled={saving}>
            {saving ? 'Menyimpan…' : 'Simpan'}
          </button>
        </>
      }
    >
      {err && <div className="banner err">{err}</div>}
      {details.length > 0 && (
        <ul className="banner err" style={{ marginTop: -6 }}>
          {details.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
      )}
      {fields.map((f) => (
        <div className="field" key={f.name}>
          <label>
            {f.label}
            {f.required && ' *'}
          </label>
          {f.type === 'textarea' ? (
            <textarea
              value={form[f.name] ?? ''}
              placeholder={f.placeholder}
              onChange={(e) => set(f.name, e.target.value)}
            />
          ) : f.type === 'select' ? (
            <select value={form[f.name] ?? ''} onChange={(e) => set(f.name, e.target.value)}>
              {f.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={f.type === 'number' ? 'number' : 'text'}
              value={form[f.name] ?? ''}
              placeholder={f.placeholder}
              onChange={(e) => set(f.name, e.target.value)}
            />
          )}
          {f.hint && <div className="hint muted" style={{ fontSize: 11, marginTop: 4 }}>{f.hint}</div>}
        </div>
      ))}
    </Modal>
  );
}
