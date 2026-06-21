import { PermissionRoute } from '@/shared/components/ProtectedRoute';
import { ROUTE_PERMISSIONS } from '@/config/routePermissions.config';

export function withPermission(path, page) {
  const permission = ROUTE_PERMISSIONS[path];

  if (!permission) {
    return page;
  }

  return <PermissionRoute permission={permission}>{page}</PermissionRoute>;
}
