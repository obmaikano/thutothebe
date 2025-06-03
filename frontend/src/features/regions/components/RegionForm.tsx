import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { Region, CreateRegionRequest, UpdateRegionRequest } from '../../../api/services/regionApi';
import { createRegion, updateRegion } from '../regionsSlice';
import SecurityManager, { ValidationSchemas } from '../../../utils/security';
import { handleApiError } from '../../../utils/errorHandling';

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
  const security = SecurityManager.getInstance();
  const [formData, setFormData] = useState<CreateRegionRequest>({
    code: '',
    name: '',
    description: '',
    active: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originalCode, setOriginalCode] = useState<string>('');

  useEffect(() => {
    if (region && mode === 'edit') {
      setFormData({
        code: region.code,
        name: region.name,
        description: region.description || '',
        active: region.active
      });
      setOriginalCode(region.code);
    }
  }, [region, mode]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate region code
    if (!formData.code.trim()) {
      newErrors.code = 'Region code is required';
    } else {
      const sanitizedCode = security.sanitizeTextInput(formData.code.trim().toUpperCase());
      if (sanitizedCode !== formData.code.trim().toUpperCase()) {
        newErrors.code = 'Region code contains invalid characters';
      } else if (!ValidationSchemas.regionName.pattern.test(sanitizedCode)) {
        newErrors.code = 'Region code can only contain letters, numbers, spaces, hyphens, and periods';
      } else if (sanitizedCode.length < 2 || sanitizedCode.length > 10) {
        newErrors.code = 'Region code must be between 2 and 10 characters';
      }
    }

    // Validate region name
    if (!formData.name.trim()) {
      newErrors.name = 'Region name is required';
    } else {
      const sanitizedName = security.sanitizeTextInput(formData.name.trim());
      if (sanitizedName !== formData.name.trim()) {
        newErrors.name = 'Region name contains invalid characters';
      } else if (!ValidationSchemas.regionName.pattern.test(sanitizedName)) {
        newErrors.name = 'Region name can only contain letters, numbers, spaces, hyphens, apostrophes, and periods';
      } else if (sanitizedName.length < ValidationSchemas.regionName.minLength || 
                 sanitizedName.length > ValidationSchemas.regionName.maxLength) {
        newErrors.name = `Region name must be between ${ValidationSchemas.regionName.minLength} and ${ValidationSchemas.regionName.maxLength} characters`;
      }
    }

    // Validate description
    if (formData.description) {
      const sanitizedDescription = security.sanitizeTextInput(formData.description.trim());
      if (sanitizedDescription !== formData.description.trim()) {
        newErrors.description = 'Description contains invalid characters';
      } else if (sanitizedDescription.length > 500) {
        newErrors.description = 'Description cannot exceed 500 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    let processedValue = value;
    
    // Sanitize input based on field type
    if (type !== 'checkbox') {
      if (name === 'code') {
        // Convert to uppercase and sanitize
        processedValue = security.sanitizeTextInput(value.toUpperCase());
      } else if (name === 'name' || name === 'description') {
        // Sanitize text input
        processedValue = security.sanitizeTextInput(value);
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : processedValue
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
    setErrors({}); // Clear any previous errors
    
    try {
      let result: Region;
      const processedData = {
        code: formData.code.trim().toUpperCase(),
        name: formData.name.trim(),
        description: formData.description?.trim() || undefined,
        active: formData.active
      };
      
      if (mode === 'edit' && region) {
        const updateData: UpdateRegionRequest = processedData;
        result = await dispatch(updateRegion({ id: region.id, regionData: updateData })).unwrap() as Region;
      } else {
        const createData: CreateRegionRequest = processedData;
        result = await dispatch(createRegion(createData)).unwrap() as Region;
      }

      if (onSubmit) {
        onSubmit(result);
      }
    } catch (error: any) {
      console.error('Failed to save region:', error);
      
      // Use enhanced error handling
      const processedError = handleApiError(
        error,
        mode === 'edit' ? 'update' : 'create',
        'region',
        region, // original data
        formData // new data
      );

      // Apply field-specific errors
      const newErrors: Record<string, string> = { ...processedError.fieldErrors };
      
      // Add general error message
      if (processedError.message) {
        newErrors.submit = processedError.message;
        
        // Add suggestions if available
        if (processedError.suggestions.length > 0) {
          newErrors.suggestions = processedError.suggestions.join('\n');
        }
      }

      setErrors(newErrors);
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
          <span className="label-text-alt text-gray-500">
            {mode === 'edit' ? 'Current: ' + originalCode : 'Auto-formatted to uppercase'}
          </span>
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
        <label className="label">
          <span className="label-text-alt text-gray-500">
            2-10 characters, letters and numbers only
          </span>
        </label>
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
          maxLength={50}
          disabled={isSubmitting}
        />
        {errors.name && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.name}</span>
          </label>
        )}
        <label className="label">
          <span className="label-text-alt text-gray-500">
            {formData.name.length}/50 characters
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
          <div className="flex flex-col">
            <span className="font-medium">Error saving region:</span>
            <span>{errors.submit}</span>
            {errors.suggestions && (
              <div className="mt-2 text-sm">
                <strong>Suggestions:</strong>
                <ul className="list-disc list-inside mt-1">
                  {errors.suggestions.split('\n').map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
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