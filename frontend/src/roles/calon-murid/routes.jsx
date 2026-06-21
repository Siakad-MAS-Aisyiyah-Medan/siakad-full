import { Route } from 'react-router-dom';
import { withPermission } from '@/routes/permissionRoute';
import { ppdbCalonRoutes } from '@/shared/ppdb/routes';
import { Pengaturan } from './pages';

export const calonMuridRoutes = (
  <>
    {ppdbCalonRoutes}
    <Route path="/calon-murid/pengaturan" element={withPermission('/calon-murid/pengaturan', <Pengaturan />)} />
  </>
);
