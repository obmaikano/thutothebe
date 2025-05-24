import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface School {
  id: number;
  name: string;
  code: string;
  regionId: number;
  active: boolean;
}

export interface SchoolResponse {
  status: string;
  message: string;
  data: School | School[] | null;
  timestamp: string | null;
}

export type CreateSchoolRequest = Omit<School, 'id'>;
export type UpdateSchoolRequest = Partial<School>;

/**
 * API service for interacting with school endpoints
 */
const schoolApi = {
  /**
   * Get all schools
   * @returns Response with a list of schools
   */
  getAll: async (): Promise<AxiosResponse<SchoolResponse>> => {
    return api.get('/schools');
  },

  /**
   * Get school by ID
   * @param id School ID
   * @returns Response with school details
   */
  getById: async (id: number): Promise<AxiosResponse<SchoolResponse>> => {
    return api.get(`/schools/${id}`);
  },

  /**
   * Get schools by region
   * @param regionId Region ID
   * @returns Response with schools in the region
   */
  getByRegion: async (regionId: number): Promise<AxiosResponse<SchoolResponse>> => {
    return api.get(`/schools/region/${regionId}`);
  },

  /**
   * Get all active schools
   * @returns Response with a list of active schools
   */
  getActive: async (): Promise<AxiosResponse<SchoolResponse>> => {
    return api.get('/schools/active');
  },

  /**
   * Create a new school
   * @param schoolData School data
   * @returns Response with created school details
   */
  create: async (schoolData: CreateSchoolRequest): Promise<AxiosResponse<SchoolResponse>> => {
    return api.post('/schools', schoolData);
  },

  /**
   * Update an existing school
   * @param id School ID
   * @param schoolData Updated school data
   * @returns Response with updated school details
   */
  update: async (id: number, schoolData: UpdateSchoolRequest): Promise<AxiosResponse<SchoolResponse>> => {
    return api.put(`/schools/${id}`, schoolData);
  },

  /**
   * Delete a school
   * @param id School ID
   * @returns Response indicating success/failure
   */
  delete: async (id: number): Promise<AxiosResponse<SchoolResponse>> => {
    return api.delete(`/schools/${id}`);
  },

  /**
   * Activate a school
   * @param id School ID
   * @returns Response indicating success/failure
   */
  activate: async (id: number): Promise<AxiosResponse<SchoolResponse>> => {
    return api.post(`/schools/${id}/activate`);
  },

  /**
   * Deactivate a school
   * @param id School ID
   * @returns Response indicating success/failure
   */
  deactivate: async (id: number): Promise<AxiosResponse<SchoolResponse>> => {
    return api.post(`/schools/${id}/deactivate`);
  },
};

export default schoolApi; 