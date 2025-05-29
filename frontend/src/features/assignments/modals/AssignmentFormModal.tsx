import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { createAssignment, updateAssignment } from '../assignmentsSlice';
import { fetchCourses } from '../../courses/coursesSlice';
import { closeModal } from '../../common/modalSlice';
import { Assignment, CreateAssignmentRequest } from '../../../api/services/assignmentApi';
import { 
  FileText,
  Users,
  Settings,
  Save,
  X
} from 'lucide-react';

interface AssignmentFormModalProps {
  assignment?: Assignment;
  mode?: 'create' | 'edit';
}

const AssignmentFormModal: React.FC<AssignmentFormModalProps> = ({ 
  assignment, 
  mode = 'create' 
}) => {
  const dispatch = useAppDispatch();
  const { courses } = useAppSelector(state => state.courses);
  const { user } = useAppSelector(state => state.auth);
  const { status } = useAppSelector(state => state.assignments);

  const [formData, setFormData] = useState<Partial<CreateAssignmentRequest>>({
    title: '',
    description: '',
    instructions: '',
    code: '',
    courseId: 0,
    teacherId: user?.id || 0,
    instructorId: user?.id || 0,
    dueDate: '',
    startDate: '',
    maxScore: 100,
    weight: 1,
    allowLateSubmissions: true,
    latePenalty: 10,
    maxAttempts: 1,
    isGroupAssignment: false,
    maxGroupSize: 4,
    submissionType: 'FILE',
    allowedFileTypes: 'pdf,doc,docx,txt',
    maxFileSize: 10,
    gradingType: 'POINTS',
    autoGrade: false,
    publishGrades: true,
    showRubric: true,
    plagiarismCheck: false,
    status: 'DRAFT',
    visibility: 'VISIBLE',
    estimatedDuration: 60,
    tags: '',
    active: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  useEffect(() => {
    if (assignment && mode === 'edit') {
      setFormData({
        title: assignment.title,
        description: assignment.description,
        instructions: assignment.instructions || '',
        code: assignment.code,
        courseId: assignment.courseId,
        teacherId: assignment.teacherId,
        instructorId: assignment.instructorId,
        dueDate: assignment.dueDate,
        startDate: assignment.startDate || '',
        maxScore: assignment.maxScore,
        weight: assignment.weight,
        allowLateSubmissions: assignment.allowLateSubmissions,
        latePenalty: assignment.latePenalty || 0,
        maxAttempts: assignment.maxAttempts || 1,
        isGroupAssignment: assignment.isGroupAssignment,
        maxGroupSize: assignment.maxGroupSize || 4,
        submissionType: assignment.submissionType,
        allowedFileTypes: assignment.allowedFileTypes || '',
        maxFileSize: assignment.maxFileSize || 10,
        gradingType: assignment.gradingType,
        autoGrade: assignment.autoGrade,
        publishGrades: assignment.publishGrades,
        showRubric: assignment.showRubric,
        plagiarismCheck: assignment.plagiarismCheck,
        status: assignment.status,
        visibility: assignment.visibility,
        estimatedDuration: assignment.estimatedDuration || 60,
        tags: assignment.tags || '',
        active: assignment.active
      });
    }
  }, [assignment, mode]);

  const handleInputChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.code?.trim()) {
      newErrors.code = 'Assignment code is required';
    }

    if (!formData.courseId || formData.courseId === 0) {
      newErrors.courseId = 'Course is required';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    if (formData.maxScore && formData.maxScore <= 0) {
      newErrors.maxScore = 'Max score must be greater than 0';
    }

    if (formData.weight && formData.weight <= 0) {
      newErrors.weight = 'Weight must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (mode === 'edit' && assignment) {
        await dispatch(updateAssignment({ 
          id: assignment.id, 
          assignmentData: formData as CreateAssignmentRequest 
        })).unwrap();
      } else {
        await dispatch(createAssignment(formData as CreateAssignmentRequest)).unwrap();
      }
      dispatch(closeModal());
    } catch (error) {
      console.error('Failed to save assignment:', error);
    }
  };

  const handleClose = () => {
    dispatch(closeModal());
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'grading', label: 'Grading', icon: Users },
    { id: 'advanced', label: 'Advanced', icon: FileText }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'edit' ? 'Edit Assignment' : 'Create New Assignment'}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter assignment title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assignment Code *
                  </label>
                  <input
                    type="text"
                    value={formData.code || ''}
                    onChange={(e) => handleInputChange('code', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.code ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., MATH101-A1"
                  />
                  {errors.code && (
                    <p className="mt-1 text-sm text-red-600">{errors.code}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course *
                </label>
                <select
                  value={formData.courseId || ''}
                  onChange={(e) => handleInputChange('courseId', e.target.value ? parseInt(e.target.value, 10) : 0)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.courseId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.name} ({course.code})
                    </option>
                  ))}
                </select>
                {errors.courseId && (
                  <p className="mt-1 text-sm text-red-600">{errors.courseId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter assignment description"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructions
                </label>
                <textarea
                  value={formData.instructions || ''}
                  onChange={(e) => handleInputChange('instructions', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter detailed instructions for students"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.startDate || ''}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.dueDate || ''}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.dueDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.dueDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Submission Type
                  </label>
                  <select
                    value={formData.submissionType || 'FILE'}
                    onChange={(e) => handleInputChange('submissionType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="FILE">File Upload</option>
                    <option value="TEXT">Text Entry</option>
                    <option value="LINK">Link Submission</option>
                    <option value="MIXED">Mixed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status || 'DRAFT'}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="CLOSED">Closed</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>

              {formData.submissionType === 'FILE' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Allowed File Types
                    </label>
                    <input
                      type="text"
                      value={formData.allowedFileTypes || ''}
                      onChange={(e) => handleInputChange('allowedFileTypes', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="pdf,doc,docx,txt"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max File Size (MB)
                    </label>
                    <input
                      type="number"
                      value={formData.maxFileSize || ''}
                      onChange={(e) => handleInputChange('maxFileSize', e.target.value ? parseInt(e.target.value, 10) : 10)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                      max="100"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allowLateSubmissions"
                    checked={formData.allowLateSubmissions || false}
                    onChange={(e) => handleInputChange('allowLateSubmissions', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="allowLateSubmissions" className="ml-2 block text-sm text-gray-900">
                    Allow late submissions
                  </label>
                </div>

                {formData.allowLateSubmissions && (
                  <div className="ml-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Late Penalty (%)
                    </label>
                    <input
                      type="number"
                      value={formData.latePenalty || ''}
                      onChange={(e) => handleInputChange('latePenalty', e.target.value ? parseInt(e.target.value, 10) : 0)}
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      max="100"
                    />
                  </div>
                )}

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isGroupAssignment"
                    checked={formData.isGroupAssignment || false}
                    onChange={(e) => handleInputChange('isGroupAssignment', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isGroupAssignment" className="ml-2 block text-sm text-gray-900">
                    Group assignment
                  </label>
                </div>

                {formData.isGroupAssignment && (
                  <div className="ml-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Group Size
                    </label>
                    <input
                      type="number"
                      value={formData.maxGroupSize || ''}
                      onChange={(e) => handleInputChange('maxGroupSize', e.target.value ? parseInt(e.target.value, 10) : 4)}
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="2"
                      max="10"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Grading Tab */}
          {activeTab === 'grading' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Score *
                  </label>
                  <input
                    type="number"
                    value={formData.maxScore || ''}
                    onChange={(e) => handleInputChange('maxScore', e.target.value ? parseInt(e.target.value, 10) : 0)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.maxScore ? 'border-red-500' : 'border-gray-300'
                    }`}
                    min="1"
                  />
                  {errors.maxScore && (
                    <p className="mt-1 text-sm text-red-600">{errors.maxScore}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.weight || ''}
                    onChange={(e) => handleInputChange('weight', e.target.value ? parseFloat(e.target.value) : 0)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.weight ? 'border-red-500' : 'border-gray-300'
                    }`}
                    min="0.1"
                  />
                  {errors.weight && (
                    <p className="mt-1 text-sm text-red-600">{errors.weight}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grading Type
                  </label>
                  <select
                    value={formData.gradingType || 'POINTS'}
                    onChange={(e) => handleInputChange('gradingType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="POINTS">Points</option>
                    <option value="PERCENTAGE">Percentage</option>
                    <option value="LETTER">Letter Grade</option>
                    <option value="PASS_FAIL">Pass/Fail</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="autoGrade"
                    checked={formData.autoGrade || false}
                    onChange={(e) => handleInputChange('autoGrade', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="autoGrade" className="ml-2 block text-sm text-gray-900">
                    Enable auto-grading
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="publishGrades"
                    checked={formData.publishGrades || false}
                    onChange={(e) => handleInputChange('publishGrades', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="publishGrades" className="ml-2 block text-sm text-gray-900">
                    Publish grades automatically
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showRubric"
                    checked={formData.showRubric || false}
                    onChange={(e) => handleInputChange('showRubric', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="showRubric" className="ml-2 block text-sm text-gray-900">
                    Show rubric to students
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Advanced Tab */}
          {activeTab === 'advanced' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Attempts
                  </label>
                  <input
                    type="number"
                    value={formData.maxAttempts || ''}
                    onChange={(e) => handleInputChange('maxAttempts', e.target.value ? parseInt(e.target.value, 10) : 1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    max="10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.estimatedDuration || ''}
                    onChange={(e) => handleInputChange('estimatedDuration', e.target.value ? parseInt(e.target.value, 10) : 60)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <input
                  type="text"
                  value={formData.tags || ''}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="homework, quiz, project (comma-separated)"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="plagiarismCheck"
                    checked={formData.plagiarismCheck || false}
                    onChange={(e) => handleInputChange('plagiarismCheck', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="plagiarismCheck" className="ml-2 block text-sm text-gray-900">
                    Enable plagiarism checking
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Visibility
                  </label>
                  <select
                    value={formData.visibility || 'VISIBLE'}
                    onChange={(e) => handleInputChange('visibility', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="VISIBLE">Visible</option>
                    <option value="HIDDEN">Hidden</option>
                    <option value="SCHEDULED">Scheduled</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {status === 'loading' ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {mode === 'edit' ? 'Update Assignment' : 'Create Assignment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssignmentFormModal; 