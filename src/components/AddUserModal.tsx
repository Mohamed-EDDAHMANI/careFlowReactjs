import React, { useState, useEffect } from 'react';
import { useCreateUser, useUpdateUser } from '../hooks/useUsers';
import type { User } from '../features/user/userTypes';
import axiosClient from '../api/axiosClient';

interface Role {
  _id: string;
  name: string;
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  user?: User | null;
  mode: 'add' | 'edit';
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSuccess, user, mode }) => {
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  
  const loading = createUserMutation.isPending || updateUserMutation.isPending;
  
  useEffect(() => {
    if (isOpen) {
      fetchRoles();
      // Set selected role when editing
      if (mode === 'edit' && user) {
        setSelectedRoleId(user.roleId._id);
      } else {
        setSelectedRoleId('');
      }
    }
  }, [isOpen, user, mode]);

  const fetchRoles = async () => {
    try {
      const response = await axiosClient.get('apiCli/roles');
      setRoles(response.data.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };
  
  if (!isOpen) return null;

  const isEditMode = mode === 'edit';
  const title = isEditMode ? 'Edit User' : 'Add New User';
  const buttonText = isEditMode ? 'Update User' : 'Add User';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const userData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      roleId: selectedRoleId,
      cin: formData.get('cin') as string,
      birthDate: formData.get('birthDate') as string,
      status: formData.get('status') as string,
    };

    try {
      setError(null);
      if (isEditMode && user) {
        await updateUserMutation.mutateAsync({ userId: user._id, userData });
      } else {
        await createUserMutation.mutateAsync(userData);
      }
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error('Error saving user:', error);
      setError(error.response?.data?.message || error.message || 'Failed to save user');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form key={user?._id || 'new'} onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              name="name"
              type="text"
              defaultValue={isEditMode ? user?.name : ''}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter user name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              name="email"
              type="email"
              defaultValue={isEditMode ? user?.email : ''}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter email"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select 
              name="role"
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            >
              <option value="">Select role</option>
              {roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CIN</label>
            <input
              name="cin"
              type="text"
              defaultValue={isEditMode ? user?.cin : ''}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter CIN"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
            <input
              name="birthDate"
              type="date"
              defaultValue={isEditMode ? user?.birthDate?.split('T')[0] : ''}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select 
              name="status"
              defaultValue={isEditMode ? user?.status : 'active'}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            >
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Saving...' : buttonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;