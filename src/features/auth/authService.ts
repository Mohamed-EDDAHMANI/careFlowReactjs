// src/features/auth/authService.ts

import axiosClient from "../../api/axiosClient";
import type { LoginCredentials, AuthResponse, TokenRefreshResponse } from "./authTypes";

export const authService = {
  login: async (data: LoginCredentials): Promise<AuthResponse> => {
    const response = await axiosClient.post("/apiCli/auth/login", data);
    return response.data;
  },

  refreshToken: async (token: string): Promise<TokenRefreshResponse> => {
    const response = await axiosClient.post("/auth/refresh-token", { refreshToken: token });
    return response.data;
  },

  getProfile: async () => {
    const response = await axiosClient.get("/auth/me");
    return response.data;
  },
};
