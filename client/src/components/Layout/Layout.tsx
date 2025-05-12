import React from 'react';
import Header from '../Header/Header';
import Modal from '../Modal/Modal';
import RightDrawer from '../RightDrawer/RightDrawer';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main>
                <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
            <Modal />
            <RightDrawer />
        </div>
    );
};

export default Layout; 