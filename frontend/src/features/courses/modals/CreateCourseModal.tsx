import React, { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { createCourse, fetchCourses } from '../coursesSlice';
import { Course, CreateCourseRequest } from '../../../api/services/courseApi';
import CourseFormModal from '../components/CourseFormModal';
import { BookOpen, Plus } from 'lucide-react';

interface CreateCourseModalProps {
  extraObject?: any;
}

export const CreateCourseModal: React.FC<CreateCourseModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const handleSubmit = async (values: Omit<Course, 'id'> | Partial<Course>): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Transform the data to match CreateCourseRequest structure
      const courseData: CreateCourseRequest = {
        code: (values.code || '').trim(),
        name: (values.name || '').trim(),
        subjectId: Number(values.subjectId) || 1,
        classId: Number(values.classId) || 1,
        term: values.term || 'FIRST_TERM',
        year: Number(values.year) || new Date().getFullYear(),
        active: Boolean(values.active),
        type: values.type || 'CORE',
        instructorIds: Array.isArray(values.instructorIds) ? values.instructorIds : []
      };

      // Debug: Log the data being sent
      console.log('Sending course data:', JSON.stringify(courseData, null, 2));

      await dispatch(createCourse(courseData)).unwrap();
      
      setIsSuccess(true);
      
      // Refresh the courses list
      await dispatch(fetchCourses());
      
      // Show success briefly then close
      setTimeout(() => {
        handleClose();
      }, 1000);
      
      return true;
    } catch (error: any) {
      console.error('Failed to create course:', error);
      setError(error.message || 'Failed to create course');
      return false;
    } finally {
      setIsLoading(false);
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

      {/* Course Info Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BookOpen className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">New Course</div>
            <div className="text-sm text-gray-500">Fill in the details below to create a course.</div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div>
        <CourseFormModal
          onSubmit={handleSubmit}
          onCancel={handleClose}
          isEditing={false}
          loading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
};

export default CreateCourseModal; 