import React, { useState } from 'react';

interface InputTextProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    containerClassName?: string;
    labelClassName?: string;
    inputClassName?: string;
    errorClassName?: string;
}

const InputText: React.FC<InputTextProps> = ({
    label,
    error,
    leftIcon,
    rightIcon,
    containerClassName = '',
    labelClassName = '',
    inputClassName = '',
    errorClassName = '',
    className = '',
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);

    // Base classes
    const baseContainerClasses = 'w-full';
    const baseLabelClasses = 'block text-sm font-medium text-gray-700 mb-1';
    const baseInputClasses = `
        block w-full rounded-md border-gray-300 shadow-sm
        focus:border-blue-500 focus:ring-blue-500 sm:text-sm
        disabled:bg-gray-100 disabled:cursor-not-allowed
        ${error ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' : ''}
    `;
    const baseErrorClasses = 'mt-1 text-sm text-red-600';

    // Icon wrapper classes
    const iconWrapperClasses = 'absolute inset-y-0 flex items-center pointer-events-none';
    const leftIconClasses = 'left-0 pl-3';
    const rightIconClasses = 'right-0 pr-3';

    // Input padding classes based on icons
    const inputPaddingClasses = `
        ${leftIcon ? 'pl-10' : 'pl-3'}
        ${rightIcon ? 'pr-10' : 'pr-3'}
    `;

    return (
        <div className={`${baseContainerClasses} ${containerClassName}`}>
            {label && (
                <label className={`${baseLabelClasses} ${labelClassName}`}>
                    {label}
                </label>
            )}
            
            <div className="relative">
                {leftIcon && (
                    <div className={`${iconWrapperClasses} ${leftIconClasses}`}>
                        {leftIcon}
                    </div>
                )}
                
                <input
                    className={`
                        ${baseInputClasses}
                        ${inputPaddingClasses}
                        ${inputClassName}
                        ${className}
                    `}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />
                
                {rightIcon && (
                    <div className={`${iconWrapperClasses} ${rightIconClasses}`}>
                        {rightIcon}
                    </div>
                )}
            </div>
            
            {error && (
                <p className={`${baseErrorClasses} ${errorClassName}`}>
                    {error}
                </p>
            )}
        </div>
    );
};

export default InputText; 