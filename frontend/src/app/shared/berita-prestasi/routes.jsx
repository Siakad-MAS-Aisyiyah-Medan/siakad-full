import { Route, Navigate } from 'react-router-dom';
import { PermissionRoute } from '@app/shared/components/ProtectedRoute';
import AdminPrestasi from './index';

export const beritaPrestasiRoutes = (
  <>
    <Route path="/admin/prestasi" element={<PermissionRoute permission="manage_prestasi"><AdminPrestasi /></PermissionRoute>} />
    <Route path="/admin/berita" element={<Navigate to="/admin/prestasi" replace />} />
  </>
);
