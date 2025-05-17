import React from 'react';
import { Control, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface FormDatePickerProps {
    control: Control<any>;
    name: string;
    label: string;
    required?: boolean;
}

export const FormDatePicker: React.FC<FormDatePickerProps> = ({ control, name, label, required }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <Controller
                control={control}
                name={name}
                render={({ field }) => (
                    <DatePicker
                        {...field}
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        className="block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        dateFormat="yyyy/MM/dd"
                        required={required}
                    />
                )}
            />
        </div>
    );
}; 