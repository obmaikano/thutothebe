import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  Filter, 
  Eye, 
  Download,
  AlertTriangle,
  CheckSquare,
  X,
  Clock,
  Settings,
  RefreshCw,
  BarChart3,
  TrendingUp,
  Mail
} from 'lucide-react';
import { RootState, AppDispatch } from '../../../store';
import { 
  fetchAttendanceByDateRange,
  fetchAttendanceSummary,
  clearError
} from '../attendanceSlice';
import { AttendanceStats, AttendanceFilters } from '../components';

export const AttendanceCalendarPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Provide default values to prevent undefined errors
  const attendanceState = useSelector((state: RootState) => state.attendance);
  const {
    attendanceRecords = [],
    attendanceStats = null,
    attendanceSummary = null,
    status = 'idle',
    error = null
  } = attendanceState || {};
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [showFilters, setShowFilters] = useState(false);

  // Role-based permissions following the implementation prompt pattern
  const userRole = user?.role;
  const canViewAllAttendance = [
    'SUPER_ADMIN',
    'SCHOOL_ADMIN',
    'SCHOOL_HEAD',
    'DEPARTMENT_HEAD'
  ].includes(userRole || '');

  const canViewClassAttendance = [
    'SUPER_ADMIN',
    'SCHOOL_ADMIN',
    'DEPARTMENT_HEAD',
    'SENIOR_TEACHER',
    'TEACHER'
  ].includes(userRole || '');

  const canExportData = [
    'SUPER_ADMIN',
    'SCHOOL_ADMIN',
    'SCHOOL_HEAD',
    'DEPARTMENT_HEAD',
    'SENIOR_TEACHER'
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
    { id: 1, name: 'Grade 1A' },
    { id: 2, name: 'Grade 1B' },
    { id: 3, name: 'Grade 2A' },
    { id: 4, name: 'Grade 3A' },
    { id: 5, name: 'Grade 4A' },
  ];

  useEffect(() => {
    if (canViewAllAttendance) {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      if (selectedClass) {
        dispatch(fetchAttendanceByDateRange({
          startDate: startOfMonth.toISOString().split('T')[0],
          endDate: endOfMonth.toISOString().split('T')[0],
          filters: {
            classId: selectedClass
          }
        }));
      }
      
      dispatch(fetchAttendanceSummary({
        startDate: startOfMonth.toISOString().split('T')[0],
        endDate: endOfMonth.toISOString().split('T')[0]
      }));
    }
  }, [dispatch, currentDate, selectedClass, canViewAllAttendance]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getAttendanceForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return attendanceRecords.filter(record => 
      record.attendanceDate === dateString
    );
  };

  const getAttendanceStats = (date: Date) => {
    const records = getAttendanceForDate(date);
    if (records.length === 0) return null;

    const stats = {
      total: records.length,
      present: records.filter(r => r.attendanceStatus === 'PRESENT').length,
      absent: records.filter(r => r.attendanceStatus.includes('ABSENT')).length,
      late: records.filter(r => r.attendanceStatus === 'LATE').length,
    };

    return {
      ...stats,
      rate: Math.round((stats.present / stats.total) * 100)
    };
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const handleExportCalendar = () => {
    if (!canExportData) return;
    console.log('Exporting calendar data');
  };

  const handleNotifyParents = () => {
    if (!canNotifyParents) return;
    console.log('Notifying parents of absent students');
  };

  const refreshData = () => {
    if (canViewAllAttendance) {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      if (selectedClass) {
        dispatch(fetchAttendanceByDateRange({
          startDate: startOfMonth.toISOString().split('T')[0],
          endDate: endOfMonth.toISOString().split('T')[0],
          filters: {
            classId: selectedClass
          }
        }));
      }
      
      dispatch(fetchAttendanceSummary({
        startDate: startOfMonth.toISOString().split('T')[0],
        endDate: endOfMonth.toISOString().split('T')[0]
      }));
    }
  };

  const clearFilters = () => {
    setSelectedClass(null);
    setSelectedDate(null);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days = getDaysInMonth(currentDate);

  if (!canViewAllAttendance && !canViewClassAttendance) {
    return (
      <div className="p-6">
        <div className="alert alert-warning">
          <AlertTriangle className="w-5 h-5" />
          <span>You don't have permission to view attendance calendar.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance Calendar</h1>
          <p className="text-gray-600 mt-1">Visual attendance tracking and calendar overview</p>
        </div>
        <div className="flex gap-2">
          <div className="btn-group">
            <button
              onClick={() => setViewMode('month')}
              className={`btn btn-sm ${viewMode === 'month' ? 'btn-active' : ''}`}
            >
              <Calendar className="w-4 h-4 mr-1" />
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`btn btn-sm ${viewMode === 'week' ? 'btn-active' : ''}`}
            >
              <BarChart3 className="w-4 h-4 mr-1" />
              Week
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
            <button 
              onClick={handleExportCalendar}
              className="btn btn-primary btn-sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Calendar
            </button>
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

      {/* Quick Actions */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <div className="flex justify-between items-center">
            <h3 className="card-title">Calendar Controls</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`btn btn-outline btn-sm ${showFilters ? 'btn-active' : ''}`}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>
              {canNotifyParents && (
                <button
                  onClick={handleNotifyParents}
                  className="btn btn-outline btn-sm"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Notify Parents
                </button>
              )}
              <button
                onClick={() => setCurrentDate(new Date())}
                className="btn btn-outline btn-sm"
              >
                Today
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Calendar Filters</h3>
              {(selectedClass || selectedDate) && (
                <button
                  onClick={clearFilters}
                  className="btn btn-ghost btn-sm text-red-600"
                >
                  Clear Filters
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Class</span>
                </label>
                <select
                  className="select select-bordered"
                  value={selectedClass || ''}
                  onChange={(e) => setSelectedClass(e.target.value ? Number(e.target.value) : null)}
                >
                  <option value="">All Classes</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Selected Date</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered"
                  value={selectedDate || ''}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Quick Navigation</span>
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentDate(new Date())}
                    className="btn btn-outline btn-sm flex-1"
                  >
                    Today
                  </button>
                  <button className="btn btn-outline btn-sm flex-1">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Monthly Statistics */}
      {attendanceSummary && canViewAllAttendance && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-primary">{attendanceSummary.totalStudents}</p>
                </div>
                <div className="p-3 rounded-full bg-primary/10">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg. Present</p>
                  <p className="text-2xl font-bold text-success">{attendanceSummary.presentToday}</p>
                </div>
                <div className="p-3 rounded-full bg-success/10">
                  <CheckSquare className="w-6 h-6 text-success" />
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg. Absent</p>
                  <p className="text-2xl font-bold text-error">{attendanceSummary.absentToday}</p>
                </div>
                <div className="p-3 rounded-full bg-error/10">
                  <X className="w-6 h-6 text-error" />
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Attendance Rate</p>
                  <p className="text-2xl font-bold text-info">{attendanceSummary.attendanceRate}%</p>
                </div>
                <div className="p-3 rounded-full bg-info/10">
                  <TrendingUp className="w-6 h-6 text-info" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Navigation */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigateMonth('prev')}
              className="btn btn-ghost"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={() => navigateMonth('next')}
              className="btn btn-ghost"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Calendar Legend */}
          <div className="flex justify-center mb-4">
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                <span>95%+ Attendance</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div>
                <span>75-94% Attendance</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
                <span>&lt;75% Attendance</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
                <span>Selected</span>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day headers */}
            {dayNames.map(day => (
              <div key={day} className="p-2 text-center font-semibold text-gray-600 bg-gray-50">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {days.map((day, index) => {
              if (!day) {
                return <div key={index} className="p-2 h-24 bg-gray-50"></div>;
              }

              const dayStats = getAttendanceStats(day);
              const isSelected = selectedDate === day.toISOString().split('T')[0];
              const isToday = day.toDateString() === new Date().toDateString();

              let bgColor = 'bg-white';
              let borderColor = 'border-gray-200';

              if (isSelected) {
                bgColor = 'bg-blue-100';
                borderColor = 'border-blue-300';
              } else if (isToday) {
                bgColor = 'bg-yellow-50';
                borderColor = 'border-yellow-300';
              } else if (dayStats) {
                if (dayStats.rate >= 95) {
                  bgColor = 'bg-green-50';
                  borderColor = 'border-green-200';
                } else if (dayStats.rate >= 75) {
                  bgColor = 'bg-yellow-50';
                  borderColor = 'border-yellow-200';
                } else {
                  bgColor = 'bg-red-50';
                  borderColor = 'border-red-200';
                }
              }

              return (
                <div
                  key={index}
                  onClick={() => handleDateClick(day)}
                  className={`p-2 h-24 border cursor-pointer hover:bg-gray-50 transition-colors ${bgColor} ${borderColor}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-sm font-medium ${
                      isToday ? 'text-yellow-700' : 'text-gray-900'
                    }`}>
                      {day.getDate()}
                    </span>
                    {dayStats && (
                      <span className={`text-xs px-1 rounded ${
                        dayStats.rate >= 95 ? 'bg-green-100 text-green-700' :
                        dayStats.rate >= 75 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {dayStats.rate}%
                      </span>
                    )}
                  </div>
                  
                  {dayStats && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-green-600">P: {dayStats.present}</span>
                        <span className="text-red-600">A: {dayStats.absent}</span>
                      </div>
                      {dayStats.late > 0 && (
                        <div className="text-xs text-orange-600">L: {dayStats.late}</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h3 className="card-title">
                Attendance Details - {new Date(selectedDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h3>
              <button
                onClick={() => setSelectedDate(null)}
                className="btn btn-ghost btn-sm"
              >
                <X className="w-4 h-4" />
                Close
              </button>
            </div>
            
            {(() => {
              const selectedDateObj = new Date(selectedDate);
              const dayRecords = getAttendanceForDate(selectedDateObj);
              
              if (dayRecords.length === 0) {
                return (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No attendance records for this date</p>
                    {selectedClass && (
                      <p className="text-sm mt-2">Try selecting a different class or date</p>
                    )}
                  </div>
                );
              }

              const dayStats = getAttendanceStats(selectedDateObj);
              
              return (
                <div className="space-y-4">
                  {/* Day Statistics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="stat bg-base-200 rounded-lg">
                      <div className="stat-title">Total Students</div>
                      <div className="stat-value text-primary">{dayStats?.total}</div>
                    </div>
                    <div className="stat bg-base-200 rounded-lg">
                      <div className="stat-title">Present</div>
                      <div className="stat-value text-success">{dayStats?.present}</div>
                    </div>
                    <div className="stat bg-base-200 rounded-lg">
                      <div className="stat-title">Absent</div>
                      <div className="stat-value text-error">{dayStats?.absent}</div>
                    </div>
                    <div className="stat bg-base-200 rounded-lg">
                      <div className="stat-title">Attendance Rate</div>
                      <div className="stat-value text-info">{dayStats?.rate}%</div>
                    </div>
                  </div>

                  {/* Records Table */}
                  <div className="overflow-x-auto">
                    <table className="table table-zebra">
                      <thead>
                        <tr>
                          <th>Student</th>
                          <th>Class</th>
                          <th>Status</th>
                          <th>Arrival Time</th>
                          <th>Departure Time</th>
                          <th>Marked By</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dayRecords.map(record => (
                          <tr key={record.id}>
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
                            <td>{record.departureTime || '-'}</td>
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
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Loading State */}
      {status === 'loading' && (
        <div className="flex justify-center items-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}
    </div>
  );
}; 