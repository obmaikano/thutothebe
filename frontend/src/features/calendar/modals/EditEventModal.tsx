import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { updateCalendarEvent, clearCalendarError } from '../calendarEventsSlice';
import { closeModal } from '../../common/modalSlice';
import { CalendarEvent, UpdateCalendarEventRequest } from '../../../api/services/calendarEventApi';
import { useAuth } from '../../../contexts/AuthContext';
import { Calendar, Clock, MapPin, Users, Tag, AlertCircle } from 'lucide-react';

interface EditEventModalProps {
  extraObject: CalendarEvent;
}

const EditEventModal: React.FC<EditEventModalProps> = ({ extraObject: event }) => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector(state => state.calendarEvents);
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<Partial<UpdateCalendarEventRequest>>({
    title: event.title,
    description: event.description || '',
    startTime: new Date(event.startTime).toISOString().slice(0, 16),
    endTime: new Date(event.endTime).toISOString().slice(0, 16),
    location: event.location || '',
    eventType: event.eventType,
    priority: event.priority,
    scope: event.scope,
    isAllDay: event.isAllDay,
    isRecurring: event.isRecurring,
    color: event.color || '#3B82F6',
    requiresApproval: event.requiresApproval,
    isPublic: event.isPublic,
    registrationRequired: event.registrationRequired,
    active: event.active
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const eventTypes = [
    { value: 'ACADEMIC_TERM_START', label: 'Academic Term Start' },
    { value: 'ACADEMIC_TERM_END', label: 'Academic Term End' },
    { value: 'EXAM_PERIOD', label: 'Exam Period' },
    { value: 'CLASS_SESSION', label: 'Class Session' },
    { value: 'STAFF_MEETING', label: 'Staff Meeting' },
    { value: 'PARENT_MEETING', label: 'Parent Meeting' },
    { value: 'SPORTS_EVENT', label: 'Sports Event' },
    { value: 'CULTURAL_EVENT', label: 'Cultural Event' },
    { value: 'PUBLIC_HOLIDAY', label: 'Public Holiday' },
    { value: 'SCHOOL_HOLIDAY', label: 'School Holiday' },
    { value: 'GENERAL', label: 'General' }
  ];

  const priorities = [
    { value: 'LOW', label: 'Low' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'HIGH', label: 'High' },
    { value: 'URGENT', label: 'Urgent' },
    { value: 'CRITICAL', label: 'Critical' }
  ];

  const scopes = [
    { value: 'GLOBAL', label: 'Global' },
    { value: 'REGIONAL', label: 'Regional' },
    { value: 'SCHOOL', label: 'School' },
    { value: 'CLASS', label: 'Class' },
    { value: 'COURSE', label: 'Course' },
    { value: 'PERSONAL', label: 'Personal' }
  ];

  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
    '#8B5CF6', '#EC4899', '#6B7280', '#14B8A6'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }

    if (formData.startTime && formData.endTime) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);
      if (end <= start) {
        newErrors.endTime = 'End time must be after start time';
      }
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
      await dispatch(updateCalendarEvent({
        id: event.id,
        eventData: formData as UpdateCalendarEventRequest
      })).unwrap();
      dispatch(closeModal({}));
    } catch (error) {
      console.error('Failed to update event:', error);
    }
  };

  const handleInputChange = (field: keyof UpdateCalendarEventRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleClose = () => {
    dispatch(clearCalendarError());
    dispatch(closeModal({}));
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Title *
          </label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter event title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle size={16} />
              {errors.title}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter event description"
          />
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock size={16} className="inline mr-1" />
              Start Time *
            </label>
            <input
              type="datetime-local"
              value={formData.startTime || ''}
              onChange={(e) => handleInputChange('startTime', e.target.value)}
              disabled={formData.isAllDay}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.startTime ? 'border-red-500' : 'border-gray-300'
              } ${formData.isAllDay ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            />
            {errors.startTime && (
              <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock size={16} className="inline mr-1" />
              End Time *
            </label>
            <input
              type="datetime-local"
              value={formData.endTime || ''}
              onChange={(e) => handleInputChange('endTime', e.target.value)}
              disabled={formData.isAllDay}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.endTime ? 'border-red-500' : 'border-gray-300'
              } ${formData.isAllDay ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            />
            {errors.endTime && (
              <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>
            )}
          </div>
        </div>

        {/* All Day Toggle */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isAllDay"
            checked={formData.isAllDay || false}
            onChange={(e) => {
              const isAllDay = e.target.checked;
              handleInputChange('isAllDay', isAllDay);
              
              // If switching to all-day, set times to cover the whole day
              if (isAllDay && formData.startTime) {
                const startDate = new Date(formData.startTime);
                const startOfDay = new Date(startDate);
                startOfDay.setHours(0, 0, 0, 0);
                const endOfDay = new Date(startDate);
                endOfDay.setHours(23, 59, 59, 999);
                
                handleInputChange('startTime', startOfDay.toISOString().slice(0, 16));
                handleInputChange('endTime', endOfDay.toISOString().slice(0, 16));
              }
            }}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="isAllDay" className="ml-2 text-sm text-gray-700">
            All day event
          </label>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin size={16} className="inline mr-1" />
            Location
          </label>
          <input
            type="text"
            value={formData.location || ''}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter event location"
          />
        </div>

        {/* Event Type, Priority, Scope */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag size={16} className="inline mr-1" />
              Event Type
            </label>
            <select
              value={formData.eventType || 'GENERAL'}
              onChange={(e) => handleInputChange('eventType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {eventTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={formData.priority || 'MEDIUM'}
              onChange={(e) => handleInputChange('priority', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {priorities.map(priority => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Scope
            </label>
            <select
              value={formData.scope || 'SCHOOL'}
              onChange={(e) => handleInputChange('scope', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {scopes.map(scope => (
                <option key={scope.value} value={scope.value}>
                  {scope.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Color Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Color
          </label>
          <div className="flex gap-2">
            {colors.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => handleInputChange('color', color)}
                className={`w-8 h-8 rounded-full border-2 ${
                  formData.color === color ? 'border-gray-800' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Additional Options */}
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="requiresApproval"
              checked={formData.requiresApproval || false}
              onChange={(e) => handleInputChange('requiresApproval', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="requiresApproval" className="ml-2 text-sm text-gray-700">
              Requires approval
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublic"
              checked={formData.isPublic || false}
              onChange={(e) => handleInputChange('isPublic', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700">
              Public event
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="registrationRequired"
              checked={formData.registrationRequired || false}
              onChange={(e) => handleInputChange('registrationRequired', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="registrationRequired" className="ml-2 text-sm text-gray-700">
              Registration required
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              checked={formData.active !== false}
              onChange={(e) => handleInputChange('active', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="active" className="ml-2 text-sm text-gray-700">
              Active event
            </label>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle size={16} />
              <span className="text-sm font-medium">Error updating event</span>
            </div>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {status === 'loading' && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            Update Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEventModal; 