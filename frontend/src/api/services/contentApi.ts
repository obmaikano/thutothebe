import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface Content {
  id: number;
  title: string;
  description: string;
  type: 'DOCUMENT' | 'VIDEO' | 'LINK' | 'ANNOUNCEMENT' | 'SCHEDULE';
  url: string;
  courseId: number;
  createdById: number;
  active: boolean;
}

export interface ContentResponse {
  status: string;
  message: string;
  data: Content | Content[] | null;
  timestamp: string | null;
}

export type CreateContentRequest = Omit<Content, 'id'>;
export type UpdateContentRequest = Partial<Content>;

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
   * @returns Response with content for the course
   */
  getByCourse: async (courseId: number): Promise<AxiosResponse<ContentResponse>> => {
    return api.get(`/content/course/${courseId}`);
  },

  /**
   * Get content by course and type
   * @param courseId Course ID
   * @param type Content type
   * @returns Response with content for the course and type
   */
  getByType: async (courseId: number, type: string): Promise<AxiosResponse<ContentResponse>> => {
    return api.get(`/content/course/${courseId}/type/${type}`);
  },

  /**
   * Get active content by course
   * @param courseId Course ID
   * @returns Response with active content for the course
   */
  getActiveByCourse: async (courseId: number): Promise<AxiosResponse<ContentResponse>> => {
    return api.get(`/content/course/${courseId}/active`);
  },

  /**
   * Get active content by course and type
   * @param courseId Course ID
   * @param type Content type
   * @returns Response with active content for the course and type
   */
  getActiveByType: async (courseId: number, type: string): Promise<AxiosResponse<ContentResponse>> => {
    return api.get(`/content/course/${courseId}/type/${type}/active`);
  },

  /**
   * Check if content exists by title and course
   * @param title Content title
   * @param courseId Course ID
   * @returns Response with existence check result
   */
  existsByTitleAndCourse: async (title: string, courseId: number): Promise<AxiosResponse<ContentResponse>> => {
    return api.get(`/content/exists?title=${encodeURIComponent(title)}&courseId=${courseId}`);
  },

  /**
   * Get content by teacher
   * @param teacherId Teacher ID
   * @returns Response with content for the teacher
   */
  getByTeacher: async (teacherId: number): Promise<AxiosResponse<ContentResponse>> => {
    return api.get(`/content/teacher/${teacherId}`);
  },

  /**
   * Get active content by teacher
   * @param teacherId Teacher ID
   * @returns Response with active content for the teacher
   */
  getActiveByTeacher: async (teacherId: number): Promise<AxiosResponse<ContentResponse>> => {
    return api.get(`/content/teacher/${teacherId}/active`);
  },

  /**
   * Get content by teacher and type
   * @param teacherId Teacher ID
   * @param type Content type
   * @returns Response with content for the teacher and type
   */
  getByTeacherAndType: async (teacherId: number, type: string): Promise<AxiosResponse<ContentResponse>> => {
    return api.get(`/content/teacher/${teacherId}/type/${type}`);
  },

  /**
   * Get content by creator
   * @param userId User ID
   * @returns Response with content created by the user
   */
  getByCreator: async (userId: number): Promise<AxiosResponse<ContentResponse>> => {
    return api.get(`/content/created-by/${userId}`);
  },

  /**
   * Get active content by creator
   * @param userId User ID
   * @returns Response with active content created by the user
   */
  getActiveByCreator: async (userId: number): Promise<AxiosResponse<ContentResponse>> => {
    return api.get(`/content/created-by/${userId}/active`);
  },

  /**
   * Create a new content
   * @param contentData Content data
   * @returns Response with created content details
   */
  create: async (contentData: CreateContentRequest): Promise<AxiosResponse<ContentResponse>> => {
    return api.post('/content', contentData);
  },

  /**
   * Update an existing content
   * @param id Content ID
   * @param contentData Updated content data
   * @returns Response with updated content details
   */
  update: async (id: number, contentData: UpdateContentRequest): Promise<AxiosResponse<ContentResponse>> => {
    return api.put(`/content/${id}`, contentData);
  },

  /**
   * Delete a content
   * @param id Content ID
   * @returns Response indicating success/failure
   */
  delete: async (id: number): Promise<AxiosResponse<ContentResponse>> => {
    return api.delete(`/content/${id}`);
  },
};

export default contentApi; 