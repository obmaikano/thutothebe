import React from 'react';

interface ErrorTextProps {
    children: React.ReactNode;
    styleClass?: string;
}

const ErrorText: React.FC<ErrorTextProps> = ({ children, styleClass = '' }) => {
    return (
        <p className={`text-sm text-red-600 ${styleClass}`}>
            {children}
        </p>
    );
};

export default ErrorText; 