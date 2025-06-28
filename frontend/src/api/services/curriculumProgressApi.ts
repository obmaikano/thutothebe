import { api } from '../index';
import { AxiosResponse } from 'axios';

// ==================== INTERFACES ====================

export interface CurriculumProgress {
  id: number;
  studentId: number;
  studentName?: string;
  courseId: number;
  courseName?: string;
  curriculumId: number;
  curriculumName?: string;
  progressPercentage: number;
  completedLessons: number;
  totalLessons: number;
  completedAssessments: number;
  totalAssessments: number;
  averageScore: number;
  lastActivityDate?: string;
  startDate: string;
  expectedCompletionDate?: string;
  actualCompletionDate?: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'PAUSED' | 'DROPPED';
  notes?: string;
  active: boolean;
  createdAt: string;
  modifiedAt: string;
}

export interface CreateCurriculumProgressRequest {
  studentId: number;
  courseId: number;
  curriculumId: number;
  startDate: string;
  expectedCompletionDate?: string;
  notes?: string;
}

export interface UpdateCurriculumProgressRequest {
  progressPercentage?: number;
  completedLessons?: number;
  totalLessons?: number;
  completedAssessments?: number;
  totalAssessments?: number;
  averageScore?: number;
  lastActivityDate?: string;
  expectedCompletionDate?: string;
  actualCompletionDate?: string;
  status?: CurriculumProgress['status'];
  notes?: string;
  active?: boolean;
}

export interface CurriculumProgressResponse {
  status: string;
  message: string;
  data: CurriculumProgress;
  errors?: string[];
}

export interface CurriculumProgressListResponse {
  status: string;
  message: string;
  data: CurriculumProgress[];
  errors?: string[];
}

export interface CurriculumProgressAnalyticsResponse {
  status: string;
  message: string;
  data: {
    totalProgress: number;
    notStartedProgress: number;
    inProgressProgress: number;
    completedProgress: number;
    pausedProgress: number;
    droppedProgress: number;
    averageProgressPercentage: number;
    averageCompletionTime: number;
    completionRate: number;
  };
  errors?: string[];
}

// ==================== API SERVICE ====================

const curriculumProgressApi = {
  /**
   * Get all curriculum progress
   * @returns Response with all curriculum progress
   */
  getAll: async (): Promise<AxiosResponse<CurriculumProgressListResponse>> => {
    return api.get('/curriculum-progress');
  },

  /**
   * Get curriculum progress by ID
   * @param id Curriculum progress ID
   * @returns Response with curriculum progress details
   */
  getById: async (id: number): Promise<AxiosResponse<CurriculumProgressResponse>> => {
    return api.get(`/curriculum-progress/${id}`);
  },

  /**
   * Create a new curriculum progress
   * @param progressData Curriculum progress data
   * @returns Response with created curriculum progress details
   */
  create: async (progressData: CreateCurriculumProgressRequest): Promise<AxiosResponse<CurriculumProgressResponse>> => {
    return api.post('/curriculum-progress', progressData);
  },

  /**
   * Update curriculum progress
   * @param id Curriculum progress ID
   * @param progressData Curriculum progress data to update
   * @returns Response with updated curriculum progress details
   */
  update: async (id: number, progressData: UpdateCurriculumProgressRequest): Promise<AxiosResponse<CurriculumProgressResponse>> => {
    return api.put(`/curriculum-progress/${id}`, progressData);
  },

  /**
   * Delete curriculum progress
   * @param id Curriculum progress ID
   * @returns Response with deletion status
   */
  delete: async (id: number): Promise<AxiosResponse<{ status: string; message: string }>> => {
    return api.delete(`/curriculum-progress/${id}`);
  },

  /**
   * Get curriculum progress by student ID
   * @param studentId Student ID
   * @returns Response with curriculum progress for the student
   */
  getByStudentId: async (studentId: number): Promise<AxiosResponse<CurriculumProgressListResponse>> => {
    return api.get(`/curriculum-progress/student/${studentId}`);
  },

  /**
   * Get curriculum progress by course ID
   * @param courseId Course ID
   * @returns Response with curriculum progress for the course
   */
  getByCourseId: async (courseId: number): Promise<AxiosResponse<CurriculumProgressListResponse>> => {
    return api.get(`/curriculum-progress/course/${courseId}`);
  },

  /**
   * Get curriculum progress by curriculum ID
   * @param curriculumId Curriculum ID
   * @returns Response with curriculum progress for the curriculum
   */
  getByCurriculumId: async (curriculumId: number): Promise<AxiosResponse<CurriculumProgressListResponse>> => {
    return api.get(`/curriculum-progress/curriculum/${curriculumId}`);
  },

  /**
   * Get curriculum progress by student ID and course ID
   * @param studentId Student ID
   * @param courseId Course ID
   * @returns Response with curriculum progress details
   */
  getByStudentIdAndCourseId: async (studentId: number, courseId: number): Promise<AxiosResponse<CurriculumProgressResponse>> => {
    return api.get(`/curriculum-progress/student/${studentId}/course/${courseId}`);
  },

  /**
   * Get curriculum progress by student ID and curriculum ID
   * @param studentId Student ID
   * @param curriculumId Curriculum ID
   * @returns Response with curriculum progress details
   */
  getByStudentIdAndCurriculumId: async (studentId: number, curriculumId: number): Promise<AxiosResponse<CurriculumProgressResponse>> => {
    return api.get(`/curriculum-progress/student/${studentId}/curriculum/${curriculumId}`);
  },

  /**
   * Get curriculum progress by status
   * @param status Curriculum progress status
   * @returns Response with curriculum progress by status
   */
  getByStatus: async (status: CurriculumProgress['status']): Promise<AxiosResponse<CurriculumProgressListResponse>> => {
    return api.get(`/curriculum-progress/status/${status}`);
  },

  /**
   * Get curriculum progress by student ID and status
   * @param studentId Student ID
   * @param status Curriculum progress status
   * @returns Response with curriculum progress by student and status
   */
  getByStudentIdAndStatus: async (studentId: number, status: CurriculumProgress['status']): Promise<AxiosResponse<CurriculumProgressListResponse>> => {
    return api.get(`/curriculum-progress/student/${studentId}/status/${status}`);
  },

  /**
   * Get curriculum progress by course ID and status
   * @param courseId Course ID
   * @param status Curriculum progress status
   * @returns Response with curriculum progress by course and status
   */
  getByCourseIdAndStatus: async (courseId: number, status: CurriculumProgress['status']): Promise<AxiosResponse<CurriculumProgressListResponse>> => {
    return api.get(`/curriculum-progress/course/${courseId}/status/${status}`);
  },

  /**
   * Count curriculum progress by student ID
   * @param studentId Student ID
   * @returns Response with curriculum progress count
   */
  countByStudentId: async (studentId: number): Promise<AxiosResponse<{ data: number }>> => {
    return api.get(`/curriculum-progress/student/${studentId}/count`);
  },

  /**
   * Count curriculum progress by course ID
   * @param courseId Course ID
   * @returns Response with curriculum progress count
   */
  countByCourseId: async (courseId: number): Promise<AxiosResponse<{ data: number }>> => {
    return api.get(`/curriculum-progress/course/${courseId}/count`);
  },

  /**
   * Count curriculum progress by student ID and status
   * @param studentId Student ID
   * @param status Curriculum progress status
   * @returns Response with curriculum progress count
   */
  countByStudentIdAndStatus: async (studentId: number, status: CurriculumProgress['status']): Promise<AxiosResponse<{ data: number }>> => {
    return api.get(`/curriculum-progress/student/${studentId}/status/${status}/count`);
  },

  /**
   * Count curriculum progress by course ID and status
   * @param courseId Course ID
   * @param status Curriculum progress status
   * @returns Response with curriculum progress count
   */
  countByCourseIdAndStatus: async (courseId: number, status: CurriculumProgress['status']): Promise<AxiosResponse<{ data: number }>> => {
    return api.get(`/curriculum-progress/course/${courseId}/status/${status}/count`);
  },

  /**
   * Get curriculum progress by progress percentage range
   * @param minPercentage Minimum percentage
   * @param maxPercentage Maximum percentage
   * @returns Response with curriculum progress in percentage range
   */
  getByProgressPercentageBetween: async (minPercentage: number, maxPercentage: number): Promise<AxiosResponse<CurriculumProgressListResponse>> => {
    return api.get(`/curriculum-progress/progress-between?minPercentage=${minPercentage}&maxPercentage=${maxPercentage}`);
  },

  /**
   * Get curriculum progress by student ID and progress percentage range
   * @param studentId Student ID
   * @param minPercentage Minimum percentage
   * @param maxPercentage Maximum percentage
   * @returns Response with curriculum progress in percentage range
   */
  getByStudentIdAndProgressPercentageBetween: async (studentId: number, minPercentage: number, maxPercentage: number): Promise<AxiosResponse<CurriculumProgressListResponse>> => {
    return api.get(`/curriculum-progress/student/${studentId}/progress-between?minPercentage=${minPercentage}&maxPercentage=${maxPercentage}`);
  },

  /**
   * Get curriculum progress by course ID and progress percentage range
   * @param courseId Course ID
   * @param minPercentage Minimum percentage
   * @param maxPercentage Maximum percentage
   * @returns Response with curriculum progress in percentage range
   */
  getByCourseIdAndProgressPercentageBetween: async (courseId: number, minPercentage: number, maxPercentage: number): Promise<AxiosResponse<CurriculumProgressListResponse>> => {
    return api.get(`/curriculum-progress/course/${courseId}/progress-between?minPercentage=${minPercentage}&maxPercentage=${maxPercentage}`);
  },

  /**
   * Get completed curriculum progress by student ID
   * @param studentId Student ID
   * @returns Response with completed curriculum progress
   */
  getCompletedByStudentId: async (studentId: number): Promise<AxiosResponse<CurriculumProgressListResponse>> => {
    return api.get(`/curriculum-progress/student/${studentId}/completed`);
  },

  /**
   * Get completed curriculum progress by course ID
   * @param courseId Course ID
   * @returns Response with completed curriculum progress
   */
  getCompletedByCourseId: async (courseId: number): Promise<AxiosResponse<CurriculumProgressListResponse>> => {
    return api.get(`/curriculum-progress/course/${courseId}/completed`);
  },

  /**
   * Get curriculum progress with scores above threshold
   * @param courseId Course ID
   * @param minScore Minimum score
   * @returns Response with curriculum progress above score threshold
   */
  getByCourseIdAndScoreAbove: async (courseId: number, minScore: number): Promise<AxiosResponse<CurriculumProgressListResponse>> => {
    return api.get(`/curriculum-progress/course/${courseId}/score-above/${minScore}`);
  },

  /**
   * Get curriculum progress with scores below threshold
   * @param courseId Course ID
   * @param maxScore Maximum score
   * @returns Response with curriculum progress below score threshold
   */
  getByCourseIdAndScoreBelow: async (courseId: number, maxScore: number): Promise<AxiosResponse<CurriculumProgressListResponse>> => {
    return api.get(`/curriculum-progress/course/${courseId}/score-below/${maxScore}`);
  },

  /**
   * Get curriculum progress by score range
   * @param courseId Course ID
   * @param minScore Minimum score
   * @param maxScore Maximum score
   * @returns Response with curriculum progress in score range
   */
  getByCourseIdAndScoreBetween: async (courseId: number, minScore: number, maxScore: number): Promise<AxiosResponse<CurriculumProgressListResponse>> => {
    return api.get(`/curriculum-progress/course/${courseId}/score-between?minScore=${minScore}&maxScore=${maxScore}`);
  },

  /**
   * Start curriculum progress
   * @param studentId Student ID
   * @param courseId Course ID
   * @param curriculumId Curriculum ID
   * @returns Response with started curriculum progress
   */
  startProgress: async (studentId: number, courseId: number, curriculumId: number): Promise<AxiosResponse<CurriculumProgressResponse>> => {
    return api.post(`/curriculum-progress/student/${studentId}/course/${courseId}/curriculum/${curriculumId}/start`);
  },

  /**
   * Update progress percentage
   * @param progressId Curriculum progress ID
   * @param progressPercentage Progress percentage
   * @returns Response with updated curriculum progress
   */
  updateProgressPercentage: async (progressId: number, progressPercentage: number): Promise<AxiosResponse<CurriculumProgressResponse>> => {
    return api.put(`/curriculum-progress/${progressId}/progress`, { progressPercentage });
  },

  /**
   * Complete curriculum progress
   * @param progressId Curriculum progress ID
   * @param averageScore Average score
   * @returns Response with completed curriculum progress
   */
  completeProgress: async (progressId: number, averageScore: number): Promise<AxiosResponse<CurriculumProgressResponse>> => {
    return api.put(`/curriculum-progress/${progressId}/complete`, { averageScore });
  },

  /**
   * Pause curriculum progress
   * @param progressId Curriculum progress ID
   * @param notes Optional notes
   * @returns Response with paused curriculum progress
   */
  pauseProgress: async (progressId: number, notes?: string): Promise<AxiosResponse<CurriculumProgressResponse>> => {
    return api.put(`/curriculum-progress/${progressId}/pause`, { notes });
  },

  /**
   * Resume curriculum progress
   * @param progressId Curriculum progress ID
   * @returns Response with resumed curriculum progress
   */
  resumeProgress: async (progressId: number): Promise<AxiosResponse<CurriculumProgressResponse>> => {
    return api.put(`/curriculum-progress/${progressId}/resume`);
  },

  /**
   * Drop curriculum progress
   * @param progressId Curriculum progress ID
   * @param notes Optional notes
   * @returns Response with dropped curriculum progress
   */
  dropProgress: async (progressId: number, notes?: string): Promise<AxiosResponse<CurriculumProgressResponse>> => {
    return api.put(`/curriculum-progress/${progressId}/drop`, { notes });
  },

  /**
   * Get curriculum progress analytics
   * @param courseId Course ID
   * @returns Response with curriculum progress analytics
   */
  getCurriculumProgressAnalytics: async (courseId: number): Promise<AxiosResponse<CurriculumProgressAnalyticsResponse>> => {
    return api.get(`/curriculum-progress/course/${courseId}/analytics`);
  },

  /**
   * Get student curriculum progress analytics
   * @param studentId Student ID
   * @param startDate Start date
   * @param endDate End date
   * @returns Response with student curriculum progress analytics
   */
  getStudentCurriculumProgressAnalytics: async (studentId: number, startDate: string, endDate: string): Promise<AxiosResponse<CurriculumProgressAnalyticsResponse>> => {
    return api.get(`/curriculum-progress/student/${studentId}/analytics?startDate=${startDate}&endDate=${endDate}`);
  },

  /**
   * Get curriculum progress analytics
   * @param curriculumId Curriculum ID
   * @returns Response with curriculum progress analytics
   */
  getCurriculumProgressAnalyticsByCurriculum: async (curriculumId: number): Promise<AxiosResponse<CurriculumProgressAnalyticsResponse>> => {
    return api.get(`/curriculum-progress/curriculum/${curriculumId}/analytics`);
  }
};

export default curriculumProgressApi; 