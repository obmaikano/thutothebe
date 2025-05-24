import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface Teacher {
  id: number;
  staffId: string;
  firstName: string;
  lastName: string;
  email: string;
  qualification: string;
  schoolId: number;
  active: boolean;
}

export interface TeacherResponse {
  status: string;
  message: string;
  data: Teacher | Teacher[] | null;
  timestamp: string | null;
}

export type CreateTeacherRequest = Omit<Teacher, 'id'>;
export type UpdateTeacherRequest = Partial<Teacher>;

/**
 * API service for interacting with teacher endpoints
 */
const teacherApi = {
  /**
   * Get all teachers
   * @returns Response with a list of teachers
   */
  getAll: async (): Promise<AxiosResponse<TeacherResponse>> => {
    return api.get('/teachers');
  },

  /**
   * Get teacher by ID
   * @param id Teacher ID
   * @returns Response with teacher details
   */
  getById: async (id: number): Promise<AxiosResponse<TeacherResponse>> => {
    return api.get(`/teachers/${id}`);
  },

  /**
   * Get teachers by school
   * @param schoolId School ID
   * @returns Response with teachers in the school
   */
  getBySchool: async (schoolId: number): Promise<AxiosResponse<TeacherResponse>> => {
    return api.get(`/teachers/school/${schoolId}`);
  },

  /**
   * Get all active teachers
   * @returns Response with a list of active teachers
   */
  getActive: async (): Promise<AxiosResponse<TeacherResponse>> => {
    return api.get('/teachers/active');
  },

  /**
   * Create a new teacher
   * @param teacherData Teacher data
   * @returns Response with created teacher details
   */
  create: async (teacherData: CreateTeacherRequest): Promise<AxiosResponse<TeacherResponse>> => {
    return api.post('/teachers', teacherData);
  },

  /**
   * Update an existing teacher
   * @param id Teacher ID
   * @param teacherData Updated teacher data
   * @returns Response with updated teacher details
   */
  update: async (id: number, teacherData: UpdateTeacherRequest): Promise<AxiosResponse<TeacherResponse>> => {
    return api.put(`/teachers/${id}`, teacherData);
  },

  /**
   * Delete a teacher
   * @param id Teacher ID
   * @returns Response indicating success/failure
   */
  delete: async (id: number): Promise<AxiosResponse<TeacherResponse>> => {
    return api.delete(`/teachers/${id}`);
  },

  /**
   * Activate a teacher
   * @param id Teacher ID
   * @returns Response indicating success/failure
   */
  activate: async (id: number): Promise<AxiosResponse<TeacherResponse>> => {
    return api.post(`/teachers/${id}/activate`);
  },

  /**
   * Deactivate a teacher
   * @param id Teacher ID
   * @returns Response indicating success/failure
   */
  deactivate: async (id: number): Promise<AxiosResponse<TeacherResponse>> => {
    return api.post(`/teachers/${id}/deactivate`);
  },
};

export default teacherApi; 