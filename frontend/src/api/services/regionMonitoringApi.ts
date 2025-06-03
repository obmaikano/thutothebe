import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface RegionMonitoring {
  id: number;
  regionId: number;
  regionName?: string;
  regionCode?: string;
  monitoringDate: string;
  totalSchools?: number;
  activeSchools?: number;
  totalTeachers?: number;
  totalStudents?: number;
  totalLogins?: number;
  averageAttendanceRate?: number;
  totalAssignmentSubmissions?: number;
  totalAssignmentsGraded?: number;
  averageGradingTurnaroundHours?: number;
  averageCurriculumCompletionRate?: number;
  averageSystemUptimePercentage?: number;
  schoolsWithLowUsage?: number;
  schoolsWithDelayedGrading?: number;
  schoolsWithIrregularAttendance?: number;
  totalAlerts?: number;
  highPerformingSchools?: number;
  lowPerformingSchools?: number;
  averageComplianceScore?: number;
  resourceUtilizationRate?: number;
  lastUpdated?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegionMonitoringResponse {
  status: string;
  message: string;
  data: RegionMonitoring | RegionMonitoring[] | null;
  timestamp: string | null;
}

/**
 * API service for interacting with region monitoring endpoints
 */
const regionMonitoringApi = {
  /**
   * Get latest monitoring data by region ID
   * @param regionId Region ID
   * @returns Response with region monitoring data
   */
  getByRegion: async (regionId: number): Promise<AxiosResponse<RegionMonitoringResponse>> => {
    return api.get(`/monitoring/regions/region/${regionId}`);
  },

  /**
   * Get monitoring data by region ID and date
   * @param regionId Region ID
   * @param date Monitoring date (YYYY-MM-DD)
   * @returns Response with region monitoring data
   */
  getByRegionAndDate: async (regionId: number, date: string): Promise<AxiosResponse<RegionMonitoringResponse>> => {
    return api.get(`/monitoring/regions/region/${regionId}/date/${date}`);
  },

  /**
   * Get monitoring data by region ID and date range
   * @param regionId Region ID
   * @param startDate Start date (YYYY-MM-DD)
   * @param endDate End date (YYYY-MM-DD)
   * @returns Response with region monitoring data array
   */
  getByRegionAndDateRange: async (regionId: number, startDate: string, endDate: string): Promise<AxiosResponse<RegionMonitoringResponse>> => {
    return api.get(`/monitoring/regions/region/${regionId}/date-range?startDate=${startDate}&endDate=${endDate}`);
  },

  /**
   * Get monitoring data by date
   * @param date Monitoring date (YYYY-MM-DD)
   * @returns Response with region monitoring data array
   */
  getByDate: async (date: string): Promise<AxiosResponse<RegionMonitoringResponse>> => {
    return api.get(`/monitoring/regions/date/${date}`);
  },

  /**
   * Get monitoring data by date range
   * @param startDate Start date (YYYY-MM-DD)
   * @param endDate End date (YYYY-MM-DD)
   * @param page Page number (optional)
   * @param size Page size (optional)
   * @returns Response with paginated region monitoring data
   */
  getByDateRange: async (startDate: string, endDate: string, page?: number, size?: number): Promise<AxiosResponse<RegionMonitoringResponse>> => {
    const params = new URLSearchParams();
    params.append('startDate', startDate);
    params.append('endDate', endDate);
    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());
    return api.get(`/monitoring/regions/date-range?${params.toString()}`);
  },

  /**
   * Get regions with attendance below threshold
   * @param threshold Attendance threshold
   * @param date Monitoring date (YYYY-MM-DD)
   * @returns Response with region monitoring data array
   */
  getRegionsWithLowAttendance: async (threshold: number, date: string): Promise<AxiosResponse<RegionMonitoringResponse>> => {
    return api.get(`/monitoring/regions/attendance/below-threshold?threshold=${threshold}&date=${date}`);
  },

  /**
   * Get regions with low usage schools
   * @param threshold Usage threshold
   * @param date Monitoring date (YYYY-MM-DD)
   * @returns Response with region monitoring data array
   */
  getRegionsWithLowUsageSchools: async (threshold: number, date: string): Promise<AxiosResponse<RegionMonitoringResponse>> => {
    return api.get(`/monitoring/regions/usage/below-threshold?threshold=${threshold}&date=${date}`);
  },

  /**
   * Get regions with low compliance
   * @param threshold Compliance threshold
   * @param date Monitoring date (YYYY-MM-DD)
   * @returns Response with region monitoring data array
   */
  getRegionsWithLowCompliance: async (threshold: number, date: string): Promise<AxiosResponse<RegionMonitoringResponse>> => {
    return api.get(`/monitoring/regions/performance/below-threshold?threshold=${threshold}&date=${date}`);
  },

  /**
   * Get regions with high alerts
   * @param threshold Alert count threshold
   * @param date Monitoring date (YYYY-MM-DD)
   * @returns Response with region monitoring data array
   */
  getRegionsWithHighAlerts: async (threshold: number, date: string): Promise<AxiosResponse<RegionMonitoringResponse>> => {
    return api.get(`/monitoring/regions/alerts/high?threshold=${threshold}&date=${date}`);
  },

  /**
   * Get top performing regions
   * @param threshold Performance threshold
   * @param date Monitoring date (YYYY-MM-DD)
   * @returns Response with region monitoring data array
   */
  getTopPerformingRegions: async (threshold: number, date: string): Promise<AxiosResponse<RegionMonitoringResponse>> => {
    return api.get(`/monitoring/regions/top-performing?threshold=${threshold}&date=${date}`);
  },

  /**
   * Get underperforming regions
   * @param threshold Performance threshold
   * @param date Monitoring date (YYYY-MM-DD)
   * @returns Response with region monitoring data array
   */
  getUnderperformingRegions: async (threshold: number, date: string): Promise<AxiosResponse<RegionMonitoringResponse>> => {
    return api.get(`/monitoring/regions/underperforming?threshold=${threshold}&date=${date}`);
  },

  /**
   * Get latest monitoring data for all regions
   * @returns Response with region monitoring data array
   */
  getLatestForAllRegions: async (): Promise<AxiosResponse<RegionMonitoringResponse>> => {
    return api.get('/monitoring/regions/latest/all');
  },

  /**
   * Get national average attendance rate
   * @param date Monitoring date (YYYY-MM-DD)
   * @returns Response with national average attendance rate
   */
  getNationalAverageAttendanceRate: async (date: string): Promise<AxiosResponse<{ data: number }>> => {
    return api.get(`/monitoring/regions/national/average-attendance?date=${date}`);
  },

  /**
   * Get national average compliance score
   * @param date Monitoring date (YYYY-MM-DD)
   * @returns Response with national average compliance score
   */
  getNationalAverageComplianceScore: async (date: string): Promise<AxiosResponse<{ data: number }>> => {
    return api.get(`/monitoring/regions/national/average-compliance?date=${date}`);
  },

  /**
   * Get total schools nationally
   * @param date Monitoring date (YYYY-MM-DD)
   * @returns Response with total schools count
   */
  getTotalSchoolsNationally: async (date: string): Promise<AxiosResponse<{ data: number }>> => {
    return api.get(`/monitoring/regions/national/total-schools?date=${date}`);
  },

  /**
   * Get total teachers nationally
   * @param date Monitoring date (YYYY-MM-DD)
   * @returns Response with total teachers count
   */
  getTotalTeachersNationally: async (date: string): Promise<AxiosResponse<{ data: number }>> => {
    return api.get(`/monitoring/regions/national/total-teachers?date=${date}`);
  },

  /**
   * Get total students nationally
   * @param date Monitoring date (YYYY-MM-DD)
   * @returns Response with total students count
   */
  getTotalStudentsNationally: async (date: string): Promise<AxiosResponse<{ data: number }>> => {
    return api.get(`/monitoring/regions/national/total-students?date=${date}`);
  },

  /**
   * Update monitoring data for region
   * @param regionId Region ID
   * @param date Monitoring date (YYYY-MM-DD)
   * @returns Response indicating success/failure
   */
  updateRegionMonitoring: async (regionId: number, date: string): Promise<AxiosResponse<void>> => {
    return api.post(`/monitoring/regions/update/region/${regionId}?date=${date}`);
  },

  /**
   * Generate monitoring data for region
   * @param regionId Region ID
   * @param date Monitoring date (YYYY-MM-DD)
   * @returns Response with generated monitoring data
   */
  generateMonitoringData: async (regionId: number, date: string): Promise<AxiosResponse<RegionMonitoringResponse>> => {
    return api.post(`/monitoring/regions/generate/region/${regionId}?date=${date}`);
  },

  /**
   * Generate monitoring data for all regions
   * @param date Monitoring date (YYYY-MM-DD)
   * @returns Response indicating success/failure
   */
  generateForAllRegions: async (date: string): Promise<AxiosResponse<void>> => {
    return api.post(`/monitoring/regions/generate/all?date=${date}`);
  },
};

export default regionMonitoringApi; 