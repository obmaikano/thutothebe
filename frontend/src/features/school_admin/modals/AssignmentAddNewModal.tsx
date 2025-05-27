import React, { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { Plus, FileText, Check, Calendar, Clock, Users, BookOpen } from 'lucide-react';

interface AssignmentAddNewModalProps {
  extraObject?: {
    classes?: any[];
    teachers?: any[];
    subjects?: any[];
  };
}

// Mock interface for assignment - would come from API
interface CreateAssignmentRequest {
  title: string;
  description: string;
  type: string;
  dueDate: string;
  dueTime: string;
  totalMarks: number;
  instructions: string;
  classId?: number;
  subjectId?: number;
  teacherId?: number;
  allowLateSubmissions: boolean;
  latePenalty: number;
  maxAttempts: number;
  isVisible: boolean;
  requiresFile: boolean;
  allowedFileTypes: string[];
  maxFileSize: number;
}

export const AssignmentAddNewModal: React.FC<AssignmentAddNewModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('basic');

  // Form state
  const [formData, setFormData] = useState<CreateAssignmentRequest>({
    title: '',
    description: '',
    type: 'ASSIGNMENT',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '23:59',
    totalMarks: 100,
    instructions: '',
    classId: undefined,
    subjectId: undefined,
    teacherId: undefined,
    allowLateSubmissions: false,
    latePenalty: 10,
    maxAttempts: 1,
    isVisible: true,
    requiresFile: false,
    allowedFileTypes: ['pdf', 'doc', 'docx'],
    maxFileSize: 10
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const handleInputChange = (field: keyof CreateAssignmentRequest, value: string | number | boolean | string[] | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateTab = (tab: string) => {
    const errors: Record<string, string> = {};

    if (tab === 'basic') {
      if (!formData.title.trim()) {
        errors.title = 'Assignment title is required';
      }

      if (!formData.dueDate) {
        errors.dueDate = 'Due date is required';
      }

      if (formData.totalMarks <= 0) {
        errors.totalMarks = 'Total marks must be greater than 0';
      }

      if (!formData.classId) {
        errors.classId = 'Class selection is required';
      }

      if (!formData.subjectId) {
        errors.subjectId = 'Subject selection is required';
      }
    }

    if (tab === 'settings') {
      if (formData.allowLateSubmissions && (formData.latePenalty < 0 || formData.latePenalty > 100)) {
        errors.latePenalty = 'Late penalty must be between 0 and 100';
      }

      if (formData.maxAttempts < 1) {
        errors.maxAttempts = 'Max attempts must be at least 1';
      }

      if (formData.requiresFile && formData.maxFileSize <= 0) {
        errors.maxFileSize = 'Max file size must be greater than 0';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateForm = () => {
    return ['basic', 'settings'].every(tab => validateTab(tab));
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
      console.log('Creating assignment:', formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSuccess(true);
      
      // Show success briefly then close
      setTimeout(() => {
        handleClose();
      }, 2000);
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create assignment';
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Assignment Created Successfully!</h3>
        <p className="text-gray-600">The assignment has been created and is ready for student submissions.</p>
      </div>
    );
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Users }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Plus className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Create Assignment</h2>
          <p className="text-sm text-gray-600">
            Create a new assignment for students
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'basic' && (
          <div className="space-y-4">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assignment Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.title ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Mathematics Homework Chapter 5"
                />
                {validationErrors.title && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assignment Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ASSIGNMENT">Assignment</option>
                  <option value="QUIZ">Quiz</option>
                  <option value="EXAM">Exam</option>
                  <option value="PROJECT">Project</option>
                  <option value="HOMEWORK">Homework</option>
                </select>
              </div>
            </div>

            {/* Assignment Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class *
                </label>
                <select
                  value={formData.classId || ''}
                  onChange={(e) => handleInputChange('classId', e.target.value ? parseInt(e.target.value) : undefined)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.classId ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Class</option>
                  {extraObject?.classes?.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
                {validationErrors.classId && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.classId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <select
                  value={formData.subjectId || ''}
                  onChange={(e) => handleInputChange('subjectId', e.target.value ? parseInt(e.target.value) : undefined)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.subjectId ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Subject</option>
                  {extraObject?.subjects?.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
                {validationErrors.subjectId && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.subjectId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teacher
                </label>
                <select
                  value={formData.teacherId || ''}
                  onChange={(e) => handleInputChange('teacherId', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Teacher</option>
                  {extraObject?.teachers?.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.firstName} {teacher.lastName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Due Date and Marks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date *
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.dueDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {validationErrors.dueDate && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.dueDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Time
                </label>
                <input
                  type="time"
                  value={formData.dueTime}
                  onChange={(e) => handleInputChange('dueTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Marks *
                </label>
                <input
                  type="number"
                  value={formData.totalMarks}
                  onChange={(e) => handleInputChange('totalMarks', parseFloat(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.totalMarks ? 'border-red-300' : 'border-gray-300'
                  }`}
                  min="1"
                  step="0.1"
                />
                {validationErrors.totalMarks && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.totalMarks}</p>
                )}
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
                placeholder="Brief description of the assignment"
              />
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instructions
              </label>
              <textarea
                value={formData.instructions}
                onChange={(e) => handleInputChange('instructions', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Detailed instructions for students on how to complete this assignment"
              />
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            {/* Submission Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Attempts
                </label>
                <input
                  type="number"
                  value={formData.maxAttempts}
                  onChange={(e) => handleInputChange('maxAttempts', parseInt(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.maxAttempts ? 'border-red-300' : 'border-gray-300'
                  }`}
                  min="1"
                />
                {validationErrors.maxAttempts && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.maxAttempts}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Late Penalty (%)
                </label>
                <input
                  type="number"
                  value={formData.latePenalty}
                  onChange={(e) => handleInputChange('latePenalty', parseFloat(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.latePenalty ? 'border-red-300' : 'border-gray-300'
                  }`}
                  min="0"
                  max="100"
                  step="0.1"
                  disabled={!formData.allowLateSubmissions}
                />
                {validationErrors.latePenalty && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.latePenalty}</p>
                )}
              </div>
            </div>

            {/* File Upload Settings */}
            <div className="space-y-4">
              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.requiresFile}
                    onChange={(e) => handleInputChange('requiresFile', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Require File Upload</span>
                </label>
              </div>

              {formData.requiresFile && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max File Size (MB)
                    </label>
                    <input
                      type="number"
                      value={formData.maxFileSize}
                      onChange={(e) => handleInputChange('maxFileSize', parseFloat(e.target.value))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        validationErrors.maxFileSize ? 'border-red-300' : 'border-gray-300'
                      }`}
                      min="0.1"
                      step="0.1"
                    />
                    {validationErrors.maxFileSize && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.maxFileSize}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Allowed File Types
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['pdf', 'doc', 'docx', 'txt', 'jpg', 'png'].map(type => (
                        <label key={type} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.allowedFileTypes.includes(type)}
                            onChange={(e) => {
                              const types = e.target.checked
                                ? [...formData.allowedFileTypes, type]
                                : formData.allowedFileTypes.filter(t => t !== type);
                              handleInputChange('allowedFileTypes', types);
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-1 text-xs text-gray-700">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Other Settings */}
            <div className="space-y-3">
              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.allowLateSubmissions}
                    onChange={(e) => handleInputChange('allowLateSubmissions', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Allow Late Submissions</span>
                </label>
              </div>

              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isVisible}
                    onChange={(e) => handleInputChange('isVisible', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Visible to Students</span>
                </label>
              </div>
            </div>
          </div>
        )}
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
              Create Assignment
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AssignmentAddNewModal; 