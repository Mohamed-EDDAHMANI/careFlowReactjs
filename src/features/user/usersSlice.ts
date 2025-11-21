import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { UsersState } from './userTypes';
import { userService } from './userService';

const initialState: UsersState = {
  users: [],
  doctors: [],
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      return await userService.getAllUsers();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const fetchPatients = createAsyncThunk(
  'users/fetchPatients',
  async (_, { rejectWithValue }) => {
    try {
      return await userService.getAllPatients();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch patients');
    }
  }
);

export const fetchDoctors = createAsyncThunk(
  'users/fetchDoctors',
  async (_, { rejectWithValue }) => {
    try {
      return await userService.getAllDoctors();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch doctors');
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData: { name: string; email: string; roleId: string; cin: string; birthDate: string; status: string }, { rejectWithValue }) => {
    try {
      return await userService.createUser(userData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create user');
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ userId, userData }: { userId: string; userData: { name: string; email: string; roleId: string; cin: string; birthDate: string; status: string } }, { rejectWithValue }) => {
    try {
      return await userService.updateUser(userId, userData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

export const suspendUser = createAsyncThunk(
  'users/suspendUser',
  async ({ userId, reason }: { userId: string; reason?: string }, { rejectWithValue }) => {
    try {
      return await userService.suspendUser(userId, reason);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to suspend user');
    }
  }
);

export const activateUser = createAsyncThunk(
  'users/activateUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      return await userService.activateUser(userId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to activate user');
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(suspendUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(activateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      });
  },
});

export default usersSlice.reducer;
