# Frontend SIAKAD (Antarmuka Pengguna)

Dokumentasi ini ditujukan untuk memandu pengembang (developer) yang akan mengelola, memelihara, atau mengembangkan lebih lanjut sisi antarmuka pengguna (Frontend) dari Sistem Informasi Akademik (SIAKAD) MAS Aisyiyah Medan.

Frontend ini dikembangkan sebagai Single Page Application (SPA) yang reaktif dan interaktif. Aplikasi ini sepenuhnya terpisah dari sistem server (Backend) dan hanya bertugas mengkonsumsi layanan REST API melalui protokol HTTP.

---

## Teknologi dan Perangkat Lunak Utama

Pembangunan antarmuka ini mengandalkan ekosistem JavaScript modern:
- React.js: Pustaka utama untuk membangun antarmuka pengguna berbasis komponen.
- Vite: Bundler (pembuat paket) yang digunakan untuk proses kompilasi kode yang sangat cepat saat masa pengembangan (development) maupun produksi (build).
- React Router (v6): Digunakan untuk navigasi halaman klien tanpa perlu memuat ulang (reload) browser.
- Axios: Klien HTTP (HTTP Client) untuk mengirim permintaan asinkron (AJAX) ke Backend Laravel.

---

## Struktur Direktori (Source Code)

Untuk mempertahankan keteraturan dan menghindari pengulangan kode, seluruh kode program (source code) diletakkan di dalam folder `src/`. Berikut adalah pembedahan fungsi setiap foldernya:

```text
src/
├── assets/       Menyimpan berkas statis (gambar, logo, ikon) dan berkas stylesheet (CSS) global.
├── config/       Menyimpan berkas pengaturan krusial seperti base URL API, menu navigasi, dan pemetaan hak akses (role).
├── providers/    Membungkus aplikasi dengan penyedia konteks (Context Provider), misalnya untuk state manajemen autentikasi.
├── roles/        Folder sentral untuk halaman antarmuka. Dipecah menjadi sub-folder per hak akses (misal: admin, guru, kepsek). Setiap sub-folder memiliki `routes.jsx` dan `pages.jsx` miliknya sendiri.
├── routes/       Penggabung (Router Master) yang memverifikasi apakah pengguna sedang berada di rute publik (login), atau rute internal yang butuh autentikasi.
├── shared/       Tempat penyimpanan komponen UI (Tombol, Tabel), service API, atau custom hooks yang digunakan secara berulang oleh lebih dari satu role.
├── App.jsx       Komponen wadah paling luar dari hierarki React.
└── main.jsx      Titik masuk (Entry Point) utama di mana kode React disuntikkan ke dalam DOM browser.
```

### Aturan Pembagian Kode (Code Splitting)
1. Keterikatan Role: Setiap direktori di dalam `roles` bersifat independen. File yang hanya digunakan oleh administrator harus berada di `roles/admin/`.
2. Reusabilitas: Jika ada potongan kode (misal: tombol kustom, tabel data, atau fungsi pemanggil API) yang dipakai oleh admin dan juga oleh guru, maka kode tersebut wajib dipindahkan ke dalam direktori `shared/`. Hal ini dilakukan agar tidak ada duplikasi logika (Don't Repeat Yourself).

---

## Persiapan dan Konfigurasi Lingkungan Lokal

Sebelum dapat menjalankan frontend, pastikan sistem Anda telah terpasang Node.js (direkomendasikan versi 18 ke atas) beserta manajer paket npm (Node Package Manager).

1. Instalasi Dependensi:
   Unduh semua pustaka eksternal yang dibutuhkan oleh proyek ini dengan menjalankan perintah:
   ```bash
   npm install
   ```

2. Konfigurasi Variabel Lingkungan:
   Aplikasi membutuhkan alamat backend untuk dapat berkomunikasi.
   ```bash
   copy .env.example .env
   ```
   Buka file `.env` dan pastikan variabel `VITE_API_BASE_URL` mengarah ke alamat server backend (contoh: `http://127.0.0.1:8000/api`).

3. Menjalankan Server Pengembangan:
   ```bash
   npm run dev
   ```
   Server lokal akan otomatis menyala, dan antarmuka aplikasi dapat langsung diakses melalui web browser pada alamat `http://localhost:5173`. Perubahan kode akan otomatis dimuat (Hot Module Replacement).

---

## Kualitas Kode dan Pemaketan Akhir

Untuk menjaga struktur kode agar tetap sesuai dengan standar penulisan yang berlaku, jalankan perintah ini sebelum melakukan pengiriman kode (commit):

```bash
npm run lint
```
Perintah ini akan memindai seluruh file JavaScript/JSX dan memberikan peringatan jika ada gaya penulisan yang tidak lazim atau berpotensi memunculkan galat (bug).

Apabila aplikasi sudah siap untuk diluncurkan ke server produksi (hosting), jalankan proses kompilasi akhir:

```bash
npm run build
```
Proses ini akan mengoptimasi aset, mengecilkan ukuran file (minification), dan menghasilkan folder `dist/` yang berisi kumpulan file statis (HTML, CSS, JS) murni. File-file statis inilah yang nantinya akan diunggah ke layanan web server (seperti Nginx atau Apache).
