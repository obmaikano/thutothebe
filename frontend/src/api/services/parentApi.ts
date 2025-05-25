import { api } from '../index';
import { AxiosResponse } from 'axios';
import { User, UserResponse } from './userApi';

export interface Parent extends User {
  role: 'PARENT';
}

export interface ParentResponse {
  status: string;
  message: string;
  data: Parent | Parent[] | null;
  timestamp: string | null;
}

export type CreateParentRequest = Omit<Parent, 'id' | 'createdAt' | 'updatedAt' | 'lastLoginTime'> & {
  password: string;
};
export type UpdateParentRequest = Partial<Omit<Parent, 'id' | 'createdAt' | 'updatedAt' | 'lastLoginTime'>>;

/**
 * API service for interacting with parent endpoints
 */
const parentApi = {
  /**
   * Get all parents
   * @returns Response with a list of parents
   */
  getAll: async (): Promise<AxiosResponse<ParentResponse>> => {
    return api.get('/parents/all');
  },

  /**
   * Get parent by ID
   * @param id Parent ID
   * @returns Response with parent details
   */
  getById: async (id: number): Promise<AxiosResponse<ParentResponse>> => {
    return api.get(`/parents/${id}`);
  },

  /**
   * Get children linked to a parent
   * @param parentId Parent ID
   * @returns Response with children list
   */
  getChildrenByParentId: async (parentId: number): Promise<AxiosResponse<UserResponse>> => {
    return api.get(`/parents/children/${parentId}`);
  },

  /**
   * Link a child to a parent
   * @param parentId Parent ID
   * @param childId Child ID
   * @returns Response indicating success/failure
   */
  linkChildToParent: async (parentId: number, childId: number): Promise<AxiosResponse<ParentResponse>> => {
    return api.post(`/parents/${parentId}/link-child/${childId}`);
  },

  /**
   * Unlink a child from a parent
   * @param parentId Parent ID
   * @param childId Child ID
   * @returns Response indicating success/failure
   */
  unlinkChildFromParent: async (parentId: number, childId: number): Promise<AxiosResponse<ParentResponse>> => {
    return api.post(`/parents/${parentId}/unlink-child/${childId}`);
  },

  /**
   * Get parents by school ID
   * @param schoolId School ID
   * @returns Response with parents list
   */
  getParentsBySchoolId: async (schoolId: number): Promise<AxiosResponse<ParentResponse>> => {
    return api.get(`/parents/school/${schoolId}`);
  },

  /**
   * Get all active parents
   * @returns Response with active parents list
   */
  getActiveParents: async (): Promise<AxiosResponse<ParentResponse>> => {
    return api.get('/parents/active');
  },

  /**
   * Create a new parent
   * @param parentData Parent data
   * @returns Response with created parent details
   */
  create: async (parentData: CreateParentRequest): Promise<AxiosResponse<ParentResponse>> => {
    return api.post('/parents', parentData);
  },

  /**
   * Update an existing parent
   * @param id Parent ID
   * @param parentData Updated parent data
   * @returns Response with updated parent details
   */
  update: async (id: number, parentData: UpdateParentRequest): Promise<AxiosResponse<ParentResponse>> => {
    return api.put(`/parents/${id}`, parentData);
  },

  /**
   * Update parent profile without changing role and password
   * @param id Parent ID
   * @param parentData Updated parent data
   * @returns Response with updated parent details
   */
  updateProfile: async (id: number, parentData: UpdateParentRequest): Promise<AxiosResponse<ParentResponse>> => {
    return api.put(`/parents/${id}/update-profile`, parentData);
  },

  /**
   * Delete a parent
   * @param id Parent ID
   * @returns Response indicating success/failure
   */
  delete: async (id: number): Promise<AxiosResponse<ParentResponse>> => {
    return api.delete(`/parents/${id}`);
  },

  /**
   * Activate a parent account
   * @param id Parent ID
   * @returns Response indicating success/failure
   */
  activate: async (id: number): Promise<AxiosResponse<ParentResponse>> => {
    return api.post(`/parents/${id}/activate`);
  },

  /**
   * Deactivate a parent account
   * @param id Parent ID
   * @returns Response indicating success/failure
   */
  deactivate: async (id: number): Promise<AxiosResponse<ParentResponse>> => {
    return api.post(`/parents/${id}/deactivate`);
  },
};

export default parentApi; 