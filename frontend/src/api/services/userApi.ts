import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  schoolId?: number;
  surname: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  nationality: string;
  dateOfBirth: string;
  identityNumber?: string;
  birthCertificateNumber?: string;
  qualification?: string;
  parentId?: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
  lastLoginTime?: string;
}

export interface UserResponse {
  status: string;
  message: string;
  data: User | User[] | null;
  timestamp: string | null;
}

export type CreateUserRequest = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastLoginTime'> & {
  password: string;
};
export type UpdateUserRequest = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastLoginTime'>>;

// User roles enum to match backend
export const USER_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  MINISTRY_EXECUTIVE: 'MINISTRY_EXECUTIVE',
  MINISTRY_STAFF: 'MINISTRY_STAFF',
  DIRECTOR: 'DIRECTOR',
  REGIONAL_ADMIN: 'REGIONAL_ADMIN',
  REGIONAL_OFFICER: 'REGIONAL_OFFICER',
  SCHOOL_ADMIN: 'SCHOOL_ADMIN',
  SCHOOL_HEAD: 'SCHOOL_HEAD',
  DEPARTMENT_HEAD: 'DEPARTMENT_HEAD',
  SENIOR_TEACHER: 'SENIOR_TEACHER',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT',
  PARENT: 'PARENT'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Gender options
export const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' }
];

// User role options for dropdowns
export const USER_ROLE_OPTIONS = [
  { value: USER_ROLES.SUPER_ADMIN, label: 'Super Admin' },
  { value: USER_ROLES.MINISTRY_EXECUTIVE, label: 'Ministry Executive' },
  { value: USER_ROLES.MINISTRY_STAFF, label: 'Ministry Staff' },
  { value: USER_ROLES.DIRECTOR, label: 'Director' },
  { value: USER_ROLES.REGIONAL_ADMIN, label: 'Regional Admin' },
  { value: USER_ROLES.REGIONAL_OFFICER, label: 'Regional Officer' },
  { value: USER_ROLES.SCHOOL_ADMIN, label: 'School Admin' },
  { value: USER_ROLES.SCHOOL_HEAD, label: 'School Head' },
  { value: USER_ROLES.DEPARTMENT_HEAD, label: 'Department Head' },
  { value: USER_ROLES.SENIOR_TEACHER, label: 'Senior Teacher' },
  { value: USER_ROLES.TEACHER, label: 'Teacher' },
  { value: USER_ROLES.STUDENT, label: 'Student' },
  { value: USER_ROLES.PARENT, label: 'Parent' }
];

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
   * Get users by school ID
   * @param schoolId School ID
   * @returns Response with a list of users in the school
   */
  getBySchoolId: async (schoolId: number): Promise<AxiosResponse<UserResponse>> => {
    return api.get(`/users/school/${schoolId}`);
  },

  /**
   * Get students by school ID
   * @param schoolId School ID
   * @returns Response with a list of students in the school
   */
  getStudentsBySchoolId: async (schoolId: number): Promise<AxiosResponse<UserResponse>> => {
    return api.get(`/users/school/${schoolId}/students`);
  },

  /**
   * Get teachers by school ID
   * @param schoolId School ID
   * @returns Response with a list of teachers in the school
   */
  getTeachersBySchoolId: async (schoolId: number): Promise<AxiosResponse<UserResponse>> => {
    return api.get(`/users/school/${schoolId}/teachers`);
  },

  /**
   * Get staff by school ID (includes all non-student roles)
   * @param schoolId School ID
   * @returns Response with a list of staff in the school
   */
  getStaffBySchoolId: async (schoolId: number): Promise<AxiosResponse<UserResponse>> => {
    return api.get(`/users/school/${schoolId}/staff`);
  },

  /**
   * Get users by role
   * @param role User role
   * @returns Response with a list of users with the specified role
   */
  getByRole: async (role: string): Promise<AxiosResponse<UserResponse>> => {
    return api.get(`/users/role/${role}`);
  },

  /**
   * Get active users by school ID
   * @param schoolId School ID
   * @returns Response with a list of active users in the school
   */
  getActiveBySchoolId: async (schoolId: number): Promise<AxiosResponse<UserResponse>> => {
    return api.get(`/users/school/${schoolId}/active`);
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