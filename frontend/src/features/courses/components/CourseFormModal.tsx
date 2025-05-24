import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchSubjects } from '../../subjects/subjectsSlice';
import { fetchClasses } from '../../classes/classesSlice';
import { Course } from '../../../api/services/courseApi';
import { Class } from '../../../api/services/classApi';

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
  term: 'FIRST',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: string | number | boolean = value;

    // Convert number inputs to numbers
    if (type === 'number') {
      parsedValue = value === '' ? 0 : Number(value);
    }

    // Convert checkbox inputs to boolean
    if (type === 'checkbox') {
      parsedValue = (e.target as HTMLInputElement).checked;
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
    if (!values.subjectId || values.subjectId <= 0) errors.subjectId = 'Subject is required';
    if (!values.classId || values.classId <= 0) errors.classId = 'Class is required';
    if (!values.year || values.year <= 0) errors.year = 'Year is required';

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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={values.name || ''}
            onChange={handleChange}
            className={`w-full rounded-md border ${
              formErrors.name ? 'border-red-300' : 'border-gray-300'
            } shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
            required
          />
          {formErrors.name && (
            <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
          )}
        </div>

        {/* Course code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="code"
            value={values.code || ''}
            onChange={handleChange}
            className={`w-full rounded-md border ${
              formErrors.code ? 'border-red-300' : 'border-gray-300'
            } shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
            required
          />
          {formErrors.code && (
            <p className="mt-1 text-sm text-red-600">{formErrors.code}</p>
          )}
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course Type <span className="text-red-500">*</span>
          </label>
          <select
            name="type"
            value={values.type || 'CORE'}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
          >
            <option value="CORE">Core</option>
            <option value="ELECTIVE">Elective</option>
          </select>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject <span className="text-red-500">*</span>
          </label>
          <select
            name="subjectId"
            value={values.subjectId || ''}
            onChange={handleChange}
            className={`w-full rounded-md border ${
              formErrors.subjectId ? 'border-red-300' : 'border-gray-300'
            } shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
            required
          >
            <option value="">Select a subject</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name} ({subject.code})
              </option>
            ))}
          </select>
          {formErrors.subjectId && (
            <p className="mt-1 text-sm text-red-600">{formErrors.subjectId}</p>
          )}
        </div>

        {/* Class */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Class <span className="text-red-500">*</span>
          </label>
          <select
            name="classId"
            value={values.classId || ''}
            onChange={handleChange}
            className={`w-full rounded-md border ${
              formErrors.classId ? 'border-red-300' : 'border-gray-300'
            } shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
            required
          >
            <option value="">Select a class</option>
            {classes.map((classItem: Class) => (
              <option key={classItem.id} value={classItem.id}>
                {classItem.name} (Grade {classItem.grade})
              </option>
            ))}
          </select>
          {formErrors.classId && (
            <p className="mt-1 text-sm text-red-600">{formErrors.classId}</p>
          )}
        </div>

        {/* Term */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Term <span className="text-red-500">*</span>
          </label>
          <select
            name="term"
            value={values.term || 'FIRST'}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
          >
            <option value="FIRST">First Term</option>
            <option value="SECOND">Second Term</option>
            <option value="THIRD">Third Term</option>
          </select>
        </div>

        {/* Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="year"
            value={values.year || new Date().getFullYear()}
            onChange={handleChange}
            min={new Date().getFullYear() - 5}
            max={new Date().getFullYear() + 5}
            className={`w-full rounded-md border ${
              formErrors.year ? 'border-red-300' : 'border-gray-300'
            } shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
            required
          />
          {formErrors.year && (
            <p className="mt-1 text-sm text-red-600">{formErrors.year}</p>
          )}
        </div>

        {/* Active */}
        <div className="flex items-center pt-6">
          <input
            id="active"
            name="active"
            type="checkbox"
            checked={values.active || false}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
          disabled={loading}
          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
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