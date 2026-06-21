# SIAKAD MAS Aisyiyah Medan

Project terdiri dari dua aplikasi utama:

- `frontend`: antarmuka React yang berjalan di `http://localhost:5173`
- `backend`: REST API Laravel yang berjalan di `http://127.0.0.1:8000`

## Menjalankan project

Siapkan backend:

```bash
cd backend
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve --host=127.0.0.1 --port=8000
```

Jalankan frontend pada terminal lain:

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

## Pemeriksaan project

```bash
cd backend
php artisan test
vendor\bin\pint --test

cd ..\frontend
npm run lint
npm run build
```

## Cara mencari sumber masalah

1. Mulai dari role dan nama menu di `frontend/src/roles`.
2. Buka `routes.jsx` pada folder role untuk melihat halaman yang digunakan.
3. Cari service API yang dipanggil halaman di `frontend/src/shared`.
4. Cocokkan URL service dengan file role di `backend/routes/api`.
5. Ikuti controller, service, lalu model yang dipanggil backend.

Konfigurasi menu dan permission berada di `frontend/src/config`, `backend/config`, dan `backend/database/seeders/RbacSeeder.php`.
