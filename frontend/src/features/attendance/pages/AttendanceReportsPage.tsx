import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  BarChart3, 
  Download, 
  Calendar, 
  Users, 
  TrendingUp, 
  FileText, 
  Filter, 
  RefreshCw,
  AlertTriangle,
  CheckSquare,
  X,
  Clock,
  Eye,
  Settings,
  Mail
} from 'lucide-react';
import { RootState, AppDispatch } from '../../../store';
import { 
  fetchAttendanceStats, 
  fetchAttendanceSummary,
  fetchAttendanceByDateRange,
  clearError
} from '../attendanceSlice';
import { AttendanceStats, AttendanceFilters } from '../components';

export const AttendanceReportsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Provide default values to prevent undefined errors
  const attendanceState = useSelector((state: RootState) => state.attendance);
  const {
    attendanceStats = null,
    attendanceSummary = null,
    attendanceRecords = [],
    status = 'idle',
    error = null
  } = attendanceState || {};
  
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly' | 'term'>('weekly');
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'trends'>('overview');

  // Initialize date range based on report type
  useEffect(() => {
    const today = new Date();
    let start = new Date();
    let end = new Date();

    switch (reportType) {
      case 'daily':
        start = new Date(today);
        end = new Date(today);
        break;
      case 'weekly':
        start.setDate(today.getDate() - 7);
        break;
      case 'monthly':
        start.setMonth(today.getMonth() - 1);
        break;
      case 'term':
        start.setMonth(today.getMonth() - 3);
        break;
    }

    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  }, [reportType]);

  // Role-based permissions
  const canViewAllAttendance = [
    'SUPER_ADMIN',
    'SCHOOL_ADMIN',
    'SCHOOL_HEAD',
    'DEPARTMENT_HEAD'
  ].includes(user?.role || '');

  const canViewClassAttendance = [
    'SUPER_ADMIN',
    'SCHOOL_ADMIN',
    'DEPARTMENT_HEAD',
    'SENIOR_TEACHER',
    'TEACHER'
  ].includes(user?.role || '');

  // Fetch attendance data
  useEffect(() => {
    if (startDate && endDate && canViewAllAttendance) {
      if (selectedClass) {
        dispatch(fetchAttendanceStats({ 
          classId: selectedClass,
          startDate,
          endDate
        }));
        dispatch(fetchAttendanceByDateRange({
          startDate,
          endDate,
          filters: {
            classId: selectedClass
          }
        }));
      }
      dispatch(fetchAttendanceSummary({ 
        startDate, 
        endDate
      }));
    }
  }, [dispatch, startDate, endDate, selectedClass, canViewAllAttendance]);

  // Refresh data
  const refreshData = () => {
    if (startDate && endDate && canViewAllAttendance) {
      if (selectedClass) {
        dispatch(fetchAttendanceStats({ 
          classId: selectedClass,
          startDate,
          endDate
        }));
        dispatch(fetchAttendanceByDateRange({
          startDate,
          endDate,
          filters: {
            classId: selectedClass
          }
        }));
      }
      dispatch(fetchAttendanceSummary({ 
        startDate, 
        endDate
      }));
    }
  };

  const handleGenerateReport = async () => {
    if (!canViewClassAttendance) return;
    
    setIsGenerating(true);
    try {
      // Implement report generation logic here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      console.log('Generating report with:', { selectedClass, selectedSubject, startDate, endDate, reportType });
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportData = (format: 'pdf' | 'excel' | 'csv') => {
    if (!canViewClassAttendance) return;
    console.log(`Exporting data as ${format}`);
  };

  const handleNotifyParents = () => {
    if (!canViewClassAttendance) return;
    // Implement parent notification logic
    console.log('Notifying parents of absent students');
  };

  const clearFilters = () => {
    setSelectedClass(null);
    setSelectedSubject(null);
    setStartDate('');
    setEndDate('');
  };

  const getAttendanceRateColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600 bg-green-100';
    if (rate >= 85) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const calculateTrends = () => {
    // Mock trend calculation - replace with actual logic
    return {
      weeklyChange: 2.5,
      monthlyChange: -1.2,
      termChange: 3.8
    };
  };

  const trends = calculateTrends();

  if (!canViewAllAttendance) {
    return (
      <div className="p-6">
        <div className="alert alert-warning">
          <AlertTriangle className="w-5 h-5" />
          <span>You don't have permission to view attendance reports.</span>
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
          {canViewClassAttendance && (
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

      {/* Error Display */}
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
        onClassChange={setSelectedClass}
        selectedStatus=""
        onStatusChange={() => {}}
        selectedType=""
        onTypeChange={() => {}}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
        classes={[]}
        subjects={[]}
        selectedSubject={selectedSubject}
        onSubjectChange={setSelectedSubject}
        onClearFilters={clearFilters}
      />

      {/* Quick Actions */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <div className="flex justify-between items-center">
            <h3 className="card-title">Quick Actions</h3>
            <div className="flex gap-2">
              {canViewClassAttendance && (
                <button
                  onClick={handleNotifyParents}
                  className="btn btn-outline btn-sm"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Notify Parents
                </button>
              )}
              <button className="btn btn-outline btn-sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Statistics */}
      {attendanceSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-3xl font-bold text-primary">{attendanceSummary.totalStudents}</p>
                </div>
                <div className="p-3 rounded-full bg-primary/10">
                  <Users className="w-8 h-8 text-primary" />
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Present Today</p>
                  <p className="text-3xl font-bold text-success">{attendanceSummary.presentToday}</p>
                  <p className="text-sm text-gray-500">
                    {((attendanceSummary.presentToday / attendanceSummary.totalStudents) * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="p-3 rounded-full bg-success/10">
                  <CheckSquare className="w-8 h-8 text-success" />
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Absent Today</p>
                  <p className="text-3xl font-bold text-error">{attendanceSummary.absentToday}</p>
                  <p className="text-sm text-gray-500">
                    {((attendanceSummary.absentToday / attendanceSummary.totalStudents) * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="p-3 rounded-full bg-error/10">
                  <X className="w-8 h-8 text-error" />
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Late Arrivals</p>
                  <p className="text-3xl font-bold text-warning">{attendanceSummary.lateToday}</p>
                  <p className="text-sm text-gray-500">
                    {((attendanceSummary.lateToday / attendanceSummary.totalStudents) * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="p-3 rounded-full bg-warning/10">
                  <Clock className="w-8 h-8 text-warning" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Rate Overview */}
      {attendanceSummary && (
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h3 className="card-title mb-4">School Attendance Rate</h3>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-4xl font-bold text-primary">{attendanceSummary.attendanceRate}%</p>
                <p className="text-gray-600">Overall attendance rate</p>
              </div>
              <div className={`badge badge-lg ${getAttendanceRateColor(attendanceSummary.attendanceRate)}`}>
                {attendanceSummary.attendanceRate >= 95 ? 'Excellent' : 
                 attendanceSummary.attendanceRate >= 85 ? 'Good' : 'Needs Improvement'}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-primary h-3 rounded-full transition-all duration-300"
                style={{ width: `${attendanceSummary.attendanceRate}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* View Mode Content */}
      {viewMode === 'overview' && attendanceStats && (
        <AttendanceStats
          stats={attendanceStats}
          title="Class Attendance Statistics"
          showPercentage={true}
        />
      )}

      {viewMode === 'detailed' && (
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h3 className="card-title mb-4">Detailed Attendance Records</h3>
            {status === 'loading' ? (
              <div className="flex justify-center py-8">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : attendanceRecords.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No attendance records found for the selected criteria</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Student</th>
                      <th>Class</th>
                      <th>Status</th>
                      <th>Time</th>
                      <th>Marked By</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceRecords.slice(0, 50).map((record) => (
                      <tr key={record.id}>
                        <td>{new Date(record.attendanceDate).toLocaleDateString()}</td>
                        <td className="font-medium">{record.studentName}</td>
                        <td>{record.className}</td>
                        <td>
                          <span className={`badge ${
                            record.attendanceStatus === 'PRESENT' ? 'badge-success' :
                            record.attendanceStatus.includes('ABSENT') ? 'badge-error' :
                            'badge-warning'
                          }`}>
                            {record.attendanceStatus}
                          </span>
                        </td>
                        <td>{record.arrivalTime || '-'}</td>
                        <td>{record.markedByName}</td>
                        <td>
                          <button className="btn btn-ghost btn-xs">
                            <Eye className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {viewMode === 'trends' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h3 className="card-title">Weekly Trend</h3>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{trends.weeklyChange > 0 ? '+' : ''}{trends.weeklyChange}%</span>
                <TrendingUp className={`w-6 h-6 ${trends.weeklyChange > 0 ? 'text-success' : 'text-error'}`} />
              </div>
              <p className="text-sm text-gray-600">vs last week</p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h3 className="card-title">Monthly Trend</h3>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{trends.monthlyChange > 0 ? '+' : ''}{trends.monthlyChange}%</span>
                <TrendingUp className={`w-6 h-6 ${trends.monthlyChange > 0 ? 'text-success' : 'text-error'}`} />
              </div>
              <p className="text-sm text-gray-600">vs last month</p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h3 className="card-title">Term Trend</h3>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{trends.termChange > 0 ? '+' : ''}{trends.termChange}%</span>
                <TrendingUp className={`w-6 h-6 ${trends.termChange > 0 ? 'text-success' : 'text-error'}`} />
              </div>
              <p className="text-sm text-gray-600">vs last term</p>
            </div>
          </div>
        </div>
      )}

      {/* Report Generation */}
      {canViewClassAttendance && (
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h3 className="card-title mb-4">Generate Custom Report</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">
                  <span className="label-text font-medium">Report Type</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'daily', label: 'Daily', icon: Calendar },
                    { value: 'weekly', label: 'Weekly', icon: BarChart3 },
                    { value: 'monthly', label: 'Monthly', icon: TrendingUp },
                    { value: 'term', label: 'Term', icon: FileText }
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setReportType(value as any)}
                      className={`btn btn-sm ${reportType === value ? 'btn-primary' : 'btn-outline'}`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleGenerateReport}
                  className="btn btn-primary w-full"
                  disabled={isGenerating || !startDate || !endDate}
                >
                  {isGenerating ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Report
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};