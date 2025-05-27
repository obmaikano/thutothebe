import React from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { Schedule } from '../../../api/services/scheduleApi';
import { 
  Calendar, Clock, MapPin, BookOpen, Users, Eye, 
  Tag, FileText, Repeat, CheckCircle, XCircle 
} from 'lucide-react';

interface ScheduleViewModalProps {
  extraObject?: {
    schedule: Schedule;
    classes?: any[];
    teachers?: any[];
    subjects?: any[];
  };
}

export const ScheduleViewModal: React.FC<ScheduleViewModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  if (!extraObject?.schedule) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">No schedule data available</div>
      </div>
    );
  }

  const { schedule, classes, teachers, subjects } = extraObject;

  // Helper functions to get related data
  const getClassName = (classId?: number) => {
    if (!classId || !classes) return 'No class assigned';
    const cls = classes.find(c => c.id === classId);
    return cls ? cls.name : 'Unknown class';
  };

  const getTeacherName = (teacherId?: number) => {
    if (!teacherId || !teachers) return 'No teacher assigned';
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unknown teacher';
  };

  const getSubjectName = (subjectId?: number) => {
    if (!subjectId || !subjects) return 'No subject assigned';
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : 'Unknown subject';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'POSTPONED':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'LECTURE':
        return 'bg-blue-100 text-blue-800';
      case 'LAB':
        return 'bg-green-100 text-green-800';
      case 'EXAM':
        return 'bg-red-100 text-red-800';
      case 'MEETING':
        return 'bg-purple-100 text-purple-800';
      case 'BREAK':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Eye className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{schedule.title}</h2>
          <p className="text-sm text-gray-600">
            Schedule Entry Details
          </p>
        </div>
      </div>

      {/* Status and Type Badges */}
      <div className="flex items-center gap-3">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(schedule.status)}`}>
          {schedule.status === 'ACTIVE' ? (
            <CheckCircle className="w-4 h-4 mr-1" />
          ) : (
            <XCircle className="w-4 h-4 mr-1" />
          )}
          {schedule.status}
        </span>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(schedule.type)}`}>
          <Tag className="w-4 h-4 mr-1" />
          {schedule.type}
        </span>
        {schedule.isRecurring && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
            <Repeat className="w-4 h-4 mr-1" />
            Recurring
          </span>
        )}
      </div>

      {/* Main Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Time & Date Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2">
            Time & Date Information
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-sm font-medium text-gray-900">Day of Week</div>
                <div className="text-sm text-gray-600">{schedule.dayOfWeek}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-sm font-medium text-gray-900">Time</div>
                <div className="text-sm text-gray-600">{schedule.startTime} - {schedule.endTime}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-sm font-medium text-gray-900">Effective Date</div>
                <div className="text-sm text-gray-600">{formatDate(schedule.effectiveDate)}</div>
              </div>
            </div>

            {schedule.expiryDate && (
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Expiry Date</div>
                  <div className="text-sm text-gray-600">{formatDate(schedule.expiryDate)}</div>
                </div>
              </div>
            )}

            {schedule.location && (
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Location</div>
                  <div className="text-sm text-gray-600">{schedule.location}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Assignment Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2">
            Assignment Information
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-sm font-medium text-gray-900">Class</div>
                <div className="text-sm text-gray-600">{getClassName(schedule.classId)}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-sm font-medium text-gray-900">Teacher</div>
                <div className="text-sm text-gray-600">{getTeacherName(schedule.teacherId)}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <BookOpen className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-sm font-medium text-gray-900">Course</div>
                <div className="text-sm text-gray-600">
                  {schedule.courseId ? `Course ID: ${schedule.courseId}` : 'No course assigned'}
                </div>
              </div>
            </div>

            {schedule.color && (
              <div className="flex items-center gap-3">
                <div 
                  className="h-4 w-4 rounded border border-gray-300"
                  style={{ backgroundColor: schedule.color }}
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">Color</div>
                  <div className="text-sm text-gray-600">{schedule.color}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recurrence Information */}
      {schedule.isRecurring && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Repeat className="h-4 w-4 text-indigo-600" />
            <h3 className="text-sm font-medium text-indigo-900">Recurrence Information</h3>
          </div>
          <div className="text-sm text-indigo-800">
            <p>This schedule repeats {schedule.recurrenceRule?.toLowerCase() || 'weekly'}.</p>
            {schedule.expiryDate ? (
              <p>Recurrence will end on {formatDate(schedule.expiryDate)}.</p>
            ) : (
              <p>This schedule will continue indefinitely until manually stopped.</p>
            )}
          </div>
        </div>
      )}

      {/* Description */}
      {schedule.description && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Description
          </h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-sm text-gray-700">{schedule.description}</p>
          </div>
        </div>
      )}

      {/* System Information */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">System Information</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Schedule ID:</span>
            <span className="ml-2 text-gray-600">{schedule.id}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Active:</span>
            <span className="ml-2 text-gray-600">{schedule.active ? 'Yes' : 'No'}</span>
          </div>
          {schedule.schoolId && (
            <div>
              <span className="font-medium text-gray-700">School ID:</span>
              <span className="ml-2 text-gray-600">{schedule.schoolId}</span>
            </div>
          )}
          {schedule.regionId && (
            <div>
              <span className="font-medium text-gray-700">Region ID:</span>
              <span className="ml-2 text-gray-600">{schedule.regionId}</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button
          onClick={handleClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ScheduleViewModal; 