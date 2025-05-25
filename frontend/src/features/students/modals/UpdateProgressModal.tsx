import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { updateStudentProgress, fetchProgressByStudent } from '../../progress/progressSlice';
import { Student } from '../../../api/services/studentApi';
import { TrendingUp, BookOpen, Award, Check } from 'lucide-react';

interface UpdateProgressModalProps {
  extraObject?: Student;
  courseId?: number;
}

export const UpdateProgressModal: React.FC<UpdateProgressModalProps> = ({ 
  extraObject, 
  courseId = 1 // Default course ID - should be passed from parent
}) => {
  const dispatch = useAppDispatch();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    completionPercentage: 0,
    grade: 0,
    courseName: `Course ${courseId}` // This should be fetched from course API
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // In a real implementation, fetch current progress and course details
    // For now, we'll use default values
  }, [extraObject, courseId]);

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const handleInputChange = (field: string, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (formData.completionPercentage < 0 || formData.completionPercentage > 100) {
      errors.completionPercentage = 'Completion percentage must be between 0 and 100';
    }

    if (formData.grade < 0 || formData.grade > 100) {
      errors.grade = 'Grade must be between 0 and 100';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!extraObject) {
      setError('Student information is required');
      return;
    }

    if (!validateForm()) {
      setError('Please correct the validation errors');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await dispatch(updateStudentProgress({
        studentId: extraObject.id,
        courseId: courseId,
        completionPercentage: formData.completionPercentage,
        grade: formData.grade
      })).unwrap();

      setIsSuccess(true);
      
      // Refresh the student's progress data
      await dispatch(fetchProgressByStudent(extraObject.id));
      
      // Show success briefly then close
      setTimeout(() => {
        handleClose();
      }, 2000);
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update progress';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!extraObject) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">No student data available</div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <Check className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Progress Updated Successfully!</h3>
        <p className="text-gray-600">
          {extraObject.firstName} {extraObject.lastName}'s progress has been updated.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <div className="p-2 bg-blue-100 rounded-lg">
          <TrendingUp className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Update Student Progress</h3>
          <p className="text-sm text-gray-600">
            Update progress for {extraObject.firstName} {extraObject.lastName}
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <span>{error}</span>
        </div>
      )}

      {/* Student and Course Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Details:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex justify-between">
            <span className="font-medium">Student:</span>
            <span>{extraObject.firstName} {extraObject.lastName}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Admission Number:</span>
            <span className="font-mono">{extraObject.admissionNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Course:</span>
            <span>{formData.courseName}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Academic Year:</span>
            <span>{extraObject.academicYear}</span>
          </div>
        </div>
      </div>

      {/* Progress Form */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Progress Information</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Completion Percentage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <BookOpen size={16} />
                Completion Percentage *
              </div>
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={formData.completionPercentage}
              onChange={(e) => handleInputChange('completionPercentage', parseFloat(e.target.value) || 0)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                validationErrors.completionPercentage ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter completion percentage (0-100)"
            />
            {validationErrors.completionPercentage && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.completionPercentage}</p>
            )}
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{formData.completionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(Math.max(formData.completionPercentage, 0), 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Grade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <Award size={16} />
                Grade (%) *
              </div>
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={formData.grade}
              onChange={(e) => handleInputChange('grade', parseFloat(e.target.value) || 0)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                validationErrors.grade ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter grade (0-100)"
            />
            {validationErrors.grade && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.grade}</p>
            )}
            <div className="mt-2">
              <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                formData.grade >= 90 ? 'bg-green-100 text-green-800' :
                formData.grade >= 80 ? 'bg-blue-100 text-blue-800' :
                formData.grade >= 70 ? 'bg-yellow-100 text-yellow-800' :
                formData.grade >= 60 ? 'bg-orange-100 text-orange-800' :
                'bg-red-100 text-red-800'
              }`}>
                {formData.grade >= 90 ? 'Excellent' :
                 formData.grade >= 80 ? 'Good' :
                 formData.grade >= 70 ? 'Satisfactory' :
                 formData.grade >= 60 ? 'Needs Improvement' :
                 'Unsatisfactory'}
              </div>
            </div>
          </div>
        </div>

        {/* Info Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            <strong>Note:</strong> Updating progress will be reflected in the student's academic record and 
            progress tracking dashboard. Ensure accuracy before submitting.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleClose}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Updating...
            </>
          ) : (
            <>
              <TrendingUp size={16} />
              Update Progress
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default UpdateProgressModal; 