import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { Class, CreateClassRequest, UpdateClassRequest } from '../../../api/services/classApi';
import { createClass, updateClass } from '../classesSlice';

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
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Class Name */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Class Name *</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className={`input input-bordered ${errors.name ? 'input-error' : ''}`}
          placeholder="e.g., Grade 1A, Mathematics Advanced"
          maxLength={50}
          disabled={isSubmitting}
        />
        {errors.name && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.name}</span>
          </label>
        )}
      </div>

      {/* Grade */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Grade *</span>
        </label>
        <select
          name="grade"
          value={formData.grade}
          onChange={handleInputChange}
          className={`select select-bordered ${errors.grade ? 'select-error' : ''}`}
          disabled={isSubmitting}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map(grade => (
            <option key={grade} value={grade}>Grade {grade}</option>
          ))}
        </select>
        {errors.grade && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.grade}</span>
          </label>
        )}
      </div>

      {/* Capacity */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Capacity</span>
        </label>
        <input
          type="number"
          name="capacity"
          value={formData.capacity || ''}
          onChange={handleInputChange}
          className={`input input-bordered ${errors.capacity ? 'input-error' : ''}`}
          placeholder="Maximum number of students"
          min={1}
          max={100}
          disabled={isSubmitting}
        />
        {errors.capacity && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.capacity}</span>
          </label>
        )}
      </div>

      {/* Description */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Description</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className={`textarea textarea-bordered ${errors.description ? 'textarea-error' : ''}`}
          placeholder="Brief description of the class (optional)"
          rows={3}
          maxLength={500}
          disabled={isSubmitting}
        />
        <label className="label">
          <span className="label-text-alt">{(formData.description || '').length}/500 characters</span>
        </label>
        {errors.description && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.description}</span>
          </label>
        )}
      </div>

      {/* Active Status */}
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text font-medium">Active Status</span>
          <input
            type="checkbox"
            name="active"
            checked={formData.active}
            onChange={handleInputChange}
            className="checkbox checkbox-primary"
            disabled={isSubmitting}
          />
        </label>
        <label className="label">
          <span className="label-text-alt">
            {formData.active ? 'Class is active and available' : 'Class is inactive'}
          </span>
        </label>
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="alert alert-error">
          <span>{errors.submit}</span>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-ghost"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Update Class' : 'Create Class'}
        </button>
      </div>
    </form>
  );
};

export default ClassForm; 