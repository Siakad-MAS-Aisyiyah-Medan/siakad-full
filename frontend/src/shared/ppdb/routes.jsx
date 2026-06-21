import { Navigate, Route } from 'react-router-dom';
import {
  CALON_MURID_LOGIN,
  PermissionRoute,
  RoleRoute,
} from '@/shared/components/ProtectedRoute';

const calonGuard = { loginPath: CALON_MURID_LOGIN };
import {
  AdminDaftarPendaftar,
  AdminDetailPendaftar,
  AdminVerifikasiPendaftar,
  DashboardCalonMurid,
  FormulirPpdbWizard,
  InformasiPendaftaran,
  KirimPendaftaranPage,
  PengumumanPpdb,
  RegisterCalonMurid,
  StatusPendaftaran,
  UploadBerkas,
} from './pages';

export const ppdbPublicRoutes = (
  <>
    <Route path="/ppdb/informasi" element={<InformasiPendaftaran />} />
    <Route path="/pendaftaran" element={<Navigate to="/ppdb/informasi" replace />} />
    <Route path="/register-calon-murid" element={<RegisterCalonMurid />} />
    <Route path="/ppdb/info" element={<Navigate to="/ppdb/informasi" replace />} />
    <Route path="/ppdb/daftar" element={<Navigate to="/register-calon-murid" replace />} />
    <Route path="/register" element={<Navigate to="/register-calon-murid" replace />} />
  </>
);

export const ppdbCalonRoutes = (
  <>
    <Route
      path="/calon-murid/dashboard"
      element={
        <RoleRoute allowedRoles={['calon_siswa']} {...calonGuard}>
          <DashboardCalonMurid />
        </RoleRoute>
      }
    />
    <Route
      path="/ppdb/registrasi"
      element={
        <RoleRoute allowedRoles={['calon_siswa']} {...calonGuard}>
          <FormulirPpdbWizard />
        </RoleRoute>
      }
    />
    <Route
      path="/ppdb/formulir"
      element={
        <RoleRoute allowedRoles={['calon_siswa']} {...calonGuard}>
          <FormulirPpdbWizard />
        </RoleRoute>
      }
    />
    
    <Route
      path="/calon-murid/upload-berkas"
      element={
        <RoleRoute allowedRoles={['calon_siswa']} {...calonGuard}>
          <UploadBerkas />
        </RoleRoute>
      }
    />
    <Route
      path="/calon-murid/status"
      element={
        <RoleRoute allowedRoles={['calon_siswa']} {...calonGuard}>
          <StatusPendaftaran />
        </RoleRoute>
      }
    />
    <Route
      path="/calon-murid/kirim-pendaftaran"
      element={
        <RoleRoute allowedRoles={['calon_siswa']} {...calonGuard}>
          <KirimPendaftaranPage />
        </RoleRoute>
      }
    />
    <Route
      path="/calon-murid/pengumuman"
      element={
        <RoleRoute allowedRoles={['calon_siswa']} {...calonGuard}>
          <PengumumanPpdb />
        </RoleRoute>
      }
    />
    
    <Route path="/calon-murid/formulir-legacy" element={<Navigate to="/ppdb/registrasi" replace />} />
    <Route path="/calon-murid/berkas" element={<Navigate to="/calon-murid/upload-berkas" replace />} />
    <Route path="/calon-murid/bukti" element={<Navigate to="/calon-murid/status" replace />} />
    <Route path="/ppdb/dashboard" element={<Navigate to="/calon-murid/dashboard" replace />} />
    <Route path="/ppdb/berkas" element={<Navigate to="/calon-murid/upload-berkas" replace />} />
    <Route path="/ppdb/status" element={<Navigate to="/calon-murid/status" replace />} />
    <Route path="/ppdb/bukti" element={<Navigate to="/calon-murid/status" replace />} />
    <Route path="/calon-siswa/dashboard" element={<Navigate to="/calon-murid/dashboard" replace />} />
  </>
);

export const ppdbAdminRoutes = (
  <>
    <Route
      path="/admin/ppdb"
      element={
        <PermissionRoute permission="manage_ppdb">
          <AdminDaftarPendaftar />
        </PermissionRoute>
      }
    />
    <Route
      path="/admin/ppdb/:id"
      element={
        <PermissionRoute permission="manage_ppdb">
          <AdminDetailPendaftar />
        </PermissionRoute>
      }
    />
    <Route
      path="/admin/ppdb/:id/verifikasi"
      element={
        <PermissionRoute permission="manage_ppdb">
          <AdminVerifikasiPendaftar />
        </PermissionRoute>
      }
    />
  </>
);
