import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useAuth } from '../../../contexts/AuthContext';
import { useMessaging } from '../../../contexts/MessagingContext';
import { 
  fetchConversationMessages, 
  sendMessage, 
  markConversationAsRead,
  clearMessagesError 
} from '../messagesSlice';
import { Message, MessageType, CreateMessageRequest, RealTimeMessage } from '../../../api/services/messageApi';
import { 
  ArrowLeft, 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical,
  Phone,
  Video,
  Info,
  Check,
  CheckCheck
} from 'lucide-react';

const ConversationPage: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const messaging = useMessaging();
  const { messages, currentConversation, status, error } = useAppSelector(state => state.messages);
  
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversation messages
  useEffect(() => {
    if (conversationId && user?.id && currentConversation?.participantId) {
      dispatch(fetchConversationMessages({ 
        userId1: user.id, 
        userId2: currentConversation.participantId 
      }));
      
      // Mark conversation as read
      dispatch(markConversationAsRead({ 
        userId: user.id, 
        partnerId: currentConversation.participantId 
      }));
    }
  }, [dispatch, conversationId, user?.id, currentConversation?.participantId]);

  // Handle real-time messages
  const handleRealTimeMessage = useCallback((realTimeMessage: RealTimeMessage) => {
    if (realTimeMessage.eventType === 'SENT' && 
        currentConversation &&
        ((realTimeMessage.senderId === currentConversation.participantId && realTimeMessage.recipientId === user?.id) ||
         (realTimeMessage.senderId === user?.id && realTimeMessage.recipientId === currentConversation.participantId))) {
      
      // Message will be added via Redux state update
      scrollToBottom();
      
      // Mark as read if we're the recipient
      if (realTimeMessage.recipientId === user?.id && user?.id) {
        dispatch(markConversationAsRead({ 
          userId: user.id, 
          partnerId: currentConversation.participantId || 0
        }));
      }
    }
  }, [currentConversation, user?.id, dispatch]);

  useEffect(() => {
    messaging.onMessageReceived(handleRealTimeMessage);
    return () => {
      messaging.offMessageReceived(handleRealTimeMessage);
    };
  }, [handleRealTimeMessage, messaging]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !user?.id || !currentConversation?.participantId || isSending) {
      return;
    }

    const messageData: CreateMessageRequest = {
      content: messageText.trim(),
      senderId: user.id,
      recipientId: currentConversation.participantId,
      messageType: MessageType.TEXT,
      active: true
    };

    try {
      setIsSending(true);
      await dispatch(sendMessage(messageData)).unwrap();
      setMessageText('');
      messageInputRef.current?.focus();
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTyping = () => {
    if (!isTyping && currentConversation?.participantId && user?.id) {
      setIsTyping(true);
      const channelId = generateConversationChannelId(user.id, currentConversation.participantId);
      messaging.sendTypingIndicator(channelId, true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      if (currentConversation?.participantId && user?.id) {
        const channelId = generateConversationChannelId(user.id, currentConversation.participantId);
        messaging.sendTypingIndicator(channelId, false);
      }
    }, 1000);
  };

  const generateConversationChannelId = (userId1: number, userId2: number): string => {
    return `conversation_${Math.min(userId1, userId2)}_${Math.max(userId1, userId2)}`;
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatMessageDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const getMessageStatusIcon = (message: Message) => {
    if (message.senderId !== user?.id) return null;
    
    if (message.isRead) {
      return <CheckCheck size={14} className="text-blue-500" />;
    } else if (message.isDelivered) {
      return <CheckCheck size={14} className="text-gray-400" />;
    } else {
      return <Check size={14} className="text-gray-400" />;
    }
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      const dateKey = formatMessageDate(message.createdAt);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });
    
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (!currentConversation) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Conversation not found</h2>
        <p className="text-gray-600 mb-4">The conversation you're looking for doesn't exist or has been deleted.</p>
        <button 
          onClick={() => navigate('/app/messages')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Back to Messages
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/app/messages')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{currentConversation.name}</h1>
              <p className="text-sm text-gray-500">
                {messaging.isConnected ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Phone size={20} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Video size={20} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Info size={20} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mx-6 mt-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => dispatch(clearMessagesError())}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {Object.entries(messageGroups).map(([date, dateMessages]) => (
          <div key={date}>
            {/* Date separator */}
            <div className="flex items-center justify-center my-4">
              <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                {date}
              </div>
            </div>
            
            {/* Messages for this date */}
            {dateMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'} mb-2`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.senderId === user?.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <div className={`flex items-center justify-end space-x-1 mt-1 ${
                    message.senderId === user?.id ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    <span className="text-xs">{formatMessageTime(message.createdAt)}</span>
                    {getMessageStatusIcon(message)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
        
        {/* Typing indicator */}
        {messaging.typingUsers.has(generateConversationChannelId(user?.id || 0, currentConversation.participantId || 0)) && (
          <div className="flex justify-start mb-2">
            <div className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs ml-2">typing...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-end space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Paperclip size={20} className="text-gray-600" />
          </button>
          <div className="flex-1">
            <textarea
              ref={messageInputRef}
              value={messageText}
              onChange={(e) => {
                setMessageText(e.target.value);
                handleTyping();
              }}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={1}
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Smile size={20} className="text-gray-600" />
          </button>
          <button
            onClick={handleSendMessage}
            disabled={!messageText.trim() || isSending}
            className={`p-2 rounded-lg transition-colors ${
              messageText.trim() && !isSending
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversationPage; 