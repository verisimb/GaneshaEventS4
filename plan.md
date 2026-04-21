# Ganesha Event — Plan Kelanjutan Proyek

## Audit Status Proyek Saat Ini

Setelah melakukan review menyeluruh terhadap codebase, berikut rangkuman kondisi proyek:

### ✅ Sudah Selesai (Phase 0–3 dari context.md)

| Area | Status | Catatan |
|------|--------|---------|
| Project Init (Laravel, Inertia, Fortify, Shadcn, Tailwind) | ✅ Done | Semua terinstall & terkonfigurasi |
| Migration: `users`, `kegiatans`, `pendaftarans` | ✅ Done | Struktur tabel lengkap |
| Model + Relasi (User, Kegiatan, Pendaftaran) | ✅ Done | HasMany / BelongsTo sudah benar |
| Role system (`user` / `organizer`) | ✅ Done | Via `role` column + `EnsureUserIsOrganizer` middleware |
| Fortify: CreateNewUser (dengan role) | ✅ Done | Register mendukung pilih role |
| Fortify: Login, Register, Forgot Password, 2FA views | ✅ Done | Semua Inertia views terdaftar di `FortifyServiceProvider` |
| Auth Pages (Login, Register, Reset Password, Verify Email) | ✅ Done | Lengkap dengan 2FA challenge |
| `HandleInertiaRequests` middleware (shared data) | ✅ Done | Shares `auth.user`, `name`, `sidebarOpen` |
| Layout (App Layout + Sidebar) | ✅ Done | Sidebar dengan navigasi |
| Admin/Organizer Dashboard | ✅ Done | Menampilkan kegiatan akan datang & selesai |
| Event CRUD (Create, Edit, Update, Delete, Complete) | ✅ Done | Dengan upload banner & template sertifikat |
| Pendaftar Management (List, Confirm, Reject) | ✅ Done | Filter by kegiatan, authorization check |
| User: Kegiatan List + Search | ✅ Done | Debounced search, card grid |
| User: Kegiatan Detail + Form Pendaftaran | ✅ Done | Gratis auto-confirm, berbayar upload bukti |
| User: Tiket Page | ✅ Done | Menampilkan status (confirmed/pending/rejected) |
| Factories (User, Kegiatan, Pendaftaran) | ✅ Done | Termasuk state `organizer()`, `berbayar()`, `confirmed()` |
| Feature Tests (Pendaftaran, Dashboard) | ✅ Partial | Pendaftaran comprehensive, Dashboard basic |

### ❌ Belum Selesai / Perlu Dikerjakan

| Area | Status | Detail |
|------|--------|--------|
| Welcome/Landing Page | ⚠️ Default Laravel | Masih template bawaan Laravel 13, bukan landing Ganesha Event |
| Field `ticket_code` di Pendaftaran | ❌ Missing | Belum ada kolom `ticket_code` (UUID) untuk QR Code |
| Field `is_attended` di Pendaftaran | ❌ Missing | Belum ada kolom untuk tracking absensi |
| QR Code di Tiket Page | ❌ Missing | Tiket belum menampilkan QR Code |
| Halaman Absensi (QR Scanner) | ❌ Placeholder | Hanya teks "konten akan segera hadir" |
| Halaman Sertifikat | ❌ Placeholder | Hanya teks "Anda belum memiliki sertifikat" |
| Download Sertifikat (PDF/Image) | ❌ Missing | Belum ada controller/logic untuk generate sertifikat |
| Seeder: Admin + Sample Events | ⚠️ Minimal | Hanya ada 1 test user, belum ada organizer & sample data |
| Redirect after login by role | ⚠️ Partial | Fortify `home` = `/dashboard` (organizer only), user biasa harusnya ke `/user/kegiatan` |
| Tests untuk Kegiatan CRUD | ❌ Missing | Belum ada test untuk create/edit/delete event |
| Tests untuk User Kegiatan & Tiket | ❌ Missing | |
| Tests untuk Absensi | ❌ Missing | |

---

## Plan Kelanjutan

### Phase 4 — Database & Model Completion `[Medium]`

> **Tujuan:** Menambahkan kolom yang dibutuhkan untuk fitur QR Code dan Absensi.

#### Task 4.1 — Migration: Tambah `ticket_code` dan `is_attended` ke `pendaftarans` `[Low]`
- Buat migration baru: `add_ticket_code_and_is_attended_to_pendaftarans_table`
- Kolom:
  - `ticket_code` — `string`, unique, nullable (akan di-set saat status `confirmed`)
  - `is_attended` — `boolean`, default `false`
- **Estimasi file:** 1 migration
- **Dependensi:** —

#### Task 4.2 — Update Model `Pendaftaran` `[Low]`
- Tambahkan `ticket_code` dan `is_attended` ke `$fillable`
- Tambahkan cast `is_attended` → `boolean`
- **Estimasi file:** 1 file (modify)
- **Dependensi:** Task 4.1

#### Task 4.3 — Auto-generate `ticket_code` saat status `confirmed` `[Medium]`
- Di `PendaftaranController@store`: saat event gratis, langsung generate `ticket_code` (UUID v4)
- Di `PendaftaranController@confirm`: saat admin confirm, generate `ticket_code`
- Library: `Str::uuid()` (built-in Laravel)
- **Estimasi file:** 1 file (modify `PendaftaranController`)
- **Dependensi:** Task 4.2

#### Task 4.4 — Update Factory `PendaftaranFactory` `[Low]`
- Tambahkan `ticket_code` dan `is_attended` ke default definition & state `confirmed()`
- **Estimasi file:** 1 file (modify)
- **Dependensi:** Task 4.2

---

### Phase 5 — QR Code pada Tiket `[Medium]`

> **Tujuan:** Menampilkan QR Code pada tiket yang sudah confirmed agar bisa di-scan oleh admin.

#### Task 5.1 — Install `qrcode.react` `[Low]`
- `npm install qrcode.react`
- **Dependensi:** —

#### Task 5.2 — Update `TiketController` — sertakan `ticket_code` `[Low]`
- Tambahkan `ticket_code` ke data yang dikirim via Inertia
- **Estimasi file:** 1 file (modify)
- **Dependensi:** Task 4.3

#### Task 5.3 — Update Tiket Page — Tampilkan QR Code `[Medium]`
- Untuk tiket dengan status `confirmed`, tampilkan QR Code yang berisi `ticket_code`
- QR Code hanya visible saat status `confirmed`
- **Estimasi file:** 1 file (modify `user/tiket.tsx`)
- **Dependensi:** Task 5.1, Task 5.2

---

### Phase 6 — Absensi (QR Scanner) `[High]`

> **Tujuan:** Admin bisa scan QR Code peserta untuk melakukan absensi.

#### Task 6.1 — Install `html5-qrcode` `[Low]`
- `npm install html5-qrcode`
- **Dependensi:** —

#### Task 6.2 — Buat `AbsensiController` `[Medium]`
- `php artisan make:controller AbsensiController`
- Method `index`: Render halaman absensi, kirim daftar kegiatan milik organizer
- Method `verify`: Terima `ticket_code`, validasi, set `is_attended = true`, return response
- Validasi:
  - Ticket code harus ada
  - Tiket harus berstatus `confirmed`
  - Tiket belum pernah di-absen (`is_attended` masih `false`)
  - Kegiatan harus milik organizer yang sedang login
- **Estimasi file:** 1 file baru
- **Dependensi:** Task 4.2

#### Task 6.3 — Update Routes `[Low]`
- Ganti `Route::inertia('absensi', 'absensi')` menjadi controller-based route
- `GET /absensi` → `AbsensiController@index`
- `POST /absensi/verify` → `AbsensiController@verify`
- **Estimasi file:** 1 file (modify `web.php`)
- **Dependensi:** Task 6.2

#### Task 6.4 — Build Halaman Absensi (React) `[High]`
- Implementasi QR Scanner menggunakan `html5-qrcode`
- Flow: Pilih kegiatan → Aktifkan kamera → Scan QR → POST verify → Tampilkan result (berhasil / gagal)
- Tampilkan daftar peserta yang sudah hadir (realtime update)
- **Estimasi file:** 1 file (rewrite `absensi.tsx`)
- **Dependensi:** Task 6.1, Task 6.3

---

### Phase 7 — Sertifikat `[High]`

> **Tujuan:** User bisa download sertifikat setelah kegiatan selesai & sudah absen.

#### Task 7.1 — Buat `SertifikatController` `[Medium]`
- Method `index`: Query pendaftaran user yang `is_attended = true` DAN kegiatan `is_selesai = true`
- Method `download`: Generate sertifikat (image/PDF) dengan nama peserta
- **Estimasi file:** 1 file baru
- **Dependensi:** Task 4.2

#### Task 7.2 — Install Intervention Image v3 `[Low]`
- `composer require intervention/image`
- Untuk overlay teks nama peserta pada template sertifikat
- **Dependensi:** —

#### Task 7.3 — Logic Generate Sertifikat `[High]`
- Ambil `template_sertifikat` dari kegiatan
- Overlay nama peserta menggunakan Intervention Image
- Return sebagai downloadable image/PDF
- **Estimasi file:** 1 file (di dalam `SertifikatController` atau Service class)
- **Dependensi:** Task 7.1, Task 7.2

#### Task 7.4 — Update Routes `[Low]`
- `GET /user/sertifikat` → `SertifikatController@index`
- `GET /user/sertifikat/{pendaftaran}/download` → `SertifikatController@download`
- **Estimasi file:** 1 file (modify `web.php`)
- **Dependensi:** Task 7.1

#### Task 7.5 — Build Halaman Sertifikat (React) `[Medium]`
- Tampilkan daftar kegiatan yang eligible (is_attended + is_selesai)
- Tombol "Download Sertifikat" per kegiatan
- State kosong: pesan informatif jika belum ada sertifikat
- **Estimasi file:** 1 file (rewrite `user/sertifikat.tsx`)
- **Dependensi:** Task 7.4

---

### Phase 8 — Landing Page & Polesan `[Medium]`

> **Tujuan:** Mengganti welcome page default Laravel dengan landing page Ganesha Event.

#### Task 8.1 — Redesign Welcome Page `[Medium]`
- Hero section: branding "Ganesha Event" + tagline
- Event highlights: tampilkan beberapa kegiatan terbaru (upcoming)
- CTA: "Daftar Sekarang" / "Lihat Kegiatan"
- Responsive, dark mode support
- **Estimasi file:** 1 file (rewrite `welcome.tsx`)
- **Dependensi:** —

#### Task 8.2 — Buat `HomeController` `[Low]`
- Query kegiatan upcoming untuk ditampilkan di landing page
- Tetap gunakan `Inertia::render('welcome', [...])`
- **Estimasi file:** 1 file baru + modify `web.php`
- **Dependensi:** Task 8.1

#### Task 8.3 — Fix Login Redirect berdasarkan Role `[Medium]`
- Override Fortify `LoginResponse` contract
- `organizer` → redirect ke `/dashboard`
- `user` → redirect ke `/user/kegiatan`
- **Estimasi file:** 1–2 file (LoginResponse + bind di provider)
- **Dependensi:** —

---

### Phase 9 — Seeder & Sample Data `[Low]`

> **Tujuan:** Menyediakan data awal untuk development dan demo.

#### Task 9.1 — Update `DatabaseSeeder` `[Low]`
- Buat admin/organizer user default
- Buat 5–10 sample kegiatan (mix gratis & berbayar)
- Buat beberapa sample pendaftaran
- **Estimasi file:** 1 file (modify `DatabaseSeeder.php`)
- **Dependensi:** Task 4.4

---

### Phase 10 — Testing `[Medium]`

> **Tujuan:** Coverage test yang memadai untuk semua fitur.

#### Task 10.1 — Tests: Kegiatan CRUD `[Medium]`
- Create, edit, update, delete, complete/uncomplete
- Authorization: hanya pemilik bisa edit/delete
- File upload (banner, template sertifikat)
- **Estimasi file:** 1 file baru
- **Dependensi:** Phase 4

#### Task 10.2 — Tests: User Kegiatan & Pendaftaran `[Medium]`
- User bisa melihat daftar kegiatan
- User bisa melihat detail kegiatan
- Duplikasi pendaftaran ditolak
- *(sebagian sudah ada di `PendaftaranTest.php`)*
- **Estimasi file:** 1 file baru atau extend existing
- **Dependensi:** Phase 4

#### Task 10.3 — Tests: Absensi `[Medium]`
- Verify ticket code valid → is_attended = true
- Verify ticket code invalid → error
- Verify ticket already attended → error
- Authorization: hanya organizer pemilik kegiatan
- **Estimasi file:** 1 file baru
- **Dependensi:** Phase 6

#### Task 10.4 — Tests: Sertifikat `[Medium]`
- Index menampilkan sertifikat yang eligible
- Download hanya jika is_attended + is_selesai
- Download return file response
- **Estimasi file:** 1 file baru
- **Dependensi:** Phase 7

#### Task 10.5 — Fix Existing Tiket Test `[Low]`
- `PendaftaranTest.php` line 143: test "tiket page only shows confirmed pendaftaran" — perlu diverifikasi ulang karena saat ini `TiketController` menampilkan SEMUA pendaftaran (bukan hanya confirmed)
- **Estimasi file:** 1 file (modify)
- **Dependensi:** —

---

### Phase 11 — Deployment `[Medium]`

> **Tujuan:** Persiapan & deploy ke production.

#### Task 11.1 — Pilih Platform Deployment `[Low]`
- Kandidat: Railway, Render, Fly.io, atau VPS
- Pertimbangan: MySQL support, file storage, budget
- **Dependensi:** —

#### Task 11.2 — Environment Configuration `[Low]`
- Setup `.env.production`
- Configure database, mail, storage
- **Dependensi:** Task 11.1

#### Task 11.3 — Storage Setup `[Low]`
- `php artisan storage:link` untuk local
- Atau konfigurasi S3-compatible storage jika pakai cloud
- **Dependensi:** Task 11.1

#### Task 11.4 — Build & Deploy `[Medium]`
- `npm run build`
- `php artisan optimize`
- Deploy to chosen platform
- **Dependensi:** Task 11.1, 11.2, 11.3

---

## Ringkasan Estimasi

| Phase | Jumlah Task | File Baru | File Modify | Kompleksitas Dominan |
|-------|-------------|-----------|-------------|----------------------|
| Phase 4 — DB & Model | 4 | 1 | 3 | Low–Medium |
| Phase 5 — QR Code Tiket | 3 | 0 | 2 (+1 install) | Medium |
| Phase 6 — Absensi | 4 | 1 | 2 (+1 install) | High |
| Phase 7 — Sertifikat | 5 | 1 | 2 (+1 install) | High |
| Phase 8 — Landing & Polish | 3 | 1–2 | 2 | Medium |
| Phase 9 — Seeder | 1 | 0 | 1 | Low |
| Phase 10 — Testing | 5 | 3–4 | 1 | Medium |
| Phase 11 — Deployment | 4 | 0–1 | 1 | Medium |
| **Total** | **29** | **~8–10** | **~14** | — |

## Urutan Eksekusi yang Disarankan

Phase 4 (DB & Model) harus dikerjakan pertama karena menjadi fondasi untuk Phase 5, 6, dan 7.

```
Phase 4 ──┬──→ Phase 5 (QR Tiket) ──→ Phase 6 (Absensi)
           └──→ Phase 7 (Sertifikat)
Phase 8 (Landing) ─ bisa paralel
Phase 9 (Seeder) ── bisa paralel
Semua ──→ Phase 10 (Testing) ──→ Phase 11 (Deployment)
```

> **PENTING:** Phase 4 adalah fondasi — semua phase selanjutnya bergantung pada penambahan `ticket_code` dan `is_attended`. Phase ini harus dikerjakan pertama.

> **CATATAN:** Phase 8 (Landing Page) dan Phase 9 (Seeder) bisa dikerjakan paralel dengan Phase 5–7 karena tidak ada dependensi langsung.
