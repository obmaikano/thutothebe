import React, { InputHTMLAttributes } from 'react';
import classNames from 'classnames';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  error,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  ...props
}) => {
  const inputWrapperClasses = classNames(
    'relative',
    fullWidth ? 'w-full' : '',
    className
  );
  
  const inputClasses = classNames(
    'border rounded-md shadow-sm focus:outline-none focus:ring-2 py-2',
    {
      'w-full': fullWidth,
      'pl-10': leftIcon,
      'pr-10': rightIcon,
      'focus:border-primary-500 focus:ring-primary-500 border-gray-300': !error,
      'focus:border-red-500 focus:ring-red-500 border-red-500': error,
    }
  );
  
  return (
    <div className={inputWrapperClasses}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        
        <input
          className={inputClasses}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
      
      {(helperText || error) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}; 