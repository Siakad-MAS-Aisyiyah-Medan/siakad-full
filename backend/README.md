# 🎓 BUKU SAKU SKRIPSI & PANDUAN BACKEND SIAKAD

File ini dibuat khusus untuk Anda sebagai "contekan" saat bimbingan atau ujian sidang skripsi. Jika dosen pembimbing bertanya mengenai *backend*, Anda bisa membuka file ini untuk mengingat kembali arsitektur dan cara kerja aplikasi Anda.

---

## 🗺️ Peta Navigasi Folder (Dimana Letak Filenya?)

Aplikasi backend ini dibangun menggunakan framework **Laravel**. Berikut adalah folder-folder terpenting yang wajib Anda ketahui:

1. **`routes/api.php`**
   - **Fungsi:** Pintu masuk semua *request* dari frontend.
   - **Jawaban ke dosen:** *"Semua jalur API (URL endpoint) didefinisikan di folder routes, tepatnya di `routes/api.php` pak/bu."*

2. **`app/Http/Controllers/`**
   - **Fungsi:** Tempat pengatur alur kerja. Controller bertugas menerima request dari `routes`, memanggil `Services`, lalu mengembalikan *response* (biasanya berupa JSON) ke frontend.
   - **Jawaban ke dosen:** *"Logika penerimaan input user diproses di dalam Controller yang ada di `app/Http/Controllers`."*

3. **`app/Models/`**
   - **Fungsi:** Representasi dari tabel-tabel di database (Sistem ORM / Object Relational Mapping).
   - **Jawaban ke dosen:** *"Untuk komunikasi ke database, saya menggunakan model Eloquent yang ada di `app/Models`."*

4. **`app/Services/`**
   - **Fungsi:** Tempat logika bisnis yang rumit (contoh: kalkulasi nilai, proses pendaftaran). Ini membuktikan aplikasi Anda menggunakan pola desain (Design Pattern) yang *advanced* dan rapi.
   - **Jawaban ke dosen:** *"Agar Controller tetap bersih, logika bisnis yang rumit saya pisahkan ke dalam folder `app/Services`."*

5. **`database/migrations/`**
   - **Fungsi:** Cetak biru (blueprint) struktur tabel database Anda.
   - **Jawaban ke dosen:** *"Struktur tabel database saya buat menggunakan skema kode di folder `database/migrations`."*

6. **`app/Utils/`**
   - **Fungsi:** Tempat penggabungan utilitas bantuan (Helpers, Rules, Traits) agar folder utama tidak berantakan. Anda tidak perlu memodifikasi bagian ini.

---

## 🔄 Alur Cara Kerja Aplikasi (Sangat Penting!)

Jika dosen bertanya: *"Coba jelaskan bagaimana proses simpan data dari frontend sampai masuk ke database!"*

**Jawaban Anda:**
1. Frontend (React/Vue) mengirim *request* HTTP ke URL API kita.
2. Request tersebut pertama kali ditangkap oleh **Routes** (`routes/api.php`).
3. Dari *Routes*, request diarahkan ke fungsi yang ada di **Controller** (`app/Http/Controllers`).
4. Di dalam *Controller*, input dari user divalidasi. Jika valid, Controller akan memanggil **Service** (`app/Services`) untuk memproses logika utama.
5. *Service* kemudian menggunakan **Model** (`app/Models`) untuk menyimpan data tersebut ke dalam tabel MySQL.
6. Setelah berhasil, Controller mengembalikan pesan sukses (*Response JSON*) ke frontend.

---

## 🛠️ Panduan Troubleshooting (Bila Terjadi Error)

Jika aplikasi error/nge-bug saat Anda demo ke dosen, jangan panik! Lakukan hal berikut:

1. **Cek Terminal Server:**
   Buka layar terminal tempat Anda menjalankan `php artisan serve`. Jika terjadi error, pesan kerusakannya (biasanya teks merah) akan muncul langsung di layar tersebut.

2. **Cek Status Database:**
   Pastikan XAMPP/Laragon (MySQL) Anda menyala, dan file `.env` bagian `DB_DATABASE` sudah sesuai dengan nama database di PHPMyAdmin Anda.

3. **Bersihkan Cache (Cache Clear):**
   Terkadang perubahan kode tidak terbaca. Buka terminal di folder `backend` dan jalankan:
   ```bash
   php artisan optimize:clear
   ```

---

## 💻 Daftar Perintah Penting (Cheat Sheet)

Perintah-perintah ini dijalankan di dalam **terminal** pada folder `backend`:

- **Menjalankan Server Lokal:**
  `php artisan serve`

- **Mereset & Mengisi Ulang Database (HATI-HATI DATA HILANG):**
  `php artisan migrate:fresh --seed`

- **Membuat Controller Baru:**
  `php artisan make:controller NamaController`

- **Membuat Model Baru (beserta filenya):**
  `php artisan make:model NamaModel -m`

---
*Semangat untuk sidang/bimbingannya! Anda pasti bisa menjelaskannya dengan baik.* 🚀
