import { Route } from 'react-router-dom';
import { PermissionRoute } from '@app/shared/components/ProtectedRoute';
import AdminPengumuman from './index';

export const pengumumanRoutes = (
  <Route path="/admin/pengumuman" element={<PermissionRoute permission="manage_pengumuman"><AdminPengumuman /></PermissionRoute>} />
);
