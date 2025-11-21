import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AppointmentsState, FetchAppointmentsParams, CreateAppointmentData } from './appointmentTypes';
import { appointmentService } from './appointmentService';

const initialState: AppointmentsState = {
  appointments: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 0,
  },
};

export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAppointments',
  async (payload: { params?: FetchAppointmentsParams; userId?: string; role?: string }, { rejectWithValue }) => {
    try {
      const { params = {}, userId, role } = payload;
      
      if (role === 'doctore' && userId) {
        return await appointmentService.getDoctorAppointments(userId, params);
      } else if (role === 'patient' && userId) {
        const app = await appointmentService.getOwnAppointments(userId, params);
        console.log(app)
        return app;
      } else {
        return await appointmentService.getAllAppointments(params);
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch appointments');
    }
  }
);

export const createAppointment = createAsyncThunk(
  'appointments/createAppointment',
  async ({ patientId, appointmentData }: { patientId: string; appointmentData: Partial<CreateAppointmentData> }, { rejectWithValue }) => {
    try {
      return await appointmentService.createAppointment(patientId, appointmentData as CreateAppointmentData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create appointment');
    }
  }
);

export const deleteAppointment = createAsyncThunk(
  'appointments/deleteAppointment',
  async (appointmentId: string, { rejectWithValue }) => {
    try {
      await appointmentService.deleteAppointment(appointmentId);
      return appointmentId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete appointment');
    }
  }
);

export const updateAppointment = createAsyncThunk(
  'appointments/updateAppointment',
  async ({ appointmentId, appointmentData }: { appointmentId: string; appointmentData: Partial<CreateAppointmentData> }, { rejectWithValue }) => {
    try {
      return await appointmentService.updateAppointment(appointmentId, appointmentData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update appointment');
    }
  }
);

export const updateAppointmentStatus = createAsyncThunk(
  'appointments/updateAppointmentStatus',
  async ({ appointmentId, status }: { appointmentId: string; status: 'scheduled' | 'completed' | 'cancelled' }, { rejectWithValue }) => {
    try {
      return await appointmentService.updateAppointmentStatus(appointmentId, status);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update appointment status');
    }
  }
);

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch appointments
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        // Handle both direct array and nested data structure
        state.appointments = Array.isArray(action.payload) 
          ? action.payload 
          : (action.payload.data || []);
        state.pagination = {
          page: action.payload.page || 1,
          limit: action.payload.limit || 5,
          total: action.payload.total || 0,
          totalPages: action.payload.totalPages || 1,
        };
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create appointment
      .addCase(createAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments.unshift(action.payload);
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete appointment
      .addCase(deleteAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = state.appointments.filter(apt => apt._id !== action.payload);
      })
      .addCase(deleteAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update appointment
      .addCase(updateAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.appointments.findIndex(apt => apt._id === action.payload._id);
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update appointment status
      .addCase(updateAppointmentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.appointments.findIndex(apt => apt._id === action.payload._id);
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
      })
      .addCase(updateAppointmentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = appointmentSlice.actions;
export default appointmentSlice.reducer;
