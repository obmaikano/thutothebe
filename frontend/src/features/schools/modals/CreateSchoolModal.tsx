import React, { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { fetchSchools } from '../schoolsSlice';
import { School } from '../../../api/services/schoolApi';
import SchoolForm from '../components/SchoolForm';
import { Building, Plus } from 'lucide-react';

interface CreateSchoolModalProps {
  extraObject?: any;
}

export const CreateSchoolModal: React.FC<CreateSchoolModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const handleSubmit = async (school: School) => {
    try {
      setIsSuccess(true);
      
      // Refresh the schools list instead of reloading the page
      await dispatch(fetchSchools());
      
      // Show success briefly then close
      setTimeout(() => {
        handleClose();
      }, 1000);
      
    } catch (error) {
      console.error('Failed to create school:', error);
      setIsSuccess(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <Building className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">School Created Successfully!</h3>
        <p className="text-gray-600">The new school has been added to your system.</p>
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
          <h3 className="text-lg font-semibold text-gray-900">Create New School</h3>
          <p className="text-sm text-gray-600">Add a new school to your education system</p>
        </div>
      </div>

      {/* Form */}
      <div>
        <SchoolForm
          mode="create"
          onSubmit={handleSubmit}
          onCancel={handleClose}
        />
      </div>
    </div>
  );
};

export default CreateSchoolModal; 