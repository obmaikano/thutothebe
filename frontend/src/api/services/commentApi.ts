import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface Comment {
  id: number;
  content: string;
  threadId: number;
  authorId: number;
  parentId?: number;
  createdAt?: string;
  updatedAt?: string;
  active: boolean;
}

export interface Activity {
  id: number;
  type: 'READ' | 'ACKNOWLEDGED' | 'COMMENTED' | 'LIKED' | 'SHARED' | 'VIEWED';
  userId: number;
  userName: string;
  userRole: string;
  announcementId: number;
  timestamp: string;
  details?: string;
  active: boolean;
}

export interface CommentResponse {
  status: string;
  message: string;
  data: Comment | Comment[] | null;
  timestamp: string | null;
}

export interface ActivityResponse {
  status: string;
  message: string;
  data: Activity | Activity[] | null;
  timestamp: string | null;
}

export type CreateCommentRequest = Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateCommentRequest = Partial<Comment>;

/**
 * API service for interacting with comment endpoints
 */
const commentApi = {
  /**
   * Get all comments
   * @returns Response with a list of comments
   */
  getAll: async (): Promise<AxiosResponse<CommentResponse>> => {
    return api.get('/comments');
  },

  /**
   * Get comment by ID
   * @param id Comment ID
   * @returns Response with comment details
   */
  getById: async (id: number): Promise<AxiosResponse<CommentResponse>> => {
    return api.get(`/comments/${id}`);
  },

  /**
   * Get comments by thread ID
   * @param threadId Thread ID
   * @returns Response with comments
   */
  getByThreadId: async (threadId: number): Promise<AxiosResponse<CommentResponse>> => {
    return api.get(`/comments/thread/${threadId}`);
  },

  /**
   * Get active comments by thread ID
   * @param threadId Thread ID
   * @param active Active status
   * @returns Response with comments
   */
  getByThreadIdAndActive: async (threadId: number, active: boolean = true): Promise<AxiosResponse<CommentResponse>> => {
    return api.get(`/comments/thread/${threadId}/active?active=${active}`);
  },

  /**
   * Get comments by author ID
   * @param authorId Author ID
   * @returns Response with comments
   */
  getByAuthorId: async (authorId: number): Promise<AxiosResponse<CommentResponse>> => {
    return api.get(`/comments/author/${authorId}`);
  },

  /**
   * Get active comments by author ID
   * @param authorId Author ID
   * @param active Active status
   * @returns Response with comments
   */
  getByAuthorIdAndActive: async (authorId: number, active: boolean = true): Promise<AxiosResponse<CommentResponse>> => {
    return api.get(`/comments/author/${authorId}/active?active=${active}`);
  },

  /**
   * Get comments by parent ID
   * @param parentId Parent comment ID
   * @returns Response with comments
   */
  getByParentId: async (parentId: number): Promise<AxiosResponse<CommentResponse>> => {
    return api.get(`/comments/parent/${parentId}`);
  },

  /**
   * Get active comments by parent ID
   * @param parentId Parent comment ID
   * @param active Active status
   * @returns Response with comments
   */
  getByParentIdAndActive: async (parentId: number, active: boolean = true): Promise<AxiosResponse<CommentResponse>> => {
    return api.get(`/comments/parent/${parentId}/active?active=${active}`);
  },

  /**
   * Get comment with replies by ID
   * @param id Comment ID
   * @returns Response with comment and replies
   */
  getByIdWithReplies: async (id: number): Promise<AxiosResponse<CommentResponse>> => {
    return api.get(`/comments/${id}/replies`);
  },

  /**
   * Get top-level comments by thread ID
   * @param threadId Thread ID
   * @returns Response with top-level comments
   */
  getTopLevelCommentsByThreadId: async (threadId: number): Promise<AxiosResponse<CommentResponse>> => {
    return api.get(`/comments/thread/${threadId}/top-level`);
  },

  /**
   * Get replies by parent ID
   * @param parentId Parent comment ID
   * @returns Response with replies
   */
  getRepliesByParentId: async (parentId: number): Promise<AxiosResponse<CommentResponse>> => {
    return api.get(`/comments/parent/${parentId}/replies`);
  },

  /**
   * Create a new comment
   * @param commentData Comment data
   * @returns Response with created comment details
   */
  create: async (commentData: CreateCommentRequest): Promise<AxiosResponse<CommentResponse>> => {
    return api.post('/comments', commentData);
  },

  /**
   * Update an existing comment
   * @param id Comment ID
   * @param commentData Updated comment data
   * @returns Response with updated comment details
   */
  update: async (id: number, commentData: UpdateCommentRequest): Promise<AxiosResponse<CommentResponse>> => {
    return api.put(`/comments/${id}`, commentData);
  },

  /**
   * Delete a comment
   * @param id Comment ID
   * @returns Response indicating success/failure
   */
  delete: async (id: number): Promise<AxiosResponse<CommentResponse>> => {
    return api.delete(`/comments/${id}`);
  },

  // Activity endpoints
  getActivitiesByAnnouncement: async (announcementId: number): Promise<AxiosResponse<ActivityResponse>> => {
    return api.get(`/activities/announcement/${announcementId}`);
  },

  getActivitiesByAnnouncementAndType: async (announcementId: number, type: string): Promise<AxiosResponse<ActivityResponse>> => {
    return api.get(`/activities/announcement/${announcementId}/type/${type}`);
  },

  getActivitiesByUser: async (userId: number): Promise<AxiosResponse<ActivityResponse>> => {
    return api.get(`/activities/user/${userId}`);
  },

  createActivity: async (activityData: {
    announcementId: number;
    userId: number;
    type: string;
    details?: string;
  }): Promise<AxiosResponse<ActivityResponse>> => {
    return api.post('/activities', activityData);
  },

  getActivityCount: async (announcementId: number, type: string): Promise<AxiosResponse<{ status: string; message: string; data: number; timestamp: string | null; }>> => {
    return api.get(`/activities/announcement/${announcementId}/type/${type}/count`);
  }
};

export default commentApi; 