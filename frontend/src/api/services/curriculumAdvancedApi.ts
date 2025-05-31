import { api } from '../index';
import { AxiosResponse } from 'axios';

// ==================== INTERFACES ====================

export interface CurriculumVersionDTO {
  id: number;
  curriculumId: number;
  versionName: string;
  description?: string;
  versionNumber: string;
  isMajorVersion: boolean;
  createdById: number;
  createdByName?: string;
  createdAt: string;
  isActive: boolean;
  changeLog?: string;
}

export interface CurriculumComparisonDTO {
  sourceVersionId: number;
  targetVersionId: number;
  comparedById: number;
  comparedByName?: string;
  comparedAt: string;
  differences: {
    field: string;
    sourceValue: any;
    targetValue: any;
    changeType: 'ADDED' | 'REMOVED' | 'MODIFIED';
  }[];
  summary: {
    totalChanges: number;
    addedFields: number;
    removedFields: number;
    modifiedFields: number;
  };
}

export interface CurriculumResourceDTO {
  id: number;
  curriculumId: number;
  title: string;
  description?: string;
  resourceType: 'DOCUMENT' | 'VIDEO' | 'AUDIO' | 'IMAGE' | 'LINK' | 'INTERACTIVE' | 'ASSESSMENT' | 'LESSON_PLAN';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  unitId?: number;
  topicId?: number;
  uploadedById: number;
  uploadedByName?: string;
  uploadedAt: string;
  accessCount: number;
  isPublic: boolean;
  tags?: string[];
  metadata?: string;
}

export interface CurriculumAnalyticsDTO {
  id: number;
  curriculumId: number;
  analyticsType: 'IMPLEMENTATION_PROGRESS' | 'PERFORMANCE_ANALYSIS' | 'RESOURCE_UTILIZATION' | 'TEACHER_EFFECTIVENESS' | 'STUDENT_OUTCOMES';
  aggregationLevel: 'NATIONAL' | 'REGIONAL' | 'SCHOOL' | 'CLASS' | 'INDIVIDUAL';
  schoolId?: number;
  regionId?: number;
  generatedById: number;
  generatedAt: string;
  data: any;
  summary: {
    totalMetrics: number;
    keyInsights: string[];
    recommendations: string[];
  };
}

export interface CurriculumAssessmentDTO {
  id: number;
  curriculumId: number;
  assessmentId: number;
  assessmentTitle?: string;
  unitId?: number;
  topicId?: number;
  alignmentType: 'FORMATIVE' | 'SUMMATIVE' | 'DIAGNOSTIC';
  weightage: number;
  linkedById: number;
  linkedAt: string;
  isActive: boolean;
}

export interface CurriculumIntegrationDTO {
  id: number;
  curriculumId: number;
  integrationType: 'LMS' | 'SIS' | 'ASSESSMENT_PLATFORM' | 'CONTENT_REPOSITORY' | 'ANALYTICS_PLATFORM';
  systemName: string;
  endpoint: string;
  authMethod: 'API_KEY' | 'OAUTH' | 'BASIC_AUTH' | 'TOKEN';
  syncDirection: 'INBOUND' | 'OUTBOUND' | 'BIDIRECTIONAL';
  syncFrequency: 'REAL_TIME' | 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MANUAL';
  isActive: boolean;
  lastSyncAt?: string;
  nextSyncAt?: string;
  configuredById: number;
  configuredAt: string;
  errorCount: number;
  successCount: number;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
  timestamp: string | null;
}

// ==================== API SERVICE ====================

const curriculumAdvancedApi = {
  // ==================== VERSION CONTROL ====================
  
  /**
   * Create a new curriculum version
   */
  createVersion: async (
    curriculumId: number,
    versionName: string,
    description?: string,
    isMajorVersion: boolean = false,
    createdById: number = 1
  ): Promise<AxiosResponse<ApiResponse<CurriculumVersionDTO>>> => {
    const params = new URLSearchParams({
      versionName,
      isMajorVersion: isMajorVersion.toString(),
      createdById: createdById.toString()
    });
    if (description) params.append('description', description);
    
    return api.post(`/curriculum-advanced/${curriculumId}/versions?${params.toString()}`);
  },

  /**
   * Get all versions of a curriculum
   */
  getVersions: async (curriculumId: number): Promise<AxiosResponse<ApiResponse<CurriculumVersionDTO[]>>> => {
    return api.get(`/curriculum-advanced/${curriculumId}/versions`);
  },

  /**
   * Compare two curriculum versions
   */
  compareVersions: async (
    sourceVersionId: number,
    targetVersionId: number,
    comparedById: number
  ): Promise<AxiosResponse<ApiResponse<CurriculumComparisonDTO>>> => {
    return api.post(`/curriculum-advanced/versions/${sourceVersionId}/compare/${targetVersionId}?comparedById=${comparedById}`);
  },

  // ==================== RESOURCE MANAGEMENT ====================

  /**
   * Upload a resource to curriculum
   */
  uploadResource: async (
    curriculumId: number,
    file: File | null,
    resourceData: Omit<CurriculumResourceDTO, 'id' | 'uploadedAt' | 'accessCount'>
  ): Promise<AxiosResponse<ApiResponse<CurriculumResourceDTO>>> => {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    
    // Send resource data as JSON in the request body
    return api.post(`/curriculum-advanced/${curriculumId}/resources`, resourceData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },

  /**
   * Get all resources for a curriculum
   */
  getResources: async (
    curriculumId: number,
    resourceType?: string,
    unitId?: number,
    topicId?: number
  ): Promise<AxiosResponse<ApiResponse<CurriculumResourceDTO[]>>> => {
    const params = new URLSearchParams();
    if (resourceType) params.append('resourceType', resourceType);
    if (unitId) params.append('unitId', unitId.toString());
    if (topicId) params.append('topicId', topicId.toString());
    
    const queryString = params.toString();
    return api.get(`/curriculum-advanced/${curriculumId}/resources${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Track resource access
   */
  trackResourceAccess: async (
    resourceId: number,
    accessedById: number
  ): Promise<AxiosResponse<ApiResponse<any>>> => {
    return api.post(`/curriculum-advanced/resources/${resourceId}/access?accessedById=${accessedById}`);
  },

  // ==================== ANALYTICS ====================

  /**
   * Generate curriculum analytics
   */
  generateAnalytics: async (
    curriculumId: number,
    analyticsType: CurriculumAnalyticsDTO['analyticsType'],
    aggregationLevel: CurriculumAnalyticsDTO['aggregationLevel'],
    schoolId?: number,
    regionId?: number,
    generatedById: number = 1
  ): Promise<AxiosResponse<ApiResponse<CurriculumAnalyticsDTO>>> => {
    const params = new URLSearchParams({
      analyticsType,
      aggregationLevel,
      generatedById: generatedById.toString()
    });
    if (schoolId) params.append('schoolId', schoolId.toString());
    if (regionId) params.append('regionId', regionId.toString());
    
    const url = `/curriculum-advanced/${curriculumId}/analytics/generate?${params.toString()}`;
    console.log('Calling generateAnalytics API:', url);
    console.log('Parameters:', { curriculumId, analyticsType, aggregationLevel, schoolId, regionId, generatedById });
    
    return api.post(url);
  },

  /**
   * Get dashboard analytics for curriculum
   */
  getDashboardAnalytics: async (
    curriculumId: number,
    level: CurriculumAnalyticsDTO['aggregationLevel'],
    schoolId?: number,
    teacherId?: number
  ): Promise<AxiosResponse<ApiResponse<Record<string, any>>>> => {
    const params = new URLSearchParams({ level });
    if (schoolId) params.append('schoolId', schoolId.toString());
    if (teacherId) params.append('teacherId', teacherId.toString());
    
    const url = `/curriculum-advanced/${curriculumId}/analytics/dashboard?${params.toString()}`;
    console.log('Calling getDashboardAnalytics API:', url);
    console.log('Parameters:', { curriculumId, level, schoolId, teacherId });
    
    return api.get(url);
  },

  /**
   * Get real-time analytics for curriculum
   */
  getRealTimeAnalytics: async (
    curriculumId: number,
    schoolId?: number,
    regionId?: number
  ): Promise<AxiosResponse<ApiResponse<Record<string, any>>>> => {
    const params = new URLSearchParams();
    if (schoolId) params.append('schoolId', schoolId.toString());
    if (regionId) params.append('regionId', regionId.toString());
    
    const queryString = params.toString();
    const url = `/curriculum-advanced/${curriculumId}/analytics/real-time${queryString ? `?${queryString}` : ''}`;
    console.log('Calling getRealTimeAnalytics API:', url);
    console.log('Parameters:', { curriculumId, schoolId, regionId });
    
    return api.get(url);
  },

  /**
   * Get trend analytics for curriculum
   */
  getTrendAnalytics: async (
    curriculumId: number,
    startDate: string,
    endDate: string,
    metric: string
  ): Promise<AxiosResponse<ApiResponse<Record<string, any>[]>>> => {
    const params = new URLSearchParams({
      startDate,
      endDate,
      metric
    });
    
    const url = `/curriculum-advanced/${curriculumId}/analytics/trends?${params.toString()}`;
    console.log('Calling getTrendAnalytics API:', url);
    console.log('Parameters:', { curriculumId, startDate, endDate, metric });
    
    return api.get(url);
  },

  // ==================== ASSESSMENT INTEGRATION ====================

  /**
   * Link assessment to curriculum
   */
  linkAssessment: async (
    curriculumId: number,
    assessmentData: Omit<CurriculumAssessmentDTO, 'id' | 'linkedAt'>
  ): Promise<AxiosResponse<ApiResponse<CurriculumAssessmentDTO>>> => {
    return api.post(`/curriculum-advanced/${curriculumId}/assessments/link`, assessmentData);
  },

  /**
   * Get linked assessments for curriculum
   */
  getLinkedAssessments: async (
    curriculumId: number,
    unitId?: number,
    topicId?: number
  ): Promise<AxiosResponse<ApiResponse<CurriculumAssessmentDTO[]>>> => {
    const params = new URLSearchParams();
    if (unitId) params.append('unitId', unitId.toString());
    if (topicId) params.append('topicId', topicId.toString());
    
    const queryString = params.toString();
    return api.get(`/curriculum-advanced/${curriculumId}/assessments${queryString ? `?${queryString}` : ''}`);
  },

  // ==================== EXTERNAL INTEGRATIONS ====================

  /**
   * Configure external system integration
   */
  configureIntegration: async (
    curriculumId: number,
    integrationData: Omit<CurriculumIntegrationDTO, 'id' | 'configuredAt' | 'lastSyncAt' | 'nextSyncAt' | 'errorCount' | 'successCount'>
  ): Promise<AxiosResponse<ApiResponse<CurriculumIntegrationDTO>>> => {
    return api.post(`/curriculum-advanced/${curriculumId}/integrations`, integrationData);
  },

  /**
   * Trigger manual synchronization
   */
  triggerSync: async (
    integrationId: number,
    triggeredById: number
  ): Promise<AxiosResponse<ApiResponse<Record<string, any>>>> => {
    return api.post(`/curriculum-advanced/integrations/${integrationId}/sync?triggeredById=${triggeredById}`);
  },

  /**
   * Get integration configurations for curriculum
   */
  getIntegrations: async (curriculumId: number): Promise<AxiosResponse<ApiResponse<CurriculumIntegrationDTO[]>>> => {
    return api.get(`/curriculum-advanced/${curriculumId}/integrations`);
  },
};

export default curriculumAdvancedApi; 