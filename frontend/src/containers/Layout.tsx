import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { GlobalModal } from '../features/common/components/GlobalModal';
import { useAuth } from '../contexts/AuthContext';
import { getMenuItemsByRole } from '../routes/roleSidebar';

export function Layout() {
  const { user } = useAuth();
  const role = user?.role || '';
  
  // Get menu items based on user role
  const menuItems = getMenuItemsByRole(role);

  return (
    <div className="flex h-screen bg-gray-50">
        <Sidebar menuItems={menuItems} />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
        <GlobalModal />
    </div>
  );
}

export default Layout;