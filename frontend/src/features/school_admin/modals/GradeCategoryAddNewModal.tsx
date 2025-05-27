import React, { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { Plus, BarChart3, Check, Percent, Hash } from 'lucide-react';

interface GradeCategoryAddNewModalProps {
  extraObject?: {
    classes?: any[];
    subjects?: any[];
  };
}

// Mock interface for grade category - would come from API
interface CreateGradeCategoryRequest {
  name: string;
  description: string;
  weight: number;
  passingGrade: number;
  maxPoints: number;
  classId?: number;
  subjectId?: number;
  active: boolean;
  color: string;
}

export const GradeCategoryAddNewModal: React.FC<GradeCategoryAddNewModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<CreateGradeCategoryRequest>({
    name: '',
    description: '',
    weight: 100,
    passingGrade: 50,
    maxPoints: 100,
    classId: undefined,
    subjectId: undefined,
    active: true,
    color: '#3B82F6'
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const handleInputChange = (field: keyof CreateGradeCategoryRequest, value: string | number | boolean | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Category name is required';
    }

    if (formData.weight <= 0 || formData.weight > 100) {
      errors.weight = 'Weight must be between 1 and 100';
    }

    if (formData.passingGrade < 0 || formData.passingGrade > formData.maxPoints) {
      errors.passingGrade = 'Passing grade must be between 0 and max points';
    }

    if (formData.maxPoints <= 0) {
      errors.maxPoints = 'Max points must be greater than 0';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setError('Please fill in all required fields correctly');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Mock API call - would be replaced with actual API
      console.log('Creating grade category:', formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSuccess(true);
      
      // Show success briefly then close
      setTimeout(() => {
        handleClose();
      }, 2000);
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create grade category';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <Check className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Grade Category Created Successfully!</h3>
        <p className="text-gray-600">The grade category has been added to the assessment system.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Plus className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Create Grade Category</h2>
          <p className="text-sm text-gray-600">
            Add a new grade category for assessments
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="space-y-4">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                validationErrors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="e.g., Assignments, Exams, Quizzes"
            />
            {validationErrors.name && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <input
              type="color"
              value={formData.color}
              onChange={(e) => handleInputChange('color', e.target.value)}
              className="w-full h-10 px-1 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Grading Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weight (%) *
            </label>
            <div className="relative">
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', parseFloat(e.target.value))}
                className={`w-full px-3 py-2 pr-8 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.weight ? 'border-red-300' : 'border-gray-300'
                }`}
                min="1"
                max="100"
                step="0.1"
              />
              <Percent className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            {validationErrors.weight && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.weight}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">Percentage of total grade</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Points *
            </label>
            <div className="relative">
              <input
                type="number"
                value={formData.maxPoints}
                onChange={(e) => handleInputChange('maxPoints', parseFloat(e.target.value))}
                className={`w-full px-3 py-2 pr-8 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.maxPoints ? 'border-red-300' : 'border-gray-300'
                }`}
                min="1"
                step="0.1"
              />
              <Hash className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            {validationErrors.maxPoints && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.maxPoints}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">Maximum possible points</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Passing Grade *
            </label>
            <div className="relative">
              <input
                type="number"
                value={formData.passingGrade}
                onChange={(e) => handleInputChange('passingGrade', parseFloat(e.target.value))}
                className={`w-full px-3 py-2 pr-8 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.passingGrade ? 'border-red-300' : 'border-gray-300'
                }`}
                min="0"
                max={formData.maxPoints}
                step="0.1"
              />
              <BarChart3 className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            {validationErrors.passingGrade && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.passingGrade}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">Minimum points to pass</p>
          </div>
        </div>

        {/* Assignment Scope */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class (Optional)
            </label>
            <select
              value={formData.classId || ''}
              onChange={(e) => handleInputChange('classId', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Classes</option>
              {extraObject?.classes?.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Leave empty to apply to all classes</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject (Optional)
            </label>
            <select
              value={formData.subjectId || ''}
              onChange={(e) => handleInputChange('subjectId', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Subjects</option>
              {extraObject?.subjects?.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Leave empty to apply to all subjects</p>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe what this grade category includes and how it's used"
          />
        </div>

        {/* Active Status */}
        <div className="flex items-center">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) => handleInputChange('active', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Active Category</span>
          </label>
          <p className="ml-4 text-xs text-gray-500">Inactive categories won't be available for new assessments</p>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Preview</h4>
        <div className="flex items-center gap-3">
          <div 
            className="w-4 h-4 rounded border border-gray-300"
            style={{ backgroundColor: formData.color }}
          />
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">
              {formData.name || 'Category Name'}
            </div>
            <div className="text-xs text-gray-500">
              Weight: {formData.weight}% • Max Points: {formData.maxPoints} • Passing: {formData.passingGrade}
            </div>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            formData.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {formData.active ? 'Active' : 'Inactive'}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleClose}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creating...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Create Category
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default GradeCategoryAddNewModal; 