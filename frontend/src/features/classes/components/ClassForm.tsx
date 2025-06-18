import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import classApi, { Class, CreateClassRequest, UpdateClassRequest } from '../../../api/services/classApi';
import { createClass, updateClass } from '../classesSlice';
import { fetchSchools } from '../../schools/schoolsSlice';
import { TextInput } from '../../../components/common/inputs/TextInput';
import { NumberInput } from '../../../components/common/inputs/NumberInput';
import { Select } from '../../../components/common/Select';
import { TextArea } from '../../../components/common/inputs/TextArea';

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
  const user = useAppSelector(state => state.auth.user);
  const [formData, setFormData] = useState<CreateClassRequest>({
    name: '',
    gradeLevel: '',
    schoolId: user?.schoolId ?? 1,
    active: true,
    description: '',
    capacity: 30
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gradeLevels, setGradeLevels] = useState<string[]>([]);
  const [isGradeLevelsLoading, setIsGradeLevelsLoading] = useState(false);
  const [gradeLevelsError, setGradeLevelsError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchSchools());
  }, [dispatch]);

  useEffect(() => {
    if (classData && mode === 'edit') {
      setFormData({
        name: classData.name,
        gradeLevel: classData.gradeLevel,
        schoolId: classData.schoolId ?? user?.schoolId ?? 1,
        active: classData.active,
        description: classData.description || '',
        capacity: classData.capacity || 30
      });
    } else if (mode === 'create') {
      setFormData(prev => ({
        ...prev,
        schoolId: user?.schoolId || 1
      }));
    }
  }, [classData, mode, user?.schoolId]);

  useEffect(() => {
    setIsGradeLevelsLoading(true);
    classApi.getGradeLevels()
      .then(res => {
        setGradeLevels(res.data.data || []);
        setGradeLevelsError(null);
      })
      .catch(err => {
        setGradeLevelsError('Failed to load grade levels');
        setGradeLevels([]);
      })
      .finally(() => setIsGradeLevelsLoading(false));
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Class name is required';
    } else if (formData.name.length < 2 || formData.name.length > 50) {
      newErrors.name = 'Class name must be between 2 and 50 characters';
    }

    if (!formData.gradeLevel) {
      newErrors.gradeLevel = 'Grade level is required';
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

    setFormData((prev: CreateClassRequest) => ({
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
          <TextInput
            label="Class Name"
            value={formData.name}
            onChange={value => handleInputChange({ target: { name: 'name', value } } as any)}
            placeholder="e.g., Standard 1A"
            required
            error={errors.name}
          />
        </div>

        {/* Grade Level */}
        <div>
          <Select
            label="Grade Level"
            name="gradeLevel"
            value={formData.gradeLevel || ''}
            onChange={e => handleInputChange(e as any)}
            options={gradeLevels.map(level => ({ value: level, label: level.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }))}
            required
            error={errors.gradeLevel}
            disabled={isGradeLevelsLoading}
          />
        </div>

        {/* School */}
        <div>
          <Select
            label="School"
            name="schoolId"
            value={formData.schoolId ? String(formData.schoolId) : ''}
            onChange={e => handleInputChange({ target: { name: 'schoolId', value: Number(e.target.value) } } as any)}
            options={schools.map(school => ({ value: String(school.id), label: school.name }))}
            required
            error={errors.schoolId}
            disabled={isSubmitting}
          />
        </div>

        {/* Capacity */}
        <div>
          <NumberInput
            label="Capacity"
            value={typeof formData.capacity === 'number' ? formData.capacity : ''}
            onChange={value => handleInputChange({ target: { name: 'capacity', value } } as any)}
            min={1}
            max={100}
            required
            error={errors.capacity}
            disabled={isSubmitting}
          />
        </div>

        {/* Active */}
        <div className="flex items-center mt-6">
          <label className="mr-2 text-sm font-medium text-gray-700">Active</label>
          <input
            type="checkbox"
            name="active"
            checked={formData.active}
            onChange={handleInputChange}
            className="checkbox checkbox-primary"
            disabled={isSubmitting}
          />
        </div>

        {/* Description */}
        <div className="col-span-2">
          <TextArea
            label="Description"
            value={formData.description || ''}
            onChange={value => handleInputChange({ target: { name: 'description', value } } as any)}
            placeholder="Optional class description (max 500 characters)"
            error={errors.description}
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Create Class'}
        </button>
      </div>
    </form>
  );
};

export default ClassForm; 