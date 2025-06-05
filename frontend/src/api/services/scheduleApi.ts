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
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
  effectiveDate: string;
  expiryDate?: string;
  location?: string;
  type: 'CLASS' | 'LECTURE' | 'TUTORIAL' | 'PRACTICAL' | 'EXAM' | 'ASSESSMENT' | 'MEETING' | 'ASSEMBLY' | 'BREAK' | 'LUNCH' | 'SPORT' | 'EXTRACURRICULAR' | 'MAINTENANCE' | 'HOLIDAY' | 'CUSTOM';
  status: 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | 'RESCHEDULED' | 'PENDING' | 'DRAFT';
  color?: string;
  isRecurring: boolean;
  recurrenceRule?: string;
  courseId?: number;
  courseName?: string;
  classId?: number;
  className?: string;
  schoolId?: number;
  schoolName?: string;
  regionId?: number;
  regionName?: string;
  createdById?: number;
  createdByName?: string;
  teacherId?: number;
  teacherName?: string;
  scheduleVersion?: number;
  parentScheduleId?: number;
  metadata?: string;
  active: boolean;
}

export interface ScheduleHistory {
  id: number;
  scheduleId: number;
  action: 'CREATED' | 'UPDATED' | 'DELETED' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'RESCHEDULED';
  changedById: number;
  changeReason?: string;
  oldValues?: string;
  newValues?: string;
  ipAddress?: string;
  userAgent?: string;
  active: boolean;
  createdAt: string;
}

export interface Timetable {
  id: number;
  name: string;
  description?: string;
  academicYear: number;
  term: string;
  schoolId: number;
  regionId: number;
  classId?: number;
  teacherId?: number;
  isTemplate: boolean;
  isPublished: boolean;
  publishedAt?: string;
  effectiveDate: string;
  expiryDate?: string;
  scheduleCount: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleResponse {
  status: string;
  message: string;
  data: ScheduleData | Schedule[] | Schedule | ClassInfo[] | ClassInfo | ScheduleHistory[] | Timetable[] | Timetable | any | null;
  timestamp: string | null;
}

export type CreateScheduleRequest = Omit<Schedule, 'id' | 'createdById' | 'createdByName' | 'courseName' | 'className' | 'schoolName' | 'regionName' | 'teacherName'>;
export type UpdateScheduleRequest = Partial<CreateScheduleRequest>;

/**
 * API service for interacting with schedule endpoints
 */
const scheduleApi = {
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
   * Get schedules for user based on role and permissions
   * @param userRole User role
   * @param userId User ID
   * @param userRegionId User region ID (optional)
   * @param userSchoolId User school ID (optional)
   * @param page Page number
   * @param size Page size
   * @returns Response with user schedules
   */
  getForUser: async (
    userRole: string, 
    userId: number, 
    userRegionId?: number, 
    userSchoolId?: number, 
    page: number = 0, 
    size: number = 20
  ): Promise<AxiosResponse<ScheduleResponse>> => {
    const params = new URLSearchParams({
      userRole,
      userId: userId.toString(),
      page: page.toString(),
      size: size.toString()
    });
    if (userRegionId) params.append('userRegionId', userRegionId.toString());
    if (userSchoolId) params.append('userSchoolId', userSchoolId.toString());
    return api.get(`/schedules/user?${params}`);
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
    const params = new URLSearchParams({
      userRole,
      userId: userId.toString()
    });
    if (userRegionId) params.append('userRegionId', userRegionId.toString());
    if (userSchoolId) params.append('userSchoolId', userSchoolId.toString());
    return api.get(`/schedules/school/${schoolId}?${params}`);
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
    const params = new URLSearchParams({
      userRole,
      userId: userId.toString()
    });
    if (userRegionId) params.append('userRegionId', userRegionId.toString());
    if (userSchoolId) params.append('userSchoolId', userSchoolId.toString());
    return api.get(`/schedules/class/${classId}?${params}`);
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
    const params = new URLSearchParams({
      userRole,
      userId: userId.toString()
    });
    if (userRegionId) params.append('userRegionId', userRegionId.toString());
    if (userSchoolId) params.append('userSchoolId', userSchoolId.toString());
    return api.get(`/schedules/teacher/${teacherId}?${params}`);
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
    const params = new URLSearchParams({
      userRole,
      userId: userId.toString()
    });
    if (userRegionId) params.append('userRegionId', userRegionId.toString());
    if (userSchoolId) params.append('userSchoolId', userSchoolId.toString());
    return api.get(`/schedules/day/${dayOfWeek}?${params}`);
  },

  /**
   * Get schedules for a student
   * @param studentId Student ID
   * @param userRole User role for access control
   * @param userId User ID for access control
   * @param userRegionId User region ID (optional)
   * @param userSchoolId User school ID (optional)
   * @returns Response with student schedules
   */
  getForStudent: async (
    studentId: number, 
    userRole: string, 
    userId: number, 
    userRegionId?: number, 
    userSchoolId?: number
  ): Promise<AxiosResponse<ScheduleResponse>> => {
    const params = new URLSearchParams({
      userRole,
      userId: userId.toString()
    });
    if (userRegionId) params.append('userRegionId', userRegionId.toString());
    if (userSchoolId) params.append('userSchoolId', userSchoolId.toString());
    return api.get(`/schedules/student/${studentId}?${params}`);
  },

  /**
   * Get next class for a student
   * @param studentId Student ID
   * @param userRole User role for access control
   * @param userId User ID for access control
   * @param userRegionId User region ID (optional)
   * @param userSchoolId User school ID (optional)
   * @returns Response with next class information
   */
  getNextClassForStudent: async (
    studentId: number, 
    userRole: string, 
    userId: number, 
    userRegionId?: number, 
    userSchoolId?: number
  ): Promise<AxiosResponse<ScheduleResponse>> => {
    const params = new URLSearchParams({
      userRole,
      userId: userId.toString()
    });
    if (userRegionId) params.append('userRegionId', userRegionId.toString());
    if (userSchoolId) params.append('userSchoolId', userSchoolId.toString());
    return api.get(`/schedules/student/${studentId}/next-class?${params}`);
  },

  /**
   * Get schedules for a parent's children
   * @param parentId Parent ID
   * @param userRole User role for access control
   * @param userId User ID for access control
   * @param userRegionId User region ID (optional)
   * @param userSchoolId User school ID (optional)
   * @returns Response with parent's children schedules
   */
  getForParent: async (
    parentId: number, 
    userRole: string, 
    userId: number, 
    userRegionId?: number, 
    userSchoolId?: number
  ): Promise<AxiosResponse<ScheduleResponse>> => {
    const params = new URLSearchParams({
      userRole,
      userId: userId.toString()
    });
    if (userRegionId) params.append('userRegionId', userRegionId.toString());
    if (userSchoolId) params.append('userSchoolId', userSchoolId.toString());
    return api.get(`/schedules/parent/${parentId}?${params}`);
  },

  /**
   * Get active schedules for date range
   * @param startDate Start date
   * @param endDate End date
   * @param userRole User role for access control
   * @param userId User ID for access control
   * @param userRegionId User region ID (optional)
   * @param userSchoolId User school ID (optional)
   * @returns Response with schedules in date range
   */
  getActiveForDateRange: async (
    startDate: string, 
    endDate: string, 
    userRole: string, 
    userId: number, 
    userRegionId?: number, 
    userSchoolId?: number
  ): Promise<AxiosResponse<ScheduleResponse>> => {
    const params = new URLSearchParams({
      startDate,
      endDate,
      userRole,
      userId: userId.toString()
    });
    if (userRegionId) params.append('userRegionId', userRegionId.toString());
    if (userSchoolId) params.append('userSchoolId', userSchoolId.toString());
    return api.get(`/schedules/date-range?${params}`);
  },

  /**
   * Check for time conflicts
   * @param classId Class ID (optional)
   * @param teacherId Teacher ID (optional)
   * @param dayOfWeek Day of week (optional)
   * @param startTime Start time (optional)
   * @param endTime End time (optional)
   * @param currentDate Current date (optional)
   * @param excludeId Schedule ID to exclude (optional)
   * @returns Response with conflicting schedules
   */
  checkConflicts: async (
    classId?: number,
    teacherId?: number,
    dayOfWeek?: string,
    startTime?: string,
    endTime?: string,
    currentDate?: string,
    excludeId?: number
  ): Promise<AxiosResponse<ScheduleResponse>> => {
    const params = new URLSearchParams();
    if (classId) params.append('classId', classId.toString());
    if (teacherId) params.append('teacherId', teacherId.toString());
    if (dayOfWeek) params.append('dayOfWeek', dayOfWeek);
    if (startTime) params.append('startTime', startTime);
    if (endTime) params.append('endTime', endTime);
    if (currentDate) params.append('currentDate', currentDate);
    if (excludeId) params.append('excludeId', excludeId.toString());
    return api.get(`/schedules/conflicts/check?${params}`);
  },

  /**
   * Create a new schedule
   * @param scheduleData Schedule data
   * @param userRole User role for access control
   * @param userId User ID for access control
   * @param userRegionId User region ID (optional)
   * @param userSchoolId User school ID (optional)
   * @returns Response with created schedule
   */
  create: async (
    scheduleData: CreateScheduleRequest, 
    userRole: string, 
    userId: number, 
    userRegionId?: number, 
    userSchoolId?: number
  ): Promise<AxiosResponse<ScheduleResponse>> => {
    const params = new URLSearchParams({
      userRole,
      userId: userId.toString()
    });
    if (userRegionId) params.append('userRegionId', userRegionId.toString());
    if (userSchoolId) params.append('userSchoolId', userSchoolId.toString());
    return api.post(`/schedules/create?${params}`, scheduleData);
  },

  /**
   * Update an existing schedule
   * @param id Schedule ID
   * @param scheduleData Updated schedule data
   * @param userRole User role for access control
   * @param userId User ID for access control
   * @param userRegionId User region ID (optional)
   * @param userSchoolId User school ID (optional)
   * @returns Response with updated schedule
   */
  update: async (
    id: number, 
    scheduleData: UpdateScheduleRequest, 
    userRole: string, 
    userId: number, 
    userRegionId?: number, 
    userSchoolId?: number
  ): Promise<AxiosResponse<ScheduleResponse>> => {
    const params = new URLSearchParams({
      userRole,
      userId: userId.toString()
    });
    if (userRegionId) params.append('userRegionId', userRegionId.toString());
    if (userSchoolId) params.append('userSchoolId', userSchoolId.toString());
    return api.put(`/schedules/${id}/update?${params}`, scheduleData);
  },

  /**
   * Delete a schedule
   * @param id Schedule ID
   * @param userRole User role for access control
   * @param userId User ID for access control
   * @param userRegionId User region ID (optional)
   * @param userSchoolId User school ID (optional)
   * @param reason Deletion reason (optional)
   * @returns Response indicating success/failure
   */
  delete: async (
    id: number, 
    userRole: string, 
    userId: number, 
    userRegionId?: number, 
    userSchoolId?: number, 
    reason?: string
  ): Promise<AxiosResponse<ScheduleResponse>> => {
    const params = new URLSearchParams({
      userRole,
      userId: userId.toString()
    });
    if (userRegionId) params.append('userRegionId', userRegionId.toString());
    if (userSchoolId) params.append('userSchoolId', userSchoolId.toString());
    if (reason) params.append('reason', reason);
    return api.delete(`/schedules/${id}/delete?${params}`);
  },

  /**
   * Update schedule status
   * @param id Schedule ID
   * @param status New status
   * @param userRole User role for access control
   * @param userId User ID for access control
   * @param userRegionId User region ID (optional)
   * @param userSchoolId User school ID (optional)
   * @param reason Status change reason (optional)
   * @returns Response with updated schedule
   */
  updateStatus: async (
    id: number, 
    status: string, 
    userRole: string, 
    userId: number, 
    userRegionId?: number, 
    userSchoolId?: number, 
    reason?: string
  ): Promise<AxiosResponse<ScheduleResponse>> => {
    const params = new URLSearchParams({
      status,
      userRole,
      userId: userId.toString()
    });
    if (userRegionId) params.append('userRegionId', userRegionId.toString());
    if (userSchoolId) params.append('userSchoolId', userSchoolId.toString());
    if (reason) params.append('reason', reason);
    return api.put(`/schedules/${id}/status?${params}`);
  },

  /**
   * Bulk update schedules
   * @param scheduleIds Array of schedule IDs
   * @param updateData Update data
   * @param userRole User role for access control
   * @param userId User ID for access control
   * @param userRegionId User region ID (optional)
   * @param userSchoolId User school ID (optional)
   * @param reason Update reason (optional)
   * @returns Response with updated schedules
   */
  bulkUpdate: async (
    scheduleIds: number[], 
    updateData: any, 
    userRole: string, 
    userId: number, 
    userRegionId?: number, 
    userSchoolId?: number, 
    reason?: string
  ): Promise<AxiosResponse<ScheduleResponse>> => {
    const params = new URLSearchParams({
      scheduleIds: scheduleIds.join(','),
      userRole,
      userId: userId.toString()
    });
    if (userRegionId) params.append('userRegionId', userRegionId.toString());
    if (userSchoolId) params.append('userSchoolId', userSchoolId.toString());
    if (reason) params.append('reason', reason);
    return api.put(`/schedules/bulk-update?${params}`, updateData);
  },

  /**
   * Get schedule history
   * @param id Schedule ID
   * @param userRole User role for access control
   * @param userId User ID for access control
   * @param userRegionId User region ID (optional)
   * @param userSchoolId User school ID (optional)
   * @returns Response with schedule history
   */
  getHistory: async (
    id: number, 
    userRole: string, 
    userId: number, 
    userRegionId?: number, 
    userSchoolId?: number
  ): Promise<AxiosResponse<ScheduleResponse>> => {
    const params = new URLSearchParams({
      userRole,
      userId: userId.toString()
    });
    if (userRegionId) params.append('userRegionId', userRegionId.toString());
    if (userSchoolId) params.append('userSchoolId', userSchoolId.toString());
    return api.get(`/schedules/${id}/history?${params}`);
  },

  /**
   * Get schedule version history
   * @param parentId Parent schedule ID
   * @param userRole User role for access control
   * @param userId User ID for access control
   * @param userRegionId User region ID (optional)
   * @param userSchoolId User school ID (optional)
   * @returns Response with version history
   */
  getVersionHistory: async (
    parentId: number, 
    userRole: string, 
    userId: number, 
    userRegionId?: number, 
    userSchoolId?: number
  ): Promise<AxiosResponse<ScheduleResponse>> => {
    const params = new URLSearchParams({
      userRole,
      userId: userId.toString()
    });
    if (userRegionId) params.append('userRegionId', userRegionId.toString());
    if (userSchoolId) params.append('userSchoolId', userSchoolId.toString());
    return api.get(`/schedules/${parentId}/versions?${params}`);
  },

  /**
   * Rollback to previous version
   * @param id Schedule ID
   * @param version Version number
   * @param userRole User role for access control
   * @param userId User ID for access control
   * @param userRegionId User region ID (optional)
   * @param userSchoolId User school ID (optional)
   * @param reason Rollback reason (optional)
   * @returns Response with rolled back schedule
   */
  rollbackToVersion: async (
    id: number, 
    version: number, 
    userRole: string, 
    userId: number, 
    userRegionId?: number, 
    userSchoolId?: number, 
    reason?: string
  ): Promise<AxiosResponse<ScheduleResponse>> => {
    const params = new URLSearchParams({
      userRole,
      userId: userId.toString()
    });
    if (userRegionId) params.append('userRegionId', userRegionId.toString());
    if (userSchoolId) params.append('userSchoolId', userSchoolId.toString());
    if (reason) params.append('reason', reason);
    return api.post(`/schedules/${id}/rollback/${version}?${params}`);
  },

  // Legacy methods for backward compatibility
  /**
   * Get schedule for a student (legacy)
   * @param studentId Student ID
   * @returns Response with student's schedule
   */
  getStudentSchedule: async (studentId: number): Promise<AxiosResponse<ScheduleResponse>> => {
    return api.get(`/schedules/student/${studentId}`);
  },

  /**
   * Get today's schedule for a student (legacy)
   * @param studentId Student ID
   * @returns Response with today's classes
   */
  getTodaySchedule: async (studentId: number): Promise<AxiosResponse<ScheduleResponse>> => {
    return api.get(`/schedules/student/${studentId}/today`);
  },

  /**
   * Get next class for a student (legacy)
   * @param studentId Student ID
   * @returns Response with next class information
   */
  getNextClass: async (studentId: number): Promise<AxiosResponse<ScheduleResponse>> => {
    return api.get(`/schedules/student/${studentId}/next-class`);
  },

  /**
   * Get timetable for a class (legacy)
   * @param classId Class ID
   * @returns Response with class timetable
   */
  getClassTimetable: async (classId: number): Promise<AxiosResponse<ScheduleResponse>> => {
    return api.get(`/schedules/class/${classId}/timetable`);
  },

  /**
   * Check time conflicts (legacy)
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
    return scheduleApi.checkConflicts(
      params.classId,
      params.teacherId,
      params.dayOfWeek,
      params.startTime,
      params.endTime,
      params.currentDate,
      params.excludeId
    );
  }
};

export default scheduleApi; 