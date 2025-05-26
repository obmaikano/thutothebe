import { api } from '../index';
import { AxiosResponse } from 'axios';

// Message Types enum to match backend
export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
  SYSTEM = 'SYSTEM',
  TYPING_INDICATOR = 'TYPING_INDICATOR'
}

// Updated Message interface to match backend MessageDTO
export interface Message {
  id: number;
  content: string;
  senderId: number;
  senderName?: string;
  recipientId?: number;
  recipientName?: string;
  groupId?: number;
  groupName?: string;
  messageType: MessageType;
  createdAt: string;
  updatedAt?: string;
  active: boolean;
  
  // Real-time messaging fields
  isDelivered: boolean;
  isRead: boolean;
  deliveredAt?: string;
  readAt?: string;
  replyToMessageId?: number;
  edited: boolean;
  editedAt?: string;
}

// Real-time message DTO for WebSocket communication
export interface RealTimeMessage {
  id: number;
  content: string;
  senderId: number;
  senderName: string;
  senderRole: string;
  recipientId?: number;
  recipientName?: string;
  groupId?: number;
  groupName?: string;
  createdAt: string;
  updatedAt?: string;
  active: boolean;
  
  // Real-time specific fields
  eventType: 'SENT' | 'UPDATED' | 'DELETED' | 'DELIVERED' | 'READ' | 'TYPING';
  channelId: string;
  message?: string;
  
  // Message status fields
  isDelivered: boolean;
  isRead: boolean;
  deliveredAt?: string;
  readAt?: string;
  
  // Typing indicator fields
  isTyping: boolean;
  typingUserId?: number;
  typingUserName?: string;
}

export interface MessageGroup {
  id: number;
  name: string;
  description?: string;
  creatorId: number;
  memberIds?: number[];
  active: boolean;
}

export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
}

export interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  type: 'individual' | 'group';
  participantId?: number;
  groupId?: number;
  avatar?: string;
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

export interface ContactResponse {
  status: string;
  message: string;
  data: Contact[] | null;
  timestamp: string | null;
}

export interface ConversationResponse {
  status: string;
  message: string;
  data: Conversation[] | null;
  timestamp: string | null;
}

export interface UnreadCountResponse {
  status: string;
  message: string;
  data: number | null;
  timestamp: string | null;
}

export interface CreateMessageRequest {
  content: string;
  senderId: number;
  recipientId?: number;
  groupId?: number;
  messageType: MessageType;
  active?: boolean;
  replyToMessageId?: number;
}

export interface UpdateMessageRequest {
  content: string;
  messageType?: MessageType;
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
  // Basic message operations
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
   * @param active Active status (default: true)
   * @returns Response with user's active messages
   */
  getUserActiveMessages: async (userId: number, active: boolean = true): Promise<AxiosResponse<MessageResponse>> => {
    return api.get(`/messages/user/${userId}/active`, { params: { active } });
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
   * @param active Active status (default: true)
   * @returns Response with active conversation messages
   */
  getActiveConversation: async (senderId: number, recipientId: number, active: boolean = true): Promise<AxiosResponse<MessageResponse>> => {
    return api.get('/messages/conversation/active', {
      params: { senderId, recipientId, active }
    });
  },

  /**
   * Get conversation messages between two users (ordered chronologically)
   * @param userId1 First user ID
   * @param userId2 Second user ID
   * @returns Response with conversation messages
   */
  getConversationMessages: async (userId1: number, userId2: number): Promise<AxiosResponse<MessageResponse>> => {
    return api.get(`/messages/conversation/${userId1}/${userId2}`);
  },

  /**
   * Get active conversation messages between two users
   * @param userId1 First user ID
   * @param userId2 Second user ID
   * @returns Response with active conversation messages
   */
  getActiveConversationMessages: async (userId1: number, userId2: number): Promise<AxiosResponse<MessageResponse>> => {
    return api.get(`/messages/conversation/${userId1}/${userId2}/active`);
  },

  // Group messaging
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
   * @param active Active status (default: true)
   * @returns Response with active group messages
   */
  getActiveGroupMessages: async (groupId: number, active: boolean = true): Promise<AxiosResponse<MessageResponse>> => {
    return api.get(`/messages/group/${groupId}/active`, { params: { active } });
  },

  // Contacts and conversations
  /**
   * Get contacts for a student
   * @param studentId Student ID
   * @returns Response with available contacts
   */
  getContactsForStudent: async (studentId: number): Promise<AxiosResponse<ContactResponse>> => {
    return api.get(`/messages/contacts/student/${studentId}`);
  },

  /**
   * Get conversations for a user
   * @param userId User ID
   * @returns Response with user's conversations
   */
  getConversationsForUser: async (userId: number): Promise<AxiosResponse<ConversationResponse>> => {
    return api.get(`/messages/conversations/user/${userId}`);
  },

  // Message CRUD operations
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
  updateMessage: async (id: number, messageData: UpdateMessageRequest): Promise<AxiosResponse<MessageResponse>> => {
    return api.put(`/messages/${id}`, messageData);
  },

  /**
   * Update a message with user authorization
   * @param messageId Message ID
   * @param messageData Updated message data
   * @param userId User ID for authorization
   * @returns Response with updated message
   */
  updateMessageWithAuth: async (messageId: number, messageData: UpdateMessageRequest, userId: number): Promise<AxiosResponse<MessageResponse>> => {
    return api.put(`/messages/${messageId}/update`, messageData, { params: { userId } });
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
   * Delete a message with user authorization
   * @param messageId Message ID
   * @param userId User ID for authorization
   * @returns Response indicating success/failure
   */
  deleteMessageWithAuth: async (messageId: number, userId: number): Promise<AxiosResponse<MessageResponse>> => {
    return api.delete(`/messages/${messageId}/delete`, { params: { userId } });
  },

  // Real-time messaging operations
  /**
   * Mark message as delivered
   * @param messageId Message ID
   * @param userId User ID
   * @returns Response indicating success/failure
   */
  markMessageAsDelivered: async (messageId: number, userId: number): Promise<AxiosResponse<MessageResponse>> => {
    return api.post(`/messages/${messageId}/delivered`, null, { params: { userId } });
  },

  /**
   * Mark message as read
   * @param messageId Message ID
   * @param userId User ID
   * @returns Response indicating success/failure
   */
  markMessageAsRead: async (messageId: number, userId: number): Promise<AxiosResponse<MessageResponse>> => {
    return api.post(`/messages/${messageId}/read`, null, { params: { userId } });
  },

  /**
   * Mark conversation as read
   * @param userId User ID
   * @param partnerId Partner ID
   * @returns Response indicating success/failure
   */
  markConversationAsRead: async (userId: number, partnerId: number): Promise<AxiosResponse<MessageResponse>> => {
    return api.post('/messages/conversation/read', null, { params: { userId, partnerId } });
  },

  /**
   * Mark group messages as read
   * @param groupId Group ID
   * @param userId User ID
   * @returns Response indicating success/failure
   */
  markGroupMessagesAsRead: async (groupId: number, userId: number): Promise<AxiosResponse<MessageResponse>> => {
    return api.post(`/messages/group/${groupId}/read`, null, { params: { userId } });
  },

  // Unread count operations
  /**
   * Get unread message count for user
   * @param userId User ID
   * @returns Response with unread count
   */
  getUnreadMessageCount: async (userId: number): Promise<AxiosResponse<UnreadCountResponse>> => {
    return api.get(`/messages/unread-count/${userId}`);
  },

  /**
   * Get unread message count for conversation
   * @param userId User ID
   * @param partnerId Partner ID
   * @returns Response with unread count
   */
  getUnreadMessageCountForConversation: async (userId: number, partnerId: number): Promise<AxiosResponse<UnreadCountResponse>> => {
    return api.get(`/messages/unread-count/conversation/${userId}/${partnerId}`);
  },

  /**
   * Get unread message count for group
   * @param userId User ID
   * @param groupId Group ID
   * @returns Response with unread count
   */
  getUnreadMessageCountForGroup: async (userId: number, groupId: number): Promise<AxiosResponse<UnreadCountResponse>> => {
    return api.get(`/messages/unread-count/group/${userId}/${groupId}`);
  },

  // Message group operations
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
  }
};

export default messageApi; 