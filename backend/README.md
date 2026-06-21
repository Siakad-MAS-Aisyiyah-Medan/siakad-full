# Backend SIAKAD

Backend menggunakan Laravel dan menyediakan REST API untuk frontend.

## Struktur utama

```text
app/
|-- Http/Controllers/   menerima request dan mengatur response
|-- Http/Middleware/    memeriksa autentikasi, role, dan permission
|-- Http/Requests/      memvalidasi data dari frontend
|-- Http/Resources/     membentuk data JSON
|-- Models/             mewakili tabel dan relasi database
|-- Services/           menjalankan aturan bisnis
`-- Utils/              fungsi bantuan yang dipakai beberapa modul

routes/api/             endpoint dipisahkan berdasarkan role
database/migrations/    struktur tabel database
database/seeders/       data awal, role, permission, dan menu
config/                 konfigurasi aplikasi
tests/                  pengujian otomatis
```

Alur request adalah `route -> controller -> service -> model -> database`. Response dibentuk oleh controller atau resource dan dikirim kembali sebagai JSON.

## Perintah

```bash
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve --host=127.0.0.1 --port=8000
php artisan test
vendor\bin\pint --test
```

Frontend lokal diizinkan melalui CORS pada port `5173`. Konfigurasi database dan URL harus diisi melalui `.env`, bukan ditulis langsung di source code.
