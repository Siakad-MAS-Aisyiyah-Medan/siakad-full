<div align="center">
  <h1>🎓 SIAKAD MAS Aisyiyah Medan</h1>
  <p><strong>Sistem Informasi Akademik Terpadu untuk MAS Aisyiyah Medan</strong></p>
  <p>
    Sistem komprehensif yang dirancang untuk mengelola seluruh ekosistem akademik sekolah, mulai dari Penerimaan Peserta Didik Baru (PPDB), manajemen kelas, jadwal pelajaran, hingga penilaian dan kelulusan siswa.
  </p>
</div>

---

## 🌟 Fitur Utama

Sistem ini mendukung berbagai hak akses (Role-Based Access Control) yang disesuaikan dengan kebutuhan civitas akademika:

*   **👨‍💻 Administrator:** Kontrol penuh terhadap sistem, manajemen pengguna, pengaturan tahun ajaran, dan konfigurasi master data.
*   **🧑‍🏫 Guru:** Pengelolaan nilai siswa, absensi kelas, dan jadwal mengajar secara digital.
*   **👨‍🎓 Siswa:** Akses transkrip nilai, jadwal pelajaran harian, absensi, dan informasi pengumuman sekolah.
*   **📝 Calon Siswa:** Portal khusus untuk proses PPDB (Penerimaan Peserta Didik Baru) yang terintegrasi secara online.
*   **👔 Kepala Sekolah:** Dashboard analitik dan laporan komprehensif untuk memantau performa sekolah secara keseluruhan.

## 🛠️ Teknologi yang Digunakan

Proyek ini dibangun menggunakan arsitektur *Decoupled* (terpisah antara Frontend dan Backend) untuk memastikan skalabilitas dan performa maksimal.

*   **Frontend:** React.js + Vite (berjalan di `http://localhost:5173`)
*   **Backend:** Laravel (REST API) (berjalan di `http://127.0.0.1:8000`)
*   **Database:** MySQL / MariaDB

---

## 🚀 Panduan Instalasi & Menjalankan Project

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek secara lokal di mesin Anda.

### 1. Persyaratan Sistem (Prerequisites)
Pastikan Anda telah menginstal *software* berikut di komputer Anda:
*   [PHP](https://www.php.net/) (minimal versi 8.1)
*   [Composer](https://getcomposer.org/)
*   [Node.js & npm](https://nodejs.org/) (minimal versi 18)
*   MySQL / MariaDB Database

### 2. Konfigurasi Backend (Laravel)

Buka terminal dan jalankan perintah berikut:

```bash
# Masuk ke direktori backend
cd backend

# Instal semua dependensi PHP
composer install

# Salin file environment dan sesuaikan konfigurasi database Anda di dalamnya
copy .env.example .env

# Generate *application key* Laravel
php artisan key:generate

# Jalankan migrasi database beserta data awal (seeder)
php artisan migrate --seed

# Nyalakan server backend
php artisan serve --host=127.0.0.1 --port=8000
```
> **Catatan:** Pastikan database `siakad` sudah Anda buat di MySQL/MariaDB sebelum menjalankan perintah `migrate`.

### 3. Konfigurasi Frontend (React)

Buka **terminal baru** (biarkan terminal backend tetap berjalan) dan jalankan:

```bash
# Masuk ke direktori frontend
cd frontend

# Instal semua dependensi Javascript
npm install

# Salin file environment (pastikan VITE_API_URL mengarah ke backend)
copy .env.example .env

# Nyalakan server frontend
npm run dev
```
Setelah berhasil, buka browser Anda dan akses `http://localhost:5173`.

---

## 🧪 Pemeriksaan Project (Testing & Linting)

Untuk menjaga kualitas kode, selalu jalankan pengujian sebelum melakukan *commit* atau *deploy*.

**Di direktori Backend:**
```bash
cd backend
php artisan test
vendor\bin\pint --test
```

**Di direktori Frontend:**
```bash
cd frontend
npm run lint
npm run build
```

---

## 🔍 Panduan Mencari Sumber Masalah (Troubleshooting Guide)

Sistem ini menggunakan struktur arsitektur yang terorganisir. Jika Anda menemukan *bug* atau ingin mengubah fitur, ikuti alur pelacakan berikut:

1.  **Identifikasi UI:** Mulai dari peran (*role*) dan nama menu di folder `frontend/src/roles`.
2.  **Cari Rute:** Buka file `routes.jsx` pada folder role tersebut untuk melihat *React Component* (halaman) yang digunakan.
3.  **Lacak API Call:** Buka halaman tersebut dan cari *service API* yang dipanggil. File service biasanya berada di `frontend/src/shared`.
4.  **Cocokkan dengan Backend:** Lihat URL *endpoint* di *service API*, lalu cari URL tersebut di file rute backend `backend/routes/api.php`.
5.  **Telusuri Logika Bisnis:** Ikuti rute backend tersebut ke *Controller*, lalu ke *Service Layer* (jika ada), dan terakhir ke *Model* yang dipanggil.

> **💡 Tips Konfigurasi:** Konfigurasi struktur menu, navigasi, dan *permissions* (hak akses) dapat ditemukan di `frontend/src/config`, `backend/config`, dan didefinisikan secara mendasar di `backend/database/seeders/RbacSeeder.php`.

---
<div align="center">
  Dibuat dengan ❤️ untuk kemajuan pendidikan Indonesia.
</div>
