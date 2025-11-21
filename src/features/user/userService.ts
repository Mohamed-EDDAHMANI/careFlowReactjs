import axiosClient from '../../api/axiosClient';
import type { User } from './userTypes';

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

export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await axiosClient.get('apiCli/users');
    return response.data.data;
  },

  getAllPatients: async (): Promise<User[]> => {
    const response = await axiosClient.get('apiCli/users/patient');
    return response.data.data;
  },

  getAllDoctors: async (): Promise<User[]> => {
    const response = await axiosClient.get('apiCli/users/doctor');
    return response.data.data;
  },

  createUser: async (userData: CreateUserData): Promise<User> => {
    const dataWithPassword = {
      ...userData,
      password: 'password'
    };
    const response = await axiosClient.post('apiCli/users/create', dataWithPassword);
    return response.data.data;
  },

  updateUser: async (userId: string, userData: UpdateUserData): Promise<User> => {
    const response = await axiosClient.put(`apiCli/users/${userId}`, userData);
    return response.data.data;
  },

  suspendUser: async (userId: string, reason?: string): Promise<User> => {
    const response = await axiosClient.patch(`apiCli/users/${userId}/suspend`, { reason });
    return response.data.data;
  },

  activateUser: async (userId: string): Promise<User> => {
    const response = await axiosClient.patch(`apiCli/users/${userId}/activate`);
    return response.data.data;
  },
};