import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { createConsultationThunk } from '../features/consultations/consultationsSlice';
import { fetchPatients, fetchDoctors } from '../features/user/usersSlice';
import { fetchAppointments } from '../features/appointment/appointmentSlice';
import LoadingSpinner from './LoadingSpinner';

interface CreateConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateConsultationModal: React.FC<CreateConsultationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { patients, doctors } = useAppSelector((state) => state.users);
  const { appointments } = useAppSelector((state) => state.appointments);
  const { loading } = useAppSelector((state) => state.consultations);

  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    appointmentId: '',
    priority: 'Normal' as 'Normal' | 'À suivre' | 'Traitement nécessaire' | 'Urgent',
    typeMedical: '',
    description: '',
    resultDate: new Date().toISOString().split('T')[0],
  });

  const [documents, setDocuments] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filteredAppointments, setFilteredAppointments] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (user?.role !== 'patient') {
        dispatch(fetchPatients());
      }
      // Fetch doctors for admin
      if (user?.role === 'admin') {
        dispatch(fetchDoctors());
      }
      // Fetch appointments
      dispatch(fetchAppointments({ 
        params: { 
          status: 'scheduled',
          limit: 100 
        },
        role: user?.role || 'patient',
        userId: user?.id || ''
      }));
      
      // Auto-fill doctor ID if user is doctor
      if (user?.role === 'doctor' && user?.id) {
        setFormData(prev => ({ ...prev, doctorId: user.id }));
      }
    }
  }, [isOpen, dispatch, user]);

  // Filter appointments based on selected patient
  useEffect(() => {
    if (formData.patientId) {
      const filtered = appointments.filter((apt: any) => 
        apt.patientId._id === formData.patientId || apt.patientId === formData.patientId
      );
      setFilteredAppointments(filtered);
    } else {
      setFilteredAppointments(appointments);
    }
  }, [formData.patientId, appointments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.patientId || !formData.typeMedical) {
      setError('Patient and Medical Type are required');
      return;
    }

    if (!formData.appointmentId) {
      setError('Please select an appointment');
      return;
    }

    // Validate doctor selection
    if (!formData.doctorId) {
      setError('Doctor is required');
      return;
    }

    try {
      await dispatch(createConsultationThunk({
        ...formData,
        documents: documents.length > 0 ? documents : undefined,
      })).unwrap();

      onSuccess();
    } catch (err: any) {
      // Handle different error formats
      const errorMessage = err?.message || err?.data?.message || err?.response?.data?.message || 'Failed to create consultation';
      setError(errorMessage);
      console.error('Create consultation error:', err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length + documents.length > 10) {
        setError('Maximum 10 files allowed');
        return;
      }
      setDocuments([...documents, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Create New Consultation</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Patient Selection */}
            {user?.role !== 'patient' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a patient</option>
                  {patients.map((patient: any) => (
                    <option key={patient._id} value={patient._id}>
                      {patient.name} - {patient.email}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Doctor Selection - Only for Admin */}
            {user?.role === 'admin' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Doctor <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.doctorId}
                  onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a doctor</option>
                  {doctors.map((doctor: any) => (
                    <option key={doctor._id} value={doctor._id}>
                      Dr. {doctor.name} - {doctor.email}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Appointment Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Appointment <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.appointmentId}
                onChange={(e) => setFormData({ ...formData, appointmentId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select an appointment</option>
                {filteredAppointments.map((appointment: any) => (
                  <option key={appointment._id} value={appointment._id}>
                    {new Date(appointment.date).toLocaleDateString()} - {appointment.type} 
                    {appointment.patientId?.name && ` - ${appointment.patientId.name}`}
                    {appointment.doctorId?.name && ` (Dr. ${appointment.doctorId.name})`}
                  </option>
                ))}
              </select>
              {filteredAppointments.length === 0 && formData.patientId && (
                <p className="text-sm text-orange-600 mt-1">
                  No scheduled appointments found for this patient
                </p>
              )}
            </div>

            {/* Medical Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medical Type <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.typeMedical}
                onChange={(e) => setFormData({ ...formData, typeMedical: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., General Checkup, Follow-up"
                required
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Normal">Normal</option>
                <option value="À suivre">À suivre</option>
                <option value="Traitement nécessaire">Traitement nécessaire</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            {/* Result Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={formData.resultDate}
                onChange={(e) => setFormData({ ...formData, resultDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                placeholder="Consultation notes..."
              />
            </div>

            {/* Documents Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Documents (Max 10 files, 20MB each)
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                multiple
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                accept="image/*,.pdf"
              />
              {documents.length > 0 && (
                <div className="mt-2 space-y-1">
                  {documents.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {loading && <LoadingSpinner size="small" />}
                {loading ? 'Creating...' : 'Create Consultation'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateConsultationModal;
