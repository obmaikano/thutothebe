import React from 'react';

const SuspenseContent: React.FC = () => {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="flex flex-col items-center space-y-4">
                <div className="loading loading-spinner loading-lg text-primary"></div>
                <p className="text-gray-600">Loading...</p>
            </div>
        </div>
    );
};

export default SuspenseContent;