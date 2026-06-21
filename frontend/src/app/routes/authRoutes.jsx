import { Route } from 'react-router-dom';
import LoginPage from '@app/pages/public/login';
import DashboardRouter from '@app/shared/components/DashboardRouter';

export const authRoutes = (
  <>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/login-calon-murid" element={<LoginPage />} />
    <Route path="/dashboard" element={<DashboardRouter />} />
  </>
);
