import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  fetchConsultationById,
  addActionThunk,
  updateConsultationThunk,
  clearSelectedConsultation,
} from '../features/consultations/consultationsSlice';
import { PERMISSIONS } from '../config/permissions';
import { usePermissions } from '../hooks/usePermissions';
import LoadingSpinner from './LoadingSpinner';
import type { AddActionData } from '../features/consultations/consultationTypes';
import { getDocumentUrl } from '../features/consultations/consultationService';

interface ConsultationDetailsModalProps {
  consultationId: string;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const ConsultationDetailsModal: React.FC<ConsultationDetailsModalProps> = ({
  consultationId,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const dispatch = useAppDispatch();
  const { hasPermission } = usePermissions();
  const { selectedConsultation, loading } = useAppSelector((state) => state.consultations);

  const [isAddingAction, setIsAddingAction] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewingDocument, setViewingDocument] = useState<any | null>(null);
  const [actionForm, setActionForm] = useState<AddActionData>({
    type: 'treatment',
    description: '',
  });
  const [actionDocument, setActionDocument] = useState<File | null>(null);
  
  const [editForm, setEditForm] = useState<{
    priority: 'Normal' | 'À suivre' | 'Traitement nécessaire' | 'Urgent';
    typeMedical: string;
    description: string;
  }>({
    priority: 'Normal',
    typeMedical: '',
    description: '',
  });

  const canUpdate = hasPermission(PERMISSIONS.CONSULTATION_UPDATE);

  useEffect(() => {
    if (isOpen && consultationId) {
      dispatch(fetchConsultationById(consultationId));
    }

    return () => {
      dispatch(clearSelectedConsultation());
    };
  }, [consultationId, isOpen, dispatch]);

  useEffect(() => {
    if (selectedConsultation) {
      setEditForm({
        priority: selectedConsultation.priority,
        typeMedical: selectedConsultation.typeMedical,
        description: selectedConsultation.description || '',
      });
    }
  }, [selectedConsultation]);

  const handleAddAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await dispatch(
        addActionThunk({
          id: consultationId,
          data: {
            ...actionForm,
            document: actionDocument || undefined,
          },
        })
      ).unwrap();

      setIsAddingAction(false);
      setActionForm({ type: 'treatment', description: '' });
      setActionDocument(null);
      onUpdate();
    } catch (error: any) {
      const errorMessage = error?.message || error || 'Failed to add action';
      setError(errorMessage);
      console.error('Failed to add action:', error);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await dispatch(
        updateConsultationThunk({
          id: consultationId,
          data: editForm,
        })
      ).unwrap();

      setIsEditing(false);
      onUpdate();
    } catch (error: any) {
      const errorMessage = error?.message || error || 'Failed to update consultation';
      setError(errorMessage);
      console.error('Failed to update consultation:', error);
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'treatment':
        return '💊';
      case 'scanner':
        return '🔬';
      case 'analysis':
        return '📋';
      default:
        return '📄';
    }
  };

  const handleViewDocument = async (doc: any) => {
    try {
      const response = await getDocumentUrl(consultationId, doc._id);
      setViewingDocument({
        ...doc,
        url: response.data.url,
      });
    } catch (error) {
      console.error('Failed to get document URL:', error);
      setError('Failed to load document');
    }
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Consultation Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start justify-between">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {loading && !selectedConsultation ? (
            <LoadingSpinner size="large" message="Loading consultation..." />
          ) : selectedConsultation ? (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Patient</label>
                    <p className="text-gray-900">{selectedConsultation.patientId.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Doctor</label>
                    <p className="text-gray-900">{selectedConsultation.medecinId.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date</label>
                    <p className="text-gray-900">
                      {new Date(selectedConsultation.resultDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Priority</label>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                        selectedConsultation.priority
                      )}`}
                    >
                      {selectedConsultation.priority}
                    </span>
                  </div>
                </div>
              </div>

              {/* Editable Info */}
              {isEditing && canUpdate ? (
                <form onSubmit={handleUpdate} className="space-y-4 bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900">Edit Consultation</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Medical Type</label>
                    <input
                      type="text"
                      value={editForm.typeMedical}
                      onChange={(e) => setEditForm({ ...editForm, typeMedical: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={editForm.priority}
                      onChange={(e) => setEditForm({ ...editForm, priority: e.target.value as 'Normal' | 'À suivre' | 'Traitement nécessaire' | 'Urgent' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="Normal">Normal</option>
                      <option value="À suivre">À suivre</option>
                      <option value="Traitement nécessaire">Traitement nécessaire</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-900">Medical Information</h3>
                    {canUpdate && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Type</label>
                      <p className="text-gray-900">{selectedConsultation.typeMedical}</p>
                    </div>
                    {selectedConsultation.description && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Description</label>
                        <p className="text-gray-900">{selectedConsultation.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Documents */}
              {selectedConsultation.document && selectedConsultation.document.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Documents</h3>
                  <div className="space-y-2">
                    {selectedConsultation.document.map((doc: any) => (
                      <div key={doc._id} className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{doc.originalName}</p>
                          <p className="text-xs text-gray-500">
                            {doc.category} • {(doc.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewDocument(doc)}
                            className="px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-900">Actions History</h3>
                  {canUpdate && !isAddingAction && (
                    <button
                      onClick={() => setIsAddingAction(true)}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                    >
                      + Add Action
                    </button>
                  )}
                </div>

                {/* Add Action Form */}
                {isAddingAction && (
                  <form onSubmit={handleAddAction} className="mb-4 p-4 bg-green-50 rounded-lg space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Action Type</label>
                      <select
                        value={actionForm.type}
                        onChange={(e) => setActionForm({ ...actionForm, type: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="treatment">Treatment</option>
                        <option value="scanner">Scanner</option>
                        <option value="analysis">Analysis</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={actionForm.description}
                        onChange={(e) => setActionForm({ ...actionForm, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        rows={3}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Document (Optional)</label>
                      <input
                        type="file"
                        onChange={(e) => setActionDocument(e.target.files?.[0] || null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                      >
                        Add Action
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingAction(false);
                          setActionForm({ type: 'treatment', description: '' });
                          setActionDocument(null);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Actions List */}
                <div className="space-y-3">
                  {selectedConsultation.actions.length === 0 ? (
                    <p className="text-gray-500 text-sm">No actions recorded yet</p>
                  ) : (
                    selectedConsultation.actions.map((action: any) => (
                      <div key={action._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{getActionIcon(action.type)}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900 capitalize">{action.type}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(action.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-gray-700 text-sm">{action.description}</p>
                            {action.document && (
                              <div className="mt-2 p-2 bg-gray-50 rounded flex items-center justify-between">
                                <p className="text-xs text-gray-600">{action.document.originalName}</p>
                                <button
                                  onClick={() => handleViewDocument(action.document)}
                                  className="text-xs text-white bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded"
                                >
                                  View
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Consultation not found</p>
          )}
        </div>
      </div>

      {/* Document Viewer Modal */}
      {viewingDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{viewingDocument.originalName}</h3>
                <p className="text-sm text-gray-500">
                  {viewingDocument.category} • {(viewingDocument.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <div className="flex gap-2">
                <a
                  href={viewingDocument.url}
                  download={viewingDocument.originalName}
                  className="px-3 py-1 text-sm text-white bg-green-600 hover:bg-green-700 rounded"
                >
                  Download
                </a>
                <button
                  onClick={() => setViewingDocument(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto bg-gray-100 p-4">
              {viewingDocument.mimeType?.startsWith('image/') ? (
                <img
                  src={viewingDocument.url}
                  alt={viewingDocument.originalName}
                  className="max-w-full h-auto mx-auto"
                />
              ) : viewingDocument.mimeType === 'application/pdf' ? (
                <iframe
                  src={viewingDocument.url}
                  className="w-full h-full min-h-[600px]"
                  title={viewingDocument.originalName}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">Preview not available for this file type</p>
                  <a
                    href={viewingDocument.url}
                    download={viewingDocument.originalName}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Download to View
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationDetailsModal;
