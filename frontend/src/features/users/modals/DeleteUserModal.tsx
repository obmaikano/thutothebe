import React, { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { deleteUser, fetchUsers } from '../usersSlice';
import { User } from '../../../api/services/userApi';
import { AlertTriangle, Trash2, Users } from 'lucide-react';

interface DeleteUserModalProps {
  extraObject?: User;
}

export const DeleteUserModal: React.FC<DeleteUserModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const user = extraObject;

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const handleDelete = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      await dispatch(deleteUser(user.id)).unwrap();
      setIsSuccess(true);
      
      // Refresh the users list
      await dispatch(fetchUsers());
      
      // Show success briefly then close
      setTimeout(() => {
        handleClose();
      }, 1500);
      
    } catch (error: any) {
      console.error('Failed to delete user:', error);
      setError(error.message || 'Failed to delete user');
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">User Deleted Successfully!</h3>
        <p className="text-gray-600">The user has been removed from the system.</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-red-100 p-3">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
        <p className="text-gray-600">No user selected for deletion.</p>
        <button
          onClick={handleClose}
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <div className="p-2 bg-red-100 rounded-lg">
          <Trash2 className="h-5 w-5 text-red-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Delete User</h3>
          <p className="text-sm text-gray-600">This action cannot be undone</p>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Warning: This action is permanent
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>
                You are about to delete the user account for{' '}
                <strong>{user.firstName} {user.lastName}</strong> ({user.email}).
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>All user data will be permanently removed</li>
                <li>The user will lose access to the system</li>
                <li>Any associated records may be affected</li>
                <li>This action cannot be undone</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* User Information */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">User Details</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Name:</span>
            <span className="ml-2 text-gray-900">{user.firstName} {user.lastName}</span>
          </div>
          <div>
            <span className="text-gray-500">Email:</span>
            <span className="ml-2 text-gray-900">{user.email}</span>
          </div>
          <div>
            <span className="text-gray-500">Role:</span>
            <span className="ml-2 text-gray-900">{user.role}</span>
          </div>
          <div>
            <span className="text-gray-500">Status:</span>
            <span className={`ml-2 ${user.active ? 'text-green-600' : 'text-red-600'}`}>
              {user.active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={handleClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Deleting...' : 'Delete User'}
        </button>
      </div>
    </div>
  );
};

export default DeleteUserModal; 