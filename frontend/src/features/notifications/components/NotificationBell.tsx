import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchUnreadCount } from '../notificationsSlice';
import NotificationDropdown from './NotificationDropdown.tsx';

interface NotificationBellProps {
  userId: number;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ userId }) => {
  const dispatch = useAppDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [localUnreadCount, setLocalUnreadCount] = useState(0);

  // Safely access the notifications state with fallbacks
  const notificationsState = useAppSelector(state => {
    try {
      return state?.notifications || null;
    } catch (error) {
      console.warn('Error accessing notifications state:', error);
      return null;
    }
  });

  const unreadCount = notificationsState?.unreadCount ?? localUnreadCount;

  useEffect(() => {
    if (userId && dispatch) {
      // Dispatch the action and handle any errors
      const fetchCount = async () => {
        try {
          const result = await dispatch(fetchUnreadCount(userId));
          if (fetchUnreadCount.fulfilled.match(result)) {
            setLocalUnreadCount(result.payload);
          }
        } catch (error) {
          console.warn('Failed to fetch unread count:', error);
          // Set a default value or keep the current local count
          setLocalUnreadCount(0);
        }
      };

      fetchCount();
      
      // Poll for unread count every 30 seconds
      const interval = setInterval(() => {
        fetchCount();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [dispatch, userId]);

  const handleBellClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCloseDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={handleBellClick}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isDropdownOpen && (
        <NotificationDropdown
          userId={userId}
          onClose={handleCloseDropdown}
        />
      )}
    </div>
  );
};

export default NotificationBell; 