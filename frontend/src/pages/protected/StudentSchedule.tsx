import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { setPageTitle } from '../../features/common/headerSlice';
import studentApi from '../../api/services/studentApi';
import eventApi from '../../api/services/eventApi';
import { Calendar, Clock, BookOpen, MapPin, Users, ChevronLeft, ChevronRight } from 'lucide-react';

interface ScheduleEvent {
  id: number;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  type: 'CLASS' | 'EXAM' | 'ASSIGNMENT' | 'MEETING' | 'EVENT' | 'COURSE_EVENT';
  courseId?: number;
  courseName?: string;
  date: string;
}

interface DaySchedule {
  date: string;
  dayName: string;
  events: ScheduleEvent[];
}

const StudentSchedule = () => {
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [schedule, setSchedule] = useState<DaySchedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentWeek, setCurrentWeek] = useState(new Date());

    useEffect(() => {
        dispatch(setPageTitle({ title: "My Schedule" }));
    }, [dispatch]);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        const fetchStudentSchedule = async () => {
            if (!isAuthenticated || !user?.id) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                
                // Get student record first
                const studentResponse = await studentApi.getByUserId(user.id);
                if (studentResponse.data.status !== 'SUCCESS' || !studentResponse.data.data) {
                    setError('Student profile not found. Please contact your administrator.');
                    setLoading(false);
                    return;
                }

                const studentData = Array.isArray(studentResponse.data.data) 
                    ? studentResponse.data.data[0] 
                    : studentResponse.data.data;

                if (!studentData) {
                    setError('Student profile not found. Please contact your administrator.');
                    setLoading(false);
                    return;
                }

                console.log('Student data:', studentData);

                // Get the week range
                const startOfWeek = getStartOfWeek(currentWeek);
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);
                endOfWeek.setHours(23, 59, 59, 999);

                // Fetch real events from the backend
                const eventsResponse = await eventApi.getStudentEventsBetweenDates(
                    studentData.id,
                    startOfWeek.toISOString(),
                    endOfWeek.toISOString()
                );

                if (eventsResponse.data.status === 'SUCCESS') {
                    const events = (eventsResponse.data.data as any[]) || [];
                    console.log('Fetched events:', events);
                    
                    const weekSchedule = generateWeekSchedule(events, startOfWeek);
                    setSchedule(weekSchedule);
                } else {
                    console.error('Failed to fetch events:', eventsResponse.data.message);
                    // Still generate empty schedule for the week
                    const weekSchedule = generateWeekSchedule([], startOfWeek);
                    setSchedule(weekSchedule);
                }
            } catch (err: any) {
                console.error('Error fetching student schedule:', err);
                if (err.response?.status === 404) {
                    // No events found - this is normal, just show empty schedule
                    const startOfWeek = getStartOfWeek(currentWeek);
                    const weekSchedule = generateWeekSchedule([], startOfWeek);
                    setSchedule(weekSchedule);
                } else {
                    setError(err.response?.data?.message || 'Failed to fetch schedule');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchStudentSchedule();
    }, [user?.id, isAuthenticated, currentWeek]);

    const generateWeekSchedule = (events: any[], startOfWeek: Date): DaySchedule[] => {
        const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        
        return weekDays.map((dayName, index) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + index);
            const dateString = date.toISOString().split('T')[0];
            
            // Filter events for this specific day
            const dayEvents: ScheduleEvent[] = events
                .filter(event => {
                    const eventDate = new Date(event.startTime).toISOString().split('T')[0];
                    return eventDate === dateString;
                })
                .map(event => ({
                    id: event.id,
                    title: event.title,
                    description: event.description,
                    startTime: new Date(event.startTime).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: false 
                    }),
                    endTime: new Date(event.endTime).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: false 
                    }),
                    location: event.location,
                    type: event.type,
                    courseId: event.courseId,
                    courseName: event.title, // Use title as course name for now
                    date: dateString
                }))
                .sort((a, b) => a.startTime.localeCompare(b.startTime)); // Sort by start time

            return {
                date: dateString,
                dayName,
                events: dayEvents
            };
        });
    };

    const getStartOfWeek = (date: Date): Date => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        return new Date(d.setDate(diff));
    };

    const navigateWeek = (direction: 'prev' | 'next') => {
        const newWeek = new Date(currentWeek);
        newWeek.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
        setCurrentWeek(newWeek);
    };

    const getEventTypeColor = (type: string) => {
        switch (type) {
            case 'CLASS':
            case 'COURSE_EVENT':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'EXAM':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'ASSIGNMENT':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'MEETING':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatWeekRange = () => {
        const startOfWeek = getStartOfWeek(currentWeek);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 4); // Friday
        
        return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    };

    if (!isAuthenticated) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900">Authentication Required</h3>
                    <p className="mt-2 text-sm text-gray-500">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Error</h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>{error}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Schedule</h1>
                    <p className="text-gray-600 mt-2">View your weekly class timetable and upcoming events</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-500">
                        {formatWeekRange()}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigateWeek('prev')}
                            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => navigateWeek('next')}
                            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Weekly Schedule */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                {schedule.length === 0 ? (
                    <div className="text-center py-12">
                        <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No schedule available</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Your class timetable will appear here when events are scheduled.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {schedule.map((day) => (
                            <div key={day.date} className="border border-gray-200 rounded-lg p-4">
                                <div className="text-center mb-4">
                                    <h3 className="font-semibold text-gray-900">{day.dayName}</h3>
                                    <p className="text-sm text-gray-500">
                                        {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </p>
                                </div>
                                
                                <div className="space-y-2">
                                    {day.events.length === 0 ? (
                                        <div className="text-center py-4">
                                            <p className="text-xs text-gray-400">No classes</p>
                                        </div>
                                    ) : (
                                        day.events.map((event) => (
                                            <div
                                                key={event.id}
                                                className={`p-3 rounded-lg border ${getEventTypeColor(event.type)} hover:shadow-sm transition-shadow cursor-pointer`}
                                            >
                                                <div className="font-medium text-sm mb-1">{event.title}</div>
                                                <div className="flex items-center text-xs text-gray-600 mb-1">
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    {event.startTime} - {event.endTime}
                                                </div>
                                                {event.location && (
                                                    <div className="flex items-center text-xs text-gray-600">
                                                        <MapPin className="h-3 w-3 mr-1" />
                                                        {event.location}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Today's Schedule Summary */}
            {schedule.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Classes</h3>
                    {(() => {
                        const today = new Date().toISOString().split('T')[0];
                        const todaySchedule = schedule.find(day => day.date === today);
                        
                        if (!todaySchedule || todaySchedule.events.length === 0) {
                            return (
                                <div className="text-center py-8">
                                    <BookOpen className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-500">No classes scheduled for today</p>
                                </div>
                            );
                        }

                        return (
                            <div className="space-y-3">
                                {todaySchedule.events.map((event) => (
                                    <div key={event.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-lg ${getEventTypeColor(event.type)}`}>
                                                <BookOpen className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">{event.title}</h4>
                                                <p className="text-sm text-gray-600">{event.description}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center text-sm text-gray-600 mb-1">
                                                <Clock className="h-4 w-4 mr-1" />
                                                {event.startTime} - {event.endTime}
                                            </div>
                                            {event.location && (
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <MapPin className="h-4 w-4 mr-1" />
                                                    {event.location}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        );
                    })()}
                </div>
            )}
        </div>
    );
};

export default StudentSchedule; 