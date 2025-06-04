import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface QuestionResponse {
  id: number;
  questionId: number;
  submissionId: number;
  answer: string;
  isCorrect?: boolean;
  points?: number;
}

export interface QuizSubmission {
  id: number;
  quizId: number;
  quizTitle?: string;
  studentId: number;
  studentName?: string;
  startedAt: string;
  submittedAt?: string;
  gradedAt?: string;
  score?: number;
  feedback?: string;
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'GRADED' | 'LATE_SUBMISSION';
  responses: QuestionResponse[];
  active: boolean;
}

export interface QuizSubmissionResponse {
  status: string;
  message: string;
  data: QuizSubmission | QuizSubmission[] | null;
  timestamp: string | null;
}

export type CreateQuizSubmissionRequest = Omit<QuizSubmission, 'id' | 'quizTitle' | 'studentName'>;
export type UpdateQuizSubmissionRequest = Partial<CreateQuizSubmissionRequest>;

/**
 * API service for interacting with quiz submission endpoints
 */
const quizSubmissionApi = {
  /**
   * Get all quiz submissions
   * @returns Response with a list of quiz submissions
   */
  getAll: async (): Promise<AxiosResponse<QuizSubmissionResponse>> => {
    return api.get('/quiz-submissions');
  },

  /**
   * Get quiz submission by ID
   * @param id Quiz submission ID
   * @returns Response with quiz submission details
   */
  getById: async (id: number): Promise<AxiosResponse<QuizSubmissionResponse>> => {
    return api.get(`/quiz-submissions/${id}`);
  },

  /**
   * Get quiz submissions by quiz ID
   * @param quizId Quiz ID
   * @returns Response with a list of quiz submissions
   */
  getByQuizId: async (quizId: number): Promise<AxiosResponse<QuizSubmissionResponse>> => {
    return api.get(`/quiz-submissions/quiz/${quizId}`);
  },

  /**
   * Get quiz submissions by student ID
   * @param studentId Student ID
   * @returns Response with a list of quiz submissions
   */
  getByStudentId: async (studentId: number): Promise<AxiosResponse<QuizSubmissionResponse>> => {
    return api.get(`/quiz-submissions/student/${studentId}`);
  },

  /**
   * Get quiz submissions by quiz ID and student ID
   * @param quizId Quiz ID
   * @param studentId Student ID
   * @returns Response with a list of quiz submissions
   */
  getByQuizIdAndStudentId: async (quizId: number, studentId: number): Promise<AxiosResponse<QuizSubmissionResponse>> => {
    return api.get(`/quiz-submissions/quiz/${quizId}/student/${studentId}`);
  },

  /**
   * Get quiz submissions by status
   * @param status Submission status
   * @returns Response with a list of quiz submissions
   */
  getByStatus: async (status: string): Promise<AxiosResponse<QuizSubmissionResponse>> => {
    return api.get(`/quiz-submissions/status/${status}`);
  },

  /**
   * Get quiz submissions by quiz ID and status
   * @param quizId Quiz ID
   * @param status Submission status
   * @returns Response with a list of quiz submissions
   */
  getByQuizIdAndStatus: async (quizId: number, status: string): Promise<AxiosResponse<QuizSubmissionResponse>> => {
    return api.get(`/quiz-submissions/quiz/${quizId}/status/${status}`);
  },

  /**
   * Get quiz submissions by student ID and status
   * @param studentId Student ID
   * @param status Submission status
   * @returns Response with a list of quiz submissions
   */
  getByStudentIdAndStatus: async (studentId: number, status: string): Promise<AxiosResponse<QuizSubmissionResponse>> => {
    return api.get(`/quiz-submissions/student/${studentId}/status/${status}`);
  },

  /**
   * Create a new quiz submission
   * @param submissionData Quiz submission data
   * @returns Response with created quiz submission details
   */
  create: async (submissionData: CreateQuizSubmissionRequest): Promise<AxiosResponse<QuizSubmissionResponse>> => {
    return api.post('/quiz-submissions', submissionData);
  },

  /**
   * Update an existing quiz submission
   * @param id Quiz submission ID
   * @param submissionData Updated quiz submission data
   * @returns Response with updated quiz submission details
   */
  update: async (id: number, submissionData: UpdateQuizSubmissionRequest): Promise<AxiosResponse<QuizSubmissionResponse>> => {
    return api.put(`/quiz-submissions/${id}`, submissionData);
  },

  /**
   * Submit a quiz
   * @param id Quiz submission ID
   * @returns Response indicating success/failure
   */
  submit: async (id: number): Promise<AxiosResponse<QuizSubmissionResponse>> => {
    return api.post(`/quiz-submissions/${id}/submit`);
  },

  /**
   * Start a quiz for a student
   * @param quizId Quiz ID
   * @param studentId Student ID
   * @returns Response with created quiz submission details
   */
  startQuiz: async (quizId: number, studentId: number): Promise<AxiosResponse<QuizSubmissionResponse>> => {
    return api.post(`/quiz-submissions/start?quizId=${quizId}&studentId=${studentId}`);
  },

  /**
   * Grade a quiz submission
   * @param id Quiz submission ID
   * @param gradeData Grade data
   * @returns Response with graded submission details
   */
  grade: async (id: number, gradeData: { score: number; feedback?: string }): Promise<AxiosResponse<QuizSubmissionResponse>> => {
    return api.post(`/quiz-submissions/${id}/grade`, gradeData);
  },

  /**
   * Delete a quiz submission
   * @param id Quiz submission ID
   * @returns Response indicating success/failure
   */
  delete: async (id: number): Promise<AxiosResponse<QuizSubmissionResponse>> => {
    return api.delete(`/quiz-submissions/${id}`);
  }
};

export default quizSubmissionApi; 