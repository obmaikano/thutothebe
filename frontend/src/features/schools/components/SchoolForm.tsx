import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { School, CreateSchoolRequest, UpdateSchoolRequest } from '../../../api/services/schoolApi';
import { createSchool, updateSchool } from '../schoolsSlice';
import { fetchActiveRegions } from '../../regions/regionsSlice';
import { Region } from '../../../api/services/regionApi';

interface SchoolFormProps {
  school?: School | null;
  onSubmit?: (school: School) => void;
  onCancel?: () => void;
  mode?: 'create' | 'edit';
}

export const SchoolForm: React.FC<SchoolFormProps> = ({
  school,
  onSubmit,
  onCancel,
  mode = 'create'
}) => {
  const dispatch = useAppDispatch();
  const { regions } = useAppSelector(state => state.regions);
  const [formData, setFormData] = useState<CreateSchoolRequest>({
    code: '',
    name: '',
    description: '',
    regionId: 0,
    active: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch regions when component mounts
    dispatch(fetchActiveRegions());
  }, [dispatch]);

  useEffect(() => {
    if (school && mode === 'edit') {
      setFormData({
        code: school.code,
        name: school.name,
        description: school.description || '',
        regionId: school.regionId,
        active: school.active
      });
    }
  }, [school, mode]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = 'School code is required';
    } else if (formData.code.length < 2 || formData.code.length > 10) {
      newErrors.code = 'School code must be between 2 and 10 characters';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'School name is required';
    } else if (formData.name.length < 3 || formData.name.length > 100) {
      newErrors.name = 'School name must be between 3 and 100 characters';
    }

    if (!formData.regionId || formData.regionId === 0) {
      newErrors.regionId = 'Please select a region';
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
      [name]: type === 'checkbox' ? checked : (name === 'regionId' ? parseInt(value) : value)
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
      let result: School;
      
      if (mode === 'edit' && school) {
        const updateData: UpdateSchoolRequest = formData;
        result = await dispatch(updateSchool({ id: school.id, schoolData: updateData })).unwrap() as School;
      } else {
        result = await dispatch(createSchool(formData)).unwrap() as School;
      }

      if (onSubmit) {
        onSubmit(result);
      }
    } catch (error: any) {
      console.error('Failed to save school:', error);
      setErrors({ submit: error.message || 'Failed to save school' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRegionName = (regionId: number) => {
    const region = regions.find((r: Region) => r.id === regionId);
    return region ? region.name : 'Unknown Region';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* School Code */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">School Code *</span>
        </label>
        <input
          type="text"
          name="code"
          value={formData.code}
          onChange={handleInputChange}
          className={`input input-bordered ${errors.code ? 'input-error' : ''}`}
          placeholder="e.g., SCH001, PS001, HS001"
          maxLength={10}
          disabled={isSubmitting}
        />
        {errors.code && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.code}</span>
          </label>
        )}
      </div>

      {/* School Name */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">School Name *</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className={`input input-bordered ${errors.name ? 'input-error' : ''}`}
          placeholder="e.g., Central Primary School, Mountain High School"
          maxLength={100}
          disabled={isSubmitting}
        />
        {errors.name && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.name}</span>
          </label>
        )}
      </div>

      {/* Region */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Region *</span>
        </label>
        <select
          name="regionId"
          value={formData.regionId}
          onChange={handleInputChange}
          className={`select select-bordered ${errors.regionId ? 'select-error' : ''}`}
          disabled={isSubmitting}
        >
          <option value={0}>Select a region</option>
          {regions.map((region: Region) => (
            <option key={region.id} value={region.id}>
              {region.name} ({region.code})
            </option>
          ))}
        </select>
        {errors.regionId && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.regionId}</span>
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
          placeholder="Brief description of the school (optional)"
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
            {formData.active ? 'School is active and operational' : 'School is inactive'}
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
          {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Update School' : 'Create School'}
        </button>
      </div>
    </form>
  );
};

export default SchoolForm; 