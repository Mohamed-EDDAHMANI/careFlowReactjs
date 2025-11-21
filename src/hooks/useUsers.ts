import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../features/user/userService';

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  roleId: string;
  cin: string;
  birthDate: string;
  status: string;
}

interface UpdateUserData {
  name: string;
  email: string;
  roleId: string;
  cin: string;
  birthDate: string;
  status: string;
}

// Query Keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  patients: () => [...userKeys.all, 'patients'] as const,
  doctors: () => [...userKeys.all, 'doctors'] as const,
};

// Fetch all users
export const useFetchUsers = () => {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: () => userService.getAllUsers(),
  });
};

// Fetch all patients
export const useFetchPatients = () => {
  return useQuery({
    queryKey: userKeys.patients(),
    queryFn: () => userService.getAllPatients(),
  });
};

// Fetch all doctors
export const useFetchDoctors = () => {
  return useQuery({
    queryKey: userKeys.doctors(),
    queryFn: () => userService.getAllDoctors(),
  });
};

// Create user mutation
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: CreateUserData) => userService.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

// Update user mutation
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, userData }: { userId: string; userData: UpdateUserData }) => 
      userService.updateUser(userId, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

// Suspend user mutation
export const useSuspendUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason?: string }) => 
      userService.suspendUser(userId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

// Activate user mutation
export const useActivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userService.activateUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};
