import React from 'react';

interface HelperTextProps {
    children: React.ReactNode;
    styleClass?: string;
}

const HelperText: React.FC<HelperTextProps> = ({ children, styleClass = '' }) => {
    return (
        <p className={`text-sm text-gray-500 ${styleClass}`}>
            {children}
        </p>
    );
};

export default HelperText; 