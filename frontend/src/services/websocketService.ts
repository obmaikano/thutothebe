// Import polyfills first to ensure global variables are available
import '../utils/polyfills';

import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { RealTimeMessage } from '../api/services/messageApi';
import { useEffect, useRef, useState, useCallback } from 'react';

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
    console.log('WebSocketService: Subscribing to group channel:', groupId);
    this.subscribeToChannel(`/topic/groups/${groupId}/messages`, (message) => {
      console.log('WebSocketService: Received message on group channel:', groupId, message);
      this.handleIncomingMessage(message);
    });
  }

  /**
   * Unsubscribe from a specific channel
   */
  unsubscribeFromChannel(destination: string): void {
    const subscription = this.subscriptions.get(destination);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(destination);
      console.log(`WebSocketService: Unsubscribed from channel: ${destination}`);
    }
  }

  /**
   * Send typing indicator
   */
  sendTypingIndicator(userId: number, channelId: string, isTyping: boolean): void {
    if (!this.client || !this.isConnected) return;

    const typingData: TypingIndicator = {
      userId,
      channelId,
      isTyping
    };

    this.client.publish({
      destination: `/topic/typing/${channelId}`,
      body: JSON.stringify(typingData)
    });
  }

  /**
   * Mark message as delivered
   */
  markMessageAsDelivered(messageId: number, userId: number): void {
    if (!this.client || !this.isConnected) return;

    const deliveryData: MessageReadStatus = {
      messageId,
      userId
    };

    this.client.publish({
      destination: '/topic/message-delivered',
      body: JSON.stringify(deliveryData)
    });
  }

  /**
   * Mark message as read
   */
  markMessageAsRead(messageId: number, userId: number): void {
    if (!this.client || !this.isConnected) return;

    const readData: MessageReadStatus = {
      messageId,
      userId
    };

    this.client.publish({
      destination: '/topic/message-read',
      body: JSON.stringify(readData)
    });
  }

  /**
   * Mark conversation as read
   */
  markConversationAsRead(userId: number, partnerId: number): void {
    if (!this.client || !this.isConnected) return;

    const readData: ConversationReadStatus = {
      userId,
      partnerId
    };

    this.client.publish({
      destination: '/topic/conversation-read',
      body: JSON.stringify(readData)
    });
  }

  /**
   * Send ping to keep connection alive
   */
  ping(): void {
    if (!this.client || !this.isConnected) return;

    this.client.publish({
      destination: '/topic/ping',
      body: JSON.stringify({ timestamp: new Date().toISOString() })
    });
  }

  /**
   * Handle incoming message
   */
  private handleIncomingMessage(message: IMessage): void {
    try {
      const realTimeMessage: RealTimeMessage = JSON.parse(message.body);
      console.log('WebSocketService: Received message:', realTimeMessage);
      this.notifyMessageHandlers(realTimeMessage);
    } catch (error) {
      console.error('WebSocketService: Error parsing message:', error);
    }
  }

  /**
   * Handle notification
   */
  private handleNotification(message: IMessage): void {
    try {
      const notification = JSON.parse(message.body);
      console.log('WebSocketService: Received notification:', notification);
      // Handle notification logic here
    } catch (error) {
      console.error('WebSocketService: Error parsing notification:', error);
    }
  }

  /**
   * Handle unread count update
   */
  private handleUnreadCountUpdate(message: IMessage): void {
    try {
      const update: UnreadCountUpdate = JSON.parse(message.body);
      console.log('WebSocketService: Received unread count update:', update);
      this.notifyUnreadCountHandlers(update);
    } catch (error) {
      console.error('WebSocketService: Error parsing unread count update:', error);
    }
  }

  /**
   * Handle reconnection
   */
  private handleReconnection(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('WebSocketService: Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`WebSocketService: Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    setTimeout(() => {
      if (this.client && this.currentUserId) {
        this.client.activate();
      }
    }, this.reconnectDelay * this.reconnectAttempts);
  }

  /**
   * Clear all subscriptions
   */
  private clearSubscriptions(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions.clear();
  }

  /**
   * Notify connection handlers
   */
  private notifyConnectionHandlers(connected: boolean): void {
    this.connectionHandlers.forEach(handler => handler(connected));
  }

  /**
   * Generate conversation channel ID
   */
  private generateConversationChannelId(userId1: number, userId2: number): string {
    return [Math.min(userId1, userId2), Math.max(userId1, userId2)].join('-');
  }

  /**
   * Add message handler
   */
  addMessageHandler(handler: MessageEventHandler): void {
    this.messageHandlers.add(handler);
  }

  /**
   * Remove message handler
   */
  removeMessageHandler(handler: MessageEventHandler): void {
    this.messageHandlers.delete(handler);
  }

  /**
   * Add typing handler
   */
  addTypingHandler(handler: TypingEventHandler): void {
    this.typingHandlers.add(handler);
  }

  /**
   * Remove typing handler
   */
  removeTypingHandler(handler: TypingEventHandler): void {
    this.typingHandlers.delete(handler);
  }

  /**
   * Add unread count handler
   */
  addUnreadCountHandler(handler: UnreadCountEventHandler): void {
    this.unreadCountHandlers.add(handler);
  }

  /**
   * Remove unread count handler
   */
  removeUnreadCountHandler(handler: UnreadCountEventHandler): void {
    this.unreadCountHandlers.delete(handler);
  }

  /**
   * Add connection handler
   */
  addConnectionHandler(handler: ConnectionEventHandler): void {
    this.connectionHandlers.add(handler);
  }

  /**
   * Remove connection handler
   */
  removeConnectionHandler(handler: ConnectionEventHandler): void {
    this.connectionHandlers.delete(handler);
  }

  /**
   * Notify message handlers
   */
  private notifyMessageHandlers(message: RealTimeMessage): void {
    this.messageHandlers.forEach(handler => handler(message));
  }

  /**
   * Notify typing handlers
   */
  private notifyTypingHandlers(typing: TypingIndicator): void {
    this.typingHandlers.forEach(handler => handler(typing));
  }

  /**
   * Notify unread count handlers
   */
  private notifyUnreadCountHandlers(update: UnreadCountUpdate): void {
    this.unreadCountHandlers.forEach(handler => handler(update));
  }

  /**
   * Get connection status
   */
  get connected(): boolean {
    return this.isConnected;
  }

  /**
   * Get current user ID
   */
  get userId(): number | null {
    return this.currentUserId;
  }
}

// Create singleton instance
const webSocketService = new WebSocketService();

// React hook for WebSocket
export const useWebSocket = () => {
  const [connected, setConnected] = useState(false);
  const connectionHandlerRef = useRef<ConnectionEventHandler | null>(null);

  useEffect(() => {
    // Set up connection handler
    connectionHandlerRef.current = (isConnected: boolean) => {
      setConnected(isConnected);
    };

    webSocketService.addConnectionHandler(connectionHandlerRef.current);

    return () => {
      if (connectionHandlerRef.current) {
        webSocketService.removeConnectionHandler(connectionHandlerRef.current);
      }
    };
  }, []);

  const subscribeToChannel = useCallback((destination: string, handler: (message: IMessage) => void) => {
    webSocketService.subscribeToChannel(destination, handler);
  }, []);

  const unsubscribeFromChannel = useCallback((destination: string) => {
    webSocketService.unsubscribeFromChannel(destination);
  }, []);

  const connect = useCallback((config: WebSocketConfig, userId: number, authToken?: string) => {
    return webSocketService.connect(config, userId, authToken);
  }, []);

  const disconnect = useCallback(() => {
    return webSocketService.disconnect();
  }, []);

  return {
    connected,
    subscribeToChannel,
    unsubscribeFromChannel,
    connect,
    disconnect,
    webSocketService
  };
};

export default webSocketService; 