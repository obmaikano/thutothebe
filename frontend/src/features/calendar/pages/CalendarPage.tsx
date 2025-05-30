import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { 
  fetchCalendarEvents, 
  clearCalendarError, 
  setCalendarView, 
  setSelectedDate,
  setEventTypeFilter,
  setScopeFilter,
  setShowMyEventsOnly
} from '../calendarEventsSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { useAuth } from '../../../contexts/AuthContext';
import CalendarView from '../components/CalendarView';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Filter, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  List,
  Grid3X3,
  Clock,
  Users,
  MapPin,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { CalendarEvent } from '../../../api/services/calendarEventApi';

const CalendarPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { 
    events, 
    status, 
    error, 
    calendarView, 
    selectedDate, 
    filters
  } = useAppSelector(state => state.calendarEvents);

  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch events when component mounts
    dispatch(fetchCalendarEvents());
    
    return () => {
      dispatch(clearCalendarError());
    };
  }, [dispatch]);

  // Filter events based on current filters
  const filteredEvents = events.filter((event: CalendarEvent) => {
    // Search filter
    if (searchTerm && !event.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !event.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Event type filter
    if (filters.eventType && event.eventType !== filters.eventType) {
      return false;
    }

    // Scope filter
    if (filters.scope && event.scope !== filters.scope) {
      return false;
    }

    // My events only filter
    if (filters.showMyEventsOnly && user) {
      const isCreator = event.createdById === user.id;
      const isAttendee = event.attendeeIds?.includes(user.id);
      const isOrganizer = event.organizerIds?.includes(user.id);
      
      if (!isCreator && !isAttendee && !isOrganizer) {
        return false;
      }
    }

    return true;
  });

  const handleCreateEvent = () => {
    dispatch(openModal({
      title: 'Create New Event',
      bodyType: MODAL_BODY_TYPES.CALENDAR_EVENT_ADD_NEW,
      size: 'lg'
    }));
  };

  const handleEventClick = (event: CalendarEvent) => {
    dispatch(openModal({
      title: 'Event Details',
      bodyType: MODAL_BODY_TYPES.CALENDAR_EVENT_VIEW,
      extraObject: event,
      size: 'lg'
    }));
  };

  const handleDateChange = (date: Date) => {
    dispatch(setSelectedDate(date.toISOString()));
  };

  const handleViewChange = (view: 'month' | 'week' | 'day' | 'list') => {
    dispatch(setCalendarView(view));
  };

  const handleRefresh = () => {
    dispatch(fetchCalendarEvents());
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const currentDate = new Date(selectedDate);
    let newDate: Date;

    switch (calendarView) {
      case 'month':
        newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + (direction === 'next' ? 1 : -1), 1);
        break;
      case 'week':
        newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'day':
        newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
      default:
        newDate = currentDate;
    }

    dispatch(setSelectedDate(newDate.toISOString()));
  };

  const formatDateHeader = () => {
    const date = new Date(selectedDate);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long'
    };

    switch (calendarView) {
      case 'month':
        return date.toLocaleDateString('en-US', options);
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      case 'day':
        return date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      default:
        return '';
    }
  };

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

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const eventTypeOptions = [
    { value: '', label: 'All Types' },
    { value: 'ACADEMIC', label: 'Academic' },
    { value: 'ADMINISTRATIVE', label: 'Administrative' },
    { value: 'SOCIAL', label: 'Social' },
    { value: 'SPORTS', label: 'Sports' },
    { value: 'CULTURAL', label: 'Cultural' },
    { value: 'MEETING', label: 'Meeting' },
    { value: 'EXAM', label: 'Exam' },
    { value: 'HOLIDAY', label: 'Holiday' },
    { value: 'TRAINING', label: 'Training' },
    { value: 'OTHER', label: 'Other' }
  ];

  const scopeOptions = [
    { value: '', label: 'All Scopes' },
    { value: 'GLOBAL', label: 'Global' },
    { value: 'REGIONAL', label: 'Regional' },
    { value: 'SCHOOL', label: 'School' },
    { value: 'CLASS', label: 'Class' },
    { value: 'COURSE', label: 'Course' },
    { value: 'DEPARTMENT', label: 'Department' },
    { value: 'PRIVATE', label: 'Private' }
  ];

  if (status === 'loading' && events.length === 0) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner loading-lg"></div>
          <span className="ml-3 text-gray-600">Loading calendar events...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar Events</h1>
          <p className="text-gray-600 mt-2">Manage and view school calendar events and activities</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={status === 'loading'}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={status === 'loading' ? 'animate-spin' : ''} />
            Refresh
          </button>
          {canCreateEvents && (
            <button
              onClick={handleCreateEvent}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={16} />
              Create Event
            </button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle size={16} />
            <span className="font-medium">Error loading calendar events</span>
          </div>
          <p className="text-red-700 mt-1">{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-2 text-red-600 hover:text-red-800 underline text-sm"
          >
            Try again
          </button>
        </div>
      )}

      {/* Controls */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                showFilters ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter size={16} />
              Filters
            </button>
          </div>

          {/* View Controls */}
          <div className="flex items-center gap-2">
            {/* Navigation */}
            <div className="flex items-center gap-2 mr-4">
              <button
                onClick={() => navigateDate('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-medium min-w-[200px] text-center">
                {formatDateHeader()}
              </span>
              <button
                onClick={() => navigateDate('next')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* View Buttons */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {[
                { key: 'month', icon: Grid3X3, label: 'Month' },
                { key: 'week', icon: CalendarIcon, label: 'Week' },
                { key: 'day', icon: Clock, label: 'Day' },
                { key: 'list', icon: List, label: 'List' }
              ].map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => handleViewChange(key as 'month' | 'week' | 'day' | 'list')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    calendarView === key
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title={label}
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Event Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                <select
                  value={filters.eventType}
                  onChange={(e) => dispatch(setEventTypeFilter(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {eventTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Scope Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Scope</label>
                <select
                  value={filters.scope}
                  onChange={(e) => dispatch(setScopeFilter(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {scopeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* My Events Toggle */}
              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.showMyEventsOnly}
                    onChange={(e) => dispatch(setShowMyEventsOnly(e.target.checked))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Show only my events</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CalendarIcon size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{filteredEvents.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Clock size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredEvents.filter(e => new Date(e.startTime) > new Date()).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">My Events</p>
              <p className="text-2xl font-bold text-gray-900">
                {user ? filteredEvents.filter(e => 
                  e.createdById === user.id || 
                  e.attendeeIds?.includes(user.id) || 
                  e.organizerIds?.includes(user.id)
                ).length : 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <MapPin size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredEvents.filter(e => {
                  const eventDate = new Date(e.startTime).toDateString();
                  const today = new Date().toDateString();
                  return eventDate === today;
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-white border border-gray-200 rounded-lg">
        {calendarView === 'list' ? (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Events List</h3>
            {filteredEvents.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                <p className="text-gray-600">
                  {searchTerm || filters.eventType || filters.scope || filters.showMyEventsOnly
                    ? "Try adjusting your search or filters"
                    : "No events are scheduled"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => handleEventClick(event)}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: event.color || '#3B82F6' }}
                          />
                          <h4 className="font-medium text-gray-900">{event.title}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            event.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                            event.status === 'ONGOING' ? 'bg-green-100 text-green-800' :
                            event.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' :
                            event.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {event.status.replace('_', ' ')}
                          </span>
                        </div>
                        {event.description && (
                          <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            {event.isAllDay ? 'All Day' : `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`}
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-1">
                              <MapPin size={14} />
                              {event.location}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Users size={14} />
                            {event.attendeeIds?.length || 0} attendees
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(event.startTime).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <CalendarView
            events={filteredEvents}
            view={calendarView}
            selectedDate={new Date(selectedDate)}
            onEventClick={handleEventClick}
            onDateChange={handleDateChange}
          />
        )}
      </div>
    </div>
  );
};

export default CalendarPage; 