import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  active: boolean;
}

export interface UserResponse {
  status: string;
  message: string;
  data: User | User[] | null;
  timestamp: string | null;
}

export type CreateUserRequest = Omit<User, 'id'>;
export type UpdateUserRequest = Partial<User>;

/**
 * API service for interacting with user endpoints
 */
const userApi = {
  /**
   * Get all users
   * @returns Response with a list of users
   */
  getAll: async (): Promise<AxiosResponse<UserResponse>> => {
    return api.get('/users');
  },

  /**
   * Get user by ID
   * @param id User ID
   * @returns Response with user details
   */
  getById: async (id: number): Promise<AxiosResponse<UserResponse>> => {
    return api.get(`/users/${id}`);
  },

  /**
   * Get user by email
   * @param email User email
   * @returns Response with user details
   */
  getByEmail: async (email: string): Promise<AxiosResponse<UserResponse>> => {
    return api.get(`/users/email/${email}`);
  },

  /**
   * Get all teachers
   * @returns Response with a list of teachers
   */
  getAllTeachers: async (): Promise<AxiosResponse<UserResponse>> => {
    return api.get('/users/teachers');
  },

  /**
   * Get all students
   * @returns Response with a list of students
   */
  getAllStudents: async (): Promise<AxiosResponse<UserResponse>> => {
    return api.get('/users/students');
  },

  /**
   * Create a new user
   * @param userData User data
   * @returns Response with created user details
   */
  create: async (userData: CreateUserRequest): Promise<AxiosResponse<UserResponse>> => {
    return api.post('/users', userData);
  },

  /**
   * Update an existing user
   * @param id User ID
   * @param userData Updated user data
   * @returns Response with updated user details
   */
  update: async (id: number, userData: UpdateUserRequest): Promise<AxiosResponse<UserResponse>> => {
    return api.put(`/users/${id}`, userData);
  },

  /**
   * Delete a user
   * @param id User ID
   * @returns Response indicating success/failure
   */
  delete: async (id: number): Promise<AxiosResponse<UserResponse>> => {
    return api.delete(`/users/${id}`);
  },
};

export default userApi; 