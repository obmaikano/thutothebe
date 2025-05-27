import React, { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { createSchedule, fetchSchedulesBySchool } from '../schedulesSlice';
import { CreateScheduleRequest } from '../../../api/services/scheduleApi';
import { useAuth } from '../../../contexts/AuthContext';
import { Calendar, Clock, Plus, MapPin, BookOpen, Users, Check } from 'lucide-react';

interface ScheduleAddNewModalProps {
  extraObject?: {
    time?: string;
    day?: string;
    classId?: number;
    classes?: any[];
    teachers?: any[];
    subjects?: any[];
  };
}

export const ScheduleAddNewModal: React.FC<ScheduleAddNewModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<CreateScheduleRequest>({
    title: '',
    description: '',
    startTime: extraObject?.time || '08:00',
    endTime: '09:00',
    dayOfWeek: extraObject?.day || 'MONDAY',
    effectiveDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    location: '',
    type: 'LECTURE',
    status: 'ACTIVE',
    color: '#3B82F6',
    isRecurring: true,
    recurrenceRule: 'WEEKLY',
    courseId: undefined,
    classId: extraObject?.classId || undefined,
    schoolId: user?.schoolId || 1,
    regionId: user?.regionId,
    teacherId: undefined,
    active: true
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const handleInputChange = (field: keyof CreateScheduleRequest, value: string | number | boolean | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }

    if (!formData.startTime) {
      errors.startTime = 'Start time is required';
    }

    if (!formData.endTime) {
      errors.endTime = 'End time is required';
    }

    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      errors.endTime = 'End time must be after start time';
    }

    if (!formData.effectiveDate) {
      errors.effectiveDate = 'Effective date is required';
    }

    if (!formData.dayOfWeek) {
      errors.dayOfWeek = 'Day of week is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await dispatch(createSchedule(formData)).unwrap();
      setIsSuccess(true);
      
      // Refresh the schedules list
      if (user?.schoolId && user?.id && user?.role) {
        await dispatch(fetchSchedulesBySchool({
          schoolId: user.schoolId,
          userRole: user.role,
          userId: user.id,
          userRegionId: user.regionId,
          userSchoolId: user.schoolId
        }));
      }
      
      // Show success briefly then close
      setTimeout(() => {
        handleClose();
      }, 2000);
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create schedule';
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Schedule Created Successfully!</h3>
        <p className="text-gray-600">The schedule entry has been added to the timetable.</p>
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
          <h2 className="text-lg font-semibold text-gray-900">Create Schedule Entry</h2>
          <p className="text-sm text-gray-600">
            Add a new entry to the class timetable
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
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                validationErrors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="e.g., Mathematics Lesson"
            />
            {validationErrors.title && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="LECTURE">Lecture</option>
              <option value="LAB">Lab</option>
              <option value="EXAM">Exam</option>
              <option value="MEETING">Meeting</option>
              <option value="BREAK">Break</option>
            </select>
          </div>
        </div>

        {/* Time and Day */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Day of Week *
            </label>
            <select
              value={formData.dayOfWeek}
              onChange={(e) => handleInputChange('dayOfWeek', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                validationErrors.dayOfWeek ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="MONDAY">Monday</option>
              <option value="TUESDAY">Tuesday</option>
              <option value="WEDNESDAY">Wednesday</option>
              <option value="THURSDAY">Thursday</option>
              <option value="FRIDAY">Friday</option>
              <option value="SATURDAY">Saturday</option>
              <option value="SUNDAY">Sunday</option>
            </select>
            {validationErrors.dayOfWeek && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.dayOfWeek}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Time *
            </label>
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => handleInputChange('startTime', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                validationErrors.startTime ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {validationErrors.startTime && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.startTime}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Time *
            </label>
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) => handleInputChange('endTime', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                validationErrors.endTime ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {validationErrors.endTime && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.endTime}</p>
            )}
          </div>
        </div>

        {/* Assignments */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class
            </label>
            <select
              value={formData.classId || ''}
              onChange={(e) => handleInputChange('classId', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Class</option>
              {extraObject?.classes?.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={formData.location || ''}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Room 101"
            />
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Effective Date *
            </label>
            <input
              type="date"
              value={formData.effectiveDate}
              onChange={(e) => handleInputChange('effectiveDate', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                validationErrors.effectiveDate ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {validationErrors.effectiveDate && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.effectiveDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date (Optional)
            </label>
            <input
              type="date"
              value={formData.expiryDate || ''}
              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Additional notes about this schedule entry"
          />
        </div>

        {/* Recurrence */}
        <div className="flex items-center gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isRecurring}
              onChange={(e) => handleInputChange('isRecurring', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Recurring Schedule</span>
          </label>
          
          {formData.isRecurring && (
            <select
              value={formData.recurrenceRule || 'WEEKLY'}
              onChange={(e) => handleInputChange('recurrenceRule', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="WEEKLY">Weekly</option>
              <option value="BIWEEKLY">Bi-weekly</option>
              <option value="MONTHLY">Monthly</option>
            </select>
          )}
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
              Create Schedule
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ScheduleAddNewModal; 