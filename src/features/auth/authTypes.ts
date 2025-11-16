// src/features/auth/authTypes.ts

// Frontend role union
export type Role = "admin" | "doctor" | "nurse" | "patient";

// Frontend user shape (what the app uses)
export interface User {
  id: string;
  name: string;
  email: string;
  role?: Role;
  status?: string;
  permissions?: string[];
}

// Backend shapes (returned by API)
export interface BackendRole {
  _id: string;
  name: Role;
}

export interface BackendUser {
  _id: string;
  name: string;
  email: string;
  roleId?: BackendRole | string;
  status?: string;
  permissions?: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: BackendUser; // backend user shape
  accessToken: string;
}

export interface TokenRefreshResponse {
  accessToken: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
}

// Helper to map backend user -> frontend User
export function mapBackendUser(b: BackendUser): User {
  return {
    id: b._id,
    name: b.name,
    email: b.email,
    role:
      typeof b.roleId === "object" && b.roleId && (b.roleId as BackendRole).name
        ? (b.roleId as BackendRole).name
        : undefined,
    status: b.status,
    permissions: b.permissions ?? [],
  };
}
