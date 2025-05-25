import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, ChevronDown, ChevronRight, ChevronUp, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { MenuItem } from '../routes/roleSidebar';

interface SidebarProps {
  menuItems: MenuItem[];
}

export function Sidebar({ menuItems }: SidebarProps) {
  const [expanded, setExpanded] = useState(true);
  const [expandedItems, setExpandedItems] = useState<{[key: string]: boolean}>({});
  const { user, logout } = useAuth();
  
  // Format role for display (convert SNAKE_CASE to Title Case)
  const formattedRole = user?.role 
    ? user.role.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l: string) => l.toUpperCase())
    : 'Guest';
  
  // Get user's name or display a default
  const userName = user 
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() 
    : 'Guest User';

  const toggleItemExpansion = (itemPath: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemPath]: !prev[itemPath]
    }));
  };

  const handleLogout = () => {
    logout();
  };

  const renderMenuItem = (item: MenuItem, depth: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.path];
    const paddingLeft = expanded ? (depth === 0 ? 'px-4' : 'px-8') : 'px-2';

    if (hasChildren) {
      return (
        <div key={item.path} className="mb-1">
          {/* Parent menu item */}
          <div className="flex">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center py-2 rounded-lg transition-colors flex-1 ${paddingLeft} ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`
              }
              title={expanded ? '' : `${item.label} - ${item.description}`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {expanded && (
                <div className="ml-3 flex-1">
                  <span className="block text-sm font-medium">{item.label}</span>
                  <span className="block text-xs text-gray-500">{item.description}</span>
                </div>
              )}
            </NavLink>
            {expanded && (
              <button
                onClick={() => toggleItemExpansion(item.path)}
                className="px-2 py-2 text-gray-500 hover:text-gray-700"
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
          
          {/* Children menu items */}
          {expanded && isExpanded && item.children && (
            <div className="ml-4 mt-1 space-y-1">
              {item.children.map((child) => renderMenuItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    // Regular menu item without children
    return (
      <NavLink
        key={item.path}
        to={item.path}
        className={({ isActive }) =>
          `flex items-center py-2 rounded-lg mb-1 transition-colors ${paddingLeft} ${
            isActive
              ? 'bg-indigo-50 text-indigo-700'
              : 'text-gray-700 hover:bg-gray-50'
          }`
        }
        title={expanded ? '' : `${item.label} - ${item.description}`}
      >
        <item.icon className="h-5 w-5 flex-shrink-0" />
        {expanded && (
          <div className="ml-3 flex-1">
            <span className="block text-sm font-medium">{item.label}</span>
            <span className="block text-xs text-gray-500">{item.description}</span>
          </div>
        )}
      </NavLink>
    );
  };

  return (
    <aside className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col h-full ${
      expanded ? 'w-64' : 'w-20'
    }`}>
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <Compass className="h-8 w-8 text-indigo-600 flex-shrink-0" />
        {expanded && <span className="ml-3 text-xl font-semibold">Thuto Thebe</span>}
      </div>
      
      {expanded && (
        <div className="px-6 py-4 border-b border-gray-200">
          <p className="text-sm font-medium text-gray-900">{userName}</p>
          <p className="text-xs text-gray-500">{formattedRole}</p>
        </div>
      )}

      <div className="p-4 flex flex-col flex-1">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center p-2 mb-4 text-gray-500 hover:text-gray-900 rounded-lg"
        >
          {expanded ? (
            <ChevronDown className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </button>

        <nav className="space-y-1 flex-1">
          {menuItems.map((item) => renderMenuItem(item))}
        </nav>

        {/* Logout Button */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center py-2 rounded-lg transition-colors ${
              expanded ? 'px-4' : 'px-2'
            } text-red-600 hover:bg-red-50 hover:text-red-700`}
            title={expanded ? '' : 'Logout'}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {expanded && (
              <div className="ml-3 flex-1 text-left">
                <span className="block text-sm font-medium">Logout</span>
                <span className="block text-xs text-red-500">Sign out of your account</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}