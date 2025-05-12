import React from 'react';

interface PageContentProps {
    title?: string;
    subtitle?: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
    containerStyle?: string;
}

const PageContent: React.FC<PageContentProps> = ({
    title,
    subtitle,
    children,
    actions,
    containerStyle = '',
}) => {
    return (
        <div className={`min-h-screen bg-gray-50 ${containerStyle}`}>
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {(title || subtitle || actions) && (
                    <div className="md:flex md:items-center md:justify-between mb-6">
                        <div className="flex-1 min-w-0">
                            {title && (
                                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                                    {title}
                                </h2>
                            )}
                            {subtitle && (
                                <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
                            )}
                        </div>
                        {actions && (
                            <div className="mt-4 flex md:mt-0 md:ml-4">{actions}</div>
                        )}
                    </div>
                )}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">{children}</div>
                </div>
            </div>
        </div>
    );
};

export default PageContent; 