# Frontend SIAKAD

Frontend menggunakan React, React Router, Axios, dan Vite.

## Struktur source

```text
src/
|-- assets/       file gambar dan style global tambahan
|-- config/       konfigurasi API, role, menu, dan permission
|-- providers/    provider yang membungkus aplikasi
|-- roles/        halaman dan route yang dikelompokkan per role
|-- routes/       penggabung route publik, autentikasi, dan role
|-- shared/       komponen, service, hook, dan fungsi yang dipakai bersama
|-- App.jsx       komponen utama aplikasi
`-- main.jsx      titik awal React
```

Setiap folder di `roles` memiliki `routes.jsx` untuk daftar URL dan `pages.jsx` untuk daftar halaman. Folder menu berada tepat di bawah role terkait, misalnya halaman Data Murid admin berada di `roles/admin/kelola-murid`.

Kode yang dipakai lebih dari satu role disimpan di `shared` agar tidak ada salinan logika yang berbeda.

## Perintah

```bash
npm install
npm run dev
npm run lint
npm run build
```

Development server berjalan di `http://localhost:5173`. Alamat backend dibaca dari `VITE_API_BASE_URL` di `.env`.
