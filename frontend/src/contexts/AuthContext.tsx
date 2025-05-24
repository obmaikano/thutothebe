import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, AuthResponse } from '../app/services/api/auth';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setCredentials, logout } from '../features/auth/authSlice';
import { getToken, isTokenValid } from '../features/auth/authUtils';

interface AuthContextType {
    user: any | null;
    error: {
        message: string;
        type: 'error' | 'warning' | 'info' | 'success';
    } | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<AuthResponse>;
    logout: () => void;
    clearError: () => void;
    checkAuthStatus: () => Promise<boolean>;
    setAuthError: (message: string, type?: 'error' | 'warning' | 'info' | 'success') => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook to use the auth context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user, token } = useAppSelector((state) => state.auth);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<AuthContextType['error']>(null);

    useEffect(() => {
        const initAuth = async () => {
            setLoading(true);
            await checkAuthStatus();
            setLoading(false);
        };

        initAuth();
    }, []);

    const clearError = () => {
        setError(null);
    };

    const setAuthError = (
        message: string,
        type: 'error' | 'warning' | 'info' | 'success' = 'error'
    ) => {
        setError({ message, type });
    };

    const checkAuthStatus = async (): Promise<boolean> => {
        const storedToken = getToken();
        
        if (!storedToken) {
            return false;
        }
        
        // Validate token locally first
        if (!isTokenValid(storedToken)) {
            dispatch(logout());
            return false;
        }
        
        try {
            // Verify with server
            const response = await fetch('/api/v1/auth/me', {
                headers: { Authorization: `Bearer ${storedToken}` },
            });
            
            if (response.ok) {
                try {
                    const responseText = await response.text();
                    
                    // Check if the response is empty
                    if (!responseText) {
                        console.error('Empty response from /api/auth/me');
                        dispatch(logout());
                        return false;
                    }
                    
                    try {
                        // Try to parse the response as JSON
                        const responseData = JSON.parse(responseText);
                        
                        // Check if response follows OhmaApiResponse structure
                        let userData;
                        if (responseData.status === 'SUCCESS' && responseData.data) {
                            userData = responseData.data;
                        } else {
                            userData = responseData;
                        }
                        
                        if (userData) {
                            dispatch(setCredentials({ user: userData, token: storedToken }));
                            return true;
                        } else {
                            console.error('Invalid user data format:', responseData);
                            dispatch(logout());
                            return false;
                        }
                    } catch (jsonError) {
                        console.error('Error parsing user data JSON:', jsonError);
                        console.log('Raw response:', responseText);
                        dispatch(logout());
                        return false;
                    }
                } catch (parseError) {
                    console.error('Error reading response text:', parseError);
                    dispatch(logout());
                    return false;
                }
            } else {
                console.error(`Error response from /api/auth/me: ${response.status} ${response.statusText}`);
                dispatch(logout());
                return false;
            }
        } catch (error) {
            console.error('Error verifying token:', error);
            dispatch(logout());
            return false;
        }
    };

    const handleLogin = async (email: string, password: string) => {
        try {
            setLoading(true);
            clearError();
            
            const result = await authService.login({ email, password });
            dispatch(setCredentials(result));
            
            return result;
        } catch (error) {
            setAuthError(
                error instanceof Error ? error.message : 'An error occurred during login',
                'error'
            );
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
        dispatch(logout());
        navigate('/login');
    };

    const value = {
        user,
        error,
        loading,
        isAuthenticated: !!token,
        login: handleLogin,
        logout: handleLogout,
        clearError,
        checkAuthStatus,
        setAuthError
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 