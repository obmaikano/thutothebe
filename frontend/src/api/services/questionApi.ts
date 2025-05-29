import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface QuestionOption {
  id: number;
  text: string;
  isCorrect: boolean;
  questionId: number;
}

export interface Question {
  id: number;
  text: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'ESSAY';
  points: number;
  quizId: number;
  options: QuestionOption[];
  correctAnswer?: string;
  active: boolean;
}

export interface QuestionResponse {
  status: string;
  message: string;
  data: Question | Question[] | null;
  timestamp: string | null;
}

export type CreateQuestionRequest = Omit<Question, 'id'>;
export type UpdateQuestionRequest = Partial<CreateQuestionRequest>;

/**
 * API service for interacting with question endpoints
 */
const questionApi = {
  /**
   * Get all questions
   * @returns Response with a list of questions
   */
  getAll: async (): Promise<AxiosResponse<QuestionResponse>> => {
    return api.get('/questions');
  },

  /**
   * Get question by ID
   * @param id Question ID
   * @returns Response with question details
   */
  getById: async (id: number): Promise<AxiosResponse<QuestionResponse>> => {
    return api.get(`/questions/${id}`);
  },

  /**
   * Get questions by quiz ID
   * @param quizId Quiz ID
   * @returns Response with a list of questions
   */
  getByQuizId: async (quizId: number): Promise<AxiosResponse<QuestionResponse>> => {
    return api.get(`/questions/quiz/${quizId}`);
  },

  /**
   * Get questions by quiz ID and type
   * @param quizId Quiz ID
   * @param type Question type
   * @returns Response with a list of questions
   */
  getByQuizIdAndType: async (quizId: number, type: string): Promise<AxiosResponse<QuestionResponse>> => {
    return api.get(`/questions/quiz/${quizId}/type/${type}`);
  },

  /**
   * Create a new question
   * @param questionData Question data
   * @returns Response with created question details
   */
  create: async (questionData: CreateQuestionRequest): Promise<AxiosResponse<QuestionResponse>> => {
    return api.post('/questions', questionData);
  },

  /**
   * Update an existing question
   * @param id Question ID
   * @param questionData Updated question data
   * @returns Response with updated question details
   */
  update: async (id: number, questionData: UpdateQuestionRequest): Promise<AxiosResponse<QuestionResponse>> => {
    return api.put(`/questions/${id}`, questionData);
  },

  /**
   * Delete a question
   * @param id Question ID
   * @returns Response indicating success/failure
   */
  delete: async (id: number): Promise<AxiosResponse<QuestionResponse>> => {
    return api.delete(`/questions/${id}`);
  },

  /**
   * Activate a question
   * @param id Question ID
   * @returns Response indicating success/failure
   */
  activate: async (id: number): Promise<AxiosResponse<QuestionResponse>> => {
    return api.post(`/questions/${id}/activate`);
  },

  /**
   * Deactivate a question
   * @param id Question ID
   * @returns Response indicating success/failure
   */
  deactivate: async (id: number): Promise<AxiosResponse<QuestionResponse>> => {
    return api.post(`/questions/${id}/deactivate`);
  }
};

export default questionApi; 