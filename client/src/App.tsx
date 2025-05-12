import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

// Lazy load pages
const Login = lazy(() => import('./pages/LoginPage.tsx'));
const Register = lazy(() => import('./pages/Register.tsx'));
const Layout = lazy(() => import('./containers/Layout.tsx'));

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
        <AuthProvider>
            <Router>
                <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/app/*" element={<Layout />} />
                        <Route path="/" element={<Navigate to="/login" replace />} />
                    </Routes>
                </Suspense>
            </Router>
        </AuthProvider>
    );
}

export default App;