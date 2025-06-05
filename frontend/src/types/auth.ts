/**
 * Authentication and user related type definitions
 */

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  MINISTRY_EXECUTIVE = 'MINISTRY_EXECUTIVE',
  MINISTRY_STAFF = 'MINISTRY_STAFF',
  DIRECTOR = 'DIRECTOR',
  REGIONAL_ADMIN = 'REGIONAL_ADMIN',
  REGIONAL_MANAGER = 'REGIONAL_MANAGER',
  REGIONAL_OFFICER = 'REGIONAL_OFFICER',
  SCHOOL_ADMIN = 'SCHOOL_ADMIN',
  SCHOOL_HEAD = 'SCHOOL_HEAD',
  DEPUTY_HEAD = 'DEPUTY_HEAD',
  DEPARTMENT_HEAD = 'DEPARTMENT_HEAD',
  HEAD_TEACHER = 'HEAD_TEACHER',
  SENIOR_TEACHER = 'SENIOR_TEACHER',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT'
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  schoolId?: number;
  regionId?: number;
  classId?: number;
  departmentId?: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  schoolId?: number;
  regionId?: number;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterRequest) => Promise<void>;
  clearError: () => void;
} 