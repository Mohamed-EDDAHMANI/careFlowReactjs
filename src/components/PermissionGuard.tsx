import React from 'react';
import { usePermissions } from '../hooks/usePermissions';
import type { Permission } from '../config/permissions';

interface PermissionGuardProps {
  children: React.ReactNode;
  permissions: (Permission | string)[] | Permission | string;
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  permissions,
  requireAll = false,
  fallback = null,
}) => {
  const { hasAnyPermission, hasAllPermissions } = usePermissions();

  const permissionArray = Array.isArray(permissions) ? permissions : [permissions];
  
  if (permissionArray.length === 0) {
    return <>{children}</>;
  }

  const hasAccess = requireAll 
    ? hasAllPermissions(permissionArray)
    : hasAnyPermission(permissionArray);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

export default PermissionGuard;