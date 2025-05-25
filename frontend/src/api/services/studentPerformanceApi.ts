import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface StudentPerformance {
  id: number;
  studentId: number;
  courseId: number;
  averageGrade: number;
  totalSubmissions: number;
  forumPosts: number;
  loginCount: number;
  timeSpentMinutes: number;
  lastUpdated: string;
}

export interface CreateStudentPerformanceRequest {
  studentId: number;
  courseId: number;
  averageGrade: number;
  totalSubmissions: number;
  forumPosts: number;
  loginCount: number;
  timeSpentMinutes: number;
}

export interface UpdateStudentPerformanceRequest {
  averageGrade?: number;
  totalSubmissions?: number;
  forumPosts?: number;
  loginCount?: number;
  timeSpentMinutes?: number;
}

export interface StudentPerformanceResponse {
  status: string;
  message: string;
  data: StudentPerformance | StudentPerformance[] | number;
}

/**
 * API service for interacting with student performance endpoints
 */
const studentPerformanceApi = {
  /**
   * Get all student performance records
   * @returns Response with a list of performance records
   */
  getAll: async (): Promise<AxiosResponse<StudentPerformanceResponse>> => {
    return api.get('/analytics/student-performance');
  },

  /**
   * Get student performance by ID
   * @param id Performance record ID
   * @returns Response with performance details
   */
  getById: async (id: number): Promise<AxiosResponse<StudentPerformanceResponse>> => {
    return api.get(`/analytics/student-performance/${id}`);
  },

  /**
   * Get performance for a student in a specific course
   * @param studentId Student ID
   * @param courseId Course ID
   * @returns Response with performance details
   */
  getStudentPerformance: async (studentId: number, courseId: number): Promise<AxiosResponse<StudentPerformanceResponse>> => {
    return api.get(`/analytics/student-performance/student/${studentId}/course/${courseId}`);
  },

  /**
   * Get performance history for a student
   * @param studentId Student ID
   * @returns Response with student's performance history
   */
  getStudentPerformanceHistory: async (studentId: number): Promise<AxiosResponse<StudentPerformanceResponse>> => {
    return api.get(`/analytics/student-performance/student/${studentId}/history`);
  },

  /**
   * Get performance for all students in a course
   * @param courseId Course ID
   * @returns Response with course performance data
   */
  getCoursePerformance: async (courseId: number): Promise<AxiosResponse<StudentPerformanceResponse>> => {
    return api.get(`/analytics/student-performance/course/${courseId}`);
  },

  /**
   * Get performance by date range
   * @param startDate Start date in ISO format
   * @param endDate End date in ISO format
   * @returns Response with performance data in date range
   */
  getPerformanceByDateRange: async (startDate: string, endDate: string): Promise<AxiosResponse<StudentPerformanceResponse>> => {
    return api.get('/analytics/student-performance/date-range', {
      params: { startDate, endDate }
    });
  },

  /**
   * Create a new student performance record
   * @param performanceData Performance data
   * @returns Response with created performance details
   */
  create: async (performanceData: CreateStudentPerformanceRequest): Promise<AxiosResponse<StudentPerformanceResponse>> => {
    return api.post('/analytics/student-performance', performanceData);
  },

  /**
   * Update an existing student performance record
   * @param id Performance record ID
   * @param performanceData Updated performance data
   * @returns Response with updated performance details
   */
  update: async (id: number, performanceData: UpdateStudentPerformanceRequest): Promise<AxiosResponse<StudentPerformanceResponse>> => {
    return api.put(`/analytics/student-performance/${id}`, performanceData);
  },

  /**
   * Delete a student performance record
   * @param id Performance record ID
   * @returns Response indicating success/failure
   */
  delete: async (id: number): Promise<AxiosResponse<StudentPerformanceResponse>> => {
    return api.delete(`/analytics/student-performance/${id}`);
  }
};

export default studentPerformanceApi; 