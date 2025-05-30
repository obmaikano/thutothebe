import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { addAttendee, clearCalendarError } from '../calendarEventsSlice';
import { closeModal } from '../../common/modalSlice';
import { CalendarEvent } from '../../../api/services/calendarEventApi';
import userApi, { User } from '../../../api/services/userApi';
import { useAuth } from '../../../contexts/AuthContext';
import { Search, User as UserIcon, UserPlus, AlertCircle } from 'lucide-react';

interface AddAttendeeModalProps {
  extraObject: CalendarEvent;
}

const AddAttendeeModal: React.FC<AddAttendeeModalProps> = ({ extraObject: event }) => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector(state => state.calendarEvents);
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setFetchingUsers(true);
        setFetchError(null);
        
        const response = await userApi.getAll();
        const allUsers = Array.isArray(response.data.data) ? response.data.data : [];
        
        // Filter out users who are already attendees and inactive users
        const currentAttendeeIds = event.attendeeIds || [];
        const filtered = allUsers.filter(user => 
          !currentAttendeeIds.includes(user.id) && 
          user.active &&
          user.id !== event.createdById // Don't include the event creator
        );
        
        setAvailableUsers(filtered);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setFetchError('Failed to load users. Please try again.');
      } finally {
        setFetchingUsers(false);
      }
    };

    fetchUsers();
  }, [event.attendeeIds, event.createdById]);

  const filteredUsers = availableUsers.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    return fullName.includes(searchLower) ||
           user.email.toLowerCase().includes(searchLower) ||
           user.role.toLowerCase().includes(searchLower);
  });

  const handleUserToggle = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAddAttendees = async () => {
    if (selectedUsers.length === 0) return;

    try {
      setLoading(true);
      // Add attendees one by one
      for (const userId of selectedUsers) {
        await dispatch(addAttendee({ eventId: event.id, userId })).unwrap();
      }
      dispatch(closeModal({}));
    } catch (error) {
      console.error('Failed to add attendees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    dispatch(clearCalendarError());
    dispatch(closeModal({}));
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'TEACHER': 
      case 'SENIOR_TEACHER': 
      case 'DEPARTMENT_HEAD': 
        return 'bg-blue-100 text-blue-800';
      case 'STUDENT': 
        return 'bg-green-100 text-green-800';
      case 'PARENT': 
        return 'bg-purple-100 text-purple-800';
      case 'SCHOOL_ADMIN': 
      case 'SCHOOL_HEAD': 
      case 'REGIONAL_ADMIN': 
      case 'REGIONAL_OFFICER':
        return 'bg-red-100 text-red-800';
      case 'MINISTRY_EXECUTIVE':
      case 'MINISTRY_STAFF':
      case 'DIRECTOR':
      case 'SUPER_ADMIN':
        return 'bg-yellow-100 text-yellow-800';
      default: 
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatRoleLabel = (role: string) => {
    return role.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  if (fetchingUsers) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner loading-lg"></div>
          <span className="ml-3 text-gray-600">Loading users...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Add Attendees</h3>
        <p className="text-sm text-gray-600">
          Add attendees to "{event.title}"
        </p>
      </div>

      {/* Fetch Error */}
      {fetchError && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle size={16} />
            <span className="text-sm font-medium">Error loading users</span>
          </div>
          <p className="text-sm text-red-700 mt-1">{fetchError}</p>
        </div>
      )}

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search users by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Selected Count */}
      {selectedUsers.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
          </p>
        </div>
      )}

      {/* Users List */}
      <div className="mb-6">
        <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center">
              <UserIcon size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600">
                {searchTerm ? "Try adjusting your search terms" : "No available users to add"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredUsers.map((userOption) => (
                <div
                  key={userOption.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedUsers.includes(userOption.id) ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                  onClick={() => handleUserToggle(userOption.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(userOption.id)}
                        onChange={() => handleUserToggle(userOption.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <UserIcon size={20} className="text-gray-600" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {userOption.firstName} {userOption.lastName}
                        </h4>
                        <p className="text-sm text-gray-600">{userOption.email}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(userOption.role)}`}>
                      {formatRoleLabel(userOption.role)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle size={16} />
            <span className="text-sm font-medium">Error adding attendees</span>
          </div>
          <p className="text-sm text-red-700 mt-1">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={handleClose}
          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleAddAttendees}
          disabled={selectedUsers.length === 0 || loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <UserPlus size={16} />
          )}
          Add {selectedUsers.length > 0 ? `${selectedUsers.length} ` : ''}Attendee{selectedUsers.length !== 1 ? 's' : ''}
        </button>
      </div>
    </div>
  );
};

export default AddAttendeeModal; 