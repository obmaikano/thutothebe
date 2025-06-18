import React, { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { fetchClasses } from '../classesSlice';
import { Class } from '../../../api/services/classApi';
import ClassForm from '../components/ClassForm';
import { School, Plus } from 'lucide-react';

interface CreateClassModalProps {
  extraObject?: any;
}

export const CreateClassModal: React.FC<CreateClassModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const handleSubmit = async (classData: Class) => {
    try {
      setIsSuccess(true);
      
      // Refresh the classes list instead of reloading the page
      await dispatch(fetchClasses());
      
      // Show success briefly then close
      setTimeout(() => {
        handleClose();
      }, 1000);
      
    } catch (error) {
      console.error('Failed to create class:', error);
      setIsSuccess(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <School className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Class Created Successfully!</h3>
        <p className="text-gray-600">The new class has been added to your school.</p>
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
          <h3 className="text-lg font-semibold text-gray-900">Create New Class</h3>
          <p className="text-sm text-gray-600">Add a new class to your school</p>
        </div>
      </div>

      {/* Class Info Summary (placeholder for new class) */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <School className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">New Class</div>
            <div className="text-sm text-gray-500">Fill in the details below to create a class.</div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div>
        <ClassForm
          mode="create"
          onSubmit={handleSubmit}
          onCancel={handleClose}
        />
      </div>
    </div>
  );
};

export default CreateClassModal; 