import { Route } from 'react-router-dom';
import LoginPage from '@app/pages/public/login';
import LoginCalonMurid from '@app/pages/calon-murid/login';
import DashboardRouter from '@app/shared/components/DashboardRouter';

export const authRoutes = (
  <>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/login-calon-murid" element={<LoginCalonMurid />} />
    <Route path="/dashboard" element={<DashboardRouter />} />
  </>
);
