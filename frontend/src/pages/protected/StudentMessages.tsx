import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { setPageTitle } from '../../features/common/headerSlice';
import studentApi from '../../api/services/studentApi';
import messageApi, { 
  Message, 
  MessageType, 
  Contact, 
  Conversation, 
  CreateMessageRequest,
  RealTimeMessage 
} from '../../api/services/messageApi';
import webSocketService, { TypingIndicator, UnreadCountUpdate } from '../../services/websocketService';
import { MessageSquare, Users, Send, Search, Plus, MoreVertical, Clock, Check, CheckCheck, Wifi, WifiOff } from 'lucide-react';

const StudentMessages = () => {
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showNewMessageModal, setShowNewMessageModal] = useState(false);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [studentData, setStudentData] = useState<any>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [typingUsers, setTypingUsers] = useState<Map<string, string>>(new Map());
    const [unreadCounts, setUnreadCounts] = useState<Map<string, number>>(new Map());
    const [isTyping, setIsTyping] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        dispatch(setPageTitle({ title: "Messages" }));
    }, [dispatch]);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
    }, [isAuthenticated, navigate]);

    // WebSocket message handler
    const handleRealTimeMessage = useCallback((realTimeMessage: RealTimeMessage) => {
        console.log('Received real-time message:', realTimeMessage);
        
        switch (realTimeMessage.eventType) {
            case 'SENT':
                // Add new message to the conversation
                if (selectedConversation && 
                    ((realTimeMessage.senderId === selectedConversation.participantId && realTimeMessage.recipientId === user?.id) ||
                     (realTimeMessage.senderId === user?.id && realTimeMessage.recipientId === selectedConversation.participantId) ||
                     (realTimeMessage.groupId === selectedConversation.groupId))) {
                    
                    const newMsg: Message = {
                        id: realTimeMessage.id,
                        content: realTimeMessage.content,
                        senderId: realTimeMessage.senderId,
                        senderName: realTimeMessage.senderName,
                        recipientId: realTimeMessage.recipientId,
                        recipientName: realTimeMessage.recipientName,
                        groupId: realTimeMessage.groupId,
                        groupName: realTimeMessage.groupName,
                        messageType: MessageType.TEXT,
                        createdAt: realTimeMessage.createdAt,
                        updatedAt: realTimeMessage.updatedAt,
                        active: realTimeMessage.active,
                        isDelivered: realTimeMessage.isDelivered,
                        isRead: realTimeMessage.isRead,
                        deliveredAt: realTimeMessage.deliveredAt,
                        readAt: realTimeMessage.readAt,
                        edited: false,
                        editedAt: undefined,
                        replyToMessageId: undefined
                    };
                    
                    setMessages(prev => [...prev, newMsg]);
                    
                    // Mark as delivered if we're the recipient
                    if (realTimeMessage.recipientId === user?.id && !realTimeMessage.isDelivered) {
                        webSocketService.markMessageAsDelivered(realTimeMessage.id, user.id);
                    }
                }
                break;
                
            case 'DELIVERED':
            case 'READ':
                // Update message status
                setMessages(prev => prev.map(msg => 
                    msg.id === realTimeMessage.id 
                        ? { 
                            ...msg, 
                            isDelivered: realTimeMessage.eventType === 'DELIVERED' ? true : msg.isDelivered,
                            isRead: realTimeMessage.eventType === 'READ' ? true : msg.isRead,
                            deliveredAt: realTimeMessage.eventType === 'DELIVERED' ? realTimeMessage.deliveredAt : msg.deliveredAt,
                            readAt: realTimeMessage.eventType === 'READ' ? realTimeMessage.readAt : msg.readAt
                        }
                        : msg
                ));
                break;
        }
    }, [selectedConversation, user?.id]);

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
    }, []);

    // Connection status handler
    const handleConnectionStatus = useCallback((connected: boolean) => {
        setIsConnected(connected);
    }, []);

    useEffect(() => {
        const fetchMessagesData = async () => {
            if (!isAuthenticated || !user?.id) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                
                // Get student record first
                const studentResponse = await studentApi.getByUserId(user.id);
                if (studentResponse.data.status !== 'SUCCESS' || !studentResponse.data.data) {
                    setError('Student profile not found. Please contact your administrator.');
                    setLoading(false);
                    return;
                }

                const student = Array.isArray(studentResponse.data.data) 
                    ? studentResponse.data.data[0] 
                    : studentResponse.data.data;

                if (!student) {
                    setError('Student profile not found. Please contact your administrator.');
                    setLoading(false);
                    return;
                }

                setStudentData(student);
                console.log('Student data:', student);

                // Initialize WebSocket connection
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
                    
                    console.log('WebSocket connected successfully');
                } catch (wsError) {
                    console.error('WebSocket connection failed:', wsError);
                    // Continue without real-time features
                }

                // Fetch contacts for the student
                try {
                    const contactsResponse = await messageApi.getContactsForStudent(student.id);
                    if (contactsResponse.data.status === 'SUCCESS') {
                        const contactsData = (contactsResponse.data.data as Contact[]) || [];
                        console.log('Fetched contacts:', contactsData);
                        setContacts(contactsData);
                    }
                } catch (contactsErr: any) {
                    console.error('Error fetching contacts:', contactsErr);
                    // Continue without contacts
                }

                // Fetch conversations for the user
                try {
                    const conversationsResponse = await messageApi.getConversationsForUser(user.id);
                    if (conversationsResponse.data.status === 'SUCCESS') {
                        const conversationsData = (conversationsResponse.data.data as Conversation[]) || [];
                        console.log('Fetched conversations:', conversationsData);
                        setConversations(conversationsData);
                        
                        if (conversationsData.length > 0) {
                            setSelectedConversation(conversationsData[0]);
                            await fetchMessagesForConversation(conversationsData[0]);
                        }
                    }
                } catch (conversationsErr: any) {
                    console.error('Error fetching conversations:', conversationsErr);
                    // Continue with empty conversations
                    setConversations([]);
                }
            } catch (err: any) {
                console.error('Error fetching messages data:', err);
                setError(err.response?.data?.message || 'Failed to fetch messages');
            } finally {
                setLoading(false);
            }
        };

        fetchMessagesData();

        // Cleanup on unmount
        return () => {
            webSocketService.removeMessageHandler(handleRealTimeMessage);
            webSocketService.removeTypingHandler(handleTypingIndicator);
            webSocketService.removeUnreadCountHandler(handleUnreadCountUpdate);
            webSocketService.removeConnectionHandler(handleConnectionStatus);
            webSocketService.disconnect();
        };
    }, [user?.id, isAuthenticated, handleRealTimeMessage, handleTypingIndicator, handleUnreadCountUpdate, handleConnectionStatus]);

    const fetchMessagesForConversation = async (conversation: Conversation) => {
        if (!user?.id || !conversation.participantId) return;

        try {
            const messagesResponse = await messageApi.getActiveConversationMessages(user.id, conversation.participantId);
            if (messagesResponse.data.status === 'SUCCESS') {
                const messagesData = (messagesResponse.data.data as Message[]) || [];
                console.log('Fetched messages for conversation:', messagesData);
                
                setMessages(messagesData);
                
                // Subscribe to conversation channel for real-time updates
                if (webSocketService.connected) {
                    webSocketService.subscribeToConversation(user.id, conversation.participantId);
                }
                
                // Mark conversation as read
                if (messagesData.length > 0) {
                    await messageApi.markConversationAsRead(user.id, conversation.participantId);
                }
            }
        } catch (err: any) {
            console.error('Error fetching messages for conversation:', err);
            setMessages([]);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation || !user?.id) return;

        try {
            const messageData: CreateMessageRequest = {
                content: newMessage,
                senderId: user.id,
                recipientId: selectedConversation.participantId,
                groupId: selectedConversation.groupId,
                messageType: MessageType.TEXT,
                active: true
            };

            const response = await messageApi.sendMessage(messageData);
            if (response.data.status === 'SUCCESS') {
                setNewMessage('');
                
                // Stop typing indicator
                if (isTyping && selectedConversation.participantId) {
                    const channelId = generateConversationChannelId(user.id, selectedConversation.participantId);
                    webSocketService.sendTypingIndicator(user.id, channelId, false);
                    setIsTyping(false);
                }
                
                // Message will be added via WebSocket real-time update
                console.log('Message sent successfully');
            }
        } catch (err: any) {
            console.error('Error sending message:', err);
            setError('Failed to send message');
        }
    };

    const handleTyping = () => {
        if (!selectedConversation?.participantId || !user?.id || !webSocketService.connected) return;
        
        const channelId = generateConversationChannelId(user.id, selectedConversation.participantId);
        
        if (!isTyping) {
            webSocketService.sendTypingIndicator(user.id, channelId, true);
            setIsTyping(true);
        }
        
        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        
        // Set new timeout to stop typing indicator
        typingTimeoutRef.current = setTimeout(() => {
            webSocketService.sendTypingIndicator(user.id, channelId, false);
            setIsTyping(false);
        }, 3000);
    };

    const generateConversationChannelId = (userId1: number, userId2: number): string => {
        const sortedIds = [userId1, userId2].sort((a, b) => a - b);
        return `conversation:${sortedIds[0]}:${sortedIds[1]}`;
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        } else {
            handleTyping();
        }
    };

    const formatMessageTime = (timestamp: string) => {
        if (!timestamp || timestamp.trim() === '') {
            return '';
        }
        
        const date = new Date(timestamp);
        
        // Check if the date is valid
        if (isNaN(date.getTime())) {
            return '';
        }
        
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
        
        if (diffInHours < 1) {
            return 'Just now';
        } else if (diffInHours < 24) {
            return `${Math.floor(diffInHours)} hours ago`;
        } else if (diffInHours < 168) { // 7 days
            const days = Math.floor(diffInHours / 24);
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    };

    const handleConversationSelect = async (conversation: Conversation) => {
        setSelectedConversation(conversation);
        await fetchMessagesForConversation(conversation);
    };

    const startNewConversation = async (contact: Contact) => {
        if (!user?.id) return;
        
        // Check if conversation already exists
        const existingConversation = conversations.find(conv => conv.participantId === contact.id);
        if (existingConversation) {
            setSelectedConversation(existingConversation);
            await fetchMessagesForConversation(existingConversation);
        } else {
            // Create new conversation object
            const newConversation: Conversation = {
                id: `new-${contact.id}`,
                name: `${contact.firstName} ${contact.lastName}`,
                lastMessage: '',
                lastMessageTime: '',
                unreadCount: 0,
                type: 'individual',
                participantId: contact.id
            };
            
            setSelectedConversation(newConversation);
            setMessages([]);
            
            // Subscribe to conversation channel
            if (webSocketService.connected) {
                webSocketService.subscribeToConversation(user.id, contact.id);
            }
        }
        
        setShowNewMessageModal(false);
    };

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const filteredContacts = contacts.filter(contact =>
        `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredConversations = conversations.filter(conversation =>
        conversation.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="text-red-600 text-xl mb-4">{error}</div>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-xl font-semibold text-gray-900 flex items-center">
                            <MessageSquare className="mr-2" size={24} />
                            Messages
                        </h1>
                        <div className="flex items-center space-x-2">
                            <div title="Connected">
                                {isConnected ? (
                                    <Wifi className="text-green-500" size={16} />
                                ) : (
                                    <WifiOff className="text-red-500" size={16} />
                                )}
                            </div>
                            <button
                                onClick={() => setShowNewMessageModal(true)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                                title="New Message"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>
                    
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Conversations List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredConversations.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                            <MessageSquare size={48} className="mx-auto mb-2 text-gray-300" />
                            <p>No conversations yet</p>
                            <p className="text-sm">Start a new conversation to get started</p>
                        </div>
                    ) : (
                        filteredConversations.map((conversation) => (
                            <div
                                key={conversation.id}
                                onClick={() => handleConversationSelect(conversation)}
                                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                                    selectedConversation?.id === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                            {conversation.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {conversation.name}
                                            </p>
                                            <p className="text-sm text-gray-500 truncate">
                                                {conversation.lastMessage || 'No messages yet'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end space-y-1">
                                        {conversation.lastMessageTime && (
                                            <span className="text-xs text-gray-400">
                                                {formatMessageTime(conversation.lastMessageTime)}
                                            </span>
                                        )}
                                        {conversation.unreadCount > 0 && (
                                            <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                                {conversation.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {selectedConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 bg-white border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                        {selectedConversation.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            {selectedConversation.name}
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            {selectedConversation.type === 'group' ? 'Group Chat' : 'Direct Message'}
                                        </p>
                                    </div>
                                </div>
                                <button className="p-2 text-gray-400 hover:text-gray-600">
                                    <MoreVertical size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.length === 0 ? (
                                <div className="text-center text-gray-500 mt-8">
                                    <MessageSquare size={48} className="mx-auto mb-2 text-gray-300" />
                                    <p>No messages in this conversation</p>
                                    <p className="text-sm">Send a message to get started</p>
                                </div>
                            ) : (
                                messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                                message.senderId === user?.id
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-200 text-gray-900'
                                            }`}
                                        >
                                            <p className="text-sm">{message.content}</p>
                                            <div className="flex items-center justify-between mt-1">
                                                <span className="text-xs opacity-75">
                                                    {formatMessageTime(message.createdAt)}
                                                </span>
                                                {message.senderId === user?.id && (
                                                    <div className="flex items-center space-x-1">
                                                        {message.isRead ? (
                                                            <CheckCheck size={12} className="text-blue-200" />
                                                        ) : message.isDelivered ? (
                                                            <Check size={12} className="text-blue-200" />
                                                        ) : (
                                                            <Clock size={12} className="text-blue-200" />
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                            
                            {/* Typing Indicator */}
                            {selectedConversation.participantId && typingUsers.has(generateConversationChannelId(user?.id || 0, selectedConversation.participantId)) && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-200 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                                        <div className="flex items-center space-x-1">
                                            <div className="flex space-x-1">
                                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            </div>
                                            <span className="text-xs text-gray-500 ml-2">typing...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="p-4 bg-white border-t border-gray-200">
                            <div className="flex items-center space-x-2">
                                <div className="flex-1 relative">
                                    <textarea
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Type a message..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                        rows={1}
                                        style={{ minHeight: '40px', maxHeight: '120px' }}
                                    />
                                </div>
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!newMessage.trim()}
                                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-gray-50">
                        <div className="text-center">
                            <MessageSquare size={64} className="mx-auto mb-4 text-gray-300" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                            <p className="text-gray-500">Choose a conversation from the sidebar to start messaging</p>
                        </div>
                    </div>
                )}
            </div>

            {/* New Message Modal */}
            {showNewMessageModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">New Message</h3>
                            <button
                                onClick={() => setShowNewMessageModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Search contacts..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        
                        <div className="max-h-60 overflow-y-auto">
                            {filteredContacts.length === 0 ? (
                                <div className="text-center text-gray-500 py-4">
                                    <Users size={32} className="mx-auto mb-2 text-gray-300" />
                                    <p>No contacts found</p>
                                </div>
                            ) : (
                                filteredContacts.map((contact) => (
                                    <div
                                        key={contact.id}
                                        onClick={() => startNewConversation(contact)}
                                        className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer rounded-lg"
                                    >
                                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                            {contact.firstName.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">
                                                {contact.firstName} {contact.lastName}
                                            </p>
                                            <p className="text-sm text-gray-500">{contact.role}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentMessages; 