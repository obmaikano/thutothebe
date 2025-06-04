import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useAuth } from '../../../contexts/AuthContext';
import { sendMessage, fetchContacts } from '../messagesSlice';
import { closeModal } from '../../common/modalSlice';
import { CreateMessageRequest, MessageType, Contact } from '../../../api/services/messageApi';
import { getAllowedContactRoles } from '../utils/messagingPermissions';
import { User, Search, Send } from 'lucide-react';

interface NewMessageModalProps {
  extraObject?: Contact;
}

const NewMessageModal: React.FC<NewMessageModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  
  // Use type assertion to access messages state until Redux store is properly configured
  const messagesState = useAppSelector(state => (state as any).messages);
  const { contacts = [], status = 'idle' } = messagesState || {};
  
  const [selectedContact, setSelectedContact] = useState<Contact | null>(extraObject || null);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (user?.id && !extraObject) {
      dispatch(fetchContacts(user.id));
    }
  }, [dispatch, user?.id, extraObject]);

  // Filter contacts based on role-based permissions
  const allowedRoles = user ? getAllowedContactRoles(user.role) : [];
  const filteredContacts = contacts
    .filter((contact: Contact) => allowedRoles.includes(contact.role))
    .filter((contact: Contact) =>
      `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedContact || !user?.id || isSending) {
      return;
    }

    const messageData: CreateMessageRequest = {
      content: messageText.trim(),
      senderId: user.id,
      recipientId: selectedContact.id,
      messageType: MessageType.TEXT,
      active: true
    };

    try {
      setIsSending(true);
      await dispatch(sendMessage(messageData)).unwrap();
      dispatch(closeModal({}));
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const formatRole = (role: string) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  return (
    <div className="space-y-6">
      {/* Contact Selection */}
      {!extraObject && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Contact
          </label>
          <div className="space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Contact List */}
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
              {status === 'loading' ? (
                <div className="p-4 text-center">
                  <div className="loading loading-spinner loading-sm"></div>
                  <span className="ml-2 text-sm text-gray-500">Loading contacts...</span>
                </div>
              ) : filteredContacts.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No contacts found
                </div>
              ) : (
                filteredContacts.map((contact: Contact) => (
                  <div
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className={`p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                      selectedContact?.id === contact.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <User size={16} className="text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">
                            {contact.firstName} {contact.lastName}
                          </span>
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                            {formatRole(contact.role)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{contact.email}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Selected Contact Display */}
      {selectedContact && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
              <User size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Sending to: {selectedContact.firstName} {selectedContact.lastName}
              </p>
              <p className="text-xs text-gray-500">{selectedContact.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Message
        </label>
        <textarea
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type your message here..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={4}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3">
        <button
          onClick={() => dispatch(closeModal({}))}
          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSendMessage}
          disabled={!messageText.trim() || !selectedContact || isSending}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            messageText.trim() && selectedContact && !isSending
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isSending ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send size={16} />
              Send Message
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default NewMessageModal; 