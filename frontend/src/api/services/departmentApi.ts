import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface Department {
  id: number;
  name: string;
  description?: string;
  schoolId: number;
  schoolName: string;
  departmentHeadId?: number;
  departmentHeadName?: string;
  subjectIds: number[];
  subjectNames: string[];
  teacherIds: number[];
  teacherNames: string[];
  active: boolean;
  createdAt: string;
  modifiedAt: string;
}

export interface DepartmentResponse {
  status: string;
  message: string;
  data: Department | Department[] | null;
  timestamp: string | null;
}

export type CreateDepartmentRequest = Omit<Department, 'id' | 'schoolName' | 'departmentHeadName' | 'subjectNames' | 'teacherNames' | 'createdAt' | 'modifiedAt'>;
export type UpdateDepartmentRequest = Partial<CreateDepartmentRequest>;

/**
 * API service for interacting with department endpoints
 */
const departmentApi = {
  /**
   * Get all departments
   * @returns Response with a list of departments
   */
  getAll: async (): Promise<AxiosResponse<DepartmentResponse>> => {
    return api.get('/departments');
  },

  /**
   * Get department by ID
   * @param id Department ID
   * @returns Response with department details
   */
  getById: async (id: number): Promise<AxiosResponse<DepartmentResponse>> => {
    return api.get(`/departments/${id}`);
  },

  /**
   * Get departments by school ID
   * @param schoolId School ID
   * @returns Response with departments for the school
   */
  getBySchool: async (schoolId: number): Promise<AxiosResponse<DepartmentResponse>> => {
    return api.get(`/departments/school/${schoolId}`);
  },

  /**
   * Get active departments by school ID
   * @param schoolId School ID
   * @returns Response with active departments for the school
   */
  getActiveBySchool: async (schoolId: number): Promise<AxiosResponse<DepartmentResponse>> => {
    return api.get(`/departments/school/${schoolId}/active`);
  },

  /**
   * Get all active departments
   * @returns Response with a list of active departments
   */
  getActive: async (): Promise<AxiosResponse<DepartmentResponse>> => {
    return api.get('/departments/active');
  },

  /**
   * Get department by name and school ID
   * @param name Department name
   * @param schoolId School ID
   * @returns Response with department details
   */
  getByNameAndSchool: async (name: string, schoolId: number): Promise<AxiosResponse<DepartmentResponse>> => {
    return api.get(`/departments/search?name=${name}&schoolId=${schoolId}`);
  },

  /**
   * Get department by department head ID
   * @param departmentHeadId Department head ID
   * @returns Response with department details
   */
  getByDepartmentHead: async (departmentHeadId: number): Promise<AxiosResponse<DepartmentResponse>> => {
    return api.get(`/departments/head/${departmentHeadId}`);
  },

  /**
   * Get departments by teacher ID
   * @param teacherId Teacher ID
   * @returns Response with departments for the teacher
   */
  getByTeacher: async (teacherId: number): Promise<AxiosResponse<DepartmentResponse>> => {
    return api.get(`/departments/teacher/${teacherId}`);
  },

  /**
   * Get department by subject ID
   * @param subjectId Subject ID
   * @returns Response with department details
   */
  getBySubject: async (subjectId: number): Promise<AxiosResponse<DepartmentResponse>> => {
    return api.get(`/departments/subject/${subjectId}`);
  },

  /**
   * Get departments without head for a school
   * @param schoolId School ID
   * @returns Response with departments without head
   */
  getDepartmentsWithoutHead: async (schoolId: number): Promise<AxiosResponse<DepartmentResponse>> => {
    return api.get(`/departments/school/${schoolId}/without-head`);
  },

  /**
   * Get departments with subjects for a school
   * @param schoolId School ID
   * @returns Response with departments that have subjects
   */
  getDepartmentsWithSubjects: async (schoolId: number): Promise<AxiosResponse<DepartmentResponse>> => {
    return api.get(`/departments/school/${schoolId}/with-subjects`);
  },

  /**
   * Count active departments by school ID
   * @param schoolId School ID
   * @returns Response with count of active departments
   */
  countActiveBySchool: async (schoolId: number): Promise<AxiosResponse<{ data: number }>> => {
    return api.get(`/departments/school/${schoolId}/count`);
  },

  /**
   * Check if department exists by name and school ID
   * @param name Department name
   * @param schoolId School ID
   * @returns Response with boolean indicating existence
   */
  existsByNameAndSchool: async (name: string, schoolId: number): Promise<AxiosResponse<{ data: boolean }>> => {
    return api.get(`/departments/exists?name=${name}&schoolId=${schoolId}`);
  },

  /**
   * Create a new department
   * @param departmentData Department data
   * @returns Response with created department details
   */
  create: async (departmentData: CreateDepartmentRequest): Promise<AxiosResponse<DepartmentResponse>> => {
    return api.post('/departments', departmentData);
  },

  /**
   * Update an existing department
   * @param id Department ID
   * @param departmentData Updated department data
   * @returns Response with updated department details
   */
  update: async (id: number, departmentData: UpdateDepartmentRequest): Promise<AxiosResponse<DepartmentResponse>> => {
    return api.put(`/departments/${id}`, departmentData);
  },

  /**
   * Delete a department
   * @param id Department ID
   * @returns Response indicating success/failure
   */
  delete: async (id: number): Promise<AxiosResponse<DepartmentResponse>> => {
    return api.delete(`/departments/${id}`);
  },

  /**
   * Activate a department
   * @param id Department ID
   * @returns Response indicating success/failure
   */
  activate: async (id: number): Promise<AxiosResponse<void>> => {
    return api.put(`/departments/${id}/activate`);
  },

  /**
   * Deactivate a department
   * @param id Department ID
   * @returns Response indicating success/failure
   */
  deactivate: async (id: number): Promise<AxiosResponse<void>> => {
    return api.put(`/departments/${id}/deactivate`);
  },

  /**
   * Assign department head
   * @param departmentId Department ID
   * @param userId User ID
   * @returns Response with updated department details
   */
  assignDepartmentHead: async (departmentId: number, userId: number): Promise<AxiosResponse<DepartmentResponse>> => {
    return api.post(`/departments/${departmentId}/head/${userId}`);
  },

  /**
   * Remove department head
   * @param departmentId Department ID
   * @returns Response with updated department details
   */
  removeDepartmentHead: async (departmentId: number): Promise<AxiosResponse<DepartmentResponse>> => {
    return api.delete(`/departments/${departmentId}/head`);
  },

  /**
   * Assign teacher to department
   * @param departmentId Department ID
   * @param teacherId Teacher ID
   * @returns Response with updated department details
   */
  assignTeacher: async (departmentId: number, teacherId: number): Promise<AxiosResponse<DepartmentResponse>> => {
    return api.post(`/departments/${departmentId}/teachers/${teacherId}`);
  },

  /**
   * Remove teacher from department
   * @param departmentId Department ID
   * @param teacherId Teacher ID
   * @returns Response with updated department details
   */
  removeTeacher: async (departmentId: number, teacherId: number): Promise<AxiosResponse<DepartmentResponse>> => {
    return api.delete(`/departments/${departmentId}/teachers/${teacherId}`);
  },

  /**
   * Assign subject to department
   * @param departmentId Department ID
   * @param subjectId Subject ID
   * @returns Response with updated department details
   */
  assignSubject: async (departmentId: number, subjectId: number): Promise<AxiosResponse<DepartmentResponse>> => {
    return api.post(`/departments/${departmentId}/subjects/${subjectId}`);
  },

  /**
   * Remove subject from department
   * @param departmentId Department ID
   * @param subjectId Subject ID
   * @returns Response with updated department details
   */
  removeSubject: async (departmentId: number, subjectId: number): Promise<AxiosResponse<DepartmentResponse>> => {
    return api.delete(`/departments/${departmentId}/subjects/${subjectId}`);
  },
};

export default departmentApi; 