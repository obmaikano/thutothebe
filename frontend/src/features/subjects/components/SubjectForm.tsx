import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Subject, CreateSubjectRequest, UpdateSubjectRequest } from '../../../api/services/subjectApi';
import { createSubject, updateSubject } from '../subjectsSlice';
import { fetchDepartments } from '../../departments/departmentsSlice';

interface SubjectFormProps {
  subject?: Subject | null;
  onSubmit?: (subject: Subject) => void;
  onCancel?: () => void;
  mode?: 'create' | 'edit';
}

export const SubjectForm: React.FC<SubjectFormProps> = ({
  subject,
  onSubmit,
  onCancel,
  mode = 'create'
}) => {
  const dispatch = useAppDispatch();
  const { departments } = useAppSelector(state => state.departments);
  
  const [formData, setFormData] = useState<CreateSubjectRequest & { departmentId?: number }>({
    code: '',
    name: '',
    description: '',
    departmentId: undefined,
    active: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load departments when component mounts
    dispatch(fetchDepartments());
  }, [dispatch]);

  useEffect(() => {
    if (subject && mode === 'edit') {
      setFormData({
        code: subject.code,
        name: subject.name,
        description: subject.description || '',
        departmentId: (subject as any).departmentId || undefined,
        active: subject.active
      });
    }
  }, [subject, mode]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Subject code is required';
    } else if (formData.code.length < 2 || formData.code.length > 10) {
      newErrors.code = 'Subject code must be between 2 and 10 characters';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Subject name is required';
    } else if (formData.name.length < 3 || formData.name.length > 100) {
      newErrors.name = 'Subject name must be between 3 and 100 characters';
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
      [name]: type === 'checkbox' ? checked : 
              name === 'departmentId' ? (value ? parseInt(value, 10) : undefined) : 
              value
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
      let result: Subject;
      
      if (mode === 'edit' && subject) {
        const updateData: UpdateSubjectRequest = formData;
        result = await dispatch(updateSubject({ id: subject.id, subjectData: updateData })).unwrap() as Subject;
      } else {
        result = await dispatch(createSubject(formData)).unwrap() as Subject;
      }

      if (onSubmit) {
        onSubmit(result);
      }
    } catch (error: any) {
      console.error('Failed to save subject:', error);
      setErrors({ submit: error.message || 'Failed to save subject' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Subject Code */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Subject Code *</span>
        </label>
        <input
          type="text"
          name="code"
          value={formData.code}
          onChange={handleInputChange}
          className={`input input-bordered ${errors.code ? 'input-error' : ''}`}
          placeholder="e.g., MATH, ENG, SCI"
          maxLength={10}
          disabled={isSubmitting}
        />
        {errors.code && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.code}</span>
          </label>
        )}
      </div>

      {/* Subject Name */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Subject Name *</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className={`input input-bordered ${errors.name ? 'input-error' : ''}`}
          placeholder="e.g., Mathematics, English, Science"
          maxLength={100}
          disabled={isSubmitting}
        />
        {errors.name && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.name}</span>
          </label>
        )}
      </div>

      {/* Department Selection */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Department</span>
        </label>
        <select
          name="departmentId"
          value={formData.departmentId || ''}
          onChange={handleInputChange}
          className={`select select-bordered ${errors.departmentId ? 'select-error' : ''}`}
          disabled={isSubmitting}
        >
          <option value="">Select a department (optional)</option>
          {departments
            .filter(dept => dept.active)
            .map(department => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
        </select>
        {errors.departmentId && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.departmentId}</span>
          </label>
        )}
        <label className="label">
          <span className="label-text-alt">
            Assign this subject to a specific department for better organization
          </span>
        </label>
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
          placeholder="Brief description of the subject (optional)"
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
            {formData.active ? 'Subject is active and available' : 'Subject is inactive'}
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
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              {mode === 'edit' ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            mode === 'edit' ? 'Update Subject' : 'Create Subject'
          )}
        </button>
      </div>
    </form>
  );
};

export default SubjectForm; 