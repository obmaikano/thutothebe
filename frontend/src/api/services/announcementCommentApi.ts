import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface AnnouncementComment {
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
  replies?: AnnouncementComment[];
  active: boolean;
}

export interface AnnouncementActivity {
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

export interface AnnouncementCommentResponse {
  status: string;
  message: string;
  data: AnnouncementComment | AnnouncementComment[] | null;
  timestamp: string | null;
}

export interface AnnouncementActivityResponse {
  status: string;
  message: string;
  data: AnnouncementActivity | AnnouncementActivity[] | null;
  timestamp: string | null;
}

const announcementCommentApi = {
  // Announcement Comment endpoints
  getCommentsByAnnouncement: async (announcementId: number): Promise<AxiosResponse<AnnouncementCommentResponse>> => {
    return api.get(`/announcement-comments/announcement/${announcementId}`);
  },

  createComment: async (commentData: {
    announcementId: number;
    authorId: number;
    content: string;
    parentCommentId?: number;
  }): Promise<AxiosResponse<AnnouncementCommentResponse>> => {
    return api.post('/announcement-comments/create', commentData);
  },

  updateComment: async (commentId: number, updateData: {
    content: string;
    userId: number;
  }): Promise<AxiosResponse<AnnouncementCommentResponse>> => {
    return api.put(`/announcement-comments/${commentId}`, updateData);
  },

  deleteComment: async (commentId: number, userId: number): Promise<AxiosResponse<AnnouncementCommentResponse>> => {
    return api.delete(`/announcement-comments/${commentId}?userId=${userId}`);
  },

  toggleLike: async (commentId: number, userId: number): Promise<AxiosResponse<AnnouncementCommentResponse>> => {
    return api.post(`/announcement-comments/${commentId}/like`, { userId });
  },

  getCommentsByAuthor: async (authorId: number): Promise<AxiosResponse<AnnouncementCommentResponse>> => {
    return api.get(`/announcement-comments/author/${authorId}`);
  },

  getCommentCount: async (announcementId: number): Promise<AxiosResponse<{ status: string; message: string; data: number; timestamp: string | null; }>> => {
    return api.get(`/announcement-comments/announcement/${announcementId}/count`);
  },

  getRepliesByParentComment: async (parentCommentId: number): Promise<AxiosResponse<AnnouncementCommentResponse>> => {
    return api.get(`/announcement-comments/parent/${parentCommentId}/replies`);
  },

  // Announcement Activity endpoints
  getActivitiesByAnnouncement: async (announcementId: number): Promise<AxiosResponse<AnnouncementActivityResponse>> => {
    return api.get(`/announcement-activities/announcement/${announcementId}`);
  },

  getActivitiesByAnnouncementAndType: async (announcementId: number, type: string): Promise<AxiosResponse<AnnouncementActivityResponse>> => {
    return api.get(`/announcement-activities/announcement/${announcementId}/type/${type}`);
  },

  getActivitiesByUser: async (userId: number): Promise<AxiosResponse<AnnouncementActivityResponse>> => {
    return api.get(`/announcement-activities/user/${userId}`);
  },

  createActivity: async (activityData: {
    announcementId: number;
    userId: number;
    type: string;
    details?: string;
  }): Promise<AxiosResponse<AnnouncementActivityResponse>> => {
    return api.post('/announcement-activities/create', activityData);
  },

  getActivityCount: async (announcementId: number, type: string): Promise<AxiosResponse<{ status: string; message: string; data: number; timestamp: string | null; }>> => {
    return api.get(`/announcement-activities/announcement/${announcementId}/type/${type}/count`);
  },

  // Convenience methods for specific activity types
  recordReadActivity: async (announcementId: number, userId: number): Promise<AxiosResponse<AnnouncementActivityResponse>> => {
    return api.post('/announcement-activities/create', {
      announcementId,
      userId,
      type: 'READ',
      details: 'User read the announcement'
    });
  },

  recordAcknowledgeActivity: async (announcementId: number, userId: number): Promise<AxiosResponse<AnnouncementActivityResponse>> => {
    return api.post('/announcement-activities/create', {
      announcementId,
      userId,
      type: 'ACKNOWLEDGED',
      details: 'User acknowledged the announcement'
    });
  },

  recordCommentActivity: async (announcementId: number, userId: number, commentContent: string): Promise<AxiosResponse<AnnouncementActivityResponse>> => {
    const details = `User commented: ${commentContent.length > 50 ? commentContent.substring(0, 50) + '...' : commentContent}`;
    return api.post('/announcement-activities/create', {
      announcementId,
      userId,
      type: 'COMMENTED',
      details
    });
  },

  recordLikeActivity: async (announcementId: number, userId: number, details: string): Promise<AxiosResponse<AnnouncementActivityResponse>> => {
    return api.post('/announcement-activities/create', {
      announcementId,
      userId,
      type: 'LIKED',
      details
    });
  }
};

export default announcementCommentApi; 