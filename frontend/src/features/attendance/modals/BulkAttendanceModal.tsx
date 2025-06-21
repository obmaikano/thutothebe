import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { createBulkAttendance } from '../attendanceSlice';
import { BulkAttendanceRequest } from '../../../api/services/attendanceApi';
import { closeModal } from '../../common/modalSlice';
import { 
  Users, 
  CheckCircle, 
  UserX, 
  Clock, 
  AlertTriangle, 
  Save,
  RefreshCw,
  Calendar,
  Settings
} from 'lucide-react';

interface BulkAttendanceModalProps {
  extraObject?: {
    classId: number;
    className: string;
    students: any[];
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

const BulkAttendanceModal: React.FC<BulkAttendanceModalProps> = ({ extraObject }) => {
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
  
  // Bulk operation state
  const [bulkAction, setBulkAction] = useState<'PRESENT' | 'ABSENT_EXCUSED' | 'ABSENT_UNEXCUSED' | 'LATE' | 'EARLY_DEPARTURE'>('PRESENT');
  const [bulkRemarks, setBulkRemarks] = useState<string>('');
  const [bulkArrivalTime, setBulkArrivalTime] = useState<string>('');
  const [bulkDepartureTime, setBulkDepartureTime] = useState<string>('');

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

  const handleBulkAction = () => {
    setStudentAttendances(prev => 
      prev.map(student => ({
        ...student,
        attendanceStatus: bulkAction,
        arrivalTime: bulkArrivalTime || undefined,
        departureTime: bulkDepartureTime || undefined,
        remarks: bulkRemarks || undefined
      }))
    );
    setHasChanges(true);
  };

  const handleIndividualStatusChange = (studentId: number, status: StudentAttendance['attendanceStatus']) => {
    setStudentAttendances(prev => 
      prev.map(student => 
        student.studentEntityId === studentId 
          ? { ...student, attendanceStatus: status }
          : student
      )
    );
    setHasChanges(true);
  };

  const handleIndividualTimeChange = (studentId: number, field: 'arrivalTime' | 'departureTime', value: string) => {
    setStudentAttendances(prev => 
      prev.map(student => 
        student.studentEntityId === studentId 
          ? { ...student, [field]: value }
          : student
      )
    );
    setHasChanges(true);
  };

  const handleIndividualRemarksChange = (studentId: number, remarks: string) => {
    setStudentAttendances(prev => 
      prev.map(student => 
        student.studentEntityId === studentId 
          ? { ...student, remarks }
          : student
      )
    );
    setHasChanges(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!extraObject?.classId || studentAttendances.length === 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const bulkData: BulkAttendanceRequest = {
        classId: extraObject.classId,
        attendanceDate: selectedDate,
        attendanceType,
        periodNumber,
        periodStartTime: periodStartTime || undefined,
        periodEndTime: periodEndTime || undefined,
        academicYear,
        term,
        studentAttendances: studentAttendances.map(student => ({
          studentId: student.studentEntityId,
          attendanceStatus: student.attendanceStatus,
          arrivalTime: student.arrivalTime,
          departureTime: student.departureTime,
          remarks: student.remarks
        }))
      };

      await dispatch(createBulkAttendance(bulkData)).unwrap();
      dispatch(closeModal({}));
    } catch (error: any) {
      console.error('Failed to submit bulk attendance:', error);
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
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'EARLY_DEPARTURE':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      default:
        return <Users className="w-4 h-4 text-gray-600" />;
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
          <h3 className="text-lg font-semibold">Bulk Attendance</h3>
          <p className="text-sm text-gray-600">
            {extraObject?.className} • {studentAttendances.length} students
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form Configuration */}
        <div className="bg-base-100 p-4 rounded-lg border">
          <h4 className="font-medium mb-4 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Attendance Configuration
          </h4>
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

        {/* Bulk Actions */}
        <div className="bg-base-100 p-4 rounded-lg border">
          <h4 className="font-medium mb-4">Bulk Actions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Action</span>
              </label>
              <select
                className="select select-bordered"
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value as StudentAttendance['attendanceStatus'])}
              >
                <option value="PRESENT">Present</option>
                <option value="ABSENT_EXCUSED">Absent (Excused)</option>
                <option value="ABSENT_UNEXCUSED">Absent (Unexcused)</option>
                <option value="LATE">Late</option>
                <option value="EARLY_DEPARTURE">Early Departure</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Arrival Time</span>
              </label>
              <input
                type="time"
                className="input input-bordered"
                value={bulkArrivalTime}
                onChange={(e) => setBulkArrivalTime(e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Departure Time</span>
              </label>
              <input
                type="time"
                className="input input-bordered"
                value={bulkDepartureTime}
                onChange={(e) => setBulkDepartureTime(e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Remarks</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                placeholder="Optional remarks"
                value={bulkRemarks}
                onChange={(e) => setBulkRemarks(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={handleBulkAction}
              className="btn btn-primary"
            >
              Apply to All Students
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
              <Clock className="w-8 h-8" />
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
                          onChange={(e) => handleIndividualStatusChange(student.studentEntityId, e.target.value as StudentAttendance['attendanceStatus'])}
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
                          onChange={(e) => handleIndividualTimeChange(student.studentEntityId, 'arrivalTime', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="time"
                          className="input input-bordered input-sm"
                          value={student.departureTime || ''}
                          onChange={(e) => handleIndividualTimeChange(student.studentEntityId, 'departureTime', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-sm"
                          placeholder="Optional remarks"
                          value={student.remarks || ''}
                          onChange={(e) => handleIndividualRemarksChange(student.studentEntityId, e.target.value)}
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
                Save Bulk Attendance
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BulkAttendanceModal; 