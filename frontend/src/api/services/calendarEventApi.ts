import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  eventType: 'ACADEMIC_TERM_START' | 'ACADEMIC_TERM_END' | 'SEMESTER_START' | 'SEMESTER_END' | 'ACADEMIC_YEAR_START' | 'ACADEMIC_YEAR_END' | 'EXAM_PERIOD' | 'MIDTERM_EXAM' | 'FINAL_EXAM' | 'ENTRANCE_EXAM' | 'ASSESSMENT' | 'CLASS_SESSION' | 'LECTURE' | 'TUTORIAL' | 'PRACTICAL_SESSION' | 'LAB_SESSION' | 'FIELD_TRIP' | 'STAFF_MEETING' | 'PARENT_MEETING' | 'BOARD_MEETING' | 'FACULTY_MEETING' | 'DEPARTMENT_MEETING' | 'ORIENTATION' | 'GRADUATION' | 'ENROLLMENT_PERIOD' | 'REGISTRATION_DEADLINE' | 'PUBLIC_HOLIDAY' | 'SCHOOL_HOLIDAY' | 'TERM_BREAK' | 'SEMESTER_BREAK' | 'STUDY_BREAK' | 'SPORTS_EVENT' | 'CULTURAL_EVENT' | 'COMPETITION' | 'CLUB_ACTIVITY' | 'ASSEMBLY' | 'CEREMONY' | 'WORKSHOP' | 'SEMINAR' | 'CONFERENCE' | 'EMERGENCY_CLOSURE' | 'MAINTENANCE' | 'INSPECTION' | 'TRAINING' | 'PROFESSIONAL_DEVELOPMENT' | 'PERSONAL_APPOINTMENT' | 'PERSONAL_MEETING' | 'CUSTOM' | 'GENERAL';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'CRITICAL';
  scope: 'GLOBAL' | 'REGIONAL' | 'SCHOOL' | 'CLASS' | 'COURSE' | 'PERSONAL';
  isAllDay: boolean;
  isRecurring: boolean;
  recurrenceRule?: string;
  recurrenceEndDate?: string;
  color: string;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED' | 'RESCHEDULED' | 'SUSPENDED';
  createdById: number;
  createdByName?: string;
  schoolId?: number;
  schoolName?: string;
  regionId?: number;
  regionName?: string;
  targetClassId?: number;
  targetClassName?: string;
  courseId?: number;
  courseName?: string;
  targetRoles?: string[];
  attendeeIds?: number[];
  attendeeNames?: string[];
  organizerIds?: number[];
  organizerNames?: string[];
  requiresApproval: boolean;
  approvedById?: number;
  approvedByName?: string;
  approvedAt?: string;
  approvalNotes?: string;
  maxAttendees?: number;
  registrationRequired: boolean;
  registrationDeadline?: string;
  externalLink?: string;
  meetingLink?: string;
  notes?: string;
  isPublic: boolean;
  reminderMinutes?: number;
  active: boolean;
  parentEventId?: number;
  createdAt: string;
  modifiedAt: string;
}

export interface CalendarEventResponse {
  status: string;
  message: string;
  data: CalendarEvent | CalendarEvent[] | null;
  timestamp: string | null;
}

export interface CreateCalendarEventRequest {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  eventType: CalendarEvent['eventType'];
  priority: CalendarEvent['priority'];
  scope: CalendarEvent['scope'];
  isAllDay: boolean;
  isRecurring: boolean;
  recurrenceRule?: string;
  recurrenceEndDate?: string;
  color: string;
  status: CalendarEvent['status'];
  createdById: number;
  schoolId?: number;
  regionId?: number;
  targetClassId?: number;
  courseId?: number;
  targetRoles?: string[];
  attendeeIds?: number[];
  organizerIds?: number[];
  requiresApproval: boolean;
  approvedById?: number;
  approvalNotes?: string;
  maxAttendees?: number;
  registrationRequired: boolean;
  registrationDeadline?: string;
  externalLink?: string;
  meetingLink?: string;
  notes?: string;
  isPublic: boolean;
  reminderMinutes?: number;
  active: boolean;
  parentEventId?: number;
}

export type UpdateCalendarEventRequest = Partial<CreateCalendarEventRequest>;

/**
 * API service for interacting with calendar event endpoints
 */
const calendarEventApi = {
  /**
   * Get all calendar events
   * @returns Response with a list of calendar events
   */
  getAll: async (): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.get('/calendar-events');
  },

  /**
   * Get calendar event by ID
   * @param id Calendar event ID
   * @returns Response with calendar event details
   */
  getById: async (id: number): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.get(`/calendar-events/${id}`);
  },

  /**
   * Get events between dates
   * @param startTime Start date time
   * @param endTime End date time
   * @returns Response with calendar events in date range
   */
  getDateRange: async (startTime: string, endTime: string): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.get(`/calendar-events/date-range?startTime=${startTime}&endTime=${endTime}`);
  },

  /**
   * Get events by scope
   * @param scope Event scope
   * @returns Response with calendar events by scope
   */
  getByScope: async (scope: string): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.get(`/calendar-events/scope/${scope}`);
  },

  /**
   * Get global events
   * @returns Response with global calendar events
   */
  getGlobal: async (): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.get('/calendar-events/global');
  },

  /**
   * Get events for region
   * @param regionId Region ID
   * @returns Response with regional calendar events
   */
  getByRegion: async (regionId: number): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.get(`/calendar-events/region/${regionId}`);
  },

  /**
   * Get events for school
   * @param regionId Region ID
   * @param schoolId School ID
   * @returns Response with school calendar events
   */
  getBySchool: async (regionId: number, schoolId: number): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.get(`/calendar-events/school/${regionId}/${schoolId}`);
  },

  /**
   * Get events for class
   * @param regionId Region ID
   * @param schoolId School ID
   * @param classId Class ID
   * @returns Response with class calendar events
   */
  getByClass: async (regionId: number, schoolId: number, classId: number): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.get(`/calendar-events/class/${regionId}/${schoolId}/${classId}`);
  },

  /**
   * Get user events
   * @param userId User ID
   * @returns Response with user calendar events
   */
  getUserEvents: async (userId: number): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.get(`/calendar-events/user/${userId}`);
  },

  /**
   * Get events created by user
   * @param userId User ID
   * @returns Response with events created by user
   */
  getCreatedByUser: async (userId: number): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.get(`/calendar-events/user/${userId}/created`);
  },

  /**
   * Get events user is attending
   * @param userId User ID
   * @returns Response with events user is attending
   */
  getAttendingEvents: async (userId: number): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.get(`/calendar-events/user/${userId}/attending`);
  },

  /**
   * Get events user is organizing
   * @param userId User ID
   * @returns Response with events user is organizing
   */
  getOrganizingEvents: async (userId: number): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.get(`/calendar-events/user/${userId}/organizing`);
  },

  /**
   * Get events by type
   * @param eventType Event type
   * @returns Response with events by type
   */
  getByType: async (eventType: string): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.get(`/calendar-events/type/${eventType}`);
  },

  /**
   * Get events by status
   * @param status Event status
   * @returns Response with events by status
   */
  getByStatus: async (status: string): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.get(`/calendar-events/status/${status}`);
  },

  /**
   * Get upcoming events
   * @returns Response with upcoming events
   */
  getUpcoming: async (): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.get('/calendar-events/upcoming');
  },

  /**
   * Get today's events
   * @returns Response with today's events
   */
  getToday: async (): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.get('/calendar-events/today');
  },

  /**
   * Get this week's events
   * @returns Response with this week's events
   */
  getThisWeek: async (): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.get('/calendar-events/this-week');
  },

  /**
   * Get events by course
   * @param courseId Course ID
   * @returns Response with course events
   */
  getByCourse: async (courseId: number): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.get(`/calendar-events/course/${courseId}`);
  },

  /**
   * Search events
   * @param searchTerm Search term
   * @returns Response with search results
   */
  search: async (searchTerm: string): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.get(`/calendar-events/search?searchTerm=${encodeURIComponent(searchTerm)}`);
  },

  /**
   * Create calendar event
   * @param eventData Event data
   * @returns Response with created event
   */
  create: async (eventData: CreateCalendarEventRequest): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.post('/calendar-events', eventData);
  },

  /**
   * Update calendar event
   * @param id Event ID
   * @param eventData Updated event data
   * @returns Response with updated event
   */
  update: async (id: number, eventData: UpdateCalendarEventRequest): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.put(`/calendar-events/${id}`, eventData);
  },

  /**
   * Delete calendar event
   * @param id Event ID
   * @returns Response confirming deletion
   */
  delete: async (id: number): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.delete(`/calendar-events/${id}`);
  },

  /**
   * Add attendee to event
   * @param eventId Event ID
   * @param userId User ID
   * @returns Response confirming attendee addition
   */
  addAttendee: async (eventId: number, userId: number): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.post(`/calendar-events/${eventId}/attendees/${userId}`);
  },

  /**
   * Remove attendee from event
   * @param eventId Event ID
   * @param userId User ID
   * @returns Response confirming attendee removal
   */
  removeAttendee: async (eventId: number, userId: number): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.delete(`/calendar-events/${eventId}/attendees/${userId}`);
  },

  /**
   * Add organizer to event
   * @param eventId Event ID
   * @param userId User ID
   * @returns Response confirming organizer addition
   */
  addOrganizer: async (eventId: number, userId: number): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.post(`/calendar-events/${eventId}/organizers/${userId}`);
  },

  /**
   * Remove organizer from event
   * @param eventId Event ID
   * @param userId User ID
   * @returns Response confirming organizer removal
   */
  removeOrganizer: async (eventId: number, userId: number): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.delete(`/calendar-events/${eventId}/organizers/${userId}`);
  },

  /**
   * Mark event as ongoing
   * @param eventId Event ID
   * @returns Response with updated event
   */
  markAsOngoing: async (eventId: number): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.put(`/calendar-events/${eventId}/status/ongoing`);
  },

  /**
   * Mark event as completed
   * @param eventId Event ID
   * @returns Response with updated event
   */
  markAsCompleted: async (eventId: number): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.put(`/calendar-events/${eventId}/status/completed`);
  },

  /**
   * Cancel event
   * @param eventId Event ID
   * @param reason Cancellation reason
   * @returns Response with updated event
   */
  cancel: async (eventId: number, reason: string): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.put(`/calendar-events/${eventId}/cancel?reason=${encodeURIComponent(reason)}`);
  },

  /**
   * Postpone event
   * @param eventId Event ID
   * @param newStartTime New start time
   * @param newEndTime New end time
   * @returns Response with updated event
   */
  postpone: async (eventId: number, newStartTime: string, newEndTime: string): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.put(`/calendar-events/${eventId}/postpone?newStartTime=${newStartTime}&newEndTime=${newEndTime}`);
  },

  /**
   * Reschedule event
   * @param eventId Event ID
   * @param newStartTime New start time
   * @param newEndTime New end time
   * @returns Response with updated event
   */
  reschedule: async (eventId: number, newStartTime: string, newEndTime: string): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.put(`/calendar-events/${eventId}/reschedule?newStartTime=${newStartTime}&newEndTime=${newEndTime}`);
  },

  /**
   * Get pending approval events
   * @returns Response with pending approval events
   */
  getPendingApproval: async (): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.get('/calendar-events/pending-approval');
  },

  /**
   * Approve event
   * @param eventId Event ID
   * @param approverId Approver ID
   * @param approvalNotes Approval notes
   * @returns Response with approved event
   */
  approve: async (eventId: number, approverId: number, approvalNotes?: string): Promise<AxiosResponse<CalendarEventResponse>> => {
    const params = approvalNotes ? `&approvalNotes=${encodeURIComponent(approvalNotes)}` : '';
    return api.put(`/calendar-events/${eventId}/approve?approverId=${approverId}${params}`);
  },

  /**
   * Reject event
   * @param eventId Event ID
   * @param approverId Approver ID
   * @param rejectionNotes Rejection notes
   * @returns Response with rejected event
   */
  reject: async (eventId: number, approverId: number, rejectionNotes?: string): Promise<AxiosResponse<CalendarEventResponse>> => {
    const params = rejectionNotes ? `&rejectionNotes=${encodeURIComponent(rejectionNotes)}` : '';
    return api.put(`/calendar-events/${eventId}/reject?approverId=${approverId}${params}`);
  },

  /**
   * Get calendar view for user
   * @param userId User ID
   * @param startDate Start date
   * @param endDate End date
   * @returns Response with calendar view events
   */
  getCalendarView: async (userId: number, startDate: string, endDate: string): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.get(`/calendar-events/calendar-view/${userId}?startDate=${startDate}&endDate=${endDate}`);
  },

  /**
   * Get month events for user
   * @param userId User ID
   * @param year Year
   * @param month Month
   * @returns Response with month events
   */
  getMonthEvents: async (userId: number, year: number, month: number): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.get(`/calendar-events/month/${userId}/${year}/${month}`);
  },

  /**
   * Find conflicting events
   * @param eventId Event ID
   * @param location Location
   * @param startTime Start time
   * @param endTime End time
   * @returns Response with conflicting events
   */
  findConflicts: async (eventId: number, location: string, startTime: string, endTime: string): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.get(`/calendar-events/${eventId}/conflicts?location=${encodeURIComponent(location)}&startTime=${startTime}&endTime=${endTime}`);
  },

  /**
   * Check if event has conflicts
   * @param eventId Event ID
   * @param location Location
   * @param startTime Start time
   * @param endTime End time
   * @returns Response with conflict status
   */
  hasConflicts: async (eventId: number, location: string, startTime: string, endTime: string): Promise<AxiosResponse<{ data: boolean }>> => {
    return api.get(`/calendar-events/${eventId}/has-conflicts?location=${encodeURIComponent(location)}&startTime=${startTime}&endTime=${endTime}`);
  },

  /**
   * Create bulk events
   * @param events Array of event data
   * @returns Response with created events
   */
  createBulk: async (events: CreateCalendarEventRequest[]): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.post('/calendar-events/bulk', events);
  },

  /**
   * Delete bulk events
   * @param eventIds Array of event IDs
   * @returns Response confirming bulk deletion
   */
  deleteBulk: async (eventIds: number[]): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.delete('/calendar-events/bulk', { data: eventIds });
  },

  /**
   * Export calendar events
   * @param eventIds Array of event IDs
   * @returns Response with calendar export data
   */
  exportCalendar: async (eventIds: number[]): Promise<AxiosResponse<{ data: string }>> => {
    return api.get(`/calendar-events/export?eventIds=${eventIds.join(',')}`);
  },

  /**
   * Export user calendar
   * @param userId User ID
   * @param startDate Start date
   * @param endDate End date
   * @returns Response with user calendar export data
   */
  exportUserCalendar: async (userId: number, startDate: string, endDate: string): Promise<AxiosResponse<{ data: string }>> => {
    return api.get(`/calendar-events/export/user/${userId}?startDate=${startDate}&endDate=${endDate}`);
  },
};

export default calendarEventApi; 