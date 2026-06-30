# Backend SIAKAD (REST API)

Dokumentasi ini ditujukan untuk pengembang (developer) yang akan memelihara atau mengembangkan lebih lanjut sistem backend dari Sistem Informasi Akademik (SIAKAD) MAS Aisyiyah Medan.

Backend ini dibangun menggunakan framework Laravel (PHP) dan bertindak secara eksklusif sebagai penyedia REST API. Proyek ini tidak memiliki tampilan antarmuka (UI) (seperti file Blade), melainkan hanya mengembalikan data dalam format JSON yang nantinya akan dikonsumsi oleh aplikasi Frontend (React).

---

## Arsitektur dan Alur Kerja (Request Lifecycle)

Untuk memudahkan pemeliharaan, arsitektur backend ini memisahkan tanggung jawab (Separation of Concerns). Alur pemrosesan data (request) dari klien (frontend) berjalan secara terurut:

1. Route (routes/api.php)
   Menerima request HTTP (GET, POST, PUT, DELETE) dari frontend. Pada tahap ini, rute dilindungi oleh Middleware untuk memastikan pengguna sudah login (autentikasi) dan memiliki hak akses (otorisasi/role) yang sesuai.

2. Controller (app/Http/Controllers/)
   Menerima request yang sudah lolos dari Middleware. Controller bertugas mengatur alur: memvalidasi input, memanggil logika bisnis, dan mengembalikan response.
   - Validasi Input: Controller memisahkan logika validasi dengan menggunakan FormRequest (berada di app/Http/Requests/).

3. Service (app/Services/)
   Berisi logika bisnis atau kalkulasi yang kompleks. Jika Controller hanya bertugas sebagai pengatur lalu lintas, Service mengeksekusi operasi berat (seperti import file, kalkulasi nilai, atau manipulasi data kompleks) sebelum memanggil database.

4. Model (app/Models/)
   Berinteraksi langsung dengan database menggunakan Eloquent ORM. Model mendefinisikan tabel database, kolom yang diizinkan untuk diisi (fillable), dan hubungan (relationship) antar tabel (seperti One-to-Many atau Many-to-Many).

5. Response (app/Http/Resources/)
   Setelah data diambil dari database, data dilewatkan ke kelas API Resource untuk diformat. Tujuannya adalah memastikan format respons JSON yang dikirimkan ke frontend selalu konsisten dan seragam.

---

Berikut adalah gambaran struktur direktori beserta fungsi spesifiknya:

```text
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/   Menerima request, memvalidasi alur kerja, dan mengembalikan response JSON. Contoh: GuruController.php.
│   │   ├── Requests/      Menyimpan aturan validasi input form agar Controller tetap bersih. Mengembalikan 422 jika gagal.
│   │   ├── Resources/     Memformat data (API Resource) agar struktur JSON yang dikirim ke frontend selalu konsisten.
│   │   └── Middleware/    Menjaga rute dari akses tanpa login dan memeriksa hak akses (Role).
│   ├── Models/            Representasi tabel database (Eloquent ORM) beserta penentuan relasinya (hasOne, belongsTo).
│   ├── Services/          Berisi logika komputasi berat dan proses bisnis kompleks agar tidak menumpuk di Controller.
│   └── Imports/           Menangani logika pengunggahan data massal (misalnya import data siswa dari file Excel).
│
├── config/                Menyimpan pengaturan aplikasi, termasuk pengaturan CORS untuk integrasi frontend.
├── database/
│   ├── migrations/        Blueprint/skema yang membangun struktur tabel dan kolom database secara terprogram.
│   └── seeders/           Penyuntik data awal. RbacSeeder.php berada di sini untuk membangun Role dan Permission sistem.
├── routes/
│   └── api.php            Daftar lengkap endpoint API dan konfigurasi pengelompokan rutenya berdasarkan hak akses.
└── tests/                 Pusat skrip pengujian otomatis (Unit Testing dan Feature Testing).
```

---

## Keamanan

1. Autentikasi (Token-based)
   Menggunakan Laravel Sanctum. Setelah pengguna memasukkan username dan password yang benar di rute login, backend akan menghasilkan string token. Frontend harus menyertakan token ini pada header `Authorization: Bearer <token>` untuk setiap request berikutnya.

2. Otorisasi (Role & Permission)
   Setiap akun terikat pada peran (Role) tertentu (Admin, Kepsek, Guru, Siswa, Calon Siswa). Rute API dilindungi agar tidak bisa diakses lintas peran.

---

## Prasyarat dan Panduan Instalasi Lokal

Sebelum menjalankan backend, pastikan spesifikasi lingkungan kerja (environment) berikut terpenuhi:
- PHP versi 8.1 atau lebih baru.
- Composer (Manajer dependensi PHP).
- MySQL atau MariaDB.

Langkah-langkah instalasi:

1. Unduh dependensi pihak ketiga:
   ```bash
   composer install
   ```

2. Konfigurasi Environment:
   ```bash
   copy .env.example .env
   ```
   Buka file `.env` dan atur parameter database (DB_DATABASE, DB_USERNAME, DB_PASSWORD).

3. Hasilkan Application Key (Kunci Enkripsi Laravel):
   ```bash
   php artisan key:generate
   ```

4. Migrasi dan Seeding Database:
   ```bash
   php artisan migrate --seed
   ```
   Perintah ini akan membuat semua tabel di MySQL dan mengisinya dengan data awal (termasuk akun administrator default).

5. Jalankan Server:
   ```bash
   php artisan serve --host=127.0.0.1 --port=8000
   ```

---

## Standar Pengujian dan Kualitas Kode

Sistem ini mendukung pengujian otomatis dan pemformatan standar PSR. Jika Anda menambahkan fitur baru, jalankan perintah berikut untuk memastikan integritas kode:

- Menjalankan pengujian (Automated Testing):
  ```bash
  php artisan test
  ```

- Memeriksa standar kode:
  ```bash
  vendor/bin/pint --test
  ```

- Memperbaiki standar kode secara otomatis:
  ```bash
  vendor/bin/pint
  ```
