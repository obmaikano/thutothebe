import React from 'react';

interface SubtitleProps {
    children: React.ReactNode;
    className?: string;
}

const Subtitle: React.FC<SubtitleProps> = ({ children, className = '' }) => {
    return (
        <h2 className={`text-xl font-semibold ${className}`}>
            {children}
        </h2>
    );
};

export default Subtitle; 