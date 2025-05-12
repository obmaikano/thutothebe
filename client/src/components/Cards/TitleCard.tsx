import React from 'react';

interface TitleCardProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}

const TitleCard: React.FC<TitleCardProps> = ({ title, children, className = '' }) => {
    return (
        <div className={`card bg-base-100 shadow-xl ${className}`}>
            <div className="card-body">
                <h2 className="card-title">{title}</h2>
                {children}
            </div>
        </div>
    );
};

export default TitleCard; 