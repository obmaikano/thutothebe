import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface CurriculumSubjectDTO {
  id: number;
  curriculumId: number;
  curriculumTitle: string;
  subjectId: number;
  subjectName: string;
  subjectCode: string;
  isCore: boolean;
  allocatedHours?: number;
  weightPercentage?: number;
  objectives?: string;
  active: boolean;
  createdAt: string;
  modifiedAt: string;
}

export interface UpdateCurriculumSubjectRequest {
  isCore: boolean;
  allocatedHours?: number;
  weightPercentage?: number;
  objectives?: string;
}

export interface Subject {
  id: number;
  code: string;
  name: string;
  description?: string;
  active: boolean;
}

export interface CurriculumSubjectResponse {
  status: string;
  message: string;
  data: CurriculumSubjectDTO | CurriculumSubjectDTO[] | Subject[] | null;
  error?: string;
}

/**
 * API service for curriculum subject management
 */
const curriculumSubjectApi = {
  /**
   * Get all subjects associated with a curriculum
   * @param curriculumId Curriculum ID
   * @returns Response with curriculum subjects
   */
  getCurriculumSubjects: async (curriculumId: number): Promise<AxiosResponse<CurriculumSubjectResponse>> => {
    return api.get(`/curricula/${curriculumId}/subjects`);
  },

  /**
   * Get available subjects for a curriculum (excluding already associated ones)
   * @param curriculumId Curriculum ID
   * @returns Response with available subjects
   */
  getAvailableSubjects: async (curriculumId: number): Promise<AxiosResponse<CurriculumSubjectResponse>> => {
    return api.get(`/curricula/${curriculumId}/subjects/available`);
  },

  /**
   * Get core subjects for a curriculum
   * @param curriculumId Curriculum ID
   * @returns Response with core subjects
   */
  getCoreSubjects: async (curriculumId: number): Promise<AxiosResponse<CurriculumSubjectResponse>> => {
    return api.get(`/curricula/${curriculumId}/subjects/core`);
  },

  /**
   * Get elective subjects for a curriculum
   * @param curriculumId Curriculum ID
   * @returns Response with elective subjects
   */
  getElectiveSubjects: async (curriculumId: number): Promise<AxiosResponse<CurriculumSubjectResponse>> => {
    return api.get(`/curricula/${curriculumId}/subjects/elective`);
  },

  /**
   * Get curriculum subject statistics
   * @param curriculumId Curriculum ID
   * @returns Response with statistics
   */
  getCurriculumSubjectStatistics: async (curriculumId: number): Promise<AxiosResponse<{ status: string; message: string; data: any; error?: string }>> => {
    return api.get(`/curricula/${curriculumId}/subjects/statistics`);
  },

  /**
   * Get all core subjects across all curricula
   * @returns Response with all core subjects
   */
  getAllCoreSubjects: async (): Promise<AxiosResponse<CurriculumSubjectResponse>> => {
    return api.get('/curricula/subjects/core');
  },

  /**
   * Get all elective subjects across all curricula
   * @returns Response with all elective subjects
   */
  getAllElectiveSubjects: async (): Promise<AxiosResponse<CurriculumSubjectResponse>> => {
    return api.get('/curricula/subjects/elective');
  },

  /**
   * Get all curricula that include a specific subject
   * @param subjectId Subject ID
   * @returns Response with curricula subjects
   */
  getCurriculaBySubject: async (subjectId: number): Promise<AxiosResponse<CurriculumSubjectResponse>> => {
    return api.get(`/curricula/subjects/${subjectId}/curricula`);
  },

  /**
   * Check if a subject exists in a curriculum
   * @param curriculumId Curriculum ID
   * @param subjectId Subject ID
   * @returns Response with boolean result
   */
  checkSubjectExistsInCurriculum: async (curriculumId: number, subjectId: number): Promise<AxiosResponse<{ status: string; message: string; data: boolean; error?: string }>> => {
    return api.get(`/curricula/${curriculumId}/subjects/${subjectId}/exists`);
  },

  /**
   * Add a subject to a curriculum
   * @param curriculumId Curriculum ID
   * @param subjectId Subject ID
   * @param isCore Whether the subject is core
   * @param allocatedHours Allocated hours (optional)
   * @param weightPercentage Weight percentage (optional)
   * @returns Response with updated curriculum
   */
  addSubjectToCurriculum: async (
    curriculumId: number,
    subjectId: number,
    isCore: boolean = true,
    allocatedHours?: number,
    weightPercentage?: number
  ): Promise<AxiosResponse<CurriculumSubjectResponse>> => {
    const params = new URLSearchParams();
    params.append('isCore', isCore.toString());
    if (allocatedHours !== undefined) {
      params.append('allocatedHours', allocatedHours.toString());
    }
    if (weightPercentage !== undefined) {
      params.append('weightPercentage', weightPercentage.toString());
    }
    
    return api.post(`/curricula/${curriculumId}/subjects/${subjectId}?${params.toString()}`);
  },

  /**
   * Remove a subject from a curriculum
   * @param curriculumId Curriculum ID
   * @param subjectId Subject ID
   * @returns Response with updated curriculum
   */
  removeSubjectFromCurriculum: async (
    curriculumId: number,
    subjectId: number
  ): Promise<AxiosResponse<CurriculumSubjectResponse>> => {
    return api.delete(`/curricula/${curriculumId}/subjects/${subjectId}`);
  },

  /**
   * Update curriculum subject details
   * @param curriculumId Curriculum ID
   * @param subjectId Subject ID
   * @param updateData Update data
   * @returns Response with updated curriculum subject
   */
  updateCurriculumSubject: async (
    curriculumId: number,
    subjectId: number,
    updateData: UpdateCurriculumSubjectRequest
  ): Promise<AxiosResponse<CurriculumSubjectResponse>> => {
    return api.put(`/curricula/${curriculumId}/subjects/${subjectId}`, updateData);
  }
};

export default curriculumSubjectApi; 