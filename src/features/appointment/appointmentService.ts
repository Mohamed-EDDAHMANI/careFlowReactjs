import axiosClient from '../../api/axiosClient';
import type { AppointmentsResponse, CreateAppointmentData, FetchAppointmentsParams } from './appointmentTypes';

export const appointmentService = {
  getAllAppointments: async (params: FetchAppointmentsParams): Promise<AppointmentsResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.from) queryParams.append('from', params.from);
    if (params.to) queryParams.append('to', params.to);
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.order) queryParams.append('order', params.order);

    const response = await axiosClient.get(`apiCli/appointments/all/?${queryParams.toString()}`);
    return response.data;
  },

  createAppointment: async (patientId: string, appointmentData: CreateAppointmentData | FormData) => {
    const config = appointmentData instanceof FormData ? {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    } : {};
    
    const response = await axiosClient.post(`apiCli/appointments/create/${patientId}`, appointmentData, config);
    return response.data.data;
  },

  deleteAppointment: async (appointmentId: string) => {
    const response = await axiosClient.delete(`apiCli/appointments/${appointmentId}`);
    return response.data;
  },

  updateAppointment: async (appointmentId: string, appointmentData: Partial<CreateAppointmentData>) => {
    const response = await axiosClient.put(`apiCli/appointments/${appointmentId}`, appointmentData);
    return response.data.data;
  },

  updateAppointmentStatus: async (appointmentId: string, status: 'scheduled' | 'completed' | 'cancelled') => {
    const response = await axiosClient.patch(`apiCli/appointments/${appointmentId}/status`, { status });
    return response.data.data;
  },

  getDoctorAppointments: async (doctorId: string, params: FetchAppointmentsParams): Promise<AppointmentsResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.from) queryParams.append('from', params.from);
    if (params.to) queryParams.append('to', params.to);
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.order) queryParams.append('order', params.order);

    const response = await axiosClient.get(`apiCli/appointments/doctor/${doctorId}?${queryParams.toString()}`);
    return response.data;
  },

  getOwnAppointments: async (patientId: string, params: FetchAppointmentsParams): Promise<AppointmentsResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.from) queryParams.append('from', params.from);
    if (params.to) queryParams.append('to', params.to);
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.order) queryParams.append('order', params.order);

    const response = await axiosClient.get(`apiCli/appointments/${patientId}/own?${queryParams.toString()}`);
    // Backend returns { success: true, data: { data: [], page, limit, total, totalPages } }
    return response.data.data;
  },

  getAppointmentDocuments: async (appointmentId: string) => {
    const response = await axiosClient.get(`apiCli/appointments/${appointmentId}/documents`);
    return response.data;
  },

  downloadDocument: async (appointmentId: string, documentId: string): Promise<Blob> => {
    const response = await axiosClient.get(
      `apiCli/appointments/${appointmentId}/documents/${documentId}/download`,
      { responseType: 'blob' }
    );
    return response.data;
  },
};
