export interface FileDocument {
  _id: string;
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  category: 'report' | 'imaging';
  url?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConsultationAction {
  _id: string;
  type: 'treatment' | 'scanner' | 'analysis';
  description: string;
  document?: FileDocument;
  createdAt: string;
}

export interface Consultation {
  _id: string;
  patientId: {
    _id: string;
    name: string;
    email: string;
    cin?: string;
  };
  medecinId: {
    _id: string;
    name: string;
    email: string;
  };
  appointmentId: {
    _id: string;
    type: string;
    date: string;
  };
  priority: 'Normal' | 'À suivre' | 'Traitement nécessaire' | 'Urgent';
  typeMedical: string;
  description?: string;
  document: FileDocument[];
  actions: ConsultationAction[];
  resultDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConsultationsResponse {
  success: boolean;
  count: number;
  data: Consultation[];
  pagination?: {
    page: number;
    limit: number;
    totalPages: number;
    totalRecords: number;
  };
}

export interface FetchConsultationsParams {
  page?: number;
  limit?: number;
  patientId?: string;
  priority?: string;
  typeMedical?: string;
  from?: string;
  to?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  q?: string; // for search
}

export interface CreateConsultationData {
  patientId: string;
  doctorId?: string;
  appointmentId: string;
  priority?: 'Normal' | 'À suivre' | 'Traitement nécessaire' | 'Urgent';
  typeMedical: string;
  description?: string;
  resultDate?: string;
  documents?: File[];
}

export interface UpdateConsultationData {
  priority?: 'Normal' | 'À suivre' | 'Traitement nécessaire' | 'Urgent';
  typeMedical?: string;
  description?: string;
  resultDate?: string;
  documents?: File[];
}

export interface AddActionData {
  type: 'treatment' | 'scanner' | 'analysis';
  description: string;
  document?: File;
}
