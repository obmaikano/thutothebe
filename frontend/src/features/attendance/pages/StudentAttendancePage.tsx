import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Calendar, 
  BarChart3, 
  CheckSquare, 
  X, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Filter,
  Download
} from 'lucide-react';
import { RootState, AppDispatch } from '../../../store';
import { 
  fetchAttendanceByStudent,
  fetchAttendanceByDateRange,
  fetchAttendanceStats,
  clearError
} from '../attendanceSlice';

export const StudentAttendancePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Provide default values to prevent undefined errors
  const attendanceState = useSelector((state: RootState) => state.attendance);
  const {
    attendanceRecords = [],
    attendanceStats,
    status,
    error
  } = attendanceState;

  // Local state
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [startDate, setStartDate] = useState<string>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'calendar' | 'list' | 'stats'>('calendar');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [academicYear] = useState<number>(new Date().getFullYear());

  // Load attendance data
  useEffect(() => {
    if (user?.studentEntityId) {
      dispatch(fetchAttendanceByStudent({
        studentId: user.studentEntityId,
        filters: {
          startDate,
          endDate,
          academicYear
        }
      }));
    }
  }, [dispatch, user?.studentEntityId, startDate, endDate, academicYear]);

  // Load attendance stats
  useEffect(() => {
    if (user?.studentEntityId && startDate && endDate) {
      dispatch(fetchAttendanceByDateRange({
        startDate,
        endDate,
        filters: {
          studentEntityId: user.studentEntityId,
          academicYear
        }
      }));
      dispatch(fetchAttendanceStats({
        studentEntityId: user.studentEntityId,
        startDate,
        endDate,
        academicYear
      }));
    }
  }, [dispatch, user?.studentEntityId, startDate, endDate, academicYear]);

  // Clear error on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Filter records based on status
  const filteredRecords = attendanceRecords.filter(record => {
    if (filterStatus === 'all') return true;
    return record.attendanceStatus === filterStatus;
  });

  // Calculate attendance statistics
  const calculateStats = () => {
    if (!attendanceStats) {
      return {
        totalDays: 0,
        presentDays: 0,
        absentDays: 0,
        lateDays: 0,
        attendanceRate: 0
      };
    }

    return {
      totalDays: attendanceStats.totalRecords,
      presentDays: attendanceStats.presentCount,
      absentDays: attendanceStats.absentExcusedCount + attendanceStats.absentUnexcusedCount,
      lateDays: attendanceStats.lateCount,
      attendanceRate: attendanceStats.attendanceRate
    };
  };

  const stats = calculateStats();

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return 'text-green-600 bg-green-100';
      case 'ABSENT_EXCUSED':
        return 'text-yellow-600 bg-yellow-100';
      case 'ABSENT_UNEXCUSED':
        return 'text-red-600 bg-red-100';
      case 'LATE':
        return 'text-orange-600 bg-orange-100';
      case 'EARLY_DEPARTURE':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return <CheckSquare className="w-4 h-4" />;
      case 'ABSENT_EXCUSED':
      case 'ABSENT_UNEXCUSED':
        return <X className="w-4 h-4" />;
      case 'LATE':
        return <Clock className="w-4 h-4" />;
      case 'EARLY_DEPARTURE':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  // Export attendance data
  const exportAttendance = () => {
    const csvContent = [
      ['Date', 'Status', 'Class', 'Subject', 'Arrival Time', 'Remarks'].join(','),
      ...filteredRecords.map(record => [
        record.attendanceDate,
        record.attendanceStatus,
        record.className,
        record.subjectName || 'N/A',
        record.arrivalTime || 'N/A',
        record.remarks || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${startDate}_to_${endDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <AlertTriangle className="w-6 h-6" />
        <span>{error}</span>
        <button 
          onClick={() => dispatch(clearError())}
          className="btn btn-sm btn-ghost"
        >
          Dismiss
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Attendance</h1>
          <p className="text-gray-600 mt-1">Track your attendance record and statistics</p>
        </div>
        <button
          onClick={exportAttendance}
          className="btn btn-outline btn-sm"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-figure text-primary">
            <Calendar className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Days</div>
          <div className="stat-value text-primary">{stats.totalDays}</div>
          <div className="stat-desc">This period</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-figure text-success">
            <CheckSquare className="w-8 h-8" />
          </div>
          <div className="stat-title">Present Days</div>
          <div className="stat-value text-success">{stats.presentDays}</div>
          <div className="stat-desc">
            {stats.totalDays > 0 ? `${((stats.presentDays / stats.totalDays) * 100).toFixed(1)}%` : '0%'}
          </div>
        </div>

        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-figure text-error">
            <X className="w-8 h-8" />
          </div>
          <div className="stat-title">Absent Days</div>
          <div className="stat-value text-error">{stats.absentDays}</div>
          <div className="stat-desc">
            {attendanceStats ? `${attendanceStats.absentExcusedCount} excused, ${attendanceStats.absentUnexcusedCount} unexcused` : 'No data'}
          </div>
        </div>

        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-figure text-warning">
            <Clock className="w-8 h-8" />
          </div>
          <div className="stat-title">Late Days</div>
          <div className="stat-value text-warning">{stats.lateDays}</div>
          <div className="stat-desc">
            {attendanceStats ? `${attendanceStats.lateCount} times late` : 'No data'}
          </div>
        </div>
      </div>
    </div>
  );
};