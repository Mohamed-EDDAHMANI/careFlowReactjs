// src/features/auth/authTypes.ts

// Frontend role union
export type Role = "admin" | "doctor" | "nurse" | "patient";

// Permissions object from backend
export interface Permissions {
  manage_system?: boolean;
  manage_users_view?: boolean;
  manage_users_create?: boolean;
  manage_users_update?: boolean;
  manage_users_delete?: boolean;
  manage_users_suspend?: boolean;
  patient_view?: boolean;
  patient_create?: boolean;
  patient_update?: boolean;
  patient_delete?: boolean;
  patient_search?: boolean;
  patient_view_history?: boolean;
  appointment_view_own?: boolean;
  appointment_view_all?: boolean;
  appointment_create?: boolean;
  appointment_update?: boolean;
  appointment_cancel?: boolean;
  consultation_create?: boolean;
  consultation_view?: boolean;
  consultation_update?: boolean;
  document_upload?: boolean;
  document_view?: boolean;
  document_delete?: boolean;
  document_download?: boolean;
  lab_order_create?: boolean;
  lab_order_view?: boolean;
  lab_result_upload?: boolean;
  lab_result_validate?: boolean;
  lab_result_view?: boolean;
  prescription_create?: boolean;
  prescription_sign?: boolean;
  prescription_view?: boolean;
  prescription_assign_pharmacy?: boolean;
  pharmacy_view_assigned?: boolean;
  pharmacy_dispense_prescription?: boolean;
  pharmacy_manage_partners?: boolean;
}

// Frontend user shape (what the app uses)
export interface User {
  id: string;
  name: string;
  email: string;
  role?: Role;
  status?: string;
  permissions?: Permissions;
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
  permissions?: Permissions;
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
    permissions: b.permissions ?? {},
  };
}
