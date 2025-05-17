import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { LucideIcon } from 'lucide-react';

interface FormInputProps {
    control: Control<any>;
    name: string;
    label: string;
    placeholder?: string;
    type?: string;
    icon?: LucideIcon;
}

export const FormInput: React.FC<FormInputProps> = ({ control, name, label, placeholder, type = 'text', icon }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="mt-1 relative">
                {icon && (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        {React.createElement(icon, { className: "h-5 w-5 text-gray-400", "aria-hidden": "true" })}
                    </span>
                )}
                <Controller
                    control={control}
                    name={name}
                    render={({ field }) => (
                        <input
                            {...field}
                            type={type}
                            placeholder={placeholder}
                            className={`block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${icon ? 'pl-10' : ''}`}
                        />
                    )}
                />
            </div>
        </div>
    );
}; 