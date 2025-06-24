import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface Staff {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  qualification?: string;
  staffId?: string;
  schoolId?: number;
  regionId?: number;
  active: boolean;
  isTeacher: boolean;
  lastLoginTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StaffResponse {
  status: string;
  message: string;
  data: Staff[];
  timestamp: string;
}

export interface SingleStaffResponse {
  status: string;
  message: string;
  data: Staff;
  timestamp: string;
}

export interface BooleanResponse {
  status: string;
  message: string;
  data: boolean;
  timestamp: string;
}

export const staffApi = {
  // Get all staff by school ID
  getStaffBySchoolId: async (schoolId: number): Promise<AxiosResponse<StaffResponse>> => {
    return api.get(`/api/staff/school/${schoolId}`);
  },

  // Get active staff by school ID
  getActiveStaffBySchoolId: async (schoolId: number): Promise<AxiosResponse<StaffResponse>> => {
    return api.get(`/api/staff/school/${schoolId}/active`);
  },

  // Get staff by role
  getStaffByRole: async (role: string): Promise<AxiosResponse<StaffResponse>> => {
    return api.get(`/api/staff/role/${role}`);
  },

  // Get staff by region ID
  getStaffByRegionId: async (regionId: number): Promise<AxiosResponse<StaffResponse>> => {
    return api.get(`/api/staff/region/${regionId}`);
  },

  // Toggle staff status
  toggleStaffStatus: async (staffId: number, active: boolean): Promise<AxiosResponse<SingleStaffResponse>> => {
    return api.put(`/api/staff/${staffId}/toggle-status?active=${active}`);
  },

  // Get staff by email
  getStaffByEmail: async (email: string): Promise<AxiosResponse<SingleStaffResponse>> => {
    return api.get(`/api/staff/email/${email}`);
  },

  // Check if email exists
  checkEmailExists: async (email: string): Promise<AxiosResponse<BooleanResponse>> => {
    return api.get(`/api/staff/check-email/${email}`);
  },

  // Check if username exists
  checkUsernameExists: async (username: string): Promise<AxiosResponse<BooleanResponse>> => {
    return api.get(`/api/staff/check-username/${username}`);
  }
}; 