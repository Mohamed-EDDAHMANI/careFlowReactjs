import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../features/auth/authService';
import type { LoginCredentials } from '../features/auth/authTypes';

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: () => {
      // Invalidate all queries on successful login
      queryClient.invalidateQueries();
    },
  });
};

// Refresh token mutation
export const useRefreshToken = () => {
  return useMutation({
    mutationFn: (token: string) => authService.refreshToken(token),
  });
};
