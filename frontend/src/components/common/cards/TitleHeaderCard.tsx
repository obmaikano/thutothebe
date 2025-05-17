import React from 'react';
import { Link } from 'react-router-dom';

interface CardProps {
  title: string;
  linkTo?: string;
  buttonText: string;
  buttonIcon?: React.ReactNode; // Optional icon
  onButtonClick?: () => void; // Optional click handler
}

const TitleHeaderCard: React.FC<CardProps> = ({ title, linkTo, buttonText, buttonIcon, onButtonClick }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      {onButtonClick ? (
        <button
          onClick={onButtonClick}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {buttonIcon && <span className="mr-2">{buttonIcon}</span>}
          {buttonText}
        </button>
      ) : (
        <Link
          to={linkTo || '#'}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {buttonIcon && <span className="mr-2">{buttonIcon}</span>}
          {buttonText}
        </Link>
      )}
    </div>
  );
};

export default TitleHeaderCard; 