import { PERMISSIONS } from './permissions';

export interface NavigationItem {
  id: string;
  label: string;
  component: string;
  icon?: string;
  permissions: string[];
}

export const navigationConfig: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    component: 'dashboard',
    icon: '🏠',
    permissions: [],
  },
  {
    id: 'patients',
    label: 'Patients',
    component: 'patients',
    icon: '👥',
    permissions: [PERMISSIONS.PATIENT_VIEW],
  },
  {
    id: 'appointments',
    label: 'Appointments',
    component: 'appointments',
    icon: '📅',
    permissions: [PERMISSIONS.APPOINTMENT_VIEW_OWN, PERMISSIONS.APPOINTMENT_VIEW_ALL],
  },
  {
    id: 'consultations',
    label: 'Consultations',
    component: 'consultations',
    icon: '🩺',
    permissions: [PERMISSIONS.CONSULTATION_VIEW],
  },
  {
    id: 'lab',
    label: 'Laboratory',
    component: 'lab',
    icon: '🧪',
    permissions: [PERMISSIONS.LAB_ORDER_CREATE, PERMISSIONS.LAB_RESULT_VIEW],
  },
  {
    id: 'prescriptions',
    label: 'Prescriptions',
    component: 'prescriptions',
    icon: '💊',
    permissions: [PERMISSIONS.PRESCRIPTION_VIEW],
  },
  {
    id: 'users',
    label: 'User Management',
    component: 'users',
    icon: '👤',
    permissions: [PERMISSIONS.MANAGE_USERS_VIEW],
  },
  {
    id: 'admin',
    label: 'Administration',
    component: 'admin',
    icon: '⚙️',
    permissions: [PERMISSIONS.MANAGE_SYSTEM],
  },
];