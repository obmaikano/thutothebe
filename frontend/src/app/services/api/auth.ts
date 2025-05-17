import axios from 'axios';
import { config } from '../../config';

const API_URL = `${config.api.baseUrl}/auth`;

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
    };
}

class AuthService {
    private token: string | null = null;

    constructor() {
        // Initialize token from localStorage on service creation
        this.token = localStorage.getItem('token');
        
        // Set up axios interceptors
        this.setupInterceptors();
    }

    async login(loginRequest: LoginRequest): Promise<AuthResponse> {
        try {
            const response = await axios.post(`${API_URL}/login`, loginRequest);
            // The backend wraps the actual data in response.data.data
            const { token, user } = response.data.data;
            this.setToken(token);
            return { token, user };
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async register(registerRequest: RegisterRequest): Promise<AuthResponse> {
        try {
            const response = await axios.post<AuthResponse>(`${API_URL}/register`, registerRequest);
            this.setToken(response.data.token);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    logout(): void {
        this.token = null;
        localStorage.removeItem('token');
    }

    getToken(): string | null {
        return this.token || localStorage.getItem('token');
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    private setToken(token: string): void {
        this.token = token;
        localStorage.setItem('token', token);
    }

    private handleError(error: any): Error {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || 'An error occurred';
            return new Error(message);
        }
        return new Error('An unexpected error occurred');
    }
    
    private setupInterceptors(): void {
        // Interceptor to add token to all requests
        axios.interceptors.request.use(
            (config) => {
                const token = this.getToken();
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Interceptor to handle token expiration
        axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    this.logout();
                    // Only redirect if we're not already on the login page
                    if (!window.location.pathname.includes('/login')) {
                        window.location.href = '/login';
                    }
                }
                return Promise.reject(error);
            }
        );
    }
}

export const authService = new AuthService(); 