import { api } from '../index';
import { AxiosResponse } from 'axios';

// ==================== INTERFACES ====================

export interface CurriculumProgressDTO {
  id: number;
  curriculumId: number;
  curriculumTitle?: string;
  schoolId: number;
  schoolName?: string;
  regionId?: number;
  regionName?: string;
  implementationStatus: 'NOT_STARTED' | 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';
  progressPercentage: number;
  startDate: string;
  expectedEndDate: string;
  actualEndDate?: string;
  assignedTeacherId?: number;
  assignedTeacherName?: string;
  supervisorId?: number;
  supervisorName?: string;
  notes?: string;
  challenges?: string;
  achievements?: string;
  resourcesNeeded?: string;
  lastUpdatedById: number;
  lastUpdatedByName?: string;
  createdAt: string;
  updatedAt: string;
  isOverdue: boolean;
  daysOverdue?: number;
  milestones?: {
    id: number;
    title: string;
    description?: string;
    targetDate: string;
    completedDate?: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
    progressPercentage: number;
  }[];
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
  timestamp: string | null;
}

// ==================== API SERVICE ====================

const curriculumProgressApi = {
  /**
   * Get all curriculum progress records
   */
  getAll: async (): Promise<AxiosResponse<ApiResponse<CurriculumProgressDTO[]>>> => {
    return api.get('/curriculum-progress');
  },

  /**
   * Get curriculum progress by ID
   */
  getById: async (id: number): Promise<AxiosResponse<ApiResponse<CurriculumProgressDTO>>> => {
    return api.get(`/curriculum-progress/${id}`);
  },

  /**
   * Create new curriculum progress record
   */
  create: async (progressData: Omit<CurriculumProgressDTO, 'id' | 'createdAt' | 'updatedAt' | 'isOverdue' | 'daysOverdue' | 'curriculumTitle' | 'schoolName' | 'regionName' | 'assignedTeacherName' | 'supervisorName' | 'lastUpdatedByName'>): Promise<AxiosResponse<ApiResponse<CurriculumProgressDTO>>> => {
    return api.post('/curriculum-progress', progressData);
  },

  /**
   * Update curriculum progress record
   */
  update: async (id: number, progressData: Partial<CurriculumProgressDTO>): Promise<AxiosResponse<ApiResponse<CurriculumProgressDTO>>> => {
    return api.put(`/curriculum-progress/${id}`, progressData);
  },

  /**
   * Delete curriculum progress record
   */
  delete: async (id: number): Promise<AxiosResponse<ApiResponse<any>>> => {
    return api.delete(`/curriculum-progress/${id}`);
  },

  /**
   * Get progress for a specific curriculum
   */
  getByCurriculumId: async (curriculumId: number): Promise<AxiosResponse<ApiResponse<CurriculumProgressDTO[]>>> => {
    return api.get(`/curriculum-progress/curriculum/${curriculumId}`);
  },

  /**
   * Get progress for a specific school
   */
  getBySchoolId: async (schoolId: number): Promise<AxiosResponse<ApiResponse<CurriculumProgressDTO[]>>> => {
    return api.get(`/curriculum-progress/school/${schoolId}`);
  },

  /**
   * Get overdue curriculum implementations
   */
  getOverdueProgress: async (date?: string): Promise<AxiosResponse<ApiResponse<CurriculumProgressDTO[]>>> => {
    const params = date ? `?date=${date}` : '';
    return api.get(`/curriculum-progress/overdue${params}`);
  },

  /**
   * Update implementation status
   */
  updateImplementationStatus: async (
    progressId: number,
    status: CurriculumProgressDTO['implementationStatus'],
    progressPercentage?: number,
    updatedById: number = 1
  ): Promise<AxiosResponse<ApiResponse<CurriculumProgressDTO>>> => {
    const params = new URLSearchParams({
      status,
      updatedById: updatedById.toString()
    });
    if (progressPercentage !== undefined) {
      params.append('progressPercentage', progressPercentage.toString());
    }
    
    return api.post(`/curriculum-progress/${progressId}/update-status?${params.toString()}`);
  },

  // ==================== ADDITIONAL HELPER METHODS ====================

  /**
   * Get progress summary for a curriculum
   */
  getProgressSummary: async (curriculumId: number): Promise<{
    totalSchools: number;
    completedSchools: number;
    inProgressSchools: number;
    notStartedSchools: number;
    overdueSchools: number;
    averageProgress: number;
  }> => {
    const response = await curriculumProgressApi.getByCurriculumId(curriculumId);
    const progressData = response.data.data;
    
    const summary = {
      totalSchools: progressData.length,
      completedSchools: progressData.filter(p => p.implementationStatus === 'COMPLETED').length,
      inProgressSchools: progressData.filter(p => p.implementationStatus === 'IN_PROGRESS').length,
      notStartedSchools: progressData.filter(p => p.implementationStatus === 'NOT_STARTED').length,
      overdueSchools: progressData.filter(p => p.isOverdue).length,
      averageProgress: progressData.length > 0 
        ? progressData.reduce((sum, p) => sum + p.progressPercentage, 0) / progressData.length 
        : 0
    };
    
    return summary;
  },

  /**
   * Get progress by region
   */
  getProgressByRegion: async (regionId: number): Promise<AxiosResponse<ApiResponse<CurriculumProgressDTO[]>>> => {
    // This would need to be implemented on the backend or filtered client-side
    const response = await curriculumProgressApi.getAll();
    const filteredData = response.data.data.filter(p => p.regionId === regionId);
    
    return {
      ...response,
      data: {
        ...response.data,
        data: filteredData
      }
    };
  },

  /**
   * Get progress statistics for dashboard
   */
  getProgressStatistics: async (): Promise<{
    totalImplementations: number;
    completedImplementations: number;
    inProgressImplementations: number;
    overdueImplementations: number;
    averageCompletionTime: number;
    successRate: number;
  }> => {
    const response = await curriculumProgressApi.getAll();
    const allProgress = response.data.data;
    
    const completed = allProgress.filter(p => p.implementationStatus === 'COMPLETED');
    const inProgress = allProgress.filter(p => p.implementationStatus === 'IN_PROGRESS');
    const overdue = allProgress.filter(p => p.isOverdue);
    
    // Calculate average completion time for completed implementations
    const completionTimes = completed
      .filter(p => p.actualEndDate)
      .map(p => {
        const start = new Date(p.startDate);
        const end = new Date(p.actualEndDate!);
        return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)); // days
      });
    
    const averageCompletionTime = completionTimes.length > 0
      ? completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length
      : 0;
    
    const successRate = allProgress.length > 0
      ? (completed.length / allProgress.length) * 100
      : 0;
    
    return {
      totalImplementations: allProgress.length,
      completedImplementations: completed.length,
      inProgressImplementations: inProgress.length,
      overdueImplementations: overdue.length,
      averageCompletionTime: Math.round(averageCompletionTime),
      successRate: Math.round(successRate * 100) / 100
    };
  }
};

export default curriculumProgressApi; 