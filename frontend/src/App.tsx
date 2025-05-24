import { lazy, Suspense, useEffect } from 'react';
import './index.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store'; // Import your store
import { AuthProvider } from './contexts/AuthContext';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
//import 'react-leaflet-draw/dist/react-leaflet-draw.css';

// Importing pages
const Layout = lazy(() => import('./containers/Layout'));

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
                    <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
                        <Routes>
                            <Route path="/app/*" element={<Layout />} />
                            <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
                        </Routes>
                    </Suspense>
                </AuthProvider>
            </Router>
        </Provider>
    );
}

export default App;