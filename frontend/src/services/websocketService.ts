// Import polyfills first to ensure global variables are available
import '../utils/polyfills';

import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { RealTimeMessage } from '../api/services/messageApi';

export interface WebSocketConfig {
  url: string;
  reconnectDelay?: number;
  heartbeatIncoming?: number;
  heartbeatOutgoing?: number;
  debug?: boolean;
}

export interface TypingIndicator {
  userId: number;
  channelId: string;
  isTyping: boolean;
}

export interface MessageReadStatus {
  messageId: number;
  userId: number;
}

export interface ConversationReadStatus {
  userId: number;
  partnerId: number;
}

export interface GroupReadStatus {
  groupId: number;
  userId: number;
}

export interface UnreadCountUpdate {
  userId: number;
  totalCount: number;
  channelId?: string;
  channelCount?: number;
}

export type MessageEventHandler = (message: RealTimeMessage) => void;
export type TypingEventHandler = (typing: TypingIndicator) => void;
export type UnreadCountEventHandler = (update: UnreadCountUpdate) => void;
export type ConnectionEventHandler = (connected: boolean) => void;

class WebSocketService {
  private client: Client | null = null;
  private subscriptions: Map<string, StompSubscription> = new Map();
  private messageHandlers: Set<MessageEventHandler> = new Set();
  private typingHandlers: Set<TypingEventHandler> = new Set();
  private unreadCountHandlers: Set<UnreadCountEventHandler> = new Set();
  private connectionHandlers: Set<ConnectionEventHandler> = new Set();
  private isConnected = false;
  private currentUserId: number | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;

  /**
   * Initialize WebSocket connection
   */
  connect(config: WebSocketConfig, userId: number, authToken?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.client && this.isConnected) {
        resolve();
        return;
      }

      this.currentUserId = userId;

      // Create STOMP client with SockJS
      this.client = new Client({
        webSocketFactory: () => new SockJS(config.url),
        connectHeaders: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        debug: config.debug ? (str: string) => console.log('STOMP Debug:', str) : undefined,
        reconnectDelay: config.reconnectDelay || this.reconnectDelay,
        heartbeatIncoming: config.heartbeatIncoming || 4000,
        heartbeatOutgoing: config.heartbeatOutgoing || 4000,
      });

      // Connection event handlers
      this.client.onConnect = (frame: any) => {
        console.log('WebSocket connected:', frame);
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.notifyConnectionHandlers(true);
        this.subscribeToUserChannels(userId);
        resolve();
      };

      this.client.onDisconnect = (frame: any) => {
        console.log('WebSocket disconnected:', frame);
        this.isConnected = false;
        this.notifyConnectionHandlers(false);
        this.clearSubscriptions();
      };

      this.client.onStompError = (frame: any) => {
        console.error('STOMP error:', frame);
        this.isConnected = false;
        this.notifyConnectionHandlers(false);
        reject(new Error(`STOMP error: ${frame.headers['message']}`));
      };

      this.client.onWebSocketError = (error: any) => {
        console.error('WebSocket error:', error);
        this.isConnected = false;
        this.notifyConnectionHandlers(false);
      };

      this.client.onWebSocketClose = (event: any) => {
        console.log('WebSocket closed:', event);
        this.isConnected = false;
        this.notifyConnectionHandlers(false);
        this.handleReconnection();
      };

      // Activate the client
      this.client.activate();
    });
  }

  /**
   * Disconnect WebSocket
   */
  disconnect(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.client) {
        resolve();
        return;
      }

      this.client.onDisconnect = () => {
        this.isConnected = false;
        this.currentUserId = null;
        this.clearSubscriptions();
        this.notifyConnectionHandlers(false);
        resolve();
      };

      this.client.deactivate();
    });
  }

  /**
   * Subscribe to user-specific channels
   */
  private subscribeToUserChannels(userId: number): void {
    if (!this.client || !this.isConnected) return;

    // Subscribe to user's personal message queue
    this.subscribeToChannel(`/user/${userId}/queue/messages`, (message) => {
      this.handleIncomingMessage(message);
    });

    // Subscribe to user's notification queue
    this.subscribeToChannel(`/user/${userId}/queue/notifications`, (message) => {
      this.handleNotification(message);
    });

    // Subscribe to user's unread count updates
    this.subscribeToChannel(`/user/${userId}/queue/unread-count`, (message) => {
      this.handleUnreadCountUpdate(message);
    });
  }

  /**
   * Subscribe to a specific channel
   */
  subscribeToChannel(destination: string, handler: (message: IMessage) => void): void {
    if (!this.client || !this.isConnected) {
      console.warn('WebSocketService: Cannot subscribe to channel - not connected:', destination);
      return;
    }

    console.log('WebSocketService: Subscribing to channel:', destination);
    const subscription = this.client.subscribe(destination, handler);
    this.subscriptions.set(destination, subscription);
    console.log(`WebSocketService: Successfully subscribed to channel: ${destination}`);
  }

  /**
   * Subscribe to conversation channel
   */
  subscribeToConversation(userId1: number, userId2: number): void {
    const channelId = this.generateConversationChannelId(userId1, userId2);
    console.log('WebSocketService: Subscribing to conversation channel:', channelId);
    this.subscribeToChannel(`/topic/messages/${channelId}`, (message) => {
      console.log('WebSocketService: Received message on conversation channel:', channelId, message);
      this.handleIncomingMessage(message);
    });
  }

  /**
   * Subscribe to group channel
   */
  subscribeToGroup(groupId: number): void {
    this.subscribeToChannel(`/topic/messages/group:${groupId}`, (message) => {
      this.handleIncomingMessage(message);
    });
  }

  /**
   * Unsubscribe from a channel
   */
  unsubscribeFromChannel(destination: string): void {
    const subscription = this.subscriptions.get(destination);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(destination);
      console.log(`Unsubscribed from channel: ${destination}`);
    }
  }

  /**
   * Send typing indicator
   */
  sendTypingIndicator(userId: number, channelId: string, isTyping: boolean): void {
    if (!this.client || !this.isConnected) return;

    this.client.publish({
      destination: '/app/messages/typing',
      body: JSON.stringify({
        userId,
        channelId,
        isTyping
      })
    });
  }

  /**
   * Mark message as delivered
   */
  markMessageAsDelivered(messageId: number, userId: number): void {
    if (!this.client || !this.isConnected) return;

    this.client.publish({
      destination: '/app/messages/mark-delivered',
      body: JSON.stringify({
        messageId,
        userId
      })
    });
  }

  /**
   * Mark message as read
   */
  markMessageAsRead(messageId: number, userId: number): void {
    if (!this.client || !this.isConnected) return;

    this.client.publish({
      destination: '/app/messages/mark-read',
      body: JSON.stringify({
        messageId,
        userId
      })
    });
  }

  /**
   * Mark conversation as read
   */
  markConversationAsRead(userId: number, partnerId: number): void {
    if (!this.client || !this.isConnected) return;

    this.client.publish({
      destination: '/app/messages/mark-conversation-read',
      body: JSON.stringify({
        userId,
        partnerId
      })
    });
  }

  /**
   * Send ping to check connection
   */
  ping(): void {
    if (!this.client || !this.isConnected) return;

    this.client.publish({
      destination: '/app/messages/ping',
      body: JSON.stringify({
        timestamp: Date.now()
      })
    });
  }

  /**
   * Handle incoming real-time messages
   */
  private handleIncomingMessage(message: IMessage): void {
    try {
      console.log('WebSocketService: Raw incoming message:', message.body);
      const realTimeMessage: RealTimeMessage = JSON.parse(message.body);
      console.log('WebSocketService: Parsed real-time message:', realTimeMessage);
      
      // Notify all message handlers
      console.log('WebSocketService: Notifying', this.messageHandlers.size, 'message handlers');
      this.messageHandlers.forEach(handler => {
        try {
          handler(realTimeMessage);
        } catch (error) {
          console.error('Error in message handler:', error);
        }
      });

      // Handle typing indicators
      if (realTimeMessage.eventType === 'TYPING') {
        const typingIndicator: TypingIndicator = {
          userId: realTimeMessage.typingUserId || realTimeMessage.senderId,
          channelId: realTimeMessage.channelId,
          isTyping: realTimeMessage.isTyping
        };
        
        this.typingHandlers.forEach(handler => {
          try {
            handler(typingIndicator);
          } catch (error) {
            console.error('Error in typing handler:', error);
          }
        });
      }
    } catch (error) {
      console.error('Error parsing incoming message:', error);
    }
  }

  /**
   * Handle notifications
   */
  private handleNotification(message: IMessage): void {
    try {
      const notification = JSON.parse(message.body);
      console.log('Received notification:', notification);
      // Handle notifications as needed
    } catch (error) {
      console.error('Error parsing notification:', error);
    }
  }

  /**
   * Handle unread count updates
   */
  private handleUnreadCountUpdate(message: IMessage): void {
    try {
      const update: UnreadCountUpdate = JSON.parse(message.body);
      console.log('Received unread count update:', update);
      
      this.unreadCountHandlers.forEach(handler => {
        try {
          handler(update);
        } catch (error) {
          console.error('Error in unread count handler:', error);
        }
      });
    } catch (error) {
      console.error('Error parsing unread count update:', error);
    }
  }

  /**
   * Handle reconnection logic
   */
  private handleReconnection(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1); // Exponential backoff
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      if (this.client && this.currentUserId) {
        this.client.activate();
      }
    }, delay);
  }

  /**
   * Clear all subscriptions
   */
  private clearSubscriptions(): void {
    this.subscriptions.forEach((subscription, destination) => {
      subscription.unsubscribe();
      console.log(`Unsubscribed from: ${destination}`);
    });
    this.subscriptions.clear();
  }

  /**
   * Notify connection handlers
   */
  private notifyConnectionHandlers(connected: boolean): void {
    this.connectionHandlers.forEach(handler => {
      try {
        handler(connected);
      } catch (error) {
        console.error('Error in connection handler:', error);
      }
    });
  }

  /**
   * Generate conversation channel ID
   */
  private generateConversationChannelId(userId1: number, userId2: number): string {
    const sortedIds = [userId1, userId2].sort((a, b) => a - b);
    return `conversation:${sortedIds[0]}:${sortedIds[1]}`;
  }

  // Event handler management
  addMessageHandler(handler: MessageEventHandler): void {
    this.messageHandlers.add(handler);
  }

  removeMessageHandler(handler: MessageEventHandler): void {
    this.messageHandlers.delete(handler);
  }

  addTypingHandler(handler: TypingEventHandler): void {
    this.typingHandlers.add(handler);
  }

  removeTypingHandler(handler: TypingEventHandler): void {
    this.typingHandlers.delete(handler);
  }

  addUnreadCountHandler(handler: UnreadCountEventHandler): void {
    this.unreadCountHandlers.add(handler);
  }

  removeUnreadCountHandler(handler: UnreadCountEventHandler): void {
    this.unreadCountHandlers.delete(handler);
  }

  addConnectionHandler(handler: ConnectionEventHandler): void {
    this.connectionHandlers.add(handler);
  }

  removeConnectionHandler(handler: ConnectionEventHandler): void {
    this.connectionHandlers.delete(handler);
  }

  // Getters
  get connected(): boolean {
    return this.isConnected;
  }

  get userId(): number | null {
    return this.currentUserId;
  }
}

// Export singleton instance
export const webSocketService = new WebSocketService();
export default webSocketService; 