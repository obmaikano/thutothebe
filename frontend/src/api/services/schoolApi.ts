import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface School {
  id: number;
  name: string;
  code: string;
  address: string;
  phone?: string;
  email?: string;
  description?: string;
  website?: string;
  regionId: number;
  principalId?: number;
  establishedDate?: string;
  schoolType: 'PRIMARY' | 'SECONDARY' | 'COMBINED' | 'SPECIAL' | 'TECHNICAL' | 'VOCATIONAL';
  ownership: 'PUBLIC' | 'PRIVATE' | 'COMMUNITY' | 'RELIGIOUS';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'CLOSED';
  capacity: number;
  currentEnrollment: number;
  teacherCount: number;
  classroomCount: number;
  facilities: string[];
  accreditation: {
    isAccredited: boolean;
    accreditationBody?: string;
    accreditationDate?: string;
    expiryDate?: string;
  };
  performance: {
    overallRating: number;
    academicRating: number;
    infrastructureRating: number;
    teacherQualityRating: number;
  };
  coordinates: {
    latitude?: number;
    longitude?: number;
  };
  active: boolean;
  createdAt: string;
  updatedAt: string;
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
   * Get school by code
   * @param code School code
   * @returns Response with school details
   */
  getByCode: async (code: string): Promise<AxiosResponse<SchoolResponse>> => {
    return api.get(`/schools/code/${code}`);
  },

  /**
   * Get schools by region ID
   * @param regionId Region ID
   * @returns Response with a list of schools in the region
   */
  getByRegionId: async (regionId: number): Promise<AxiosResponse<SchoolResponse>> => {
    return api.get(`/schools/region/${regionId}`);
  },

  /**
   * Get active schools by region ID
   * @param regionId Region ID
   * @returns Response with a list of active schools in the region
   */
  getActiveByRegionId: async (regionId: number): Promise<AxiosResponse<SchoolResponse>> => {
    return api.get(`/schools/region/${regionId}/active`);
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
  }
};

export default schoolApi; 