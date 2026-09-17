# Srikandi — Admin Hub

App terpisah untuk mengelola data web Srikandi dan memantau kondisi backend.
Frontend statis (React + Vite). Sebagian besar halaman berbicara ke backend
`srikandi-api` (folder `server/` di repo utama) lewat `/api/admin/*`; modul
**Booking** berbicara langsung ke Supabase lewat `@supabase/supabase-js`.

## Fitur

| Halaman | Fungsi | Sumber data & login |
|---|---|---|
| **Dashboard** | Indikator sistem, AI/chatbot, konten, aktivitas, keamanan. Auto-refresh 15 detik. | Backend lama |
| **Layanan** | CRUD jenis layanan (dipakai storefront + tool `infoLayanan`). | Backend lama |
| **Galeri** | CRUD item katalog (dipakai halaman Galeri + tool `rekomendasiGaleri`). | Backend lama |
| **Knowledge Base** | CRUD potongan pengetahuan untuk RAG chatbot. | Backend lama |
| **Pengaturan RAG** | Atur `topK` & `minScore` retriever. | Backend lama |
| **Booking** | Kartu booking dengan tab status, pencarian, ubah status, edit tanggal/jumlah/cara bayar, tombol WhatsApp. | Supabase (login terpisah) |
| **Pesanan** | Ubah status & progres pesanan yang dilihat konsumen. | Backend lama |
| **Konsumen** | Daftar konsumen (baca-saja, tanpa kata sandi). | Backend lama |
| **Log Chatbot** | Transkrip ringkas + penanda eskalasi. | Backend lama |

## Dua login terpisah

- **Admin hub** (semua halaman kecuali Booking): username/password ke backend
  lama (`POST /api/admin/login`), token di `sessionStorage`.
- **Booking**: tautan masuk (magic link) ke email admin yang terdaftar aktif
  di tabel Supabase `admin_users`. Sesi ini terpisah dari sesi admin hub —
  begitu membuka menu Booking untuk pertama kali, akan diminta login lagi
  dengan email. Ini karena RLS Supabase mewajibkan sesi Supabase asli dan
  tidak bisa memakai token backend lama.

## Jalankan lokal

```bash
npm install
cp .env.example .env.local
# isi VITE_API_BASE (backend lama) dan
# VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY (modul Booking)
npm run dev                       # http://localhost:5174
```

Backend lama harus jalan lebih dulu (`cd ../SRIKANDI/server && npm run dev`)
dengan `ADMIN_USERNAME` + `ADMIN_PASSWORD_HASH` terisi di `server/.env`.
Buat hash: `cd server && npm run admin:hash -- "kata-sandi-anda"`.

Pastikan origin hub ada di allowlist backend: set `ADMIN_ORIGINS=http://localhost:5174`
di `server/.env`.

Untuk modul Booking: email yang login harus terdaftar dan `aktif = true` di
tabel Supabase `admin_users`, kalau tidak akan ditolak dengan pesan "Akun ini
tidak terdaftar sebagai admin".

## Test

```bash
npm run test    # unit test modul Booking (normalisasi nomor WA, format tanggal)
```

## Deploy

Bisa dideploy ke Render Static Site (`render.yaml` sudah disiapkan) atau
Vercel (`vercel.json` sudah disiapkan dengan rewrite SPA).

1. Push repo ini ke GitHub (`srikandi-admin`).
2. Isi env di platform pilihan: `VITE_API_BASE`, `VITE_SUPABASE_URL`,
   `VITE_SUPABASE_ANON_KEY`.
3. Di backend lama, tambahkan URL hasil deploy hub ini ke env `ADMIN_ORIGINS`.
4. Untuk modul Booking di Supabase → Authentication → URL Configuration: set
   Site URL ke domain deploy, tambahkan domain itu dan `http://localhost:5174`
   ke Redirect URLs, lalu matikan "Allow new users to sign up". Undang admin
   lewat Authentication → Users → Invite user, dan pastikan barisnya ada di
   tabel `admin_users` dengan `aktif = true`.

## Auth

- **Admin hub**: token sesi dari `POST /api/admin/login` disimpan di
  `sessionStorage` (hilang saat tab ditutup), dikirim sebagai
  `Authorization: Bearer`. TTL default 12 jam (`ADMIN_SESSION_TTL` di backend).
- **Booking**: sesi Supabase (`signInWithOtp`, `persistSession: true`) yang
  tersimpan otomatis oleh `supabase-js`. Akses data diatur oleh RLS: admin
  hanya bisa membaca booking jika terdaftar aktif di `admin_users`, dan hanya
  boleh mengubah kolom `status`, `estimated_date`, `quantity`,
  `preferred_payment`. Tidak ada fitur tambah/hapus booking — form booking
  publik ditangani oleh Edge Function di repo lain.
