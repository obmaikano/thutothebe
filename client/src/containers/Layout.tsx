import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import routes from '../routes';

const Layout: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <main className="py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Routes>
                        {routes.map((route) => (
                            <Route
                                key={route.path}
                                path={route.path}
                                element={
                                    <ProtectedRoute>
                                        <route.component />
                                    </ProtectedRoute>
                                }
                            />
                        ))}
                        <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};

export default Layout; 