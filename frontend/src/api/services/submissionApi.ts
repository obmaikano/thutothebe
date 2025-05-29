import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface Submission {
  id: number;
  assignmentId: number;
  studentId: number;
  groupId?: number;
  content?: string;
  textContent?: string;
  linkContent?: string;
  filePaths?: string;
  originalFileName?: string;
  fileSize?: number;
  submittedAt: string;
  lastModifiedAt?: string;
  score?: number;
  maxScore?: number;
  percentage?: number;
  letterGrade?: string;
  feedback?: string;
  rubricScores?: string;
  gradedAt?: string;
  gradedBy?: number;
  status: 'DRAFT' | 'SUBMITTED' | 'GRADED' | 'RETURNED' | 'LATE' | 'MISSING';
  submissionNumber: number;
  isLate: boolean;
  latePenaltyApplied?: number;
  plagiarismScore?: number;
  plagiarismReport?: string;
  autoGraded: boolean;
  needsReview: boolean;
  reviewedAt?: string;
  reviewedBy?: number;
  comments?: string;
  attachments?: string;
  version: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubmissionResponse {
  status: string;
  message: string;
  data: Submission | Submission[] | null;
  timestamp: string | null;
}

export type CreateSubmissionRequest = Omit<Submission, 'id' | 'submittedAt' | 'lastModifiedAt' | 'gradedAt' | 'reviewedAt' | 'createdAt' | 'updatedAt'>;
export type UpdateSubmissionRequest = Partial<CreateSubmissionRequest>;

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
   * Get submissions by course
   * @param courseId Course ID
   * @returns Response with submissions for the course
   */
  getByCourse: async (courseId: number): Promise<AxiosResponse<SubmissionResponse>> => {
    return api.get(`/submissions/course/${courseId}`);
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
   * Get submissions by instructor
   * @param instructorId Instructor ID
   * @returns Response with submissions for the instructor
   */
  getByInstructor: async (instructorId: number): Promise<AxiosResponse<SubmissionResponse>> => {
    return api.get(`/submissions/instructor/${instructorId}`);
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
   * Get pending submissions by teacher
   * @param teacherId Teacher ID
   * @returns Response with pending submissions for the teacher
   */
  getPendingByTeacher: async (teacherId: number): Promise<AxiosResponse<SubmissionResponse>> => {
    return api.get(`/submissions/teacher/${teacherId}/pending`);
  },

  /**
   * Get pending submissions by instructor
   * @param instructorId Instructor ID
   * @returns Response with pending submissions for the instructor
   */
  getPendingByInstructor: async (instructorId: number): Promise<AxiosResponse<SubmissionResponse>> => {
    return api.get(`/submissions/instructor/${instructorId}/pending`);
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
   * Get late submissions by instructor
   * @param instructorId Instructor ID
   * @returns Response with late submissions for the instructor
   */
  getLateByInstructor: async (instructorId: number): Promise<AxiosResponse<SubmissionResponse>> => {
    return api.get(`/submissions/instructor/${instructorId}/late`);
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
   * Get submissions needing review
   * @returns Response with submissions needing review
   */
  getNeedingReview: async (): Promise<AxiosResponse<SubmissionResponse>> => {
    return api.get('/submissions/review/needed');
  },

  /**
   * Get submissions needing review by teacher
   * @param teacherId Teacher ID
   * @returns Response with submissions needing review for the teacher
   */
  getNeedingReviewByTeacher: async (teacherId: number): Promise<AxiosResponse<SubmissionResponse>> => {
    return api.get(`/submissions/teacher/${teacherId}/review/needed`);
  },

  /**
   * Get submissions needing review by instructor
   * @param instructorId Instructor ID
   * @returns Response with submissions needing review for the instructor
   */
  getNeedingReviewByInstructor: async (instructorId: number): Promise<AxiosResponse<SubmissionResponse>> => {
    return api.get(`/submissions/instructor/${instructorId}/review/needed`);
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
   * Submit a draft submission
   * @param id Submission ID
   * @returns Response with submitted submission details
   */
  submit: async (id: number): Promise<AxiosResponse<SubmissionResponse>> => {
    return api.put(`/submissions/${id}/submit`);
  },

  /**
   * Grade a submission
   * @param id Submission ID
   * @param gradeData Grade data including score and feedback
   * @returns Response with graded submission details
   */
  grade: async (id: number, gradeData: {
    score?: number;
    percentage?: number;
    letterGrade?: string;
    feedback?: string;
    rubricScores?: string;
  }): Promise<AxiosResponse<SubmissionResponse>> => {
    return api.put(`/submissions/${id}/grade`, gradeData);
  },

  /**
   * Return a graded submission to student
   * @param id Submission ID
   * @returns Response with returned submission details
   */
  returnToStudent: async (id: number): Promise<AxiosResponse<SubmissionResponse>> => {
    return api.put(`/submissions/${id}/return`);
  },

  /**
   * Mark submission as reviewed
   * @param id Submission ID
   * @param comments Optional review comments
   * @returns Response with reviewed submission details
   */
  markReviewed: async (id: number, comments?: string): Promise<AxiosResponse<SubmissionResponse>> => {
    const data = comments ? { comments } : {};
    return api.put(`/submissions/${id}/review`, data);
  },

  /**
   * Delete a submission
   * @param id Submission ID
   * @returns Response indicating success/failure
   */
  delete: async (id: number): Promise<AxiosResponse<SubmissionResponse>> => {
    return api.delete(`/submissions/${id}`);
  },

  /**
   * Upload file for submission
   * @param assignmentId Assignment ID
   * @param studentId Student ID
   * @param file File to upload
   * @returns Response with file upload details
   */
  uploadFile: async (assignmentId: number, studentId: number, file: File): Promise<AxiosResponse<SubmissionResponse>> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('assignmentId', assignmentId.toString());
    formData.append('studentId', studentId.toString());
    
    return api.post('/submissions/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Download submission file
   * @param id Submission ID
   * @returns File download response
   */
  downloadFile: async (id: number): Promise<AxiosResponse<Blob>> => {
    return api.get(`/submissions/${id}/download`, {
      responseType: 'blob',
    });
  },
};

export default submissionApi; 