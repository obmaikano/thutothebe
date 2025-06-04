import React from 'react';
import { Settings, User } from 'lucide-react';
import { useAppSelector } from '../store';
import { useAuth } from '../contexts/AuthContext';
import NotificationBell from '../features/notifications/components/NotificationBell';

const Header: React.FC = () => {
  const { pageTitle } = useAppSelector(state => state.header);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="navbar bg-white shadow-sm border-b border-gray-200 px-6">
      <div className="flex-1">
        <h1 className="text-xl font-semibold text-gray-800">{pageTitle || 'Dashboard'}</h1>
      </div>
      
      <div className="flex-none">
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          {user?.id && <NotificationBell userId={user.id} />}

          {/* Settings */}
          <button className="btn btn-ghost btn-circle">
            <Settings size={20} />
          </button>

          {/* User Profile Dropdown */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-8 rounded-full">
                <User size={20} />
              </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li><a>Settings</a></li>
              <li><a onClick={handleLogout} className="cursor-pointer">Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header; 