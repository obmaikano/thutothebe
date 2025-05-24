import React, { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { fetchUsers } from '../usersSlice';
import { User } from '../../../api/services/userApi';
import UserForm from '../components/UserForm';
import { Users, Plus } from 'lucide-react';

interface CreateUserModalProps {
  extraObject?: any;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const handleSubmit = async (user: User) => {
    try {
      setIsSuccess(true);
      
      // Refresh the users list instead of reloading the page
      await dispatch(fetchUsers());
      
      // Show success briefly then close
      setTimeout(() => {
        handleClose();
      }, 1000);
      
    } catch (error) {
      console.error('Failed to create user:', error);
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">User Created Successfully!</h3>
        <p className="text-gray-600">The new user has been added to the system.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Plus className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Create New User</h3>
          <p className="text-sm text-gray-600">Add a new user to the system</p>
        </div>
      </div>

      {/* Form */}
      <div>
        <UserForm
          mode="create"
          onSubmit={handleSubmit}
          onCancel={handleClose}
        />
      </div>
    </div>
  );
};

export default CreateUserModal; 