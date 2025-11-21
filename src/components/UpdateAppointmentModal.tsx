import React, { useState } from 'react';
import { useUpdateAppointmentStatus } from '../hooks/useAppointments';
import type { Appointment } from '../features/appointment/appointmentTypes';
import LoadingSpinner from './LoadingSpinner';
import { X, CheckCircle, XCircle, Clock } from 'lucide-react';

interface UpdateAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  appointment: Appointment | null;
}

const UpdateAppointmentModal: React.FC<UpdateAppointmentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  appointment,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const updateStatusMutation = useUpdateAppointmentStatus();
  const loading = updateStatusMutation.isPending;

  const handleStatusChange = async (newStatus: 'scheduled' | 'completed' | 'cancelled') => {
    setError(null);

    try {
      if (!appointment?._id) {
        setError('Appointment ID is missing');
        return;
      }

      await updateStatusMutation.mutateAsync({ 
        appointmentId: appointment._id, 
        status: newStatus 
      });
      
      setSuccess(`Appointment status updated to ${newStatus}!`);
      setTimeout(() => {
        onSuccess();
        onClose();
        setSuccess(null);
      }, 1500);
    } catch (err: any) {
      setError(err?.message || 'Failed to update appointment status');
    }
  };

  const handleClose = () => {
    setError(null);
    setSuccess(null);
    onClose();
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Changer le Statut du Rendez-vous</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-blue-700 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {success && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Appointment Details */}
          <div className="mb-6 space-y-4">
            {/* Patient Info */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <span>👤</span> Informations Patient
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Nom:</span>
                  <span className="ml-2 font-medium text-gray-900">{appointment.patientId.name}</span>
                </div>
                <div>
                  <span className="text-gray-600">CIN:</span>
                  <span className="ml-2 font-medium text-gray-900">{appointment.patientId.cin}</span>
                </div>
              </div>
            </div>

            {/* Doctor Info */}
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-sm font-semibold text-green-900 mb-3 flex items-center gap-2">
                <span>👨‍⚕️</span> Informations Docteur
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Nom:</span>
                  <span className="ml-2 font-medium text-gray-900">{appointment.doctorId.name}</span>
                </div>
                <div>
                  <span className="text-gray-600">CIN:</span>
                  <span className="ml-2 font-medium text-gray-900">{appointment.doctorId.cin}</span>
                </div>
              </div>
            </div>

            {/* Appointment Info */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span>📅</span> Détails du Rendez-vous
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium text-gray-900">{appointment.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Début:</span>
                  <span className="font-medium text-gray-900">{formatDateTime(appointment.start)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fin:</span>
                  <span className="font-medium text-gray-900">{formatDateTime(appointment.end)}</span>
                </div>
                <div className="pt-2 border-t">
                  <span className="text-gray-600 block mb-1">Raison:</span>
                  <p className="font-medium text-gray-900">{appointment.reason}</p>
                </div>
              </div>
            </div>

            {/* Current Status */}
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h3 className="text-sm font-semibold text-purple-900 mb-3">Statut Actuel</h3>
              <div className="flex items-center gap-2">
                {getStatusIcon(appointment.status)}
                <span className="font-semibold text-lg capitalize">{appointment.status}</span>
              </div>
            </div>
          </div>

          {/* Status Change Buttons */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Changer le Statut</h3>
            
            <button
              onClick={() => handleStatusChange('scheduled')}
              disabled={loading || appointment.status === 'scheduled'}
              className="w-full flex items-center justify-center gap-3 p-4 bg-blue-100 hover:bg-blue-200 border-2 border-blue-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Clock className="w-6 h-6 text-blue-600" />
              <div className="text-left">
                <div className="font-semibold text-blue-900">Programmé</div>
                <div className="text-xs text-blue-700">Le rendez-vous est confirmé</div>
              </div>
            </button>

            <button
              onClick={() => handleStatusChange('completed')}
              disabled={loading || appointment.status === 'completed'}
              className="w-full flex items-center justify-center gap-3 p-4 bg-green-100 hover:bg-green-200 border-2 border-green-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div className="text-left">
                <div className="font-semibold text-green-900">Terminé</div>
                <div className="text-xs text-green-700">Le rendez-vous est complété</div>
              </div>
            </button>

            <button
              onClick={() => handleStatusChange('cancelled')}
              disabled={loading || appointment.status === 'cancelled'}
              className="w-full flex items-center justify-center gap-3 p-4 bg-red-100 hover:bg-red-200 border-2 border-red-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <XCircle className="w-6 h-6 text-red-600" />
              <div className="text-left">
                <div className="font-semibold text-red-900">Annulé</div>
                <div className="text-xs text-red-700">Le rendez-vous est annulé</div>
              </div>
            </button>
          </div>

          {/* Close Button */}
          <div className="mt-6">
            <button
              onClick={handleClose}
              disabled={loading}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateAppointmentModal;
