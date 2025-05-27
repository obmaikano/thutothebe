import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface Assessment {
  id: number;
  submissionId: number;
  assessorId: number;
  isSelfAssessment: boolean;
  gradingStrategy: 'ACCUMULATIVE' | 'AVERAGE' | 'HIGHEST' | 'LATEST';
  score?: number;
  feedback?: string;
  rubricScores?: string;
  submittedAt?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'SUBMITTED' | 'GRADED';
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentResponse {
  status: string;
  message: string;
  data: Assessment | Assessment[] | null;
  timestamp: string | null;
}

export interface CreateAssessmentRequest {
  submissionId: number;
  assessorId: number;
  isSelfAssessment: boolean;
  gradingStrategy: 'ACCUMULATIVE' | 'AVERAGE' | 'HIGHEST' | 'LATEST';
}

export interface UpdateAssessmentRequest {
  score?: number;
  feedback?: string;
  rubricScores?: string;
  status?: 'PENDING' | 'IN_PROGRESS' | 'SUBMITTED' | 'GRADED';
}

export interface SubmitAssessmentRequest {
  score: number;
  feedback: string;
  rubricScores?: string;
}

export interface AssignPeerAssessmentsRequest {
  assessorIds: number[];
  gradingStrategy: 'ACCUMULATIVE' | 'AVERAGE' | 'HIGHEST' | 'LATEST';
}

/**
 * API service for interacting with assessment endpoints
 */
const assessmentApi = {
  /**
   * Get all assessments
   * @returns Response with a list of assessments
   */
  getAll: async (): Promise<AxiosResponse<AssessmentResponse>> => {
    return api.get('/assessments');
  },

  /**
   * Get assessment by ID
   * @param id Assessment ID
   * @returns Response with assessment details
   */
  getById: async (id: number): Promise<AxiosResponse<AssessmentResponse>> => {
    return api.get(`/assessments/${id}`);
  },

  /**
   * Get assessments by submission ID
   * @param submissionId Submission ID
   * @returns Response with assessments for the submission
   */
  getBySubmissionId: async (submissionId: number): Promise<AxiosResponse<AssessmentResponse>> => {
    return api.get(`/assessments/submission/${submissionId}`);
  },

  /**
   * Get assessments by assessor ID
   * @param assessorId Assessor ID
   * @returns Response with assessments for the assessor
   */
  getByAssessorId: async (assessorId: number): Promise<AxiosResponse<AssessmentResponse>> => {
    return api.get(`/assessments/assessor/${assessorId}`);
  },

  /**
   * Get assessments by course ID
   * @param courseId Course ID
   * @returns Response with assessments for the course
   */
  getByCourseId: async (courseId: number): Promise<AxiosResponse<AssessmentResponse>> => {
    return api.get(`/assessments/course/${courseId}`);
  },

  /**
   * Get assessments by submission ID and status
   * @param submissionId Submission ID
   * @param status Assessment status
   * @returns Response with filtered assessments
   */
  getBySubmissionIdAndStatus: async (
    submissionId: number, 
    status: 'PENDING' | 'IN_PROGRESS' | 'SUBMITTED' | 'GRADED'
  ): Promise<AxiosResponse<AssessmentResponse>> => {
    return api.get(`/assessments/submission/${submissionId}/status/${status}`);
  },

  /**
   * Create a new assessment
   * @param assessmentData Assessment data
   * @returns Response with created assessment details
   */
  create: async (assessmentData: CreateAssessmentRequest): Promise<AxiosResponse<AssessmentResponse>> => {
    return api.post('/assessments', assessmentData);
  },

  /**
   * Update an existing assessment
   * @param id Assessment ID
   * @param assessmentData Updated assessment data
   * @returns Response with updated assessment details
   */
  update: async (id: number, assessmentData: UpdateAssessmentRequest): Promise<AxiosResponse<AssessmentResponse>> => {
    return api.put(`/assessments/${id}`, assessmentData);
  },

  /**
   * Delete an assessment
   * @param id Assessment ID
   * @returns Response indicating success/failure
   */
  delete: async (id: number): Promise<AxiosResponse<AssessmentResponse>> => {
    return api.delete(`/assessments/${id}`);
  },

  /**
   * Submit an assessment
   * @param id Assessment ID
   * @param submitData Submission data
   * @returns Response with submitted assessment details
   */
  submit: async (id: number, submitData: SubmitAssessmentRequest): Promise<AxiosResponse<AssessmentResponse>> => {
    const formData = new FormData();
    formData.append('score', submitData.score.toString());
    formData.append('feedback', submitData.feedback);
    if (submitData.rubricScores) {
      formData.append('rubricScores', submitData.rubricScores);
    }
    
    return api.post(`/assessments/${id}/submit`, formData);
  },

  /**
   * Update assessment status
   * @param id Assessment ID
   * @param status New status
   * @returns Response with updated assessment details
   */
  updateStatus: async (
    id: number, 
    status: 'PENDING' | 'IN_PROGRESS' | 'SUBMITTED' | 'GRADED'
  ): Promise<AxiosResponse<AssessmentResponse>> => {
    const formData = new FormData();
    formData.append('status', status);
    
    return api.put(`/assessments/${id}/status`, formData);
  },

  /**
   * Assign peer assessments
   * @param submissionId Submission ID
   * @param assignData Assignment data
   * @returns Response with created assessments
   */
  assignPeerAssessments: async (
    submissionId: number, 
    assignData: AssignPeerAssessmentsRequest
  ): Promise<AxiosResponse<AssessmentResponse>> => {
    const formData = new FormData();
    assignData.assessorIds.forEach(id => formData.append('assessorIds', id.toString()));
    formData.append('gradingStrategy', assignData.gradingStrategy);
    
    return api.post(`/assessments/submission/${submissionId}/assign`, formData);
  },
};

export default assessmentApi; 