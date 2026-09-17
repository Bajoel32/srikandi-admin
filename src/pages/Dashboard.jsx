import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../api.js';

const REFRESH_MS = 15000;

function fmtUptime(sec) {
  if (sec == null) return '—';
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (d) return `${d}h ${h}j`;
  if (h) return `${h}j ${m}m`;
  return `${m}m`;
}

function Stat({ label, value, hint, tone, small }) {
  return (
    <div className="stat">
      <div className="label">{label}</div>
      <div className={'value' + (small ? ' sm' : '')}>
        {tone && <span className={'dot ' + tone} />}
        {value}
      </div>
      {hint && <div className="hint">{hint}</div>}
    </div>
  );
}

function Group({ title, children }) {
  return (
    <>
      <div className="group-title">{title}</div>
      <div className="stat-grid">{children}</div>
    </>
  );
}

export default function Dashboard() {
  const [s, setS] = useState(null);
  const [err, setErr] = useState('');
  const [updatedAt, setUpdatedAt] = useState(null);
  const timer = useRef(null);

  const load = useCallback(async () => {
    try {
      const data = await api.get('/api/admin/stats');
      setS(data);
      setErr('');
      setUpdatedAt(new Date());
    } catch (e) {
      setErr(e.message);
    }
  }, []);

  useEffect(() => {
    load();
    timer.current = setInterval(load, REFRESH_MS);
    return () => clearInterval(timer.current);
  }, [load]);

  if (err && !s) return <div className="banner err">{err}</div>;
  if (!s) return <div className="muted">Memuat indikator…</div>;

  const orderRows = Object.entries(s.activity.ordersByStatus || {}).sort((a, b) => b[1] - a[1]);
  const orderMax = Math.max(1, ...orderRows.map(([, n]) => n));

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Dashboard</h1>
          <div className="sub">
            Pantau kondisi backend, konten, dan chatbot. Segarkan otomatis tiap 15 detik.
          </div>
        </div>
        <div className="sub">
          {err ? <span className="pill err">gagal segarkan</span> : `diperbarui ${updatedAt?.toLocaleTimeString('id-ID')}`}
        </div>
      </div>

      <Group title="Sistem">
        <Stat label="Status API" value={s.system.ok ? 'Online' : 'Bermasalah'} tone={s.system.ok ? 'ok' : 'err'} />
        <Stat label="Uptime" value={fmtUptime(s.system.uptimeSec)} hint="sejak proses restart" />
        <Stat label="Versi" value={s.system.version} small />
        <Stat label="Environment" value={s.system.env} small />
        <Stat
          label="Storage"
          value={s.system.storage === 'postgres' ? 'Postgres' : 'JSON file'}
          tone={s.system.storage === 'postgres' ? 'ok' : 'warn'}
          hint={s.system.storage === 'postgres' ? 'persisten' : 'ephemeral — data bisa hilang'}
          small
        />
        <Stat label="Node" value={s.system.node} small />
      </Group>

      <Group title="AI / Chatbot">
        <Stat
          label="Anthropic API key"
          value={s.ai.anthropicConfigured ? 'Terpasang' : 'Kosong'}
          tone={s.ai.anthropicConfigured ? 'ok' : 'warn'}
        />
        <Stat label="Mode" value={s.ai.mode === 'live' ? 'Live (Claude)' : 'Fallback kata kunci'} tone={s.ai.mode === 'live' ? 'ok' : 'warn'} small />
        <Stat label="Model" value={s.ai.model} small />
        <Stat label="Panggilan konsultasi" value={s.chatbot.consultCalls} hint={`hari ini: ${s.chatbot.consultToday}`} />
        <Stat label="Eskalasi ke admin" value={s.chatbot.escalations} tone={s.chatbot.escalations ? 'warn' : undefined} />
        <Stat label="Rata-rata sumber RAG" value={s.chatbot.avgRagSources} hint="per pertanyaan" />
      </Group>

      <Group title="Konten">
        <Stat label="Layanan" value={s.content.services} />
        <Stat label="Item galeri" value={s.content.gallery} />
        <Stat label="KB chunk" value={s.content.kb} />
        <Stat
          label="KB terakhir diubah"
          value={s.content.kbUpdatedAt ? new Date(s.content.kbUpdatedAt).toLocaleDateString('id-ID') : '—'}
          small
        />
        <Stat label="RAG topK / minScore" value={`${s.rag.topK} / ${s.rag.minScore}`} small />
      </Group>

      <Group title="Aktivitas">
        <Stat label="Booking total" value={s.activity.bookingsTotal} hint={`hari ini: ${s.activity.bookingsToday}`} />
        <Stat label="Booking pending" value={s.activity.bookingsPending} tone={s.activity.bookingsPending ? 'warn' : undefined} />
        <Stat label="Pesanan total" value={s.activity.ordersTotal} />
        <Stat label="Konsumen terdaftar" value={s.activity.customers} />
      </Group>

      {orderRows.length > 0 && (
        <>
          <div className="group-title">Pesanan per status</div>
          <div className="card pad">
            <div className="bars">
              {orderRows.map(([status, n]) => (
                <div className="bar-row" key={status}>
                  <span className="muted">{status}</span>
                  <span className="bar-track">
                    <span className="bar-fill" style={{ width: `${(n / orderMax) * 100}%` }} />
                  </span>
                  <span className="right">{n}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <Group title="Keamanan">
        <Stat label="Sesi konsumen aktif" value={s.security.activeSessions} />
        <Stat label="Sesi admin aktif" value={s.security.adminSessions} />
        <Stat label="Hit rate-limit" value={s.security.rateLimited} tone={s.security.rateLimited ? 'warn' : undefined} hint="sejak restart" />
        <Stat label="Error 5xx" value={s.security.errors5xx} tone={s.security.errors5xx ? 'err' : 'ok'} hint="sejak restart" />
        <Stat
          label="ADMIN_TOKEN legacy"
          value={s.security.legacyAdminToken ? 'Diset' : 'Tidak'}
          small
        />
      </Group>
    </div>
  );
}
