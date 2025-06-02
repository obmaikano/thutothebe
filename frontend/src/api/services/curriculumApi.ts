import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface Curriculum {
  id: number;
  title: string;
  description?: string;
  curriculumType: 'NATIONAL' | 'REGIONAL' | 'SCHOOL_SPECIFIC' | 'INTERNATIONAL' | 'VOCATIONAL' | 'SPECIAL_NEEDS';
  gradeLevel: 'STANDARD_1' | 'STANDARD_2' | 'STANDARD_3' | 'STANDARD_4' | 'STANDARD_5' | 'STANDARD_6' | 'STANDARD_7' | 'FORM_1' | 'FORM_2' | 'FORM_3' | 'FORM_4' | 'FORM_5' | 'FORM_6' | 'KINDERGARTEN' | 'PRE_KINDERGARTEN';
  status: 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED' | 'DEPRECATED';
  academicYear: number;
  effectiveDate?: string;
  expiryDate?: string;
  learningOutcomes?: string;
  durationWeeks?: number;
  totalHours?: number;
  regionId?: number;
  regionName?: string;
  schoolId?: number;
  schoolName?: string;
  createdById: number;
  createdByName?: string;
  approvedById?: number;
  approvedByName?: string;
  approvedAt?: string;
  subjectIds?: number[];
  subjectNames?: string[];
  active: boolean;
  curriculumVersion?: number;
  metadata?: string;
  createdAt: string;
  modifiedAt: string;
}

export interface CurriculumResponse {
  status: string;
  message: string;
  data: Curriculum | Curriculum[] | null;
  timestamp: string | null;
}

export type CreateCurriculumRequest = Omit<Curriculum, 'id' | 'createdAt' | 'modifiedAt' | 'createdByName' | 'approvedByName' | 'regionName' | 'schoolName' | 'subjectNames'>;
export type UpdateCurriculumRequest = Partial<CreateCurriculumRequest>;

/**
 * API service for interacting with curriculum endpoints
 */
const curriculumApi = {
  /**
   * Get all curricula
   * @returns Response with a list of curricula
   */
  getAll: async (): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.get('/curricula');
  },

  /**
   * Get curriculum by ID
   * @param id Curriculum ID
   * @returns Response with curriculum details
   */
  getById: async (id: number): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.get(`/curricula/${id}`);
  },

  /**
   * Get all active curricula
   * @returns Response with a list of active curricula
   */
  getActive: async (): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.get('/curricula/active');
  },

  /**
   * Get curricula by status
   * @param status Curriculum status
   * @returns Response with a list of curricula
   */
  getByStatus: async (status: string): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.get(`/curricula/status/${status}`);
  },

  /**
   * Get curricula by type
   * @param type Curriculum type
   * @returns Response with a list of curricula
   */
  getByType: async (type: string): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.get(`/curricula/type/${type}`);
  },

  /**
   * Get curricula by grade level
   * @param gradeLevel Grade level
   * @returns Response with a list of curricula
   */
  getByGradeLevel: async (gradeLevel: string): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.get(`/curricula/grade-level/${gradeLevel}`);
  },

  /**
   * Get curricula by academic year
   * @param academicYear Academic year
   * @returns Response with a list of curricula
   */
  getByAcademicYear: async (academicYear: number): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.get(`/curricula/academic-year/${academicYear}`);
  },

  /**
   * Get curricula by region
   * @param regionId Region ID
   * @returns Response with a list of curricula
   */
  getByRegion: async (regionId: number): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.get(`/curricula/region/${regionId}`);
  },

  /**
   * Get curricula by school
   * @param schoolId School ID
   * @returns Response with a list of curricula
   */
  getBySchool: async (schoolId: number): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.get(`/curricula/school/${schoolId}`);
  },

  /**
   * Get curricula effective on a specific date
   * @param date Date in YYYY-MM-DD format
   * @returns Response with a list of curricula
   */
  getEffectiveOnDate: async (date: string): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.get(`/curricula/effective-on/${date}`);
  },

  /**
   * Search curricula by title
   * @param title Title search term
   * @returns Response with a list of curricula
   */
  searchByTitle: async (title: string): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.get(`/curricula/search?title=${encodeURIComponent(title)}`);
  },

  /**
   * Create a new curriculum
   * @param curriculumData Curriculum data
   * @returns Response with created curriculum details
   */
  create: async (curriculumData: CreateCurriculumRequest): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.post('/curricula', curriculumData);
  },

  /**
   * Update an existing curriculum
   * @param id Curriculum ID
   * @param curriculumData Updated curriculum data
   * @returns Response with updated curriculum details
   */
  update: async (id: number, curriculumData: UpdateCurriculumRequest): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.put(`/curricula/${id}`, curriculumData);
  },

  /**
   * Delete a curriculum
   * @param id Curriculum ID
   * @returns Response indicating success/failure
   */
  delete: async (id: number): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.delete(`/curricula/${id}`);
  },

  /**
   * Approve a curriculum
   * @param id Curriculum ID
   * @param approvedById Approver user ID
   * @returns Response with approved curriculum details
   */
  approve: async (id: number, approvedById: number): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.post(`/curricula/${id}/approve?approvedById=${approvedById}`);
  },

  /**
   * Submit a curriculum for review
   * @param id Curriculum ID
   * @returns Response with updated curriculum details
   */
  submitForReview: async (id: number): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.post(`/curricula/${id}/submit-for-review`);
  },

  /**
   * Activate a curriculum
   * @param id Curriculum ID
   * @returns Response with activated curriculum details
   */
  activate: async (id: number): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.post(`/curricula/${id}/activate`);
  },

  /**
   * Suspend a curriculum
   * @param id Curriculum ID
   * @returns Response with suspended curriculum details
   */
  suspend: async (id: number): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.post(`/curricula/${id}/suspend`);
  },

  /**
   * Archive a curriculum
   * @param id Curriculum ID
   * @returns Response with archived curriculum details
   */
  archive: async (id: number): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.post(`/curricula/${id}/archive`);
  },

  /**
   * Duplicate a curriculum
   * @param id Curriculum ID
   * @param newTitle New title for the duplicated curriculum
   * @param newAcademicYear New academic year for the duplicated curriculum
   * @returns Response with duplicated curriculum details
   */
  duplicate: async (id: number, newTitle: string, newAcademicYear: number): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.post(`/curricula/${id}/duplicate?title=${encodeURIComponent(newTitle)}&academicYear=${newAcademicYear}`);
  },

  /**
   * Export a curriculum
   * @param id Curriculum ID
   * @returns Response with curriculum export data
   */
  export: async (id: number): Promise<AxiosResponse<Blob>> => {
    return api.get(`/curricula/${id}/export`, {
      responseType: 'blob',
    });
  },

  /**
   * Import a curriculum
   * @param file Curriculum file to import
   * @returns Response with imported curriculum details
   */
  import: async (file: File): Promise<AxiosResponse<CurriculumResponse>> => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/curricula/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Check if curriculum exists by title, grade level and academic year
   * @param title Curriculum title
   * @param gradeLevel Grade level
   * @param academicYear Academic year
   * @returns Response with existence check result
   */
  checkExists: async (title: string, gradeLevel: string, academicYear: number): Promise<AxiosResponse<{ status: string; message: string; data: boolean; timestamp: string | null }>> => {
    return api.get(`/curricula/exists?title=${encodeURIComponent(title)}&gradeLevel=${gradeLevel}&academicYear=${academicYear}`);
  },

  // Subject association methods
  addSubject: async (curriculumId: number, subjectId: number, isCore: boolean = true, allocatedHours?: number, weightPercentage?: number): Promise<AxiosResponse<CurriculumResponse>> => {
    const params = new URLSearchParams();
    params.append('isCore', isCore.toString());
    if (allocatedHours !== undefined) params.append('allocatedHours', allocatedHours.toString());
    if (weightPercentage !== undefined) params.append('weightPercentage', weightPercentage.toString());
    
    return api.post(`/curricula/${curriculumId}/subjects/${subjectId}?${params.toString()}`);
  },
  removeSubject: async (curriculumId: number, subjectId: number): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.delete(`/curricula/${curriculumId}/subjects/${subjectId}`);
  },
  updateSubjects: async (curriculumId: number, subjectIds: number[]): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.put(`/curricula/${curriculumId}/subjects`, { subjectIds });
  },

  // ==================== CURRICULUM UNITS ====================

  /**
   * Get all units for a curriculum
   * @param curriculumId Curriculum ID
   * @returns Response with curriculum units
   */
  getUnits: async (curriculumId: number): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.get(`/curricula/${curriculumId}/units`);
  },

  /**
   * Get unit by ID
   * @param unitId Unit ID
   * @returns Response with unit details
   */
  getUnitById: async (unitId: number): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.get(`/curricula/units/${unitId}`);
  },

  /**
   * Update a curriculum unit
   * @param unitId Unit ID
   * @param unitData Updated unit data
   * @returns Response with updated unit details
   */
  updateUnit: async (
    unitId: number,
    unitData: {
      title: string;
      description?: string;
      unitOrder?: number;
      durationWeeks?: number;
      allocatedHours?: number;
    }
  ): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.put(`/curricula/units/${unitId}`, unitData);
  },

  /**
   * Delete a curriculum unit
   * @param unitId Unit ID
   * @returns Response indicating success/failure
   */
  deleteUnit: async (unitId: number): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.delete(`/curricula/units/${unitId}`);
  },

  /**
   * Create a curriculum unit
   * @param curriculumId Curriculum ID
   * @param title Unit title
   * @param description Unit description
   * @param unitOrder Unit order
   * @param durationWeeks Duration in weeks
   * @param allocatedHours Allocated hours
   * @returns Response with updated curriculum details
   */
  createUnit: async (
    curriculumId: number, 
    title: string, 
    description?: string, 
    unitOrder?: number, 
    durationWeeks?: number, 
    allocatedHours?: number
  ): Promise<AxiosResponse<CurriculumResponse>> => {
    const params = new URLSearchParams();
    params.append('title', title);
    if (description) params.append('description', description);
    if (unitOrder !== undefined) params.append('unitOrder', unitOrder.toString());
    if (durationWeeks !== undefined) params.append('durationWeeks', durationWeeks.toString());
    if (allocatedHours !== undefined) params.append('allocatedHours', allocatedHours.toString());
    
    return api.post(`/curricula/${curriculumId}/units?${params.toString()}`);
  },

  // ==================== CURRICULUM TOPICS ====================

  /**
   * Get all topics for a curriculum unit
   * @param unitId Unit ID
   * @returns Response with curriculum topics
   */
  getTopics: async (unitId: number): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.get(`/curricula/units/${unitId}/topics`);
  },

  /**
   * Get topic by ID
   * @param topicId Topic ID
   * @returns Response with topic details
   */
  getTopicById: async (topicId: number): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.get(`/curricula/topics/${topicId}`);
  },

  /**
   * Update a curriculum topic
   * @param topicId Topic ID
   * @param topicData Updated topic data
   * @returns Response with updated topic details
   */
  updateTopic: async (
    topicId: number,
    topicData: {
      title: string;
      description?: string;
      topicOrder?: number;
      durationHours?: number;
    }
  ): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.put(`/curricula/topics/${topicId}`, topicData);
  },

  /**
   * Delete a curriculum topic
   * @param topicId Topic ID
   * @returns Response indicating success/failure
   */
  deleteTopic: async (topicId: number): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.delete(`/curricula/topics/${topicId}`);
  },

  /**
   * Create a curriculum topic
   * @param curriculumUnitId Curriculum Unit ID
   * @param title Topic title
   * @param description Topic description
   * @param topicOrder Topic order
   * @param durationHours Duration in hours
   * @returns Response with updated curriculum details
   */
  createTopic: async (
    curriculumUnitId: number, 
    title: string, 
    description?: string, 
    topicOrder?: number, 
    durationHours?: number
  ): Promise<AxiosResponse<CurriculumResponse>> => {
    const params = new URLSearchParams();
    params.append('title', title);
    if (description) params.append('description', description);
    if (topicOrder !== undefined) params.append('topicOrder', topicOrder.toString());
    if (durationHours !== undefined) params.append('durationHours', durationHours.toString());
    
    return api.post(`/curricula/units/${curriculumUnitId}/topics?${params.toString()}`);
  },

  // ==================== CURRICULUM RECOMMENDATIONS ====================

  /**
   * Get curriculum recommendations
   * @param gradeLevel Grade level
   * @param type Curriculum type
   * @param regionId Region ID (optional)
   * @returns Response with recommended curricula
   */
  getRecommendations: async (
    gradeLevel: string, 
    type: string, 
    regionId?: number
  ): Promise<AxiosResponse<CurriculumResponse>> => {
    const params = new URLSearchParams();
    params.append('gradeLevel', gradeLevel);
    params.append('type', type);
    if (regionId !== undefined) params.append('regionId', regionId.toString());
    
    return api.get(`/curricula/recommendations?${params.toString()}`);
  },

  // ==================== CURRICULUM VALIDATION ====================

  /**
   * Validate curriculum alignment with regional standards
   * @param curriculumId Curriculum ID
   * @param regionId Region ID
   * @returns Response with validation result
   */
  validateAlignment: async (
    curriculumId: number, 
    regionId: number
  ): Promise<AxiosResponse<{ status: string; message: string; data: string; timestamp: string | null }>> => {
    return api.post(`/curricula/${curriculumId}/validate-alignment?regionId=${regionId}`);
  },
};

export default curriculumApi; 