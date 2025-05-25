import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface Event {
  id: number;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  type: 'CLASS' | 'EXAM' | 'ASSIGNMENT' | 'MEETING' | 'EVENT' | 'COURSE_EVENT';
  courseId?: number;
  createdById: number;
  isRecurring: boolean;
  recurrenceRule?: string;
  isAllDay: boolean;
  color: string;
}

export interface EventResponse {
  status: string;
  message: string;
  data: Event | Event[] | null;
  timestamp: string | null;
}

export interface CreateEventRequest {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  type: 'CLASS' | 'EXAM' | 'ASSIGNMENT' | 'MEETING' | 'EVENT' | 'COURSE_EVENT';
  courseId?: number;
  isRecurring?: boolean;
  recurrenceRule?: string;
  isAllDay?: boolean;
  color?: string;
}

/**
 * API service for interacting with event endpoints
 */
const eventApi = {
  /**
   * Get all events
   * @returns Response with a list of events
   */
  getAll: async (): Promise<AxiosResponse<EventResponse>> => {
    return api.get('/events');
  },

  /**
   * Get event by ID
   * @param id Event ID
   * @returns Response with event details
   */
  getById: async (id: number): Promise<AxiosResponse<EventResponse>> => {
    return api.get(`/events/${id}`);
  },

  /**
   * Get events by course ID
   * @param courseId Course ID
   * @returns Response with course events
   */
  getByCourse: async (courseId: number): Promise<AxiosResponse<EventResponse>> => {
    return api.get(`/events/course/${courseId}`);
  },

  /**
   * Get events by creator ID
   * @param creatorId Creator ID
   * @returns Response with creator's events
   */
  getByCreator: async (creatorId: number): Promise<AxiosResponse<EventResponse>> => {
    return api.get(`/events/creator/${creatorId}`);
  },

  /**
   * Get events between dates
   * @param startTime Start date/time in ISO format
   * @param endTime End date/time in ISO format
   * @returns Response with events in date range
   */
  getBetweenDates: async (startTime: string, endTime: string): Promise<AxiosResponse<EventResponse>> => {
    return api.get('/events/between', {
      params: { startTime, endTime }
    });
  },

  /**
   * Get course events between dates
   * @param courseId Course ID
   * @param startTime Start date/time in ISO format
   * @param endTime End date/time in ISO format
   * @returns Response with course events in date range
   */
  getCourseEventsBetweenDates: async (courseId: number, startTime: string, endTime: string): Promise<AxiosResponse<EventResponse>> => {
    return api.get(`/events/course/${courseId}/between`, {
      params: { startTime, endTime }
    });
  },

  /**
   * Create a new event
   * @param eventData Event data
   * @returns Response with created event
   */
  create: async (eventData: CreateEventRequest): Promise<AxiosResponse<EventResponse>> => {
    return api.post('/events', eventData);
  },

  /**
   * Update an existing event
   * @param id Event ID
   * @param eventData Updated event data
   * @returns Response with updated event
   */
  update: async (id: number, eventData: Partial<CreateEventRequest>): Promise<AxiosResponse<EventResponse>> => {
    return api.put(`/events/${id}`, eventData);
  },

  /**
   * Delete an event
   * @param id Event ID
   * @returns Response indicating success/failure
   */
  delete: async (id: number): Promise<AxiosResponse<EventResponse>> => {
    return api.delete(`/events/${id}`);
  },

  /**
   * Get today's events
   * @returns Response with today's events
   */
  getToday: async (): Promise<AxiosResponse<EventResponse>> => {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    
    return eventApi.getBetweenDates(startOfDay.toISOString(), endOfDay.toISOString());
  },

  /**
   * Get this week's events
   * @returns Response with this week's events
   */
  getThisWeek: async (): Promise<AxiosResponse<EventResponse>> => {
    const today = new Date();
    const startOfWeek = new Date(today);
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    return eventApi.getBetweenDates(startOfWeek.toISOString(), endOfWeek.toISOString());
  },

  /**
   * Get events for a specific date
   * @param date Date in YYYY-MM-DD format
   * @returns Response with events for the date
   */
  getByDate: async (date: string): Promise<AxiosResponse<EventResponse>> => {
    const startOfDay = new Date(`${date}T00:00:00`);
    const endOfDay = new Date(`${date}T23:59:59`);
    
    return eventApi.getBetweenDates(startOfDay.toISOString(), endOfDay.toISOString());
  },

  /**
   * Get upcoming events (next 7 days)
   * @returns Response with upcoming events
   */
  getUpcoming: async (): Promise<AxiosResponse<EventResponse>> => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    return eventApi.getBetweenDates(today.toISOString(), nextWeek.toISOString());
  },

  /**
   * Get events for a student based on their enrolled courses
   * @param studentId Student ID
   * @returns Response with student's events
   */
  getStudentEvents: async (studentId: number): Promise<AxiosResponse<EventResponse>> => {
    return api.get(`/events/student/${studentId}`);
  },

  /**
   * Get student events between dates
   * @param studentId Student ID
   * @param startTime Start date/time in ISO format
   * @param endTime End date/time in ISO format
   * @returns Response with student events in date range
   */
  getStudentEventsBetweenDates: async (studentId: number, startTime: string, endTime: string): Promise<AxiosResponse<EventResponse>> => {
    return api.get(`/events/student/${studentId}/between`, {
      params: { startTime, endTime }
    });
  },

  /**
   * Get student events for this week
   * @param studentId Student ID
   * @returns Response with student's events for this week
   */
  getStudentEventsThisWeek: async (studentId: number): Promise<AxiosResponse<EventResponse>> => {
    const today = new Date();
    const startOfWeek = new Date(today);
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    return eventApi.getStudentEventsBetweenDates(studentId, startOfWeek.toISOString(), endOfWeek.toISOString());
  },

  /**
   * Get student events for today
   * @param studentId Student ID
   * @returns Response with student's events for today
   */
  getStudentEventsToday: async (studentId: number): Promise<AxiosResponse<EventResponse>> => {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    
    return eventApi.getStudentEventsBetweenDates(studentId, startOfDay.toISOString(), endOfDay.toISOString());
  }
};

export default eventApi; 