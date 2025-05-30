import React from 'react';
import { CheckSquare, X, Clock, AlertTriangle, Edit, Eye, Calendar, User } from 'lucide-react';
import { AttendanceRecord } from '../../../api/services/attendanceApi';

interface AttendanceCardProps {
  record: AttendanceRecord;
  onEdit?: (record: AttendanceRecord) => void;
  onView?: (record: AttendanceRecord) => void;
  showActions?: boolean;
  compact?: boolean;
  className?: string;
}

export const AttendanceCard: React.FC<AttendanceCardProps> = ({
  record,
  onEdit,
  onView,
  showActions = true,
  compact = false,
  className = ""
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PRESENT': return 'text-green-600 bg-green-100 border-green-200';
      case 'ABSENT_EXCUSED': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'ABSENT_UNEXCUSED': return 'text-red-600 bg-red-100 border-red-200';
      case 'LATE': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'EARLY_DEPARTURE': return 'text-purple-600 bg-purple-100 border-purple-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PRESENT': return <CheckSquare className="w-4 h-4" />;
      case 'ABSENT_EXCUSED': return <AlertTriangle className="w-4 h-4" />;
      case 'ABSENT_UNEXCUSED': return <X className="w-4 h-4" />;
      case 'LATE': return <Clock className="w-4 h-4" />;
      case 'EARLY_DEPARTURE': return <Clock className="w-4 h-4" />;
      default: return <CheckSquare className="w-4 h-4" />;
    }
  };

  const formatStatusText = (status: string) => {
    switch (status) {
      case 'PRESENT': return 'Present';
      case 'ABSENT_EXCUSED': return 'Absent (Excused)';
      case 'ABSENT_UNEXCUSED': return 'Absent (Unexcused)';
      case 'LATE': return 'Late';
      case 'EARLY_DEPARTURE': return 'Early Departure';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '-';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (compact) {
    return (
      <div className={`card bg-base-100 shadow-sm border-l-4 ${getStatusColor(record.attendanceStatus)} ${className}`}>
        <div className="card-body p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${getStatusColor(record.attendanceStatus)}`}>
                {getStatusIcon(record.attendanceStatus)}
              </div>
              <div>
                <h4 className="font-semibold">{record.studentName}</h4>
                <p className="text-sm text-gray-600">{formatDate(record.attendanceDate)}</p>
              </div>
            </div>
            <div className="text-right">
              <div className={`badge ${getStatusColor(record.attendanceStatus)}`}>
                {formatStatusText(record.attendanceStatus)}
              </div>
              {record.arrivalTime && (
                <p className="text-xs text-gray-500 mt-1">
                  Arrived: {formatTime(record.arrivalTime)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`card bg-base-100 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <div className="card-body">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-full ${getStatusColor(record.attendanceStatus)}`}>
              {getStatusIcon(record.attendanceStatus)}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{record.studentName}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(record.attendanceDate)}</span>
              </div>
            </div>
          </div>
          <div className={`badge badge-lg ${getStatusColor(record.attendanceStatus)}`}>
            {formatStatusText(record.attendanceStatus)}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Class</label>
            <p className="text-sm font-medium">{record.className}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Subject</label>
            <p className="text-sm font-medium">{record.subjectName || 'General'}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Type</label>
            <p className="text-sm font-medium">{record.attendanceType}</p>
          </div>
          {record.periodNumber && (
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Period</label>
              <p className="text-sm font-medium">{record.periodNumber}</p>
            </div>
          )}
        </div>

        {(record.arrivalTime || record.departureTime) && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Arrival Time</label>
              <p className="text-sm font-medium">{formatTime(record.arrivalTime)}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Departure Time</label>
              <p className="text-sm font-medium">{formatTime(record.departureTime)}</p>
            </div>
          </div>
        )}

        {record.remarks && (
          <div className="mb-4">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Remarks</label>
            <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{record.remarks}</p>
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <User className="w-3 h-3" />
            <span>Marked by {record.markedByName}</span>
          </div>
          {showActions && (
            <div className="flex gap-2">
              {onView && (
                <button
                  onClick={() => onView(record)}
                  className="btn btn-ghost btn-sm"
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => onEdit(record)}
                  className="btn btn-ghost btn-sm"
                  title="Edit Record"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {record.isModified && (
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
            <p className="text-yellow-800">
              <strong>Modified:</strong> {record.modifiedReason}
              {record.modifiedByName && ` by ${record.modifiedByName}`}
              {record.modifiedAt && ` on ${formatDate(record.modifiedAt)}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}; 