import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { logout } from '../features/auth/authSlice';
import { usePermissions } from '../hooks/usePermissions';
import { DashboardProvider } from '../contexts/DashboardContext';
import Sidebar from './Sidebar';

const DashboardLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = usePermissions();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <DashboardProvider>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white shadow-sm border-b px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold text-gray-800">
                Welcome, {user?.name}
              </h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Role: {user?.role}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </DashboardProvider>
  );
};

export default DashboardLayout;