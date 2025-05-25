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

export interface ScheduleResponse {
  status: string;
  message: string;
  data: ScheduleData | ClassInfo[] | ClassInfo | any | null;
  timestamp: string | null;
}

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
  }
};

export default scheduleApi; 