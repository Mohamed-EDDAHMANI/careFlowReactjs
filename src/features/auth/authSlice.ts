// src/features/auth/authSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, AuthResponse, LoginCredentials } from "./authTypes";
import { mapBackendUser } from "./authTypes";
import { authService } from "./authService";

const initialState: AuthState = {
  user: null,
  accessToken: null,
  loading: false,
  error: null,
};

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/login",
  async (creds: LoginCredentials, { rejectWithValue }) => {
    try {
      return await authService.login(creds);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } | string } };
      const errorData = error.response?.data;
      const errorMessage = typeof errorData === 'object' && errorData?.message 
        ? errorData.message 
        : typeof errorData === 'string' 
        ? errorData 
        : "Login failed";
      return rejectWithValue(errorMessage);
    }
  }
);

// REFRESH TOKEN
export const refreshAccessToken = createAsyncThunk(
  "auth/refresh",
  async (refreshToken: string, { rejectWithValue }) => {
    try {
      return await authService.refreshToken(refreshToken);
    } catch {
      return rejectWithValue("Refresh failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.accessToken = null;
      // Remove token from localStorage
      localStorage.removeItem('accessToken');
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          // map backend user shape to frontend User
          state.user = mapBackendUser(action.payload.user);
          state.accessToken = action.payload.accessToken;
          // Save token to localStorage
          localStorage.setItem('accessToken', action.payload.accessToken);
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // REFRESH ACCESS TOKEN
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        // Save new token to localStorage
        localStorage.setItem('accessToken', action.payload.accessToken);
      })
  },
});

export const { logout } = authSlice.actions;
const authReducer = authSlice.reducer;
export default authReducer;
