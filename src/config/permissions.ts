// Permission constants
export const PERMISSIONS = {
  // System Management
  MANAGE_SYSTEM: 'manage_system',
  
  // User Management
  MANAGE_USERS_VIEW: 'manage_users_view',
  MANAGE_USERS_CREATE: 'manage_users_create',
  MANAGE_USERS_UPDATE: 'manage_users_update',
  MANAGE_USERS_DELETE: 'manage_users_delete',
  MANAGE_USERS_SUSPEND: 'manage_users_suspend',
  
  // Patient Management
  PATIENT_VIEW: 'patient_view',
  PATIENT_CREATE: 'patient_create',
  PATIENT_UPDATE: 'patient_update',
  PATIENT_DELETE: 'patient_delete',
  
  // Appointments
  APPOINTMENT_VIEW_OWN: 'appointment_view_own',
  APPOINTMENT_VIEW_ALL: 'appointment_view_all',
  APPOINTMENT_CREATE: 'appointment_create',
  APPOINTMENT_UPDATE: 'appointment_update',
  APPOINTMENT_DELETE: 'appointment_delete',
  
  // Consultations
  CONSULTATION_CREATE: 'consultation_create',
  CONSULTATION_VIEW: 'consultation_view',
  
  // Documents
  DOCUMENT_UPLOAD: 'document_upload',
  DOCUMENT_VIEW: 'document_view',
  
  // Lab
  LAB_ORDER_CREATE: 'lab_order_create',
  LAB_RESULT_VIEW: 'lab_result_view',
  
  // Prescriptions
  PRESCRIPTION_CREATE: 'prescription_create',
  PRESCRIPTION_VIEW: 'prescription_view',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];