import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { Region, CreateRegionRequest, UpdateRegionRequest } from '../../../api/services/regionApi';
import { createRegion, updateRegion } from '../regionsSlice';

interface RegionFormProps {
  region?: Region | null;
  onSubmit?: (region: Region) => void;
  onCancel?: () => void;
  mode?: 'create' | 'edit';
}

export const RegionForm: React.FC<RegionFormProps> = ({
  region,
  onSubmit,
  onCancel,
  mode = 'create'
}) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<CreateRegionRequest>({
    code: '',
    name: '',
    description: '',
    active: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (region && mode === 'edit') {
      setFormData({
        code: region.code,
        name: region.name,
        description: region.description || '',
        active: region.active
      });
    }
  }, [region, mode]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Region code is required';
    } else if (formData.code.length < 2 || formData.code.length > 10) {
      newErrors.code = 'Region code must be between 2 and 10 characters';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Region name is required';
    } else if (formData.name.length < 3 || formData.name.length > 100) {
      newErrors.name = 'Region name must be between 3 and 100 characters';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
      let result: Region;
      
      if (mode === 'edit' && region) {
        const updateData: UpdateRegionRequest = formData;
        result = await dispatch(updateRegion({ id: region.id, regionData: updateData })).unwrap() as Region;
      } else {
        result = await dispatch(createRegion(formData)).unwrap() as Region;
      }

      if (onSubmit) {
        onSubmit(result);
      }
    } catch (error: any) {
      console.error('Failed to save region:', error);
      setErrors({ submit: error.message || 'Failed to save region' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Region Code */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Region Code *</span>
        </label>
        <input
          type="text"
          name="code"
          value={formData.code}
          onChange={handleInputChange}
          className={`input input-bordered ${errors.code ? 'input-error' : ''}`}
          placeholder="e.g., REG001, NORTH, SOUTH"
          maxLength={10}
          disabled={isSubmitting}
        />
        {errors.code && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.code}</span>
          </label>
        )}
      </div>

      {/* Region Name */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Region Name *</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className={`input input-bordered ${errors.name ? 'input-error' : ''}`}
          placeholder="e.g., Northern Region, Central Province"
          maxLength={100}
          disabled={isSubmitting}
        />
        {errors.name && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.name}</span>
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
          placeholder="Brief description of the region (optional)"
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
            {formData.active ? 'Region is active and operational' : 'Region is inactive'}
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
          {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Update Region' : 'Create Region'}
        </button>
      </div>
    </form>
  );
};

export default RegionForm; 