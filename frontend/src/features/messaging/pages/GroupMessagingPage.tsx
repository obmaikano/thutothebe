import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  fetchUserGroups, 
  fetchMemberGroups, 
  clearMessagesError 
} from '../messagesSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { MessageGroup } from '../../../api/services/messageApi';
import { 
  Users, 
  Search, 
  Plus, 
  Settings, 
  Trash2, 
  Edit, 
  UserPlus,
  MessageSquare,
  Crown,
  Calendar
} from 'lucide-react';

const GroupMessagingPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  
  // Use type assertion to access messages state until Redux store is properly configured
  const messagesState = useAppSelector(state => (state as any).messages);
  const { messageGroups = [], status = 'idle', error = null } = messagesState || {};
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'created' | 'member'>('all');

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserGroups(user.id));
      dispatch(fetchMemberGroups(user.id));
    }
    return () => {
      dispatch(clearMessagesError());
    };
  }, [dispatch, user?.id]);

  const handleCreateGroup = () => {
    dispatch(openModal({
      title: 'Create Group',
      bodyType: MODAL_BODY_TYPES.MESSAGE_GROUP_CREATE,
      size: 'lg'
    }));
  };

  const handleEditGroup = (group: MessageGroup) => {
    dispatch(openModal({
      title: 'Edit Group',
      bodyType: MODAL_BODY_TYPES.MESSAGE_GROUP_EDIT,
      extraObject: group
    }));
  };

  const handleDeleteGroup = (group: MessageGroup) => {
    dispatch(openModal({
      title: 'Delete Group',
      bodyType: MODAL_BODY_TYPES.MESSAGE_GROUP_DELETE_CONFIRMATION,
      extraObject: group
    }));
  };

  const handleAddMember = (group: MessageGroup) => {
    dispatch(openModal({
      title: 'Add Member',
      bodyType: MODAL_BODY_TYPES.MESSAGE_GROUP_ADD_MEMBER,
      extraObject: group
    }));
  };

  const handleGroupDetails = (group: MessageGroup) => {
    dispatch(openModal({
      title: 'Group Details',
      bodyType: MODAL_BODY_TYPES.MESSAGE_GROUP_DETAILS,
      extraObject: group
    }));
  };

  const handleOpenGroup = (group: MessageGroup) => {
    // Navigate to group conversation
    window.location.href = `/app/messages/group/${group.id}`;
  };

  const filteredGroups = messageGroups.filter((group: MessageGroup) => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (group.description && group.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'created' && group.creatorId === user?.id) ||
                         (filterType === 'member' && group.creatorId !== user?.id);
    
    return matchesSearch && matchesFilter;
  });

  const isGroupCreator = (group: MessageGroup) => group.creatorId === user?.id;

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
          <h1 className="text-3xl font-bold text-gray-900">Group Messages</h1>
          <p className="text-gray-600 mt-2">Create and manage group conversations</p>
        </div>
        <button 
          onClick={handleCreateGroup} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={16} />
          Create Group
        </button>
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
              placeholder="Search groups by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | 'created' | 'member')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Groups</option>
            <option value="created">Created by Me</option>
            <option value="member">Member of</option>
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <Users size={20} className="text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{messageGroups.length}</div>
              <div className="text-sm text-gray-500">Total Groups</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <Crown size={20} className="text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {messageGroups.filter((g: MessageGroup) => g.creatorId === user?.id).length}
              </div>
              <div className="text-sm text-gray-500">Created by Me</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <UserPlus size={20} className="text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {messageGroups.filter((g: MessageGroup) => g.creatorId !== user?.id).length}
              </div>
              <div className="text-sm text-gray-500">Member of</div>
            </div>
          </div>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.length === 0 ? (
          <div className="col-span-full">
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <Users size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No groups found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'No groups match your search criteria' : 'Create your first group to start collaborating'}
              </p>
              {!searchTerm && (
                <button 
                  onClick={handleCreateGroup}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
                >
                  <Plus size={16} />
                  Create Group
                </button>
              )}
            </div>
          </div>
        ) : (
          filteredGroups.map((group: MessageGroup) => (
            <div
              key={group.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                    {isGroupCreator(group) && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Crown size={12} className="mr-1" />
                        Creator
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleGroupDetails(group)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    title="Group Details"
                  >
                    <Settings size={16} className="text-gray-600" />
                  </button>
                  {isGroupCreator(group) && (
                    <>
                      <button
                        onClick={() => handleEditGroup(group)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Edit Group"
                      >
                        <Edit size={16} className="text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteGroup(group)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Delete Group"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {group.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{group.description}</p>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span className="flex items-center">
                  <UserPlus size={14} className="mr-1" />
                  {group.memberIds?.length || 0} members
                </span>
                <span className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  Created recently
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleOpenGroup(group)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare size={16} />
                  Open Chat
                </button>
                {isGroupCreator(group) && (
                  <button
                    onClick={() => handleAddMember(group)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    title="Add Member"
                  >
                    <UserPlus size={16} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GroupMessagingPage; 