import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { LucideIcon } from 'lucide-react';

export interface FormSelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  control: Control<any>;
  name: string;
  label: string;
  options: FormSelectOption[];
  required?: boolean;
  icon?: LucideIcon;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  control,
  name,
  label,
  options,
  required = false,
  icon: Icon,
}) => {
  return (
    <div className="form-control w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <Controller
          control={control}
          name={name}
          render={({ field, fieldState: { error } }) => (
            <div>
              <select
                className={`w-full border-gray-300 rounded-md shadow-sm ${
                  Icon ? 'pl-10' : 'pl-3'
                } pr-10 py-2 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  error ? 'border-red-500' : 'border-gray-300'
                }`}
                {...field}
              >
                <option value="">Select {label}</option>
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {error && (
                <p className="mt-1 text-sm text-red-600">{error.message}</p>
              )}
            </div>
          )}
        />
      </div>
    </div>
  );
}; 