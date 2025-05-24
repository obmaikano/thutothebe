import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, MapPin, Users, BookOpen } from 'lucide-react';

interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  type: 'class' | 'assignment' | 'exam' | 'meeting' | 'holiday';
  description?: string;
  location?: string;
}

interface CalendarViewModalProps {
  extraObject?: {
    classId: number;
    className: string;
  };
}

const CalendarViewModal: React.FC<CalendarViewModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const classId = extraObject?.classId;
  const className = extraObject?.className || 'Class';

  useEffect(() => {
    // Mock events data
    const mockEvents: CalendarEvent[] = [
      {
        id: 1,
        title: 'Mathematics Lesson',
        date: '2024-01-15',
        time: '09:00',
        type: 'class',
        description: 'Algebra fundamentals',
        location: 'Room 101'
      },
      {
        id: 2,
        title: 'Assignment Due: Essay',
        date: '2024-01-16',
        time: '23:59',
        type: 'assignment',
        description: 'English essay on Shakespeare'
      },
      {
        id: 3,
        title: 'Science Exam',
        date: '2024-01-18',
        time: '10:00',
        type: 'exam',
        description: 'Chapter 1-3 Biology test',
        location: 'Room 205'
      },
      {
        id: 4,
        title: 'Parent-Teacher Meeting',
        date: '2024-01-20',
        time: '14:00',
        type: 'meeting',
        description: 'Monthly progress review',
        location: 'Conference Hall'
      },
      {
        id: 5,
        title: 'History Lesson',
        date: '2024-01-22',
        time: '11:00',
        type: 'class',
        description: 'World War II overview',
        location: 'Room 103'
      }
    ];
    setEvents(mockEvents);
  }, []);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getEventsForDate = (date: string) => {
    return events.filter(event => event.date === date);
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

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
  };

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'class': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'assignment': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'exam': return 'bg-red-100 text-red-800 border-red-200';
      case 'meeting': return 'bg-green-100 text-green-800 border-green-200';
      case 'holiday': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEventTypeIcon = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'class': return <BookOpen className="h-3 w-3" />;
      case 'assignment': return <Clock className="h-3 w-3" />;
      case 'exam': return <Users className="h-3 w-3" />;
      case 'meeting': return <Users className="h-3 w-3" />;
      case 'holiday': return <Calendar className="h-3 w-3" />;
      default: return null;
    }
  };

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const today = new Date();
  const isToday = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return formatDate(date) === formatDate(today);
  };

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
      const dayEvents = getEventsForDate(date);
      const isSelected = selectedDate && formatDate(selectedDate) === date;
      
      days.push(
        <div
          key={day}
          className={`h-24 border border-gray-200 p-1 cursor-pointer hover:bg-gray-50 ${
            isToday(day) ? 'bg-blue-50' : ''
          } ${isSelected ? 'bg-blue-100' : ''}`}
          onClick={() => handleDateClick(day)}
        >
          <div className={`text-sm font-medium mb-1 ${isToday(day) ? 'text-blue-600' : 'text-gray-900'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 2).map(event => (
              <div
                key={event.id}
                className={`text-xs px-1 py-0.5 rounded border ${getEventTypeColor(event.type)} truncate`}
                title={event.title}
              >
                <div className="flex items-center gap-1">
                  {getEventTypeIcon(event.type)}
                  <span className="truncate">{event.title}</span>
                </div>
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-500">
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(formatDate(selectedDate)) : [];

  if (!classId) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">Error: No class information provided</div>
        <button onClick={handleClose} className="btn btn-primary">Close</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Calendar className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Class Calendar</h2>
            <p className="text-sm text-gray-600">{className}</p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h3 className="text-xl font-semibold text-gray-900">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Today
          </button>
          <button className="inline-flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700">
            <Plus className="h-4 w-4 mr-1" />
            Add Event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Days of week header */}
            <div className="grid grid-cols-7 bg-gray-50">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-3 text-center text-sm font-medium text-gray-700 border-r border-gray-200 last:border-r-0">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar days */}
            <div className="grid grid-cols-7">
              {renderCalendarGrid()}
            </div>
          </div>
        </div>

        {/* Event Details Panel */}
        <div className="space-y-4">
          {/* Legend */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Event Types</h4>
            <div className="space-y-2">
              {[
                { type: 'class' as const, label: 'Classes' },
                { type: 'assignment' as const, label: 'Assignments' },
                { type: 'exam' as const, label: 'Exams' },
                { type: 'meeting' as const, label: 'Meetings' }
              ].map(({ type, label }) => (
                <div key={type} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded border ${getEventTypeColor(type)}`}></div>
                  <span className="text-sm text-gray-700">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Date Events */}
          {selectedDate && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h4>
              
              {selectedDateEvents.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateEvents.map(event => (
                    <div key={event.id} className={`p-3 rounded-lg border ${getEventTypeColor(event.type)}`}>
                      <div className="flex items-start gap-2">
                        {getEventTypeIcon(event.type)}
                        <div className="flex-1">
                          <div className="font-medium text-sm">{event.title}</div>
                          <div className="text-xs opacity-75 mt-1">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {event.time}
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-1 mt-1">
                                <MapPin className="h-3 w-3" />
                                {event.location}
                              </div>
                            )}
                          </div>
                          {event.description && (
                            <div className="text-xs mt-2 opacity-90">
                              {event.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 text-center py-4">
                  No events scheduled for this date
                </div>
              )}
            </div>
          )}

          {/* Upcoming Events */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Upcoming Events</h4>
            <div className="space-y-2">
              {events.slice(0, 5).map(event => (
                <div key={event.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                  <div className={`w-2 h-2 rounded-full ${getEventTypeColor(event.type).split(' ')[0]}`}></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium truncate">{event.title}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(event.date).toLocaleDateString()} at {event.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarViewModal; 