import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface Region {
  id: number;
  code: string;
  name: string;
  description?: string;
  active: boolean;
  // Optional computed fields that may be added by frontend logic
  schoolCount?: number;
  activeSchoolCount?: number;
  studentCount?: number;
  teacherCount?: number;
  performance?: number;
  systemAdoption?: number;
  status?: string;
}

export interface RegionResponse {
  status: string;
  message: string;
  data: Region | Region[] | null;
  timestamp: string | null;
}

export type CreateRegionRequest = Omit<Region, 'id'>;
export type UpdateRegionRequest = Partial<Region>;

/**
 * API service for interacting with region endpoints
 */
const regionApi = {
  /**
   * Get all regions
   * @returns Response with a list of regions
   */
  getAll: async (): Promise<AxiosResponse<RegionResponse>> => {
    return api.get('/regions');
  },

  /**
   * Get region by ID
   * @param id Region ID
   * @returns Response with region details
   */
  getById: async (id: number): Promise<AxiosResponse<RegionResponse>> => {
    return api.get(`/regions/${id}`);
  },

  /**
   * Get region by code
   * @param code Region code
   * @returns Response with region details
   */
  getByCode: async (code: string): Promise<AxiosResponse<RegionResponse>> => {
    return api.get(`/regions/code/${code}`);
  },

  /**
   * Get all active regions
   * @returns Response with a list of active regions
   */
  getActiveRegions: async (): Promise<AxiosResponse<RegionResponse>> => {
    return api.get('/regions/active');
  },

  /**
   * Create a new region
   * @param regionData Region data
   * @returns Response with created region details
   */
  create: async (regionData: CreateRegionRequest): Promise<AxiosResponse<RegionResponse>> => {
    return api.post('/regions', regionData);
  },

  /**
   * Update an existing region
   * @param id Region ID
   * @param regionData Updated region data
   * @returns Response with updated region details
   */
  update: async (id: number, regionData: UpdateRegionRequest): Promise<AxiosResponse<RegionResponse>> => {
    return api.put(`/regions/${id}`, regionData);
  },

  /**
   * Delete a region
   * @param id Region ID
   * @returns Response indicating success/failure
   */
  delete: async (id: number): Promise<AxiosResponse<RegionResponse>> => {
    return api.delete(`/regions/${id}`);
  },

  /**
   * Activate a region
   * @param id Region ID
   * @returns Response indicating success/failure
   */
  activate: async (id: number): Promise<AxiosResponse<RegionResponse>> => {
    return api.post(`/regions/${id}/activate`);
  },

  /**
   * Deactivate a region
   * @param id Region ID
   * @returns Response indicating success/failure
   */
  deactivate: async (id: number): Promise<AxiosResponse<RegionResponse>> => {
    return api.post(`/regions/${id}/deactivate`);
  },
};

export default regionApi; 