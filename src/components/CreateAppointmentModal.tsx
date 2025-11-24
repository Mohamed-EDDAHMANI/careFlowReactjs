import React, { useState, useEffect } from 'react';
import { usePermissions } from '../hooks/usePermissions';
import { useCreateAppointment } from '../hooks/useAppointments';
import { useFetchPatients, useFetchDoctors } from '../hooks/useUsers';
import type { CreateAppointmentData } from '../features/appointment/appointmentTypes';
import LoadingSpinner from './LoadingSpinner';
import SuccessToast from './SuccessToast';

interface CreateAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateAppointmentModal: React.FC<CreateAppointmentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user } = usePermissions();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [patientId, setPatientId] = useState('');
  const [weekOffset, setWeekOffset] = useState(0);
  const [formData, setFormData] = useState<Partial<CreateAppointmentData>>({
    doctorId: '',
    type: 'consultation générale',
    reason: '',
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // React Query hooks
  const { data: patients = [] } = useFetchPatients();
  const { data: doctors = [] } = useFetchDoctors();
  const createAppointmentMutation = useCreateAppointment();
  const loading = createAppointmentMutation.isPending;

  // Set doctor ID automatically if user is a doctor
  useEffect(() => {
    if (user?.role === 'doctor' && user?.id) {
      setFormData(prev => ({ ...prev, doctorId: user.id }));
    }
  }, [user]);

  // Set patient ID automatically if user is a patient
  useEffect(() => {
    if (user?.role === 'patient' && user?.id) {
      setPatientId(user.id);
      // Clear doctorId for patients - backend will choose automatically
      setFormData(prev => ({ ...prev, doctorId: '' }));
    }
  }, [user]);

  const isDoctor = user?.role === 'doctor';
  const isPatient = user?.role === 'patient';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const totalFiles = selectedFiles.length + newFiles.length;
      
      if (totalFiles > 10) {
        setError(`Maximum 10 files allowed. You're trying to add ${totalFiles} files.`);
        return;
      }
      
      // Append new files to existing ones
      setSelectedFiles(prev => [...prev, ...newFiles]);
      setError(null);
    }
    // Reset input value to allow selecting the same files again
    e.target.value = '';
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (!patientId) {
        setError('Patient ID is required');
        return;
      }

      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Add appointment data
      if (!isPatient && formData.doctorId) {
        formDataToSend.append('doctorId', formData.doctorId);
      }
      if (formData.type) formDataToSend.append('type', formData.type);
      if (formData.reason) formDataToSend.append('reason', formData.reason);
      formDataToSend.append('weekOffset', weekOffset.toString());
      
      // Add files
      selectedFiles.forEach((file) => {
        formDataToSend.append('documents', file);
      });

      await createAppointmentMutation.mutateAsync({ 
        patientId, 
        appointmentData: formDataToSend 
      });
      
      // Reset form
      setPatientId('');
      setWeekOffset(0);
      setSelectedFiles([]);
      setFormData({
        doctorId: '',
        type: 'consultation générale',
        reason: '',
      });
      
      setSuccess('Appointment created successfully!');
      setTimeout(() => {
        setSuccess(null);
        onSuccess();
      }, 2000);
    } catch (err: any) {
      setError(err?.message || 'Failed to create appointment');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {success && <SuccessToast message={success} onClose={() => setSuccess(null)} />}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Create New Appointment</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <LoadingSpinner size="large" message="Creating appointment..." />
        ) : (
          <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Patient Selection - Hide if user is a patient */}
            {!isPatient && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient <span className="text-red-500">*</span>
                </label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Select a patient</option>
                  {patients.map((patient) => (
                    <option key={patient._id} value={patient._id}>
                      {patient.name} - {patient.cin || patient.email}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Doctor Selection - Hide if user is a doctor or patient */}
            {!isDoctor && !isPatient && (

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Doctor <span className="text-red-500">*</span>
                </label>
                <select
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Select a doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      {doctor.name} - {doctor.cin || doctor.email}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {/* Info message for patient */}
            {isPatient && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded text-sm">
                ℹ️ A doctor will be automatically assigned to your appointment
              </div>
            )}

            {/* Week Offset */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Appointment Timing <span className="text-red-500">*</span>
              </label>
              <select
                value={weekOffset}
                onChange={(e) => setWeekOffset(Number(e.target.value))}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value={0}>This Week</option>
                <option value={1}>Next Week</option>
                <option value={2}>In 2 Weeks</option>
                <option value={3}>In 3 Weeks</option>
                <option value={4}>In 4 Weeks</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                The system will find the earliest available slot in the selected week
              </p>
            </div>

            {/* Appointment Type */}
            {/* Appointment Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Appointment Type <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="consultation générale">Consultation Générale</option>
                <option value="follow-up">Follow-up</option>
                <option value="emergency">Emergency</option>
                <option value="check-up">Check-up</option>
              </select>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                rows={3}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Enter reason for appointment"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Documents (Optional) - {selectedFiles.length}/10 files
              </label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                disabled={selectedFiles.length >= 10}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                Accepted formats: PDF, DOC, DOCX, JPG, PNG • Maximum 10 files • Select multiple files at once or add them one by one
              </p>
              
              {/* Selected Files List */}
              {selectedFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-sm font-medium text-gray-700">Selected Files:</p>
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded border border-gray-200"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-blue-600">📄</span>
                        <span className="text-sm text-gray-700 truncate">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="text-red-600 hover:text-red-800 ml-2 flex-shrink-0"
                        title="Remove file"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded text-white ${
                loading
                  ? 'bg-blue-300 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {loading ? 'Creating...' : 'Create Appointment'}
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
    </>
  );
};

export default CreateAppointmentModal;
