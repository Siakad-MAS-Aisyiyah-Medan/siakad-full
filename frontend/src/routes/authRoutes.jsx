import { Route } from 'react-router-dom';
import { DashboardRouter, LoginPage } from './authPages';

export const authRoutes = (
  <>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/login-calon-murid" element={<LoginPage />} />
    <Route path="/dashboard" element={<DashboardRouter />} />
  </>
);
