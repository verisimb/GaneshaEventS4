# Panduan Deployment Ganesha Event di Coolify

Aplikasi **Ganesha Event** dikembangkan menggunakan arsitektur **Laravel 12** *Monolith* dengan komponen *frontend* antarmuka **Inertia.js + React (TypeScript)** serta *bundler* **Vite**.

Menggunakan **Coolify** bersama sistem *build* **Nixpacks** merupakan opsi terbaik, karena ekosistem ini secara otomatis mengenali bahasa PHP, Composer, serta manajemen modul Node/NPM.

Berikut adalah langkah-langkah detail, terperinci, dan siap pratik untuk mempublikasikan repositori ini di Coolify Anda.

---

## Tahap 1: Eksekusi Database MySQL di Coolify
Aplikasi ini membutuhkan *database* berbasis SQL. Buat layanan *database* terlebih dahulu sebelum menyiapkan aplikasi.

1. *Login* ke *dashboard* Coolify.
2. Buka tab **Projects** -> Pilih *environment* (Misalnya: `Production`).
3. Klik tombol **+ New** di sebelah kanan atas.
4. Pilih **Database** -> Pilih **MySQL** (direkomendasikan MySQL 8+ atau MariaDB).
5. Tentukan nama *database* internalnya (misal: `db-ganesha`).
6. Gulir dan klik tombol **Start** agar *database online*.
7. Navigasi ke menu **Credentials** pada *database* tersebut. Harap **catat** (Salin):
   - Internal Network Host (misalnya: `mysql-xxxxx`)
   - Database Name
   - User
   - Password
   Informasi ini dibutuhkan untuk konfigurasi *Environment Variable* aplikasi.

---

## Tahap 2: Menghubungkan Repositori Ganesha Event
1. Kembali ke *dashboard project environment* Anda.
2. Klik tombol **+ New** -> Pilih opsi sumber kode:
   - Pilih **Public Repository** jika *project* ini disetel publik.
   - Pilih **Private Repository** (melalui integrasi Github App) jika repositori ini mode _private_.
3. Pilih *repository* `verisimb/GaneshaEventS4`.
4. Atur *Branch* instalasinya ke `main` (atau cabang *production* Anda saat ini).
5. Coolify akan otomatis menempatkan **Build Pack** aplikasi menjadi **Nixpacks** (Sangat disarankan).
6. Segera atur kolom penamaan **Domains** sesuai nama *website* milik Universitas Anda (Misal: `https://event.kampus.ac.id`). Ini akan memberi SSL gratis secara otomatis dari Let's Encrypt.

---

## Tahap 3: Konfigurasi Variabel Lingkungan (.env)
Aplikasi Laravel tidak akan hidup jika tak ada _.env_ yang disematkan.
Di layanan aplikasi (App) Coolify Anda:

1. Buka parameter menu **Environment Variables**.
2. Masukkan konfigurasi standar penting Laravel (bisa via modul "Paste .env"):
   ```ini
   APP_NAME="Ganesha Event"
   APP_ENV=production
   APP_DEBUG=false
   APP_URL="https://domain-anda-disini.com"

   # App Key didapat dari Command "php artisan key:generate --show" di terminal lokal komputer Anda
   APP_KEY=base64:xxx...xxx 

   # LOG & TELESCOPE (Bila ada)
   LOG_CHANNEL=stderr
   LOG_LEVEL=error
   ```
3. Memasukkan kredensial *Database* menggunakan data dari **Tahap 1**:
   ```ini
   DB_CONNECTION=mysql
   DB_HOST=nama-internal-host-database-dari-tahap-1
   DB_PORT=3306
   DB_DATABASE=nama_db
   DB_USERNAME=user_db
   DB_PASSWORD=password_db
   ```
4. **Klik "Save"** pada halaman *Environment Variable*.

---

## Tahap 4: Penanganan Build Cache & Asset (Vite)
Nixpacks Coolify pintar mengenali bahwa Laravel butuh "composer" dan "npm" bersamaan jika ada file `vite.config.js`. Namun, kita perlu memasang instruksi khusus untuk membangun aset.

1. Buka tab **Configuration** -> **Build Task** atau **General**.
2. Temukan kolom **Pre-deployment command** / **Build Command**. Sisipkan perintah ini bila diperlukan (biasanya kosong sudah ter-*cover*, tapi ini cara manualnya yang aman):
   ```bash
   composer install --no-dev --optimize-autoloader
   npm install
   npm run build
   ```
3. Temukan parameter **Post-deployment Command**. Ini adalah instruksi wajib dijalankan setiap kali aplikasi telah dibenahi (*re-compile*) namun tak merusak kode. Masukkan:
   ```bash
   php artisan storage:link
   php artisan migrate --force
   php artisan optimize:clear
   php artisan run optimize
   php artisan view:cache
   ```
   > **Alasan**: *storage:link* memunculkan gambar _banner_; *migrate --force* membaca setiap tabel baru (meng-kalkulasi *update* MySQL tanpa dialog konfirmasi lokal); dan *optimize* akan mencepatkan loading rute & _config_.

---

## Tahap 5: Mulai Proses Deployment
1. Sentuh tombol **Deploy** di bagian kanan atas antarmuka Coolify App.
2. Lakukan navigasi klik ke tabel menu **Deployment Logs** yang saat ini aktif (*Running*).
3. Anda akan melihat log langsung di layar. Nixpacks akan mencari base image (Ubuntu/Debian), mengeksport modul PHP 8.x, Composer, dan Node.js 20+.
4. Bila semua log berubah hijau *(Deployed)* / *(Healthy)*, artinya server VPS Anda sudah menjalankan aplikasi.
5. Akses domain `https://domain-anda.com` lewat tab Web *Browser*.

---

## Tahap 6: Eksekusi File Seeding Awal (Opsional)
Apabila Anda men-deploy proyek ini benar-benar bersih dan belum ada satu pun akun Administrator ("Penyelenggara") di DB MySQL Cloud:
1. Pastikan aplikasi berada di status *Healthy*.
2. Klik tab **Terminal** pada halaman manajemen Coolify App bersangkutan.
3. Ini akan membuka _virtual terminal_ Bash. Jalankan eksekusi Seeder (Bila telah dibuat _DatabaseSeeder_-nya):
   ```bash
   php artisan db:seed --force
   ```
4. Selesai. Pengelola sudah bisa masuk dan mengonfigurasi tiket acaranya.
