# Ganesha Event — Project Context untuk AI Agent (v2 — Monolith Modern)

## Tujuan
Kamu diminta untuk **merencanakan (planning)** proyek web app "Ganesha Event" — platform manajemen event kampus. Ini adalah proyek **Laravel Monolith Modern** dengan satu project tunggal yang menggabungkan backend dan frontend.

Setelah kamu menghasilkan planning, owner akan mereview sebelum kamu diminta untuk mengeksekusinya. **Jangan mulai coding dulu — fokus pada perencanaan yang detail dan terstruktur.**

---

## Konteks Proyek

### Apa itu Ganesha Event?
Platform web untuk manajemen event di lingkungan kampus. Menggantikan cara manual (Google Form, WhatsApp group, Instagram) dengan sistem terpusat satu platform.

### Dua Aktor Utama
1. **Mahasiswa (User)** — Melihat event, mendaftar, upload bukti bayar, lihat tiket + QR Code, download sertifikat
2. **Admin (Penyelenggara)** — CRUD event, verifikasi pembayaran, absensi peserta via scan QR

---

## Arsitektur: Laravel Monolith Modern


## Tech Stack Final

### Backend
- **Framework:** Laravel
- **Language:** PHP 8.2+
- **Database:** MySQL
- **Auth Backend:** Laravel Fortify (menangani register, login, logout, session, password hashing)
- **Frontend Bridge:** Inertia.js (server-side adapter: `inertiajs/inertia-laravel`)
- **File Storage:** Laravel Storage (local/S3-compatible)
- **Image Processing:** Intervention Image v3

### Frontend
- **Library:** React
- **Inertia Client:** `@inertiajs/react`
- **Build Tool:** Vite (terintegrasi via `laravel-vite-plugin`)
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/ui
- **QR Code Generate:** `qrcode.react`
- **QR Code Scan:** `html5-qrcode`
- **UI Feedback:**
- **Icons:** Lucide React (sudah bundled dengan Shadcn)

### Deployment
- **TBD** — Kandidat: Railway, Render, Fly.io, atau VPS
- Karena monolith, cukup **1 platform** untuk Laravel + MySQL
- Tidak butuh Vercel (tidak ada frontend terpisah)

---

**Aturan bisnis:**
- Event gratis → saat tiket dibuat, status langsung set ke `dikonfirmasi`
- Event berbayar → status mulai dari `menunggu_konfirmasi / yang sudah ada di proyek ini`
- Sertifikat hanya bisa diunduh jika `is_attended = true` DAN event `is_completed = true`

---

## Routing (web.php) — Inertia Style

Karena memakai Inertia, **semua route ada di `routes/web.php`**, bukan `api.php`. Controller mereturn `Inertia::render()` bukan JSON.

```
// Public routes (guest)
GET  /                          → Home (event listing)
GET  /events/{slug}             → EventDetail
GET  /login                     → Auth/Login
GET  /register                  → Auth/Register

// Auth routes (via Fortify)
POST /login                     → Fortify handle
POST /register                  → Fortify handle (custom Action)
POST /logout                    → Fortify handle

// User routes (auth middleware)
GET  /dashboard                 → User/Dashboard
GET  /my-tickets                → User/MyTickets
GET  /my-certificates           → User/MyCertificates
POST /tickets                   → TicketController@store (daftar event)
GET  /tickets/{id}/certificate  → TicketController@downloadCertificate

// Admin routes (auth + admin middleware)
GET  /admin                     → Admin/Dashboard
GET  /admin/events              → Admin/Events/Index
GET  /admin/events/create       → Admin/Events/Create
POST /admin/events              → AdminEventController@store
GET  /admin/events/{id}/edit    → Admin/Events/Edit
PUT  /admin/events/{id}         → AdminEventController@update
DELETE /admin/events/{id}       → AdminEventController@destroy
GET  /admin/events/{id}/participants → Admin/Participants/Index
PUT  /admin/tickets/{id}/status → AdminTicketController@updateStatus
GET  /admin/absensi             → Admin/Absensi/Index
POST /admin/absensi/verify      → AdminAbsensiController@verify
```

---

## Komponen Reusable


## Alur Bisnis Utama

### 1. Pendaftaran Event Gratis
```
User buka EventDetail → Klik "Daftar Sekarang" →
POST /tickets { event_id } →
TicketController@store:
  - Cek user belum pernah daftar event ini
  - Create Ticket (status: 'dikonfirmasi', ticket_code: UUID::uuid4())
→ Redirect ke /my-tickets dengan flash success
→ QR Code langsung tampil di halaman tiket
```

### 2. Pendaftaran Event Berbayar
```
User buka EventDetail → Klik "Daftar & Bayar" →
POST /tickets { event_id, payment_proof: file } →
TicketController@store:
  - Simpan file ke storage/payment_proofs/
  - Create Ticket (status: 'menunggu_konfirmasi', ticket_code: UUID::uuid4())
→ Redirect ke /my-tickets dengan flash info "Menunggu konfirmasi admin"
```

### 3. Verifikasi Admin
```
Admin buka Participants page → Lihat daftar peserta menunggu konfirmasi →
Klik "Terima" atau "Tolak" →
PUT /admin/tickets/{id}/status { status: 'dikonfirmasi'|'ditolak' } →
Status tiket terupdate →
User melihat status berubah di /my-tickets
```

### 4. Absensi via QR
```
Admin buka /admin/absensi →
QRScanner aktifkan kamera →
Scan QR Code tiket peserta →
POST /admin/absensi/verify { ticket_code: '...' } →
Backend: cari tiket by ticket_code, set is_attended = true →
Response: flash nama peserta berhasil diabsen
```

### 5. Download Sertifikat
```
Admin set event is_completed = true →
User buka /my-certificates →
Muncul daftar event yang sudah selesai dan user hadir →
Klik "Download Sertifikat" →
GET /tickets/{id}/certificate →
Backend generate PDF/image dengan nama user → return download response
```

---


## Halaman yang Harus Dibuat (Summary)

### Halaman Publik (Guest + Auth)
| Halaman | Path | File |
|---------|------|------|
| Landing + Event List | `/` | `Pages/Public/Home.jsx` |
| Detail Event | `/events/{slug}` | `Pages/Public/EventDetail.jsx` |
| Login | `/login` | `Pages/Auth/Login.jsx` |
| Register | `/register` | `Pages/Auth/Register.jsx` |

### Halaman User (Harus Login)
| Halaman | Path | File |
|---------|------|------|
| Dashboard | `/dashboard` | `Pages/User/Dashboard.jsx` |
| Tiket Saya | `/my-tickets` | `Pages/User/MyTickets.jsx` |
| Sertifikat Saya | `/my-certificates` | `Pages/User/MyCertificates.jsx` |

### Halaman Admin (Harus Login + Role Admin)
| Halaman | Path | File |
|---------|------|------|
| Dashboard Admin | `/admin` | `Pages/Admin/Dashboard.jsx` |
| Kelola Event | `/admin/events` | `Pages/Admin/Events/Index.jsx` |
| Buat Event | `/admin/events/create` | `Pages/Admin/Events/Create.jsx` |
| Edit Event | `/admin/events/{id}/edit` | `Pages/Admin/Events/Edit.jsx` |
| Kelola Pendaftar | `/admin/events/{id}/participants` | `Pages/Admin/Participants/Index.jsx` |
| Absensi | `/admin/absensi` | `Pages/Admin/Absensi/Index.jsx` |

---


## Instruksi untuk AI Agent

**Tugasmu sekarang adalah membuat PLANNING yang mencakup:**

1. **Phase 0 — Project Initialization**
   - Setup Laravel 12 baru
   - Install & konfigurasi Inertia.js (server + client)
   - Install & konfigurasi Laravel Fortify
   - Install & konfigurasi Shadcn/ui
   - Setup Tailwind CSS
   - Setup path alias `@/`
   - Konfigurasi `HandleInertiaRequests` middleware

2. **Phase 1 — Foundation**
   - Migration: users, events, tickets
   - Model + relasi (User hasMany Tickets, Event hasMany Tickets, Ticket belongsTo User & Event)
   - Seeder: Admin user + sample events
   - AdminMiddleware
   - Layout components (GuestLayout, UserLayout, AdminLayout)
   - Fortify custom actions (CreateNewUser dengan field nim, phone)
   - Fortify responses (redirect ke Inertia pages)

3. **Phase 2 — Auth Pages**
   - Login page (Shadcn form)
   - Register page (Shadcn form + nim, phone fields)
   - Redirect after login berdasarkan role (user → /dashboard, admin → /admin)

4. **Phase 3 — Public Pages**
   - Home/Landing page dengan event grid
   - EventDetail page
   - Search/filter event

5. **Phase 4 — User Features**
   - Dashboard user
   - Pendaftaran event (gratis & berbayar)
   - My Tickets page + QR Code display
   - My Certificates page + download

6. **Phase 5 — Admin Features**
   - Admin Dashboard
   - Event CRUD (dengan upload banner & certificate template)
   - Participants management (list + verifikasi pembayaran)
   - Absensi page + QR Scanner

7. **Phase 6 — Testing**
   - Feature tests per modul
   - Performance test (response time per route)

8. **Phase 7 — Deployment**
   - Pilih platform (TBD — Railway/Render/Fly.io)
   - Environment configuration
   - Storage setup (symbolic link atau cloud storage)
   - Build & deploy

**Format output yang diharapkan:**
- Setiap task diberi label kompleksitas: `[Low]` `[Medium]` `[High]`
- Tandai dependensi antar task jika ada (task B butuh task A selesai dulu)
- Estimasi jumlah file yang akan dibuat per phase

**Jangan mulai coding sampai owner mereview dan menyetujui planning ini.**
