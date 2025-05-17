import React from 'react';

interface TitleCardProps {
  title: string;
  children: React.ReactNode;
  topMargin?: string;
  TopSideButtons?: React.ReactNode;
}

function TitleCard({ title, children, topMargin = "mt-6", TopSideButtons }: TitleCardProps) {
  return (
    <div className={`card w-full p-6 bg-base-100 shadow-xl ${topMargin}`}>
      {/* Title for Card */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {title}
        </h2>
        
        {/* Top side buttons, show only if present */}
        {TopSideButtons && <div>{TopSideButtons}</div>}
      </div>
      
      <div className="divider mt-2"></div>
    
      {/* Card Body */}
      <div className='h-full w-full bg-base-100'>
        {children}
      </div>
    </div>
  );
}

export default TitleCard; 