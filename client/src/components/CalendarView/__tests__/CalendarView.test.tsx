import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CalendarView from '../index';

describe('CalendarView', () => {
    const mockOnDateClick = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders current month and year', () => {
        const currentDate = new Date();
        const monthName = currentDate.toLocaleString('default', { month: 'long' });
        const year = currentDate.getFullYear();

        render(<CalendarView />);
        
        expect(screen.getByText(`${monthName} ${year}`)).toBeInTheDocument();
    });

    it('renders all weekdays', () => {
        render(<CalendarView />);
        
        const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        weekDays.forEach(day => {
            expect(screen.getByText(day)).toBeInTheDocument();
        });
    });

    it('handles month navigation', () => {
        render(<CalendarView />);
        
        const nextButton = screen.getByRole('button', { name: /next/i });
        fireEvent.click(nextButton);
        
        const currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() + 1);
        const nextMonthName = currentDate.toLocaleString('default', { month: 'long' });
        const year = currentDate.getFullYear();
        
        expect(screen.getByText(`${nextMonthName} ${year}`)).toBeInTheDocument();
    });

    it('calls onDateClick when a date is clicked', () => {
        render(<CalendarView onDateClick={mockOnDateClick} />);
        
        const firstDayOfMonth = screen.getAllByRole('button')[2]; // Skip navigation buttons
        fireEvent.click(firstDayOfMonth);
        
        expect(mockOnDateClick).toHaveBeenCalled();
    });

    it('highlights current day', () => {
        const currentDate = new Date();
        render(<CalendarView />);
        
        const currentDay = currentDate.getDate().toString();
        const currentDayElement = screen.getByText(currentDay);
        
        expect(currentDayElement).toHaveClass('bg-primary');
    });
}); 