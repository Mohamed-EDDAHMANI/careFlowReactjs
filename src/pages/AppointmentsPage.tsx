import React, { useState } from 'react';
import { usePermissions } from '../hooks/usePermissions';
import { PERMISSIONS } from '../config/permissions';
import { useFetchAppointments, useDeleteAppointment } from '../hooks/useAppointments';
import CreateAppointmentModal from '../components/CreateAppointmentModal';
import UpdateAppointmentModal from '../components/UpdateAppointmentModal';
import AppointmentDocumentsModal from '../components/AppointmentDocumentsModal';
import LoadingSpinner from '../components/LoadingSpinner';
import SuccessToast from '../components/SuccessToast';
import DoctorWeeklyCalendar from '../components/DoctorWeeklyCalendar';
import type { Appointment } from '../features/appointment/appointmentTypes';

const AppointmentsPage: React.FC = () => {
  const { hasPermission, user } = usePermissions();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDocumentsModalOpen, setIsDocumentsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    from: '',
    to: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // React Query hooks
  const params = {
    page: currentPage,
    limit: 5,
    sort: 'start' as const,
    order: sortOrder,
    ...(dateRange.from && { from: dateRange.from.replace(/-/g, '/') }),
    ...(dateRange.to && { to: dateRange.to.replace(/-/g, '/') }),
  };

  const { data, isLoading: loading, error } = useFetchAppointments(params, user?.id, user?.role);
  const deleteAppointmentMutation = useDeleteAppointment();

  const appointments = data?.data || [];
  const pagination = {
    page: data?.page || 1,
    limit: data?.limit || 5,
    total: data?.total || 0,
    totalPages: data?.totalPages || 1,
  };

  // Check if user can view appointments
  const canViewOwn = hasPermission(PERMISSIONS.APPOINTMENT_VIEW_OWN);
  const canViewAll = hasPermission(PERMISSIONS.APPOINTMENT_VIEW_ALL);
  const canView = canViewOwn || canViewAll;
  const canCreate = hasPermission(PERMISSIONS.APPOINTMENT_CREATE);
  const canUpdate = hasPermission(PERMISSIONS.APPOINTMENT_UPDATE);
  const canDelete = hasPermission(PERMISSIONS.APPOINTMENT_DELETE);

  const handleDeleteAppointment = async (appointment: Appointment) => {
    if (window.confirm(`Are you sure you want to delete the appointment for ${appointment.patientId.name}?`)) {
      try {
        await deleteAppointmentMutation.mutateAsync(appointment._id);
        setSuccess('Appointment deleted successfully!');
      } catch (error) {
        console.error('Error deleting appointment:', error);
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleDateRangeChange = (field: 'from' | 'to', value: string) => {
    setDateRange(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1); // Reset to first page when date range changes
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    // React Query will automatically refetch due to cache invalidation
  };

  const handleUpdateSuccess = () => {
    setIsUpdateModalOpen(false);
    setSelectedAppointment(null);
    setSuccess('Appointment updated successfully!');
    // React Query will automatically refetch due to cache invalidation
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsUpdateModalOpen(true);
  };

  const handleViewDocuments = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDocumentsModalOpen(true);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!canView) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          You don't have permission to view appointments.
        </div>
      </div>
    );
  }

  return (
    <>
      {success && <SuccessToast message={success} onClose={() => setSuccess(null)} />}
      <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
        
        <div className="flex gap-3">
          {user?.role === 'doctore' && (
            <DoctorWeeklyCalendar doctorId={user.id} />
          )}
          {canCreate && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Create New Appointment
            </button>
          )}
        </div>
      </div>

      {/* Date Range Filter & Sort */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => handleDateRangeChange('from', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => handleDateRangeChange('to', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="asc">Oldest First</option>
              <option value="desc">Newest First</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error instanceof Error ? error.message : 'An error occurred'}
        </div>
      )}

      {loading ? (
        <LoadingSpinner size="large" message="Loading appointments..." />
      ) : (
        <>
      {/* Appointments Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Patient</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Doctor</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Start Time</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">End Time</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Reason</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {!appointments || appointments.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                  No appointments found for the selected date range.
                </td>
              </tr>
            ) : (
              Array.isArray(appointments) && appointments.map((appointment: Appointment) => (
                <tr key={appointment._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{appointment.patientId.name}</div>
                      <div className="text-sm text-gray-500">{appointment.patientId.cin}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{appointment.doctorId.name}</div>
                      <div className="text-sm text-gray-500">{appointment.doctorId.cin}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {appointment.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDateTime(appointment.start)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDateTime(appointment.end)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="max-w-xs truncate" title={appointment.reason}>
                      {appointment.reason}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button 
                      onClick={() => handleViewDocuments(appointment)}
                      className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1"
                    >
                      📄 Docs ({appointment.document?.length || 0})
                    </button>
                    
                    {canUpdate && (
                      <button 
                        onClick={() => handleEditAppointment(appointment)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Edit
                      </button>
                    )}
                    
                    {canDelete && (
                      <button 
                        onClick={() => handleDeleteAppointment(appointment)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-700">
            Showing page {pagination.page} of {pagination.totalPages} (Total: {pagination.total} appointments)
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${
                currentPage === 1
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
              className={`px-4 py-2 rounded ${
                currentPage === pagination.totalPages
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
      </>
      )}

      {canCreate && (
        <CreateAppointmentModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {canUpdate && (
        <UpdateAppointmentModal
          isOpen={isUpdateModalOpen}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedAppointment(null);
          }}
          onSuccess={handleUpdateSuccess}
          appointment={selectedAppointment}
        />
      )}

      {selectedAppointment && (
        <AppointmentDocumentsModal
          isOpen={isDocumentsModalOpen}
          onClose={() => {
            setIsDocumentsModalOpen(false);
            setSelectedAppointment(null);
          }}
          appointmentId={selectedAppointment._id}
          documents={selectedAppointment.document || []}
        />
      )}
    </div>
    </>
  );
};

export default AppointmentsPage;
