import { Navigate, Route } from 'react-router-dom';
import { withPermission } from '@/routes/permissionRoute';
import {
  DaftarPendaftar,
  Dashboard,
  DetailPendaftar,
  Guru,
  Kelas,
  Mapel,
  Murid,
  Pengaturan,
  Pengumuman,
  ProfilBiodata,
  ProfilSekolah,
  TranskripAkademik,
} from './pages';

const redirects = [
  ['dashboard', 'dashboard'],
  ['data-diri', 'data-diri'],
  ['profil-sekolah', 'profil-sekolah'],
  ['pengumuman', 'pengumuman'],
  ['data-ppdb', 'data-ppdb'],
  ['data-murid', 'data-murid'],
  ['data-guru', 'data-guru'],
  ['data-kelas', 'data-kelas'],
  ['data-mapel', 'data-mapel'],
  ['transkrip-akademik', 'transkrip-akademik'],
  ['pengaturan', 'pengaturan'],
];

export const kepalaSekolahRoutes = (
  <>
    <Route path="/kepala-sekolah/dashboard" element={withPermission('/kepala-sekolah/dashboard', <Dashboard />)} />
    <Route path="/kepala-sekolah/profil-saya" element={withPermission('/kepala-sekolah/profil-saya', <ProfilBiodata />)} />
    <Route path="/kepala-sekolah/data-diri" element={<Navigate to="/kepala-sekolah/profil-saya" replace />} />
    <Route path="/kepala-sekolah/profil-sekolah" element={withPermission('/kepala-sekolah/profil-sekolah', <ProfilSekolah readOnly />)} />
    <Route path="/kepala-sekolah/pengumuman" element={withPermission('/kepala-sekolah/pengumuman', <Pengumuman readOnly />)} />
    <Route path="/kepala-sekolah/data-ppdb" element={withPermission('/kepala-sekolah/data-ppdb', <DaftarPendaftar readOnly />)} />
    <Route path="/kepala-sekolah/data-ppdb/:id" element={withPermission('/kepala-sekolah/data-ppdb', <DetailPendaftar readOnly />)} />
    <Route path="/kepala-sekolah/data-murid" element={withPermission('/kepala-sekolah/data-murid', <Murid readOnly />)} />
    <Route path="/kepala-sekolah/data-guru" element={withPermission('/kepala-sekolah/data-guru', <Guru readOnly />)} />
    <Route path="/kepala-sekolah/data-kelas" element={withPermission('/kepala-sekolah/data-kelas', <Kelas readOnly />)} />
    <Route path="/kepala-sekolah/data-mapel" element={withPermission('/kepala-sekolah/data-mapel', <Mapel readOnly />)} />
    <Route path="/kepala-sekolah/transkrip-akademik" element={withPermission('/kepala-sekolah/transkrip-akademik', <TranskripAkademik readOnly />)} />
    <Route path="/kepala-sekolah/pengaturan" element={withPermission('/kepala-sekolah/pengaturan', <Pengaturan />)} />
    {redirects.map(([source, target]) => (
      <Route key={source} path={`/kepsek/${source}`} element={<Navigate to={`/kepala-sekolah/${target}`} replace />} />
    ))}
  </>
);
