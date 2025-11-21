import React, { useState } from 'react';
import { usePermissions } from '../hooks/usePermissions';
import { PERMISSIONS } from '../config/permissions';
import { useFetchUsers, useSuspendUser, useActivateUser } from '../hooks/useUsers';
import UserModal from '../components/AddUserModal';
import SuccessToast from '../components/SuccessToast';
import type { User } from '../features/user/userTypes';

const UsersPage: React.FC = () => {
  const { hasPermission } = usePermissions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [success, setSuccess] = useState<string | null>(null);

  // React Query hooks
  const { data: users = [], isLoading: loading, error } = useFetchUsers();
  const suspendUserMutation = useSuspendUser();
  const activateUserMutation = useActivateUser();

  const handleAddUser = () => {
    setSelectedUser(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSuccess = () => {
    const message = modalMode === 'add' ? 'User created successfully!' : 'User updated successfully!';
    setSuccess(message);
  };

  const handleSuspendUser = async (user: User) => {
    const reason = window.prompt(`Enter reason for suspending ${user.name} (optional):`);
    if (reason !== null) { // User didn't cancel
      try {
        await suspendUserMutation.mutateAsync({ userId: user._id, reason: reason || undefined });
      } catch (error) {
        console.error('Error suspending user:', error);
      }
    }
  };

  const handleActivateUser = async (user: User) => {
    if (window.confirm(`Are you sure you want to activate ${user.name}?`)) {
      try {
        await activateUserMutation.mutateAsync(user._id);
      } catch (error) {
        console.error('Error activating user:', error);
      }
    }
  };

  if (loading) return <div className="p-6">Loading users...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error instanceof Error ? error.message : 'An error occurred'}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        
        {hasPermission(PERMISSIONS.MANAGE_USERS_CREATE) && (
          <button
            onClick={handleAddUser}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add New User
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="capitalize">{user.roleId.name}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full w-fit ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                    {user.status === 'suspended' && user.suspendReason && (
                      <span className="text-xs text-gray-500 mt-1" title={user.suspendReason}>
                        Reason: {user.suspendReason.length > 20 ? user.suspendReason.substring(0, 20) + '...' : user.suspendReason}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button className="text-blue-600 hover:text-blue-900">View</button>
                  
                  {hasPermission(PERMISSIONS.MANAGE_USERS_UPDATE) && (
                    <button 
                      onClick={() => handleEditUser(user)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Edit
                    </button>
                  )}
                  
                  {hasPermission(PERMISSIONS.MANAGE_USERS_SUSPEND) && (
                    user.status === 'active' ? (
                      <button 
                        onClick={() => handleSuspendUser(user)}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        Suspend
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleActivateUser(user)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Activate
                      </button>
                    )
                  )}
                  
                  {hasPermission(PERMISSIONS.MANAGE_USERS_DELETE) && (
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {success && <SuccessToast message={success} onClose={() => setSuccess(null)} />}

      <UserModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        user={selectedUser}
        mode={modalMode}
      />
    </div>
  );
};

export default UsersPage;
