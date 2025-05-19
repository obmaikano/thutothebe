import axios from 'axios';
import { config } from '../../config';
import { getToken, setToken, clearToken, isTokenValid } from '../../../features/auth/authUtils';

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
        this.token = getToken();
        
        // Set up axios interceptors
        this.setupInterceptors();
    }

    async login(loginRequest: LoginRequest): Promise<AuthResponse> {
        try {
            const response = await axios.post(`${API_URL}/login`, loginRequest);
            
            try {
                // Handle different API response structures
                let token, user;
                
                // Check for OhmaApiResponse format
                if (response.data && response.data.status === 'SUCCESS') {
                    if (response.data.data?.token && response.data.data?.user) {
                        // Data directly contains token and user
                        ({ token, user } = response.data.data);
                    } else if (typeof response.data.data === 'string') {
                        // Data might be just the token
                        token = response.data.data;
                        // In this case, we might need to fetch user info separately
                        // For now, create a minimal user object
                        user = { id: 0, email: loginRequest.email, role: 'USER' };
                    } else {
                        console.error('Unexpected API response format:', response.data);
                        throw new Error('Invalid response format');
                    }
                } else if (response.data?.token) {
                    // Direct response format
                    ({ token, user } = response.data);
                } else {
                    console.error('Unexpected API response format:', response.data);
                    throw new Error('Invalid response format');
                }
                
                // Validate token before storing
                if (token && typeof token === 'string') {
                    this.setToken(token);
                    return { token, user };
                } else {
                    throw new Error('Invalid token received from server');
                }
            } catch (parseError) {
                console.error('Error parsing login response:', parseError, response.data);
                throw new Error('Failed to process server response');
            }
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async register(registerRequest: RegisterRequest): Promise<AuthResponse> {
        try {
            const response = await axios.post<AuthResponse>(`${API_URL}/register`, registerRequest);
            
            // Validate token before storing
            const token = response.data.token;
            if (token && typeof token === 'string') {
                this.setToken(token);
                return response.data;
            } else {
                throw new Error('Invalid token received from server');
            }
        } catch (error) {
            throw this.handleError(error);
        }
    }

    logout(): void {
        this.token = null;
        clearToken();
    }

    getToken(): string | null {
        // First check the instance variable, then localStorage
        return this.token || getToken();
    }

    isAuthenticated(): boolean {
        const token = this.getToken();
        return isTokenValid(token);
    }

    private setToken(token: string): void {
        this.token = token;
        setToken(token);
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