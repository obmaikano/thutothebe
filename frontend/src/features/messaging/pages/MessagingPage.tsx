import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useAuth } from '../../../contexts/AuthContext';
import { useMessaging } from '../../../contexts/MessagingContext';
import { 
  fetchConversations, 
  fetchUnreadCount, 
  clearMessagesError,
  setCurrentConversation 
} from '../messagesSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { Conversation } from '../../../api/services/messageApi';
import { 
  MessageSquare, 
  Users, 
  Search, 
  Plus, 
  MessageCircle,
  User
} from 'lucide-react';

const MessagingPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const messaging = useMessaging();
  
  // Use type assertion to access messages state until Redux store is properly configured
  const messagesState = useAppSelector(state => (state as any).messages);
  
  // Provide default values to prevent undefined errors
  const {
    conversations = [],
    unreadCount = 0,
    status = 'idle',
    error = null
  } = messagesState || {};
  
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchConversations(user.id));
      dispatch(fetchUnreadCount(user.id));
    }
    return () => {
      dispatch(clearMessagesError());
    };
  }, [dispatch, user?.id]);

  const handleNewMessage = () => {
    dispatch(openModal({
      title: 'New Message',
      bodyType: MODAL_BODY_TYPES.MESSAGE_NEW,
      size: 'lg'
    }));
  };

  const handleCreateGroup = () => {
    dispatch(openModal({
      title: 'Create Group',
      bodyType: MODAL_BODY_TYPES.MESSAGE_GROUP_CREATE,
      size: 'lg'
    }));
  };

  const handleConversationSelect = (conversation: Conversation) => {
    dispatch(setCurrentConversation(conversation));
    // Navigate to conversation detail view
    window.location.href = `/app/messages/conversation/${conversation.id}`;
  };

  const filteredConversations = conversations.filter((conversation: Conversation) => {
    return conversation.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getConversationIcon = (conversation: Conversation) => {
    if (conversation.type === 'group') {
      return <Users size={20} className="text-blue-600" />;
    }
    return <User size={20} className="text-gray-600" />;
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-2">Communicate with teachers, students, and staff</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleCreateGroup} 
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Users size={16} />
            Create Group
          </button>
          <button 
            onClick={handleNewMessage} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={16} />
            New Message
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
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

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <MessageSquare size={20} className="text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{conversations.length}</div>
              <div className="text-sm text-gray-500">Total Conversations</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg mr-3">
              <MessageCircle size={20} className="text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{unreadCount}</div>
              <div className="text-sm text-gray-500">Unread Messages</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <Users size={20} className="text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {conversations.filter((c: Conversation) => c.type === 'group').length}
              </div>
              <div className="text-sm text-gray-500">Group Conversations</div>
            </div>
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Conversations</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
              <p className="text-gray-500 mb-4">Start a new conversation to connect with others</p>
              <button 
                onClick={handleNewMessage}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
              >
                <Plus size={16} />
                Start Conversation
              </button>
            </div>
          ) : (
            filteredConversations.map((conversation: Conversation) => (
              <div
                key={conversation.id}
                onClick={() => handleConversationSelect(conversation)}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {getConversationIcon(conversation)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {conversation.name}
                        </p>
                        <div className="flex items-center space-x-2">
                          {conversation.unreadCount > 0 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              {conversation.unreadCount}
                            </span>
                          )}
                          <span className="text-xs text-gray-500">
                            {formatTime(conversation.lastMessageTime)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 truncate mt-1">
                        {conversation.lastMessage}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Connection Status */}
      <div className="fixed bottom-4 right-4">
        <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm ${
          messaging.isConnected 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            messaging.isConnected ? 'bg-green-500' : 'bg-red-500'
          }`} />
          <span>{messaging.isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>
    </div>
  );
};

export default MessagingPage; 