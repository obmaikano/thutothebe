import React from 'react';

const TemplatePointers: React.FC = () => {
    return (
        <div className="flex items-center justify-center mt-4">
            <button className="px-4 py-2 border rounded-l-md border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                English
            </button>
            <button className="px-4 py-2 border-t border-b border-r rounded-r-md border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                Setswana
            </button>
        </div>
    );
};

export default TemplatePointers; 