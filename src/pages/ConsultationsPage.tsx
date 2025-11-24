import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchConsultations, deleteConsultationThunk } from '../features/consultations/consultationsSlice';
import { PERMISSIONS } from '../config/permissions';
import { usePermissions } from '../hooks/usePermissions';
import LoadingSpinner from '../components/LoadingSpinner';
import SuccessToast from '../components/SuccessToast';
import CreateConsultationModal from '../components/CreateConsultationModal';
import ConsultationDetailsModal from '../components/ConsultationDetailsModal';

const ConsultationsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { hasPermission } = usePermissions();
  const { consultations, loading, pagination } = useAppSelector((state) => state.consultations);
  const { user } = useAppSelector((state) => state.auth);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Filters
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [priority, setPriority] = useState('');
  const [typeMedical, setTypeMedical] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const canCreate = hasPermission(PERMISSIONS.CONSULTATION_CREATE);
  const canDelete = hasPermission(PERMISSIONS.CONSULTATION_DELETE);
  const isPatient = user?.role === 'patient';

  useEffect(() => {
    loadConsultations();
  }, [page, priority, typeMedical, dateFrom, dateTo, sortOrder]);

  const loadConsultations = () => {
    if (!user) return;

    const params = {
      page,
      limit: 10,
      priority: priority || undefined,
      typeMedical: typeMedical || undefined,
      from: dateFrom || undefined,
      to: dateTo || undefined,
      sort: 'resultDate',
      order: sortOrder,
    };

    dispatch(fetchConsultations({ 
      role: user.role || 'patient', 
      userId: user.id || '', 
      params 
    }));
  };

  const handleSearch = () => {
    if (searchQuery.trim().length < 2) {
      loadConsultations();
      return;
    }

    if (!user) return;

    const params = {
      q: searchQuery,
      page,
      limit: 10,
      priority: priority || undefined,
      typeMedical: typeMedical || undefined,
      from: dateFrom || undefined,
      to: dateTo || undefined,
      sort: 'resultDate',
      order: sortOrder,
    };

    dispatch(fetchConsultations({ 
      role: user.role || 'patient', 
      userId: user.id || '', 
      params 
    }));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this consultation?')) return;
    
    await dispatch(deleteConsultationThunk(id));
    setSuccess('Consultation deleted successfully!');
    loadConsultations();
  };

  const handleCreateSuccess = () => {
    setSuccess('Consultation created successfully!');
    setIsCreateModalOpen(false);
    loadConsultations();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-red-100 text-red-800';
      case 'Traitement nécessaire':
        return 'bg-orange-100 text-orange-800';
      case 'À suivre':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  if (loading && consultations.length === 0) {
    return <LoadingSpinner size="large" fullScreen message="Loading consultations..." />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isPatient ? 'My Consultations' : 'Medical Consultations'}
        </h1>
        {canCreate && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            + New Consultation
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          {!isPatient && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Patient name, type..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Search
                </button>
              </div>
            </div>
          )}

          {/* Priority Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Priorities</option>
              <option value="Normal">Normal</option>
              <option value="À suivre">À suivre</option>
              <option value="Traitement nécessaire">Traitement nécessaire</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          {/* Date From */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Sort and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Sort by Date:</label>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
            >
              {sortOrder === 'asc' ? '↑ Oldest First' : '↓ Newest First'}
            </button>
          </div>
          
          {(priority || typeMedical || dateFrom || dateTo || searchQuery) && (
            <button
              onClick={() => {
                setPriority('');
                setTypeMedical('');
                setDateFrom('');
                setDateTo('');
                setSearchQuery('');
                setPage(1);
              }}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Consultations Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading && (
          <div className="p-4">
            <LoadingSpinner size="medium" message="Loading..." />
          </div>
        )}
        
        {!loading && consultations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No consultations found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  {!isPatient && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Options</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {consultations.map((consultation: any) => (
                  <tr key={consultation._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(consultation.resultDate).toLocaleDateString()}
                    </td>
                    {!isPatient && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {consultation.patientId.name}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {consultation.medecinId.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {consultation.typeMedical}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(consultation.priority)}`}>
                        {consultation.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {consultation.actions.length} action(s)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => setSelectedConsultation(consultation._id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                      {canDelete && (
                        <button
                          onClick={() => handleDelete(consultation._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing page {pagination.page} of {pagination.totalPages} ({pagination.totalRecords} total)
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === pagination.totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {isCreateModalOpen && (
        <CreateConsultationModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {selectedConsultation && (
        <ConsultationDetailsModal
          consultationId={selectedConsultation}
          isOpen={!!selectedConsultation}
          onClose={() => setSelectedConsultation(null)}
          onUpdate={loadConsultations}
        />
      )}

      {success && <SuccessToast message={success} onClose={() => setSuccess(null)} />}
    </div>
  );
};

export default ConsultationsPage;
