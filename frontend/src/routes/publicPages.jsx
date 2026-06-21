import { lazy } from 'react';

export const LandingPage = lazy(() => import('@/roles/public/landing-page'));
export const PublicNewsList = lazy(() => import('@/roles/public/berita'));
export const PublicNewsDetail = lazy(() => import('@/roles/public/berita-detail'));
