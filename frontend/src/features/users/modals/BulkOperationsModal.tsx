import React, { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { 
  bulkActivateUsers, 
  bulkDeactivateUsers, 
  bulkDeleteUsers,
  fetchUsers,
  fetchUserAnalytics
} from '../usersSlice';
import { USER_ROLE_OPTIONS } from '../../../api/services/userApi';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Trash2, 
  Shield, 
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface BulkOperationsModalProps {
  extraObject?: {
    selectedUsers: number[];
    operation: 'activate' | 'deactivate' | 'delete' | 'roleChange';
  };
}

export const BulkOperationsModal: React.FC<BulkOperationsModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState('');

  const { selectedUsers = [], operation = 'activate' } = extraObject || {};

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const getOperationConfig = () => {
    switch (operation) {
      case 'activate':
        return {
          title: 'Activate Users',
          description: `Activate ${selectedUsers.length} selected user(s)`,
          icon: UserCheck,
          iconColor: 'text-green-600',
          bgColor: 'bg-green-100',
          buttonColor: 'bg-green-600 hover:bg-green-700',
          confirmText: 'Activate Users'
        };
      case 'deactivate':
        return {
          title: 'Deactivate Users',
          description: `Deactivate ${selectedUsers.length} selected user(s)`,
          icon: UserX,
          iconColor: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
          confirmText: 'Deactivate Users'
        };
      case 'delete':
        return {
          title: 'Delete Users',
          description: `Permanently delete ${selectedUsers.length} selected user(s)`,
          icon: Trash2,
          iconColor: 'text-red-600',
          bgColor: 'bg-red-100',
          buttonColor: 'bg-red-600 hover:bg-red-700',
          confirmText: 'Delete Users'
        };
      case 'roleChange':
        return {
          title: 'Change User Roles',
          description: `Change role for ${selectedUsers.length} selected user(s)`,
          icon: Shield,
          iconColor: 'text-blue-600',
          bgColor: 'bg-blue-100',
          buttonColor: 'bg-blue-600 hover:bg-blue-700',
          confirmText: 'Change Roles'
        };
      default:
        return {
          title: 'Bulk Operation',
          description: `Perform operation on ${selectedUsers.length} user(s)`,
          icon: Users,
          iconColor: 'text-gray-600',
          bgColor: 'bg-gray-100',
          buttonColor: 'bg-gray-600 hover:bg-gray-700',
          confirmText: 'Confirm'
        };
    }
  };

  const handleConfirm = async () => {
    if (selectedUsers.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      switch (operation) {
        case 'activate':
          await dispatch(bulkActivateUsers(selectedUsers)).unwrap();
          break;
        case 'deactivate':
          await dispatch(bulkDeactivateUsers(selectedUsers)).unwrap();
          break;
        case 'delete':
          await dispatch(bulkDeleteUsers(selectedUsers)).unwrap();
          break;
        case 'roleChange':
          if (!selectedRole) {
            setError('Please select a role');
            return;
          }
          // TODO: Implement bulk role change
          console.log('Bulk role change not implemented yet');
          break;
      }

      setIsSuccess(true);
      
      // Refresh the users list and analytics after bulk operation
      await dispatch(fetchUsers({}));
      await dispatch(fetchUserAnalytics());
      
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'Operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const config = getOperationConfig();

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Operation Completed!</h3>
        <p className="text-gray-600">The bulk operation has been completed successfully.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <div className={`p-2 ${config.bgColor} rounded-lg`}>
          <config.icon className={`h-5 w-5 ${config.iconColor}`} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{config.title}</h3>
          <p className="text-sm text-gray-600">{config.description}</p>
        </div>
      </div>

      {/* Warning for destructive operations */}
      {operation === 'delete' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-red-800">Warning: Permanent Action</h4>
              <p className="text-sm text-red-700 mt-1">
                This action cannot be undone. The selected users and all their associated data will be permanently deleted.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Role selection for role change operation */}
      {operation === 'roleChange' && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Select New Role
          </label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Choose a role...</option>
            {USER_ROLE_OPTIONS.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Selected users count */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Selected Users:</span>
          <span className="text-sm font-bold text-gray-900">{selectedUsers.length}</span>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={handleClose}
          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={isLoading || (operation === 'roleChange' && !selectedRole)}
          className={`px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${config.buttonColor}`}
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            config.confirmText
          )}
        </button>
      </div>
    </div>
  );
};

export default BulkOperationsModal; 