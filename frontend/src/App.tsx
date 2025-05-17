import { lazy, Suspense, useEffect } from 'react';
import './index.css';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store'; // Import your store
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { isPublicRoute } from './app/auth';
import { initializeApp } from './app/init';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Importing pages
const Layout = lazy(() => import('./containers/Layout'));
const Login = lazy(() => import('./pages/Login'));

// Component to handle default route redirection
const DefaultRedirect = () => {
    const { pathname } = useLocation();
    const { isAuthenticated } = useAuth();
    
    // If the path is already a valid route, don't redirect
    if (pathname !== '/') {
        // Check if the route requires authentication
        if (!isPublicRoute(pathname) && !isAuthenticated) {
            return <Navigate to="/login" replace />;
        }
        return <Navigate to={pathname} replace />;
    }
    
    // Default redirection based on authentication status
    return isAuthenticated 
        ? <Navigate to="/app/dashboard" replace />
        : <Navigate to="/login" replace />;
};

// Wrapper to ensure DefaultRedirect can access hooks
const RouteManager = () => {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route 
                path="/app/*" 
                element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                } 
            />
            
            {/* Default redirect */}
            <Route path="*" element={<DefaultRedirect />} />
        </Routes>
    );
};

function App() {
    // Initialize app and setup theme
    useEffect(() => {
        // Initialize the app and auth state
        initializeApp();
        
        // Set theme-color meta tag
        let themeColor = document.querySelector('meta[name="theme-color"]');
        if (!themeColor) {
            themeColor = document.createElement('meta');
            themeColor.setAttribute('name', 'theme-color');
            document.head.appendChild(themeColor);
        }
        themeColor.setAttribute('content', '#ffffff');
        
        // Set color-scheme meta tag to force light mode
        let colorScheme = document.querySelector('meta[name="color-scheme"]');
        if (!colorScheme) {
            colorScheme = document.createElement('meta');
            colorScheme.setAttribute('name', 'color-scheme');
            document.head.appendChild(colorScheme);
        }
        colorScheme.setAttribute('content', 'light');
        
        // Set the data-theme attribute on the HTML element
        document.documentElement.setAttribute('data-theme', 'light');
        
        // Force light mode with CSS
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
    }, []);

    return (
        <Provider store={store}> 
            <Router>
                <AuthProvider>
                    <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
                        <RouteManager />
                    </Suspense>
                </AuthProvider>
            </Router>
        </Provider>
    );
}

export default App;