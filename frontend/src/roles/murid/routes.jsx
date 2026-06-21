import { Route } from 'react-router-dom';
import { withPermission } from '@/routes/permissionRoute';
import { Absensi, Dashboard, Kelas, Mapel, Nilai, Pengaturan, Pengumuman, ProfilBiodata } from './pages';

export const muridRoutes = (
  <>
    <Route path="/siswa/dashboard" element={withPermission('/siswa/dashboard', <Dashboard />)} />
    <Route path="/siswa/profil-saya" element={withPermission('/siswa/profil-saya', <ProfilBiodata />)} />
    <Route path="/siswa/kelas" element={withPermission('/siswa/kelas', <Kelas />)} />
    <Route path="/siswa/pengumuman" element={withPermission('/siswa/pengumuman', <Pengumuman readOnly />)} />
    <Route path="/siswa/mapel" element={withPermission('/siswa/mapel', <Mapel />)} />
    <Route path="/siswa/absensi" element={withPermission('/siswa/absensi', <Absensi />)} />
    <Route path="/siswa/nilai" element={withPermission('/siswa/nilai', <Nilai />)} />
    <Route path="/siswa/pengaturan" element={withPermission('/siswa/pengaturan', <Pengaturan />)} />
  </>
);
