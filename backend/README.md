<div align="center">
  <h1>⚙️ Backend SIAKAD (REST API)</h1>
  <p><strong>Layanan API berbasis Laravel untuk Sistem Informasi Akademik MAS Aisyiyah Medan</strong></p>
</div>

---

## 📖 Tentang Backend

Proyek backend ini dirancang menggunakan kerangka kerja (framework) **Laravel**. Fokus utamanya adalah menyediakan RESTful API yang aman, cepat, dan terstruktur untuk dikonsumsi oleh aplikasi *frontend* (React). Proyek ini sepenuhnya berfokus pada logika bisnis, manajemen basis data, serta autentikasi, tanpa menangani urusan antarmuka pengguna (UI).

## 🛠️ Teknologi yang Digunakan

*   **Framework:** Laravel (PHP)
*   **Database:** MySQL / MariaDB
*   **Autentikasi:** Laravel Sanctum (Token-based Authentication)
*   **Arsitektur API:** RESTful API dengan format respons standar (JSON)

---

## 📂 Struktur Direktori Utama

Untuk memudahkan pengembangan dan pemeliharaan, arsitektur kode diatur dengan rapi. Berikut adalah penjelasan direktori utama:

```text
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/   # Menerima HTTP request, mengelola alur kerja, dan mengembalikan HTTP response (JSON).
│   │   ├── Middleware/    # Menjaga rute dari akses ilegal (Autentikasi, pengecekan Role & Permission).
│   │   ├── Requests/      # Kelas FormRequest untuk memisahkan logika validasi data input dari Controller.
│   │   └── Resources/     # API Resources (Data Transformer) untuk menyeragamkan format respon JSON.
│   ├── Models/            # Representasi tabel database (Eloquent ORM) dan penentuan relasi antar entitas.
│   ├── Services/          # Layer logika bisnis. Digunakan agar Controller tetap bersih dan tipis (Thin Controllers).
│   ├── Imports/           # Kelas untuk menangani fitur unggah data massal (contoh: Import File Excel).
│   └── Utils/             # Fungsi bantuan (Helpers/Traits) yang bisa dipakai silang oleh beberapa modul.
│
├── routes/
│   └── api.php            # Tempat seluruh rute (endpoints) API didaftarkan, dikelompokkan dengan Middleware keamanan.
│
├── database/
│   ├── migrations/        # Skrip (blueprint) pembentuk struktur tabel, kolom, dan constraint relasi pada database.
│   └── seeders/           # Data dummy/master data (seperti Akun Admin, Role, dan Menu) untuk di-generate otomatis.
│
├── config/                # Berisi file konfigurasi aplikasi, sistem file, environment, database, hingga CORS.
└── tests/                 # Tempat menulis skrip pengujian otomatis perangkat lunak (Unit & Feature Testing).
```

---

## 🔄 Alur Siklus Hidup Permintaan (*Request Lifecycle*)

Setiap *request* yang masuk dari *frontend* akan diproses melalui alur berikut untuk menjaga agar kode mematuhi prinsip tanggung jawab tunggal (*Single Responsibility Principle*):

1.  **`Route`:** Permintaan jaringan masuk ke rute yang didefinisikan di `routes/api.php` lalu dicegat oleh *Middleware* (untuk validasi token/role).
2.  **`Controller`:** Rute meneruskan data ke *Controller*. Di sini, input biasanya divalidasi terlebih dahulu menggunakan `FormRequest`.
3.  **`Service`:** Bila ada perhitungan kompleks, manipulasi file, atau validasi logika bisnis yang mendalam, *Controller* akan meneruskannya ke *Service Layer*.
4.  **`Model & Database`:** *Service* dan *Controller* berkomunikasi dengan database menggunakan *Model* (Eloquent ORM).
5.  **`Response`:** Data dikembalikan ke *Controller*, dibungkus dengan *API Resource* agar format JSON seragam, lalu dikirim ke *frontend* dengan kode status HTTP (200, 201, 404, dll).

---

## 🔐 Autentikasi dan Hak Akses (*Role-Based Access Control*)

Backend ini dilengkapi dengan sistem keamanan yang ketat:
*   **Autentikasi:** Menggunakan *Bearer Token* (dihasilkan oleh Laravel Sanctum) untuk memvalidasi setiap *request* setelah pengguna berhasil masuk (login).
*   **Role & Permission:** Hak akses awal diatur di dalam `RbacSeeder.php`. Hanya grup *role* tertentu yang diizinkan untuk mengakses fitur API tertentu (misalnya, hanya guru yang bisa input nilai).
*   **CORS (Cross-Origin Resource Sharing):** Dikonfigurasi agar secara eksklusif mengizinkan pertukaran data dari domain atau *port* *frontend* resmi (seperti `localhost:5173`), memblokir akses liar dari pihak ketiga.

---

## 🚀 Panduan Instalasi dan Menjalankan Server Lokal

Pastikan komputer Anda sudah memenuhi prasyarat, termasuk terinstalnya PHP (>= 8.1), Composer, dan server MySQL/MariaDB.

```bash
# 1. Unduh (Install) seluruh dependensi vendor PHP
composer install

# 2. Buat file .env dari template
copy .env.example .env
# PENTING: Buka .env dan atur kredensial (DB_DATABASE, DB_USERNAME, DB_PASSWORD) sesuai setelan MySQL Anda.

# 3. Hasilkan kunci rahasia Laravel untuk mengenkripsi sesi dan kata sandi
php artisan key:generate

# 4. Bangun struktur tabel dan suntikkan master data ke MySQL Anda
php artisan migrate --seed

# 5. Nyalakan layanan backend lokal
php artisan serve --host=127.0.0.1 --port=8000
```

---

## 🧪 Pengujian & Standarisasi Penulisan Kode (*Testing & Linting*)

Untuk memastikan tidak ada kerusakan logika program (*breaking changes*) setelah mengubah kode:

```bash
# Menjalankan pengujian fungsional otomatis
php artisan test

# Memeriksa kepatuhan penulisan kode sesuai standar PHP (PSR) menggunakan Laravel Pint
vendor\bin\pint --test
```

Jika terdapat gaya penulisan (*code style*) yang tidak rapi, Anda dapat merapikannya secara otomatis dengan mengeksekusi:
```bash
vendor\bin\pint
```
