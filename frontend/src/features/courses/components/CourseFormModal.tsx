import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchSubjects } from '../../subjects/subjectsSlice';
import { fetchClasses } from '../../classes/classesSlice';
import { Course, CreateCourseRequest } from '../../../api/services/courseApi';
import { Class } from '../../../api/services/classApi';
import { TextInput } from '../../../components/common/inputs/TextInput';
import { NumberInput } from '../../../components/common/inputs/NumberInput';
import { Select } from '../../../components/common/Select';

interface CourseFormModalProps {
  initialValues?: Partial<Course> | null;
  onSubmit: (values: Omit<Course, 'id'> | Partial<Course>) => Promise<boolean>;
  onCancel: () => void;
  isEditing?: boolean;
  loading?: boolean;
  error?: string | null;
}

const defaultValues: Omit<Course, 'id'> = {
  name: '',
  code: '',
  subjectId: 1,
  classId: 1,
  term: 'FIRST_TERM',
  year: new Date().getFullYear(),
  active: true,
  type: 'CORE',
  instructorIds: []
};

export const CourseFormModal: React.FC<CourseFormModalProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  isEditing = false,
  loading = false,
  error = null
}) => {
  const dispatch = useAppDispatch();
  const { subjects } = useAppSelector(state => state.subjects);
  const { classes } = useAppSelector(state => state.classes);
  const [values, setValues] = useState<Omit<Course, 'id'> | Partial<Course>>(defaultValues);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch subjects and classes on component mount
  useEffect(() => {
    dispatch(fetchSubjects());
    dispatch(fetchClasses());
  }, [dispatch]);

  useEffect(() => {
    if (initialValues) {
      setValues({
        ...defaultValues,
        ...initialValues
      });
    }
  }, [initialValues]);

  const handleInputChange = (name: string, value: any) => {
    let processedValue = value;
    
    // Process specific field types
    if (name === 'code' && typeof value === 'string') {
      processedValue = value.toUpperCase(); // Course code should be uppercase
    }
    
    if (name === 'year') {
      if (typeof value === 'number') {
        processedValue = Math.max(2000, Math.min(2100, value)); // Ensure year is between 2000-2100
      } else if (value === '') {
        processedValue = new Date().getFullYear(); // Default to current year if empty
      }
    }
    
    if (name === 'subjectId' || name === 'classId') {
      processedValue = value === '' ? 1 : Number(value);
    }
    
    setValues(prev => ({ ...prev, [name]: processedValue }));
    
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

    // Required fields validation according to CourseDTO
    if (!values.name || values.name.trim().length === 0) {
      errors.name = 'Course name is required';
    } else if (values.name.trim().length < 3) {
      errors.name = 'Course name must be at least 3 characters';
    } else if (values.name.trim().length > 100) {
      errors.name = 'Course name cannot exceed 100 characters';
    }

    if (!values.code || values.code.trim().length === 0) {
      errors.code = 'Course code is required';
    } else if (values.code.trim().length < 3) {
      errors.code = 'Course code must be at least 3 characters';
    } else if (values.code.trim().length > 20) {
      errors.code = 'Course code cannot exceed 20 characters';
    }

    if (!values.subjectId || values.subjectId <= 0) {
      errors.subjectId = 'Please select a subject';
    }

    if (!values.classId || values.classId <= 0) {
      errors.classId = 'Please select a class';
    }

    if (!values.year || values.year < 2000) {
      errors.year = 'Year must be 2000 or later';
    } else if (values.year > 2100) {
      errors.year = 'Year cannot exceed 2100';
    }

    if (!values.term) {
      errors.term = 'Term is required';
    }

    if (!values.type) {
      errors.type = 'Course type is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      const success = await onSubmit(values);
      if (!success) {
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setIsSubmitting(false);
    }
  };

  const isFormDisabled = isSubmitting || loading;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Display error message if any */}
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Course name */}
        <div className="col-span-2">
          <TextInput
            label="Course Name"
            value={values.name || ''}
            onChange={(value) => handleInputChange('name', value)}
            placeholder="e.g., Advanced Mathematics"
            required
            error={formErrors.name}
            disabled={isFormDisabled}
          />
        </div>

        {/* Course code */}
        <div>
          <TextInput
            label="Course Code"
            value={values.code || ''}
            onChange={(value) => handleInputChange('code', value)}
            placeholder="e.g., MATH101"
            required
            error={formErrors.code}
            disabled={isFormDisabled}
          />
        </div>

        {/* Type */}
        <div>
          <Select
            label="Course Type"
            name="type"
            value={values.type || 'CORE'}
            onChange={(e) => handleInputChange('type', e.target.value)}
            options={[
              { value: 'CORE', label: 'Core' },
              { value: 'ELECTIVE', label: 'Elective' }
            ]}
            required
            disabled={isFormDisabled}
          />
        </div>

        {/* Subject */}
        <div>
          <Select
            label="Subject"
            name="subjectId"
            value={values.subjectId ? String(values.subjectId) : ''}
            onChange={(e) => handleInputChange('subjectId', Number(e.target.value))}
            options={[
              { value: '', label: 'Select a subject' },
              ...subjects.map((subject) => ({ 
                value: String(subject.id), 
                label: `${subject.name} (${subject.code})` 
              }))
            ]}
            required
            error={formErrors.subjectId}
            disabled={isFormDisabled}
          />
        </div>

        {/* Class */}
        <div>
          <Select
            label="Class"
            name="classId"
            value={values.classId ? String(values.classId) : ''}
            onChange={(e) => handleInputChange('classId', Number(e.target.value))}
            options={[
              { value: '', label: 'Select a class' },
              ...classes.map((classItem: Class) => ({ 
                value: String(classItem.id), 
                label: `${classItem.name} (Grade ${classItem.gradeLevel})` 
              }))
            ]}
            required
            error={formErrors.classId}
            disabled={isFormDisabled}
          />
        </div>

        {/* Term */}
        <div>
          <Select
            label="Term"
            name="term"
            value={values.term || 'FIRST_TERM'}
            onChange={(e) => handleInputChange('term', e.target.value)}
            options={[
              { value: 'FIRST_TERM', label: 'First Term' },
              { value: 'SECOND_TERM', label: 'Second Term' },
              { value: 'THIRD_TERM', label: 'Third Term' }
            ]}
            required
            disabled={isFormDisabled}
          />
        </div>

        {/* Year */}
        <div>
          <NumberInput
            label="Year"
            value={values.year || new Date().getFullYear()}
            onChange={(value) => handleInputChange('year', value)}
            min={2000}
            max={2100}
            required
            error={formErrors.year}
            disabled={isFormDisabled}
          />
        </div>

        {/* Active */}
        <div className="flex items-center pt-6">
          <input
            id="active"
            name="active"
            type="checkbox"
            checked={values.active || false}
            onChange={(e) => handleInputChange('active', e.target.checked)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            disabled={isFormDisabled}
          />
          <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
            Active course
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isFormDisabled}
          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isFormDisabled}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isFormDisabled ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              {isEditing ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>
              {isEditing ? 'Update Course' : 'Create Course'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default CourseFormModal; 