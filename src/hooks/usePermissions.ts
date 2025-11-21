import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import type { Permission } from '../config/permissions';

export const usePermissions = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  
  const hasPermission = (permission: Permission | string): boolean => {
    if (!user?.permissions) return false;
    return user.permissions[permission as keyof typeof user.permissions] ?? false;
  };

  const hasAnyPermission = (permissions: (Permission | string)[]): boolean => {
    if (permissions.length === 0) return true; // No permissions required
    return permissions.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissions: (Permission | string)[]): boolean => {
    if (permissions.length === 0) return true; // No permissions required
    return permissions.every(permission => hasPermission(permission));
  };

  return {
    permissions: user?.permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    user,
  };
};