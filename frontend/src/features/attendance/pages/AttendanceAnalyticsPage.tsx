import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { 
  fetchSchoolAttendanceDashboard,
  fetchAttendanceStatsByClassAndDate,
  clearAttendanceError
} from '../attendanceSlice';
import { AttendanceFilters } from '../components';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Download, 
  Filter,
  RefreshCw,
  AlertTriangle,
  Users,
  CheckSquare,
  X,
  Clock,
  Eye,
  FileText,
  Mail,
  Settings
} from 'lucide-react';

const AttendanceAnalyticsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Provide default values to prevent undefined errors
  const attendanceState = useSelector((state: RootState) => state.attendance);
  const {
    attendanceDashboard,
    attendanceRecords = [],
    error = null
  } = attendanceState || {};
  
  const status = attendanceState?.status || 'idle';

  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    endDate: new Date().toISOString().split('T')[0] // today
  });
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'trends'>('overview');

  // Role-based permissions
  const userRole = user?.role;
  const canViewAnalytics = [
    'SUPER_ADMIN',
    'SCHOOL_ADMIN',
    'SCHOOL_HEAD',
    'DEPARTMENT_HEAD'
  ].includes(userRole || '');

  const canExportData = [
    'SUPER_ADMIN',
    'SCHOOL_ADMIN',
    'SCHOOL_HEAD'
  ].includes(userRole || '');

  const canNotifyParents = [
    'SUPER_ADMIN',
    'SCHOOL_ADMIN',
    'SCHOOL_HEAD',
    'DEPARTMENT_HEAD',
    'SENIOR_TEACHER',
    'TEACHER'
  ].includes(userRole || '');

  // Mock data for classes - replace with actual data from your store
  const classes = [
    { id: 1, name: 'Grade 1A', students: 25 },
    { id: 2, name: 'Grade 1B', students: 23 },
    { id: 3, name: 'Grade 2A', students: 28 },
    { id: 4, name: 'Grade 3A', students: 26 },
    { id: 5, name: 'Grade 4A', students: 24 },
  ];

  const subjects = [
    { id: 1, name: 'Mathematics' },
    { id: 2, name: 'English' },
    { id: 3, name: 'Science' },
    { id: 4, name: 'History' },
    { id: 5, name: 'Geography' },
  ];

  // Mock dashboard data - replace with actual data from your store
  const mockDashboardData = {
    totalStudents: 126,
    presentToday: 118,
    absentToday: 6,
    lateToday: 2,
    attendanceRate: 93.7,
    weeklyTrend: 2.3,
    monthlyTrend: -0.8,
    classesWithLowAttendance: 1,
    perfectAttendanceStudents: 89
  };

  useEffect(() => {
    if (canViewAnalytics) {
      dispatch(fetchSchoolAttendanceDashboard({ 
        schoolId: user?.schoolId || 1,
        startDate: selectedDateRange.startDate, 
        endDate: selectedDateRange.endDate 
      }));
    }
    return () => {
      dispatch(clearAttendanceError());
    };
  }, [dispatch, canViewAnalytics, user?.schoolId, selectedDateRange.startDate, selectedDateRange.endDate]);

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setSelectedDateRange({ startDate, endDate });
    if (selectedClass) {
      dispatch(fetchAttendanceStatsByClassAndDate({
        classId: selectedClass,
        date: endDate
      }));
    }
  };

  const handleClassChange = (classId: number | null) => {
    setSelectedClass(classId);
    if (classId) {
      dispatch(fetchAttendanceStatsByClassAndDate({
        classId,
        date: selectedDateRange.endDate
      }));
    }
  };

  const handleExportData = (format: 'pdf' | 'excel' | 'csv') => {
    if (!canExportData) return;
    console.log(`Exporting attendance analytics data as ${format}`);
  };

  const handleNotifyParents = () => {
    if (!canNotifyParents) return;
    console.log('Notifying parents of absent students');
  };

  const refreshData = () => {
    if (canViewAnalytics) {
      dispatch(fetchSchoolAttendanceDashboard({ 
        schoolId: user?.schoolId || 1,
        startDate: selectedDateRange.startDate, 
        endDate: selectedDateRange.endDate 
      }));
    }
  };

  const clearFilters = () => {
    setSelectedClass(null);
    setSelectedSubject(null);
    setSelectedDateRange({
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0]
    });
  };

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
            onClick={() => dispatch(clearAttendanceError())}
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
        onStartDateChange={(date) => handleDateRangeChange(date, selectedDateRange.endDate)}
        endDate={selectedDateRange.endDate}
        onEndDateChange={(date) => handleDateRangeChange(selectedDateRange.startDate, date)}
        classes={classes}
        subjects={subjects}
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
              {canNotifyParents && (
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

      {/* Dashboard Content */}
      {viewMode === 'overview' && (
        <div className="space-y-6">
          {/* Dashboard Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Students</p>
                    <p className="text-3xl font-bold text-primary">{mockDashboardData.totalStudents}</p>
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
                    <p className="text-3xl font-bold text-success">{mockDashboardData.presentToday}</p>
                    <p className="text-xs text-gray-500">
                      {((mockDashboardData.presentToday / mockDashboardData.totalStudents) * 100).toFixed(1)}% of total
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
                    <p className="text-3xl font-bold text-error">{mockDashboardData.absentToday}</p>
                    <p className="text-xs text-gray-500">
                      {((mockDashboardData.absentToday / mockDashboardData.totalStudents) * 100).toFixed(1)}% of total
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
                    <p className="text-3xl font-bold text-warning">{mockDashboardData.lateToday}</p>
                    <p className="text-xs text-gray-500">
                      {((mockDashboardData.lateToday / mockDashboardData.totalStudents) * 100).toFixed(1)}% of total
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-warning/10">
                    <Clock className="w-8 h-8 text-warning" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Rate Overview */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="card-title">School Attendance Rate</h3>
                  <p className="text-sm text-gray-600">Overall attendance performance</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">{mockDashboardData.attendanceRate}%</div>
                  <div className="badge badge-success">Excellent</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full">
                <div className="flex justify-between text-sm mb-1">
                  <span>Attendance Rate</span>
                  <span>{mockDashboardData.attendanceRate}%</span>
                </div>
                <progress 
                  className="progress progress-success w-full" 
                  value={mockDashboardData.attendanceRate} 
                  max="100"
                ></progress>
              </div>

              {/* Attendance Rate Breakdown */}
              <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-success">
                    {Math.round((mockDashboardData.presentToday / mockDashboardData.totalStudents) * 100)}%
                  </div>
                  <div className="text-xs text-gray-500">Present</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-error">
                    {Math.round((mockDashboardData.absentToday / mockDashboardData.totalStudents) * 100)}%
                  </div>
                  <div className="text-xs text-gray-500">Absent</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-warning">
                    {Math.round((mockDashboardData.lateToday / mockDashboardData.totalStudents) * 100)}%
                  </div>
                  <div className="text-xs text-gray-500">Late</div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-warning/10">
                      <AlertTriangle className="w-5 h-5 text-warning" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Classes Needing Attention</div>
                      <div className="text-2xl font-bold">{mockDashboardData.classesWithLowAttendance}</div>
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Classes with &lt;85% attendance rate
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-success/10">
                      <TrendingUp className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Perfect Attendance</div>
                      <div className="text-2xl font-bold">{mockDashboardData.perfectAttendanceStudents}</div>
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Students with 100% attendance this term
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'detailed' && (
        <div className="space-y-6">
          {/* Class Performance Summary */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h3 className="card-title mb-4">Class Performance Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classes.map(cls => (
                  <div key={cls.id} className="card bg-base-200 shadow-sm">
                    <div className="card-body p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{cls.name}</h4>
                        <span className="text-sm text-gray-500">{cls.students} students</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Attendance Rate</span>
                          <span className="font-medium text-success">94.2%</span>
                        </div>
                        <progress className="progress progress-success w-full" value="94.2" max="100"></progress>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center">
                            <div className="font-medium text-success">{Math.floor(cls.students * 0.942)}</div>
                            <div className="text-gray-500">Present</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-error">{Math.floor(cls.students * 0.058)}</div>
                            <div className="text-gray-500">Absent</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-warning">1</div>
                            <div className="text-gray-500">Late</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'trends' && (
        <div className="space-y-6">
          {/* Trend Analysis */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h3 className="card-title mb-4">Attendance Trends Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Weekly Trends</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">This Week</span>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-success" />
                        <span className="text-sm font-medium text-success">+2.3%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Last Week</span>
                      <span className="text-sm font-medium">91.4%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">2 Weeks Ago</span>
                      <span className="text-sm font-medium">89.8%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Monthly Trends</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">This Month</span>
                      <span className="text-sm font-medium">93.7%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Last Month</span>
                      <span className="text-sm font-medium">94.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">2 Months Ago</span>
                      <span className="text-sm font-medium">92.1%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Patterns */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h3 className="card-title mb-4">Attendance Patterns</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium mb-3">By Day of Week</h4>
                  <div className="space-y-2">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, index) => {
                      const rate = [95.2, 94.8, 93.1, 94.5, 92.8][index];
                      return (
                        <div key={day} className="flex justify-between items-center">
                          <span className="text-sm">{day}</span>
                          <div className="flex items-center gap-2">
                            <progress className="progress progress-primary w-16" value={rate} max="100"></progress>
                            <span className="text-sm font-medium w-12">{rate}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Peak Absence Times</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Fridays</span>
                      <span className="text-error font-medium">7.2% absent</span>
                    </div>
                    <div className="flex justify-between">
                      <span>After Holidays</span>
                      <span className="text-error font-medium">12.1% absent</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Exam Periods</span>
                      <span className="text-success font-medium">2.3% absent</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Late Arrivals</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Average Daily</span>
                      <span className="text-warning font-medium">2.1%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monday Peak</span>
                      <span className="text-warning font-medium">3.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Improvement</span>
                      <span className="text-success font-medium">-0.5%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceAnalyticsPage; 