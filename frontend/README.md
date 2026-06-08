# Frontend SIAKAD

Aplikasi web React (Vite) untuk Sistem Informasi Akademik MAS Aisyiyah Medan. Tahap **development** (belum production).

## Prasyarat

- Node.js 18+ (disarankan LTS)
- npm
- Backend API berjalan di `http://127.0.0.1:8000` (lihat repo `backend-siakad`)

## Setup cepat (clone baru)

```bash
cd frontend
npm install
cp .env.example .env          # Windows: copy .env.example .env
npm run dev
```

Aplikasi: **http://localhost:1001**

### Environment

| Variabel | Contoh (development) |
|----------|----------------------|
| `VITE_APP_NAME` | `SIAKAD` |
| `VITE_API_BASE_URL` | `http://127.0.0.1:8000/api` |

## Struktur (`src/`)

Arsitektur **feature-based** — setiap modul/halaman punya folder sendiri:

```
src/
├── app/              # Router, layouts, providers
│   └── router/       # index.jsx, DashboardRouter.jsx
├── config/           # app, api, menu, roles
├── services/         # apiClient, auth
├── features/         # Halaman per role/modul
│   ├── admin/
│   ├── guru/
│   ├── siswa/
│   ├── kepsek/
│   ├── wali-kelas/
│   ├── calon-siswa/
│   └── public/
├── shared/           # Komponen, utils, constants
└── main.jsx
```

### Pola folder feature

```
features/{role}/{nama-modul}/
├── index.jsx
├── components/
├── hooks/
├── services/
└── README.md         # ringkasan modul
```

## Routing

- Definisi route: `src/app/router/index.jsx`
- Dashboard per role: `src/app/router/DashboardRouter.jsx`

## Konfigurasi

| File | Fungsi |
|------|--------|
| `config/app.config.js` | Nama app, route default |
| `config/api.config.js` | Base URL API (dari `VITE_API_BASE_URL`) |
| `config/menu.config.js` | Menu sidebar per role |
| `config/roles.config.js` | Daftar role |

## Service API

- `services/apiClient.js` — Axios + token Sanctum
- `services/auth.service.js` — login, register, session

## Menambah halaman baru

1. Buat folder di `features/{role}/{nama-halaman}/`
2. Daftarkan route di `app/router/index.jsx`
3. Tambah menu di `config/menu.config.js` jika perlu sidebar

Contoh: `features/admin/murid/`

## Script

| Perintah | Keterangan |
|----------|------------|
| `npm run dev` | Development server (port 1001) |
| `npm run lint` | ESLint |

## Lisensi

Proyek internal MAS Aisyiyah Medan.
