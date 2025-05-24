import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Class, CreateClassRequest, UpdateClassRequest } from '../../../api/services/classApi';
import { createClass, updateClass } from '../classesSlice';
import { fetchSchools } from '../../schools/schoolsSlice';

interface ClassFormProps {
  class?: Class | null;
  onSubmit?: (classData: Class) => void;
  onCancel?: () => void;
  mode?: 'create' | 'edit';
}

export const ClassForm: React.FC<ClassFormProps> = ({
  class: classData,
  onSubmit,
  onCancel,
  mode = 'create'
}) => {
  const dispatch = useAppDispatch();
  const { schools } = useAppSelector(state => state.schools);
  const [formData, setFormData] = useState<CreateClassRequest>({
    name: '',
    grade: 1,
    schoolId: 1, // This should be dynamic based on user's school
    active: true,
    description: '',
    capacity: 30
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchSchools());
  }, [dispatch]);

  useEffect(() => {
    if (classData && mode === 'edit') {
      setFormData({
        name: classData.name,
        grade: classData.grade,
        schoolId: classData.schoolId,
        active: classData.active,
        description: classData.description || '',
        capacity: classData.capacity || 30
      });
    }
  }, [classData, mode]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Class name is required';
    } else if (formData.name.length < 2 || formData.name.length > 50) {
      newErrors.name = 'Class name must be between 2 and 50 characters';
    }

    if (formData.grade < 1 || formData.grade > 12) {
      newErrors.grade = 'Grade must be between 1 and 12';
    }

    if (formData.capacity && (formData.capacity < 1 || formData.capacity > 100)) {
      newErrors.capacity = 'Capacity must be between 1 and 100';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
    }

    if (!formData.schoolId || formData.schoolId <= 0) {
      newErrors.schoolId = 'School is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      let result: Class;
      
      if (mode === 'edit' && classData) {
        const updateData: UpdateClassRequest = formData;
        result = await dispatch(updateClass({ id: classData.id, classData: updateData })).unwrap() as Class;
      } else {
        result = await dispatch(createClass(formData)).unwrap() as Class;
      }

      if (onSubmit) {
        onSubmit(result);
      }
    } catch (error: any) {
      console.error('Failed to save class:', error);
      setErrors({ submit: error.message || 'Failed to save class' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Display error message if any */}
      {errors.submit && (
        <div className="p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
          {errors.submit}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Class Name */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Class Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full rounded-md border ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            } shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
            placeholder="e.g., Grade 1A, Mathematics Advanced"
            maxLength={50}
            disabled={isSubmitting}
            required
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Grade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Grade <span className="text-red-500">*</span>
          </label>
          <select
            name="grade"
            value={formData.grade}
            onChange={handleInputChange}
            className={`w-full rounded-md border ${
              errors.grade ? 'border-red-300' : 'border-gray-300'
            } shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
            disabled={isSubmitting}
            required
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(grade => (
              <option key={grade} value={grade}>Grade {grade}</option>
            ))}
          </select>
          {errors.grade && (
            <p className="mt-1 text-sm text-red-600">{errors.grade}</p>
          )}
        </div>

        {/* School */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            School <span className="text-red-500">*</span>
          </label>
          <select
            name="schoolId"
            value={formData.schoolId}
            onChange={handleInputChange}
            className={`w-full rounded-md border ${
              errors.schoolId ? 'border-red-300' : 'border-gray-300'
            } shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
            disabled={isSubmitting}
            required
          >
            <option value="">Select a school</option>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
          {errors.schoolId && (
            <p className="mt-1 text-sm text-red-600">{errors.schoolId}</p>
          )}
        </div>

        {/* Capacity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Capacity
          </label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity || ''}
            onChange={handleInputChange}
            className={`w-full rounded-md border ${
              errors.capacity ? 'border-red-300' : 'border-gray-300'
            } shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
            placeholder="Maximum number of students"
            min={1}
            max={100}
            disabled={isSubmitting}
          />
          {errors.capacity && (
            <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>
          )}
        </div>

        {/* Description */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className={`w-full rounded-md border ${
              errors.description ? 'border-red-300' : 'border-gray-300'
            } shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
            placeholder="Brief description of the class (optional)"
            rows={3}
            maxLength={500}
            disabled={isSubmitting}
          />
          <div className="mt-1 text-sm text-gray-500">
            {(formData.description || '').length}/500 characters
          </div>
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Active Status */}
        <div className="flex items-center pt-6">
          <input
            id="active"
            name="active"
            type="checkbox"
            checked={formData.active}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            disabled={isSubmitting}
          />
          <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
            Active class
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              {mode === 'edit' ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>
              {mode === 'edit' ? 'Update Class' : 'Create Class'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ClassForm; 