import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getDaysInMonth, getFirstDayOfMonth, getMonthName, getWeekDays, isToday } from './util';

interface CalendarEvent {
    id: number;
    title: string;
    date: Date;
}

interface CalendarViewProps {
    events?: CalendarEvent[];
    onDateClick?: (date: Date) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ events = [], onDateClick }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const monthName = getMonthName(month);
    const weekDays = getWeekDays();

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1));
    };

    const handleDateClick = (day: number) => {
        if (onDateClick) {
            onDateClick(new Date(year, month, day));
        }
    };

    const renderCalendarDays = () => {
        const days = [];
        const totalDays = firstDayOfMonth + daysInMonth;
        const totalWeeks = Math.ceil(totalDays / 7);

        for (let week = 0; week < totalWeeks; week++) {
            for (let day = 0; day < 7; day++) {
                const dayNumber = week * 7 + day - firstDayOfMonth + 1;
                const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
                const isCurrentDay = isCurrentMonth && isToday(year, month, dayNumber);

                days.push(
                    <div
                        key={`${week}-${day}`}
                        className={`calendar-day ${isCurrentMonth ? 'cursor-pointer hover:bg-gray-100' : 'bg-gray-50'} ${
                            isCurrentDay ? 'bg-primary text-white' : ''
                        }`}
                        onClick={() => isCurrentMonth && handleDateClick(dayNumber)}
                    >
                        {isCurrentMonth ? dayNumber : ''}
                    </div>
                );
            }
        }

        return days;
    };

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <button onClick={handlePrevMonth} className="btn btn-ghost btn-sm">
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <h2 className="text-xl font-semibold">
                    {monthName} {year}
                </h2>
                <button onClick={handleNextMonth} className="btn btn-ghost btn-sm">
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>
            <div className="calendar-grid">
                {weekDays.map((day) => (
                    <div key={day} className="calendar-weekday">
                        {day}
                    </div>
                ))}
                {renderCalendarDays()}
            </div>
        </div>
    );
};

export default CalendarView; 