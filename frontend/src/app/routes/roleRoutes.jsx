import { Navigate, Route } from 'react-router-dom';
import { PermissionRoute, ProtectedRoute } from '@app/shared/components/ProtectedRoute';
import { ROUTE_PERMISSIONS } from '@/config/routePermissions.config';
import ForbiddenPage from '@app/shared/components/ForbiddenPage';
import NotFoundPage from '@app/shared/components/NotFoundPage';

import DashboardAdmin from '@app/pages/admin/dashboard';
import AdminProfilSekolah from '@app/pages/admin/profil-sekolah';
import AdminPengumuman from '@app/pages/admin/pengumuman';
import AdminMurid from '@app/pages/admin/kelola-murid';
import AdminGuru from '@app/pages/admin/kelola';
import AdminKelas from '@app/pages/admin/kelola-kelas';
import AdminMapel from '@app/pages/admin/kelola-mapel';
import AdminTranskripAkademik from '@app/pages/admin/transkrip-akademik';
import AdminHakAkses from '@app/pages/admin/hak-akses';
import AdminPengaturan from '@app/pages/admin/pengaturan';
import AdminPengaturanPpdb from '@app/pages/admin/pengaturan-ppdb';
import AdminTahunAjaran from '@app/pages/admin/tahun-ajaran';
import AdminDaftarPendaftar from '@app/pages/admin/admin-daftar-pendaftar';
import AdminDetailPendaftar from '@app/pages/admin/admin-detail-pendaftar';
import ProfilBiodataPage from '@app/pages/profil';

import DashboardKepalaSekolah from '@app/pages/kepala-sekolah/dashboard';

import DashboardGuru from '@app/pages/guru/dashboard';
import GuruKelasPage from '@app/pages/guru/kelas';
import GuruMapelPage from '@app/pages/guru/mapel';
import GuruMuridPage from '@app/pages/guru/murid';
import GuruAbsensi from '@app/pages/guru/absensi/GuruAbsensi';
import GuruNilai from '@app/pages/guru/nilai/GuruNilai';

import DashboardSiswa from '@app/pages/murid/dashboard';
import SiswaKelasPage from '@app/pages/murid/kelas';
import SiswaMapelPage from '@app/pages/murid/mapel';
import SiswaAbsensi from '@app/pages/murid/absensi';
import SiswaNilai from '@app/pages/murid/nilai';

import { ppdbCalonRoutes, ppdbAdminRoutes } from '@app/shared/ppdb/routes';

function wrapPerm(path, element, permissionsOverride) {
  if (permissionsOverride?.length) {
    return <PermissionRoute permissions={permissionsOverride}>{element}</PermissionRoute>;
  }
  const permission = ROUTE_PERMISSIONS[path];
  if (!permission) return element;
  return <PermissionRoute permission={permission}>{element}</PermissionRoute>;
}

export const roleRoutes = (
  <>
    {/* Admin */}
    <Route path="/admin/dashboard" element={wrapPerm('/admin/dashboard', <DashboardAdmin />)} />
    <Route path="/admin/profil-sekolah" element={wrapPerm('/admin/profil-sekolah', <AdminProfilSekolah />)} />
    <Route path="/admin/profil" element={<Navigate to="/admin/profil-sekolah" replace />} />
    <Route path="/admin/pengaturan-ppdb" element={wrapPerm('/admin/pengaturan-ppdb', <AdminPengaturanPpdb />)} />
    <Route path="/admin/pengumuman" element={wrapPerm('/admin/pengumuman', <AdminPengumuman />)} />
    <Route path="/admin/murid" element={wrapPerm('/admin/murid', <AdminMurid />)} />
    <Route path="/admin/guru" element={wrapPerm('/admin/guru', <AdminGuru />)} />
    <Route path="/admin/kelas" element={wrapPerm('/admin/kelas', <AdminKelas />)} />
    <Route path="/admin/mapel" element={wrapPerm('/admin/mapel', <AdminMapel />)} />
    <Route path="/admin/transkrip-akademik" element={wrapPerm('/admin/transkrip-akademik', <AdminTranskripAkademik />)} />
    {ppdbAdminRoutes}
    <Route path="/admin/pengajuan" element={<Navigate to="/admin/ppdb" replace />} />
    <Route path="/admin/hak-akses" element={wrapPerm('/admin/hak-akses', <AdminHakAkses />)} />
    <Route path="/admin/roles" element={<Navigate to="/admin/hak-akses" replace />} />
    <Route path="/admin/pengaturan" element={wrapPerm('/admin/pengaturan', <AdminPengaturan />)} />
    <Route path="/admin/tahun-ajaran" element={wrapPerm('/admin/tahun-ajaran', <AdminTahunAjaran />)} />

    {/* Kepala sekolah */}
    <Route path="/kepala-sekolah/dashboard" element={wrapPerm('/kepala-sekolah/dashboard', <DashboardKepalaSekolah />)} />
    <Route path="/kepala-sekolah/profil-saya" element={wrapPerm('/kepala-sekolah/profil-saya', <ProfilBiodataPage />)} />
    <Route path="/kepala-sekolah/data-diri" element={<Navigate to="/kepala-sekolah/profil-saya" replace />} />
    <Route path="/kepala-sekolah/profil-sekolah" element={wrapPerm('/kepala-sekolah/profil-sekolah', <AdminProfilSekolah readOnly />)} />
    <Route path="/kepala-sekolah/pengumuman" element={wrapPerm('/kepala-sekolah/pengumuman', <AdminPengumuman readOnly />)} />
    <Route path="/kepala-sekolah/data-ppdb" element={wrapPerm('/kepala-sekolah/data-ppdb', <AdminDaftarPendaftar readOnly />)} />
    <Route path="/kepala-sekolah/data-ppdb/:id" element={wrapPerm('/kepala-sekolah/data-ppdb', <AdminDetailPendaftar readOnly />)} />
    <Route path="/kepala-sekolah/data-murid" element={wrapPerm('/kepala-sekolah/data-murid', <AdminMurid readOnly />)} />
    <Route path="/kepala-sekolah/data-guru" element={wrapPerm('/kepala-sekolah/data-guru', <AdminGuru readOnly />)} />
    <Route path="/kepala-sekolah/data-kelas" element={wrapPerm('/kepala-sekolah/data-kelas', <AdminKelas readOnly />)} />
    <Route path="/kepala-sekolah/data-mapel" element={wrapPerm('/kepala-sekolah/data-mapel', <AdminMapel readOnly />)} />
    <Route path="/kepala-sekolah/transkrip-akademik" element={wrapPerm('/kepala-sekolah/transkrip-akademik', <AdminTranskripAkademik readOnly />)} />
    <Route path="/kepala-sekolah/pengaturan" element={wrapPerm('/kepala-sekolah/pengaturan', <AdminPengaturan />)} />
    <Route path="/kepsek/dashboard" element={<Navigate to="/kepala-sekolah/dashboard" replace />} />
    <Route path="/kepsek/data-diri" element={<Navigate to="/kepala-sekolah/data-diri" replace />} />
    <Route path="/kepsek/profil-sekolah" element={<Navigate to="/kepala-sekolah/profil-sekolah" replace />} />
    <Route path="/kepsek/pengumuman" element={<Navigate to="/kepala-sekolah/pengumuman" replace />} />
    <Route path="/kepsek/data-ppdb" element={<Navigate to="/kepala-sekolah/data-ppdb" replace />} />
    <Route path="/kepsek/data-murid" element={<Navigate to="/kepala-sekolah/data-murid" replace />} />
    <Route path="/kepsek/data-guru" element={<Navigate to="/kepala-sekolah/data-guru" replace />} />
    <Route path="/kepsek/data-kelas" element={<Navigate to="/kepala-sekolah/data-kelas" replace />} />
    <Route path="/kepsek/data-mapel" element={<Navigate to="/kepala-sekolah/data-mapel" replace />} />
    <Route path="/kepsek/transkrip-akademik" element={<Navigate to="/kepala-sekolah/transkrip-akademik" replace />} />
    <Route path="/kepsek/pengaturan" element={<Navigate to="/kepala-sekolah/pengaturan" replace />} />

    {/* Guru */}
    <Route path="/guru/dashboard" element={wrapPerm('/guru/dashboard', <DashboardGuru />)} />
    <Route path="/guru/profil-saya" element={wrapPerm('/guru/profil-saya', <ProfilBiodataPage />)} />
    <Route path="/guru/pengumuman" element={wrapPerm('/guru/pengumuman', <AdminPengumuman readOnly />)} />
    <Route path="/guru/kelas" element={wrapPerm('/guru/kelas', <GuruKelasPage />)} />
    <Route path="/guru/mapel" element={wrapPerm('/guru/mapel', <GuruMapelPage />)} />
    <Route path="/guru/murid" element={wrapPerm('/guru/murid', <GuruMuridPage />)} />
    <Route path="/guru/absensi" element={wrapPerm('/guru/absensi', <GuruAbsensi />)} />
    <Route path="/guru/nilai" element={wrapPerm('/guru/nilai', <GuruNilai />)} />
    <Route path="/guru/pengaturan" element={wrapPerm('/guru/pengaturan', <AdminPengaturan />)} />

    {/* Siswa */}
    <Route path="/siswa/dashboard" element={wrapPerm('/siswa/dashboard', <DashboardSiswa />)} />
    <Route path="/siswa/profil-saya" element={wrapPerm('/siswa/profil-saya', <ProfilBiodataPage />)} />
    <Route path="/siswa/kelas" element={wrapPerm('/siswa/kelas', <SiswaKelasPage />)} />
    <Route path="/siswa/pengumuman" element={wrapPerm('/siswa/pengumuman', <AdminPengumuman readOnly />)} />
    <Route path="/siswa/mapel" element={wrapPerm('/siswa/mapel', <SiswaMapelPage />)} />
    <Route path="/siswa/absensi" element={wrapPerm('/siswa/absensi', <SiswaAbsensi />)} />
    <Route path="/siswa/nilai" element={wrapPerm('/siswa/nilai', <SiswaNilai />)} />
    <Route path="/siswa/pengaturan" element={wrapPerm('/siswa/pengaturan', <AdminPengaturan />)} />

    {ppdbCalonRoutes}
    <Route path="/calon-murid/pengaturan" element={wrapPerm('/calon-murid/pengaturan', <AdminPengaturan />)} />

    <Route path="/forbidden" element={<ProtectedRoute><ForbiddenPage /></ProtectedRoute>} />
    <Route path="*" element={<NotFoundPage />} />
  </>
);



