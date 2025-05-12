import React from 'react';

interface TitleProps {
    children: React.ReactNode;
    styleClass?: string;
}

const Title: React.FC<TitleProps> = ({ children, styleClass = '' }) => {
    return (
        <h1 className={`text-2xl font-semibold text-gray-900 ${styleClass}`}>
            {children}
        </h1>
    );
};

export default Title; 