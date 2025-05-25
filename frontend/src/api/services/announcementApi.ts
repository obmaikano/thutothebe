import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface Announcement {
  id: number;
  title: string;
  content: string;
  type: string;
  priority: string;
  authorName: string;
  createdAt: string;
  expiresAt: string;
  targetAudience: string;
  read: boolean;
}

export interface AnnouncementResponse {
  status: string;
  message: string;
  data: Announcement | Announcement[] | null;
  timestamp: string | null;
}

/**
 * API service for interacting with announcement endpoints
 */
const announcementApi = {
  /**
   * Get announcements for a student
   * @param studentId Student ID
   * @returns Response with student's announcements
   */
  getForStudent: async (studentId: number): Promise<AxiosResponse<AnnouncementResponse>> => {
    return api.get(`/announcements/student/${studentId}`);
  },

  /**
   * Get announcements for a school
   * @param schoolId School ID
   * @returns Response with school announcements
   */
  getForSchool: async (schoolId: number): Promise<AxiosResponse<AnnouncementResponse>> => {
    return api.get(`/announcements/school/${schoolId}`);
  },

  /**
   * Mark announcement as read
   * @param announcementId Announcement ID
   * @param userId User ID
   * @returns Response indicating success/failure
   */
  markAsRead: async (announcementId: number, userId: number): Promise<AxiosResponse<{ status: string; message: string; data: string | null; timestamp: string | null; }>> => {
    return api.post(`/announcements/${announcementId}/mark-read`, null, {
      params: { userId }
    });
  },

  /**
   * Get unread announcement count for student
   * @param studentId Student ID
   * @returns Response with unread count
   */
  getUnreadCount: async (studentId: number): Promise<AxiosResponse<{ status: string; message: string; data: number | null; timestamp: string | null; }>> => {
    return api.get(`/announcements/unread-count/student/${studentId}`);
  }
};

export default announcementApi; 