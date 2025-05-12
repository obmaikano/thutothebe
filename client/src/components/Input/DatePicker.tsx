import React, { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from '@heroicons/react/24/outline';

interface DatePickerProps {
    labelTitle?: string;
    labelStyle?: string;
    containerStyle?: string;
    defaultValue?: string;
    placeholder?: string;
    updateFormValue: (obj: { updateType: string; value: string }) => void;
    updateType: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
    labelTitle,
    labelStyle = '',
    containerStyle = '',
    defaultValue = '',
    placeholder = 'Select date',
    updateFormValue,
    updateType,
}) => {
    const [value, setValue] = useState(defaultValue);
    const [isOpen, setIsOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());

    const updateValue = (newValue: string) => {
        setValue(newValue);
        updateFormValue({ updateType, value: newValue });
        setIsOpen(false);
    };

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const getMonthName = (month: number) => {
        return format(new Date(2000, month, 1), 'MMMM');
    };

    const getWeekDays = () => {
        return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    };

    const isToday = (year: number, month: number, day: number) => {
        const today = new Date();
        return (
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === day
        );
    };

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDayOfMonth = getFirstDayOfMonth(year, month);
        const weekDays = getWeekDays();

        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="h-8" />);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const isCurrentDay = isToday(year, month, day);
            const dateStr = format(new Date(year, month, day), 'yyyy-MM-dd');
            const isSelected = value === dateStr;

            days.push(
                <button
                    key={day}
                    className={`h-8 w-8 rounded-full ${
                        isSelected
                            ? 'bg-primary text-white'
                            : isCurrentDay
                            ? 'bg-gray-100'
                            : 'hover:bg-gray-100'
                    }`}
                    onClick={() => updateValue(dateStr)}
                >
                    {day}
                </button>
            );
        }

        return (
            <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <button
                        className="btn btn-ghost btn-sm"
                        onClick={() =>
                            setCurrentDate(new Date(year, month - 1, 1))
                        }
                    >
                        &lt;
                    </button>
                    <span className="font-semibold">
                        {getMonthName(month)} {year}
                    </span>
                    <button
                        className="btn btn-ghost btn-sm"
                        onClick={() =>
                            setCurrentDate(new Date(year, month + 1, 1))
                        }
                    >
                        &gt;
                    </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {weekDays.map((day) => (
                        <div key={day} className="text-sm font-medium text-gray-500">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">{days}</div>
            </div>
        );
    };

    return (
        <div className={`inline-block ${containerStyle}`}>
            {labelTitle && (
                <label className={`label ${labelStyle}`}>
                    <span className="label-text">{labelTitle}</span>
                </label>
            )}
            <div className="relative">
                <input
                    type="text"
                    value={value || ''}
                    placeholder={placeholder}
                    readOnly
                    className="input input-bordered w-full"
                    onClick={() => setIsOpen(!isOpen)}
                />
                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                {isOpen && (
                    <div className="absolute z-10 mt-1 bg-white rounded-lg shadow-lg">
                        {renderCalendar()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DatePicker; 