import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { createBulkAttendance } from '../../attendance/attendanceSlice';
import { BulkAttendanceRequest } from '../../../api/services/attendanceApi';
import { closeModal } from '../../common/modalSlice';
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Save,
  RefreshCw,
  UserCheck,
  UserX,
  Clock as ClockIcon
} from 'lucide-react';

interface TakeAttendanceModalProps {
  extraObject?: {
    classId: number;
    className: string;
    students: any[];
    onSuccess?: () => void;
  };
}

interface StudentAttendance {
  studentEntityId: number;
  studentName: string;
  admissionNumber: string;
  attendanceStatus: 'PRESENT' | 'ABSENT_EXCUSED' | 'ABSENT_UNEXCUSED' | 'LATE' | 'EARLY_DEPARTURE';
  arrivalTime?: string;
  departureTime?: string;
  remarks?: string;
}

const TakeAttendanceModal: React.FC<TakeAttendanceModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector(state => state.attendance);
  const { user } = useAppSelector(state => state.auth);

  // Form state
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attendanceType, setAttendanceType] = useState<'DAILY' | 'PERIOD' | 'EVENT'>('DAILY');
  const [periodNumber, setPeriodNumber] = useState<number | undefined>(undefined);
  const [periodStartTime, setPeriodStartTime] = useState<string>('');
  const [periodEndTime, setPeriodEndTime] = useState<string>('');
  const [academicYear, setAcademicYear] = useState<number>(new Date().getFullYear());
  const [term, setTerm] = useState<'FIRST_TERM' | 'SECOND_TERM' | 'THIRD_TERM'>('FIRST_TERM');

  const [studentAttendances, setStudentAttendances] = useState<StudentAttendance[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize student attendances
  useEffect(() => {
    if (extraObject?.students) {
      const initialAttendances: StudentAttendance[] = extraObject.students.map(student => ({
        studentEntityId: student.id,
        studentName: `${student.firstName} ${student.lastName}`,
        admissionNumber: student.admissionNumber || student.id.toString(),
        attendanceStatus: 'PRESENT',
        arrivalTime: undefined,
        departureTime: undefined,
        remarks: undefined
      }));
      setStudentAttendances(initialAttendances);
    }
  }, [extraObject?.students]);

  const handleStudentStatusChange = (studentId: number, status: StudentAttendance['attendanceStatus']) => {
    setStudentAttendances(prev => 
      prev.map(student => 
        student.studentEntityId === studentId 
          ? { ...student, attendanceStatus: status }
          : student
      )
    );
    setHasChanges(true);
  };

  const handleStudentTimeChange = (studentId: number, field: 'arrivalTime' | 'departureTime', value: string) => {
    setStudentAttendances(prev => 
      prev.map(student => 
        student.studentEntityId === studentId 
          ? { ...student, [field]: value }
          : student
      )
    );
    setHasChanges(true);
  };

  const handleStudentRemarksChange = (studentId: number, remarks: string) => {
    setStudentAttendances(prev => 
      prev.map(student => 
        student.studentEntityId === studentId 
          ? { ...student, remarks }
          : student
      )
    );
    setHasChanges(true);
  };

  const handleQuickMarkAll = (status: StudentAttendance['attendanceStatus']) => {
    setStudentAttendances(prev => 
      prev.map(student => ({
        ...student,
        attendanceStatus: status
      }))
    );
    setHasChanges(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields (matching @NotNull annotations)
    if (!extraObject?.classId) {
      alert('Class ID is required');
      return;
    }
    if (!selectedDate) {
      alert('Attendance date is required');
      return;
    }
    if (!attendanceType) {
      alert('Attendance type is required');
      return;
    }
    if (!academicYear) {
      alert('Academic year is required');
      return;
    }
    if (!user?.id) {
      alert('User ID is required');
      return;
    }

    // Academic year range validation (2000-2100)
    if (academicYear < 2000 || academicYear > 2100) {
      alert('Academic year must be between 2000 and 2100');
      return;
    }

    // Future date validation (@PastOrPresent)
    const selectedDateObj = new Date(selectedDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    if (selectedDateObj > today) {
      alert('Attendance date cannot be in the future');
      return;
    }

    // Period-specific validations
    if (attendanceType === 'PERIOD') {
      if (!periodNumber) {
        alert('Period number is required for period-based attendance');
        return;
      }
      if (!periodStartTime || !periodEndTime) {
        alert('Period start and end times are required for period attendance');
        return;
      }
    }

    // Check if at least one student has attendance marked
    const hasAttendanceMarked = studentAttendances.some(student => 
      student.attendanceStatus !== 'PRESENT' || 
      student.arrivalTime || 
      student.departureTime || 
      student.remarks
    );

    if (!hasAttendanceMarked) {
      alert('Please mark attendance for at least one student');
      return;
    }

    setIsSubmitting(true);

    try {
      const bulkData: BulkAttendanceRequest = {
        // Required fields (matching @NotNull annotations)
        classId: extraObject.classId,
        attendanceDate: selectedDate,
        attendanceType,
        academicYear,
        markedById: user?.id || 0,  // @NotNull - will be set by Redux thunk
        studentAttendances: studentAttendances.map(student => ({
          studentId: student.studentEntityId,
          attendanceStatus: student.attendanceStatus,
          arrivalTime: student.arrivalTime,
          departureTime: student.departureTime,
          remarks: student.remarks
        })),
        
        // Optional fields
        periodNumber: attendanceType === 'PERIOD' ? periodNumber : undefined,
        periodStartTime: attendanceType === 'PERIOD' ? periodStartTime : undefined,
        periodEndTime: attendanceType === 'PERIOD' ? periodEndTime : undefined,
        term
      };

      await dispatch(createBulkAttendance(bulkData)).unwrap();
      dispatch(closeModal({}));
      if (extraObject?.onSuccess) {
        extraObject.onSuccess();
      }
    } catch (error: any) {
      console.error('Failed to submit attendance:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        dispatch(closeModal({}));
      }
    } else {
      dispatch(closeModal({}));
    }
  };

  const getStatusIcon = (status: StudentAttendance['attendanceStatus']) => {
    switch (status) {
      case 'PRESENT':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'ABSENT_EXCUSED':
      case 'ABSENT_UNEXCUSED':
        return <UserX className="w-4 h-4 text-red-600" />;
      case 'LATE':
        return <ClockIcon className="w-4 h-4 text-yellow-600" />;
      case 'EARLY_DEPARTURE':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      default:
        return <UserCheck className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadgeClass = (status: StudentAttendance['attendanceStatus']) => {
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
        return 'badge-neutral';
    }
  };

  const getAttendanceStats = () => {
    const stats = {
      present: studentAttendances.filter(s => s.attendanceStatus === 'PRESENT').length,
      absent: studentAttendances.filter(s => s.attendanceStatus.includes('ABSENT')).length,
      late: studentAttendances.filter(s => s.attendanceStatus === 'LATE').length,
      early: studentAttendances.filter(s => s.attendanceStatus === 'EARLY_DEPARTURE').length,
      total: studentAttendances.length
    };
    
    return {
      ...stats,
      attendanceRate: stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0
    };
  };

  const stats = getAttendanceStats();

  return (
    <div className="p-6 max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Users className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Take Attendance</h3>
          <p className="text-sm text-gray-600">
            {extraObject?.className} • {studentAttendances.length} students
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form Configuration */}
        <div className="bg-base-100 p-4 rounded-lg border">
          <h4 className="font-medium mb-4">Attendance Configuration</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Date *</span>
              </label>
              <input
                type="date"
                className="input input-bordered"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Type *</span>
              </label>
              <select
                className="select select-bordered"
                value={attendanceType}
                onChange={(e) => setAttendanceType(e.target.value as 'DAILY' | 'PERIOD' | 'EVENT')}
                required
              >
                <option value="DAILY">Daily</option>
                <option value="PERIOD">Period</option>
                <option value="EVENT">Event</option>
              </select>
            </div>

            {attendanceType === 'PERIOD' && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Period Number</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered"
                  value={periodNumber || ''}
                  onChange={(e) => setPeriodNumber(e.target.value ? parseInt(e.target.value) : undefined)}
                  min="1"
                  max="10"
                />
              </div>
            )}

            {attendanceType === 'PERIOD' && (
              <>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Period Start Time</span>
                  </label>
                  <input
                    type="time"
                    className="input input-bordered"
                    value={periodStartTime}
                    onChange={(e) => setPeriodStartTime(e.target.value)}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Period End Time</span>
                  </label>
                  <input
                    type="time"
                    className="input input-bordered"
                    value={periodEndTime}
                    onChange={(e) => setPeriodEndTime(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Academic Year</span>
              </label>
              <input
                type="number"
                className="input input-bordered"
                value={academicYear}
                onChange={(e) => setAcademicYear(parseInt(e.target.value))}
                min="2020"
                max="2030"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Term</span>
              </label>
              <select
                className="select select-bordered"
                value={term}
                onChange={(e) => setTerm(e.target.value as 'FIRST_TERM' | 'SECOND_TERM' | 'THIRD_TERM')}
              >
                <option value="FIRST_TERM">First Term</option>
                <option value="SECOND_TERM">Second Term</option>
                <option value="THIRD_TERM">Third Term</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-base-100 p-4 rounded-lg border">
          <h4 className="font-medium mb-4">Quick Actions</h4>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleQuickMarkAll('PRESENT')}
              className="btn btn-success btn-sm"
            >
              <CheckCircle className="w-4 h-4" />
              Mark All Present
            </button>
            <button
              type="button"
              onClick={() => handleQuickMarkAll('ABSENT_UNEXCUSED')}
              className="btn btn-error btn-sm"
            >
              <UserX className="w-4 h-4" />
              Mark All Absent
            </button>
            <button
              type="button"
              onClick={() => handleQuickMarkAll('LATE')}
              className="btn btn-info btn-sm"
            >
              <ClockIcon className="w-4 h-4" />
              Mark All Late
            </button>
          </div>
        </div>

        {/* Attendance Statistics */}
        <div className="stats stats-horizontal shadow w-full">
          <div className="stat">
            <div className="stat-figure text-success">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div className="stat-title">Present</div>
            <div className="stat-value text-success">{stats.present}</div>
          </div>
          
          <div className="stat">
            <div className="stat-figure text-error">
              <UserX className="w-8 h-8" />
            </div>
            <div className="stat-title">Absent</div>
            <div className="stat-value text-error">{stats.absent}</div>
          </div>
          
          <div className="stat">
            <div className="stat-figure text-info">
              <ClockIcon className="w-8 h-8" />
            </div>
            <div className="stat-title">Late</div>
            <div className="stat-value text-info">{stats.late}</div>
          </div>
          
          <div className="stat">
            <div className="stat-figure text-secondary">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="stat-title">Early Departure</div>
            <div className="stat-value text-secondary">{stats.early}</div>
          </div>
          
          <div className="stat">
            <div className="stat-figure text-primary">
              <Users className="w-8 h-8" />
            </div>
            <div className="stat-title">Attendance Rate</div>
            <div className="stat-value text-primary">{stats.attendanceRate}%</div>
          </div>
        </div>

        {/* Student Roster */}
        <div className="bg-base-100 p-4 rounded-lg border">
          <h4 className="font-medium mb-4">Student Roster</h4>
          
          {studentAttendances.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No students found for this class</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Status</th>
                    <th>Arrival Time</th>
                    <th>Departure Time</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {studentAttendances.map((student) => (
                    <tr key={student.studentEntityId}>
                      <td>
                        <div>
                          <div className="font-medium">{student.studentName}</div>
                          <div className="text-sm text-gray-500">{student.admissionNumber}</div>
                        </div>
                      </td>
                      <td>
                        <select
                          className="select select-bordered select-sm"
                          value={student.attendanceStatus}
                          onChange={(e) => handleStudentStatusChange(student.studentEntityId, e.target.value as StudentAttendance['attendanceStatus'])}
                        >
                          <option value="PRESENT">Present</option>
                          <option value="ABSENT_EXCUSED">Absent (Excused)</option>
                          <option value="ABSENT_UNEXCUSED">Absent (Unexcused)</option>
                          <option value="LATE">Late</option>
                          <option value="EARLY_DEPARTURE">Early Departure</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="time"
                          className="input input-bordered input-sm"
                          value={student.arrivalTime || ''}
                          onChange={(e) => handleStudentTimeChange(student.studentEntityId, 'arrivalTime', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="time"
                          className="input input-bordered input-sm"
                          value={student.departureTime || ''}
                          onChange={(e) => handleStudentTimeChange(student.studentEntityId, 'departureTime', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-sm"
                          placeholder="Optional remarks"
                          value={student.remarks || ''}
                          onChange={(e) => handleStudentRemarksChange(student.studentEntityId, e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="alert alert-error">
            <AlertTriangle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="btn btn-ghost"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || studentAttendances.length === 0}
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Attendance
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TakeAttendanceModal; 