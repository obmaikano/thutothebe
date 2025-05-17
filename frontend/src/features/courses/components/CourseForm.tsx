import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Course } from '../coursesSlice';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';

interface CourseFormProps {
  initialValues?: Partial<Course> | null;
  onSubmit: (values: Omit<Course, 'id'> | Partial<Course>) => Promise<boolean>;
  isEditing?: boolean;
  loading?: boolean;
  error?: string | null;
}

const defaultValues: Omit<Course, 'id'> = {
  name: '',
  code: '',
  description: '',
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date(new Date().setMonth(new Date().getMonth() + 4)).toISOString().slice(0, 10),
  credits: 3,
  instructor: '',
  department: '',
  status: 'upcoming',
  enrollmentCount: 0,
  thumbnail: ''
};

export const CourseForm: React.FC<CourseFormProps> = ({
  initialValues,
  onSubmit,
  isEditing = false,
  loading = false,
  error = null
}) => {
  const [values, setValues] = useState<Omit<Course, 'id'> | Partial<Course>>(defaultValues);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialValues) {
      setValues({
        ...defaultValues,
        ...initialValues,
        // Format dates for date inputs
        startDate: initialValues.startDate ? new Date(initialValues.startDate).toISOString().slice(0, 10) : defaultValues.startDate,
        endDate: initialValues.endDate ? new Date(initialValues.endDate).toISOString().slice(0, 10) : defaultValues.endDate
      });
    }
  }, [initialValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: string | number = value;

    // Convert number inputs to numbers
    if (type === 'number') {
      parsedValue = value === '' ? 0 : Number(value);
    }

    setValues(prev => ({ ...prev, [name]: parsedValue }));
    
    // Clear field-specific error when user changes a value
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Required fields
    if (!values.name) errors.name = 'Course name is required';
    if (!values.code) errors.code = 'Course code is required';
    if (!values.description) errors.description = 'Course description is required';
    if (!values.instructor) errors.instructor = 'Instructor name is required';
    if (!values.department) errors.department = 'Department is required';
    if (!values.startDate) errors.startDate = 'Start date is required';
    if (!values.endDate) errors.endDate = 'End date is required';
    
    // Validate dates
    if (values.startDate && values.endDate) {
      const start = new Date(values.startDate);
      const end = new Date(values.endDate);
      
      if (start > end) {
        errors.endDate = 'End date must be after start date';
      }
    }
    
    // Credits must be positive
    if (typeof values.credits === 'number' && values.credits <= 0) {
      errors.credits = 'Credits must be a positive number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    await onSubmit(values);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to={isEditing && initialValues?.id ? `/app/courses/${initialValues.id}` : '/app/courses'}
          className="inline-flex items-center text-sm text-blue-600 hover:underline"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {isEditing ? 'Back to course details' : 'Back to courses'}
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-6 sm:px-10">
          <h1 className="text-2xl font-bold text-white">
            {isEditing ? 'Edit Course' : 'Create New Course'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 sm:px-10">
          {/* Display error message if any */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Course name */}
            <div className="col-span-2">
              <Input
                label="Course Name"
                name="name"
                value={values.name || ''}
                onChange={handleChange}
                error={formErrors.name}
                required
                className="w-full"
              />
            </div>

            {/* Course code */}
            <div>
              <Input
                label="Course Code"
                name="code"
                value={values.code || ''}
                onChange={handleChange}
                error={formErrors.code}
                required
                className="w-full"
              />
            </div>

            {/* Credits */}
            <div>
              <Input
                label="Credits"
                type="number"
                name="credits"
                value={values.credits?.toString() || '0'}
                onChange={handleChange}
                error={formErrors.credits}
                required
                min={1}
                className="w-full"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="department"
                value={values.department || ''}
                onChange={handleChange}
                className={`w-full rounded-md border ${
                  formErrors.department ? 'border-red-300' : 'border-gray-300'
                } shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
                required
              />
              {formErrors.department && (
                <p className="mt-1 text-sm text-red-600">{formErrors.department}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={values.status || 'upcoming'}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                required
              >
                <option value="upcoming">Upcoming</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Instructor */}
            <div>
              <Input
                label="Instructor"
                name="instructor"
                value={values.instructor || ''}
                onChange={handleChange}
                error={formErrors.instructor}
                required
                className="w-full"
              />
            </div>

            {/* Thumbnail URL */}
            <div>
              <Input
                label="Thumbnail URL (optional)"
                name="thumbnail"
                value={values.thumbnail || ''}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            {/* Start date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="startDate"
                value={values.startDate || ''}
                onChange={handleChange}
                className={`w-full rounded-md border ${
                  formErrors.startDate ? 'border-red-300' : 'border-gray-300'
                } shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
                required
              />
              {formErrors.startDate && (
                <p className="mt-1 text-sm text-red-600">{formErrors.startDate}</p>
              )}
            </div>

            {/* End date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="endDate"
                value={values.endDate || ''}
                onChange={handleChange}
                className={`w-full rounded-md border ${
                  formErrors.endDate ? 'border-red-300' : 'border-gray-300'
                } shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
                required
              />
              {formErrors.endDate && (
                <p className="mt-1 text-sm text-red-600">{formErrors.endDate}</p>
              )}
            </div>

            {/* Course description */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={values.description || ''}
                onChange={handleChange}
                rows={5}
                className={`w-full rounded-md border ${
                  formErrors.description ? 'border-red-300' : 'border-gray-300'
                } shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
                required
              />
              {formErrors.description && (
                <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4 border-t border-gray-200 pt-6">
            <Link
              to={isEditing && initialValues?.id ? `/app/courses/${initialValues.id}` : '/app/courses'}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </Link>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              loading={loading}
            >
              <Save className="h-4 w-4 mr-2" />
              {isEditing ? 'Update Course' : 'Create Course'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}; 