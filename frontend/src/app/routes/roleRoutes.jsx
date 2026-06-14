import { Navigate, Route } from 'react-router-dom';
import { PermissionRoute, ProtectedRoute } from '@app/shared/components/ProtectedRoute';
import { ROUTE_PERMISSIONS } from '@/config/routePermissions.config';
import FeaturePlaceholder from '@app/shared/components/FeaturePlaceholder';
import ForbiddenPage from '@app/shared/components/ForbiddenPage';
import NotFoundPage from '@app/shared/components/NotFoundPage';

import DashboardAdmin from '@app/pages/admin/dashboard';
import AdminProfilSekolah from '@app/pages/admin/profil-sekolah';
import AdminPengumuman from '@app/pages/admin/pengumuman';
import AdminMurid from '@app/pages/admin/kelola-murid';
import AdminGuru from '@app/pages/admin/kelola';
import AdminKelas from '@app/pages/admin/kelola-kelas';
import AdminMapel from '@app/pages/admin/kelola-mapel';
import AdminJadwal from '@app/pages/admin/jadwal';
import AdminHakAkses from '@app/pages/admin/hak-akses';
import AdminLaporan from '@app/pages/admin/laporan';
import AdminPengaturan from '@app/pages/admin/pengaturan';
import AdminTahunAjaran from '@app/pages/admin/pengaturan/tahun-ajaran';
import AdminAuditLogs from '@app/pages/admin/audit-logs';

import DashboardKepalaSekolah from '@app/pages/kepala-sekolah/dashboard';
import KepsekLaporanHub from '@app/pages/kepala-sekolah/laporan-hub';
import KepsekLaporanAbsensi from '@app/pages/kepala-sekolah/laporan-absensi';
import KepsekLaporanNilai from '@app/pages/kepala-sekolah/laporan-nilai';

import DashboardGuru from '@app/pages/guru/dashboard';
import GuruJadwal from '@app/pages/guru/jadwal';
import GuruAbsensi from '@app/pages/guru/absensi';
import GuruRiwayatAbsensi from '@app/pages/guru/riwayat-absensi';
import GuruNilai from '@app/pages/guru/nilai';

import DashboardWaliKelas from '@app/pages/guru/dashboard';
import WaliAbsensi from '@app/pages/guru/absensi';
import WaliNilai from '@app/pages/guru/nilai';
import WaliLaporan from '@app/pages/guru/laporan';

import DashboardSiswa from '@app/pages/murid/dashboard';
import SiswaJadwal from '@app/pages/murid/jadwal';
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

function placeholder(title, description) {
  return <FeaturePlaceholder title={title} description={description} />;
}

export const roleRoutes = (
  <>
    {/* Admin */}
    <Route path="/admin/dashboard" element={wrapPerm('/admin/dashboard', <DashboardAdmin />)} />
    <Route path="/admin/profil-sekolah" element={wrapPerm('/admin/profil-sekolah', <AdminProfilSekolah />)} />
    <Route path="/admin/profil" element={<Navigate to="/admin/profil-sekolah" replace />} />
    <Route path="/admin/pengumuman" element={wrapPerm('/admin/pengumuman', <AdminPengumuman />)} />
    <Route path="/admin/murid" element={wrapPerm('/admin/murid', <AdminMurid />)} />
    <Route path="/admin/guru" element={wrapPerm('/admin/guru', <AdminGuru />)} />
    <Route path="/admin/kelas" element={wrapPerm('/admin/kelas', <AdminKelas />)} />
    <Route path="/admin/mapel" element={wrapPerm('/admin/mapel', <AdminMapel />)} />
    <Route path="/admin/jadwal" element={wrapPerm('/admin/jadwal', <AdminJadwal />)} />
    {ppdbAdminRoutes}
    <Route path="/admin/pengajuan" element={<Navigate to="/admin/ppdb" replace />} />
    <Route path="/admin/hak-akses" element={wrapPerm('/admin/hak-akses', <AdminHakAkses />)} />
    <Route path="/admin/roles" element={<Navigate to="/admin/hak-akses" replace />} />
    <Route path="/admin/pengaturan" element={wrapPerm('/admin/pengaturan', <AdminPengaturan />)} />
    <Route path="/admin/pengaturan/tahun-ajaran" element={wrapPerm('/admin/pengaturan', <AdminTahunAjaran />)} />
    <Route path="/admin/laporan" element={wrapPerm('/admin/laporan', <AdminLaporan />)} />
    <Route path="/admin/audit-logs" element={wrapPerm('/admin/audit-logs', <AdminAuditLogs />)} />

    {/* Kepala sekolah */}
    <Route path="/kepala-sekolah/dashboard" element={wrapPerm('/kepsek/dashboard', <DashboardKepalaSekolah />)} />
    <Route path="/kepala-sekolah/data" element={wrapPerm('/kepsek/data', <KepsekLaporanHub initialJenis="siswa" />)} />
    <Route path="/kepala-sekolah/ppdb" element={wrapPerm('/kepsek/ppdb', <KepsekLaporanHub initialJenis="ppdb" />)} />
    <Route path="/kepala-sekolah/laporan" element={wrapPerm('/kepsek/laporan', <KepsekLaporanHub />)} />
    <Route path="/kepala-sekolah/laporan-absensi" element={wrapPerm('/kepsek/laporan-absensi', <KepsekLaporanAbsensi />)} />
    <Route path="/kepala-sekolah/laporan-nilai" element={wrapPerm('/kepsek/laporan-nilai', <KepsekLaporanNilai />)} />
    <Route path="/kepsek/dashboard" element={<Navigate to="/kepala-sekolah/dashboard" replace />} />
    <Route path="/kepsek/data" element={<Navigate to="/kepala-sekolah/data" replace />} />
    <Route path="/kepsek/ppdb" element={<Navigate to="/kepala-sekolah/ppdb" replace />} />
    <Route path="/kepsek/laporan" element={<Navigate to="/kepala-sekolah/laporan" replace />} />
    <Route path="/kepsek/laporan-absensi" element={<Navigate to="/kepala-sekolah/laporan-absensi" replace />} />
    <Route path="/kepsek/laporan-nilai" element={<Navigate to="/kepala-sekolah/laporan-nilai" replace />} />

    {/* Guru */}
    <Route path="/guru/dashboard" element={wrapPerm('/guru/dashboard', <DashboardGuru />)} />
    <Route path="/guru/jadwal" element={wrapPerm('/guru/jadwal', <GuruJadwal />)} />
    <Route
      path="/guru/murid"
      element={wrapPerm('/guru/murid', placeholder('Data Murid', 'Daftar murid per kelas yang Anda ampu.'))}
    />
    <Route path="/guru/absensi" element={wrapPerm('/guru/absensi', <GuruAbsensi />)} />
    <Route path="/guru/nilai" element={wrapPerm('/guru/nilai', <GuruNilai />)} />
    <Route path="/guru/riwayat-absensi" element={wrapPerm('/guru/riwayat-absensi', <GuruRiwayatAbsensi />)} />

    {/* Wali kelas */}
    <Route path="/wali-kelas/dashboard" element={wrapPerm('/wali/dashboard', <DashboardWaliKelas />)} />
    <Route
      path="/wali-kelas/murid"
      element={wrapPerm('/wali/murid', placeholder('Data Murid Kelas', 'Daftar siswa di kelas Anda.'))}
    />
    <Route path="/wali-kelas/absensi" element={wrapPerm('/wali/absensi', <WaliAbsensi />)} />
    <Route path="/wali-kelas/nilai" element={wrapPerm('/wali/nilai', <WaliNilai />)} />
    <Route path="/wali-kelas/leger" element={<Navigate to="/wali-kelas/nilai" replace />} />
    <Route
      path="/wali-kelas/laporan"
      element={wrapPerm('/wali/laporan', <WaliLaporan />, ['view_absensi_kelas', 'validate_nilai', 'view_siswa_kelas'])}
    />
    <Route
      path="/wali-kelas/ekskul"
      element={wrapPerm('/wali/ekskul', placeholder('Kepribadian & Ekskul', 'Data kepribadian dan ekstrakurikuler siswa.'))}
    />
    <Route path="/wali/dashboard" element={<Navigate to="/wali-kelas/dashboard" replace />} />
    <Route path="/wali/murid" element={<Navigate to="/wali-kelas/murid" replace />} />
    <Route path="/wali/absensi" element={<Navigate to="/wali-kelas/absensi" replace />} />
    <Route path="/wali/nilai" element={<Navigate to="/wali-kelas/nilai" replace />} />
    <Route path="/wali/leger" element={<Navigate to="/wali-kelas/nilai" replace />} />
    <Route path="/wali/laporan" element={<Navigate to="/wali-kelas/laporan" replace />} />
    <Route path="/wali/ekskul" element={<Navigate to="/wali-kelas/ekskul" replace />} />

    {/* Siswa */}
    <Route path="/siswa/dashboard" element={wrapPerm('/siswa/dashboard', <DashboardSiswa />)} />
    <Route path="/siswa/jadwal" element={wrapPerm('/siswa/jadwal', <SiswaJadwal />)} />
    <Route path="/siswa/absensi" element={wrapPerm('/siswa/absensi', <SiswaAbsensi />)} />
    <Route path="/siswa/nilai" element={wrapPerm('/siswa/nilai', <SiswaNilai />)} />

    {ppdbCalonRoutes}

    <Route path="/forbidden" element={<ProtectedRoute><ForbiddenPage /></ProtectedRoute>} />
    <Route path="*" element={<NotFoundPage />} />
  </>
);



