import { Route, Routes } from 'react-router-dom';
import routes from '../routes';
import { Suspense, lazy } from 'react';
import SuspenseContent from "./SuspenseContent";
import { useSelector } from 'react-redux';
import { useEffect, useRef } from "react";
import { RootState } from '../app/store';

const Page404 = lazy(() => import('../pages/protected/404'));

function PageContent() {
    const mainContentRef = useRef<HTMLDivElement | null>(null);
    const { pageTitle } = useSelector((state: RootState) => state.common);

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
        <div className="drawer-content flex flex-col" ref={mainContentRef}>
            <Suspense fallback={<SuspenseContent />}>
                <Routes>
                    {routes.map((route, key) => (
                        <Route
                            key={key}
                            path={route.path}
                            element={<route.component />}
                        />
                    ))}
                    {/* Redirecting unknown URL to 404 page */}
                    <Route path="*" element={<Page404 />} />
                </Routes>
            </Suspense>
            <div className="h-16"></div>
        </div>
    );
}

export default PageContent;