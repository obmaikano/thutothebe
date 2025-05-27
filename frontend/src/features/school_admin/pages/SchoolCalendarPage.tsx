import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Clock,
  MapPin,
  Users,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload
} from 'lucide-react';

interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  type: 'ACADEMIC' | 'HOLIDAY' | 'EXAM' | 'MEETING' | 'SPORTS' | 'CULTURAL' | 'MAINTENANCE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  location?: string;
  organizer: string;
  attendees?: string[];
  isAllDay: boolean;
  isRecurring: boolean;
  recurrenceRule?: string;
  status: 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  color: string;
  reminders?: string[];
}

interface CalendarView {
  type: 'month' | 'week' | 'day' | 'agenda';
  date: Date;
}

export const SchoolCalendarPage: React.FC = () => {
  const [view, setView] = useState<CalendarView>({ type: 'month', date: new Date() });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Mock data
  const [events] = useState<CalendarEvent[]>([
    {
      id: 1,
      title: 'First Term Begins',
      description: 'Start of the first academic term',
      startDate: '2024-03-15',
      endDate: '2024-03-15',
      type: 'ACADEMIC',
      priority: 'HIGH',
      organizer: 'Academic Office',
      isAllDay: true,
      isRecurring: false,
      status: 'SCHEDULED',
      color: '#3B82F6'
    },
    {
      id: 2,
      title: 'Staff Meeting',
      description: 'Monthly staff meeting to discuss curriculum updates',
      startDate: '2024-03-18',
      endDate: '2024-03-18',
      startTime: '14:00',
      endTime: '16:00',
      type: 'MEETING',
      priority: 'MEDIUM',
      location: 'Conference Room A',
      organizer: 'Principal',
      attendees: ['All Teaching Staff'],
      isAllDay: false,
      isRecurring: true,
      recurrenceRule: 'Monthly',
      status: 'SCHEDULED',
      color: '#8B5CF6'
    },
    {
      id: 3,
      title: 'Mid-Term Examinations',
      description: 'Mid-term examinations for all classes',
      startDate: '2024-04-15',
      endDate: '2024-04-19',
      type: 'EXAM',
      priority: 'HIGH',
      organizer: 'Examination Committee',
      isAllDay: true,
      isRecurring: false,
      status: 'SCHEDULED',
      color: '#EF4444'
    },
    {
      id: 4,
      title: 'Sports Day',
      description: 'Annual inter-house sports competition',
      startDate: '2024-04-25',
      endDate: '2024-04-25',
      startTime: '08:00',
      endTime: '17:00',
      type: 'SPORTS',
      priority: 'MEDIUM',
      location: 'School Grounds',
      organizer: 'Sports Department',
      isAllDay: false,
      isRecurring: true,
      recurrenceRule: 'Yearly',
      status: 'SCHEDULED',
      color: '#10B981'
    },
    {
      id: 5,
      title: 'Public Holiday',
      description: 'National Independence Day',
      startDate: '2024-03-21',
      endDate: '2024-03-21',
      type: 'HOLIDAY',
      priority: 'LOW',
      organizer: 'Government',
      isAllDay: true,
      isRecurring: true,
      recurrenceRule: 'Yearly',
      status: 'SCHEDULED',
      color: '#F59E0B'
    }
  ]);

  const eventTypes = [
    { value: 'ACADEMIC', label: 'Academic', color: '#3B82F6' },
    { value: 'HOLIDAY', label: 'Holiday', color: '#F59E0B' },
    { value: 'EXAM', label: 'Examination', color: '#EF4444' },
    { value: 'MEETING', label: 'Meeting', color: '#8B5CF6' },
    { value: 'SPORTS', label: 'Sports', color: '#10B981' },
    { value: 'CULTURAL', label: 'Cultural', color: '#EC4899' },
    { value: 'MAINTENANCE', label: 'Maintenance', color: '#6B7280' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800';
      case 'ONGOING': return 'bg-green-100 text-green-800';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-gray-100 text-gray-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2024-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(view.date);
    
    switch (view.type) {
      case 'month':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'day':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
    }
    
    setView({ ...view, date: newDate });
  };

  const getDateRangeText = () => {
    const date = view.date;
    
    switch (view.type) {
      case 'month':
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      case 'day':
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
      case 'agenda':
        return 'Upcoming Events';
      default:
        return '';
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || event.type === filterType;
    const matchesStatus = !filterStatus || event.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return filteredEvents.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      return dateStr >= event.startDate && dateStr <= event.endDate;
    });
  };

  const renderCalendarGrid = () => {
    const today = new Date();
    const currentMonth = view.date.getMonth();
    const currentYear = view.date.getFullYear();
    
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const dayEvents = getEventsForDate(current);
      const isCurrentMonth = current.getMonth() === currentMonth;
      const isToday = current.toDateString() === today.toDateString();
      
      days.push(
        <div
          key={current.toISOString()}
          className={`min-h-[120px] border border-gray-200 p-2 ${
            isCurrentMonth ? 'bg-white' : 'bg-gray-50'
          } ${isToday ? 'bg-blue-50 border-blue-300' : ''}`}
        >
          <div className={`text-sm font-medium mb-1 ${
            isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
          } ${isToday ? 'text-blue-600' : ''}`}>
            {current.getDate()}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 3).map(event => (
              <div
                key={event.id}
                className="text-xs p-1 rounded truncate cursor-pointer hover:opacity-80"
                style={{ backgroundColor: event.color + '20', color: event.color }}
                title={event.title}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 3 && (
              <div className="text-xs text-gray-500">
                +{dayEvents.length - 3} more
              </div>
            )}
          </div>
        </div>
      );
      
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">School Calendar</h1>
          <p className="text-gray-600 mt-2">Manage school events, holidays, and important dates</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Download size={16} />
            Export
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Plus size={16} />
            Add Event
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            {/* View Type Selector */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              {['month', 'week', 'day', 'agenda'].map(viewType => (
                <button
                  key={viewType}
                  onClick={() => setView({ ...view, type: viewType as any })}
                  className={`px-3 py-1 rounded-md text-sm font-medium capitalize ${
                    view.type === viewType
                      ? 'bg-white shadow-sm text-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {viewType}
                </button>
              ))}
            </div>

            {/* Date Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateDate('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium min-w-[200px] text-center">
                {getDateRangeText()}
              </span>
              <button
                onClick={() => navigateDate('next')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <button
              onClick={() => setView({ ...view, date: new Date() })}
              className="px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Today
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="">All Types</option>
              {eventTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="">All Status</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Calendar Content */}
      {view.type === 'month' && (
        <div className="bg-white border border-gray-200 rounded-lg p-0">
          {/* Calendar Header */}
          <div className="grid grid-cols-7 border-b border-gray-200">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-4 text-center font-medium text-gray-700 border-r border-gray-200 last:border-r-0">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7">
            {renderCalendarGrid()}
          </div>
        </div>
      )}

      {view.type === 'agenda' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="space-y-4">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                <p>No events found.</p>
              </div>
            ) : (
              filteredEvents.map(event => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: event.color }}
                        />
                        <h3 className="font-medium text-gray-900">{event.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(event.priority)}`}>
                          {event.priority}
                        </span>
                      </div>
                      
                      {event.description && (
                        <p className="text-gray-700 mb-3">{event.description}</p>
                      )}
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          {event.startDate === event.endDate 
                            ? formatDate(event.startDate)
                            : `${formatDate(event.startDate)} - ${formatDate(event.endDate)}`
                          }
                        </div>
                        
                        {!event.isAllDay && event.startTime && event.endTime && (
                          <div className="flex items-center gap-2">
                            <Clock size={14} />
                            {formatTime(event.startTime)} - {formatTime(event.endTime)}
                          </div>
                        )}
                        
                        {event.location && (
                          <div className="flex items-center gap-2">
                            <MapPin size={14} />
                            {event.location}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                          <Users size={14} />
                          {event.organizer}
                        </div>
                      </div>
                      
                      {event.isRecurring && (
                        <div className="mt-2 text-sm text-blue-600">
                          <span className="flex items-center gap-2">
                            <BookOpen size={14} />
                            Recurring: {event.recurrenceRule}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Event Type Legend */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Event Types</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {eventTypes.map(type => (
            <div key={type.value} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: type.color }}
              />
              <span className="text-sm text-gray-700">{type.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <Calendar size={20} className="text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{events.length}</div>
              <div className="text-sm text-gray-500">Total Events</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {events.filter(e => {
                  const eventDate = new Date(e.startDate);
                  const now = new Date();
                  return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
                }).length}
              </div>
              <div className="text-sm text-gray-500">This Month</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <Clock size={20} className="text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {events.filter(e => new Date(e.startDate) > new Date() && e.status === 'SCHEDULED').length}
              </div>
              <div className="text-sm text-gray-500">Upcoming</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg mr-3">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {events.filter(e => e.priority === 'HIGH' && e.status === 'SCHEDULED').length}
              </div>
              <div className="text-sm text-gray-500">High Priority</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 