# Srikandi — Admin Booking

Panel admin Toko Srikandi untuk mengelola booking pelanggan. Frontend statis
(React + Vite) yang berbicara langsung ke Supabase (`bookings`, `admin_users`)
lewat `@supabase/supabase-js`, tanpa backend perantara.

## Fitur

- Login tanpa kata sandi: tautan masuk dikirim ke email admin yang terdaftar
  di tabel `admin_users`.
- Daftar booking berbentuk kartu, dengan tab status (Baru, Diproses, Selesai,
  Dibatalkan, Semua) dan pencarian berdasarkan nama/nomor HP.
- Detail booking: ubah status (alur Baru → Diproses/Dibatalkan → Selesai/Buka
  Kembali), edit perkiraan tanggal, jumlah, dan cara bayar.
- Tombol "Hubungi via WhatsApp" dengan nomor & pesan yang sudah disiapkan.
- Data diperbarui otomatis tiap 60 detik dan saat tab kembali aktif.

Navigasi menyisakan tempat untuk modul lain (Pesanan, Galeri, Konsultasi) yang
akan ditambah setelah RLS admin untuk tabel-tabel itu tersedia.

## Jalankan lokal

```bash
npm install
cp .env.example .env.local   # isi VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY
npm run dev                  # http://localhost:5174
```

Email yang login harus terdaftar dan aktif di tabel `admin_users`, kalau
tidak akan ditolak dengan pesan "Akun ini tidak terdaftar sebagai admin".

## Test

```bash
npm run test
```

## Deploy (Vercel)

1. Push repo ini ke GitHub, lalu import ke Vercel.
2. Isi env `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` di Project
   Settings → Environment Variables.
3. Di Supabase → Authentication → URL Configuration: set Site URL ke domain
   Vercel, tambahkan domain Vercel dan `http://localhost:5174` ke Redirect
   URLs.
4. Matikan "Allow new users to sign up" di Supabase Authentication settings.
5. Undang admin lewat Supabase → Authentication → Users → Invite user, lalu
   tambahkan baris terkait di tabel `admin_users` (`aktif = true`).

## Auth & data

- Login pakai `signInWithOtp` (magic link), sesi tersimpan di browser lewat
  Supabase (`persistSession: true`).
- Semua akses data mengandalkan RLS di Supabase: admin hanya bisa membaca
  booking jika terdaftar aktif di `admin_users`, dan hanya boleh mengubah
  kolom `status`, `estimated_date`, `quantity`, `preferred_payment`.
- Tidak ada fitur tambah/hapus booking — form booking publik ditangani oleh
  Edge Function di repo lain.
