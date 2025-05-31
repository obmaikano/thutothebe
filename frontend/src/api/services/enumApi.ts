import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface EnumResponse {
  status: string;
  message: string;
  data: string[] | null;
  timestamp: string | null;
}

export interface GradeLevelOption {
  value: string;
  label: string;
}

// Grade level mapping from backend enum to display labels
// Based on backend GradeLevel.java enum
export const GRADE_LEVEL_LABELS: Record<string, string> = {
  'STANDARD_1': 'Standard 1',
  'STANDARD_2': 'Standard 2',
  'STANDARD_3': 'Standard 3',
  'STANDARD_4': 'Standard 4',
  'STANDARD_5': 'Standard 5',
  'STANDARD_6': 'Standard 6',
  'STANDARD_7': 'Standard 7',
  'FORM_1': 'Form 1',
  'FORM_2': 'Form 2',
  'FORM_3': 'Form 3',
  'FORM_4': 'Form 4',
  'FORM_5': 'Form 5',
  'FORM_6': 'Form 6',
  'KINDERGARTEN': 'Kindergarten',
  'PRE_KINDERGARTEN': 'Pre-Kindergarten'
};

// Curriculum type mapping from backend CurriculumType.java enum
export const CURRICULUM_TYPE_LABELS: Record<string, string> = {
  'NATIONAL': 'National',
  'REGIONAL': 'Regional',
  'SCHOOL_SPECIFIC': 'School-Specific',
  'INTERNATIONAL': 'International',
  'VOCATIONAL': 'Vocational',
  'SPECIAL_NEEDS': 'Special Needs'
};

// Curriculum status mapping from backend CurriculumStatus.java enum
export const CURRICULUM_STATUS_LABELS: Record<string, string> = {
  'DRAFT': 'Draft',
  'UNDER_REVIEW': 'Under Review',
  'APPROVED': 'Approved',
  'ACTIVE': 'Active',
  'SUSPENDED': 'Suspended',
  'ARCHIVED': 'Archived',
  'DEPRECATED': 'Deprecated'
};

/**
 * API service for fetching enum values from the backend
 */
const enumApi = {
  /**
   * Get all grade levels
   * @returns Response with grade level enum values
   */
  getGradeLevels: async (): Promise<AxiosResponse<EnumResponse>> => {
    return api.get('/enums/grade-levels');
  },

  /**
   * Get all curriculum types
   * @returns Response with curriculum type enum values
   */
  getCurriculumTypes: async (): Promise<AxiosResponse<EnumResponse>> => {
    return api.get('/enums/curriculum-types');
  },

  /**
   * Get all curriculum statuses
   * @returns Response with curriculum status enum values
   */
  getCurriculumStatuses: async (): Promise<AxiosResponse<EnumResponse>> => {
    return api.get('/enums/curriculum-statuses');
  },

  /**
   * Get all user roles
   * @returns Response with user role enum values
   */
  getUserRoles: async (): Promise<AxiosResponse<EnumResponse>> => {
    return api.get('/enums/user-roles');
  }
};

/**
 * Helper function to convert grade level enum values to options
 */
export const getGradeLevelOptions = (gradeLevels: string[]): GradeLevelOption[] => {
  return gradeLevels.map(level => ({
    value: level,
    label: GRADE_LEVEL_LABELS[level] || level
  }));
};

/**
 * Helper function to convert curriculum type enum values to options
 */
export const getCurriculumTypeOptions = (types: string[]): GradeLevelOption[] => {
  return types.map(type => ({
    value: type,
    label: CURRICULUM_TYPE_LABELS[type] || type
  }));
};

/**
 * Helper function to convert curriculum status enum values to options
 */
export const getCurriculumStatusOptions = (statuses: string[]): GradeLevelOption[] => {
  return statuses.map(status => ({
    value: status,
    label: CURRICULUM_STATUS_LABELS[status] || status
  }));
};

export default enumApi; 