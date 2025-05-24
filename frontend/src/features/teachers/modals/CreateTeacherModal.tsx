import React, { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { fetchTeachers } from '../teachersSlice';
import { Teacher } from '../../../api/services/teacherApi';
import TeacherForm from '../components/TeacherForm';
import { Users, Plus } from 'lucide-react';

interface CreateTeacherModalProps {
  extraObject?: any;
}

export const CreateTeacherModal: React.FC<CreateTeacherModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const [isSuccess, setIsSuccess] = useState(false);

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