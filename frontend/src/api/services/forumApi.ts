import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface Forum {
  id: number;
  title: string;
  description?: string;
  courseId: number;
  active: boolean;
}

export interface ForumResponse {
  status: string;
  message: string;
  data: Forum | Forum[] | null;
  timestamp: string | null;
}

export type CreateForumRequest = Omit<Forum, 'id'>;
export type UpdateForumRequest = Partial<Forum>;

/**
 * API service for interacting with forum endpoints
 */
const forumApi = {
  /**
   * Get all forums
   * @returns Response with a list of forums
   */
  getAll: async (): Promise<AxiosResponse<ForumResponse>> => {
    return api.get('/forums');
  },

  /**
   * Get forum by ID
   * @param id Forum ID
   * @returns Response with forum details
   */
  getById: async (id: number): Promise<AxiosResponse<ForumResponse>> => {
    return api.get(`/forums/${id}`);
  },

  /**
   * Get forum by course ID
   * @param courseId Course ID
   * @returns Response with forum details
   */
  getByCourseId: async (courseId: number): Promise<AxiosResponse<ForumResponse>> => {
    return api.get(`/forums/course/${courseId}`);
  },

  /**
   * Get active forum by course ID
   * @param courseId Course ID
   * @param active Active status
   * @returns Response with forum details
   */
  getByCourseIdAndActive: async (courseId: number, active: boolean = true): Promise<AxiosResponse<ForumResponse>> => {
    return api.get(`/forums/course/${courseId}/active?active=${active}`);
  },

  /**
   * Get forum with threads by ID
   * @param id Forum ID
   * @returns Response with forum and threads
   */
  getByIdWithThreads: async (id: number): Promise<AxiosResponse<ForumResponse>> => {
    return api.get(`/forums/${id}/threads`);
  },

  /**
   * Get forum with threads by course ID
   * @param courseId Course ID
   * @returns Response with forum and threads
   */
  getByCourseIdWithThreads: async (courseId: number): Promise<AxiosResponse<ForumResponse>> => {
    return api.get(`/forums/course/${courseId}/threads`);
  },

  /**
   * Create a new forum
   * @param forumData Forum data
   * @returns Response with created forum details
   */
  create: async (forumData: CreateForumRequest): Promise<AxiosResponse<ForumResponse>> => {
    return api.post('/forums', forumData);
  },

  /**
   * Update an existing forum
   * @param id Forum ID
   * @param forumData Updated forum data
   * @returns Response with updated forum details
   */
  update: async (id: number, forumData: UpdateForumRequest): Promise<AxiosResponse<ForumResponse>> => {
    return api.put(`/forums/${id}`, forumData);
  },

  /**
   * Delete a forum
   * @param id Forum ID
   * @returns Response indicating success/failure
   */
  delete: async (id: number): Promise<AxiosResponse<ForumResponse>> => {
    return api.delete(`/forums/${id}`);
  }
};

export default forumApi; 