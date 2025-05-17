import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth as useAuthContext } from '../../contexts/AuthContext';

// Return the existing auth hook from context for consistency with existing code
export function useAuth() {
  return useAuthContext();
}

/**
 * Hook to ensure the user is authenticated for certain pages
 * This is a utility hook that can be used at the component level to enforce authentication
 */
export function useRequireAuth(redirectTo = '/login') {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate(redirectTo);
    }
  }, [isAuthenticated, loading, navigate, redirectTo]);

  return { isAuthenticated, loading };
}

/**
 * Hook to require specific user roles
 */
export function useRequireRole(requiredRoles: string[], redirectTo = '/app/dashboard') {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // First ensure user is authenticated
    if (!isAuthenticated && !loading) {
      navigate('/login');
      return;
    }

    // Then check for the specific role
    if (isAuthenticated && !loading && user) {
      const hasRequiredRole = user.role && requiredRoles.includes(user.role);
      if (!hasRequiredRole) {
        navigate(redirectTo);
      }
    }
  }, [user, isAuthenticated, loading, navigate, redirectTo, requiredRoles]);

  return { user, isAuthenticated, loading };
}

/**
 * Hook for managing authentication errors
 * Provides a consistent way to handle and display error messages related to authentication
 */
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