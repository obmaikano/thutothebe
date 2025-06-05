import React, { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { fetchUsers, fetchUserAnalytics } from '../usersSlice';
import { User } from '../../../api/services/userApi';
import UserForm from '../components/UserForm';
import { Users, Edit } from 'lucide-react';

interface EditUserModalProps {
  extraObject?: User;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const handleSubmit = async (user: User) => {
    try {
      setIsSuccess(true);
      
      // Refresh the users list and analytics instead of reloading the page
      await dispatch(fetchUsers({}));
      await dispatch(fetchUserAnalytics());
      
      // Show success briefly then close
      setTimeout(() => {
        handleClose();
      }, 1000);
      
    } catch (error) {
      console.error('Failed to update user:', error);
      setIsSuccess(false);
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">User Updated Successfully!</h3>
        <p className="text-gray-600">The user information has been updated.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Edit className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Edit User</h3>
          <p className="text-sm text-gray-600">Update user information and settings</p>
        </div>
      </div>

      {/* Form */}
      <div>
        <UserForm
          user={extraObject}
          mode="edit"
          onSubmit={handleSubmit}
          onCancel={handleClose}
        />
      </div>
    </div>
  );
};

export default EditUserModal; 