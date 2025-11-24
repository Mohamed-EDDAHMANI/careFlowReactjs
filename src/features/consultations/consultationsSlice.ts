import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllConsultations,
  getOwnConsultations,
  searchConsultations,
  getConsultationById,
  createConsultation,
  updateConsultation,
  addAction,
  deleteConsultation,
} from './consultationService';
import type {
  Consultation,
  FetchConsultationsParams,
  CreateConsultationData,
  UpdateConsultationData,
  AddActionData,
} from './consultationTypes';

interface ConsultationsState {
  consultations: Consultation[];
  selectedConsultation: Consultation | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalRecords: number;
  } | null;
}

const initialState: ConsultationsState = {
  consultations: [],
  selectedConsultation: null,
  loading: false,
  error: null,
  pagination: null,
};

// Fetch consultations based on user role
export const fetchConsultations = createAsyncThunk(
  'consultations/fetchConsultations',
  async ({ role, userId, params }: { role: string; userId: string; params?: FetchConsultationsParams }) => {
    if (role === 'patient') {
      const response = await getOwnConsultations(userId, params);
      return response;
    } else {
      const response = await getAllConsultations(params);
      return response;
    }
  }
);

// Search consultations
export const searchConsultationsThunk = createAsyncThunk(
  'consultations/searchConsultations',
  async (params: FetchConsultationsParams) => {
    const response = await searchConsultations(params);
    return response;
  }
);

// Fetch single consultation
export const fetchConsultationById = createAsyncThunk(
  'consultations/fetchConsultationById',
  async (id: string) => {
    const response = await getConsultationById(id);
    return response.data;
  }
);

// Create consultation
export const createConsultationThunk = createAsyncThunk(
  'consultations/createConsultation',
  async (data: CreateConsultationData, { rejectWithValue }) => {
    try {
      const response = await createConsultation(data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create consultation';
      return rejectWithValue(errorMessage);
    }
  }
);

// Update consultation
export const updateConsultationThunk = createAsyncThunk(
  'consultations/updateConsultation',
  async ({ id, data }: { id: string; data: UpdateConsultationData }, { rejectWithValue }) => {
    try {
      const response = await updateConsultation(id, data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update consultation';
      return rejectWithValue(errorMessage);
    }
  }
);

// Add action
export const addActionThunk = createAsyncThunk(
  'consultations/addAction',
  async ({ id, data }: { id: string; data: AddActionData }, { rejectWithValue }) => {
    try {
      const response = await addAction(id, data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add action';
      return rejectWithValue(errorMessage);
    }
  }
);

// Delete consultation
export const deleteConsultationThunk = createAsyncThunk(
  'consultations/deleteConsultation',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteConsultation(id);
      return id;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete consultation';
      return rejectWithValue(errorMessage);
    }
  }
);

const consultationsSlice = createSlice({
  name: 'consultations',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedConsultation: (state) => {
      state.selectedConsultation = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch consultations
      .addCase(fetchConsultations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConsultations.fulfilled, (state, action) => {
        state.loading = false;
        state.consultations = action.payload.data;
        state.pagination = action.payload.pagination || null;
      })
      .addCase(fetchConsultations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch consultations';
      })
      
      // Search consultations
      .addCase(searchConsultationsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchConsultationsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.consultations = action.payload.data;
        state.pagination = action.payload.pagination || null;
      })
      .addCase(searchConsultationsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to search consultations';
      })
      
      // Fetch single consultation
      .addCase(fetchConsultationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConsultationById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedConsultation = action.payload;
      })
      .addCase(fetchConsultationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch consultation';
      })
      
      // Create consultation
      .addCase(createConsultationThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createConsultationThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.consultations.unshift(action.payload);
      })
      .addCase(createConsultationThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create consultation';
      })
      
      // Update consultation
      .addCase(updateConsultationThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateConsultationThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.consultations.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) {
          state.consultations[index] = action.payload;
        }
        if (state.selectedConsultation?._id === action.payload._id) {
          state.selectedConsultation = action.payload;
        }
      })
      .addCase(updateConsultationThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update consultation';
      })
      
      // Add action
      .addCase(addActionThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addActionThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.consultations.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) {
          state.consultations[index] = action.payload;
        }
        if (state.selectedConsultation?._id === action.payload._id) {
          state.selectedConsultation = action.payload;
        }
      })
      .addCase(addActionThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add action';
      })
      
      // Delete consultation
      .addCase(deleteConsultationThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteConsultationThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.consultations = state.consultations.filter((c) => c._id !== action.payload);
        if (state.selectedConsultation?._id === action.payload) {
          state.selectedConsultation = null;
        }
      })
      .addCase(deleteConsultationThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete consultation';
      });
  },
});

export const { clearError, clearSelectedConsultation } = consultationsSlice.actions;
export default consultationsSlice.reducer;
