import { Routes } from 'react-router-dom';
import { publicRoutes } from './publicRoutes';
import { authRoutes } from './authRoutes';
import { roleRoutes } from './roleRoutes';

export default function AppRoutes() {
  return (
    <Routes>
      {publicRoutes}
      {authRoutes}
      {roleRoutes}
    </Routes>
  );
}
