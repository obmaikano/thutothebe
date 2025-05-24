import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface GradeCategory {
  id: number;
  name: string;
  description: string;
  weight: number;
  courseId: number;
  active: boolean;
  minGrade: number;
  maxGrade: number;
  passingGrade: number;
}

export interface GradeCategoryResponse {
  status: string;
  message: string;
  data: GradeCategory | GradeCategory[] | number | null;
  timestamp: string | null;
}

export type CreateGradeCategoryRequest = Omit<GradeCategory, 'id'>;
export type UpdateGradeCategoryRequest = Partial<GradeCategory>;

/**
 * API service for interacting with grade category endpoints
 */
const gradeCategoryApi = {
  /**
   * Get all grade categories
   * @returns Response with a list of grade categories
   */
  getAll: async (): Promise<AxiosResponse<GradeCategoryResponse>> => {
    return api.get('/grade-categories');
  },

  /**
   * Get grade category by ID
   * @param id Grade category ID
   * @returns Response with grade category details
   */
  getById: async (id: number): Promise<AxiosResponse<GradeCategoryResponse>> => {
    return api.get(`/grade-categories/${id}`);
  },

  /**
   * Get grade categories by course
   * @param courseId Course ID
   * @returns Response with grade categories for the course
   */
  getByCourse: async (courseId: number): Promise<AxiosResponse<GradeCategoryResponse>> => {
    return api.get(`/grade-categories/course/${courseId}`);
  },

  /**
   * Get active grade categories by course
   * @param courseId Course ID
   * @returns Response with active grade categories for the course
   */
  getActiveByCourse: async (courseId: number): Promise<AxiosResponse<GradeCategoryResponse>> => {
    return api.get(`/grade-categories/course/${courseId}/active`);
  },

  /**
   * Get total weight by course
   * @param courseId Course ID
   * @returns Response with total weight for the course
   */
  getTotalWeightByCourse: async (courseId: number): Promise<AxiosResponse<GradeCategoryResponse>> => {
    return api.get(`/grade-categories/course/${courseId}/total-weight`);
  },

  /**
   * Get average passing grade by course
   * @param courseId Course ID
   * @returns Response with average passing grade for the course
   */
  getAveragePassingGradeByCourse: async (courseId: number): Promise<AxiosResponse<GradeCategoryResponse>> => {
    return api.get(`/grade-categories/course/${courseId}/average-passing-grade`);
  },

  /**
   * Create a new grade category
   * @param gradeCategoryData Grade category data
   * @returns Response with created grade category details
   */
  create: async (gradeCategoryData: CreateGradeCategoryRequest): Promise<AxiosResponse<GradeCategoryResponse>> => {
    return api.post('/grade-categories', gradeCategoryData);
  },

  /**
   * Update an existing grade category
   * @param id Grade category ID
   * @param gradeCategoryData Updated grade category data
   * @returns Response with updated grade category details
   */
  update: async (id: number, gradeCategoryData: UpdateGradeCategoryRequest): Promise<AxiosResponse<GradeCategoryResponse>> => {
    return api.put(`/grade-categories/${id}`, gradeCategoryData);
  },

  /**
   * Delete a grade category
   * @param id Grade category ID
   * @returns Response indicating success/failure
   */
  delete: async (id: number): Promise<AxiosResponse<GradeCategoryResponse>> => {
    return api.delete(`/grade-categories/${id}`);
  },
};

export default gradeCategoryApi; 