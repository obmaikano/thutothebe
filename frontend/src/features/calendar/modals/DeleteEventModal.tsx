import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { deleteCalendarEvent, clearCalendarError } from '../calendarEventsSlice';
import { closeModal } from '../../common/modalSlice';
import { CalendarEvent } from '../../../api/services/calendarEventApi';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface DeleteEventModalProps {
  extraObject: CalendarEvent;
}

const DeleteEventModal: React.FC<DeleteEventModalProps> = ({ extraObject: event }) => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector(state => state.calendarEvents);

  const handleDelete = async () => {
    try {
      await dispatch(deleteCalendarEvent(event.id)).unwrap();
      dispatch(closeModal({}));
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  const handleClose = () => {
    dispatch(clearCalendarError());
    dispatch(closeModal({}));
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">Delete Event</h3>
          <p className="text-sm text-gray-500">This action cannot be undone.</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: event.color }}
            />
            <h4 className="font-medium text-gray-900">{event.title}</h4>
          </div>
          <p className="text-sm text-gray-600">
            {new Date(event.startTime).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
          {event.location && (
            <p className="text-sm text-gray-600 mt-1">{event.location}</p>
          )}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-700">
          Are you sure you want to delete this event? This will permanently remove the event and all associated data.
        </p>
        {event.attendeeIds && event.attendeeIds.length > 0 && (
          <p className="text-sm text-orange-600 mt-2">
            <strong>Warning:</strong> This event has {event.attendeeIds.length} attendee(s) who will be notified of the cancellation.
          </p>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-800">
            <AlertTriangle size={16} />
            <span className="text-sm font-medium">Error deleting event</span>
          </div>
          <p className="text-sm text-red-700 mt-1">{error}</p>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={handleClose}
          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          disabled={status === 'loading'}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={status === 'loading'}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {status === 'loading' ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Trash2 size={16} />
          )}
          Delete Event
        </button>
      </div>
    </div>
  );
};

export default DeleteEventModal; 