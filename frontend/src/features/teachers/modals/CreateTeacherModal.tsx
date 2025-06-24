import React, { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { fetchTeachers } from '../teachersSlice';
import { Teacher } from '../../../api/services/teacherApi';
import TeacherForm from '../components/TeacherForm';
import { Users, Plus } from 'lucide-react';
import { OnboardTeacherModal } from './OnboardTeacherModal';

interface CreateTeacherModalProps {
  extraObject?: any;
}

export const CreateTeacherModal: React.FC<CreateTeacherModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const [isSuccess, setIsSuccess] = useState(false);
  const [showOnboardModal, setShowOnboardModal] = useState(false);

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const handleSubmit = async (teacher: Teacher) => {
    try {
      setIsSuccess(true);
      
      // Refresh the teachers list instead of reloading the page
      await dispatch(fetchTeachers());
      
      // Show success briefly then close
      setTimeout(() => {
        handleClose();
      }, 1000);
      
    } catch (error) {
      console.error('Failed to create teacher:', error);
      setIsSuccess(false);
    }
  };

  if (showOnboardModal) {
    return <OnboardTeacherModal />;
  }

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Teacher Created Successfully!</h3>
        <p className="text-gray-600">The new teacher has been added to your staff.</p>
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
          <h3 className="text-lg font-semibold text-gray-900">Create New Teacher</h3>
          <p className="text-sm text-gray-600">Add a new teacher to your staff</p>
        </div>
      </div>

      {/* Onboard Teacher Button */}
      <div className="mb-4">
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          onClick={() => setShowOnboardModal(true)}
        >
          Onboard Teacher (User + Profile)
        </button>
      </div>

      {/* Form */}
      <div>
        <TeacherForm
          mode="create"
          onSubmit={handleSubmit}
          onCancel={handleClose}
        />
      </div>
    </div>
  );
};

export default CreateTeacherModal; 