import { Route } from 'react-router-dom';
import { PermissionRoute } from '@app/shared/components/ProtectedRoute';
import AdminEkskul from './index';

export const ekstrakurikulerRoutes = (
  <Route path="/admin/ekskul" element={<PermissionRoute permission="manage_ekskul"><AdminEkskul /></PermissionRoute>} />
);
