import { useState, useCallback } from 'react';

interface AuthError {
    message: string;
    type: 'error' | 'warning' | 'info' | 'success';
}

export const useAuthError = () => {
    const [error, setError] = useState<AuthError | null>(null);

    const setAuthError = useCallback((message: string, type: AuthError['type'] = 'error') => {
        setError({ message, type });
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        error,
        setAuthError,
        clearError,
    };
}; 