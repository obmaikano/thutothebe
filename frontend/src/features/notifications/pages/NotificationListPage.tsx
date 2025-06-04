import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { 
  fetchNotifications, 
  clearNotificationsError, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  deleteNotification,
  bulkMarkAsRead,
  bulkDelete,
  setNotificationFilter
} from '../notificationsSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { Notification } from '../../../api/services/notificationApi';
import { 
  Bell, 
  Search, 
  Eye, 
  EyeOff, 
  Trash2, 
  CheckCheck, 
  Filter,
  MoreVertical,
  Archive,
  MessageSquare,
  Users,
  Settings as SettingsIcon,
  AlertCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const NotificationListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { notifications, status, error, unreadCount, pagination } = useAppSelector(state => state.notifications);
  const { user } = useAppSelector(state => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchNotifications({ recipientId: user.id }));
    }
    return () => {
      dispatch(clearNotificationsError());
    };
  }, [dispatch, user?.id]);

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await dispatch(markNotificationAsRead(notificationId)).unwrap();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (user?.id) {
      try {
        await dispatch(markAllNotificationsAsRead(user.id)).unwrap();
      } catch (error) {
        console.error('Failed to mark all notifications as read:', error);
      }
    }
  };

  const handleDelete = (notification: Notification) => {
    dispatch(openModal({
      title: 'Delete Notification',
      bodyType: MODAL_BODY_TYPES.NOTIFICATION_DELETE_CONFIRMATION,
      extraObject: notification
    }));
  };

  const handleBulkMarkAsRead = async () => {
    if (selectedNotifications.length > 0) {
      try {
        await dispatch(bulkMarkAsRead(selectedNotifications)).unwrap();
        setSelectedNotifications([]);
      } catch (error) {
        console.error('Failed to mark notifications as read:', error);
      }
    }
  };

  const handleBulkDelete = () => {
    if (selectedNotifications.length > 0) {
      dispatch(openModal({
        title: 'Delete Selected Notifications',
        bodyType: MODAL_BODY_TYPES.NOTIFICATION_BULK_DELETE,
        extraObject: { notificationIds: selectedNotifications }
      }));
    }
  };

  const handleSelectNotification = (notificationId: number) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId) 
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    }
  };

  const filteredNotifications = notifications.filter((notification: Notification) => {
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = 
      typeFilter === '' || notification.type === typeFilter;

    const matchesStatus = 
      statusFilter === '' ||
      (statusFilter === 'unread' && !notification.readAt) ||
      (statusFilter === 'read' && notification.readAt) ||
      (statusFilter === 'active' && notification.active) ||
      (statusFilter === 'inactive' && !notification.active);

    return matchesSearch && matchesType && matchesStatus;
  });

  const getNotificationTypeIcon = (type: string) => {
    switch (type) {
      case 'MESSAGE':
        return <MessageSquare size={16} className="text-blue-600" />;
      case 'GROUP_INVITATION':
        return <Users size={16} className="text-green-600" />;
      case 'GROUP_MESSAGE':
        return <MessageSquare size={16} className="text-purple-600" />;
      case 'SYSTEM':
        return <SettingsIcon size={16} className="text-gray-600" />;
      default:
        return <Bell size={16} className="text-gray-600" />;
    }
  };

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case 'MESSAGE':
        return 'bg-blue-100 text-blue-800';
      case 'GROUP_INVITATION':
        return 'bg-green-100 text-green-800';
      case 'GROUP_MESSAGE':
        return 'bg-purple-100 text-purple-800';
      case 'SYSTEM':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-2">Manage your notifications and stay updated</p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllAsRead} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <CheckCheck size={16} />
              Mark All Read ({unreadCount})
            </button>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
            <button
              onClick={() => dispatch(clearNotificationsError())}
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
              placeholder="Search notifications by title or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="MESSAGE">Message</option>
            <option value="GROUP_INVITATION">Group Invitation</option>
            <option value="GROUP_MESSAGE">Group Message</option>
            <option value="SYSTEM">System</option>
          </select>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedNotifications.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-blue-800 font-medium">
              {selectedNotifications.length} notification(s) selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkMarkAsRead}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
              >
                <Eye size={14} />
                Mark as Read
              </button>
              <button
                onClick={handleBulkDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Summary */}
      {notifications.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Bell size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{notifications.length}</div>
                <div className="text-sm text-gray-500">Total Notifications</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg mr-3">
                <EyeOff size={20} className="text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{unreadCount}</div>
                <div className="text-sm text-gray-500">Unread</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <Eye size={20} className="text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {notifications.filter(n => n.readAt).length}
                </div>
                <div className="text-sm text-gray-500">Read</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <MessageSquare size={20} className="text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {notifications.filter(n => n.type === 'MESSAGE').length}
                </div>
                <div className="text-sm text-gray-500">Messages</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
            <p className="text-gray-500">
              {searchTerm || typeFilter || statusFilter 
                ? "Try adjusting your search criteria" 
                : "You're all caught up! No notifications to display."}
            </p>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0}
                  onChange={handleSelectAll}
                  className="mr-4"
                />
                <div className="flex-1 grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="col-span-1">Type</div>
                  <div className="col-span-4">Title</div>
                  <div className="col-span-3">Content</div>
                  <div className="col-span-2">Created</div>
                  <div className="col-span-1">Status</div>
                  <div className="col-span-1">Actions</div>
                </div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`px-6 py-4 hover:bg-gray-50 transition-colors ${
                    !notification.readAt ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notification.id)}
                      onChange={() => handleSelectNotification(notification.id)}
                      className="mr-4"
                    />
                    <div className="flex-1 grid grid-cols-12 gap-4 items-center">
                      {/* Type */}
                      <div className="col-span-1">
                        <div className="flex items-center gap-2">
                          {getNotificationTypeIcon(notification.type)}
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getNotificationTypeColor(notification.type)}`}>
                            {notification.type.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <div className="col-span-4">
                        <div className="flex items-center gap-2">
                          {!notification.readAt && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {notification.title}
                          </p>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="col-span-3">
                        <p className="text-sm text-gray-600 truncate">
                          {notification.content}
                        </p>
                      </div>

                      {/* Created */}
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </p>
                      </div>

                      {/* Status */}
                      <div className="col-span-1">
                        <div className="flex items-center gap-1">
                          {notification.readAt ? (
                            <Eye size={16} className="text-green-500" />
                          ) : (
                            <EyeOff size={16} className="text-blue-500" />
                          )}
                          <span className="text-xs text-gray-500">
                            {notification.readAt ? 'Read' : 'Unread'}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="col-span-1">
                        <div className="flex items-center gap-1">
                          {!notification.readAt && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                              title="Mark as read"
                            >
                              <Eye size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(notification)}
                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                            title="Delete notification"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {pagination.page * pagination.size + 1} to{' '}
            {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of{' '}
            {pagination.totalElements} notifications
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={!pagination.hasPrevious}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm">
              Page {pagination.page + 1} of {pagination.totalPages}
            </span>
            <button
              disabled={!pagination.hasNext}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationListPage; 