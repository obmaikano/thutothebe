import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { 
  fetchSchedules, 
  fetchSchedulesByClass,
  fetchSchedulesByTeacher,
  clearSchedulesError 
} from '../../school_admin/schedulesSlice';
import { Schedule } from '../../../api/services/scheduleApi';
import { formatTime } from '../../../utils/dateUtils';
import { hasPermission, UserRole } from '../../../utils/permissionUtils';

interface TimetableSlot {
  time: string;
  schedules: { [key: string]: Schedule | null };
}

const TimetableViewPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { 
    schedules, 
    status, 
    error 
  } = useAppSelector(state => state.schedules);
  const { user } = useAppSelector(state => state.auth);

  const [viewType, setViewType] = useState<'all' | 'class' | 'teacher'>('all');
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [selectedWeek, setSelectedWeek] = useState<string>('current');

  const loading = status === 'loading';

  const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Generate time slots from 7:00 AM to 6:00 PM
  const generateTimeSlots = (): string[] => {
    const slots: string[] = [];
    for (let hour = 7; hour <= 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 18) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  useEffect(() => {
    if (viewType === 'all') {
      dispatch(fetchSchedules());
    } else if (viewType === 'class' && selectedClassId) {
      dispatch(fetchSchedulesByClass({
        classId: parseInt(selectedClassId),
        userRole: user?.role || '',
        userId: user?.id || 0,
        userRegionId: user?.regionId,
        userSchoolId: user?.schoolId
      }));
    } else if (viewType === 'teacher' && selectedTeacherId) {
      dispatch(fetchSchedulesByTeacher({
        teacherId: parseInt(selectedTeacherId),
        userRole: user?.role || '',
        userId: user?.id || 0,
        userRegionId: user?.regionId,
        userSchoolId: user?.schoolId
      }));
    }

    return () => {
      dispatch(clearSchedulesError());
    };
  }, [dispatch, viewType, selectedClassId, selectedTeacherId, user]);

  const buildTimetableData = (): TimetableSlot[] => {
    const timetableData: TimetableSlot[] = timeSlots.map(time => ({
      time,
      schedules: daysOfWeek.reduce((acc, day) => {
        acc[day] = null;
        return acc;
      }, {} as { [key: string]: Schedule | null })
    }));

    schedules.forEach(schedule => {
      const startTime = schedule.startTime.substring(0, 5); // Get HH:mm format
      const slotIndex = timeSlots.findIndex(slot => slot === startTime);
      
      if (slotIndex !== -1) {
        timetableData[slotIndex].schedules[schedule.dayOfWeek] = schedule;
      }
    });

    return timetableData;
  };

  const timetableData = buildTimetableData();

  const getScheduleColor = (schedule: Schedule): string => {
    if (schedule.color) return schedule.color;
    
    // Default colors based on schedule type
    const typeColors: { [key: string]: string } = {
      'CLASS': 'bg-blue-100 border-blue-300 text-blue-800',
      'LECTURE': 'bg-green-100 border-green-300 text-green-800',
      'TUTORIAL': 'bg-yellow-100 border-yellow-300 text-yellow-800',
      'PRACTICAL': 'bg-purple-100 border-purple-300 text-purple-800',
      'EXAM': 'bg-red-100 border-red-300 text-red-800',
      'ASSESSMENT': 'bg-orange-100 border-orange-300 text-orange-800',
      'MEETING': 'bg-gray-100 border-gray-300 text-gray-800',
      'ASSEMBLY': 'bg-indigo-100 border-indigo-300 text-indigo-800',
      'BREAK': 'bg-green-50 border-green-200 text-green-600',
      'LUNCH': 'bg-yellow-50 border-yellow-200 text-yellow-600',
      'SPORT': 'bg-blue-50 border-blue-200 text-blue-600',
      'EXTRACURRICULAR': 'bg-purple-50 border-purple-200 text-purple-600'
    };
    
    return typeColors[schedule.type] || 'bg-gray-100 border-gray-300 text-gray-800';
  };

  const canViewTimetables = hasPermission(user?.role, [
    UserRole.SUPER_ADMIN,
    UserRole.MINISTRY_EXECUTIVE,
    UserRole.MINISTRY_STAFF,
    UserRole.DIRECTOR,
    UserRole.REGIONAL_ADMIN,
    UserRole.REGIONAL_MANAGER,
    UserRole.REGIONAL_OFFICER,
    UserRole.SCHOOL_ADMIN,
    UserRole.SCHOOL_HEAD,
    UserRole.DEPUTY_HEAD,
    UserRole.DEPARTMENT_HEAD,
    UserRole.HEAD_TEACHER,
    UserRole.SENIOR_TEACHER,
    UserRole.TEACHER,
    UserRole.STUDENT,
    UserRole.PARENT
  ]);

  if (!canViewTimetables) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="text-gray-600 mt-2">You don't have permission to view timetables.</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Timetable View</h1>
          <p className="text-gray-600 mt-2">Visual representation of schedules and timetables</p>
        </div>
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

      {/* View Controls */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">View Type</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={viewType}
              onChange={(e) => setViewType(e.target.value as 'all' | 'class' | 'teacher')}
            >
              <option value="all">All Schedules</option>
              <option value="class">By Class</option>
              <option value="teacher">By Teacher</option>
            </select>
          </div>

          {viewType === 'class' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class ID</label>
              <input
                type="text"
                placeholder="Enter class ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
              />
            </div>
          )}

          {viewType === 'teacher' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teacher ID</label>
              <input
                type="text"
                placeholder="Enter teacher ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Week</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
            >
              <option value="current">Current Week</option>
              <option value="next">Next Week</option>
              <option value="previous">Previous Week</option>
            </select>
          </div>
        </div>
      </div>

      {/* Timetable Grid */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                  Time
                </th>
                {dayLabels.map((day, index) => (
                  <th
                    key={day}
                    className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {timetableData.map((slot, slotIndex) => (
                <tr key={slot.time} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                    {formatTime(slot.time)}
                  </td>
                  {daysOfWeek.map((day) => {
                    const schedule = slot.schedules[day];
                    return (
                      <td key={day} className="px-2 py-3 text-center relative h-16">
                        {schedule ? (
                          <div
                            className={`
                              ${getScheduleColor(schedule)}
                              rounded-lg p-2 border-l-4 cursor-pointer
                              hover:shadow-md transition-shadow duration-200
                              text-xs
                            `}
                            title={`${schedule.title} - ${schedule.description || ''}`}
                          >
                            <div className="font-semibold truncate">{schedule.title}</div>
                            <div className="text-xs opacity-75 truncate">
                              {schedule.teacherName || schedule.className}
                            </div>
                            <div className="text-xs opacity-60">
                              {schedule.location}
                            </div>
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center text-gray-300">
                            <span className="text-xs">—</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Schedule Types</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { type: 'CLASS', label: 'Class' },
            { type: 'LECTURE', label: 'Lecture' },
            { type: 'TUTORIAL', label: 'Tutorial' },
            { type: 'PRACTICAL', label: 'Practical' },
            { type: 'EXAM', label: 'Exam' },
            { type: 'ASSESSMENT', label: 'Assessment' },
            { type: 'MEETING', label: 'Meeting' },
            { type: 'ASSEMBLY', label: 'Assembly' },
            { type: 'BREAK', label: 'Break' },
            { type: 'LUNCH', label: 'Lunch' },
            { type: 'SPORT', label: 'Sport' },
            { type: 'EXTRACURRICULAR', label: 'Extra' }
          ].map(({ type, label }) => {
            const colorClass = getScheduleColor({ type } as Schedule);
            return (
              <div key={type} className="flex items-center space-x-2">
                <div className={`w-4 h-4 rounded border-l-4 ${colorClass}`}></div>
                <span className="text-sm text-gray-700">{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Statistics */}
      {schedules.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{schedules.length}</div>
                <div className="text-sm text-gray-500">Total Schedules</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {schedules.filter(s => s.status === 'ACTIVE').length}
                </div>
                <div className="text-sm text-gray-500">Active Schedules</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {schedules.filter(s => s.status === 'PENDING').length}
                </div>
                <div className="text-sm text-gray-500">Pending Schedules</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {new Set(schedules.map(s => s.classId)).size}
                </div>
                <div className="text-sm text-gray-500">Classes Involved</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimetableViewPage; 