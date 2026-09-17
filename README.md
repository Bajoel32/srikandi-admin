# Srikandi — Admin Hub

App terpisah untuk mengelola data web Srikandi dan memantau kondisi backend.
Frontend statis (React + Vite), berbicara ke backend `srikandi-api` (folder `server/`
di repo utama) lewat `/api/admin/*`.

## Fitur

| Halaman | Fungsi |
|---|---|
| **Dashboard** | Indikator sistem, AI/chatbot, konten, aktivitas, keamanan. Auto-refresh 15 detik. |
| **Layanan** | CRUD jenis layanan (dipakai storefront + tool `infoLayanan`). |
| **Galeri** | CRUD item katalog (dipakai halaman Galeri + tool `rekomendasiGaleri`). |
| **Knowledge Base** | CRUD potongan pengetahuan untuk RAG chatbot. |
| **Pengaturan RAG** | Atur `topK` & `minScore` retriever. |
| **Booking** | Lihat form "Buat Janji" yang masuk + ubah status. |
| **Pesanan** | Ubah status & progres pesanan yang dilihat konsumen. |
| **Konsumen** | Daftar konsumen (baca-saja, tanpa kata sandi). |
| **Log Chatbot** | Transkrip ringkas + penanda eskalasi. |

## Jalankan lokal

```bash
npm install
cp .env.example .env.local        # set VITE_API_BASE=http://localhost:8787
npm run dev                       # http://localhost:5174
```

Backend harus jalan lebih dulu (`cd ../SRIKANDI/server && npm run dev`) dengan
`ADMIN_USERNAME` + `ADMIN_PASSWORD_HASH` terisi di `server/.env`.
Buat hash: `cd server && npm run admin:hash -- "kata-sandi-anda"`.

Pastikan origin hub ada di allowlist backend: set `ADMIN_ORIGINS=http://localhost:5174`
di `server/.env`.

## Deploy (Render Static Site)

1. Push repo ini ke GitHub (`srikandi-admin`).
2. Render → New → Blueprint → pilih repo. `render.yaml` sudah disiapkan.
3. Isi env `VITE_API_BASE` = URL service `srikandi-api` (mis. `https://srikandi-api.onrender.com`).
4. Di backend Render, tambahkan URL hasil deploy hub ini ke env `ADMIN_ORIGINS`.

## Auth

Token sesi admin dari `POST /api/admin/login` disimpan di `sessionStorage`
(hilang saat tab ditutup) dan dikirim sebagai `Authorization: Bearer`.
TTL default 12 jam (`ADMIN_SESSION_TTL` di backend).
