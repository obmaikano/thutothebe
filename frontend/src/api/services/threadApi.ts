import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface Thread {
  id: number;
  title: string;
  content: string;
  forumId: number;
  authorId: number;
  pinned: boolean;
  lastActivityAt?: string;
  active: boolean;
}

export interface ThreadResponse {
  status: string;
  message: string;
  data: Thread | Thread[] | any | null;
  timestamp: string | null;
}

export type CreateThreadRequest = Omit<Thread, 'id' | 'lastActivityAt'>;
export type UpdateThreadRequest = Partial<Thread>;

/**
 * API service for interacting with thread endpoints
 */
const threadApi = {
  /**
   * Get all threads
   * @returns Response with a list of threads
   */
  getAll: async (): Promise<AxiosResponse<ThreadResponse>> => {
    return api.get('/threads');
  },

  /**
   * Get thread by ID
   * @param id Thread ID
   * @returns Response with thread details
   */
  getById: async (id: number): Promise<AxiosResponse<ThreadResponse>> => {
    return api.get(`/threads/${id}`);
  },

  /**
   * Get threads by forum ID
   * @param forumId Forum ID
   * @returns Response with threads
   */
  getByForumId: async (forumId: number): Promise<AxiosResponse<ThreadResponse>> => {
    return api.get(`/threads/forum/${forumId}`);
  },

  /**
   * Get active threads by forum ID
   * @param forumId Forum ID
   * @param active Active status
   * @returns Response with threads
   */
  getByForumIdAndActive: async (forumId: number, active: boolean = true): Promise<AxiosResponse<ThreadResponse>> => {
    return api.get(`/threads/forum/${forumId}/active?active=${active}`);
  },

  /**
   * Get threads by author ID
   * @param authorId Author ID
   * @returns Response with threads
   */
  getByAuthorId: async (authorId: number): Promise<AxiosResponse<ThreadResponse>> => {
    return api.get(`/threads/author/${authorId}`);
  },

  /**
   * Get active threads by author ID
   * @param authorId Author ID
   * @param active Active status
   * @returns Response with threads
   */
  getByAuthorIdAndActive: async (authorId: number, active: boolean = true): Promise<AxiosResponse<ThreadResponse>> => {
    return api.get(`/threads/author/${authorId}/active?active=${active}`);
  },

  /**
   * Get thread with comments by ID
   * @param id Thread ID
   * @returns Response with thread and comments
   */
  getByIdWithComments: async (id: number): Promise<AxiosResponse<ThreadResponse>> => {
    return api.get(`/threads/${id}/comments`);
  },

  /**
   * Get threads with comments by forum ID
   * @param forumId Forum ID
   * @returns Response with threads and comments
   */
  getByForumIdWithComments: async (forumId: number): Promise<AxiosResponse<ThreadResponse>> => {
    return api.get(`/threads/forum/${forumId}/comments`);
  },

  /**
   * Get threads ordered by pinned status and last activity
   * @param forumId Forum ID
   * @param page Page number
   * @param size Page size
   * @returns Response with paginated threads
   */
  getByForumIdOrdered: async (forumId: number, page: number = 0, size: number = 10): Promise<AxiosResponse<ThreadResponse>> => {
    return api.get(`/threads/forum/${forumId}/ordered?page=${page}&size=${size}`);
  },

  /**
   * Create a new thread
   * @param threadData Thread data
   * @returns Response with created thread details
   */
  create: async (threadData: CreateThreadRequest): Promise<AxiosResponse<ThreadResponse>> => {
    return api.post('/threads', threadData);
  },

  /**
   * Update an existing thread
   * @param id Thread ID
   * @param threadData Updated thread data
   * @returns Response with updated thread details
   */
  update: async (id: number, threadData: UpdateThreadRequest): Promise<AxiosResponse<ThreadResponse>> => {
    return api.put(`/threads/${id}`, threadData);
  },

  /**
   * Delete a thread
   * @param id Thread ID
   * @returns Response indicating success/failure
   */
  delete: async (id: number): Promise<AxiosResponse<ThreadResponse>> => {
    return api.delete(`/threads/${id}`);
  }
};

export default threadApi; 