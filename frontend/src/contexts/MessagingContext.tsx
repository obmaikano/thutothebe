import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode, useMemo } from 'react';
import { useAuth } from './AuthContext';
import webSocketService, { TypingIndicator, UnreadCountUpdate } from '../services/websocketService';
import { RealTimeMessage, Message, Conversation } from '../api/services/messageApi';

interface MessagingContextType {
  isConnected: boolean;
  conversations: Conversation[];
  unreadCounts: Map<string, number>;
  typingUsers: Map<string, string>;
  totalUnreadCount: number;
  
  // Actions
  addConversation: (conversation: Conversation) => void;
  updateConversation: (conversationId: string, updates: Partial<Conversation>) => void;
  removeConversation: (conversationId: string) => void;
  markConversationAsRead: (conversationId: string) => void;
  
  // WebSocket actions
  sendTypingIndicator: (channelId: string, isTyping: boolean) => void;
  subscribeToConversation: (userId1: number, userId2: number) => void;
  subscribeToGroup: (groupId: number) => void;
  
  // Event handlers
  onMessageReceived: (handler: (message: RealTimeMessage) => void) => void;
  offMessageReceived: (handler: (message: RealTimeMessage) => void) => void;
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

interface MessagingProviderProps {
  children: ReactNode;
}

export const MessagingProvider: React.FC<MessagingProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<Map<string, number>>(new Map());
  const [typingUsers, setTypingUsers] = useState<Map<string, string>>(new Map());
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [messageHandlers, setMessageHandlers] = useState<Set<(message: RealTimeMessage) => void>>(new Set());

  // WebSocket message handler
  const handleRealTimeMessage = useCallback((realTimeMessage: RealTimeMessage) => {
    console.log('MessagingContext: Received real-time message:', realTimeMessage);
    
    // Notify all registered handlers
    messageHandlers.forEach(handler => {
      try {
        handler(realTimeMessage);
      } catch (error) {
        console.error('Error in message handler:', error);
      }
    });

    // Update conversations based on message
    switch (realTimeMessage.eventType) {
      case 'SENT':
        setConversations(prev => prev.map(conv => {
          if ((conv.participantId === realTimeMessage.senderId || conv.participantId === realTimeMessage.recipientId) ||
              (conv.groupId === realTimeMessage.groupId)) {
            return {
              ...conv,
              lastMessage: realTimeMessage.content,
              lastMessageTime: realTimeMessage.createdAt,
              unreadCount: realTimeMessage.recipientId === user?.id ? conv.unreadCount + 1 : conv.unreadCount
            };
          }
          return conv;
        }));
        break;
    }
  }, [messageHandlers, user?.id]);

  // Typing indicator handler
  const handleTypingIndicator = useCallback((typing: TypingIndicator) => {
    if (typing.userId === user?.id) return; // Ignore our own typing
    
    setTypingUsers(prev => {
      const newMap = new Map(prev);
      if (typing.isTyping) {
        newMap.set(typing.channelId, `User ${typing.userId} is typing...`);
      } else {
        newMap.delete(typing.channelId);
      }
      return newMap;
    });
  }, [user?.id]);

  // Unread count handler
  const handleUnreadCountUpdate = useCallback((update: UnreadCountUpdate) => {
    setUnreadCounts(prev => {
      const newMap = new Map(prev);
      if (update.channelId) {
        newMap.set(update.channelId, update.channelCount || 0);
      }
      return newMap;
    });
    
    setTotalUnreadCount(update.totalCount);
  }, []);

  // Connection status handler
  const handleConnectionStatus = useCallback((connected: boolean) => {
    setIsConnected(connected);
  }, []);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      return;
    }

    // Add a small delay to ensure React is fully initialized
    const timer = setTimeout(() => {
      const initializeWebSocket = async () => {
        try {
          await webSocketService.connect(
            { 
              url: `${process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1'}/ws`,
              debug: process.env.NODE_ENV === 'development'
            },
            user.id
          );
          
          // Add event handlers
          webSocketService.addMessageHandler(handleRealTimeMessage);
          webSocketService.addTypingHandler(handleTypingIndicator);
          webSocketService.addUnreadCountHandler(handleUnreadCountUpdate);
          webSocketService.addConnectionHandler(handleConnectionStatus);
          
          console.log('MessagingContext: WebSocket connected successfully');
        } catch (error) {
          console.error('MessagingContext: WebSocket connection failed:', error);
          // Don't throw the error, just log it
        }
      };

      initializeWebSocket();
    }, 1000); // 1 second delay

    // Cleanup on unmount
    return () => {
      clearTimeout(timer);
      webSocketService.removeMessageHandler(handleRealTimeMessage);
      webSocketService.removeTypingHandler(handleTypingIndicator);
      webSocketService.removeUnreadCountHandler(handleUnreadCountUpdate);
      webSocketService.removeConnectionHandler(handleConnectionStatus);
      webSocketService.disconnect();
    };
  }, [user?.id, isAuthenticated, handleRealTimeMessage, handleTypingIndicator, handleUnreadCountUpdate, handleConnectionStatus]);

  // Conversation management
  const addConversation = useCallback((conversation: Conversation) => {
    setConversations(prev => {
      const exists = prev.find(conv => conv.id === conversation.id);
      if (exists) return prev;
      return [conversation, ...prev];
    });
  }, []);

  const updateConversation = useCallback((conversationId: string, updates: Partial<Conversation>) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId ? { ...conv, ...updates } : conv
    ));
  }, []);

  const removeConversation = useCallback((conversationId: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
  }, []);

  const markConversationAsRead = useCallback((conversationId: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    ));
  }, []);

  // WebSocket actions
  const sendTypingIndicator = useCallback((channelId: string, isTyping: boolean) => {
    if (user?.id && webSocketService.connected) {
      webSocketService.sendTypingIndicator(user.id, channelId, isTyping);
    }
  }, [user?.id]);

  const subscribeToConversation = useCallback((userId1: number, userId2: number) => {
    if (webSocketService.connected) {
      webSocketService.subscribeToConversation(userId1, userId2);
    }
  }, []);

  const subscribeToGroup = useCallback((groupId: number) => {
    if (webSocketService.connected) {
      webSocketService.subscribeToGroup(groupId);
    }
  }, []);

  // Event handler management
  const onMessageReceived = useCallback((handler: (message: RealTimeMessage) => void) => {
    setMessageHandlers(prev => new Set([...prev, handler]));
  }, []);

  const offMessageReceived = useCallback((handler: (message: RealTimeMessage) => void) => {
    setMessageHandlers(prev => {
      const newSet = new Set(prev);
      newSet.delete(handler);
      return newSet;
    });
  }, []);

  const value: MessagingContextType = useMemo(() => ({
    isConnected,
    conversations,
    unreadCounts,
    typingUsers,
    totalUnreadCount,
    
    addConversation,
    updateConversation,
    removeConversation,
    markConversationAsRead,
    
    sendTypingIndicator,
    subscribeToConversation,
    subscribeToGroup,
    
    onMessageReceived,
    offMessageReceived
  }), [
    isConnected,
    conversations,
    unreadCounts,
    typingUsers,
    totalUnreadCount,
    addConversation,
    updateConversation,
    removeConversation,
    markConversationAsRead,
    sendTypingIndicator,
    subscribeToConversation,
    subscribeToGroup,
    onMessageReceived,
    offMessageReceived
  ]);

  return (
    <MessagingContext.Provider value={value}>
      {children}
    </MessagingContext.Provider>
  );
};

export const useMessaging = (): MessagingContextType => {
  const context = useContext(MessagingContext);
  if (context === undefined) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
}; 