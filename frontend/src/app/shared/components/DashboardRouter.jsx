import { Navigate } from 'react-router-dom';
import { isAuthenticated, getStoredUser, getRedirectPathForRole } from '@app/shared/services/auth.service';

export default function DashboardRouter() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const user = getStoredUser();
  return <Navigate to={getRedirectPathForRole(user?.role)} replace />;
}
