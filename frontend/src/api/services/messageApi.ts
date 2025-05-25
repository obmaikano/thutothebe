import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface Message {
  id: number;
  content: string;
  senderId: number;
  recipientId?: number;
  groupId?: number;
  createdAt: string;
  active: boolean;
}

export interface MessageGroup {
  id: number;
  name: string;
  description?: string;
  creatorId: number;
  memberIds?: number[];
  active: boolean;
}

export interface MessageResponse {
  status: string;
  message: string;
  data: Message | Message[] | null;
  timestamp: string | null;
}

export interface MessageGroupResponse {
  status: string;
  message: string;
  data: MessageGroup | MessageGroup[] | null;
  timestamp: string | null;
}

export interface CreateMessageRequest {
  content: string;
  senderId: number;
  recipientId?: number;
  groupId?: number | null;
  active?: boolean;
}

export interface CreateMessageGroupRequest {
  name: string;
  description?: string;
  memberIds?: number[];
}

/**
 * API service for interacting with message endpoints
 */
const messageApi = {
  /**
   * Get all messages for a user
   * @param userId User ID
   * @returns Response with user's messages
   */
  getUserMessages: async (userId: number): Promise<AxiosResponse<MessageResponse>> => {
    return api.get(`/messages/user/${userId}`);
  },

  /**
   * Get active messages for a user
   * @param userId User ID
   * @returns Response with user's active messages
   */
  getUserActiveMessages: async (userId: number): Promise<AxiosResponse<MessageResponse>> => {
    return api.get(`/messages/user/${userId}/active`);
  },

  /**
   * Get conversation between two users
   * @param senderId Sender ID
   * @param recipientId Recipient ID
   * @returns Response with conversation messages
   */
  getConversation: async (senderId: number, recipientId: number): Promise<AxiosResponse<MessageResponse>> => {
    return api.get('/messages/conversation', {
      params: { senderId, recipientId }
    });
  },

  /**
   * Get active conversation between two users
   * @param senderId Sender ID
   * @param recipientId Recipient ID
   * @returns Response with active conversation messages
   */
  getActiveConversation: async (senderId: number, recipientId: number): Promise<AxiosResponse<MessageResponse>> => {
    return api.get('/messages/conversation/active', {
      params: { senderId, recipientId }
    });
  },

  /**
   * Get messages in a group
   * @param groupId Group ID
   * @returns Response with group messages
   */
  getGroupMessages: async (groupId: number): Promise<AxiosResponse<MessageResponse>> => {
    return api.get(`/messages/group/${groupId}`);
  },

  /**
   * Get active messages in a group
   * @param groupId Group ID
   * @returns Response with active group messages
   */
  getActiveGroupMessages: async (groupId: number): Promise<AxiosResponse<MessageResponse>> => {
    return api.get(`/messages/group/${groupId}/active`);
  },

  /**
   * Send a new message
   * @param messageData Message data
   * @returns Response with created message
   */
  sendMessage: async (messageData: CreateMessageRequest): Promise<AxiosResponse<MessageResponse>> => {
    return api.post('/messages', messageData);
  },

  /**
   * Update a message
   * @param id Message ID
   * @param messageData Updated message data
   * @returns Response with updated message
   */
  updateMessage: async (id: number, messageData: Partial<CreateMessageRequest>): Promise<AxiosResponse<MessageResponse>> => {
    return api.put(`/messages/${id}`, messageData);
  },

  /**
   * Delete a message
   * @param id Message ID
   * @returns Response indicating success/failure
   */
  deleteMessage: async (id: number): Promise<AxiosResponse<MessageResponse>> => {
    return api.delete(`/messages/${id}`);
  },

  /**
   * Get message groups for a user (as creator)
   * @param creatorId Creator ID
   * @returns Response with user's created groups
   */
  getUserGroups: async (creatorId: number): Promise<AxiosResponse<MessageGroupResponse>> => {
    return api.get(`/message-groups/creator/${creatorId}`);
  },

  /**
   * Get active message groups for a user (as creator)
   * @param creatorId Creator ID
   * @returns Response with user's active created groups
   */
  getUserActiveGroups: async (creatorId: number): Promise<AxiosResponse<MessageGroupResponse>> => {
    return api.get(`/message-groups/creator/${creatorId}/active`);
  },

  /**
   * Get groups where user is a member
   * @param memberId Member ID
   * @returns Response with groups where user is a member
   */
  getMemberGroups: async (memberId: number): Promise<AxiosResponse<MessageGroupResponse>> => {
    return api.get(`/message-groups/member/${memberId}`);
  },

  /**
   * Get active groups where user is a member
   * @param memberId Member ID
   * @returns Response with active groups where user is a member
   */
  getActiveMemberGroups: async (memberId: number): Promise<AxiosResponse<MessageGroupResponse>> => {
    return api.get(`/message-groups/member/${memberId}/active`);
  },

  /**
   * Create a new message group
   * @param groupData Group data
   * @returns Response with created group
   */
  createGroup: async (groupData: CreateMessageGroupRequest): Promise<AxiosResponse<MessageGroupResponse>> => {
    return api.post('/message-groups', groupData);
  },

  /**
   * Update a message group
   * @param id Group ID
   * @param groupData Updated group data
   * @returns Response with updated group
   */
  updateGroup: async (id: number, groupData: Partial<CreateMessageGroupRequest>): Promise<AxiosResponse<MessageGroupResponse>> => {
    return api.put(`/message-groups/${id}`, groupData);
  },

  /**
   * Delete a message group
   * @param id Group ID
   * @returns Response indicating success/failure
   */
  deleteGroup: async (id: number): Promise<AxiosResponse<MessageGroupResponse>> => {
    return api.delete(`/message-groups/${id}`);
  },

  /**
   * Add a member to a group
   * @param groupId Group ID
   * @param userId User ID
   * @returns Response with updated group
   */
  addGroupMember: async (groupId: number, userId: number): Promise<AxiosResponse<MessageGroupResponse>> => {
    return api.post(`/message-groups/${groupId}/members/${userId}`);
  },

  /**
   * Remove a member from a group
   * @param groupId Group ID
   * @param userId User ID
   * @returns Response with updated group
   */
  removeGroupMember: async (groupId: number, userId: number): Promise<AxiosResponse<MessageGroupResponse>> => {
    return api.delete(`/message-groups/${groupId}/members/${userId}`);
  },

  /**
   * Get group with members and messages
   * @param id Group ID
   * @returns Response with detailed group information
   */
  getGroupDetails: async (id: number): Promise<AxiosResponse<MessageGroupResponse>> => {
    return api.get(`/message-groups/${id}/with-members-messages`);
  },

  /**
   * Get contacts for a student
   * @param studentId Student ID
   * @returns Response with available contacts
   */
  getContactsForStudent: async (studentId: number): Promise<AxiosResponse<{ status: string; message: string; data: any[] | null; timestamp: string | null; }>> => {
    return api.get(`/messages/contacts/student/${studentId}`);
  },

  /**
   * Get conversations for a user
   * @param userId User ID
   * @returns Response with user's conversations
   */
  getConversationsForUser: async (userId: number): Promise<AxiosResponse<{ status: string; message: string; data: any[] | null; timestamp: string | null; }>> => {
    return api.get(`/messages/conversations/user/${userId}`);
  }
};

export default messageApi; 