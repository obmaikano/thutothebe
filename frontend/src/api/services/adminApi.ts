import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface Admin {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  active: boolean;
}

export interface AdminResponse {
  status: string;
  message: string;
  data: Admin | Admin[] | null;
  timestamp: string | null;
}

export type CreateAdminRequest = Omit<Admin, 'id'>;
export type UpdateAdminRequest = Partial<Admin>;

/**
 * API service for interacting with admin endpoints
 */
const adminApi = {
  /**
   * Get all admins
   * @returns Response with a list of admins
   */
  getAll: async (): Promise<AxiosResponse<AdminResponse>> => {
    return api.get('/admins');
  },

  /**
   * Get admin by ID
   * @param id Admin ID
   * @returns Response with admin details
   */
  getById: async (id: number): Promise<AxiosResponse<AdminResponse>> => {
    return api.get(`/admins/${id}`);
  },

  /**
   * Create a new admin
   * @param adminData Admin data
   * @returns Response with created admin details
   */
  create: async (adminData: CreateAdminRequest): Promise<AxiosResponse<AdminResponse>> => {
    return api.post('/admins', adminData);
  },

  /**
   * Update an existing admin
   * @param id Admin ID
   * @param adminData Updated admin data
   * @returns Response with updated admin details
   */
  update: async (id: number, adminData: UpdateAdminRequest): Promise<AxiosResponse<AdminResponse>> => {
    return api.put(`/admins/${id}`, adminData);
  },

  /**
   * Delete an admin
   * @param id Admin ID
   * @returns Response indicating success/failure
   */
  delete: async (id: number): Promise<AxiosResponse<AdminResponse>> => {
    return api.delete(`/admins/${id}`);
  },
};

export default adminApi; 