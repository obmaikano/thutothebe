import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { 
  fetchSchedules, 
  deleteSchedule, 
  setScheduleFilter,
  clearSchedulesError 
} from '../../school_admin/schedulesSlice';
import { openModal } from '../../common/modalSlice';
import { 
  MODAL_BODY_TYPES
} from '../../../utils/modalConstants';
import { Schedule } from '../../../api/services/scheduleApi';
import { formatTime } from '../../../utils/dateUtils';
import { hasPermission, UserRole } from '../../../utils/permissionUtils';

const ScheduleListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { 
    schedules, 
    status, 
    error, 
    filter
  } = useAppSelector(state => state.schedules);
  const { user } = useAppSelector(state => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedClass, setSelectedClass] = useState('');

  const loading = status === 'loading';

  useEffect(() => {
    dispatch(fetchSchedules());
    return () => {
      dispatch(clearSchedulesError());
    };
  }, [dispatch]);

  const handleSearch = () => {
    const newFilters = {
      type: searchTerm || '',
      dayOfWeek: selectedDayOfWeek || '',
      classId: selectedClass ? parseInt(selectedClass) : null,
      teacherId: null,
      status: ''
    };
    
    dispatch(setScheduleFilter(newFilters));
    dispatch(fetchSchedules());
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedDayOfWeek('');
    setSelectedSubject('');
    setSelectedClass('');
    dispatch(setScheduleFilter({
      type: '',
      status: '',
      dayOfWeek: '',
      classId: null,
      teacherId: null
    }));
    dispatch(fetchSchedules());
  };

  const handleCreateSchedule = () => {
    dispatch(openModal({
      title: 'Create New Schedule',
      bodyType: MODAL_BODY_TYPES.SCHEDULE_ADD_NEW,
      size: 'lg'
    }));
  };

  const handleEditSchedule = (schedule: Schedule) => {
    dispatch(openModal({
      title: 'Edit Schedule',
      bodyType: MODAL_BODY_TYPES.SCHEDULE_EDIT,
      extraObject: schedule
    }));
  };

  const handleViewSchedule = (schedule: Schedule) => {
    dispatch(openModal({
      title: 'Schedule Details',
      bodyType: MODAL_BODY_TYPES.SCHEDULE_VIEW,
      extraObject: schedule
    }));
  };

  const handleDeleteSchedule = (schedule: Schedule) => {
    dispatch(openModal({
      title: 'Delete Schedule',
      bodyType: MODAL_BODY_TYPES.SCHEDULE_DELETE_CONFIRMATION,
      extraObject: schedule
    }));
  };

  const canCreateSchedule = hasPermission(user?.role, [
    UserRole.SUPER_ADMIN,
    UserRole.MINISTRY_EXECUTIVE,
    UserRole.REGIONAL_MANAGER,
    UserRole.SCHOOL_ADMIN,
    UserRole.DEPUTY_HEAD,
    UserRole.HEAD_TEACHER
  ]);

  const canEditSchedule = hasPermission(user?.role, [
    UserRole.SUPER_ADMIN,
    UserRole.MINISTRY_EXECUTIVE,
    UserRole.REGIONAL_MANAGER,
    UserRole.SCHOOL_ADMIN,
    UserRole.DEPUTY_HEAD,
    UserRole.HEAD_TEACHER
  ]);

  const canDeleteSchedule = hasPermission(user?.role, [
    UserRole.SUPER_ADMIN,
    UserRole.MINISTRY_EXECUTIVE,
    UserRole.REGIONAL_MANAGER,
    UserRole.SCHOOL_ADMIN,
    UserRole.DEPUTY_HEAD
  ]);

  const getDayOfWeekDisplay = (dayOfWeek: string) => {
    const days = {
      'MONDAY': 'Monday',
      'TUESDAY': 'Tuesday', 
      'WEDNESDAY': 'Wednesday',
      'THURSDAY': 'Thursday',
      'FRIDAY': 'Friday',
      'SATURDAY': 'Saturday',
      'SUNDAY': 'Sunday'
    };
    return days[dayOfWeek as keyof typeof days] || dayOfWeek;
  };

  if (loading && schedules.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Schedule Management</h1>
          <p className="text-gray-600 mt-2">Manage class schedules and timetables</p>
        </div>
        {canCreateSchedule && (
          <button
            onClick={handleCreateSchedule}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Schedule
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => dispatch(clearSchedulesError())}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search by title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Day of Week</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedDayOfWeek}
              onChange={(e) => setSelectedDayOfWeek(e.target.value)}
            >
              <option value="">All Days</option>
              <option value="MONDAY">Monday</option>
              <option value="TUESDAY">Tuesday</option>
              <option value="WEDNESDAY">Wednesday</option>
              <option value="THURSDAY">Thursday</option>
              <option value="FRIDAY">Friday</option>
              <option value="SATURDAY">Saturday</option>
              <option value="SUNDAY">Sunday</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              placeholder="Subject ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
            <input
              type="text"
              placeholder="Class ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <button 
            onClick={handleSearch} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Search
          </button>
          <button 
            onClick={handleClearFilters} 
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Schedules Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {schedules.map((schedule) => (
                <tr key={schedule.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{schedule.title}</div>
                    {schedule.description && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {schedule.description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getDayOfWeekDisplay(schedule.dayOfWeek)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {schedule.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {schedule.className || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {schedule.teacherName || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {schedule.location || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      schedule.status === 'ACTIVE' 
                        ? 'bg-green-100 text-green-800' 
                        : schedule.status === 'INACTIVE'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {schedule.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewSchedule(schedule)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      
                      {canEditSchedule && (
                        <button
                          onClick={() => handleEditSchedule(schedule)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit Schedule"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      )}
                      
                      {canDeleteSchedule && (
                        <button
                          onClick={() => handleDeleteSchedule(schedule)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Schedule"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {schedules.length === 0 && !loading && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No schedules found</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new schedule.</p>
              {canCreateSchedule && (
                <div className="mt-6">
                  <button
                    onClick={handleCreateSchedule}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Schedule
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleListPage; 