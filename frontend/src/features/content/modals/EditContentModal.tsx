import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { updateContent, clearContentError } from '../contentSlice';
import { closeModal } from '../../common/modalSlice';
import { showNotification } from '../../common/commonSlice';
import { fetchCourses } from '../../courses/coursesSlice';
import { Content, UpdateContentRequest } from '../../../api/services/contentApi';

interface EditContentModalProps {
  content: Content;
}

const EditContentModal: React.FC<EditContentModalProps> = ({ content }) => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.content || {});
  const coursesState = useAppSelector((state) => state.courses);
  
  // Provide default values
  const courses = coursesState?.courses || [];

  const [formData, setFormData] = useState<UpdateContentRequest>({
    title: content.title,
    description: content.description || '',
    type: content.type,
    url: content.url,
    courseId: content.courseId,
    active: content.active
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(clearContentError());
  }, [dispatch]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.url?.trim()) {
      newErrors.url = 'URL is required';
    } else {
      try {
        new URL(formData.url);
      } catch {
        newErrors.url = 'Please enter a valid URL';
      }
    }

    if (!formData.courseId || formData.courseId === 0) {
      newErrors.courseId = 'Course is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(updateContent({ id: content.id, contentData: formData })).unwrap();
      dispatch(showNotification({
        type: 'success',
        message: 'Content updated successfully!'
      }));
      dispatch(closeModal({}));
    } catch (error) {
      console.error('Failed to update content:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              name === 'courseId' ? parseInt(value) || 0 : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title || ''}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter content title"
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter content description"
          />
        </div>

        {/* Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Content Type *
          </label>
          <select
            id="type"
            name="type"
            value={formData.type || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="DOCUMENT">Document</option>
            <option value="VIDEO">Video</option>
            <option value="LINK">Link</option>
            <option value="ANNOUNCEMENT">Announcement</option>
            <option value="SCHEDULE">Schedule</option>
          </select>
        </div>

        {/* URL */}
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
            URL *
          </label>
          <input
            type="url"
            id="url"
            name="url"
            value={formData.url || ''}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.url ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="https://example.com/content"
          />
          {errors.url && <p className="text-red-500 text-xs mt-1">{errors.url}</p>}
        </div>

        {/* Course */}
        <div>
          <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 mb-1">
            Course *
          </label>
          <select
            id="courseId"
            name="courseId"
            value={formData.courseId || 0}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.courseId ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value={0}>Select a course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name} ({course.code})
              </option>
            ))}
          </select>
          {errors.courseId && <p className="text-red-500 text-xs mt-1">{errors.courseId}</p>}
        </div>

        {/* Active Status */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="active"
            name="active"
            checked={formData.active || false}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
            Active
          </label>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => dispatch(closeModal({}))}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Updating...' : 'Update Content'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditContentModal; 