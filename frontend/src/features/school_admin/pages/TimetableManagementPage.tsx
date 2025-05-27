import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  fetchSchedulesBySchool, 
  createSchedule, 
  updateSchedule, 
  deleteSchedule,
  checkTimeConflicts,
  clearSchedulesError,
  clearConflicts
} from '../schedulesSlice';
import { fetchClasses } from '../../classes/classesSlice';
import { fetchTeachers } from '../../teachers/teachersSlice';
import { fetchSubjects } from '../../subjects/subjectsSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { Schedule } from '../../../api/services/scheduleApi';
import { 
  Calendar, Clock, Plus, Search, Filter, Edit, Trash2, 
  AlertTriangle, Users, BookOpen, MapPin, Eye, Download,
  ChevronLeft, ChevronRight, Grid, List
} from 'lucide-react';

// Card component
const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 ${className}`}>
    {children}
  </div>
);

// Time slot component
const TimeSlot: React.FC<{
  time: string;
  schedule?: Schedule;
  onScheduleClick?: (schedule: Schedule) => void;
  onAddSchedule?: (time: string, day: string) => void;
  day: string;
}> = ({ time, schedule, onScheduleClick, onAddSchedule, day }) => (
  <div className="border border-gray-200 p-2 min-h-[80px] relative group">
    {schedule ? (
      <div 
        className={`p-2 rounded text-xs cursor-pointer hover:opacity-80 ${
          schedule.type === 'LECTURE' ? 'bg-blue-100 text-blue-800' :
          schedule.type === 'LAB' ? 'bg-green-100 text-green-800' :
          schedule.type === 'EXAM' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}
        onClick={() => onScheduleClick?.(schedule)}
      >
        <div className="font-medium truncate">{schedule.title}</div>
        <div className="text-xs opacity-75">{schedule.location}</div>
        <div className="text-xs opacity-75">Teacher</div>
      </div>
    ) : (
      <button
        className="w-full h-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-opacity"
        onClick={() => onAddSchedule?.(time, day)}
      >
        <Plus size={16} />
      </button>
    )}
  </div>
);

// Weekly timetable view component
const WeeklyTimetableView: React.FC<{
  schedules: Schedule[];
  onScheduleClick: (schedule: Schedule) => void;
  onAddSchedule: (time: string, day: string) => void;
}> = ({ schedules, onScheduleClick, onAddSchedule }) => {
  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const getScheduleForSlot = (day: string, time: string) => {
    return schedules.find(s => 
      s.dayOfWeek === day && 
      s.startTime <= time && 
      s.endTime > time
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border border-gray-300 p-3 bg-gray-50 w-20">Time</th>
            {days.map(day => (
              <th key={day} className="border border-gray-300 p-3 bg-gray-50 min-w-[150px]">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map(time => (
            <tr key={time}>
              <td className="border border-gray-300 p-2 bg-gray-50 font-medium text-sm">
                {time}
              </td>
              {days.map(day => (
                <td key={`${day}-${time}`} className="border border-gray-300 p-0">
                  <TimeSlot
                    time={time}
                    day={day}
                    schedule={getScheduleForSlot(day, time)}
                    onScheduleClick={onScheduleClick}
                    onAddSchedule={onAddSchedule}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const TimetableManagementPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { schedules, status, error, conflicts } = useAppSelector(state => state.schedules);
  const { classes } = useAppSelector(state => state.classes);
  const { teachers } = useAppSelector(state => state.teachers);
  const { subjects } = useAppSelector(state => state.subjects);
  
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          dispatch(fetchClasses()),
          dispatch(fetchTeachers()),
          dispatch(fetchSubjects())
        ]);
        
        if (user?.schoolId) {
          dispatch(fetchSchedulesBySchool(user.schoolId));
        }
      } catch (error) {
        console.error('Failed to load timetable data:', error);
      }
    };

    loadData();
    return () => {
      dispatch(clearSchedulesError());
    };
  }, [dispatch, user?.schoolId]);

  const handleCreateSchedule = (time?: string, day?: string) => {
    dispatch(openModal({
      title: 'Create Schedule Entry',
      bodyType: MODAL_BODY_TYPES.SCHEDULE_ADD_NEW,
      extraObject: { 
        time, 
        day, 
        classId: selectedClass,
        classes,
        teachers,
        subjects
      }
    }));
  };

  const handleEditSchedule = (schedule: Schedule) => {
    dispatch(openModal({
      title: 'Edit Schedule Entry',
      bodyType: MODAL_BODY_TYPES.SCHEDULE_EDIT,
      extraObject: { 
        schedule,
        classes,
        teachers,
        subjects
      }
    }));
  };

  const handleDeleteSchedule = (schedule: Schedule) => {
    dispatch(openModal({
      title: 'Delete Schedule Entry',
      bodyType: MODAL_BODY_TYPES.SCHEDULE_DELETE_CONFIRMATION,
      extraObject: schedule
    }));
  };

  const handleViewScheduleDetails = (schedule: Schedule) => {
    dispatch(openModal({
      title: 'Schedule Details',
      bodyType: MODAL_BODY_TYPES.SCHEDULE_VIEW,
      extraObject: { 
        schedule,
        classes,
        teachers,
        subjects
      }
    }));
  };

  const handleExportTimetable = () => {
    console.log('Exporting timetable...');
  };

  const handleCheckConflicts = () => {
    // Implementation for conflict checking
    console.log('Checking for conflicts...');
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedWeek);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setSelectedWeek(newDate);
  };

  const filteredSchedules = schedules.filter((schedule: Schedule) => {
    const matchesSearch = 
      schedule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (schedule.description && schedule.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = filterType === '' || schedule.type === filterType;
    const matchesClass = selectedClass === null || schedule.classId === selectedClass;

    return matchesSearch && matchesType && matchesClass;
  });

  const getWeekDateRange = () => {
    const start = new Date(selectedWeek);
    start.setDate(start.getDate() - start.getDay() + 1); // Monday
    const end = new Date(start);
    end.setDate(end.getDate() + 4); // Friday
    
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Timetable Management</h1>
          <p className="text-gray-600 mt-2">Create and manage class schedules and timetables</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleCheckConflicts}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <AlertTriangle size={16} />
            Check Conflicts
          </button>
          <button 
            onClick={handleExportTimetable}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download size={16} />
            Export
          </button>
          <button 
            onClick={() => handleCreateSchedule()} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={16} />
            Add Schedule
          </button>
        </div>
      </div>

      {/* Error Alert */}
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

      {/* Conflicts Alert */}
      {conflicts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span>Found {conflicts.length} scheduling conflicts. Please review.</span>
            <button
              onClick={() => dispatch(clearConflicts())}
              className="text-yellow-500 hover:text-yellow-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Controls */}
      <Card>
        <div className="flex flex-wrap items-center gap-4">
          {/* Class Filter */}
          <div className="flex items-center gap-2">
            <Users size={16} className="text-gray-500" />
            <select
              value={selectedClass || ''}
              onChange={(e) => setSelectedClass(e.target.value ? Number(e.target.value) : null)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Classes</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          {/* Week Navigation */}
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-500" />
            <button
              onClick={() => navigateWeek('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium">
              {getWeekDateRange()}
            </span>
            <button
              onClick={() => navigateWeek('next')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search schedules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="LECTURE">Lecture</option>
              <option value="LAB">Lab</option>
              <option value="EXAM">Exam</option>
              <option value="MEETING">Meeting</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </Card>

      {/* Timetable View */}
      {viewMode === 'grid' ? (
        <Card>
          <WeeklyTimetableView
            schedules={filteredSchedules}
            onScheduleClick={handleViewScheduleDetails}
            onAddSchedule={handleCreateSchedule}
          />
        </Card>
      ) : (
        <Card>
          <div className="space-y-4">
            {filteredSchedules.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                <p>No schedules found for the selected criteria.</p>
              </div>
            ) : (
              filteredSchedules.map((schedule: Schedule) => (
                <div key={schedule.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900">{schedule.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          schedule.type === 'LECTURE' ? 'bg-blue-100 text-blue-800' :
                          schedule.type === 'LAB' ? 'bg-green-100 text-green-800' :
                          schedule.type === 'EXAM' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {schedule.type}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock size={14} />
                          {schedule.dayOfWeek} {schedule.startTime} - {schedule.endTime}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={14} />
                          {schedule.location || 'No location'}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users size={14} />
                          {classes.find(c => c.id === schedule.classId)?.name || 'No class'}
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen size={14} />
                          {teachers.find(t => t.id === schedule.teacherId)?.firstName || 'No teacher'}
                        </div>
                      </div>
                      {schedule.description && (
                        <p className="text-sm text-gray-600 mt-2">{schedule.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleViewScheduleDetails(schedule)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEditSchedule(schedule)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteSchedule(schedule)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Schedules</p>
              <p className="text-2xl font-semibold text-gray-900">{schedules.length}</p>
            </div>
            <Calendar className="text-blue-600" size={24} />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Classes</p>
              <p className="text-2xl font-semibold text-gray-900">{classes.filter(c => c.active).length}</p>
            </div>
            <Users className="text-green-600" size={24} />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available Teachers</p>
              <p className="text-2xl font-semibold text-gray-900">{teachers.filter(t => t.active).length}</p>
            </div>
            <BookOpen className="text-purple-600" size={24} />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conflicts</p>
              <p className="text-2xl font-semibold text-gray-900">{conflicts.length}</p>
            </div>
            <AlertTriangle className="text-red-600" size={24} />
          </div>
        </Card>
      </div>
    </div>
  );
}; 