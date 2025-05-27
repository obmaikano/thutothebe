import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface ClassInfo {
  id: number;
  period: number | string;
  subject: string;
  teacher: string | null;
  room: string;
  startTime: string;
  endTime: string;
  type: string;
  status: string;
  current?: boolean;
}

export interface DaySchedule {
  day: string;
  date: string;
  classes: ClassInfo[];
}

export interface ScheduleData {
  weeklySchedule: DaySchedule[];
  nextClass: ClassInfo;
  todaySchedule: ClassInfo[];
  statistics: {
    totalClassesThisWeek: number;
    completedClasses: number;
    upcomingClasses: number;
    averageClassDuration: string;
  };
}

export interface Schedule {
  id: number;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  dayOfWeek: string;
  effectiveDate: string;
  expiryDate?: string;
  location?: string;
  type: string;
  status: string;
  color?: string;
  isRecurring: boolean;
  recurrenceRule?: string;
  courseId?: number;
  classId?: number;
  schoolId?: number;
  regionId?: number;
  teacherId?: number;
  active: boolean;
}

export interface ScheduleResponse {
  status: string;
  message: string;
  data: ScheduleData | Schedule[] | Schedule | ClassInfo[] | ClassInfo | any | null;
  timestamp: string | null;
}

export type CreateScheduleRequest = Omit<Schedule, 'id'>;
export type UpdateScheduleRequest = Partial<Schedule>;

/**
 * API service for interacting with schedule endpoints
 */
const scheduleApi = {
  /**
   * Get schedule for a student
   * @param studentId Student ID
   * @returns Response with student's schedule
   */
  getStudentSchedule: async (studentId: number): Promise<AxiosResponse<ScheduleResponse>> => {
    return api.get(`/schedules/student/${studentId}`);
  },

  /**
   * Get today's schedule for a student
   * @param studentId Student ID
   * @returns Response with today's classes
   */
  getTodaySchedule: async (studentId: number): Promise<AxiosResponse<ScheduleResponse>> => {
    return api.get(`/schedules/student/${studentId}/today`);
  },

  /**
   * Get next class for a student
   * @param studentId Student ID
   * @returns Response with next class information
   */
  getNextClass: async (studentId: number): Promise<AxiosResponse<ScheduleResponse>> => {
    return api.get(`/schedules/student/${studentId}/next-class`);
  },

  /**
   * Get timetable for a class
   * @param classId Class ID
   * @returns Response with class timetable
   */
  getClassTimetable: async (classId: number): Promise<AxiosResponse<ScheduleResponse>> => {
    return api.get(`/schedules/class/${classId}/timetable`);
  },

  /**
   * Get all schedules
   * @returns Response with all schedules
   */
  getAll: async (): Promise<AxiosResponse<ScheduleResponse>> => {
    return api.get('/schedules');
  },

  /**
   * Get schedule by ID
   * @param id Schedule ID
   * @returns Response with schedule details
   */
  getById: async (id: number): Promise<AxiosResponse<ScheduleResponse>> => {
    return api.get(`/schedules/${id}`);
  },

  /**
   * Get schedules by school ID
   * @param schoolId School ID
   * @param userRole User role for access control
   * @param userId User ID for access control
   * @param userRegionId User region ID (optional)
   * @param userSchoolId User school ID (optional)
   * @returns Response with school schedules
   */
  getBySchool: async (
    schoolId: number, 
    userRole: string, 
    userId: number, 
    userRegionId?: number, 
    userSchoolId?: number
  ): Promise<AxiosResponse<ScheduleResponse>> => {
    const params: any = { userRole, userId };
    if (userRegionId) params.userRegionId = userRegionId;
    if (userSchoolId) params.userSchoolId = userSchoolId;
    
    return api.get(`/schedules/school/${schoolId}`, { params });
  },

  /**
   * Get schedules by class ID
   * @param classId Class ID
   * @param userRole User role for access control
   * @param userId User ID for access control
   * @param userRegionId User region ID (optional)
   * @param userSchoolId User school ID (optional)
   * @returns Response with class schedules
   */
  getByClass: async (
    classId: number, 
    userRole: string, 
    userId: number, 
    userRegionId?: number, 
    userSchoolId?: number
  ): Promise<AxiosResponse<ScheduleResponse>> => {
    const params: any = { userRole, userId };
    if (userRegionId) params.userRegionId = userRegionId;
    if (userSchoolId) params.userSchoolId = userSchoolId;
    
    return api.get(`/schedules/class/${classId}`, { params });
  },

  /**
   * Get schedules by teacher ID
   * @param teacherId Teacher ID
   * @param userRole User role for access control
   * @param userId User ID for access control
   * @param userRegionId User region ID (optional)
   * @param userSchoolId User school ID (optional)
   * @returns Response with teacher schedules
   */
  getByTeacher: async (
    teacherId: number, 
    userRole: string, 
    userId: number, 
    userRegionId?: number, 
    userSchoolId?: number
  ): Promise<AxiosResponse<ScheduleResponse>> => {
    const params: any = { userRole, userId };
    if (userRegionId) params.userRegionId = userRegionId;
    if (userSchoolId) params.userSchoolId = userSchoolId;
    
    return api.get(`/schedules/teacher/${teacherId}`, { params });
  },

  /**
   * Get schedules by day of week
   * @param dayOfWeek Day of week
   * @param userRole User role for access control
   * @param userId User ID for access control
   * @param userRegionId User region ID (optional)
   * @param userSchoolId User school ID (optional)
   * @returns Response with day schedules
   */
  getByDayOfWeek: async (
    dayOfWeek: string, 
    userRole: string, 
    userId: number, 
    userRegionId?: number, 
    userSchoolId?: number
  ): Promise<AxiosResponse<ScheduleResponse>> => {
    const params: any = { userRole, userId };
    if (userRegionId) params.userRegionId = userRegionId;
    if (userSchoolId) params.userSchoolId = userSchoolId;
    
    return api.get(`/schedules/day/${dayOfWeek}`, { params });
  },

  /**
   * Create a new schedule
   * @param scheduleData Schedule data
   * @returns Response with created schedule
   */
  create: async (scheduleData: CreateScheduleRequest): Promise<AxiosResponse<ScheduleResponse>> => {
    return api.post('/schedules/create', scheduleData);
  },

  /**
   * Update an existing schedule
   * @param id Schedule ID
   * @param scheduleData Updated schedule data
   * @returns Response with updated schedule
   */
  update: async (id: number, scheduleData: UpdateScheduleRequest): Promise<AxiosResponse<ScheduleResponse>> => {
    return api.put(`/schedules/${id}/update`, scheduleData);
  },

  /**
   * Delete a schedule
   * @param id Schedule ID
   * @returns Response indicating success/failure
   */
  delete: async (id: number): Promise<AxiosResponse<ScheduleResponse>> => {
    return api.delete(`/schedules/${id}/delete`);
  },

  /**
   * Check for time conflicts
   * @param params Conflict check parameters
   * @returns Response with conflicting schedules
   */
  checkTimeConflicts: async (params: {
    classId?: number;
    teacherId?: number;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    currentDate: string;
    excludeId?: number;
  }): Promise<AxiosResponse<ScheduleResponse>> => {
    return api.get('/schedules/conflicts/check', { params });
  },

  /**
   * Get schedule history
   * @param id Schedule ID
   * @returns Response with schedule history
   */
  getHistory: async (id: number): Promise<AxiosResponse<ScheduleResponse>> => {
    return api.get(`/schedules/${id}/history`);
  },

  /**
   * Update schedule status
   * @param id Schedule ID
   * @param status New status
   * @returns Response with updated schedule
   */
  updateStatus: async (id: number, status: string): Promise<AxiosResponse<ScheduleResponse>> => {
    return api.put(`/schedules/${id}/status`, null, { params: { status } });
  },

  /**
   * Bulk update schedules
   * @param scheduleIds Array of schedule IDs
   * @param updateData Update data
   * @returns Response with updated schedules
   */
  bulkUpdate: async (scheduleIds: number[], updateData: UpdateScheduleRequest): Promise<AxiosResponse<ScheduleResponse>> => {
    return api.put('/schedules/bulk-update', updateData, { params: { scheduleIds } });
  },

  /**
   * Get active schedules for date range
   * @param startDate Start date
   * @param endDate End date
   * @returns Response with schedules in date range
   */
  getActiveSchedulesForDateRange: async (startDate: string, endDate: string): Promise<AxiosResponse<ScheduleResponse>> => {
    return api.get('/schedules/date-range', { params: { startDate, endDate } });
  }
};

export default scheduleApi; 