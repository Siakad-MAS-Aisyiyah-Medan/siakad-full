import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';
import ForbiddenPage from '@/shared/components/ForbiddenPage';
import NotFoundPage from '@/shared/components/NotFoundPage';
import { adminRoutes } from '@/roles/admin/routes';
import { kepalaSekolahRoutes } from '@/roles/kepala-sekolah/routes';
import { guruRoutes } from '@/roles/guru/routes';
import { muridRoutes } from '@/roles/murid/routes';
import { calonMuridRoutes } from '@/roles/calon-murid/routes';

export const roleRoutes = (
  <>
    {adminRoutes}
    {kepalaSekolahRoutes}
    {guruRoutes}
    {muridRoutes}
    {calonMuridRoutes}
    <Route path="/forbidden" element={<ProtectedRoute><ForbiddenPage /></ProtectedRoute>} />
    <Route path="*" element={<NotFoundPage />} />
  </>
);
