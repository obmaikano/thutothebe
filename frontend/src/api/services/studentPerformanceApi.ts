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

export interface StudentPerformanceResponse {
  status: string;
  message: string;
  data: StudentPerformance | StudentPerformance[] | null;
  timestamp: string | null;
}

export type CreateStudentPerformanceRequest = Omit<StudentPerformance, 'id' | 'lastUpdated'>;
export type UpdateStudentPerformanceRequest = Partial<StudentPerformance>;

/**
 * API service for interacting with student performance endpoints
 */
const studentPerformanceApi = {
  /**
   * Get all student performance records
   * @returns Response with a list of student performance records
   */
  getAll: async (): Promise<AxiosResponse<StudentPerformanceResponse>> => {
    return api.get('/analytics/student-performance');
  },

  /**
   * Get student performance by ID
   * @param id Student performance ID
   * @returns Response with student performance details
   */
  getById: async (id: number): Promise<AxiosResponse<StudentPerformanceResponse>> => {
    return api.get(`/analytics/student-performance/${id}`);
  },

  /**
   * Get performance for a student in a specific course
   * @param studentId Student ID
   * @param courseId Course ID
   * @returns Response with student performance details
   */
  getStudentPerformance: async (studentId: number, courseId: number): Promise<AxiosResponse<StudentPerformanceResponse>> => {
    return api.get(`/analytics/student-performance/student/${studentId}/course/${courseId}`);
  },

  /**
   * Get performance history for a student
   * @param studentId Student ID
   * @returns Response with student performance history
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
   * Get performance data by date range
   * @param startDate Start date
   * @param endDate End date
   * @returns Response with performance data in date range
   */
  getPerformanceByDateRange: async (startDate: string, endDate: string): Promise<AxiosResponse<StudentPerformanceResponse>> => {
    return api.get(`/analytics/student-performance/date-range?startDate=${startDate}&endDate=${endDate}`);
  },

  /**
   * Update student performance for a specific course
   * @param studentId Student ID
   * @param courseId Course ID
   * @returns Response indicating success/failure
   */
  updateStudentPerformance: async (studentId: number, courseId: number): Promise<AxiosResponse<void>> => {
    return api.post(`/analytics/student-performance/student/${studentId}/course/${courseId}/update`);
  },

  /**
   * Create a new student performance record
   * @param performanceData Student performance data
   * @returns Response with created student performance details
   */
  create: async (performanceData: CreateStudentPerformanceRequest): Promise<AxiosResponse<StudentPerformanceResponse>> => {
    return api.post('/analytics/student-performance', performanceData);
  },

  /**
   * Update an existing student performance record
   * @param id Student performance ID
   * @param performanceData Updated student performance data
   * @returns Response with updated student performance details
   */
  update: async (id: number, performanceData: UpdateStudentPerformanceRequest): Promise<AxiosResponse<StudentPerformanceResponse>> => {
    return api.put(`/analytics/student-performance/${id}`, performanceData);
  },

  /**
   * Delete a student performance record
   * @param id Student performance ID
   * @returns Response indicating success/failure
   */
  delete: async (id: number): Promise<AxiosResponse<StudentPerformanceResponse>> => {
    return api.delete(`/analytics/student-performance/${id}`);
  },
};

export default studentPerformanceApi; 