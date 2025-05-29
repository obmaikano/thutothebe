import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface Assignment {
  id: number;
  title: string;
  description: string;
  instructions?: string;
  code: string;
  courseId: number;
  teacherId: number;
  instructorId: number;
  dueDate: string;
  startDate?: string;
  maxScore: number;
  weight: number;
  allowLateSubmissions: boolean;
  latePenalty?: number;
  maxAttempts?: number;
  isGroupAssignment: boolean;
  maxGroupSize?: number;
  submissionType: 'FILE' | 'TEXT' | 'LINK' | 'MIXED';
  allowedFileTypes?: string;
  maxFileSize?: number;
  rubricId?: number;
  gradingType: 'POINTS' | 'PERCENTAGE' | 'LETTER' | 'PASS_FAIL';
  autoGrade: boolean;
  publishGrades: boolean;
  showRubric: boolean;
  plagiarismCheck: boolean;
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';
  visibility: 'VISIBLE' | 'HIDDEN' | 'SCHEDULED';
  estimatedDuration?: number;
  tags?: string;
  attachments?: string;
  submissionCount: number;
  gradedCount: number;
  averageScore?: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentResponse {
  status: string;
  message: string;
  data: Assignment | Assignment[] | null;
  timestamp: string | null;
}

export type CreateAssignmentRequest = Omit<Assignment, 'id' | 'submissionCount' | 'gradedCount' | 'averageScore' | 'createdAt' | 'updatedAt'>;
export type UpdateAssignmentRequest = Partial<CreateAssignmentRequest>;

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
   * Get assignments by teacher
   * @param teacherId Teacher ID
   * @returns Response with assignments for the teacher
   */
  getByTeacher: async (teacherId: number): Promise<AxiosResponse<AssignmentResponse>> => {
    return api.get(`/assignments/teacher/${teacherId}`);
  },

  /**
   * Get active assignments by teacher
   * @param teacherId Teacher ID
   * @returns Response with active assignments for the teacher
   */
  getActiveByTeacher: async (teacherId: number): Promise<AxiosResponse<AssignmentResponse>> => {
    return api.get(`/assignments/teacher/${teacherId}/active`);
  },

  /**
   * Get assignments by instructor
   * @param instructorId Instructor ID
   * @returns Response with assignments for the instructor
   */
  getByInstructor: async (instructorId: number): Promise<AxiosResponse<AssignmentResponse>> => {
    return api.get(`/assignments/instructor/${instructorId}`);
  },

  /**
   * Get active assignments by instructor
   * @param instructorId Instructor ID
   * @returns Response with active assignments for the instructor
   */
  getActiveByInstructor: async (instructorId: number): Promise<AxiosResponse<AssignmentResponse>> => {
    return api.get(`/assignments/instructor/${instructorId}/active`);
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

  /**
   * Publish an assignment
   * @param id Assignment ID
   * @returns Response with updated assignment details
   */
  publish: async (id: number): Promise<AxiosResponse<AssignmentResponse>> => {
    return api.put(`/assignments/${id}/publish`);
  },

  /**
   * Close an assignment
   * @param id Assignment ID
   * @returns Response with updated assignment details
   */
  close: async (id: number): Promise<AxiosResponse<AssignmentResponse>> => {
    return api.put(`/assignments/${id}/close`);
  },

  /**
   * Archive an assignment
   * @param id Assignment ID
   * @returns Response with updated assignment details
   */
  archive: async (id: number): Promise<AxiosResponse<AssignmentResponse>> => {
    return api.put(`/assignments/${id}/archive`);
  },
};

export default assignmentApi; 