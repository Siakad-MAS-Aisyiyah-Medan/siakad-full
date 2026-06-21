import { lazy } from 'react';

export const Dashboard = lazy(() => import('./dashboard'));
export const ProfilSekolah = lazy(() => import('./profil-sekolah'));
export const Pengumuman = lazy(() => import('./pengumuman'));
export const Murid = lazy(() => import('./kelola-murid'));
export const Guru = lazy(() => import('./kelola'));
export const Kelas = lazy(() => import('./kelola-kelas'));
export const Mapel = lazy(() => import('./kelola-mapel'));
export const TranskripAkademik = lazy(() => import('./transkrip-akademik'));
export const HakAkses = lazy(() => import('./hak-akses'));
export const Pengaturan = lazy(() => import('./pengaturan'));
export const PengaturanPpdb = lazy(() => import('./pengaturan-ppdb'));
export const TahunAjaran = lazy(() => import('./tahun-ajaran'));
