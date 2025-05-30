import React from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { closeModal, openModal } from '../../common/modalSlice';
import { CalendarEvent } from '../../../api/services/calendarEventApi';
import { useAuth } from '../../../contexts/AuthContext';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Tag, 
  User, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Globe,
  School,
  GraduationCap
} from 'lucide-react';

interface EventDetailsModalProps {
  extraObject: CalendarEvent;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ extraObject: event }) => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  const canEdit = user && (
    event.createdById === user.id || 
    ['SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'REGIONAL_ADMIN', 'SCHOOL_ADMIN', 'SCHOOL_HEAD'].includes(user.role)
  );

  const canDelete = user && (
    event.createdById === user.id || 
    ['SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'REGIONAL_ADMIN', 'SCHOOL_ADMIN'].includes(user.role)
  );

  const handleEdit = () => {
    dispatch(closeModal({}));
    dispatch(openModal({
      title: 'Edit Event',
      bodyType: MODAL_BODY_TYPES.CALENDAR_EVENT_EDIT,
      extraObject: event
    }));
  };

  const handleDelete = () => {
    dispatch(closeModal({}));
    dispatch(openModal({
      title: 'Delete Event',
      bodyType: MODAL_BODY_TYPES.CALENDAR_EVENT_DELETE_CONFIRMATION,
      extraObject: event
    }));
  };

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'text-blue-600 bg-blue-100';
      case 'ONGOING': return 'text-green-600 bg-green-100';
      case 'COMPLETED': return 'text-gray-600 bg-gray-100';
      case 'CANCELLED': return 'text-red-600 bg-red-100';
      case 'POSTPONED': return 'text-yellow-600 bg-yellow-100';
      case 'PENDING_APPROVAL': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'text-gray-600 bg-gray-100';
      case 'MEDIUM': return 'text-blue-600 bg-blue-100';
      case 'HIGH': return 'text-orange-600 bg-orange-100';
      case 'URGENT': return 'text-red-600 bg-red-100';
      case 'CRITICAL': return 'text-red-800 bg-red-200';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getScopeIcon = (scope: string) => {
    switch (scope) {
      case 'GLOBAL': return <Globe size={16} />;
      case 'REGIONAL': return <MapPin size={16} />;
      case 'SCHOOL': return <School size={16} />;
      case 'CLASS': return <GraduationCap size={16} />;
      case 'COURSE': return <GraduationCap size={16} />;
      case 'PERSONAL': return <User size={16} />;
      default: return <Tag size={16} />;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventTypeLabel = (eventType: string) => {
    return eventType.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: event.color }}
            />
            <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
              {event.status.replace('_', ' ')}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(event.priority)}`}>
              {event.priority}
            </span>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 flex items-center gap-1">
              {getScopeIcon(event.scope)}
              {event.scope}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-4">
          {canEdit && (
            <button
              onClick={handleEdit}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit Event"
            >
              <Edit size={18} />
            </button>
          )}
          {canDelete && (
            <button
              onClick={handleDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Event"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Event Details */}
      <div className="space-y-6">
        {/* Description */}
        {event.description && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
            <p className="text-gray-900 leading-relaxed">{event.description}</p>
          </div>
        )}

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <Clock className="text-gray-400 mt-1" size={18} />
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Date & Time</h3>
              {event.isAllDay ? (
                <div>
                  <p className="text-gray-900">All Day</p>
                  <p className="text-sm text-gray-600">
                    {new Date(event.startTime).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-900">
                    {formatTime(event.startTime)} - {formatTime(event.endTime)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(event.startTime).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          {event.location && (
            <div className="flex items-start gap-3">
              <MapPin className="text-gray-400 mt-1" size={18} />
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Location</h3>
                <p className="text-gray-900">{event.location}</p>
              </div>
            </div>
          )}
        </div>

        {/* Event Type */}
        <div className="flex items-start gap-3">
          <Tag className="text-gray-400 mt-1" size={18} />
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">Event Type</h3>
            <p className="text-gray-900">{getEventTypeLabel(event.eventType)}</p>
          </div>
        </div>

        {/* Attendees */}
        {event.attendeeIds && event.attendeeIds.length > 0 && (
          <div className="flex items-start gap-3">
            <Users className="text-gray-400 mt-1" size={18} />
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Attendees</h3>
              <p className="text-gray-900">{event.attendeeIds.length} people attending</p>
              {event.attendeeNames && event.attendeeNames.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {event.attendeeNames.slice(0, 5).map((name, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                      {name}
                    </span>
                  ))}
                  {event.attendeeNames.length > 5 && (
                    <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded">
                      +{event.attendeeNames.length - 5} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Organizers */}
        {event.organizerNames && event.organizerNames.length > 0 && (
          <div className="flex items-start gap-3">
            <User className="text-gray-400 mt-1" size={18} />
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Organizers</h3>
              <div className="flex flex-wrap gap-1">
                {event.organizerNames.map((name, index) => (
                  <span key={index} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded">
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          {/* Registration */}
          {event.registrationRequired && (
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-500" size={16} />
              <span className="text-sm text-gray-700">Registration Required</span>
            </div>
          )}

          {/* Public Event */}
          {event.isPublic && (
            <div className="flex items-center gap-2">
              <Globe className="text-blue-500" size={16} />
              <span className="text-sm text-gray-700">Public Event</span>
            </div>
          )}

          {/* Approval Required */}
          {event.requiresApproval && (
            <div className="flex items-center gap-2">
              <AlertCircle className="text-orange-500" size={16} />
              <span className="text-sm text-gray-700">Requires Approval</span>
            </div>
          )}

          {/* Max Attendees */}
          {event.maxAttendees && (
            <div className="flex items-center gap-2">
              <Users className="text-gray-500" size={16} />
              <span className="text-sm text-gray-700">Max {event.maxAttendees} attendees</span>
            </div>
          )}
        </div>

        {/* Notes */}
        {event.notes && (
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Notes</h3>
            <p className="text-gray-900 text-sm">{event.notes}</p>
          </div>
        )}

        {/* Links */}
        {(event.externalLink || event.meetingLink) && (
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Links</h3>
            <div className="space-y-2">
              {event.externalLink && (
                <a
                  href={event.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm underline block"
                >
                  External Link
                </a>
              )}
              {event.meetingLink && (
                <a
                  href={event.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm underline block"
                >
                  Meeting Link
                </a>
              )}
            </div>
          </div>
        )}

        {/* Created Info */}
        <div className="pt-4 border-t border-gray-200 text-xs text-gray-500">
          <p>
            Created by {event.createdByName || 'Unknown'} on{' '}
            {new Date(event.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          {event.modifiedAt && event.modifiedAt !== event.createdAt && (
            <p className="mt-1">
              Last modified on{' '}
              {new Date(event.modifiedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          )}
        </div>
      </div>

      {/* Close Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
        <button
          onClick={handleClose}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default EventDetailsModal; 