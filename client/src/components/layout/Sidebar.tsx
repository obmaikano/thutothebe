import React from 'react';
import { 
  LayoutDashboard, BookOpen, Users, School, Calendar, FileText, 
  BarChart2, Settings, HelpCircle, User, Home, GraduationCap, MessageSquare
} from 'lucide-react';
import { UserRole } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface NavItem {
  title: string;
  icon: React.ReactNode;
  path: string;
  roles: UserRole[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth();
  
  const navItems: NavItem[] = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      path: '/dashboard',
      roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT],
    },
    {
      title: 'Courses',
      icon: <BookOpen size={20} />,
      path: '/courses',
      roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT],
    },
    {
      title: 'Schools',
      icon: <School size={20} />,
      path: '/schools',
      roles: [UserRole.ADMIN],
    },
    {
      title: 'Users',
      icon: <Users size={20} />,
      path: '/users',
      roles: [UserRole.ADMIN],
    },
    {
      title: 'Calendar',
      icon: <Calendar size={20} />,
      path: '/calendar',
      roles: [UserRole.TEACHER, UserRole.STUDENT],
    },
    {
      title: 'Assignments',
      icon: <FileText size={20} />,
      path: '/assignments',
      roles: [UserRole.TEACHER, UserRole.STUDENT],
    },
    {
      title: 'Messages',
      icon: <MessageSquare size={20} />,
      path: '/messages',
      roles: [UserRole.TEACHER, UserRole.STUDENT],
    },
    {
      title: 'Reports',
      icon: <BarChart2 size={20} />,
      path: '/reports',
      roles: [UserRole.ADMIN, UserRole.TEACHER],
    },
    {
      title: 'Profile',
      icon: <User size={20} />,
      path: '/profile',
      roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT],
    },
    {
      title: 'Settings',
      icon: <Settings size={20} />,
      path: '/settings',
      roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT],
    },
    {
      title: 'Help Center',
      icon: <HelpCircle size={20} />,
      path: '/help',
      roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT],
    },
  ];

  // Filter menu items based on user role
  const filteredNavItems = navItems.filter(item => 
    user?.role ? item.roles.includes(user.role as UserRole) : false
  );

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <nav className="w-full h-full flex flex-col bg-blue-900 text-white shadow-lg overflow-y-auto">
      <div className="p-5 flex items-center justify-between border-b border-blue-800">
        <div className="flex items-center">
          <Home size={24} className="text-white" />
          <h2 className="text-xl font-bold ml-2">Botswana LMS</h2>
        </div>
        <button 
          onClick={closeSidebar}
          className="text-white rounded p-1 hover:bg-blue-800 lg:hidden"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="px-3 py-4 flex-1">
        <div className="mb-2 px-3">
          <p className="text-xs uppercase text-blue-300 font-medium">Navigation</p>
        </div>
        <nav className="space-y-1">
          {filteredNavItems.map((item, index) => (
            <a
              key={index}
              href={item.path}
              className="flex items-center text-white px-3 py-2.5 rounded-md transition-colors hover:bg-blue-800 group"
            >
              <span className="mr-3 text-blue-300 group-hover:text-white">{item.icon}</span>
              <span>{item.title}</span>
            </a>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-blue-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button className="text-blue-300 hover:text-white">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </button>
            <button className="text-blue-300 hover:text-white">EN</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;