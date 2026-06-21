import { lazy } from 'react';

export const ProfilBiodata = lazy(() => import('@/roles/profil'));
export const Pengumuman = lazy(() => import('@/roles/admin/pengumuman'));
export const Pengaturan = lazy(() => import('@/roles/admin/pengaturan'));
export const Dashboard = lazy(() => import('./dashboard'));
export const Kelas = lazy(() => import('./kelas'));
export const Mapel = lazy(() => import('./mapel'));
export const Absensi = lazy(() => import('./absensi'));
export const Nilai = lazy(() => import('./nilai'));
