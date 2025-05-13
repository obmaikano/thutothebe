import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useAuthError } from '../hooks/useAuthError';
import { authService } from '../services/authService';

interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    error: { message: string; type: 'error' | 'warning' | 'info' | 'success' } | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const { error, setAuthError, clearError } = useAuthError();

    const login = useCallback(async (email: string, password: string) => {
        try {
            // The backend returns OhmaApiResponse<AuthResponse>
            const response = await authService.login({ email, password });
            const { id, email: userEmail, firstName, lastName, role } = response.user;
            setUser({ id, email: userEmail, firstName, lastName, role });
            clearError();
        } catch (error) {
            setAuthError(error instanceof Error ? error.message : 'Authentication failed');
        }
    }, [setAuthError, clearError]);

    const logout = useCallback(() => {
        setUser(null);
        authService.logout();
        clearError();
    }, [clearError]);

    const value = {
        user,
        isAuthenticated: !!user,
        error,
        login,
        logout,
        clearError,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 