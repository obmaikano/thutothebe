import React, { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { fetchCourses } from '../coursesSlice';
import { Course } from '../../../api/services/courseApi';
import { CourseForm } from '../components/CourseForm';
import { BookOpen, Edit } from 'lucide-react';

interface EditCourseModalProps {
  extraObject?: Course;
}

export const EditCourseModal: React.FC<EditCourseModalProps> = ({ extraObject }) => {
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
      console.error('Failed to update course:', error);
      setIsSuccess(false);
      return false;
    }
  };

  if (!extraObject) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-red-100 p-3">
            <BookOpen className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Course Data</h3>
        <p className="text-gray-600 mb-4">No course information was provided for editing.</p>
        <button
          onClick={handleClose}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <BookOpen className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Course Updated Successfully!</h3>
        <p className="text-gray-600">The course information has been saved.</p>
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
          <h3 className="text-lg font-semibold text-gray-900">Edit Course</h3>
          <p className="text-sm text-gray-600">Update the information for "{extraObject.name}"</p>
        </div>
      </div>

      {/* Course Info Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BookOpen className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{extraObject.name}</div>
            <div className="text-sm text-gray-500">Code: {extraObject.code}</div>
          </div>
          <div className="ml-auto">
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
              extraObject.active 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {extraObject.active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      {/* Form */}
      <div>
        <CourseForm
          initialValues={extraObject}
          onSubmit={handleSubmit}
          isEditing={true}
        />
      </div>
    </div>
  );
};

export default EditCourseModal; 