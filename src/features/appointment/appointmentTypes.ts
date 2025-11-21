export interface Appointment {
  _id: string;
  patientId: {
    _id: string;
    name: string;
    email: string;
    cin: string;
  };
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  doctorId: {
    _id: string;
    name: string;
    email: string;
    cin: string;
  };
  type: string;
  start: string;
  end: string;
  reason: string;
  document: DocumentInfo[];
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface DocumentInfo {
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  category: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  url?: string;
}

export interface DocumentsResponse {
  success: boolean;
  count: number;
  data: DocumentInfo[];
}

export interface AppointmentsResponse {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: Appointment[];
}

export interface AppointmentsState {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FetchAppointmentsParams {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface CreateAppointmentData {
  doctorId: string;
  type: string;
  reason: string;
  start?: string;
  end?: string;
}
