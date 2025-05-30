import React, { useState, useMemo } from 'react';
import { CalendarEvent } from '../../../api/services/calendarEventApi';
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, Users } from 'lucide-react';

interface CalendarViewProps {
  events: CalendarEvent[];
  view: 'month' | 'week' | 'day';
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onCreateEvent?: (date: Date, time?: string) => void;
  canCreateEvents?: boolean;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  view,
  selectedDate,
  onDateChange,
  onEventClick,
  onCreateEvent,
  canCreateEvents = false
}) => {
  const [currentDate, setCurrentDate] = useState(selectedDate);

  // Helper functions
  const getMonthDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return { days, firstDay, lastDay };
  };

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    
    return days;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getTimedEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate.toDateString() === date.toDateString() && !event.isAllDay;
    });
  };

  const getAllDayEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate.toDateString() === date.toDateString() && event.isAllDay;
    });
  };

  const getEventColor = (event: CalendarEvent) => {
    // Use event color if available, otherwise fall back to type-based colors
    if (event.color) {
      return event.color;
    }
    
    switch (event.eventType) {
      case 'ACADEMIC_TERM_START':
      case 'ACADEMIC_TERM_END':
        return '#3B82F6'; // blue
      case 'EXAM_PERIOD':
        return '#EF4444'; // red
      case 'CLASS_SESSION':
        return '#10B981'; // green
      case 'STAFF_MEETING':
        return '#8B5CF6'; // purple
      case 'PARENT_MEETING':
        return '#F59E0B'; // orange
      case 'SPORTS_EVENT':
        return '#F59E0B'; // yellow
      case 'CULTURAL_EVENT':
        return '#EC4899'; // pink
      case 'PUBLIC_HOLIDAY':
      case 'SCHOOL_HOLIDAY':
        return '#6B7280'; // gray
      default:
        return '#3B82F6'; // default blue
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSameMonth = (date: Date, referenceDate: Date) => {
    return date.getMonth() === referenceDate.getMonth() && 
           date.getFullYear() === referenceDate.getFullYear();
  };

  const handleDateClick = (date: Date) => {
    setCurrentDate(date);
    onDateChange(date);
  };

  const handleCreateEventClick = (date: Date, time?: string) => {
    if (onCreateEvent) {
      onCreateEvent(date, time);
    }
  };

  // Month View
  const renderMonthView = () => {
    const { days, firstDay } = getMonthDays(currentDate);
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {weekDays.map(day => (
            <div key={day} className="p-3 text-center font-semibold text-gray-700 bg-gray-50 border-r border-gray-200 last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const dayEvents = getEventsForDate(day);
            const allDayEvents = getAllDayEventsForDate(day);
            const timedEvents = getTimedEventsForDate(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isTodayDate = isToday(day);

            return (
              <div
                key={index}
                className={`min-h-[120px] border-r border-b border-gray-200 last:border-r-0 p-2 group relative ${
                  !isCurrentMonth ? 'bg-gray-50' : 'bg-white'
                } hover:bg-blue-50 cursor-pointer transition-colors`}
                onClick={() => handleDateClick(day)}
              >
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`text-sm font-medium ${
                      isTodayDate
                        ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center'
                        : isCurrentMonth
                        ? 'text-gray-900'
                        : 'text-gray-400'
                    }`}
                  >
                    {day.getDate()}
                  </span>
                  {canCreateEvents && isCurrentMonth && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCreateEventClick(day);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-600 transition-all duration-200 p-1 rounded hover:bg-blue-100"
                      title="Create event"
                    >
                      <Plus size={14} />
                    </button>
                  )}
                </div>

                <div className="space-y-1">
                  {/* All-day events first */}
                  {allDayEvents.slice(0, 2).map((event, eventIndex) => (
                    <div
                      key={`allday-${event.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                      className="text-white text-xs p-1 rounded cursor-pointer hover:opacity-80 truncate transition-opacity border-l-4"
                      style={{ 
                        backgroundColor: getEventColor(event),
                        borderLeftColor: getEventColor(event)
                      }}
                      title={`${event.title} (All Day)`}
                    >
                      <div className="flex items-center gap-1">
                        <span className="text-xs opacity-75">●</span>
                        <span className="font-medium">{event.title}</span>
                      </div>
                    </div>
                  ))}
                  
                  {/* Timed events */}
                  {timedEvents.slice(0, allDayEvents.length > 0 ? 2 : 3).map((event, eventIndex) => (
                    <div
                      key={`timed-${event.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                      className="text-white text-xs p-1 rounded cursor-pointer hover:opacity-80 truncate transition-opacity"
                      style={{ backgroundColor: getEventColor(event) }}
                      title={`${event.title} - ${formatTime(event.startTime)}`}
                    >
                      <span className="font-medium">{formatTime(event.startTime)} </span>
                      {event.title}
                    </div>
                  ))}
                  
                  {/* Show more indicator */}
                  {dayEvents.length > (allDayEvents.length > 0 ? 4 : 3) && (
                    <div className="text-xs text-gray-500 font-medium cursor-pointer hover:text-blue-600">
                      +{dayEvents.length - (allDayEvents.length > 0 ? 4 : 3)} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Week View
  const renderWeekView = () => {
    const weekDays = getWeekDays(currentDate);
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-8 border-b border-gray-200">
          <div className="p-3 border-r border-gray-200 bg-gray-50"></div>
          {weekDays.map(day => (
            <div key={day.toISOString()} className="p-3 text-center border-r border-gray-200 last:border-r-0 bg-gray-50">
              <div className="font-medium text-gray-700">
                {day.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div
                className={`text-lg font-semibold ${
                  isToday(day) ? 'text-blue-600' : 'text-gray-900'
                }`}
              >
                {day.getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* All-day events section */}
        <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-50">
          <div className="p-2 text-xs text-gray-500 border-r border-gray-200 text-right font-medium">
            All Day
          </div>
          {weekDays.map(day => {
            const allDayEvents = getAllDayEventsForDate(day);
            return (
              <div
                key={`allday-${day.toISOString()}`}
                className="min-h-[40px] p-1 border-r border-gray-200 last:border-r-0 space-y-1"
              >
                {allDayEvents.map(event => (
                  <div
                    key={event.id}
                    onClick={() => onEventClick(event)}
                    className="text-white text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity font-medium border-l-4"
                    style={{ 
                      backgroundColor: getEventColor(event),
                      borderLeftColor: getEventColor(event)
                    }}
                    title={`${event.title} (All Day)`}
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-xs opacity-75">●</span>
                      <span className="truncate">{event.title}</span>
                    </div>
                  </div>
                ))}
                {canCreateEvents && allDayEvents.length === 0 && (
                  <div
                    onClick={() => handleCreateEventClick(day)}
                    className="text-gray-400 text-xs opacity-0 hover:opacity-100 transition-opacity cursor-pointer p-1 rounded hover:bg-blue-100"
                  >
                    + Add all-day event
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Time Grid */}
        <div className="max-h-[600px] overflow-y-auto">
          {hours.map(hour => (
            <div key={hour} className="grid grid-cols-8 border-b border-gray-100 last:border-b-0">
              <div className="p-2 text-xs text-gray-500 border-r border-gray-200 text-right bg-gray-50 font-medium">
                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
              </div>
              {weekDays.map(day => {
                const timedEvents = getTimedEventsForDate(day).filter(event => {
                  const eventHour = new Date(event.startTime).getHours();
                  return eventHour === hour;
                });

                return (
                  <div
                    key={`${day.toISOString()}-${hour}`}
                    className="min-h-[60px] p-1 border-r border-gray-200 last:border-r-0 hover:bg-blue-50 cursor-pointer transition-colors"
                    onClick={() => canCreateEvents && handleCreateEventClick(day, `${hour}:00`)}
                  >
                    {timedEvents.map(event => (
                      <div
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }}
                        className="text-white text-xs p-1 rounded mb-1 cursor-pointer hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: getEventColor(event) }}
                      >
                        <div className="font-medium truncate">{event.title}</div>
                        <div className="opacity-75">
                          {formatTime(event.startTime)} - {formatTime(event.endTime)}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Day View
  const renderDayView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const dayEvents = getEventsForDate(currentDate);
    const allDayEvents = getAllDayEventsForDate(currentDate);
    const timedEvents = getTimedEventsForDate(currentDate);

    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {currentDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            {dayEvents.length > 0 && (
              <div className="text-sm text-gray-600 mt-1">
                {allDayEvents.length > 0 && `${allDayEvents.length} all-day event${allDayEvents.length !== 1 ? 's' : ''}`}
                {allDayEvents.length > 0 && timedEvents.length > 0 && ', '}
                {timedEvents.length > 0 && `${timedEvents.length} timed event${timedEvents.length !== 1 ? 's' : ''}`}
              </div>
            )}
          </div>
        </div>

        {/* All-day events section */}
        {(allDayEvents.length > 0 || canCreateEvents) && (
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex">
              <div className="w-20 p-2 text-xs text-gray-500 border-r border-gray-200 text-right bg-gray-50 font-medium">
                All Day
              </div>
              <div className="flex-1 p-2 space-y-1">
                {allDayEvents.map(event => (
                  <div
                    key={event.id}
                    onClick={() => onEventClick(event)}
                    className="text-white p-2 rounded cursor-pointer hover:opacity-80 transition-opacity shadow-sm border-l-4"
                    style={{ 
                      backgroundColor: getEventColor(event),
                      borderLeftColor: getEventColor(event)
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm opacity-75">●</span>
                        <span className="font-medium">{event.title}</span>
                      </div>
                      {event.attendeeIds && event.attendeeIds.length > 0 && (
                        <div className="text-sm opacity-90 flex items-center gap-1">
                          <Users size={12} />
                          {event.attendeeIds.length}
                        </div>
                      )}
                    </div>
                    {event.description && (
                      <div className="text-sm opacity-90 mt-1 truncate">
                        {event.description}
                      </div>
                    )}
                    {event.location && (
                      <div className="text-sm opacity-90 flex items-center gap-1 mt-1">
                        <MapPin size={12} />
                        {event.location}
                      </div>
                    )}
                  </div>
                ))}
                {canCreateEvents && (
                  <div
                    onClick={() => handleCreateEventClick(currentDate)}
                    className="text-gray-400 text-sm opacity-0 hover:opacity-100 transition-opacity cursor-pointer p-2 rounded hover:bg-blue-100 border-2 border-dashed border-gray-300"
                  >
                    + Add all-day event
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Time Grid */}
        <div className="max-h-[600px] overflow-y-auto">
          {hours.map(hour => {
            const hourEvents = timedEvents.filter(event => {
              const eventHour = new Date(event.startTime).getHours();
              return eventHour === hour;
            });

            return (
              <div key={hour} className="flex border-b border-gray-100 last:border-b-0">
                <div className="w-20 p-2 text-xs text-gray-500 border-r border-gray-200 text-right bg-gray-50 font-medium">
                  {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                </div>
                <div
                  className="flex-1 min-h-[60px] p-2 hover:bg-blue-50 cursor-pointer transition-colors"
                  onClick={() => canCreateEvents && handleCreateEventClick(currentDate, `${hour}:00`)}
                >
                  {hourEvents.map(event => (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                      className="text-white p-2 rounded mb-2 cursor-pointer hover:opacity-80 transition-opacity shadow-sm"
                      style={{ backgroundColor: getEventColor(event) }}
                    >
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm opacity-90 flex items-center gap-2 mt-1">
                        <Clock size={12} />
                        {formatTime(event.startTime)} - {formatTime(event.endTime)}
                      </div>
                      {event.location && (
                        <div className="text-sm opacity-90 flex items-center gap-2 mt-1">
                          <MapPin size={12} />
                          {event.location}
                        </div>
                      )}
                      {event.attendeeIds && event.attendeeIds.length > 0 && (
                        <div className="text-sm opacity-90 flex items-center gap-2 mt-1">
                          <Users size={12} />
                          {event.attendeeIds.length} attendees
                        </div>
                      )}
                    </div>
                  ))}
                  {canCreateEvents && hourEvents.length === 0 && (
                    <div className="text-gray-400 text-sm opacity-0 hover:opacity-100 transition-opacity">
                      Click to create event
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Debug info - remove in production
  const debugInfo = process.env.NODE_ENV === 'development' && (
    <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
      Debug: View={view}, Events={events.length}, Date={currentDate.toDateString()}
    </div>
  );

  return (
    <div className="space-y-4">
      {debugInfo}
      {view === 'month' && renderMonthView()}
      {view === 'week' && renderWeekView()}
      {view === 'day' && renderDayView()}
    </div>
  );
};

export default CalendarView; 