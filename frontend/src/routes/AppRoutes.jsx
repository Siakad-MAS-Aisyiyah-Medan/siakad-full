import { Suspense } from 'react';
import { Routes } from 'react-router-dom';
import PageLoading from '@/shared/components/PageLoading';
import { publicRoutes } from './publicRoutes';
import { authRoutes } from './authRoutes';
import { roleRoutes } from './roleRoutes';

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        {publicRoutes}
        {authRoutes}
        {roleRoutes}
      </Routes>
    </Suspense>
  );
}
