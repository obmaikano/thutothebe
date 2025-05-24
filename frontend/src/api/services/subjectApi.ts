import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface Subject {
  id: number;
  code: string;
  name: string;
  description?: string;
  active: boolean;
}

export interface SubjectResponse {
  status: string;
  message: string;
  data: Subject | Subject[] | null;
  timestamp: string | null;
}

export type CreateSubjectRequest = Omit<Subject, 'id'>;
export type UpdateSubjectRequest = Partial<Subject>;

/**
 * API service for interacting with subject endpoints
 */
const subjectApi = {
  /**
   * Get all subjects
   * @returns Response with a list of subjects
   */
  getAll: async (): Promise<AxiosResponse<SubjectResponse>> => {
    return api.get('/subjects');
  },

  /**
   * Get subject by ID
   * @param id Subject ID
   * @returns Response with subject details
   */
  getById: async (id: number): Promise<AxiosResponse<SubjectResponse>> => {
    return api.get(`/subjects/${id}`);
  },

  /**
   * Get subject by code
   * @param code Subject code
   * @returns Response with subject details
   */
  getByCode: async (code: string): Promise<AxiosResponse<SubjectResponse>> => {
    return api.get(`/subjects/code/${code}`);
  },

  /**
   * Get all active subjects
   * @returns Response with a list of active subjects
   */
  getActiveSubjects: async (): Promise<AxiosResponse<SubjectResponse>> => {
    return api.get('/subjects/active');
  },

  /**
   * Create a new subject
   * @param subjectData Subject data
   * @returns Response with created subject details
   */
  create: async (subjectData: CreateSubjectRequest): Promise<AxiosResponse<SubjectResponse>> => {
    return api.post('/subjects', subjectData);
  },

  /**
   * Update an existing subject
   * @param id Subject ID
   * @param subjectData Updated subject data
   * @returns Response with updated subject details
   */
  update: async (id: number, subjectData: UpdateSubjectRequest): Promise<AxiosResponse<SubjectResponse>> => {
    return api.put(`/subjects/${id}`, subjectData);
  },

  /**
   * Delete a subject
   * @param id Subject ID
   * @returns Response indicating success/failure
   */
  delete: async (id: number): Promise<AxiosResponse<SubjectResponse>> => {
    return api.delete(`/subjects/${id}`);
  },

  /**
   * Activate a subject
   * @param id Subject ID
   * @returns Response indicating success/failure
   */
  activate: async (id: number): Promise<AxiosResponse<SubjectResponse>> => {
    return api.post(`/subjects/${id}/activate`);
  },

  /**
   * Deactivate a subject
   * @param id Subject ID
   * @returns Response indicating success/failure
   */
  deactivate: async (id: number): Promise<AxiosResponse<SubjectResponse>> => {
    return api.post(`/subjects/${id}/deactivate`);
  }
};

export default subjectApi; 