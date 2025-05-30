import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchAttendanceById } from '../attendanceSlice';
import { AttendanceRecord } from '../../../api/services/attendanceApi';
import { closeModal } from '../../common/modalSlice';
import { 
  Calendar, 
  Clock, 
  User, 
  BookOpen, 
  MapPin, 
  FileText, 
  Info, 
  History,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Timer,
  LogOut
} from 'lucide-react';

interface AttendanceDetailsModalProps {
  extraObject?: {
    attendanceId: number;
  };
}

const AttendanceDetailsModal: React.FC<AttendanceDetailsModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const { currentAttendance, status, error } = useAppSelector(state => state.attendance);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (extraObject?.attendanceId) {
      setIsLoading(true);
      dispatch(fetchAttendanceById(extraObject.attendanceId))
        .finally(() => setIsLoading(false));
    }
  }, [dispatch, extraObject?.attendanceId]);

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'ABSENT_EXCUSED':
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      case 'ABSENT_UNEXCUSED':
        return <XCircle className="w-5 h-5 text-error" />;
      case 'LATE':
        return <Timer className="w-5 h-5 text-info" />;
      case 'EARLY_DEPARTURE':
        return <LogOut className="w-5 h-5 text-secondary" />;
      default:
        return <Info className="w-5 h-5 text-base-content" />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return 'badge-success';
      case 'ABSENT_EXCUSED':
        return 'badge-warning';
      case 'ABSENT_UNEXCUSED':
        return 'badge-error';
      case 'LATE':
        return 'badge-info';
      case 'EARLY_DEPARTURE':
        return 'badge-secondary';
      default:
        return 'badge-ghost';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'DAILY':
        return <Calendar className="w-4 h-4" />;
      case 'PERIOD':
        return <Clock className="w-4 h-4" />;
      case 'EVENT':
        return <MapPin className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return 'Not recorded';
    return timeString;
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="text-gray-600">Loading attendance details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="alert alert-error">
          <XCircle className="w-4 h-4" />
          <span>Failed to load attendance details: {error}</span>
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={handleClose} className="btn btn-ghost">
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!currentAttendance) {
    return (
      <div className="p-6">
        <div className="alert alert-warning">
          <AlertTriangle className="w-4 h-4" />
          <span>Attendance record not found</span>
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={handleClose} className="btn btn-ghost">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Attendance Record Details</h3>
          <p className="text-sm text-gray-600">
            Record ID: {currentAttendance.id} • {formatDate(currentAttendance.attendanceDate)}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Status and Type Overview */}
        <div className="bg-base-100 p-4 rounded-lg border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Status & Type</h4>
            <div className="flex items-center gap-2">
              {getStatusIcon(currentAttendance.attendanceStatus)}
              <span className={`badge ${getStatusBadgeClass(currentAttendance.attendanceStatus)}`}>
                {currentAttendance.attendanceStatus.replace('_', ' ')}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              {getTypeIcon(currentAttendance.attendanceType)}
              <span className="text-sm">
                <span className="font-medium">Type:</span> {currentAttendance.attendanceType}
              </span>
            </div>
            
            {currentAttendance.attendanceType === 'PERIOD' && currentAttendance.periodNumber && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">
                  <span className="font-medium">Period:</span> {currentAttendance.periodNumber}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Student Information */}
        <div className="bg-base-100 p-4 rounded-lg border">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <User className="w-4 h-4" />
            Student Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Student Name</label>
              <p className="text-sm">{currentAttendance.studentName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Student ID</label>
              <p className="text-sm">{currentAttendance.studentEntityId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Class</label>
              <p className="text-sm">{currentAttendance.className}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Class ID</label>
              <p className="text-sm">{currentAttendance.classId}</p>
            </div>
          </div>
        </div>

        {/* Course and Subject Information */}
        {(currentAttendance.courseName || currentAttendance.subjectName) && (
          <div className="bg-base-100 p-4 rounded-lg border">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Course & Subject
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentAttendance.courseName && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Course</label>
                  <p className="text-sm">{currentAttendance.courseName}</p>
                </div>
              )}
              {currentAttendance.subjectName && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Subject</label>
                  <p className="text-sm">{currentAttendance.subjectName}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Time Information */}
        <div className="bg-base-100 p-4 rounded-lg border">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Time Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Date</label>
              <p className="text-sm">{formatDate(currentAttendance.attendanceDate)}</p>
            </div>
            
            {currentAttendance.arrivalTime && (
              <div>
                <label className="text-sm font-medium text-gray-600">Arrival Time</label>
                <p className="text-sm">{formatTime(currentAttendance.arrivalTime)}</p>
              </div>
            )}
            
            {currentAttendance.departureTime && (
              <div>
                <label className="text-sm font-medium text-gray-600">Departure Time</label>
                <p className="text-sm">{formatTime(currentAttendance.departureTime)}</p>
              </div>
            )}

            {currentAttendance.attendanceType === 'PERIOD' && (
              <>
                {currentAttendance.periodStartTime && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Period Start</label>
                    <p className="text-sm">{formatTime(currentAttendance.periodStartTime)}</p>
                  </div>
                )}
                {currentAttendance.periodEndTime && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Period End</label>
                    <p className="text-sm">{formatTime(currentAttendance.periodEndTime)}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Academic Information */}
        <div className="bg-base-100 p-4 rounded-lg border">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Academic Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Academic Year</label>
              <p className="text-sm">{currentAttendance.academicYear}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Term</label>
              <p className="text-sm">{currentAttendance.term.replace('_', ' ')}</p>
            </div>
          </div>
        </div>

        {/* Remarks */}
        {currentAttendance.remarks && (
          <div className="bg-base-100 p-4 rounded-lg border">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Remarks
            </h4>
            <p className="text-sm bg-base-200 p-3 rounded">
              {currentAttendance.remarks}
            </p>
          </div>
        )}

        {/* Record Metadata */}
        <div className="bg-base-100 p-4 rounded-lg border">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <History className="w-4 h-4" />
            Record Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Marked By</label>
              <p className="text-sm">{currentAttendance.markedByName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Marked At</label>
              <p className="text-sm">{formatDateTime(currentAttendance.markedAt)}</p>
            </div>
            
            {currentAttendance.modifiedByName && (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-600">Modified By</label>
                  <p className="text-sm">{currentAttendance.modifiedByName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Modified At</label>
                  <p className="text-sm">{currentAttendance.modifiedAt ? formatDateTime(currentAttendance.modifiedAt) : 'N/A'}</p>
                </div>
              </>
            )}

            {currentAttendance.modificationReason && (
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-600">Modification Reason</label>
                <p className="text-sm bg-base-200 p-2 rounded">{currentAttendance.modificationReason}</p>
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium text-gray-600">Created At</label>
              <p className="text-sm">{formatDateTime(currentAttendance.createdAt)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Updated At</label>
              <p className="text-sm">{formatDateTime(currentAttendance.updatedAt)}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Record ID</label>
              <p className="text-sm font-mono">{currentAttendance.id}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={handleClose}
            className="btn btn-ghost"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceDetailsModal; 