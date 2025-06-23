import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import Header from './Header';
import Footer from '../components/common/Footer';
import { GlobalModal } from '../features/common/components/GlobalModal';
import { useAuth } from '../contexts/AuthContext';
import { getMenuItemsByRole } from '../routes/roleSidebar';
import appRoutes from '../routes/index';

export function Layout() {
  const { user } = useAuth();
  const role = user?.role || '';

  const menuItems = getMenuItemsByRole(role);

  return (
    <div className="flex bg-gray-50">
      <Sidebar menuItems={menuItems} />
      <div className="flex flex-col flex-1 min-h-full">
        <Header />
        <main className="flex-1 p-6">
          <Suspense fallback={<div className="flex justify-center items-center min-h-64">Loading...</div>}>
            <Routes>
              {appRoutes.map((route, index) => {
                const Element = route.element;
                return (
                  <Route 
                    key={index} 
                    path={route.path} 
                    element={<Element />} 
                  />
                );
              })}
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
      <GlobalModal />
    </div>
  );
}


export default Layout;