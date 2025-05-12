import React, { useState } from 'react';
import { Bell, Menu, Sun, Moon, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
    if (showNotifications) setShowNotifications(false);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showUserMenu) setShowUserMenu(false);
  };

  const handleLogout = () => {
    logout();
  };

  // Mock notifications for demonstration
  const notifications = [
    { id: '1', title: 'Assignment Due', message: 'Math assignment due tomorrow', time: '2 hours ago' },
    { id: '2', title: 'New Course', message: 'You have been enrolled in Science 101', time: '1 day ago' },
    { id: '3', title: 'System Update', message: 'LMS will be under maintenance tonight', time: '2 days ago' },
  ];

  return (
    <header className="bg-white shadow-lg h-16 flex items-center justify-between px-4 lg:px-8 z-10 w-full">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-full text-gray-600 hover:bg-gray-100 lg:hidden"
          aria-label="Toggle navigation"
        >
          <Menu size={24} />
        </button>
        {/* Optional: Brand on mobile */}
        <span className="ml-2 text-xl font-bold text-blue-800 lg:hidden">Botswana LMS</span>
      </div>

      <div className="flex items-center space-x-2">
        {/* Theme toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full text-gray-600 hover:bg-gray-100"
          aria-label="Toggle theme"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={toggleNotifications}
            className="p-2 rounded-full text-gray-600 hover:bg-gray-100 relative"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-xs text-white rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-30 border border-gray-200">
              <div className="px-4 py-2 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                    <p className="font-medium text-gray-800">{notification.title}</p>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 text-center">
                <a href="#" className="text-sm text-blue-600 hover:underline">View all notifications</a>
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={toggleUserMenu}
            className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100"
            aria-label="User menu"
          >
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-gray-800">{user ? `${user.firstName} ${user.lastName}` : ''}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role.replace('_', ' ')}</p>
            </div>
            <img
              src={"https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150"}
              alt="User"
              className="h-8 w-8 rounded-full object-cover border border-gray-200"
            />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-30 border border-gray-200">
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <Settings size={16} className="mr-2" />
                Settings
              </a>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;