<div align="center">
  <h1>🎓 SIAKAD MAS Aisyiyah Medan</h1>
  <p><strong>Sistem Informasi Akademik Terpadu untuk MAS Aisyiyah Medan</strong></p>
  <p>
    Sistem komprehensif yang dirancang untuk mengelola seluruh ekosistem akademik sekolah, mulai dari Penerimaan Peserta Didik Baru (PPDB), manajemen kelas, jadwal pelajaran, hingga penilaian dan kelulusan siswa.
  </p>
</div>

---

## 📖 Tentang Proyek (Skripsi)

Proyek **Sistem Informasi Akademik (SIAKAD) Berbasis Web pada MAS Aisyiyah Medan** ini dikembangkan sebagai bagian dari tugas akhir (Skripsi) pada Program Studi S-1 Teknik Informatika, Fakultas Informatika, **Universitas Mikroskil** (Medan, 2026).

**Tim Pengembang (Kelompok Skripsi):**
1. **Chairul Fitra Ramadhan** (NIM: 221112302)
2. **Rehuel Mirror Pertiwi Br. Saragih** (NIM: 221111489)
3. **Maudi Natalsyah Br Simatupang** (NIM: 221112432)

---

## 🌟 Fitur Utama

Sistem ini mendukung berbagai hak akses (*Role-Based Access Control*) yang disesuaikan dengan kebutuhan civitas akademika:

*   **👨‍💻 Administrator:** Kontrol penuh terhadap sistem, manajemen pengguna, pengaturan tahun ajaran, dan konfigurasi master data.
*   **👔 Kepala Sekolah:** Dashboard analitik dan laporan komprehensif untuk memantau performa sekolah secara keseluruhan.
*   **🧑‍🏫 Guru:** Pengelolaan nilai siswa, absensi kelas, dan jadwal mengajar secara digital.
*   **👨‍🎓 Siswa:** Akses transkrip nilai, jadwal pelajaran harian, absensi, dan informasi pengumuman sekolah.
*   **📝 Calon Siswa:** Portal khusus untuk proses PPDB (Penerimaan Peserta Didik Baru) yang terintegrasi secara online.

## 🛠️ Teknologi & Arsitektur

Proyek ini dibangun menggunakan arsitektur *Decoupled* (terpisah antara Frontend dan Backend) untuk memastikan skalabilitas, keamanan, dan performa maksimal.

*   **Frontend:** React.js + Vite
*   **Backend:** Laravel (REST API)
*   **Database:** MySQL / MariaDB

---

## 📂 Struktur Direktori Proyek

Proyek ini dibagi menjadi dua direktori utama: `backend` dan `frontend`. Memahami struktur ini sangat penting bagi pengembang, penguji, maupun dosen pembimbing yang ingin melakukan pengecekan kode sumber.

### 1. Direktori `backend/` (Laravel)
Menangani logika bisnis, interaksi ke database, dan menyediakan layanan REST API untuk *frontend*.

*   **`app/Http/Controllers/`**
    Tempat seluruh kontroler utama berada. Di sinilah logika pemrosesan *request* dari pengguna dikelola (contoh: `AkunController.php`, `PendaftaranController.php`).
*   **`app/Models/`**
    Berisi *Eloquent ORM Model* yang merepresentasikan setiap tabel di database. Konfigurasi relasi antar entitas (seperti relasi tabel `User` dengan tabel `Guru` atau `Siswa`) juga ada di sini.
*   **`app/Imports/` & `app/Exports/`**
    Menangani fungsionalitas impor dan ekspor data (seperti format *spreadsheet* Excel) untuk mempercepat manipulasi data massal.
*   **`database/migrations/`**
    Kumpulan skrip migrasi untuk mendefinisikan dan membuat struktur tabel di database secara otomatis tanpa harus melalui antarmuka SQL.
*   **`database/seeders/`**
    Digunakan untuk memasukkan data awal (*dummy data* / *master data*) ke dalam database. File krusial yang mengatur izin akses (*permissions*) ada pada `RbacSeeder.php`.
*   **`routes/api.php`**
    Pusat pendaftaran seluruh rute (*endpoints*) API. Di file ini, hak akses pada setiap URL juga dilindungi menggunakan *middleware* sesuai *role* pengguna.

### 2. Direktori `frontend/` (React + Vite)
Menangani antarmuka pengguna (UI) secara dinamis (*Single Page Application*) dan berinteraksi langsung dengan sistem *backend*.

*   **`src/assets/`**
    Tempat penyimpanan aset statis seperti gambar, ikon grafis, dan logo MAS Aisyiyah Medan.
*   **`src/config/`**
    Folder untuk mengatur konfigurasi global proyek. Terdapat pengaturan menu navigasi per *role* dan rute dasar pemanggilan API (contoh: `api.config.js`).
*   **`src/roles/`**
    Struktur utama pembagian UI berdasarkan hak akses. Di dalamnya terdapat direktori terpisah untuk `admin`, `guru`, `kepsek`, `murid`, dan `calon-murid`. Masing-masing folder *role* memiliki rutenya sendiri (`routes.jsx`).
*   **`src/shared/`**
    Komponen UI, layanan komunikasi API, dan instruksi modular (*hooks*) yang dirancang untuk dapat digunakan ulang di berbagai *role* secara efisien:
    *   **`components/`:** Kumpulan modul visual (*buttons*, *inputs*, `PageHeader`, `CustomSelect`, tabel data).
    *   **`akademik/`:** Logika bisnis spesifik bagian akademik yang dipisahkan untuk menjaga kerapian kode (arsitektur rapi).

---

## 🚀 Panduan Instalasi & Menjalankan Project

### 1. Persyaratan Sistem (*Prerequisites*)
*   [PHP](https://www.php.net/) (Minimal versi 8.1)
*   [Composer](https://getcomposer.org/)
*   [Node.js & npm](https://nodejs.org/) (Minimal versi 18)
*   MySQL / MariaDB Database Server

### 2. Setup Backend (Laravel)
Buka terminal dan jalankan:
```bash
cd backend
composer install
copy .env.example .env
# Penting: Buka file .env dan sesuaikan kredensial database MySQL Anda
php artisan key:generate
php artisan migrate --seed
php artisan serve --host=127.0.0.1 --port=8000
```

### 3. Setup Frontend (React)
Buka terminal baru (biarkan server backend tetap berjalan) dan jalankan:
```bash
cd frontend
npm install
copy .env.example .env
# Pastikan konfigurasi VITE_API_URL pada .env mengarah ke alamat backend (http://127.0.0.1:8000/api)
npm run dev
```
Sistem SIAKAD dapat diakses melalui browser pada `http://localhost:5173`.

---

## 🧪 Pemeriksaan Kualitas Kode (*Testing & Linting*)

Untuk memastikan tidak ada galat (error) dasar sebelum peluncuran kode:

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

## 🔍 Informasi Tambahan untuk Pengembang (*Troubleshooting*)

Apabila Anda hendak melakukan modifikasi (*maintenance*) sistem atau melacak sumber kendala (bug), kami merekomendasikan alur kerja berikut:

1.  **Identifikasi Antarmuka:** Mulai pencarian dari *role* pengguna dan cari file `routes.jsx` di direktori `frontend/src/roles/`. Kenali *React Component* (Halaman) mana yang sedang dirender.
2.  **Pelacakan Permintaan Data:** Pada halaman terkait, temukan fungsi layanan API (berada di folder `frontend/src/shared`) untuk mengetahui *endpoint* URL persis yang diakses.
3.  **Pengecekan Routing Backend:** Buka `backend/routes/api.php` dan cari *endpoint* yang cocok. Anda akan melihat nama `Controller` yang dipanggil.
4.  **Verifikasi Logika Bisnis & Basis Data:** Buka `Controller` tersebut, telusuri *validasi* dari *request*, lalu cermati perintah-perintah *Eloquent Model* untuk memastikan alur manipulasi database.

<div align="center">
  <br>
  <b>Dikembangkan untuk memenuhi syarat kelulusan dan memajukan pendidikan di MAS Aisyiyah Medan.</b>
  <br>
  <i>Universitas Mikroskil - 2026</i>
</div>
