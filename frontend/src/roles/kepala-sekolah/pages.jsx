import { lazy } from 'react';

export const ProfilBiodata = lazy(() => import('@/roles/profil'));
export const ProfilSekolah = lazy(() => import('@/roles/admin/profil-sekolah'));
export const Pengumuman = lazy(() => import('@/roles/admin/pengumuman'));
export const DaftarPendaftar = lazy(() => import('@/roles/admin/admin-daftar-pendaftar'));
export const DetailPendaftar = lazy(() => import('@/roles/admin/admin-detail-pendaftar'));
export const Murid = lazy(() => import('@/roles/admin/kelola-murid'));
export const Guru = lazy(() => import('@/roles/admin/kelola-guru'));
export const Kelas = lazy(() => import('@/roles/admin/kelola-kelas'));
export const Mapel = lazy(() => import('@/roles/admin/kelola-mapel'));
export const TranskripAkademik = lazy(() => import('@/roles/admin/transkrip-akademik'));
export const Pengaturan = lazy(() => import('@/roles/admin/pengaturan'));
export const Dashboard = lazy(() => import('./dashboard'));
