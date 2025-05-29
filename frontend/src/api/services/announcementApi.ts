import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface Announcement {
  id: number;
  title: string;
  content: string;
  type: 'SYSTEM' | 'ACADEMIC' | 'ADMINISTRATIVE' | 'EVENT' | 'EMERGENCY' | 'HOLIDAY' | 'EXAM' | 'GENERAL';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  creatorId: number;
  creatorName?: string;
  creatorRole: string;
  targetRegionId?: number;
  targetRegionName?: string;
  targetSchoolId?: number;
  targetSchoolName?: string;
  targetRole?: string;
  targetDepartment?: string;
  targetClass?: string;
  startDate?: string;
  endDate?: string;
  commentsEnabled: boolean;
  acknowledgmentRequired: boolean;
  attachmentUrls?: string[];
  tags?: string[];
  active: boolean;
  createdAt: string;
  modifiedAt?: string;
  readCount?: number;
  acknowledgmentCount?: number;
  targetUserCount?: number;
  isRead?: boolean;
  isAcknowledged?: boolean;
}

export interface AnnouncementReadReceipt {
  id: number;
  announcementId: number;
  userId: number;
  readAt: string;
  ipAddress?: string;
  userAgent?: string;
  active: boolean;
  createdAt: string;
}

export interface AnnouncementAcknowledgment {
  id: number;
  announcementId: number;
  userId: number;
  acknowledgedAt: string;
  note?: string;
  ipAddress?: string;
  userAgent?: string;
  active: boolean;
  createdAt: string;
}

export interface AnnouncementResponse {
  status: string;
  message: string;
  data: Announcement | Announcement[] | null;
  timestamp: string | null;
}

export interface PagedAnnouncementResponse {
  status: string;
  message: string;
  data: {
    content: Announcement[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
  } | null;
  timestamp: string | null;
}

export interface ReadReceiptResponse {
  status: string;
  message: string;
  data: AnnouncementReadReceipt | AnnouncementReadReceipt[] | null;
  timestamp: string | null;
}

export interface AcknowledgmentResponse {
  status: string;
  message: string;
  data: AnnouncementAcknowledgment | AnnouncementAcknowledgment[] | null;
  timestamp: string | null;
}

export type CreateAnnouncementRequest = Omit<Announcement, 'id' | 'createdAt' | 'modifiedAt' | 'readCount' | 'acknowledgmentCount' | 'targetUserCount' | 'isRead' | 'isAcknowledged' | 'creatorName' | 'targetRegionName' | 'targetSchoolName'>;
export type UpdateAnnouncementRequest = Partial<CreateAnnouncementRequest>;

/**
 * API service for interacting with announcement endpoints
 */
const announcementApi = {
  /**
   * Get all announcements
   * @returns Response with a list of announcements
   */
  getAll: async (): Promise<AxiosResponse<AnnouncementResponse>> => {
    return api.get('/announcements');
  },

  /**
   * Get announcement by ID
   * @param id Announcement ID
   * @returns Response with announcement details
   */
  getById: async (id: number): Promise<AxiosResponse<AnnouncementResponse>> => {
    return api.get(`/announcements/${id}`);
  },

  /**
   * Get announcement by ID with user-specific status
   * @param id Announcement ID
   * @param userId User ID
   * @returns Response with announcement details including user status
   */
  getByIdWithUserStatus: async (id: number, userId: number): Promise<AxiosResponse<AnnouncementResponse>> => {
    return api.get(`/announcements/${id}/user/${userId}`);
  },

  /**
   * Get announcements for a specific user
   * @param userId User ID
   * @param page Page number (default: 0)
   * @param size Page size (default: 20)
   * @returns Response with paginated announcements
   */
  getForUser: async (userId: number, page: number = 0, size: number = 20): Promise<AxiosResponse<PagedAnnouncementResponse>> => {
    return api.get(`/announcements/user/${userId}?page=${page}&size=${size}`);
  },

  /**
   * Get announcements by type for a user
   * @param userId User ID
   * @param type Announcement type
   * @param page Page number (default: 0)
   * @param size Page size (default: 20)
   * @returns Response with paginated announcements
   */
  getByType: async (userId: number, type: string, page: number = 0, size: number = 20): Promise<AxiosResponse<PagedAnnouncementResponse>> => {
    return api.get(`/announcements/user/${userId}/type/${type}?page=${page}&size=${size}`);
  },

  /**
   * Get announcements created by a specific user
   * @param creatorId Creator ID
   * @param page Page number (default: 0)
   * @param size Page size (default: 20)
   * @returns Response with paginated announcements
   */
  getByCreator: async (creatorId: number, page: number = 0, size: number = 20): Promise<AxiosResponse<PagedAnnouncementResponse>> => {
    return api.get(`/announcements/creator/${creatorId}?page=${page}&size=${size}`);
  },

  /**
   * Get global announcements
   * @param page Page number (default: 0)
   * @param size Page size (default: 20)
   * @returns Response with paginated announcements
   */
  getGlobal: async (page: number = 0, size: number = 20): Promise<AxiosResponse<PagedAnnouncementResponse>> => {
    return api.get(`/announcements/global?page=${page}&size=${size}`);
  },

  /**
   * Search announcements for a user
   * @param userId User ID
   * @param searchTerm Search term
   * @param page Page number (default: 0)
   * @param size Page size (default: 20)
   * @returns Response with paginated announcements
   */
  search: async (userId: number, searchTerm: string, page: number = 0, size: number = 20): Promise<AxiosResponse<PagedAnnouncementResponse>> => {
    return api.get(`/announcements/user/${userId}/search?searchTerm=${encodeURIComponent(searchTerm)}&page=${page}&size=${size}`);
  },

  /**
   * Get announcements by tag for a user
   * @param userId User ID
   * @param tag Tag
   * @param page Page number (default: 0)
   * @param size Page size (default: 20)
   * @returns Response with paginated announcements
   */
  getByTag: async (userId: number, tag: string, page: number = 0, size: number = 20): Promise<AxiosResponse<PagedAnnouncementResponse>> => {
    return api.get(`/announcements/user/${userId}/tag/${tag}?page=${page}&size=${size}`);
  },

  /**
   * Create a new announcement
   * @param creatorId Creator ID
   * @param announcementData Announcement data
   * @returns Response with created announcement details
   */
  create: async (creatorId: number, announcementData: CreateAnnouncementRequest): Promise<AxiosResponse<AnnouncementResponse>> => {
    return api.post(`/announcements/create/${creatorId}`, announcementData);
  },

  /**
   * Update an existing announcement
   * @param id Announcement ID
   * @param userId User ID
   * @param announcementData Updated announcement data
   * @returns Response with updated announcement details
   */
  update: async (id: number, userId: number, announcementData: UpdateAnnouncementRequest): Promise<AxiosResponse<AnnouncementResponse>> => {
    return api.put(`/announcements/${id}/update/${userId}`, announcementData);
  },

  /**
   * Delete an announcement
   * @param id Announcement ID
   * @param userId User ID
   * @returns Response indicating success/failure
   */
  delete: async (id: number, userId: number): Promise<AxiosResponse<AnnouncementResponse>> => {
    return api.delete(`/announcements/${id}/delete/${userId}`);
  },

  /**
   * Mark an announcement as read
   * @param announcementId Announcement ID
   * @param userId User ID
   * @returns Response indicating success/failure
   */
  markAsRead: async (announcementId: number, userId: number): Promise<AxiosResponse<ReadReceiptResponse>> => {
    return api.post(`/announcements/${announcementId}/read/${userId}`);
  },

  /**
   * Acknowledge an announcement
   * @param announcementId Announcement ID
   * @param userId User ID
   * @param note Optional acknowledgment note
   * @returns Response indicating success/failure
   */
  acknowledge: async (announcementId: number, userId: number, note?: string): Promise<AxiosResponse<AcknowledgmentResponse>> => {
    const params = note ? `?note=${encodeURIComponent(note)}` : '';
    return api.post(`/announcements/${announcementId}/acknowledge/${userId}${params}`);
  },

  /**
   * Get pending acknowledgments count for a user
   * @param userId User ID
   * @returns Response with count
   */
  getPendingAcknowledgmentsCount: async (userId: number): Promise<AxiosResponse<{ data: number }>> => {
    return api.get(`/announcements/user/${userId}/pending-acknowledgments/count`);
  },

  /**
   * Get read receipts for an announcement
   * @param announcementId Announcement ID
   * @param requesterId Requester ID
   * @returns Response with read receipts
   */
  getReadReceipts: async (announcementId: number, requesterId: number): Promise<AxiosResponse<ReadReceiptResponse>> => {
    return api.get(`/announcements/${announcementId}/read-receipts/${requesterId}`);
  },

  /**
   * Get acknowledgments for an announcement
   * @param announcementId Announcement ID
   * @param requesterId Requester ID
   * @returns Response with acknowledgments
   */
  getAcknowledgments: async (announcementId: number, requesterId: number): Promise<AxiosResponse<AcknowledgmentResponse>> => {
    return api.get(`/announcements/${announcementId}/acknowledgments/${requesterId}`);
  },

  /**
   * Toggle announcement status (activate/deactivate)
   * @param id Announcement ID
   * @param userId User ID
   * @returns Response with updated announcement details
   */
  toggleStatus: async (id: number, userId: number): Promise<AxiosResponse<AnnouncementResponse>> => {
    return api.put(`/announcements/${id}/toggle-status/${userId}`);
  },
};

export default announcementApi; 