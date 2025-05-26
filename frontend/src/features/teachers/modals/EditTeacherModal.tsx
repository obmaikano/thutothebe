import React, { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { fetchTeachers } from '../teachersSlice';
import { Teacher } from '../../../api/services/teacherApi';
import TeacherForm from '../components/TeacherForm';
import { Users, Edit } from 'lucide-react';

interface EditTeacherModalProps {
  extraObject?: Teacher;
}

export const EditTeacherModal: React.FC<EditTeacherModalProps> = ({ extraObject: teacher }) => {
  const dispatch = useAppDispatch();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const handleSubmit = async (updatedTeacher: Teacher) => {
    try {
      setIsSuccess(true);
      
      // Refresh the teachers list
      await dispatch(fetchTeachers());
      
      // Show success briefly then close
      setTimeout(() => {
        handleClose();
      }, 1000);
      
    } catch (error) {
      console.error('Failed to update teacher:', error);
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Teacher Updated Successfully!</h3>
        <p className="text-gray-600">The teacher information has been updated.</p>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error: No teacher data provided</p>
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
          <h3 className="text-lg font-semibold text-gray-900">Edit Teacher</h3>
          <p className="text-sm text-gray-600">Update teacher information</p>
        </div>
      </div>

      {/* Form */}
      <div>
        <TeacherForm
          mode="edit"
          teacher={teacher}
          onSubmit={handleSubmit}
          onCancel={handleClose}
        />
      </div>
    </div>
  );
};

export default EditTeacherModal; 