import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { Schedule } from '../../../api/services/scheduleApi';
import { formatTime, formatDate } from '../../../utils/dateUtils';

const ScheduleViewModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { extraObject } = useAppSelector(state => state.modal);
  
  const schedule = extraObject as Schedule;

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const getDayOfWeekDisplay = (dayOfWeek: string) => {
    const days = {
      'MONDAY': 'Monday',
      'TUESDAY': 'Tuesday', 
      'WEDNESDAY': 'Wednesday',
      'THURSDAY': 'Thursday',
      'FRIDAY': 'Friday',
      'SATURDAY': 'Saturday',
      'SUNDAY': 'Sunday'
    };
    return days[dayOfWeek as keyof typeof days] || dayOfWeek;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'ACTIVE': 'bg-green-100 text-green-800',
      'INACTIVE': 'bg-red-100 text-red-800',
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'DRAFT': 'bg-gray-100 text-gray-800',
      'CANCELLED': 'bg-red-100 text-red-800',
      'RESCHEDULED': 'bg-blue-100 text-blue-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'CLASS': 'bg-blue-100 text-blue-800',
      'LECTURE': 'bg-green-100 text-green-800',
      'TUTORIAL': 'bg-yellow-100 text-yellow-800',
      'PRACTICAL': 'bg-purple-100 text-purple-800',
      'EXAM': 'bg-red-100 text-red-800',
      'ASSESSMENT': 'bg-orange-100 text-orange-800',
      'MEETING': 'bg-gray-100 text-gray-800',
      'ASSEMBLY': 'bg-indigo-100 text-indigo-800',
      'BREAK': 'bg-green-50 text-green-600',
      'LUNCH': 'bg-yellow-50 text-yellow-600',
      'SPORT': 'bg-blue-50 text-blue-600',
      'EXTRACURRICULAR': 'bg-purple-50 text-purple-600'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (!schedule) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          No schedule data available
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{schedule.title}</h2>
            {schedule.description && (
              <p className="text-gray-600 mt-1">{schedule.description}</p>
            )}
          </div>
          <div className="flex space-x-2">
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(schedule.status)}`}>
              {schedule.status}
            </span>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getTypeColor(schedule.type)}`}>
              {schedule.type}
            </span>
          </div>
        </div>
      </div>

      {/* Schedule Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Time Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Time & Date</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">Day of Week:</span>
              <span className="text-sm text-gray-900">{getDayOfWeekDisplay(schedule.dayOfWeek)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">Start Time:</span>
              <span className="text-sm text-gray-900">{formatTime(schedule.startTime)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">End Time:</span>
              <span className="text-sm text-gray-900">{formatTime(schedule.endTime)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">Effective Date:</span>
              <span className="text-sm text-gray-900">{formatDate(schedule.effectiveDate)}</span>
            </div>
            
            {schedule.expiryDate && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">Expiry Date:</span>
                <span className="text-sm text-gray-900">{formatDate(schedule.expiryDate)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Location & Assignment */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Assignment</h3>
          
          <div className="space-y-3">
            {schedule.location && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">Location:</span>
                <span className="text-sm text-gray-900">{schedule.location}</span>
              </div>
            )}
            
            {schedule.className && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">Class:</span>
                <span className="text-sm text-gray-900">{schedule.className}</span>
              </div>
            )}
            
            {schedule.teacherName && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">Teacher:</span>
                <span className="text-sm text-gray-900">{schedule.teacherName}</span>
              </div>
            )}
            
            {schedule.courseName && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">Course:</span>
                <span className="text-sm text-gray-900">{schedule.courseName}</span>
              </div>
            )}
            
            {schedule.schoolName && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">School:</span>
                <span className="text-sm text-gray-900">{schedule.schoolName}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Information */}
      {(schedule.isRecurring || schedule.recurrenceRule || schedule.scheduleVersion) && (
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schedule.isRecurring && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">Recurring:</span>
                <span className="text-sm text-gray-900">Yes</span>
              </div>
            )}
            
            {schedule.recurrenceRule && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">Recurrence Rule:</span>
                <span className="text-sm text-gray-900">{schedule.recurrenceRule}</span>
              </div>
            )}
            
            {schedule.scheduleVersion && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">Version:</span>
                <span className="text-sm text-gray-900">{schedule.scheduleVersion}</span>
              </div>
            )}
            
            {schedule.createdByName && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">Created By:</span>
                <span className="text-sm text-gray-900">{schedule.createdByName}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Metadata */}
      {schedule.metadata && (
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Metadata</h3>
          <div className="bg-gray-50 rounded-lg p-3">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">{schedule.metadata}</pre>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <button
          onClick={handleClose}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ScheduleViewModal; 