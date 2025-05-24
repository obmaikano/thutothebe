import { lazy, Suspense, useEffect } from 'react';
import './index.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store'; // Import your store
import { AuthProvider, useAuth } from './contexts/AuthContext';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
//import 'react-leaflet-draw/dist/react-leaflet-draw.css';

// Importing pages
const Layout = lazy(() => import('./containers/Layout'));
const LoginPage = lazy(() => import('./pages/Login'));

// Simple help page component
const HelpPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-50 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl p-8">
            <h1 className="text-3xl font-bold text-blue-800 mb-6">Help & Support</h1>
            <div className="space-y-4">
                <p className="text-gray-700">
                    Welcome to Thuto Thebe Learning Management System. If you need assistance with logging in or using the platform, please contact your system administrator.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">Login Issues?</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Make sure you're using the correct email address</li>
                        <li>• Check that your password is correct</li>
                        <li>• Contact your school administrator if you forgot your password</li>
                    </ul>
                </div>
                <div className="mt-6">
                    <a href="/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Back to Login
                    </a>
                </div>
            </div>
        </div>
    </div>
);

// Simple forgot password page component
const ForgotPasswordPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-50 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
            <h1 className="text-3xl font-bold text-blue-800 mb-6">Forgot Password</h1>
            <p className="text-gray-700 mb-6">
                Please contact your system administrator or school IT department to reset your password.
            </p>
            <div className="mt-6">
                <a href="/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Back to Login
                </a>
            </div>
        </div>
    </div>
);

// AuthGuard component to handle routing based on authentication status
function AuthGuard() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
            <Routes>
                {/* Public routes */}
                <Route 
                    path="/login" 
                    element={
                        isAuthenticated ? <Navigate to="/app/dashboard" replace /> : <LoginPage />
                    } 
                />
                
                <Route 
                    path="/forgot-password" 
                    element={
                        isAuthenticated ? <Navigate to="/app/dashboard" replace /> : <ForgotPasswordPage />
                    } 
                />
                
                <Route 
                    path="/help" 
                    element={
                        isAuthenticated ? <Navigate to="/app/dashboard" replace /> : <HelpPage />
                    } 
                />
                
                {/* Protected routes */}
                <Route 
                    path="/app/*" 
                    element={
                        isAuthenticated ? <Layout /> : <Navigate to="/login" replace />
                    } 
                />
                
                {/* Default redirect */}
                <Route 
                    path="*" 
                    element={
                        <Navigate to={isAuthenticated ? "/app/dashboard" : "/login"} replace />
                    } 
                />
            </Routes>
        </Suspense>
    );
}

function App() {
    // Disable browser theme detection
    useEffect(() => {
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
                    <AuthGuard />
                </AuthProvider>
            </Router>
        </Provider>
    );
}

export default App;