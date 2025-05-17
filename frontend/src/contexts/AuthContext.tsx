import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, AuthResponse } from '../app/services/api/auth';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setCredentials, logout } from '../features/auth/authSlice';
import { useAuthError } from '../features/auth/hooks';

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
    const { error, setAuthError, clearError } = useAuthError();
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user, token } = useAppSelector((state) => state.auth);

    // Check authentication status when component mounts
    useEffect(() => {
        const initAuth = async () => {
            await checkAuthStatus();
            setLoading(false);
        };
        
        initAuth();
    }, []);

    // Periodically check token validity (e.g., every 5 minutes)
    useEffect(() => {
        if (!token) return;
        
        const interval = setInterval(() => {
            checkAuthStatus().catch(() => handleLogout());
        }, 5 * 60 * 1000); // 5 minutes
        
        return () => clearInterval(interval);
    }, [token]);

    // Verify token and get user data
    const checkAuthStatus = async (): Promise<boolean> => {
        const storedToken = localStorage.getItem('token');
        
        if (!storedToken) {
            return false;
        }
        
        try {
            const response = await fetch('/api/auth/me', {
                headers: { Authorization: `Bearer ${storedToken}` },
            });
            
            if (response.ok) {
                const userData = await response.json();
                dispatch(setCredentials({ user: userData, token: storedToken }));
                return true;
            } else {
                handleLogout();
                return false;
            }
        } catch (error) {
            console.error('Error verifying token:', error);
            handleLogout();
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