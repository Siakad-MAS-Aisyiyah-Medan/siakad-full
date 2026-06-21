import { lazy } from 'react';

export const LoginPage = lazy(() => import('@/roles/public/login'));
export const DashboardRouter = lazy(() => import('@/shared/components/DashboardRouter'));
