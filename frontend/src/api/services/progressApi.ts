import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface Progress {
  id: number;
  studentId: number;
  courseId: number;
  completionPercentage: number;
  grade: number;
  completed: boolean;
  active: boolean;
  lastActivityAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProgressResponse {
  status: string;
  message: string;
  data: Progress | Progress[] | null;
  timestamp: string | null;
}

export type CreateProgressRequest = Omit<Progress, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateProgressRequest = Partial<Progress>;

/**
 * API service for interacting with progress endpoints
 */
const progressApi = {
  /**
   * Get all progress records
   * @returns Response with a list of progress records
   */
  getAll: async (): Promise<AxiosResponse<ProgressResponse>> => {
    return api.get('/progress');
  },

  /**
   * Get progress by ID
   * @param id Progress ID
   * @returns Response with progress details
   */
  getById: async (id: number): Promise<AxiosResponse<ProgressResponse>> => {
    return api.get(`/progress/${id}`);
  },

  /**
   * Get progress records by student
   * @param studentId Student ID
   * @returns Response with student's progress records
   */
  getByStudent: async (studentId: number): Promise<AxiosResponse<ProgressResponse>> => {
    return api.get(`/progress/student/${studentId}`);
  },

  /**
   * Get progress records by course
   * @param courseId Course ID
   * @returns Response with course progress records
   */
  getByCourse: async (courseId: number): Promise<AxiosResponse<ProgressResponse>> => {
    return api.get(`/progress/course/${courseId}`);
  },

  /**
   * Get progress for a student in a specific course
   * @param studentId Student ID
   * @param courseId Course ID
   * @returns Response with progress details
   */
  getByStudentAndCourse: async (studentId: number, courseId: number): Promise<AxiosResponse<ProgressResponse>> => {
    return api.get(`/progress/student/${studentId}/course/${courseId}`);
  },

  /**
   * Get active progress records by student
   * @param studentId Student ID
   * @returns Response with active progress records
   */
  getActiveByStudent: async (studentId: number): Promise<AxiosResponse<ProgressResponse>> => {
    return api.get(`/progress/student/${studentId}/active`);
  },

  /**
   * Get active progress records by course
   * @param courseId Course ID
   * @returns Response with active progress records
   */
  getActiveByCourse: async (courseId: number): Promise<AxiosResponse<ProgressResponse>> => {
    return api.get(`/progress/course/${courseId}/active`);
  },

  /**
   * Get completed progress records by student
   * @param studentId Student ID
   * @returns Response with completed progress records
   */
  getCompletedByStudent: async (studentId: number): Promise<AxiosResponse<ProgressResponse>> => {
    return api.get(`/progress/student/${studentId}/completed`);
  },

  /**
   * Get completed progress records by course
   * @param courseId Course ID
   * @returns Response with completed progress records
   */
  getCompletedByCourse: async (courseId: number): Promise<AxiosResponse<ProgressResponse>> => {
    return api.get(`/progress/course/${courseId}/completed`);
  },

  /**
   * Get average grade by course
   * @param courseId Course ID
   * @returns Response with average grade
   */
  getAverageGradeByCourse: async (courseId: number): Promise<AxiosResponse<{ data: number }>> => {
    return api.get(`/progress/course/${courseId}/average-grade`);
  },

  /**
   * Get average completion percentage by course
   * @param courseId Course ID
   * @returns Response with average completion percentage
   */
  getAverageCompletionByCourse: async (courseId: number): Promise<AxiosResponse<{ data: number }>> => {
    return api.get(`/progress/course/${courseId}/average-completion`);
  },

  /**
   * Update progress for a student in a course
   * @param studentId Student ID
   * @param courseId Course ID
   * @param completionPercentage Completion percentage
   * @param grade Grade
   * @returns Response with updated progress
   */
  updateProgress: async (studentId: number, courseId: number, completionPercentage: number, grade: number): Promise<AxiosResponse<ProgressResponse>> => {
    return api.put(`/progress/student/${studentId}/course/${courseId}?completionPercentage=${completionPercentage}&grade=${grade}`);
  },

  /**
   * Create a new progress record
   * @param progressData Progress data
   * @returns Response with created progress details
   */
  create: async (progressData: CreateProgressRequest): Promise<AxiosResponse<ProgressResponse>> => {
    return api.post('/progress', progressData);
  },

  /**
   * Update an existing progress record
   * @param id Progress ID
   * @param progressData Updated progress data
   * @returns Response with updated progress details
   */
  update: async (id: number, progressData: UpdateProgressRequest): Promise<AxiosResponse<ProgressResponse>> => {
    return api.put(`/progress/${id}`, progressData);
  },

  /**
   * Delete a progress record
   * @param id Progress ID
   * @returns Response indicating success/failure
   */
  delete: async (id: number): Promise<AxiosResponse<ProgressResponse>> => {
    return api.delete(`/progress/${id}`);
  },
};

export default progressApi; 