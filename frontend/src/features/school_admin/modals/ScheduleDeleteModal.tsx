import React, { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { deleteSchedule, fetchSchedulesBySchool } from '../schedulesSlice';
import { Schedule } from '../../../api/services/scheduleApi';
import { useAuth } from '../../../contexts/AuthContext';
import { Trash2, AlertTriangle, CheckCircle, Calendar, Clock, MapPin } from 'lucide-react';

interface ScheduleDeleteModalProps {
  extraObject?: Schedule;
}

export const ScheduleDeleteModal: React.FC<ScheduleDeleteModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationText, setConfirmationText] = useState('');

  const handleDelete = async () => {
    if (!extraObject) return;

    setLoading(true);
    setError(null);
    
    try {
      await dispatch(deleteSchedule(extraObject.id)).unwrap();
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
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete schedule';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  if (!extraObject) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">No schedule data available</div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Schedule Deleted Successfully!</h3>
        <p className="text-gray-600">The schedule entry has been permanently removed from the timetable.</p>
      </div>
    );
  }

  const isConfirmed = confirmationText === extraObject.title;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-red-100 rounded-lg">
          <Trash2 className="h-6 w-6 text-red-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Delete Schedule Entry</h2>
          <p className="text-sm text-gray-600">
            This action cannot be undone. Please confirm deletion.
          </p>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-red-800 mb-1">Warning</h3>
            <p className="text-sm text-red-700">
              Deleting this schedule entry will permanently remove it from the timetable. 
              This action cannot be undone and may affect class schedules and notifications.
            </p>
          </div>
        </div>
      </div>

      {/* Schedule Details */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Schedule Details:</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span className="font-medium">Title:</span>
            <span>{extraObject.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Type:</span>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              extraObject.type === 'LECTURE' ? 'bg-blue-100 text-blue-800' :
              extraObject.type === 'LAB' ? 'bg-green-100 text-green-800' :
              extraObject.type === 'EXAM' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {extraObject.type}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Day:</span>
            <span>{extraObject.dayOfWeek}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Time:</span>
            <span>{extraObject.startTime} - {extraObject.endTime}</span>
          </div>
          {extraObject.location && (
            <div className="flex justify-between">
              <span className="font-medium">Location:</span>
              <span>{extraObject.location}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="font-medium">Status:</span>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              extraObject.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
              extraObject.status === 'INACTIVE' ? 'bg-gray-100 text-gray-800' :
              extraObject.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {extraObject.status}
            </span>
          </div>
          {extraObject.isRecurring && (
            <div className="flex justify-between">
              <span className="font-medium">Recurrence:</span>
              <span>{extraObject.recurrenceRule || 'Weekly'}</span>
            </div>
          )}
          {extraObject.description && (
            <div className="flex justify-between">
              <span className="font-medium">Description:</span>
              <span className="text-right max-w-xs">{extraObject.description}</span>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type the schedule title "<span className="font-semibold text-red-600">{extraObject.title}</span>" to confirm deletion:
        </label>
        <input
          type="text"
          value={confirmationText}
          onChange={(e) => setConfirmationText(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          placeholder={extraObject.title}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Alternative Actions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Alternative Actions:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Consider marking the schedule as inactive instead of deleting</li>
          <li>• You can edit the schedule to change its details</li>
          <li>• Check if this schedule is part of a recurring series</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleClose}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={loading || !isConfirmed}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Schedule
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ScheduleDeleteModal; 