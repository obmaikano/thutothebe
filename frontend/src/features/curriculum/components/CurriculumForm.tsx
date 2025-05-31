import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Curriculum, CreateCurriculumRequest, UpdateCurriculumRequest } from '../../../api/services/curriculumApi';
import { createCurriculum, updateCurriculum } from '../curriculumSlice';
import enumApi, { getGradeLevelOptions, getCurriculumTypeOptions, GradeLevelOption } from '../../../api/services/enumApi';

interface CurriculumFormProps {
  curriculum?: Curriculum | null;
  onSubmit?: (curriculum: Curriculum) => void;
  onCancel?: () => void;
  mode?: 'create' | 'edit';
}

export const CurriculumForm: React.FC<CurriculumFormProps> = ({
  curriculum,
  onSubmit,
  onCancel,
  mode = 'create'
}) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  
  const [formData, setFormData] = useState<CreateCurriculumRequest>({
    title: '',
    description: '',
    curriculumType: 'SCHOOL_SPECIFIC',
    gradeLevel: 'STANDARD_1',
    status: 'DRAFT',
    academicYear: new Date().getFullYear(),
    effectiveDate: '',
    expiryDate: '',
    learningOutcomes: '',
    durationWeeks: 0,
    totalHours: 0,
    createdById: user?.id || 0,
    active: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gradeLevelOptions, setGradeLevelOptions] = useState<GradeLevelOption[]>([]);
  const [curriculumTypeOptions, setCurriculumTypeOptions] = useState<GradeLevelOption[]>([]);
  const [isLoadingEnums, setIsLoadingEnums] = useState(true);

  // Update createdById when user changes
  useEffect(() => {
    if (user?.id && mode === 'create') {
      setFormData(prev => ({ ...prev, createdById: user.id }));
    }
  }, [user, mode]);

  // Load enum options on component mount
  useEffect(() => {
    const loadEnums = async () => {
      try {
        setIsLoadingEnums(true);
        const [gradeLevelsResponse, curriculumTypesResponse] = await Promise.all([
          enumApi.getGradeLevels(),
          enumApi.getCurriculumTypes()
        ]);

        if (gradeLevelsResponse.data.data) {
          setGradeLevelOptions(getGradeLevelOptions(gradeLevelsResponse.data.data));
        }

        if (curriculumTypesResponse.data.data) {
          setCurriculumTypeOptions(getCurriculumTypeOptions(curriculumTypesResponse.data.data));
        }
      } catch (error) {
        console.error('Failed to load enum options:', error);
        // Fallback to hardcoded options matching the backend enum values
        setGradeLevelOptions([
          { value: 'STANDARD_1', label: 'Standard 1' },
          { value: 'STANDARD_2', label: 'Standard 2' },
          { value: 'STANDARD_3', label: 'Standard 3' },
          { value: 'STANDARD_4', label: 'Standard 4' },
          { value: 'STANDARD_5', label: 'Standard 5' },
          { value: 'STANDARD_6', label: 'Standard 6' },
          { value: 'STANDARD_7', label: 'Standard 7' },
          { value: 'FORM_1', label: 'Form 1' },
          { value: 'FORM_2', label: 'Form 2' },
          { value: 'FORM_3', label: 'Form 3' },
          { value: 'FORM_4', label: 'Form 4' },
          { value: 'FORM_5', label: 'Form 5' },
          { value: 'FORM_6', label: 'Form 6' },
          { value: 'KINDERGARTEN', label: 'Kindergarten' },
          { value: 'PRE_KINDERGARTEN', label: 'Pre-Kindergarten' }
        ]);
        setCurriculumTypeOptions([
          { value: 'NATIONAL', label: 'National' },
          { value: 'REGIONAL', label: 'Regional' },
          { value: 'SCHOOL_SPECIFIC', label: 'School-Specific' },
          { value: 'INTERNATIONAL', label: 'International' },
          { value: 'VOCATIONAL', label: 'Vocational' },
          { value: 'SPECIAL_NEEDS', label: 'Special Needs' }
        ]);
      } finally {
        setIsLoadingEnums(false);
      }
    };

    loadEnums();
  }, []);

  useEffect(() => {
    if (curriculum && mode === 'edit') {
      setFormData({
        title: curriculum.title,
        description: curriculum.description || '',
        curriculumType: curriculum.curriculumType,
        gradeLevel: curriculum.gradeLevel,
        status: curriculum.status,
        academicYear: curriculum.academicYear,
        effectiveDate: curriculum.effectiveDate || '',
        expiryDate: curriculum.expiryDate || '',
        learningOutcomes: curriculum.learningOutcomes || '',
        durationWeeks: curriculum.durationWeeks || 0,
        totalHours: curriculum.totalHours || 0,
        createdById: curriculum.createdById,
        active: curriculum.active
      });
    }
  }, [curriculum, mode]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3 || formData.title.length > 200) {
      newErrors.title = 'Title must be between 3 and 200 characters';
    }

    if (!formData.academicYear || formData.academicYear < 2020 || formData.academicYear > 2030) {
      newErrors.academicYear = 'Valid academic year is required (2020-2030)';
    }

    if (formData.durationWeeks && formData.durationWeeks < 0) {
      newErrors.durationWeeks = 'Duration must be positive';
    }

    if (formData.totalHours && formData.totalHours < 0) {
      newErrors.totalHours = 'Total hours must be positive';
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Description cannot exceed 1000 characters';
    }

    if (formData.learningOutcomes && formData.learningOutcomes.length > 2000) {
      newErrors.learningOutcomes = 'Learning outcomes cannot exceed 2000 characters';
    }

    if (!formData.createdById) {
      newErrors.createdById = 'User information is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    let processedValue: any = value;
    if (type === 'checkbox') {
      processedValue = checked;
    } else if (type === 'number') {
      processedValue = value === '' ? 0 : parseInt(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
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
      let result: Curriculum;
      
      if (mode === 'edit' && curriculum) {
        const updateData: UpdateCurriculumRequest = formData;
        result = await dispatch(updateCurriculum({ id: curriculum.id, curriculumData: updateData })).unwrap() as Curriculum;
      } else {
        result = await dispatch(createCurriculum(formData)).unwrap() as Curriculum;
      }

      if (onSubmit) {
        onSubmit(result);
      }
    } catch (error: any) {
      console.error('Failed to save curriculum:', error);
      setErrors({ submit: error.message || 'Failed to save curriculum' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingEnums) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="loading loading-spinner loading-lg"></div>
        <span className="ml-2">Loading form options...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Title *</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className={`input input-bordered ${errors.title ? 'input-error' : ''}`}
          placeholder="Enter curriculum title"
          maxLength={200}
          disabled={isSubmitting}
        />
        {errors.title && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.title}</span>
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
          placeholder="Brief description of the curriculum (optional)"
          rows={3}
          maxLength={1000}
          disabled={isSubmitting}
        />
        <label className="label">
          <span className="label-text-alt">{(formData.description || '').length}/1000 characters</span>
        </label>
        {errors.description && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.description}</span>
          </label>
        )}
      </div>

      {/* Curriculum Type and Grade Level */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Curriculum Type *</span>
          </label>
          <select
            name="curriculumType"
            value={formData.curriculumType}
            onChange={handleInputChange}
            className="select select-bordered"
            disabled={isSubmitting}
          >
            {curriculumTypeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Grade Level *</span>
          </label>
          <select
            name="gradeLevel"
            value={formData.gradeLevel}
            onChange={handleInputChange}
            className="select select-bordered"
            disabled={isSubmitting}
          >
            {gradeLevelOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Academic Year and Duration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Academic Year *</span>
          </label>
          <input
            type="number"
            name="academicYear"
            value={formData.academicYear}
            onChange={handleInputChange}
            className={`input input-bordered ${errors.academicYear ? 'input-error' : ''}`}
            min="2020"
            max="2030"
            disabled={isSubmitting}
          />
          {errors.academicYear && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.academicYear}</span>
            </label>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Duration (Weeks)</span>
          </label>
          <input
            type="number"
            name="durationWeeks"
            value={formData.durationWeeks || ''}
            onChange={handleInputChange}
            className={`input input-bordered ${errors.durationWeeks ? 'input-error' : ''}`}
            min="0"
            placeholder="Enter duration in weeks"
            disabled={isSubmitting}
          />
          {errors.durationWeeks && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.durationWeeks}</span>
            </label>
          )}
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Effective Date</span>
          </label>
          <input
            type="date"
            name="effectiveDate"
            value={formData.effectiveDate}
            onChange={handleInputChange}
            className="input input-bordered"
            disabled={isSubmitting}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Expiry Date</span>
          </label>
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleInputChange}
            className="input input-bordered"
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Total Hours */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Total Hours</span>
        </label>
        <input
          type="number"
          name="totalHours"
          value={formData.totalHours || ''}
          onChange={handleInputChange}
          className={`input input-bordered ${errors.totalHours ? 'input-error' : ''}`}
          min="0"
          placeholder="Enter total hours"
          disabled={isSubmitting}
        />
        {errors.totalHours && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.totalHours}</span>
          </label>
        )}
      </div>

      {/* Learning Outcomes */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Learning Outcomes</span>
        </label>
        <textarea
          name="learningOutcomes"
          value={formData.learningOutcomes}
          onChange={handleInputChange}
          className={`textarea textarea-bordered ${errors.learningOutcomes ? 'textarea-error' : ''}`}
          placeholder="Describe the expected learning outcomes"
          rows={4}
          maxLength={2000}
          disabled={isSubmitting}
        />
        <label className="label">
          <span className="label-text-alt">{(formData.learningOutcomes || '').length}/2000 characters</span>
        </label>
        {errors.learningOutcomes && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.learningOutcomes}</span>
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
            {formData.active ? 'Curriculum is active and available' : 'Curriculum is inactive'}
          </span>
        </label>
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="alert alert-error">
          <span>{errors.submit}</span>
        </div>
      )}

      {/* User validation error */}
      {errors.createdById && (
        <div className="alert alert-error">
          <span>{errors.createdById}</span>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-ghost"
          disabled={isSubmitting}
        >
          Cancel
        </button>
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
            mode === 'edit' ? 'Update Curriculum' : 'Create Curriculum'
          )}
        </button>
      </div>
    </form>
  );
};

export default CurriculumForm; 