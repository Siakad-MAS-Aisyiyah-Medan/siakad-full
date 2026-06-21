import { Navigate, Route } from 'react-router-dom';
import { withPermission } from '@/routes/permissionRoute';
import { ppdbAdminRoutes } from '@/shared/ppdb/routes';
import {
  Dashboard,
  Guru,
  HakAkses,
  Kelas,
  Mapel,
  Murid,
  Pengaturan,
  PengaturanPpdb,
  Pengumuman,
  ProfilSekolah,
  TahunAjaran,
  TranskripAkademik,
} from './pages';

export const adminRoutes = (
  <>
    <Route path="/admin/dashboard" element={withPermission('/admin/dashboard', <Dashboard />)} />
    <Route path="/admin/profil-sekolah" element={withPermission('/admin/profil-sekolah', <ProfilSekolah />)} />
    <Route path="/admin/profil" element={<Navigate to="/admin/profil-sekolah" replace />} />
    <Route path="/admin/pengaturan-ppdb" element={withPermission('/admin/pengaturan-ppdb', <PengaturanPpdb />)} />
    <Route path="/admin/pengumuman" element={withPermission('/admin/pengumuman', <Pengumuman />)} />
    <Route path="/admin/murid" element={withPermission('/admin/murid', <Murid />)} />
    <Route path="/admin/guru" element={withPermission('/admin/guru', <Guru />)} />
    <Route path="/admin/kelas" element={withPermission('/admin/kelas', <Kelas />)} />
    <Route path="/admin/mapel" element={withPermission('/admin/mapel', <Mapel />)} />
    <Route path="/admin/transkrip-akademik" element={withPermission('/admin/transkrip-akademik', <TranskripAkademik />)} />
    {ppdbAdminRoutes}
    <Route path="/admin/pengajuan" element={<Navigate to="/admin/ppdb" replace />} />
    <Route path="/admin/hak-akses" element={withPermission('/admin/hak-akses', <HakAkses />)} />
    <Route path="/admin/roles" element={<Navigate to="/admin/hak-akses" replace />} />
    <Route path="/admin/pengaturan" element={withPermission('/admin/pengaturan', <Pengaturan />)} />
    <Route path="/admin/tahun-ajaran" element={withPermission('/admin/tahun-ajaran', <TahunAjaran />)} />
  </>
);
