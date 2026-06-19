import { Navigate, Route } from 'react-router-dom';
import LandingPage from '@app/pages/public/landing-page';
import PublicNewsList from '@app/pages/public/berita';
import PublicNewsDetail from '@app/pages/public/berita-detail';
import { ppdbPublicRoutes } from '@app/shared/ppdb/routes';

export const publicRoutes = (
  <>
    <Route path="/" element={<Navigate to="/home" replace />} />
    <Route path="/home" element={<LandingPage />} />
    <Route path="/profil-sekolah" element={<LandingPage />} />
    <Route path="/berita-prestasi/:id" element={<PublicNewsDetail />} />
    <Route path="/news/:id" element={<PublicNewsDetail />} />
    <Route path="/berita" element={<Navigate to="/pengumuman" replace />} />
    <Route path="/berita/:id" element={<PublicNewsDetail />} />
    <Route path="/pengumuman" element={<PublicNewsList />} />
    <Route path="/pengumuman/:id" element={<PublicNewsDetail />} />

    {ppdbPublicRoutes}
  </>
);
