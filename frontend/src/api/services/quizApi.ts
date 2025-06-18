import { api } from '../index';
import { AxiosResponse } from 'axios';
import { Question } from './questionApi';

export interface Quiz {
  id: number;
  code: string;
  title: string;
  description?: string;
  courseId: number;
  courseName?: string;
  instructorId: number;
  instructorName?: string;
  startDate: string;
  endDate: string;
  timeLimit: number;
  totalPoints: number;
  status: 'DRAFT' | 'PUBLISHED' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED';
  gradingType: 'AUTO' | 'MANUAL' | 'HYBRID';
  autoGradeImmediately: boolean;
  showResultsImmediately: boolean;
  maxAttempts: number;
  active: boolean;
  questions?: Question[];
}

export interface QuizResponse {
  status: string;
  message: string;
  data: Quiz | Quiz[] | null;
  timestamp: string | null;
}

export type CreateQuizRequest = Omit<Quiz, 'id' | 'courseName' | 'instructorName'>;
export type UpdateQuizRequest = Partial<CreateQuizRequest>;

/**
 * API service for interacting with quiz endpoints
 */
const quizApi = {
  /**
   * Get all quizzes
   * @returns Response with a list of quizzes
   */
  getAll: async (): Promise<AxiosResponse<QuizResponse>> => {
    return api.get('/quizzes');
  },

  /**
   * Get quiz by ID
   * @param id Quiz ID
   * @returns Response with quiz details
   */
  getById: async (id: number): Promise<AxiosResponse<QuizResponse>> => {
    return api.get(`/quizzes/${id}`);
  },

  /**
   * Get quiz by code
   * @param code Quiz code
   * @returns Response with quiz details
   */
  getByCode: async (code: string): Promise<AxiosResponse<QuizResponse>> => {
    return api.get(`/quizzes/code/${code}`);
  },

  /**
   * Get quizzes by course ID
   * @param courseId Course ID
   * @returns Response with a list of quizzes
   */
  getByCourseId: async (courseId: number): Promise<AxiosResponse<QuizResponse>> => {
    return api.get(`/quizzes/course/${courseId}`);
  },

  /**
   * Get quizzes by instructor ID
   * @param instructorId Instructor ID
   * @returns Response with a list of quizzes
   */
  getByInstructorId: async (instructorId: number): Promise<AxiosResponse<QuizResponse>> => {
    return api.get(`/quizzes/instructor/${instructorId}`);
  },

  /**
   * Get quizzes by status
   * @param status Quiz status
   * @returns Response with a list of quizzes
   */
  getByStatus: async (status: string): Promise<AxiosResponse<QuizResponse>> => {
    return api.get(`/quizzes/status/${status}`);
  },

  /**
   * Get quizzes by course ID and status
   * @param courseId Course ID
   * @param status Quiz status
   * @returns Response with a list of quizzes
   */
  getByCourseIdAndStatus: async (courseId: number, status: string): Promise<AxiosResponse<QuizResponse>> => {
    return api.get(`/quizzes/course/${courseId}/status/${status}`);
  },

  /**
   * Get active quizzes by course ID
   * @param courseId Course ID
   * @returns Response with a list of active quizzes
   */
  getActiveByCourseId: async (courseId: number): Promise<AxiosResponse<QuizResponse>> => {
    return api.get(`/quizzes/course/${courseId}/active`);
  },

  /**
   * Create a new quiz
   * @param quizData Quiz data
   * @returns Response with created quiz details
   */
  create: async (quizData: CreateQuizRequest): Promise<AxiosResponse<QuizResponse>> => {
    // Transform the data to match backend CreateQuizDTO format
    const transformedData = {
      ...quizData,
      startDate: quizData.startDate ? `${quizData.startDate}T00:00:00` : null,
      endDate: quizData.endDate ? `${quizData.endDate}T23:59:59` : null,
      totalPoints: quizData.totalPoints || 0
    };
    return api.post('/quizzes/create', transformedData);
  },

  /**
   * Update an existing quiz
   * @param id Quiz ID
   * @param quizData Updated quiz data
   * @returns Response with updated quiz details
   */
  update: async (id: number, quizData: UpdateQuizRequest): Promise<AxiosResponse<QuizResponse>> => {
    return api.put(`/quizzes/${id}`, quizData);
  },

  /**
   * Delete a quiz
   * @param id Quiz ID
   * @returns Response indicating success/failure
   */
  delete: async (id: number): Promise<AxiosResponse<QuizResponse>> => {
    return api.delete(`/quizzes/${id}`);
  },

  /**
   * Check if a quiz exists by code
   * @param code Quiz code
   * @returns Response with boolean indicating existence
   */
  existsByCode: async (code: string): Promise<AxiosResponse<{ data: boolean }>> => {
    return api.get(`/quizzes/exists/${code}`);
  },

  /**
   * Activate a quiz
   * @param id Quiz ID
   * @returns Response indicating success/failure
   */
  activate: async (id: number): Promise<AxiosResponse<QuizResponse>> => {
    return api.post(`/quizzes/${id}/activate`);
  },

  /**
   * Deactivate a quiz
   * @param id Quiz ID
   * @returns Response indicating success/failure
   */
  deactivate: async (id: number): Promise<AxiosResponse<QuizResponse>> => {
    return api.post(`/quizzes/${id}/deactivate`);
  }
};

export default quizApi; 