// src/utils/errorUtils.tsx
import { AxiosError } from 'axios';

/**
 * Extracts a meaningful error message from an API error
 * @param error The error object caught from API call
 * @returns A string containing the error message
 */
export const extractErrorMessage = (error: AxiosError): string => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const responseData = error.response.data as any;
    
    if (responseData && responseData.message) {
      return responseData.message;
    }
    
    if (responseData && typeof responseData === 'string') {
      return responseData;
    }
    
    return `Error: ${error.response.status} - ${error.response.statusText}`;
  } else if (error.request) {
    // The request was made but no response was received
    return 'No response received from server. Please check your connection.';
  } else {
    // Something happened in setting up the request that triggered an Error
    return error.message || 'An unknown error occurred';
  }
};