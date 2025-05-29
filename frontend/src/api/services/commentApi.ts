import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface Comment {
  id: number;
  content: string;
  authorId: number;
  authorName: string;
  authorRole: string;
  announcementId: number;
  parentCommentId?: number;
  createdAt: string;
  modifiedAt?: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
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

const commentApi = {
  // Comment endpoints
  getCommentsByAnnouncement: async (announcementId: number): Promise<AxiosResponse<CommentResponse>> => {
    return api.get(`/comments/announcement/${announcementId}`);
  },

  createComment: async (commentData: {
    announcementId: number;
    authorId: number;
    content: string;
    parentCommentId?: number;
  }): Promise<AxiosResponse<CommentResponse>> => {
    return api.post('/comments', commentData);
  },

  updateComment: async (commentId: number, updateData: {
    content: string;
    userId: number;
  }): Promise<AxiosResponse<CommentResponse>> => {
    return api.put(`/comments/${commentId}`, updateData);
  },

  deleteComment: async (commentId: number, userId: number): Promise<AxiosResponse<CommentResponse>> => {
    return api.delete(`/comments/${commentId}?userId=${userId}`);
  },

  toggleLike: async (commentId: number, userId: number): Promise<AxiosResponse<CommentResponse>> => {
    return api.post(`/comments/${commentId}/like`, { userId });
  },

  getCommentsByAuthor: async (authorId: number): Promise<AxiosResponse<CommentResponse>> => {
    return api.get(`/comments/author/${authorId}`);
  },

  getCommentCount: async (announcementId: number): Promise<AxiosResponse<{ status: string; message: string; data: number; timestamp: string | null; }>> => {
    return api.get(`/comments/announcement/${announcementId}/count`);
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