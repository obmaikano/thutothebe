import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface Assignment {
  id: number;
  title: string;
  description: string;
  courseId: number;
  instructorId: number;
  dueDate: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED';
}

export interface AssignmentResponse {
  status: string;
  message: string;
  data: Assignment | Assignment[] | null;
  timestamp: string | null;
}

export type CreateAssignmentRequest = Omit<Assignment, 'id'>;
export type UpdateAssignmentRequest = Partial<Assignment>;

/**
 * API service for interacting with assignment endpoints
 */
const assignmentApi = {
  /**
   * Get all assignments
   * @returns Response with a list of assignments
   */
  getAll: async (): Promise<AxiosResponse<AssignmentResponse>> => {
    return api.get('/assignments');
  },

  /**
   * Get assignment by ID
   * @param id Assignment ID
   * @returns Response with assignment details
   */
  getById: async (id: number): Promise<AxiosResponse<AssignmentResponse>> => {
    return api.get(`/assignments/${id}`);
  },

  /**
   * Get assignment by code
   * @param code Assignment code
   * @returns Response with assignment details
   */
  getByCode: async (code: string): Promise<AxiosResponse<AssignmentResponse>> => {
    return api.get(`/assignments/code/${code}`);
  },

  /**
   * Get assignments by course
   * @param courseId Course ID
   * @returns Response with assignments for the course
   */
  getByCourse: async (courseId: number): Promise<AxiosResponse<AssignmentResponse>> => {
    return api.get(`/assignments/course/${courseId}`);
  },

  /**
   * Get all active assignments
   * @returns Response with a list of active assignments
   */
  getActive: async (): Promise<AxiosResponse<AssignmentResponse>> => {
    return api.get('/assignments/active');
  },

  /**
   * Get active assignments by course
   * @param courseId Course ID
   * @returns Response with active assignments for the course
   */
  getActiveByCourse: async (courseId: number): Promise<AxiosResponse<AssignmentResponse>> => {
    return api.get(`/assignments/course/${courseId}/active`);
  },

  /**
   * Create a new assignment
   * @param assignmentData Assignment data
   * @returns Response with created assignment details
   */
  create: async (assignmentData: CreateAssignmentRequest): Promise<AxiosResponse<AssignmentResponse>> => {
    return api.post('/assignments', assignmentData);
  },

  /**
   * Update an existing assignment
   * @param id Assignment ID
   * @param assignmentData Updated assignment data
   * @returns Response with updated assignment details
   */
  update: async (id: number, assignmentData: UpdateAssignmentRequest): Promise<AxiosResponse<AssignmentResponse>> => {
    return api.put(`/assignments/${id}`, assignmentData);
  },

  /**
   * Delete an assignment
   * @param id Assignment ID
   * @returns Response indicating success/failure
   */
  delete: async (id: number): Promise<AxiosResponse<AssignmentResponse>> => {
    return api.delete(`/assignments/${id}`);
  },
};

export default assignmentApi; 