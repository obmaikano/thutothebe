import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/auth';

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
        this.token = localStorage.getItem('token');
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
        return this.token;
    }

    isAuthenticated(): boolean {
        return !!this.token;
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
}

// Create axios interceptor to add token to all requests
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Create axios interceptor to handle token expiration
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authService = new AuthService(); 