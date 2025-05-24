import React, { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { fetchCourses } from '../coursesSlice';
import { Course } from '../../../api/services/courseApi';
import { CourseForm } from '../components/CourseForm';
import { BookOpen, Plus } from 'lucide-react';

interface CreateCourseModalProps {
  extraObject?: any;
}

export const CreateCourseModal: React.FC<CreateCourseModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const handleSubmit = async (values: Omit<Course, 'id'> | Partial<Course>): Promise<boolean> => {
    try {
      setIsSuccess(true);
      
      // Refresh the courses list instead of reloading the page
      await dispatch(fetchCourses());
      
      // Show success briefly then close
      setTimeout(() => {
        handleClose();
      }, 1000);
      
      return true;
    } catch (error) {
      console.error('Failed to create course:', error);
      setIsSuccess(false);
      return false;
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <BookOpen className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Course Created Successfully!</h3>
        <p className="text-gray-600">The new course has been added to your curriculum.</p>
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
          <h3 className="text-lg font-semibold text-gray-900">Create New Course</h3>
          <p className="text-sm text-gray-600">Add a new course to your academic program</p>
        </div>
      </div>

      {/* Form */}
      <div>
        <CourseForm
          onSubmit={handleSubmit}
          isEditing={false}
        />
      </div>
    </div>
  );
};

export default CreateCourseModal; 