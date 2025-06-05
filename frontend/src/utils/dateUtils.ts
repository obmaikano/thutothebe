/**
 * Utility functions for date and time formatting
 */

/**
 * Format time string to display format
 * @param time Time string in HH:mm format
 * @returns Formatted time string
 */
export const formatTime = (time: string): string => {
  if (!time) return '';
  
  try {
    // Handle both HH:mm and HH:mm:ss formats
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const minute = parseInt(minutes, 10);
    
    // Convert to 12-hour format
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  } catch (error) {
    return time; // Return original if parsing fails
  }
};

/**
 * Format date string to display format
 * @param date Date string or Date object
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date): string => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return typeof date === 'string' ? date : '';
  }
};

/**
 * Format date and time together
 * @param date Date string or Date object
 * @param time Time string
 * @returns Formatted date and time string
 */
export const formatDateTime = (date: string | Date, time?: string): string => {
  const formattedDate = formatDate(date);
  if (time) {
    const formattedTime = formatTime(time);
    return `${formattedDate} at ${formattedTime}`;
  }
  return formattedDate;
};

/**
 * Get current date in YYYY-MM-DD format
 * @returns Current date string
 */
export const getCurrentDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Get current time in HH:mm format
 * @returns Current time string
 */
export const getCurrentTime = (): string => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
};

/**
 * Check if a date is today
 * @param date Date string or Date object
 * @returns True if date is today
 */
export const isToday = (date: string | Date): boolean => {
  const today = new Date();
  const checkDate = typeof date === 'string' ? new Date(date) : date;
  
  return today.toDateString() === checkDate.toDateString();
};

/**
 * Get day of week from date
 * @param date Date string or Date object
 * @returns Day of week (MONDAY, TUESDAY, etc.)
 */
export const getDayOfWeek = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  return days[dateObj.getDay()];
}; 