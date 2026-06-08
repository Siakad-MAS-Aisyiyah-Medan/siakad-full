import { Navigate, Route } from 'react-router-dom';
import LandingPage from '@app/pages/public/landing-page';
import NewsDetailOld from '@app/pages/public/news-detail';
import PublicNewsList from '@app/pages/public/berita';
import PublicNewsDetail from '@app/pages/public/berita-detail';
import { ppdbPublicRoutes } from '@app/shared/ppdb/routes';

export const publicRoutes = (
  <>
    <Route path="/" element={<Navigate to="/home" replace />} />
    <Route path="/home" element={<LandingPage />} />
    <Route path="/profil-sekolah" element={<LandingPage />} />
    <Route path="/berita-prestasi/:id" element={<NewsDetailOld />} />
    <Route path="/news/:id" element={<NewsDetailOld />} />
    
    {/* Rute Baru untuk Fitur Berita / Pengumuman (Public) */}
    <Route path="/berita" element={<PublicNewsList />} />
    <Route path="/berita/:id" element={<PublicNewsDetail />} />

    {ppdbPublicRoutes}
  </>
);
