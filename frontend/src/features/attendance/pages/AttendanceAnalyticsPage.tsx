import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  fetchAttendanceStats,
  fetchAttendanceSummary,
  fetchAttendanceByDateRange,
  clearError
} from '../attendanceSlice';
import { fetchClasses } from '../../classes/classesSlice';
import { fetchSubjects } from '../../subjects/subjectsSlice';
import { AttendanceFilters } from '../components/AttendanceFilters';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
  BarChart3,
  Download,
  FileText,
  RefreshCw,
  Eye,
  X
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface AttendanceAnalyticsPageProps {}

const AttendanceAnalyticsPage: React.FC<AttendanceAnalyticsPageProps> = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { 
    attendanceStats, 
    attendanceSummary, 
    attendanceRecords,
    status, 
    error 
  } = useAppSelector(state => state.attendance);
  const { classes } = useAppSelector(state => state.classes);
  const { subjects } = useAppSelector(state => state.subjects);

  // State management
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'trends'>('overview');
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);

  // Permission checks
  const canViewAnalytics = user && [
    'SUPER_ADMIN',
    'MINISTRY_EXECUTIVE',
    'MINISTRY_STAFF', 
    'DIRECTOR',
    'REGIONAL_ADMIN',
    'REGIONAL_OFFICER',
    'SCHOOL_ADMIN',
    'SCHOOL_HEAD',
    'DEPARTMENT_HEAD',
    'SENIOR_TEACHER',
    'TEACHER'
  ].includes(user.role);

  const canExportData = user && [
    'SUPER_ADMIN',
    'MINISTRY_EXECUTIVE',
    'MINISTRY_STAFF',
    'DIRECTOR', 
    'REGIONAL_ADMIN',
    'SCHOOL_ADMIN',
    'SCHOOL_HEAD',
    'DEPARTMENT_HEAD'
  ].includes(user.role);

  const canNotifyParents = user && [
    'SCHOOL_ADMIN',
    'SCHOOL_HEAD',
    'DEPARTMENT_HEAD',
    'SENIOR_TEACHER',
    'TEACHER'
  ].includes(user.role);

  useEffect(() => {
    if (canViewAnalytics) {
      // Load initial data
      dispatch(fetchClasses());
      dispatch(fetchSubjects());
      loadAttendanceData();
    }
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, canViewAnalytics]);

  const loadAttendanceData = () => {
    if (!canViewAnalytics) return;

    const filters = {
      startDate: selectedDateRange.startDate,
      endDate: selectedDateRange.endDate,
      ...(selectedClass && { classId: selectedClass }),
      ...(selectedSubject && { subjectId: selectedSubject }),
      ...(user?.schoolId && { schoolId: user.schoolId })
    };

    dispatch(fetchAttendanceStats(filters));
    dispatch(fetchAttendanceSummary(filters));
    dispatch(fetchAttendanceByDateRange({
      startDate: selectedDateRange.startDate,
      endDate: selectedDateRange.endDate,
      filters
    }));
  };

  useEffect(() => {
    if (canViewAnalytics) {
      loadAttendanceData();
    }
  }, [selectedDateRange, selectedClass, selectedSubject]);

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setSelectedDateRange({ startDate, endDate });
  };

  const handleClassChange = (classId: number | null) => {
    setSelectedClass(classId);
  };

  const handleSubjectChange = (subjectId: number | null) => {
    setSelectedSubject(subjectId);
  };

  const handleExportData = (format: 'pdf' | 'excel' | 'csv') => {
    if (!canExportData) return;
    console.log(`Exporting attendance analytics data as ${format}`);
    // TODO: Implement actual export functionality
  };

  const handleNotifyParents = () => {
    if (!canNotifyParents) return;
    console.log('Notifying parents of absent students');
    // TODO: Implement parent notification functionality
  };

  const refreshData = () => {
    loadAttendanceData();
  };

  const clearFilters = () => {
    setSelectedClass(null);
    setSelectedSubject(null);
    setSelectedDateRange({
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0]
    });
  };

  // Calculate dashboard metrics from real data
  const dashboardData = attendanceSummary ? {
    totalStudents: attendanceSummary.totalStudents,
    presentToday: attendanceSummary.presentToday,
    absentToday: attendanceSummary.absentToday,
    lateToday: attendanceSummary.lateToday,
    attendanceRate: Number(attendanceSummary.attendanceRate.toFixed(1)),
    classesWithLowAttendance: 0, // TODO: Calculate from attendanceStats
    perfectAttendanceStudents: 0 // TODO: Calculate from attendanceRecords
  } : {
    totalStudents: 0,
    presentToday: 0,
    absentToday: 0,
    lateToday: 0,
    attendanceRate: 0,
    classesWithLowAttendance: 0,
    perfectAttendanceStudents: 0
  };

  // Prepare chart data from real attendance trends
  const trendChartData = attendanceSummary?.trends?.map(trend => ({
    date: new Date(trend.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    present: trend.presentCount,
    absent: trend.absentCount,
    late: trend.lateCount,
    total: trend.totalCount,
    attendanceRate: ((trend.presentCount / trend.totalCount) * 100).toFixed(1)
  })) || [];

  const statusDistributionData = [
    { name: 'Present', value: dashboardData.presentToday, color: '#10B981' },
    { name: 'Absent', value: dashboardData.absentToday, color: '#EF4444' },
    { name: 'Late', value: dashboardData.lateToday, color: '#F59E0B' }
  ];

  if (!canViewAnalytics) {
    return (
      <div className="p-6">
        <div className="alert alert-warning">
          <AlertTriangle className="w-5 h-5" />
          <span>You don't have permission to view attendance analytics.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive attendance analytics and reporting dashboard</p>
        </div>
        <div className="flex gap-2">
          <div className="btn-group">
            <button
              onClick={() => setViewMode('overview')}
              className={`btn btn-sm ${viewMode === 'overview' ? 'btn-active' : ''}`}
            >
              <BarChart3 className="w-4 h-4 mr-1" />
              Overview
            </button>
            <button
              onClick={() => setViewMode('detailed')}
              className={`btn btn-sm ${viewMode === 'detailed' ? 'btn-active' : ''}`}
            >
              <Eye className="w-4 h-4 mr-1" />
              Detailed
            </button>
            <button
              onClick={() => setViewMode('trends')}
              className={`btn btn-sm ${viewMode === 'trends' ? 'btn-active' : ''}`}
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              Trends
            </button>
          </div>
          <button
            onClick={refreshData}
            className="btn btn-ghost btn-sm"
            disabled={status === 'loading'}
          >
            <RefreshCw className={`w-4 h-4 ${status === 'loading' ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          {canExportData && (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-primary btn-sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </label>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                <li><a onClick={() => handleExportData('pdf')}>
                  <FileText className="w-4 h-4" />
                  Export as PDF
                </a></li>
                <li><a onClick={() => handleExportData('excel')}>
                  <BarChart3 className="w-4 h-4" />
                  Export as Excel
                </a></li>
                <li><a onClick={() => handleExportData('csv')}>
                  <FileText className="w-4 h-4" />
                  Export as CSV
                </a></li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-error">
          <AlertTriangle className="w-5 h-5" />
          <span>{error}</span>
          <button 
            onClick={() => dispatch(clearError())}
            className="btn btn-sm btn-ghost"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filters */}
      <AttendanceFilters
        searchTerm=""
        onSearchChange={() => {}}
        selectedClass={selectedClass}
        onClassChange={handleClassChange}
        selectedStatus=""
        onStatusChange={() => {}}
        selectedType=""
        onTypeChange={() => {}}
        startDate={selectedDateRange.startDate}
        onStartDateChange={(date: string) => handleDateRangeChange(date, selectedDateRange.endDate)}
        endDate={selectedDateRange.endDate}
        onEndDateChange={(date: string) => handleDateRangeChange(selectedDateRange.startDate, date)}
        classes={classes}
        subjects={subjects}
        selectedSubject={selectedSubject}
        onSubjectChange={handleSubjectChange}
        onClearFilters={clearFilters}
      />

      {/* Quick Actions */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <div className="flex justify-between items-center">
            <h3 className="card-title">Quick Actions</h3>
            <div className="flex gap-2">
              {canNotifyParents && (
                <button
                  onClick={handleNotifyParents}
                  className="btn btn-warning btn-sm"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Notify Parents
                </button>
              )}
              <button
                onClick={() => window.location.href = '/app/attendance'}
                className="btn btn-primary btn-sm"
              >
                <Users className="w-4 h-4 mr-2" />
                Mark Attendance
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {status === 'loading' && (
        <div className="flex justify-center items-center py-12">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      )}

      {/* Overview Cards */}
      {status !== 'loading' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-3xl font-bold text-primary">{dashboardData.totalStudents}</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Present Today</p>
                  <p className="text-3xl font-bold text-success">{dashboardData.presentToday}</p>
                  <p className="text-sm text-gray-500">
                    {((dashboardData.presentToday / dashboardData.totalStudents) * 100).toFixed(1)}% of total
                  </p>
                </div>
                <div className="p-3 bg-success/10 rounded-full">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Absent Today</p>
                  <p className="text-3xl font-bold text-error">{dashboardData.absentToday}</p>
                  <p className="text-sm text-gray-500">
                    {((dashboardData.absentToday / dashboardData.totalStudents) * 100).toFixed(1)}% of total
                  </p>
                </div>
                <div className="p-3 bg-error/10 rounded-full">
                  <XCircle className="h-8 w-8 text-error" />
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Late Today</p>
                  <p className="text-3xl font-bold text-warning">{dashboardData.lateToday}</p>
                  <p className="text-sm text-gray-500">
                    {((dashboardData.lateToday / dashboardData.totalStudents) * 100).toFixed(1)}% of total
                  </p>
                </div>
                <div className="p-3 bg-warning/10 rounded-full">
                  <Clock className="h-8 w-8 text-warning" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      {status !== 'loading' && viewMode === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Rate Card */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h3 className="card-title mb-4">Overall Attendance Rate</h3>
              <div className="flex items-center justify-center">
                <div className="radial-progress text-primary" style={{"--value": dashboardData.attendanceRate} as React.CSSProperties}>
                  <span>{dashboardData.attendanceRate}%</span>
                </div>
              </div>
              <div className="mt-4 flex justify-around text-sm">
                <div className="text-center">
                  <div className="font-semibold text-success">
                    {Math.round((dashboardData.presentToday / dashboardData.totalStudents) * 100)}%
                  </div>
                  <div className="text-gray-500">Present</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-error">
                    {Math.round((dashboardData.absentToday / dashboardData.totalStudents) * 100)}%
                  </div>
                  <div className="text-gray-500">Absent</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-warning">
                    {Math.round((dashboardData.lateToday / dashboardData.totalStudents) * 100)}%
                  </div>
                  <div className="text-gray-500">Late</div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Statistics */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h3 className="card-title mb-4">Additional Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-700">Classes with Low Attendance</span>
                  <div className="text-2xl font-bold">{dashboardData.classesWithLowAttendance}</div>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-700">Perfect Attendance Students</span>
                  <div className="text-2xl font-bold">{dashboardData.perfectAttendanceStudents}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trends View */}
      {status !== 'loading' && viewMode === 'trends' && trendChartData.length > 0 && (
        <div className="grid grid-cols-1 gap-6">
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h3 className="card-title mb-4">Attendance Trends</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={trendChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="present" stroke="#10B981" strokeWidth={2} name="Present" />
                  <Line type="monotone" dataKey="absent" stroke="#EF4444" strokeWidth={2} name="Absent" />
                  <Line type="monotone" dataKey="late" stroke="#F59E0B" strokeWidth={2} name="Late" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status Distribution */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h3 className="card-title mb-4">Today's Status Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* No Data State */}
      {status !== 'loading' && (!attendanceSummary || dashboardData.totalStudents === 0) && (
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Attendance Data Available</h3>
            <p className="text-gray-500 mb-4">
              No attendance records found for the selected date range and filters.
            </p>
            <button 
              onClick={clearFilters}
              className="btn btn-primary"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceAnalyticsPage; 