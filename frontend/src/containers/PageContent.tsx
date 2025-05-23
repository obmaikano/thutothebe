import React, { Suspense, useRef, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './Header';
import SuspenseContent from './SuspenseContent';
import { useAppSelector } from '../app/hooks';

// Lazy load route components
const Page404 = React.lazy(() => import('../pages/protected/404'));

interface PageContentProps {
  routes: Array<{
    path: string;
    component: React.ComponentType;
  }>;
}

const PageContent: React.FC<PageContentProps> = ({ routes }) => {
  const mainContentRef = useRef<HTMLElement>(null);
  const { pageTitle } = useAppSelector(state => state.header);

  // Scroll back to top on new page load
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scroll({
        top: 0,
        behavior: "smooth"
      });
    }
  }, [pageTitle]);

  return (
    <div className="drawer-content flex flex-col">
      <Header />
      <main 
        className="flex-1 overflow-y-auto md:pt-4 pt-4 px-6 bg-base-200" 
        ref={mainContentRef}
      >
        <Suspense fallback={<SuspenseContent />}>
          <Routes>
            {routes.map((route, key) => (
              <Route
                key={key}
                path={route.path}
                element={<route.component />}
              />
            ))}
            
            {/* Redirecting unknown url to 404 page */}
            <Route path="*" element={<Page404 />} />
          </Routes>
        </Suspense>
        <div className="h-16"></div>
      </main>
    </div>
  );
};

export default PageContent;