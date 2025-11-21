# Permission-Based Access Control System

This system provides comprehensive permission-based access control for the React application.

## Components

### 1. PermissionRoute
Protects entire routes based on permissions:

```tsx
import PermissionRoute from '../components/PermissionBasedRoute';
import { PERMISSIONS } from '../config/permissions';

// Single permission
<PermissionRoute permissions={PERMISSIONS.PATIENT_VIEW}>
  <PatientsPage />
</PermissionRoute>

// Multiple permissions (any)
<PermissionRoute permissions={[PERMISSIONS.APPOINTMENT_VIEW_OWN, PERMISSIONS.APPOINTMENT_VIEW_ALL]}>
  <AppointmentsPage />
</PermissionRoute>

// Multiple permissions (all required)
<PermissionRoute permissions={[PERMISSIONS.MANAGE_SYSTEM, PERMISSIONS.MANAGE_USERS_VIEW]} requireAll>
  <AdminPage />
</PermissionRoute>
```

### 2. PermissionGuard
Conditionally renders UI elements:

```tsx
import PermissionGuard from '../components/PermissionGuard';
import { PERMISSIONS } from '../config/permissions';

<PermissionGuard permissions={PERMISSIONS.PATIENT_CREATE}>
  <button>Add Patient</button>
</PermissionGuard>

<PermissionGuard 
  permissions={[PERMISSIONS.PATIENT_UPDATE, PERMISSIONS.PATIENT_DELETE]}
  fallback={<span>No access</span>}
>
  <div>Admin actions</div>
</PermissionGuard>
```

### 3. usePermissions Hook
Direct permission checking in components:

```tsx
import { usePermissions } from '../hooks/usePermissions';
import { PERMISSIONS } from '../config/permissions';

const MyComponent = () => {
  const { hasPermission, hasAnyPermission, user } = usePermissions();

  if (hasPermission(PERMISSIONS.PATIENT_CREATE)) {
    // Show create button
  }

  if (hasAnyPermission([PERMISSIONS.APPOINTMENT_VIEW_OWN, PERMISSIONS.APPOINTMENT_VIEW_ALL])) {
    // Show appointments section
  }

  return <div>Content based on permissions</div>;
};
```

## Configuration

### Adding New Permissions
1. Add to `src/config/permissions.ts`:
```tsx
export const PERMISSIONS = {
  // ... existing permissions
  NEW_FEATURE_ACCESS: 'new_feature_access',
} as const;
```

2. Add to navigation config in `src/config/navigation.ts`:
```tsx
{
  id: 'new-feature',
  label: 'New Feature',
  path: '/new-feature',
  icon: '🆕',
  permissions: [PERMISSIONS.NEW_FEATURE_ACCESS],
}
```

3. Create protected route:
```tsx
{
  path: "new-feature",
  element: (
    <PermissionRoute permissions={PERMISSIONS.NEW_FEATURE_ACCESS}>
      <NewFeaturePage />
    </PermissionRoute>
  ),
}
```

## Backend Integration

The system expects the login API to return user data in this format:

```json
{
  "user": {
    "id": "123",
    "name": "John Doe",
    "role": "doctor",
    "permissions": {
      "patient_view": true,
      "patient_create": true,
      "appointment_view_all": true,
      // ... other permissions
    }
  },
  "accessToken": "jwt_token_here"
}
```

## Features

✅ **Dynamic Sidebar**: Only shows menu items user has access to
✅ **Route Protection**: Blocks direct URL access to unauthorized pages  
✅ **Conditional UI**: Hide/show buttons and actions based on permissions
✅ **Scalable**: Easy to add new permissions and features
✅ **Type Safe**: Full TypeScript support with permission constants
✅ **Flexible**: Supports single permissions, multiple permissions (any/all)
✅ **Reusable**: Components can be used throughout the application