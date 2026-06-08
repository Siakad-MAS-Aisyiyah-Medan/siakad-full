import { Navigate, Route } from 'react-router-dom';
import {
  CALON_MURID_LOGIN,
  PermissionRoute,
  RoleRoute,
} from '@app/shared/components/ProtectedRoute';

const calonGuard = { loginPath: CALON_MURID_LOGIN };
import InformasiPendaftaran from '@app/pages/calon-murid/informasi-pendaftaran';
import RegisterCalonMurid from '@app/pages/calon-murid/register';
import DashboardCalonMurid from '@app/pages/calon-murid/dashboard';
import FormulirPendaftaran from '@app/pages/calon-murid/formulir-pendaftaran';
import FormulirPpdbWizard from '@app/pages/calon-murid/formulir-ppdb-wizard';
import UploadBerkasCalonMurid from '@app/pages/calon-murid/upload-berkas';
import PengumumanCalonMurid from '@app/pages/calon-murid/pengumuman';
import StatusPendaftaran from '@app/pages/calon-murid/status-pendaftaran';
import BuktiPendaftaran from '@app/pages/calon-murid/bukti-pendaftaran';
import AdminDaftarPendaftar from '@app/pages/admin/admin-daftar-pendaftar';
import AdminDetailPendaftar from '@app/pages/admin/admin-detail-pendaftar';
import AdminVerifikasiPendaftar from '@app/pages/admin/verifikasi-ppdb';

export const ppdbPublicRoutes = (
  <>
    <Route path="/ppdb/informasi" element={<InformasiPendaftaran />} />
    <Route path="/pendaftaran" element={<Navigate to="/ppdb/informasi" replace />} />
    <Route path="/register-calon-murid" element={<RegisterCalonMurid />} />
    {/* Legacy redirects */}
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
      path="/calon-murid/formulir"
      element={
        <RoleRoute allowedRoles={['calon_siswa']} {...calonGuard}>
          <FormulirPpdbWizard />
        </RoleRoute>
      }
    />
    <Route
      path="/calon-murid/formulir-legacy"
      element={
        <RoleRoute allowedRoles={['calon_siswa']} {...calonGuard}>
          <FormulirPendaftaran />
        </RoleRoute>
      }
    />
    <Route
      path="/calon-murid/upload-berkas"
      element={
        <RoleRoute allowedRoles={['calon_siswa']} {...calonGuard}>
          <UploadBerkasCalonMurid />
        </RoleRoute>
      }
    />
    <Route
      path="/calon-murid/berkas"
      element={<Navigate to="/calon-murid/upload-berkas" replace />}
    />
    <Route
      path="/calon-murid/pengumuman"
      element={
        <RoleRoute allowedRoles={['calon_siswa']} {...calonGuard}>
          <PengumumanCalonMurid />
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
      path="/calon-murid/bukti"
      element={
        <RoleRoute allowedRoles={['calon_siswa']} {...calonGuard}>
          <BuktiPendaftaran />
        </RoleRoute>
      }
    />
    <Route path="/ppdb/dashboard" element={<Navigate to="/calon-murid/dashboard" replace />} />
    <Route path="/ppdb/berkas" element={<Navigate to="/calon-murid/upload-berkas" replace />} />
    <Route path="/ppdb/status" element={<Navigate to="/calon-murid/status" replace />} />
    <Route path="/ppdb/bukti" element={<Navigate to="/calon-murid/bukti" replace />} />
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
