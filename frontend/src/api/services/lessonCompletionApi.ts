import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface LessonCompletion {
  id: number;
  lessonId: number;
  lessonTitle?: string;
  studentId: number;
  studentName?: string;
  completedDate: string;
  completionTimeMinutes?: number;
  score?: number;
  maxScore?: number;
  percentage?: number;
  feedback?: string;
  notes?: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'PENDING_REVIEW';
  assessmentResults?: string;
  timeSpentMinutes?: number;
  attemptsCount?: number;
  lastAttemptDate?: string;
  instructorFeedback?: string;
  studentFeedback?: string;
  active: boolean;
  createdAt: string;
  modifiedAt: string;
}

export interface CreateLessonCompletionRequest {
  lessonId: number;
  studentId: number;
  completionTimeMinutes?: number;
  score?: number;
  maxScore?: number;
  feedback?: string;
  notes?: string;
  assessmentResults?: string;
  timeSpentMinutes?: number;
  attemptsCount?: number;
  instructorFeedback?: string;
  studentFeedback?: string;
}

export interface UpdateLessonCompletionRequest {
  completionTimeMinutes?: number;
  score?: number;
  maxScore?: number;
  feedback?: string;
  notes?: string;
  status?: LessonCompletion['status'];
  assessmentResults?: string;
  timeSpentMinutes?: number;
  attemptsCount?: number;
  instructorFeedback?: string;
  studentFeedback?: string;
  active?: boolean;
}

export interface LessonCompletionResponse {
  status: string;
  message: string;
  data: LessonCompletion;
  errors?: string[];
}

export interface LessonCompletionListResponse {
  status: string;
  message: string;
  data: LessonCompletion[];
  errors?: string[];
}

export interface LessonCompletionAnalyticsResponse {
  status: string;
  message: string;
  data: {
    totalCompletions: number;
    completedCompletions: number;
    inProgressCompletions: number;
    failedCompletions: number;
    pendingReviewCompletions: number;
    averageScore: number;
    averageCompletionTime: number;
    completionRate: number;
  };
  errors?: string[];
}

const lessonCompletionApi = {
  /**
   * Get all lesson completions
   * @returns Response with all lesson completions
   */
  getAll: async (): Promise<AxiosResponse<LessonCompletionListResponse>> => {
    return api.get('/lesson-completions');
  },

  /**
   * Get lesson completion by ID
   * @param id Lesson completion ID
   * @returns Response with lesson completion details
   */
  getById: async (id: number): Promise<AxiosResponse<LessonCompletionResponse>> => {
    return api.get(`/lesson-completions/${id}`);
  },

  /**
   * Create a new lesson completion
   * @param completionData Lesson completion data
   * @returns Response with created lesson completion details
   */
  create: async (completionData: CreateLessonCompletionRequest): Promise<AxiosResponse<LessonCompletionResponse>> => {
    return api.post('/lesson-completions', completionData);
  },

  /**
   * Update lesson completion
   * @param id Lesson completion ID
   * @param completionData Lesson completion data to update
   * @returns Response with updated lesson completion details
   */
  update: async (id: number, completionData: UpdateLessonCompletionRequest): Promise<AxiosResponse<LessonCompletionResponse>> => {
    return api.put(`/lesson-completions/${id}`, completionData);
  },

  /**
   * Delete lesson completion
   * @param id Lesson completion ID
   * @returns Response with deletion status
   */
  delete: async (id: number): Promise<AxiosResponse<{ status: string; message: string }>> => {
    return api.delete(`/lesson-completions/${id}`);
  },

  /**
   * Get lesson completions by lesson ID
   * @param lessonId Lesson ID
   * @returns Response with lesson completions for the lesson
   */
  getByLessonId: async (lessonId: number): Promise<AxiosResponse<LessonCompletionListResponse>> => {
    return api.get(`/lesson-completions/lesson/${lessonId}`);
  },

  /**
   * Get lesson completions by student ID
   * @param studentId Student ID
   * @returns Response with lesson completions for the student
   */
  getByStudentId: async (studentId: number): Promise<AxiosResponse<LessonCompletionListResponse>> => {
    return api.get(`/lesson-completions/student/${studentId}`);
  },

  /**
   * Get lesson completion by lesson ID and student ID
   * @param lessonId Lesson ID
   * @param studentId Student ID
   * @returns Response with lesson completion details
   */
  getByLessonIdAndStudentId: async (lessonId: number, studentId: number): Promise<AxiosResponse<LessonCompletionResponse>> => {
    return api.get(`/lesson-completions/lesson/${lessonId}/student/${studentId}`);
  },

  /**
   * Get lesson completions by status
   * @param status Lesson completion status
   * @returns Response with lesson completions by status
   */
  getByStatus: async (status: LessonCompletion['status']): Promise<AxiosResponse<LessonCompletionListResponse>> => {
    return api.get(`/lesson-completions/status/${status}`);
  },

  /**
   * Get lesson completions by lesson ID and status
   * @param lessonId Lesson ID
   * @param status Lesson completion status
   * @returns Response with lesson completions by lesson and status
   */
  getByLessonIdAndStatus: async (lessonId: number, status: LessonCompletion['status']): Promise<AxiosResponse<LessonCompletionListResponse>> => {
    return api.get(`/lesson-completions/lesson/${lessonId}/status/${status}`);
  },

  /**
   * Get lesson completions by student ID and status
   * @param studentId Student ID
   * @param status Lesson completion status
   * @returns Response with lesson completions by student and status
   */
  getByStudentIdAndStatus: async (studentId: number, status: LessonCompletion['status']): Promise<AxiosResponse<LessonCompletionListResponse>> => {
    return api.get(`/lesson-completions/student/${studentId}/status/${status}`);
  },

  /**
   * Count lesson completions by lesson ID
   * @param lessonId Lesson ID
   * @returns Response with lesson completion count
   */
  countByLessonId: async (lessonId: number): Promise<AxiosResponse<{ data: number }>> => {
    return api.get(`/lesson-completions/lesson/${lessonId}/count`);
  },

  /**
   * Count lesson completions by lesson ID and status
   * @param lessonId Lesson ID
   * @param status Lesson completion status
   * @returns Response with lesson completion count
   */
  countByLessonIdAndStatus: async (lessonId: number, status: LessonCompletion['status']): Promise<AxiosResponse<{ data: number }>> => {
    return api.get(`/lesson-completions/lesson/${lessonId}/status/${status}/count`);
  },

  /**
   * Count lesson completions by student ID
   * @param studentId Student ID
   * @returns Response with lesson completion count
   */
  countByStudentId: async (studentId: number): Promise<AxiosResponse<{ data: number }>> => {
    return api.get(`/lesson-completions/student/${studentId}/count`);
  },

  /**
   * Count lesson completions by student ID and status
   * @param studentId Student ID
   * @param status Lesson completion status
   * @returns Response with lesson completion count
   */
  countByStudentIdAndStatus: async (studentId: number, status: LessonCompletion['status']): Promise<AxiosResponse<{ data: number }>> => {
    return api.get(`/lesson-completions/student/${studentId}/status/${status}/count`);
  },

  /**
   * Get lesson completions by completion date range
   * @param startDate Start date
   * @param endDate End date
   * @returns Response with lesson completions in date range
   */
  getByCompletionDateBetween: async (startDate: string, endDate: string): Promise<AxiosResponse<LessonCompletionListResponse>> => {
    return api.get(`/lesson-completions/completed?startDate=${startDate}&endDate=${endDate}`);
  },

  /**
   * Get lesson completions by lesson ID and completion date range
   * @param lessonId Lesson ID
   * @param startDate Start date
   * @param endDate End date
   * @returns Response with lesson completions in date range
   */
  getByLessonIdAndCompletionDateBetween: async (lessonId: number, startDate: string, endDate: string): Promise<AxiosResponse<LessonCompletionListResponse>> => {
    return api.get(`/lesson-completions/lesson/${lessonId}/completed?startDate=${startDate}&endDate=${endDate}`);
  },

  /**
   * Get lesson completions by student ID and completion date range
   * @param studentId Student ID
   * @param startDate Start date
   * @param endDate End date
   * @returns Response with lesson completions in date range
   */
  getByStudentIdAndCompletionDateBetween: async (studentId: number, startDate: string, endDate: string): Promise<AxiosResponse<LessonCompletionListResponse>> => {
    return api.get(`/lesson-completions/student/${studentId}/completed?startDate=${startDate}&endDate=${endDate}`);
  },

  /**
   * Get completed lesson completions by lesson ID
   * @param lessonId Lesson ID
   * @returns Response with completed lesson completions
   */
  getCompletedByLessonId: async (lessonId: number): Promise<AxiosResponse<LessonCompletionListResponse>> => {
    return api.get(`/lesson-completions/lesson/${lessonId}/completed`);
  },

  /**
   * Get completed lesson completions by student ID
   * @param studentId Student ID
   * @returns Response with completed lesson completions
   */
  getCompletedByStudentId: async (studentId: number): Promise<AxiosResponse<LessonCompletionListResponse>> => {
    return api.get(`/lesson-completions/student/${studentId}/completed`);
  },

  /**
   * Get lesson completions with scores above threshold
   * @param lessonId Lesson ID
   * @param minScore Minimum score
   * @returns Response with lesson completions above score threshold
   */
  getByLessonIdAndScoreAbove: async (lessonId: number, minScore: number): Promise<AxiosResponse<LessonCompletionListResponse>> => {
    return api.get(`/lesson-completions/lesson/${lessonId}/score-above/${minScore}`);
  },

  /**
   * Get lesson completions with scores below threshold
   * @param lessonId Lesson ID
   * @param maxScore Maximum score
   * @returns Response with lesson completions below score threshold
   */
  getByLessonIdAndScoreBelow: async (lessonId: number, maxScore: number): Promise<AxiosResponse<LessonCompletionListResponse>> => {
    return api.get(`/lesson-completions/lesson/${lessonId}/score-below/${maxScore}`);
  },

  /**
   * Get lesson completions by score range
   * @param lessonId Lesson ID
   * @param minScore Minimum score
   * @param maxScore Maximum score
   * @returns Response with lesson completions in score range
   */
  getByLessonIdAndScoreBetween: async (lessonId: number, minScore: number, maxScore: number): Promise<AxiosResponse<LessonCompletionListResponse>> => {
    return api.get(`/lesson-completions/lesson/${lessonId}/score-between?minScore=${minScore}&maxScore=${maxScore}`);
  },

  /**
   * Start lesson completion
   * @param lessonId Lesson ID
   * @param studentId Student ID
   * @returns Response with started lesson completion
   */
  startCompletion: async (lessonId: number, studentId: number): Promise<AxiosResponse<LessonCompletionResponse>> => {
    return api.post(`/lesson-completions/lesson/${lessonId}/student/${studentId}/start`);
  },

  /**
   * Complete lesson completion
   * @param completionId Lesson completion ID
   * @param score Score achieved
   * @param maxScore Maximum possible score
   * @param feedback Optional feedback
   * @returns Response with completed lesson completion
   */
  completeCompletion: async (completionId: number, score: number, maxScore: number, feedback?: string): Promise<AxiosResponse<LessonCompletionResponse>> => {
    return api.put(`/lesson-completions/${completionId}/complete`, { score, maxScore, feedback });
  },

  /**
   * Fail lesson completion
   * @param completionId Lesson completion ID
   * @param feedback Optional feedback
   * @returns Response with failed lesson completion
   */
  failCompletion: async (completionId: number, feedback?: string): Promise<AxiosResponse<LessonCompletionResponse>> => {
    return api.put(`/lesson-completions/${completionId}/fail`, { feedback });
  },

  /**
   * Mark lesson completion for review
   * @param completionId Lesson completion ID
   * @param feedback Optional feedback
   * @returns Response with lesson completion marked for review
   */
  markForReview: async (completionId: number, feedback?: string): Promise<AxiosResponse<LessonCompletionResponse>> => {
    return api.put(`/lesson-completions/${completionId}/review`, { feedback });
  },

  /**
   * Update instructor feedback
   * @param completionId Lesson completion ID
   * @param instructorFeedback Instructor feedback
   * @returns Response with updated lesson completion
   */
  updateInstructorFeedback: async (completionId: number, instructorFeedback: string): Promise<AxiosResponse<LessonCompletionResponse>> => {
    return api.put(`/lesson-completions/${completionId}/instructor-feedback`, { instructorFeedback });
  },

  /**
   * Update student feedback
   * @param completionId Lesson completion ID
   * @param studentFeedback Student feedback
   * @returns Response with updated lesson completion
   */
  updateStudentFeedback: async (completionId: number, studentFeedback: string): Promise<AxiosResponse<LessonCompletionResponse>> => {
    return api.put(`/lesson-completions/${completionId}/student-feedback`, { studentFeedback });
  },

  /**
   * Get lesson completion analytics
   * @param lessonId Lesson ID
   * @returns Response with lesson completion analytics
   */
  getLessonCompletionAnalytics: async (lessonId: number): Promise<AxiosResponse<LessonCompletionAnalyticsResponse>> => {
    return api.get(`/lesson-completions/lesson/${lessonId}/analytics`);
  },

  /**
   * Get student lesson completion analytics
   * @param studentId Student ID
   * @param startDate Start date
   * @param endDate End date
   * @returns Response with student lesson completion analytics
   */
  getStudentLessonCompletionAnalytics: async (studentId: number, startDate: string, endDate: string): Promise<AxiosResponse<LessonCompletionAnalyticsResponse>> => {
    return api.get(`/lesson-completions/student/${studentId}/analytics?startDate=${startDate}&endDate=${endDate}`);
  },

  /**
   * Get course lesson completion analytics
   * @param courseId Course ID
   * @returns Response with course lesson completion analytics
   */
  getCourseLessonCompletionAnalytics: async (courseId: number): Promise<AxiosResponse<LessonCompletionAnalyticsResponse>> => {
    return api.get(`/lesson-completions/course/${courseId}/analytics`);
  }
};

export default lessonCompletionApi; 