import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface Lesson {
  id: number;
  title: string;
  description?: string;
  courseId: number;
  courseName?: string;
  instructorId: number;
  instructorName?: string;
  lessonOrder: number;
  durationMinutes?: number;
  estimatedDurationMinutes?: number;
  scheduledDate?: string;
  completedDate?: string;
  status: 'PLANNED' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED';
  objectives?: string;
  materials?: string;
  activities?: string;
  assessment?: string;
  notes?: string;
  isMandatory: boolean;
  prerequisites?: number[];
  learningOutcomes?: string[];
  active: boolean;
  createdAt: string;
  modifiedAt: string;
}

export interface CreateLessonRequest {
  title: string;
  description?: string;
  courseId: number;
  instructorId: number;
  lessonOrder: number;
  durationMinutes?: number;
  estimatedDurationMinutes?: number;
  scheduledDate?: string;
  objectives?: string;
  materials?: string;
  activities?: string;
  assessment?: string;
  notes?: string;
  isMandatory?: boolean;
  prerequisites?: number[];
  learningOutcomes?: string[];
}

export interface UpdateLessonRequest {
  title?: string;
  description?: string;
  lessonOrder?: number;
  durationMinutes?: number;
  estimatedDurationMinutes?: number;
  scheduledDate?: string;
  objectives?: string;
  materials?: string;
  activities?: string;
  assessment?: string;
  notes?: string;
  isMandatory?: boolean;
  prerequisites?: number[];
  learningOutcomes?: string[];
  active?: boolean;
}

export interface LessonResponse {
  status: string;
  message: string;
  data: Lesson;
  errors?: string[];
}

export interface LessonListResponse {
  status: string;
  message: string;
  data: Lesson[];
  errors?: string[];
}

export interface LessonAnalyticsResponse {
  status: string;
  message: string;
  data: {
    totalLessons: number;
    plannedLessons: number;
    scheduledLessons: number;
    inProgressLessons: number;
    completedLessons: number;
    cancelledLessons: number;
    completionRate: number;
  };
  errors?: string[];
}

const lessonApi = {
  /**
   * Get all lessons
   * @returns Response with all lessons
   */
  getAll: async (): Promise<AxiosResponse<LessonListResponse>> => {
    return api.get('/lessons');
  },

  /**
   * Get lesson by ID
   * @param id Lesson ID
   * @returns Response with lesson details
   */
  getById: async (id: number): Promise<AxiosResponse<LessonResponse>> => {
    return api.get(`/lessons/${id}`);
  },

  /**
   * Create a new lesson
   * @param lessonData Lesson data
   * @returns Response with created lesson details
   */
  create: async (lessonData: CreateLessonRequest): Promise<AxiosResponse<LessonResponse>> => {
    return api.post('/lessons', lessonData);
  },

  /**
   * Update lesson
   * @param id Lesson ID
   * @param lessonData Lesson data to update
   * @returns Response with updated lesson details
   */
  update: async (id: number, lessonData: UpdateLessonRequest): Promise<AxiosResponse<LessonResponse>> => {
    return api.put(`/lessons/${id}`, lessonData);
  },

  /**
   * Delete lesson
   * @param id Lesson ID
   * @returns Response with deletion status
   */
  delete: async (id: number): Promise<AxiosResponse<{ status: string; message: string }>> => {
    return api.delete(`/lessons/${id}`);
  },

  /**
   * Get lessons by course ID
   * @param courseId Course ID
   * @returns Response with lessons for the course
   */
  getByCourseId: async (courseId: number): Promise<AxiosResponse<LessonListResponse>> => {
    return api.get(`/lessons/course/${courseId}`);
  },

  /**
   * Get lessons by course ID and active status
   * @param courseId Course ID
   * @param active Active status
   * @returns Response with lessons for the course
   */
  getByCourseIdAndActive: async (courseId: number, active: boolean): Promise<AxiosResponse<LessonListResponse>> => {
    return api.get(`/lessons/course/${courseId}/active/${active}`);
  },

  /**
   * Get lessons by instructor ID
   * @param instructorId Instructor ID
   * @returns Response with lessons for the instructor
   */
  getByInstructorId: async (instructorId: number): Promise<AxiosResponse<LessonListResponse>> => {
    return api.get(`/lessons/instructor/${instructorId}`);
  },

  /**
   * Get lessons by status
   * @param status Lesson status
   * @returns Response with lessons by status
   */
  getByStatus: async (status: Lesson['status']): Promise<AxiosResponse<LessonListResponse>> => {
    return api.get(`/lessons/status/${status}`);
  },

  /**
   * Get lessons by course ID and status
   * @param courseId Course ID
   * @param status Lesson status
   * @returns Response with lessons by course and status
   */
  getByCourseIdAndStatus: async (courseId: number, status: Lesson['status']): Promise<AxiosResponse<LessonListResponse>> => {
    return api.get(`/lessons/course/${courseId}/status/${status}`);
  },

  /**
   * Get lesson by course ID and lesson order
   * @param courseId Course ID
   * @param lessonOrder Lesson order
   * @returns Response with lesson details
   */
  getByCourseIdAndLessonOrder: async (courseId: number, lessonOrder: number): Promise<AxiosResponse<LessonResponse>> => {
    return api.get(`/lessons/course/${courseId}/order/${lessonOrder}`);
  },

  /**
   * Count lessons by course ID
   * @param courseId Course ID
   * @returns Response with lesson count
   */
  countByCourseId: async (courseId: number): Promise<AxiosResponse<{ data: number }>> => {
    return api.get(`/lessons/course/${courseId}/count`);
  },

  /**
   * Count lessons by course ID and status
   * @param courseId Course ID
   * @param status Lesson status
   * @returns Response with lesson count
   */
  countByCourseIdAndStatus: async (courseId: number, status: Lesson['status']): Promise<AxiosResponse<{ data: number }>> => {
    return api.get(`/lessons/course/${courseId}/status/${status}/count`);
  },

  /**
   * Get max lesson order by course ID
   * @param courseId Course ID
   * @returns Response with max lesson order
   */
  getMaxLessonOrderByCourseId: async (courseId: number): Promise<AxiosResponse<{ data: number }>> => {
    return api.get(`/lessons/course/${courseId}/max-order`);
  },

  /**
   * Get lessons by course ID and scheduled date range
   * @param courseId Course ID
   * @param startDate Start date
   * @param endDate End date
   * @returns Response with lessons in date range
   */
  getByCourseIdAndScheduledDateBetween: async (courseId: number, startDate: string, endDate: string): Promise<AxiosResponse<LessonListResponse>> => {
    return api.get(`/lessons/course/${courseId}/scheduled?startDate=${startDate}&endDate=${endDate}`);
  },

  /**
   * Get lessons by instructor ID and scheduled date range
   * @param instructorId Instructor ID
   * @param startDate Start date
   * @param endDate End date
   * @returns Response with lessons in date range
   */
  getByInstructorIdAndScheduledDateBetween: async (instructorId: number, startDate: string, endDate: string): Promise<AxiosResponse<LessonListResponse>> => {
    return api.get(`/lessons/instructor/${instructorId}/scheduled?startDate=${startDate}&endDate=${endDate}`);
  },

  /**
   * Get mandatory lessons by course ID
   * @param courseId Course ID
   * @returns Response with mandatory lessons
   */
  getMandatoryLessonsByCourseId: async (courseId: number): Promise<AxiosResponse<LessonListResponse>> => {
    return api.get(`/lessons/course/${courseId}/mandatory`);
  },

  /**
   * Get completed lessons by course ID
   * @param courseId Course ID
   * @returns Response with completed lessons
   */
  getCompletedLessonsByCourseId: async (courseId: number): Promise<AxiosResponse<LessonListResponse>> => {
    return api.get(`/lessons/course/${courseId}/completed`);
  },

  /**
   * Schedule lesson
   * @param lessonId Lesson ID
   * @param scheduledDate Scheduled date
   * @returns Response with updated lesson
   */
  scheduleLesson: async (lessonId: number, scheduledDate: string): Promise<AxiosResponse<LessonResponse>> => {
    return api.put(`/lessons/${lessonId}/schedule`, { scheduledDate });
  },

  /**
   * Start lesson
   * @param lessonId Lesson ID
   * @returns Response with updated lesson
   */
  startLesson: async (lessonId: number): Promise<AxiosResponse<LessonResponse>> => {
    return api.put(`/lessons/${lessonId}/start`);
  },

  /**
   * Complete lesson
   * @param lessonId Lesson ID
   * @returns Response with updated lesson
   */
  completeLesson: async (lessonId: number): Promise<AxiosResponse<LessonResponse>> => {
    return api.put(`/lessons/${lessonId}/complete`);
  },

  /**
   * Cancel lesson
   * @param lessonId Lesson ID
   * @param reason Cancellation reason
   * @returns Response with updated lesson
   */
  cancelLesson: async (lessonId: number, reason: string): Promise<AxiosResponse<LessonResponse>> => {
    return api.put(`/lessons/${lessonId}/cancel`, { reason });
  },

  /**
   * Postpone lesson
   * @param lessonId Lesson ID
   * @param newScheduledDate New scheduled date
   * @returns Response with updated lesson
   */
  postponeLesson: async (lessonId: number, newScheduledDate: string): Promise<AxiosResponse<LessonResponse>> => {
    return api.put(`/lessons/${lessonId}/postpone`, { newScheduledDate });
  },

  /**
   * Update lesson order
   * @param lessonId Lesson ID
   * @param newOrder New order
   * @returns Response with updated lesson
   */
  updateLessonOrder: async (lessonId: number, newOrder: number): Promise<AxiosResponse<LessonResponse>> => {
    return api.put(`/lessons/${lessonId}/order`, { newOrder });
  },

  /**
   * Reorder lessons
   * @param courseId Course ID
   * @param lessonIds Array of lesson IDs in new order
   * @returns Response with reordered lessons
   */
  reorderLessons: async (courseId: number, lessonIds: number[]): Promise<AxiosResponse<LessonListResponse>> => {
    return api.put(`/lessons/course/${courseId}/reorder`, { lessonIds });
  },

  /**
   * Get lesson analytics
   * @param courseId Course ID
   * @returns Response with lesson analytics
   */
  getLessonAnalytics: async (courseId: number): Promise<AxiosResponse<LessonAnalyticsResponse>> => {
    return api.get(`/lessons/course/${courseId}/analytics`);
  },

  /**
   * Get instructor lesson analytics
   * @param instructorId Instructor ID
   * @param startDate Start date
   * @param endDate End date
   * @returns Response with instructor lesson analytics
   */
  getInstructorLessonAnalytics: async (instructorId: number, startDate: string, endDate: string): Promise<AxiosResponse<LessonAnalyticsResponse>> => {
    return api.get(`/lessons/instructor/${instructorId}/analytics?startDate=${startDate}&endDate=${endDate}`);
  }
};

export default lessonApi; 