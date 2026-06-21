import { lazy } from 'react';

export const InformasiPendaftaran = lazy(() => import('@/roles/calon-murid/informasi-pendaftaran'));
export const RegisterCalonMurid = lazy(() => import('@/roles/calon-murid/register'));
export const DashboardCalonMurid = lazy(() => import('@/roles/calon-murid/dashboard'));
export const FormulirPpdbWizard = lazy(() => import('@/roles/calon-murid/formulir-ppdb-wizard'));
export const UploadBerkas = lazy(() => import('@/roles/calon-murid/upload-berkas'));
export const KirimPendaftaranPage = lazy(() => import('@/roles/calon-murid/kirim-pendaftaran'));
export const StatusPendaftaran = lazy(() => import('@/roles/calon-murid/status'));
export const PengumumanPpdb = lazy(() => import('@/roles/calon-murid/pengumuman'));
export const AdminDaftarPendaftar = lazy(() => import('@/roles/admin/admin-daftar-pendaftar'));
export const AdminDetailPendaftar = lazy(() => import('@/roles/admin/admin-detail-pendaftar'));
export const AdminVerifikasiPendaftar = lazy(() => import('@/roles/admin/verifikasi-ppdb'));
