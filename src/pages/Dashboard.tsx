import React from 'react';
import { usePermissions } from '../hooks/usePermissions';
import { PERMISSIONS } from '../config/permissions';
import { useDashboard } from '../contexts/DashboardContext';
import PermissionGuard from '../components/PermissionGuard';
import UsersPage from './UsersPage';
import AppointmentsPage from './AppointmentsPage';
import ConsultationsPage from './ConsultationsPage';

const Dashboard: React.FC = () => {
  const { activeComponent } = useDashboard();

  const renderComponent = () => {
    switch(activeComponent) {
      case 'users':
        return (
          <PermissionGuard permissions={PERMISSIONS.MANAGE_USERS_VIEW}>
            <UsersPage />
          </PermissionGuard>
        );
      case 'patients':
        return (
          <PermissionGuard permissions={PERMISSIONS.PATIENT_VIEW}>
            <div className="p-6">Patients Component - Coming Soon</div>
          </PermissionGuard>
        );
      case 'appointments':
        return (
          <PermissionGuard permissions={[PERMISSIONS.APPOINTMENT_VIEW_OWN, PERMISSIONS.APPOINTMENT_VIEW_ALL]}>
            <AppointmentsPage />
          </PermissionGuard>
        );
      case 'consultations':
        return (
          <PermissionGuard permissions={PERMISSIONS.CONSULTATION_VIEW}>
            <ConsultationsPage />
          </PermissionGuard>
        );
      case 'lab':
        return (
          <PermissionGuard permissions={[PERMISSIONS.LAB_ORDER_CREATE, PERMISSIONS.LAB_RESULT_VIEW]}>
            <div className="p-6">Laboratory Component - Coming Soon</div>
          </PermissionGuard>
        );
      case 'prescriptions':
        return (
          <PermissionGuard permissions={PERMISSIONS.PRESCRIPTION_VIEW}>
            <div className="p-6">Prescriptions Component - Coming Soon</div>
          </PermissionGuard>
        );
      case 'admin':
        return (
          <PermissionGuard permissions={PERMISSIONS.MANAGE_SYSTEM}>
            <div className="p-6">Administration Component - Coming Soon</div>
          </PermissionGuard>
        );
      default:
        return <DashboardHome />;
    }
  };

  if (activeComponent !== 'dashboard') {
    return renderComponent();
  }

  return <DashboardHome />;
};

const DashboardHome: React.FC = () => {
  const { hasPermission, user } = usePermissions();
  const { setActiveComponent } = useDashboard();

  const widgets = [
    {
      title: 'Patients',
      count: '1,234',
      icon: '👥',
      component: 'patients',
      permission: PERMISSIONS.PATIENT_VIEW,
    },
    {
      title: 'Appointments',
      count: '56',
      icon: '📅',
      component: 'appointments',
      permission: PERMISSIONS.APPOINTMENT_VIEW_OWN,
    },
    {
      title: 'Lab Results',
      count: '23',
      icon: '🧪',
      component: 'lab',
      permission: PERMISSIONS.LAB_RESULT_VIEW,
    },
    {
      title: 'Prescriptions',
      count: '89',
      icon: '💊',
      component: 'prescriptions',
      permission: PERMISSIONS.PRESCRIPTION_VIEW,
    },
  ];

  const visibleWidgets = widgets.filter(widget => hasPermission(widget.permission));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-8 py-10">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-light tracking-tight text-gray-900 mb-2">
            Dashboard
          </h1>
          <div className="flex items-center gap-3 text-base">
            <p className="text-gray-500">Welcome back, <span className="font-medium text-gray-700">{user?.name}</span></p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {visibleWidgets.map((widget) => (
            <button
              key={widget.title}
              onClick={() => setActiveComponent(widget.component)}
              className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-sm transition-all duration-200 text-left"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-50 text-2xl group-hover:bg-gray-100 transition-colors">
                  {widget.icon}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-4xl font-light tracking-tight text-gray-900">{widget.count}</p>
                <p className="text-base font-medium text-gray-500">{widget.title}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <h2 className="text-xl font-medium text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {hasPermission(PERMISSIONS.PATIENT_CREATE) && (
              <button
                onClick={() => setActiveComponent('patients')}
                className="group flex items-center gap-4 p-5 border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 text-left w-full"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-50 group-hover:bg-gray-100 transition-colors">
                  <span className="text-lg">➕</span>
                </div>
                <span className="text-base font-medium text-gray-700 group-hover:text-gray-900">Add Patient</span>
              </button>
            )}
            
            {hasPermission(PERMISSIONS.APPOINTMENT_CREATE) && (
              <button
                onClick={() => setActiveComponent('appointments')}
                className="group flex items-center gap-4 p-5 border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 text-left w-full"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-50 group-hover:bg-gray-100 transition-colors">
                  <span className="text-lg">📅</span>
                </div>
                <span className="text-base font-medium text-gray-700 group-hover:text-gray-900">Schedule Appointment</span>
              </button>
            )}
            
            {hasPermission(PERMISSIONS.LAB_ORDER_CREATE) && (
              <button
                onClick={() => setActiveComponent('lab')}
                className="group flex items-center gap-4 p-5 border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 text-left w-full"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-50 group-hover:bg-gray-100 transition-colors">
                  <span className="text-lg">🧪</span>
                </div>
                <span className="text-base font-medium text-gray-700 group-hover:text-gray-900">Order Lab Test</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;