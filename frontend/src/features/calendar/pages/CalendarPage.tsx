import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { 
  fetchCalendarEvents, 
  clearCalendarError, 
  setCalendarView, 
  setSelectedDate,
  setEventTypeFilter,
  setScopeFilter,
  setStatusFilter,
  setShowMyEventsOnly,
  clearFilters,
  fetchUpcomingEvents,
  fetchTodaysEvents,
  fetchThisWeeksEvents,
  fetchMonthEvents
} from '../calendarEventsSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { CalendarEvent } from '../../../api/services/calendarEventApi';
import { Plus, Search, Calendar, Filter, Grid, List, ChevronLeft, ChevronRight, Eye, Edit, Trash2, Clock, Users, MapPin } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { Table } from '../../../components/common/Table';
import CalendarView from '../components/CalendarView';

// Sample events for testing - remove when backend is ready
const sampleEvents: CalendarEvent[] = [
  {
    id: 1,
    title: 'Math Class',
    description: 'Algebra lesson for Grade 10',
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    isAllDay: false,
    isRecurring: false,
    eventType: 'CLASS_SESSION',
    status: 'SCHEDULED',
    priority: 'MEDIUM',
    scope: 'CLASS',
    location: 'Room 101',
    color: '#10B981',
    createdById: 1,
    organizerIds: [1],
    attendeeIds: [1, 2, 3],
    requiresApproval: false,
    registrationRequired: false,
    isPublic: true,
    active: true,
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Staff Meeting',
    description: 'Weekly staff meeting',
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
    isAllDay: false,
    isRecurring: false,
    eventType: 'STAFF_MEETING',
    status: 'SCHEDULED',
    priority: 'HIGH',
    scope: 'SCHOOL',
    location: 'Conference Room',
    color: '#8B5CF6',
    createdById: 1,
    organizerIds: [1],
    attendeeIds: [1, 2, 3, 4, 5],
    requiresApproval: false,
    registrationRequired: false,
    isPublic: false,
    active: true,
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString()
  },
  {
    id: 3,
    title: 'Sports Day',
    description: 'Annual school sports day',
    startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
    isAllDay: true,
    isRecurring: false,
    eventType: 'SPORTS_EVENT',
    status: 'SCHEDULED',
    priority: 'HIGH',
    scope: 'SCHOOL',
    location: 'Sports Field',
    color: '#F59E0B',
    createdById: 1,
    organizerIds: [1, 2],
    attendeeIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    requiresApproval: true,
    registrationRequired: true,
    isPublic: true,
    active: true,
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString()
  }
];

const CalendarPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { events, status, error, calendarView, selectedDate, filters } = useAppSelector(state => state.calendarEvents);
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Use sample events if no events are loaded (for testing)
  const displayEvents = events.length > 0 ? events : sampleEvents;

  useEffect(() => {
    if (user) {
      // Fetch events based on current view
      if (calendarView === 'month') {
        dispatch(fetchMonthEvents({
          userId: user.id,
          year: currentDate.getFullYear(),
          month: currentDate.getMonth() + 1
        }));
      } else {
        dispatch(fetchCalendarEvents());
      }
    }
    
    return () => {
      dispatch(clearCalendarError());
    };
  }, [dispatch, user, calendarView, currentDate]);

  // Check user permissions
  const canCreateEvents = user && [
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

  const canApproveEvents = user && [
    'SUPER_ADMIN',
    'MINISTRY_EXECUTIVE',
    'REGIONAL_ADMIN',
    'SCHOOL_ADMIN',
    'SCHOOL_HEAD'
  ].includes(user.role);

  const handleCreateEvent = (date?: Date, time?: string) => {
    dispatch(openModal({
      title: 'Create New Event',
      bodyType: MODAL_BODY_TYPES.CALENDAR_EVENT_ADD_NEW,
      size: 'lg',
      extraObject: { selectedDate: date, selectedTime: time }
    }));
  };

  const handleViewEvent = (event: CalendarEvent) => {
    dispatch(openModal({
      title: 'Event Details',
      bodyType: MODAL_BODY_TYPES.CALENDAR_EVENT_VIEW,
      extraObject: event
    }));
  };

  const handleEditEvent = (event: CalendarEvent) => {
    dispatch(openModal({
      title: 'Edit Event',
      bodyType: MODAL_BODY_TYPES.CALENDAR_EVENT_EDIT,
      extraObject: event
    }));
  };

  const handleDeleteEvent = (event: CalendarEvent) => {
    dispatch(openModal({
      title: 'Delete Event',
      bodyType: MODAL_BODY_TYPES.CALENDAR_EVENT_DELETE_CONFIRMATION,
      extraObject: event
    }));
  };

  const handleViewChange = (view: 'month' | 'week' | 'day' | 'list') => {
    dispatch(setCalendarView(view));
  };

  const handleDateNavigation = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (calendarView === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (calendarView === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else if (calendarView === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
    dispatch(setSelectedDate(date.toISOString()));
  };

  const handleQuickFilter = (filterType: 'today' | 'week' | 'upcoming') => {
    if (user) {
      switch (filterType) {
        case 'today':
          dispatch(fetchTodaysEvents());
          break;
        case 'week':
          dispatch(fetchThisWeeksEvents());
          break;
        case 'upcoming':
          dispatch(fetchUpcomingEvents());
          break;
      }
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800';
      case 'ONGOING': return 'bg-green-100 text-green-800';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'POSTPONED': return 'bg-yellow-100 text-yellow-800';
      case 'PENDING_APPROVAL': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-gray-100 text-gray-800';
      case 'MEDIUM': return 'bg-blue-100 text-blue-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'URGENT': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatEventTime = (startTime: string, endTime: string, isAllDay: boolean) => {
    if (isAllDay) return 'All Day';
    const start = new Date(startTime);
    const end = new Date(endTime);
    return `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const filteredEvents = displayEvents.filter((event: CalendarEvent) => {
    const matchesSearch = !searchTerm || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !filters.eventType || event.eventType === filters.eventType;
    const matchesScope = !filters.scope || event.scope === filters.scope;
    const matchesStatus = !filters.status || event.status === filters.status;
    const matchesUser = !filters.showMyEventsOnly || event.createdById === user?.id;

    return matchesSearch && matchesType && matchesScope && matchesStatus && matchesUser;
  });

  if (status === 'loading') {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Debug Info - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
          <strong>Debug Info:</strong> View: {calendarView}, Events: {displayEvents.length}, Filtered: {filteredEvents.length}, Status: {status}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar Events</h1>
          <p className="text-gray-600 mt-2">Manage and view school calendar events and activities</p>
        </div>
        {canCreateEvents && (
          <button
            onClick={() => handleCreateEvent()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Create Event
          </button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {/* Calendar Controls */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          {/* View Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDateNavigation('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-xl font-semibold min-w-[200px] text-center">
                {formatDate(currentDate)}
              </h2>
              <button
                onClick={() => handleDateNavigation('next')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="flex bg-gray-100 rounded-lg p-1">
              {(['month', 'week', 'day', 'list'] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => handleViewChange(view)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    calendarView === view
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {view === 'month' && <Grid size={16} className="inline mr-1" />}
                  {view === 'list' && <List size={16} className="inline mr-1" />}
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQuickFilter('today')}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => handleQuickFilter('week')}
              className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              This Week
            </button>
            <button
              onClick={() => handleQuickFilter('upcoming')}
              className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
            >
              Upcoming
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <select
              value={filters.eventType}
              onChange={(e) => dispatch(setEventTypeFilter(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="ACADEMIC_TERM_START">Academic Term Start</option>
              <option value="ACADEMIC_TERM_END">Academic Term End</option>
              <option value="EXAM_PERIOD">Exam Period</option>
              <option value="CLASS_SESSION">Class Session</option>
              <option value="STAFF_MEETING">Staff Meeting</option>
              <option value="PARENT_MEETING">Parent Meeting</option>
              <option value="SPORTS_EVENT">Sports Event</option>
              <option value="CULTURAL_EVENT">Cultural Event</option>
              <option value="PUBLIC_HOLIDAY">Public Holiday</option>
              <option value="SCHOOL_HOLIDAY">School Holiday</option>
            </select>

            <select
              value={filters.scope}
              onChange={(e) => dispatch(setScopeFilter(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Scopes</option>
              <option value="GLOBAL">Global</option>
              <option value="REGIONAL">Regional</option>
              <option value="SCHOOL">School</option>
              <option value="CLASS">Class</option>
              <option value="COURSE">Course</option>
              <option value="PERSONAL">Personal</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => dispatch(setStatusFilter(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="POSTPONED">Postponed</option>
              <option value="PENDING_APPROVAL">Pending Approval</option>
            </select>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.showMyEventsOnly}
                onChange={(e) => dispatch(setShowMyEventsOnly(e.target.checked))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">My Events Only</span>
            </label>

            <button
              onClick={() => dispatch(clearFilters())}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Calendar View or Events List */}
      {calendarView === 'list' ? (
        <div className="bg-white border border-gray-200 rounded-lg">
          {filteredEvents.length === 0 ? (
            <div className="p-8 text-center">
              <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-600">
                {searchTerm || Object.values(filters).some(f => f) 
                  ? "Try adjusting your search or filters" 
                  : "No events are scheduled for this period"}
              </p>
            </div>
          ) : (
            <Table
              columns={[
                { 
                  key: 'title', 
                  title: 'Title',
                  render: (value: string, record: CalendarEvent) => (
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: record.color || '#3B82F6' }}
                      />
                      <span className="font-medium">{value}</span>
                    </div>
                  )
                },
                { 
                  key: 'status', 
                  title: 'Status',
                  render: (value: string) => (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(value)}`}>
                      {value.replace('_', ' ')}
                    </span>
                  )
                },
                { 
                  key: 'priority', 
                  title: 'Priority',
                  render: (value: string) => (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityBadgeColor(value)}`}>
                      {value}
                    </span>
                  )
                },
                { 
                  key: 'startTime', 
                  title: 'Date & Time',
                  render: (value: string, record: CalendarEvent) => (
                    <div className="flex items-center gap-1 text-sm">
                      <Clock size={14} />
                      {formatEventTime(record.startTime, record.endTime, record.isAllDay)}
                    </div>
                  )
                },
                { 
                  key: 'location', 
                  title: 'Location',
                  render: (value: string) => value ? (
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin size={14} />
                      {value}
                    </div>
                  ) : '-'
                },
                { 
                  key: 'attendeeIds', 
                  title: 'Attendees',
                  render: (value: number[]) => (
                    <div className="flex items-center gap-1 text-sm">
                      <Users size={14} />
                      {value?.length || 0}
                    </div>
                  )
                },
                { 
                  key: 'scope', 
                  title: 'Scope',
                  render: (value: string) => (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {value}
                    </span>
                  )
                },
                { 
                  key: 'actions', 
                  title: 'Actions',
                  render: (value: any, record: CalendarEvent) => (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewEvent(record)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      
                      {(record.createdById === user?.id || canCreateEvents) && (
                        <>
                          <button
                            onClick={() => handleEditEvent(record)}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded transition-colors"
                            title="Edit Event"
                          >
                            <Edit size={16} />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteEvent(record)}
                            className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                            title="Delete Event"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  )
                }
              ]}
              data={filteredEvents}
              loading={status !== 'succeeded' && status !== 'failed' && status !== 'idle'}
              emptyMessage={
                searchTerm || Object.values(filters).some(f => f) 
                  ? "No events match your search criteria" 
                  : "No events are scheduled for this period"
              }
            />
          )}
        </div>
      ) : (
        <CalendarView
          events={filteredEvents}
          view={calendarView}
          selectedDate={currentDate}
          onDateChange={handleDateChange}
          onEventClick={handleViewEvent}
          onCreateEvent={handleCreateEvent}
          canCreateEvents={canCreateEvents}
        />
      )}
    </div>
  );
};

export default CalendarPage; 