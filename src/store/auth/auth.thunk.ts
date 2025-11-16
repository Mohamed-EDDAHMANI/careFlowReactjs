
import authApi from "../../api/authApi";
import { createAsyncThunk } from "@reduxjs/toolkit";



// 🔐 LOGIN
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);

      const { accessToken, user } = response.data;

      localStorage.setItem("accessToken", accessToken);

      return { user, accessToken };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);


// ♻️ REFRESH TOKEN
export const refreshAccessToken = createAsyncThunk(
  "auth/refreshAccessToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.refreshToken();
      const { accessToken } = response.data;

      localStorage.setItem("accessToken", accessToken);

      return accessToken;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Token refresh failed");
    }
  }
);