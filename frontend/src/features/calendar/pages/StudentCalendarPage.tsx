import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchCalendarEvents, clearCalendarError } from '../calendarEventsSlice';
import { CalendarEvent } from '../../../api/services/calendarEventApi';
import { Calendar, Search, Clock, MapPin, Users, Eye, Filter, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const StudentCalendarPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { events, status, error } = useAppSelector(state => state.calendarEvents);
  const { user } = useAppSelector(state => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    dispatch(fetchCalendarEvents());
    return () => {
      dispatch(clearCalendarError());
    };
  }, [dispatch]);

  // Filter events to show only those accessible to the student
  const filteredEvents = events.filter((event: CalendarEvent) => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = 
      typeFilter === '' || event.eventType === typeFilter;

    const matchesStatus = 
      statusFilter === '' || event.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Sort events by start date
  const sortedEvents = [...filteredEvents].sort((a, b) => 
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  const getEventTypeColor = (eventType: string) => {
    switch (eventType) {
      case 'ACADEMIC_TERM_START':
      case 'ACADEMIC_TERM_END':
      case 'SEMESTER_START':
      case 'SEMESTER_END':
      case 'ACADEMIC_YEAR_START':
      case 'ACADEMIC_YEAR_END':
        return 'bg-blue-100 text-blue-800';
      case 'EXAM_PERIOD':
      case 'MIDTERM_EXAM':
      case 'FINAL_EXAM':
      case 'ENTRANCE_EXAM':
        return 'bg-red-100 text-red-800';
      case 'ASSESSMENT':
        return 'bg-yellow-100 text-yellow-800';
      case 'CLASS_SESSION':
      case 'LECTURE':
      case 'TUTORIAL':
      case 'PRACTICAL_SESSION':
      case 'LAB_SESSION':
        return 'bg-green-100 text-green-800';
      case 'PUBLIC_HOLIDAY':
      case 'SCHOOL_HOLIDAY':
      case 'TERM_BREAK':
      case 'SEMESTER_BREAK':
        return 'bg-purple-100 text-purple-800';
      case 'SPORTS_EVENT':
      case 'CULTURAL_EVENT':
      case 'COMPETITION':
        return 'bg-orange-100 text-orange-800';
      default: 
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800';
      case 'ONGOING': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'POSTPONED': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const isUpcoming = (startTime: string) => {
    return new Date(startTime) > new Date();
  };

  const isToday = (startTime: string) => {
    const today = new Date();
    const eventDate = new Date(startTime);
    return today.toDateString() === eventDate.toDateString();
  };

  // Calendar view helper functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (date: Date) => {
    return sortedEvents.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate.toDateString() === date.toDateString();
    });
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

  const renderCalendarView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const today = new Date();
    
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-32 border border-gray-200"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(cellDate);
      const isCurrentDay = cellDate.toDateString() === today.toDateString();

      days.push(
        <div key={day} className={`h-32 border border-gray-200 p-1 overflow-hidden ${isCurrentDay ? 'bg-blue-50' : 'bg-white'}`}>
          <div className={`text-sm font-medium mb-1 ${isCurrentDay ? 'text-blue-600' : 'text-gray-900'}`}>
            {day}
            {isCurrentDay && <span className="ml-1 text-xs">(Today)</span>}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 3).map((event, index) => (
              <div
                key={event.id}
                className={`text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 ${getEventTypeColor(event.eventType)}`}
                title={`${event.title} - ${formatDateTime(event.startTime).time}`}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 3 && (
              <div className="text-xs text-gray-500 font-medium">
                +{dayEvents.length - 3} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-xl font-semibold text-gray-900">{monthName}</h2>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Day Names Header */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {dayNames.map(dayName => (
            <div key={dayName} className="p-3 text-center text-sm font-medium text-gray-500 bg-gray-50">
              {dayName}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {days}
        </div>
      </div>
    );
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
          <h1 className="text-3xl font-bold text-gray-900">Calendar Events</h1>
          <p className="text-gray-600 mt-2">View your academic schedule and important events</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              viewMode === 'list' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              viewMode === 'calendar' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Calendar size={16} />
            Calendar View
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => dispatch(clearCalendarError())}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search events by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="CLASS_SESSION">Class Session</option>
              <option value="LECTURE">Lecture</option>
              <option value="EXAM_PERIOD">Exam Period</option>
              <option value="MIDTERM_EXAM">Midterm Exam</option>
              <option value="FINAL_EXAM">Final Exam</option>
              <option value="ASSESSMENT">Assessment</option>
              <option value="SPORTS_EVENT">Sports Event</option>
              <option value="CULTURAL_EVENT">Cultural Event</option>
            </select>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="POSTPONED">Postponed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      {sortedEvents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Calendar size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{sortedEvents.length}</div>
                <div className="text-sm text-gray-500">Total Events</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <Clock size={20} className="text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {sortedEvents.filter(event => isUpcoming(event.startTime)).length}
                </div>
                <div className="text-sm text-gray-500">Upcoming Events</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                <Calendar size={20} className="text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {sortedEvents.filter(event => isToday(event.startTime)).length}
                </div>
                <div className="text-sm text-gray-500">Today's Events</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <Users size={20} className="text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {sortedEvents.filter(event => event.status === 'COMPLETED').length}
                </div>
                <div className="text-sm text-gray-500">Completed Events</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calendar/List View */}
      {viewMode === 'calendar' ? (
        renderCalendarView()
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {sortedEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Found</h3>
              <p className="text-gray-500">
                {searchTerm || typeFilter || statusFilter
                  ? "No events match your current filters. Try adjusting your search criteria."
                  : "There are no calendar events available at the moment."
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedEvents.map((event: CalendarEvent) => {
                    const { date, time } = formatDateTime(event.startTime);
                    const isEventToday = isToday(event.startTime);
                    const isEventUpcoming = isUpcoming(event.startTime);
                    
                    return (
                      <tr key={event.id} className={`hover:bg-gray-50 ${isEventToday ? 'bg-blue-50' : ''}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-lg mr-3 ${
                              isEventToday ? 'bg-blue-200' : 'bg-gray-100'
                            }`}>
                              <Calendar size={16} className={isEventToday ? 'text-blue-600' : 'text-gray-600'} />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {event.title}
                                {isEventToday && (
                                  <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                    Today
                                  </span>
                                )}
                              </div>
                              {event.description && (
                                <div className="text-sm text-gray-500 max-w-xs truncate">
                                  {event.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{date}</div>
                          <div className="text-sm text-gray-500">{time}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEventTypeColor(event.eventType)}`}>
                            {event.eventType.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEventStatusColor(event.status)}`}>
                            {event.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <MapPin size={16} className="text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">
                              {event.location || 'Not specified'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                            title="View Event Details"
                          >
                            <Eye size={16} />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentCalendarPage; 