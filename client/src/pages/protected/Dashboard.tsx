import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import StudentDashboard from '../../components/dashboard/StudentDashboard';
import TeacherDashboard from '../../components/dashboard/TeacherDashboard';
import AdminDashboard from '../../components/dashboard/AdminDashboard';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';

function InternalPage() {
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const renderDashboard = () => {
        switch (user?.role) {
            case UserRole.STUDENT:
                return <StudentDashboard />;
            case UserRole.TEACHER:
                return <TeacherDashboard />;
            case UserRole.ADMIN:
                return <AdminDashboard />;
            default:
                return <div>Dashboard not available for this role</div>;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar for desktop */}
            <aside className="hidden lg:flex w-64 h-full bg-blue-900 text-white flex-col shadow-lg overflow-y-auto z-20">
                <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            </aside>
            {/* Mobile Drawer */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 flex lg:hidden">
                    <div className="w-64 bg-blue-900 text-white flex flex-col shadow-lg h-full">
                        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
                    </div>
                    <div className="flex-1" onClick={() => setSidebarOpen(false)} />
                </div>
            )}
            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8">
                    {renderDashboard()}
                </main>
            </div>
        </div>
    );
}

export default InternalPage; 