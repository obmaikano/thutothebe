import React from 'react';

interface LoaderProps {
    size?: 'sm' | 'md' | 'lg';
    variant?: 'spinner' | 'dots' | 'ring';
    containerStyle?: string;
}

const Loader: React.FC<LoaderProps> = ({
    size = 'md',
    variant = 'spinner',
    containerStyle = '',
}) => {
    const sizeClasses = {
        sm: 'loading-sm',
        md: 'loading-md',
        lg: 'loading-lg',
    };

    const variantClasses = {
        spinner: 'loading-spinner',
        dots: 'loading-dots',
        ring: 'loading-ring',
    };

    return (
        <div className={`flex justify-center items-center ${containerStyle}`}>
            <span
                className={`loading ${variantClasses[variant]} ${sizeClasses[size]}`}
                role="status"
                aria-label="Loading"
            />
        </div>
    );
};

export default Loader; 