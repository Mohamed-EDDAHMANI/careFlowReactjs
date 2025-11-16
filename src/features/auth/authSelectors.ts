// src/features/auth/authSelectors.ts

import type { RootState } from "../../app/store";

export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

export const isAuthenticated = (state: RootState) => !!state.auth.accessToken;
