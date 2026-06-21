import { Route } from 'react-router-dom';
import { withPermission } from '@/routes/permissionRoute';
import { Absensi, Dashboard, Kelas, Mapel, Murid, Nilai, Pengaturan, Pengumuman, ProfilBiodata } from './pages';

export const guruRoutes = (
  <>
    <Route path="/guru/dashboard" element={withPermission('/guru/dashboard', <Dashboard />)} />
    <Route path="/guru/profil-saya" element={withPermission('/guru/profil-saya', <ProfilBiodata />)} />
    <Route path="/guru/pengumuman" element={withPermission('/guru/pengumuman', <Pengumuman readOnly />)} />
    <Route path="/guru/kelas" element={withPermission('/guru/kelas', <Kelas />)} />
    <Route path="/guru/mapel" element={withPermission('/guru/mapel', <Mapel />)} />
    <Route path="/guru/murid" element={withPermission('/guru/murid', <Murid />)} />
    <Route path="/guru/absensi" element={withPermission('/guru/absensi', <Absensi />)} />
    <Route path="/guru/nilai" element={withPermission('/guru/nilai', <Nilai />)} />
    <Route path="/guru/pengaturan" element={withPermission('/guru/pengaturan', <Pengaturan />)} />
  </>
);
