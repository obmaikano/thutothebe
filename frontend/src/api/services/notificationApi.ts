import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface Notification {
  id: number;
  title: string;
  content: string;
  recipientId: number;
  type: 'MESSAGE' | 'GROUP_INVITATION' | 'GROUP_MESSAGE' | 'SYSTEM';
  referenceId?: number;
  referenceType?: string;
  createdAt: string;
  readAt?: string;
  active: boolean;
}

export interface NotificationResponse {
  status: string;
  message: string;
  data: Notification | Notification[] | null;
  timestamp: string | null;
}

export interface NotificationPageResponse {
  status: string;
  message: string;
  data: {
    content: Notification[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
  };
  timestamp: string | null;
}

export interface NotificationCountResponse {
  status: string;
  message: string;
  data: number;
  timestamp: string | null;
}

export type CreateNotificationRequest = Omit<Notification, 'id' | 'createdAt' | 'readAt'>;
export type UpdateNotificationRequest = Partial<Notification>;

/**
 * API service for interacting with notification endpoints
 */
const notificationApi = {
  /**
   * Get all notifications
   * @returns Response with a list of notifications
   */
  getAll: async (): Promise<AxiosResponse<NotificationResponse>> => {
    return api.get('/notifications');
  },

  /**
   * Get notification by ID
   * @param id Notification ID
   * @returns Response with notification details
   */
  getById: async (id: number): Promise<AxiosResponse<NotificationResponse>> => {
    return api.get(`/notifications/${id}`);
  },

  /**
   * Get notifications for a recipient with pagination
   * @param recipientId Recipient ID
   * @param page Page number (default: 0)
   * @param size Page size (default: 20)
   * @returns Response with paginated notifications
   */
  getByRecipient: async (recipientId: number, page: number = 0, size: number = 20): Promise<AxiosResponse<NotificationPageResponse>> => {
    return api.get(`/notifications/recipient/${recipientId}?page=${page}&size=${size}`);
  },

  /**
   * Get active/inactive notifications for a recipient with pagination
   * @param recipientId Recipient ID
   * @param active Active status (default: true)
   * @param page Page number (default: 0)
   * @param size Page size (default: 20)
   * @returns Response with paginated notifications
   */
  getByRecipientAndActive: async (recipientId: number, active: boolean = true, page: number = 0, size: number = 20): Promise<AxiosResponse<NotificationPageResponse>> => {
    return api.get(`/notifications/recipient/${recipientId}/active?active=${active}&page=${page}&size=${size}`);
  },

  /**
   * Get notifications by type for a recipient with pagination
   * @param recipientId Recipient ID
   * @param type Notification type
   * @param page Page number (default: 0)
   * @param size Page size (default: 20)
   * @returns Response with paginated notifications
   */
  getByRecipientAndType: async (recipientId: number, type: string, page: number = 0, size: number = 20): Promise<AxiosResponse<NotificationPageResponse>> => {
    return api.get(`/notifications/recipient/${recipientId}/type/${type}?page=${page}&size=${size}`);
  },

  /**
   * Get active notifications by type for a recipient with pagination
   * @param recipientId Recipient ID
   * @param type Notification type
   * @param active Active status (default: true)
   * @param page Page number (default: 0)
   * @param size Page size (default: 20)
   * @returns Response with paginated notifications
   */
  getByRecipientAndTypeAndActive: async (recipientId: number, type: string, active: boolean = true, page: number = 0, size: number = 20): Promise<AxiosResponse<NotificationPageResponse>> => {
    return api.get(`/notifications/recipient/${recipientId}/type/${type}/active?active=${active}&page=${page}&size=${size}`);
  },

  /**
   * Get unread notifications for a recipient
   * @param recipientId Recipient ID
   * @returns Response with unread notifications
   */
  getUnreadByRecipient: async (recipientId: number): Promise<AxiosResponse<NotificationResponse>> => {
    return api.get(`/notifications/recipient/${recipientId}/unread`);
  },

  /**
   * Get count of unread notifications for a recipient
   * @param recipientId Recipient ID
   * @returns Response with unread count
   */
  getUnreadCountByRecipient: async (recipientId: number): Promise<AxiosResponse<NotificationCountResponse>> => {
    return api.get(`/notifications/recipient/${recipientId}/unread/count`);
  },

  /**
   * Create a new notification
   * @param notificationData Notification data
   * @returns Response with created notification details
   */
  create: async (notificationData: CreateNotificationRequest): Promise<AxiosResponse<NotificationResponse>> => {
    return api.post('/notifications', notificationData);
  },

  /**
   * Update an existing notification
   * @param id Notification ID
   * @param notificationData Updated notification data
   * @returns Response with updated notification details
   */
  update: async (id: number, notificationData: UpdateNotificationRequest): Promise<AxiosResponse<NotificationResponse>> => {
    return api.put(`/notifications/${id}`, notificationData);
  },

  /**
   * Mark a notification as read
   * @param id Notification ID
   * @returns Response with updated notification
   */
  markAsRead: async (id: number): Promise<AxiosResponse<NotificationResponse>> => {
    return api.post(`/notifications/${id}/mark-read`);
  },

  /**
   * Mark all notifications as read for a recipient
   * @param recipientId Recipient ID
   * @returns Response indicating success/failure
   */
  markAllAsRead: async (recipientId: number): Promise<AxiosResponse<void>> => {
    return api.post(`/notifications/recipient/${recipientId}/mark-all-read`);
  },

  /**
   * Archive a notification
   * @param id Notification ID
   * @returns Response with updated notification
   */
  archive: async (id: number): Promise<AxiosResponse<NotificationResponse>> => {
    return api.post(`/notifications/${id}/archive`);
  },

  /**
   * Unarchive a notification
   * @param id Notification ID
   * @returns Response with updated notification
   */
  unarchive: async (id: number): Promise<AxiosResponse<NotificationResponse>> => {
    return api.post(`/notifications/${id}/unarchive`);
  },

  /**
   * Delete a notification
   * @param id Notification ID
   * @returns Response indicating success/failure
   */
  delete: async (id: number): Promise<AxiosResponse<NotificationResponse>> => {
    return api.delete(`/notifications/${id}`);
  },

  /**
   * Bulk mark notifications as read
   * @param notificationIds Array of notification IDs
   * @returns Response indicating success/failure
   */
  bulkMarkAsRead: async (notificationIds: number[]): Promise<AxiosResponse<void>> => {
    return api.post('/notifications/bulk/mark-read', { notificationIds });
  },

  /**
   * Bulk archive notifications
   * @param notificationIds Array of notification IDs
   * @returns Response indicating success/failure
   */
  bulkArchive: async (notificationIds: number[]): Promise<AxiosResponse<void>> => {
    return api.post('/notifications/bulk/archive', { notificationIds });
  },

  /**
   * Bulk delete notifications
   * @param notificationIds Array of notification IDs
   * @returns Response indicating success/failure
   */
  bulkDelete: async (notificationIds: number[]): Promise<AxiosResponse<void>> => {
    return api.delete('/notifications/bulk', { data: { notificationIds } });
  },
};

export default notificationApi; 