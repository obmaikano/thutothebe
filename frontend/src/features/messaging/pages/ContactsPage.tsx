import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useAuth } from '../../../contexts/AuthContext';
import { fetchContacts, clearMessagesError } from '../messagesSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { Contact } from '../../../api/services/messageApi';
import { 
  Users, 
  Search, 
  MessageSquare, 
  User, 
  Mail, 
  Filter,
  GraduationCap,
  BookOpen,
  Shield
} from 'lucide-react';

const ContactsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  
  // Use type assertion to access messages state until Redux store is properly configured
  const messagesState = useAppSelector(state => (state as any).messages);
  const { contacts = [], status = 'idle', error = null } = messagesState || {};
  
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchContacts(user.id));
    }
    return () => {
      dispatch(clearMessagesError());
    };
  }, [dispatch, user?.id]);

  const handleStartConversation = (contact: Contact) => {
    dispatch(openModal({
      title: 'New Message',
      bodyType: MODAL_BODY_TYPES.MESSAGE_NEW,
      extraObject: contact
    }));
  };

  const filteredContacts = contacts.filter((contact: Contact) => {
    const matchesSearch = 
      contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === '' || contact.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'student':
        return <GraduationCap size={16} className="text-blue-600" />;
      case 'teacher':
      case 'senior_teacher':
        return <BookOpen size={16} className="text-green-600" />;
      case 'parent':
        return <User size={16} className="text-purple-600" />;
      case 'school_admin':
      case 'regional_admin':
      case 'super_admin':
        return <Shield size={16} className="text-red-600" />;
      default:
        return <User size={16} className="text-gray-600" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'student':
        return 'bg-blue-100 text-blue-800';
      case 'teacher':
      case 'senior_teacher':
        return 'bg-green-100 text-green-800';
      case 'parent':
        return 'bg-purple-100 text-purple-800';
      case 'school_admin':
      case 'regional_admin':
      case 'super_admin':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatRole = (role: string) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const uniqueRoles = [...new Set(contacts.map((contact: Contact) => contact.role))] as string[];

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
          <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600 mt-2">Manage your messaging contacts</p>
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

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search contacts by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="">All Roles</option>
              {uniqueRoles.map((role: string) => (
                <option key={role} value={role}>{formatRole(role)}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <Users size={20} className="text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{contacts.length}</div>
              <div className="text-sm text-gray-500">Total Contacts</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <BookOpen size={20} className="text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {contacts.filter((c: Contact) => c.role.toLowerCase().includes('teacher')).length}
              </div>
              <div className="text-sm text-gray-500">Teachers</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <GraduationCap size={20} className="text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {contacts.filter((c: Contact) => c.role.toLowerCase() === 'student').length}
              </div>
              <div className="text-sm text-gray-500">Students</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg mr-3">
              <Shield size={20} className="text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {contacts.filter((c: Contact) => c.role.toLowerCase().includes('admin')).length}
              </div>
              <div className="text-sm text-gray-500">Administrators</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contacts List */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Available Contacts</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredContacts.length === 0 ? (
            <div className="p-8 text-center">
              <Users size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
              <p className="text-gray-500">
                {searchTerm || roleFilter 
                  ? 'No contacts match your search criteria' 
                  : 'No contacts available for messaging'
                }
              </p>
            </div>
          ) : (
            filteredContacts.map((contact: Contact) => (
              <div
                key={contact.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <User size={24} className="text-gray-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {contact.firstName} {contact.lastName}
                        </p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(contact.role)}`}>
                          {getRoleIcon(contact.role)}
                          <span className="ml-1">{formatRole(contact.role)}</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        <p className="text-sm text-gray-500 flex items-center">
                          <Mail size={14} className="mr-1" />
                          {contact.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleStartConversation(contact)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <MessageSquare size={16} />
                      Message
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactsPage; 