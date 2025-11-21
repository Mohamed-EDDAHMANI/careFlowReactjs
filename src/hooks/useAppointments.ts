import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentService } from '../features/appointment/appointmentService';
import type { FetchAppointmentsParams, CreateAppointmentData } from '../features/appointment/appointmentTypes';

// Query Keys
export const appointmentKeys = {
  all: ['appointments'] as const,
  lists: () => [...appointmentKeys.all, 'list'] as const,
  list: (params: FetchAppointmentsParams, userId?: string, role?: string) => 
    [...appointmentKeys.lists(), { params, userId, role }] as const,
  doctor: (doctorId: string, params: FetchAppointmentsParams) => 
    [...appointmentKeys.all, 'doctor', doctorId, params] as const,
  patient: (patientId: string, params: FetchAppointmentsParams) => 
    [...appointmentKeys.all, 'patient', patientId, params] as const,
};

// Fetch all appointments (with role-based filtering)
export const useFetchAppointments = (
  params: FetchAppointmentsParams,
  userId?: string,
  role?: string
) => {
  return useQuery({
    queryKey: appointmentKeys.list(params, userId, role),
    queryFn: async () => {
      if (role === 'doctor' && userId) {
        return await appointmentService.getDoctorAppointments(userId, params);
      } else if (role === 'patient' && userId) {
        return await appointmentService.getOwnAppointments(userId, params);
      } else {
        return await appointmentService.getAllAppointments(params);
      }
    },
    enabled: !!userId || role === 'admin',
  });
};

// Fetch doctor appointments
export const useFetchDoctorAppointments = (
  doctorId: string,
  params: FetchAppointmentsParams,
  enabled = true
) => {
  return useQuery({
    queryKey: appointmentKeys.doctor(doctorId, params),
    queryFn: () => appointmentService.getDoctorAppointments(doctorId, params),
    enabled: enabled && !!doctorId,
  });
};

// Fetch patient appointments
export const useFetchPatientAppointments = (
  patientId: string,
  params: FetchAppointmentsParams,
  enabled = true
) => {
  return useQuery({
    queryKey: appointmentKeys.patient(patientId, params),
    queryFn: () => appointmentService.getOwnAppointments(patientId, params),
    enabled: enabled && !!patientId,
  });
};

// Create appointment mutation
export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      patientId, 
      appointmentData 
    }: { 
      patientId: string; 
      appointmentData: Partial<CreateAppointmentData> | FormData 
    }) => appointmentService.createAppointment(patientId, appointmentData as CreateAppointmentData | FormData),
    onSuccess: () => {
      // Invalidate all appointment queries to refetch
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    },
  });
};

// Update appointment mutation
export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      appointmentId, 
      appointmentData 
    }: { 
      appointmentId: string; 
      appointmentData: Partial<CreateAppointmentData> 
    }) => appointmentService.updateAppointment(appointmentId, appointmentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    },
  });
};

// Update appointment status mutation
export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      appointmentId, 
      status 
    }: { 
      appointmentId: string; 
      status: 'scheduled' | 'completed' | 'cancelled' 
    }) => appointmentService.updateAppointmentStatus(appointmentId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    },
  });
};

// Delete appointment mutation
export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (appointmentId: string) => appointmentService.deleteAppointment(appointmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    },
  });
};

// Fetch appointment documents
export const useFetchAppointmentDocuments = (appointmentId: string, enabled = false) => {
  return useQuery({
    queryKey: [...appointmentKeys.all, 'documents', appointmentId],
    queryFn: () => appointmentService.getAppointmentDocuments(appointmentId),
    enabled: enabled && !!appointmentId,
  });
};
