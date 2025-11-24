import axiosClient from '../../api/axiosClient';
import type {
  ConsultationsResponse,
  FetchConsultationsParams,
  CreateConsultationData,
  UpdateConsultationData,
  AddActionData,
  Consultation,
} from './consultationTypes';

const API_URL = '/apiCli/medical-records';

// Get all consultations with filters (doctor/admin)
export const getAllConsultations = async (params?: FetchConsultationsParams): Promise<ConsultationsResponse> => {
  const response = await axiosClient.get(`${API_URL}/getAll`, { params });
  return response.data;
};

// Get patient's own consultations
export const getOwnConsultations = async (patientId: string, params?: FetchConsultationsParams): Promise<ConsultationsResponse> => {
  const response = await axiosClient.get(`${API_URL}/patient/${patientId}`, { params });
  return response.data;
};

// Search consultations
export const searchConsultations = async (params: FetchConsultationsParams): Promise<ConsultationsResponse> => {
  const response = await axiosClient.get(`${API_URL}/search`, { params });
  return response.data;
};

// Get single consultation by ID
export const getConsultationById = async (id: string): Promise<{ success: boolean; data: Consultation }> => {
  const response = await axiosClient.get(`${API_URL}/${id}`);
  return response.data;
};

// Create new consultation
export const createConsultation = async (data: CreateConsultationData): Promise<{ success: boolean; data: Consultation }> => {
  const formData = new FormData();
  
  formData.append('patientId', data.patientId);
  formData.append('appointmentId', data.appointmentId);
  formData.append('typeMedical', data.typeMedical);
  
  if (data.doctorId) formData.append('medecinId', data.doctorId);
  if (data.priority) formData.append('priority', data.priority);
  if (data.description) formData.append('description', data.description);
  if (data.resultDate) formData.append('resultDate', data.resultDate);
  
  // Append multiple files
  if (data.documents && data.documents.length > 0) {
    data.documents.forEach((file) => {
      formData.append('documents', file);
    });
  }
  
  const response = await axiosClient.post(`${API_URL}/create`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Update consultation
export const updateConsultation = async (
  id: string,
  data: UpdateConsultationData
): Promise<{ success: boolean; data: Consultation }> => {
  const formData = new FormData();
  
  if (data.priority) formData.append('priority', data.priority);
  if (data.typeMedical) formData.append('typeMedical', data.typeMedical);
  if (data.description) formData.append('description', data.description);
  if (data.resultDate) formData.append('resultDate', data.resultDate);
  
  // Append new documents
  if (data.documents && data.documents.length > 0) {
    data.documents.forEach((file) => {
      formData.append('documents', file);
    });
  }
  
  const response = await axiosClient.put(`${API_URL}/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Add action to consultation
export const addAction = async (
  id: string,
  data: AddActionData
): Promise<{ success: boolean; data: Consultation }> => {
  // Always use FormData to ensure consistent body parsing on backend
  const formData = new FormData();
  formData.append('type', data.type);
  formData.append('description', data.description);
  
  if (data.document) {
    formData.append('document', data.document);
  }
  
  const response = await axiosClient.post(`${API_URL}/${id}/action`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Get document URL
export const getDocumentUrl = async (
  consultationId: string,
  documentId: string
): Promise<{ success: boolean; data: { url: string; originalName: string; mimeType: string; size: number } }> => {
  const response = await axiosClient.get(`${API_URL}/${consultationId}/document/${documentId}/url`);
  return response.data;
};

// Delete consultation
export const deleteConsultation = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await axiosClient.delete(`${API_URL}/${id}`);
  return response.data;
};
