import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface Content {
  id: number;
  title: string;
  description?: string;
  type: 'DOCUMENT' | 'VIDEO' | 'LINK' | 'ANNOUNCEMENT' | 'SCHEDULE';
  url: string;
  courseId: number;
  createdById: number;
  createdAt: string;
  active: boolean;
  version: number;
}

export interface CreateContentRequest {
  title: string;
  description?: string;
  type: 'DOCUMENT' | 'VIDEO' | 'LINK' | 'ANNOUNCEMENT' | 'SCHEDULE';
  url: string;
  courseId: number;
  createdById: number;
  active: boolean;
}

export interface UpdateContentRequest {
  title?: string;
  description?: string;
  type?: 'DOCUMENT' | 'VIDEO' | 'LINK' | 'ANNOUNCEMENT' | 'SCHEDULE';
  url?: string;
  courseId?: number;
  active?: boolean;
}

export interface ContentResponse {
  status: string;
  message: string;
  data: Content | Content[] | boolean;
  timestamp: string | null;
}

/**
 * API service for interacting with content endpoints
 */
const contentApi = {
  /**
   * Get all content
   * @returns Response with a list of content
   */
  getAll: async (): Promise<AxiosResponse<ContentResponse>> => {
    return api.get('/content');
  },

  /**
   * Get content by ID
   * @param id Content ID
   * @returns Response with content details
   */
  getById: async (id: number): Promise<AxiosResponse<ContentResponse>> => {
    return api.get(`/content/${id}`);
  },

  /**
   * Get content by course
   * @param courseId Course ID
   * @returns Response with course content
   */
  getByCourse: async (courseId: number): Promise<AxiosResponse<ContentResponse>> => {
    return api.get(`/content/course/${courseId}`);
  },

  /**
   * Get content by course and type
   * @param courseId Course ID
   * @param type Content type
   * @returns Response with filtered content
   */
  getByType: async (courseId: number, type: string): Promise<AxiosResponse<ContentResponse>> => {
    return api.get(`/content/course/${courseId}/type/${type}`);
  },

  /**
   * Get active content by course
   * @param courseId Course ID
   * @returns Response with active course content
   */
  getActiveByCourse: async (courseId: number): Promise<AxiosResponse<ContentResponse>> => {
    return api.get(`/content/course/${courseId}/active`);
  },

  /**
   * Get active content by course and type
   * @param courseId Course ID
   * @param type Content type
   * @returns Response with active filtered content
   */
  getActiveByType: async (courseId: number, type: string): Promise<AxiosResponse<ContentResponse>> => {
    return api.get(`/content/course/${courseId}/type/${type}/active`);
  },

  /**
   * Get content by teacher
   * @param teacherId Teacher ID
   * @returns Response with teacher's content
   */
  getByTeacher: async (teacherId: number): Promise<AxiosResponse<ContentResponse>> => {
    return api.get(`/content/teacher/${teacherId}`);
  },

  /**
   * Get active content by teacher
   * @param teacherId Teacher ID
   * @returns Response with teacher's active content
   */
  getActiveByTeacher: async (teacherId: number): Promise<AxiosResponse<ContentResponse>> => {
    return api.get(`/content/teacher/${teacherId}/active`);
  },

  /**
   * Get content by teacher and type
   * @param teacherId Teacher ID
   * @param type Content type
   * @returns Response with teacher's content by type
   */
  getByTeacherAndType: async (teacherId: number, type: string): Promise<AxiosResponse<ContentResponse>> => {
    return api.get(`/content/teacher/${teacherId}/type/${type}`);
  },

  /**
   * Get content by creator
   * @param userId Creator user ID
   * @returns Response with creator's content
   */
  getByCreator: async (userId: number): Promise<AxiosResponse<ContentResponse>> => {
    return api.get(`/content/created-by/${userId}`);
  },

  /**
   * Get active content by creator
   * @param userId Creator user ID
   * @returns Response with creator's active content
   */
  getActiveByCreator: async (userId: number): Promise<AxiosResponse<ContentResponse>> => {
    return api.get(`/content/created-by/${userId}/active`);
  },

  /**
   * Check if content exists by title and course
   * @param title Content title
   * @param courseId Course ID
   * @returns Response indicating if content exists
   */
  checkExists: async (title: string, courseId: number): Promise<AxiosResponse<ContentResponse>> => {
    return api.get(`/content/exists?title=${encodeURIComponent(title)}&courseId=${courseId}`);
  },

  /**
   * Create new content
   * @param contentData Content data
   * @returns Response with created content details
   */
  create: async (contentData: CreateContentRequest): Promise<AxiosResponse<ContentResponse>> => {
    return api.post('/content', contentData);
  },

  /**
   * Update existing content
   * @param id Content ID
   * @param contentData Updated content data
   * @returns Response with updated content details
   */
  update: async (id: number, contentData: UpdateContentRequest): Promise<AxiosResponse<ContentResponse>> => {
    return api.put(`/content/${id}`, contentData);
  },

  /**
   * Delete content
   * @param id Content ID
   * @returns Response indicating success/failure
   */
  delete: async (id: number): Promise<AxiosResponse<ContentResponse>> => {
    return api.delete(`/content/${id}`);
  },

  /**
   * Activate content
   * @param id Content ID
   * @returns Response indicating success/failure
   */
  activate: async (id: number): Promise<AxiosResponse<ContentResponse>> => {
    return api.put(`/content/${id}/activate`);
  },

  /**
   * Deactivate content
   * @param id Content ID
   * @returns Response indicating success/failure
   */
  deactivate: async (id: number): Promise<AxiosResponse<ContentResponse>> => {
    return api.put(`/content/${id}/deactivate`);
  }
};

export default contentApi; 