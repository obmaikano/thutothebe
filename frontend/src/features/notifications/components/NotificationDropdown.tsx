import React, { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchUnreadNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../notificationsSlice';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Eye, EyeOff, Settings, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NotificationDropdownProps {
  userId: number;
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ userId, onClose }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const notificationsState = useAppSelector(state => state.notifications);
  const notifications = notificationsState?.notifications || [];
  const status = notificationsState?.status || 'idle';
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUnreadNotifications(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleNotificationClick = async (notificationId: number) => {
    try {
      await dispatch(markNotificationAsRead(notificationId)).unwrap();
      onClose();
      navigate('/app/notifications');
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await dispatch(markAllNotificationsAsRead(userId)).unwrap();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const handleViewAll = () => {
    onClose();
    navigate('/app/notifications');
  };

  const handleSettings = () => {
    onClose();
    navigate('/app/notifications/settings');
  };

  const getNotificationTypeIcon = (type: string) => {
    switch (type) {
      case 'MESSAGE':
        return '💬';
      case 'GROUP_INVITATION':
        return '👥';
      case 'GROUP_MESSAGE':
        return '📢';
      case 'SYSTEM':
        return '⚙️';
      default:
        return '🔔';
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

  const unreadNotifications = notifications.filter(n => !n.readAt);

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
        <div className="flex items-center space-x-2">
          {unreadNotifications.length > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              title="Mark all as read"
            >
              <CheckCheck size={16} />
              Mark all read
            </button>
          )}
          <button
            onClick={handleSettings}
            className="text-gray-500 hover:text-gray-700"
            title="Notification settings"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-h-96 overflow-y-auto">
        {status === 'loading' ? (
          <div className="flex justify-center items-center p-8">
            <div className="loading loading-spinner loading-md"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No notifications yet</p>
            <p className="text-sm">You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.slice(0, 10).map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification.id)}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  !notification.readAt ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">
                      {getNotificationTypeIcon(notification.type)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getNotificationTypeColor(notification.type)}`}>
                        {notification.type.replace('_', ' ')}
                      </span>
                      {!notification.readAt ? (
                        <EyeOff size={14} className="text-blue-500" />
                      ) : (
                        <Eye size={14} className="text-gray-400" />
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-900 mt-1 line-clamp-2">
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {notification.content}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleViewAll}
            className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown; 