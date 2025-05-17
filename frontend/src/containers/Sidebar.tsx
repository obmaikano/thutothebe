import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, ChevronDown, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { MenuItem } from '../routes/roleSidebar';

interface SidebarProps {
  menuItems: MenuItem[];
}

export function Sidebar({ menuItems }: SidebarProps) {
  const [expanded, setExpanded] = useState(true);
  const { user } = useAuth();
  
  // Format role for display (convert SNAKE_CASE to Title Case)
  const formattedRole = user?.role 
    ? user.role.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l: string) => l.toUpperCase())
    : 'Guest';
  
  // Get user's name or display a default
  const userName = user 
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() 
    : 'Guest User';

  return (
    <aside className={`bg-white border-r border-gray-200 transition-all duration-300 ${
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

      <div className="p-4">
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

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-lg mb-1 transition-colors ${
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
          ))}
        </nav>
      </div>
    </aside>
  );
}