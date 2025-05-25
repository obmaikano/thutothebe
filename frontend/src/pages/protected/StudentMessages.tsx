import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { setPageTitle } from '../../features/common/headerSlice';
import studentApi from '../../api/services/studentApi';
import messageApi from '../../api/services/messageApi';
import { MessageSquare, Users, Send, Search, Plus, MoreVertical, Clock, Check, CheckCheck } from 'lucide-react';

interface Message {
  id: number;
  content: string;
  senderId: number;
  recipientId?: number;
  groupId?: number;
  createdAt: string;
  active: boolean;
  senderName?: string;
  senderRole?: string;
}

interface Conversation {
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

interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  avatar?: string;
}

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

    useEffect(() => {
        dispatch(setPageTitle({ title: "Messages" }));
    }, [dispatch]);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
    }, [isAuthenticated, navigate]);

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

                // Fetch contacts for the student
                try {
                    const contactsResponse = await messageApi.getContactsForStudent(student.id);
                    if (contactsResponse.data.status === 'SUCCESS') {
                        const contactsData = (contactsResponse.data.data as any[]) || [];
                        console.log('Fetched contacts:', contactsData);
                        setContacts(contactsData.map(contact => ({
                            id: contact.id,
                            firstName: contact.firstName,
                            lastName: contact.lastName,
                            role: contact.role,
                            email: contact.email
                        })));
                    }
                } catch (contactsErr: any) {
                    console.error('Error fetching contacts:', contactsErr);
                    // Continue without contacts
                }

                // Fetch conversations for the user
                try {
                    const conversationsResponse = await messageApi.getConversationsForUser(user.id);
                    if (conversationsResponse.data.status === 'SUCCESS') {
                        const conversationsData = (conversationsResponse.data.data as any[]) || [];
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
    }, [user?.id, isAuthenticated]);

    const fetchMessagesForConversation = async (conversation: Conversation) => {
        if (!user?.id || !conversation.participantId) return;

        try {
            const messagesResponse = await messageApi.getActiveConversation(user.id, conversation.participantId);
            if (messagesResponse.data.status === 'SUCCESS') {
                const messagesData = (messagesResponse.data.data as any[]) || [];
                console.log('Fetched messages for conversation:', messagesData);
                
                const formattedMessages = messagesData.map(msg => ({
                    id: msg.id,
                    content: msg.content,
                    senderId: msg.senderId,
                    recipientId: msg.recipientId,
                    groupId: msg.groupId,
                    createdAt: msg.createdAt,
                    active: msg.active,
                    senderName: msg.senderId === user.id ? 'You' : conversation.name
                }));
                
                setMessages(formattedMessages);
            }
        } catch (err: any) {
            console.error('Error fetching messages for conversation:', err);
            setMessages([]);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation || !user?.id) return;

        try {
            const messageData = {
                content: newMessage,
                senderId: user.id,
                recipientId: selectedConversation.participantId,
                groupId: selectedConversation.groupId || null,
                active: true
            };

            const response = await messageApi.sendMessage(messageData);
            if (response.data.status === 'SUCCESS') {
                const sentMessage = response.data.data as any;
                
                const newMsg: Message = {
                    id: sentMessage.id,
                    content: sentMessage.content,
                    senderId: sentMessage.senderId,
                    recipientId: sentMessage.recipientId,
                    groupId: sentMessage.groupId,
                    createdAt: sentMessage.createdAt,
                    active: sentMessage.active,
                    senderName: 'You'
                };

                setMessages(prev => [...prev, newMsg]);
                setNewMessage('');

                // Update conversation last message
                setConversations(prev => prev.map(conv => 
                    conv.id === selectedConversation.id 
                        ? { ...conv, lastMessage: newMessage, lastMessageTime: 'Just now' }
                        : conv
                ));
            }
        } catch (err: any) {
            console.error('Error sending message:', err);
            setError('Failed to send message');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatMessageTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 1) {
            return 'Just now';
        } else if (diffInHours < 24) {
            return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    const filteredConversations = conversations.filter(conv =>
        conv.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleConversationSelect = async (conversation: Conversation) => {
        setSelectedConversation(conversation);
        await fetchMessagesForConversation(conversation);
    };

    const startNewConversation = async (contact: Contact) => {
        // Create a new conversation object
        const newConversation: Conversation = {
            id: contact.id.toString(),
            name: `${contact.firstName} ${contact.lastName}`,
            lastMessage: '',
            lastMessageTime: 'New conversation',
            unreadCount: 0,
            type: 'individual',
            participantId: contact.id
        };

        // Add to conversations if not already exists
        const existingConv = conversations.find(conv => conv.participantId === contact.id);
        if (!existingConv) {
            setConversations(prev => [newConversation, ...prev]);
        }

        setSelectedConversation(newConversation);
        setMessages([]);
        setShowNewMessageModal(false);
    };

    if (!isAuthenticated) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900">Authentication Required</h3>
                    <p className="mt-2 text-sm text-gray-500">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Error</h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>{error}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
                    <p className="text-gray-600 mt-2">Communicate with teachers and classmates</p>
                </div>
                <button
                    onClick={() => setShowNewMessageModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    New Message
                </button>
            </div>

            {/* Messages Interface */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden" style={{ height: '600px' }}>
                <div className="flex h-full">
                    {/* Conversations Sidebar */}
                    <div className="w-1/3 border-r border-gray-200 flex flex-col">
                        {/* Search */}
                        <div className="p-4 border-b border-gray-200">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
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
                                <div className="text-center py-8">
                                    <MessageSquare className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-500">No conversations found</p>
                                    <p className="text-xs text-gray-400 mt-1">Start a new conversation with the + button</p>
                                </div>
                            ) : (
                                filteredConversations.map((conversation) => (
                                    <div
                                        key={conversation.id}
                                        onClick={() => handleConversationSelect(conversation)}
                                        className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                                            selectedConversation?.id === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="relative">
                                                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                                    {conversation.type === 'group' ? (
                                                        <Users className="h-5 w-5 text-gray-600" />
                                                    ) : (
                                                        <span className="text-sm font-medium text-gray-600">
                                                            {conversation.name.charAt(0)}
                                                        </span>
                                                    )}
                                                </div>
                                                {conversation.unreadCount > 0 && (
                                                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                        {conversation.unreadCount}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-medium text-gray-900 truncate">{conversation.name}</h3>
                                                    <span className="text-xs text-gray-500">{conversation.lastMessageTime}</span>
                                                </div>
                                                <p className="text-sm text-gray-600 truncate mt-1">
                                                    {conversation.lastMessage || 'No messages yet'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 flex flex-col">
                        {selectedConversation ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                            {selectedConversation.type === 'group' ? (
                                                <Users className="h-4 w-4 text-gray-600" />
                                            ) : (
                                                <span className="text-sm font-medium text-gray-600">
                                                    {selectedConversation.name.charAt(0)}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900">{selectedConversation.name}</h3>
                                            <p className="text-xs text-gray-500">
                                                {selectedConversation.type === 'group' ? 'Group conversation' : 'Teacher'}
                                            </p>
                                        </div>
                                    </div>
                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                        <MoreVertical className="h-4 w-4 text-gray-600" />
                                    </button>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {messages.length === 0 ? (
                                        <div className="text-center py-8">
                                            <MessageSquare className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                            <p className="text-sm text-gray-500">No messages yet</p>
                                            <p className="text-xs text-gray-400">Start the conversation!</p>
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
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-gray-100 text-gray-900'
                                                    }`}
                                                >
                                                    {message.senderId !== user?.id && (
                                                        <p className="text-xs font-medium mb-1 opacity-75">
                                                            {message.senderName}
                                                        </p>
                                                    )}
                                                    <p className="text-sm">{message.content}</p>
                                                    <div className="flex items-center justify-end gap-1 mt-1">
                                                        <span className="text-xs opacity-75">
                                                            {formatMessageTime(message.createdAt)}
                                                        </span>
                                                        {message.senderId === user?.id && (
                                                            <CheckCheck className="h-3 w-3 opacity-75" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Message Input */}
                                <div className="p-4 border-t border-gray-200">
                                    <div className="flex items-end gap-2">
                                        <div className="flex-1">
                                            <textarea
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                onKeyPress={handleKeyPress}
                                                placeholder="Type your message..."
                                                rows={1}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                            />
                                        </div>
                                        <button
                                            onClick={handleSendMessage}
                                            disabled={!newMessage.trim()}
                                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
                                        >
                                            <Send className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center">
                                    <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                                    <p className="text-sm text-gray-500">
                                        Choose a conversation from the sidebar to start messaging
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* New Message Modal */}
            {showNewMessageModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Start New Conversation</h3>
                            <button
                                onClick={() => setShowNewMessageModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {contacts.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-4">No contacts available</p>
                            ) : (
                                contacts.map((contact) => (
                                    <div
                                        key={contact.id}
                                        onClick={() => startNewConversation(contact)}
                                        className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                                <span className="text-sm font-medium text-gray-600">
                                                    {contact.firstName.charAt(0)}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {contact.firstName} {contact.lastName}
                                                </p>
                                                <p className="text-sm text-gray-500">{contact.role}</p>
                                            </div>
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