import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface Submission {
  id: number;
  assignmentId: number;
  studentId: number;
  content: string;
  submittedAt: string;
  score?: number;
  feedback?: string;
  status: 'PENDING' | 'GRADED' | 'LATE';
}

export interface SubmissionResponse {
  status: string;
  message: string;
  data: Submission | Submission[] | null;
  timestamp: string | null;
}

export type CreateSubmissionRequest = Omit<Submission, 'id' | 'submittedAt'>;
export type UpdateSubmissionRequest = Partial<Submission>;

/**
 * API service for interacting with submission endpoints
 */
const submissionApi = {
  /**
   * Get all submissions
   * @returns Response with a list of submissions
   */
  getAll: async (): Promise<AxiosResponse<SubmissionResponse>> => {
    return api.get('/submissions');
  },

  /**
   * Get submission by ID
   * @param id Submission ID
   * @returns Response with submission details
   */
  getById: async (id: number): Promise<AxiosResponse<SubmissionResponse>> => {
    return api.get(`/submissions/${id}`);
  },

  /**
   * Get submission by assignment and student
   * @param assignmentId Assignment ID
   * @param studentId Student ID
   * @returns Response with submission details
   */
  getByAssignmentAndStudent: async (assignmentId: number, studentId: number): Promise<AxiosResponse<SubmissionResponse>> => {
    return api.get(`/submissions/assignment/${assignmentId}/student/${studentId}`);
  },

  /**
   * Get submissions by assignment
   * @param assignmentId Assignment ID
   * @returns Response with submissions for the assignment
   */
  getByAssignment: async (assignmentId: number): Promise<AxiosResponse<SubmissionResponse>> => {
    return api.get(`/submissions/assignment/${assignmentId}`);
  },

  /**
   * Get submissions by student
   * @param studentId Student ID
   * @returns Response with submissions for the student
   */
  getByStudent: async (studentId: number): Promise<AxiosResponse<SubmissionResponse>> => {
    return api.get(`/submissions/student/${studentId}`);
  },

  /**
   * Get graded submissions by assignment
   * @param assignmentId Assignment ID
   * @returns Response with graded submissions for the assignment
   */
  getGradedByAssignment: async (assignmentId: number): Promise<AxiosResponse<SubmissionResponse>> => {
    return api.get(`/submissions/assignment/${assignmentId}/graded`);
  },

  /**
   * Get graded submissions by student
   * @param studentId Student ID
   * @returns Response with graded submissions for the student
   */
  getGradedByStudent: async (studentId: number): Promise<AxiosResponse<SubmissionResponse>> => {
    return api.get(`/submissions/student/${studentId}/graded`);
  },

  /**
   * Get submissions by teacher
   * @param teacherId Teacher ID
   * @returns Response with submissions for the teacher
   */
  getByTeacher: async (teacherId: number): Promise<AxiosResponse<SubmissionResponse>> => {
    return api.get(`/submissions/teacher/${teacherId}`);
  },

  /**
   * Get pending submissions by teacher
   * @param teacherId Teacher ID
   * @returns Response with pending submissions for the teacher
   */
  getPendingByTeacher: async (teacherId: number): Promise<AxiosResponse<SubmissionResponse>> => {
    return api.get(`/submissions/teacher/${teacherId}/pending`);
  },

  /**
   * Get late submissions by teacher
   * @param teacherId Teacher ID
   * @returns Response with late submissions for the teacher
   */
  getLateByTeacher: async (teacherId: number): Promise<AxiosResponse<SubmissionResponse>> => {
    return api.get(`/submissions/teacher/${teacherId}/late`);
  },

  /**
   * Get pending submissions by course
   * @param courseId Course ID
   * @returns Response with pending submissions for the course
   */
  getPendingByCourse: async (courseId: number): Promise<AxiosResponse<SubmissionResponse>> => {
    return api.get(`/submissions/course/${courseId}/pending`);
  },

  /**
   * Get late submissions by course
   * @param courseId Course ID
   * @returns Response with late submissions for the course
   */
  getLateByCourse: async (courseId: number): Promise<AxiosResponse<SubmissionResponse>> => {
    return api.get(`/submissions/course/${courseId}/late`);
  },

  /**
   * Grade a submission
   * @param id Submission ID
   * @param score Score to assign
   * @param feedback Optional feedback
   * @returns Response with graded submission details
   */
  grade: async (id: number, score: number, feedback?: string): Promise<AxiosResponse<SubmissionResponse>> => {
    const params = new URLSearchParams({ score: score.toString() });
    if (feedback) {
      params.append('feedback', feedback);
    }
    return api.post(`/submissions/${id}/grade?${params.toString()}`);
  },

  /**
   * Create a new submission
   * @param submissionData Submission data
   * @returns Response with created submission details
   */
  create: async (submissionData: CreateSubmissionRequest): Promise<AxiosResponse<SubmissionResponse>> => {
    return api.post('/submissions', submissionData);
  },

  /**
   * Update an existing submission
   * @param id Submission ID
   * @param submissionData Updated submission data
   * @returns Response with updated submission details
   */
  update: async (id: number, submissionData: UpdateSubmissionRequest): Promise<AxiosResponse<SubmissionResponse>> => {
    return api.put(`/submissions/${id}`, submissionData);
  },

  /**
   * Delete a submission
   * @param id Submission ID
   * @returns Response indicating success/failure
   */
  delete: async (id: number): Promise<AxiosResponse<SubmissionResponse>> => {
    return api.delete(`/submissions/${id}`);
  },
};

export default submissionApi; 