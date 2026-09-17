import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function RagSettings() {
  const [cfg, setCfg] = useState(null);
  const [topK, setTopK] = useState(4);
  const [minScore, setMinScore] = useState(0.5);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get('/api/admin/rag-config')
      .then((c) => {
        setCfg(c);
        setTopK(c.topK);
        setMinScore(c.minScore);
      })
      .catch((e) => setErr(e.message));
  }, []);

  const save = async () => {
    setSaving(true);
    setErr('');
    setMsg('');
    try {
      const c = await api.put('/api/admin/rag-config', { topK: Number(topK), minScore: Number(minScore) });
      setCfg(c);
      setMsg('Tersimpan. Berlaku untuk pesan chatbot berikutnya.');
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Pengaturan RAG</h1>
          <div className="sub">Parameter retriever kata kunci untuk chatbot Konsultasi.</div>
        </div>
      </div>

      {err && <div className="banner err">{err}</div>}
      {msg && <div className="banner ok">{msg}</div>}

      <div className="card pad" style={{ maxWidth: 460 }}>
        <div className="field">
          <label>topK — jumlah maksimum potongan KB yang diambil per pertanyaan</label>
          <input type="number" min="1" max="12" value={topK} onChange={(e) => setTopK(e.target.value)} />
        </div>
        <div className="field">
          <label>minScore — ambang skor kecocokan (cocok judul = 0.5, cocok isi = 1 per kata)</label>
          <input type="number" min="0" max="10" step="0.5" value={minScore} onChange={(e) => setMinScore(e.target.value)} />
          <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
            Naikkan bila chatbot sering menarik konteks tak relevan; turunkan bila jawaban terasa "kurang tahu".
          </div>
        </div>
        <button className="btn primary" onClick={save} disabled={saving || !cfg}>
          {saving ? 'Menyimpan…' : 'Simpan'}
        </button>
      </div>
    </div>
  );
}
