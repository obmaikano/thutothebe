import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface SchoolMonitoring {
  id: number;
  schoolId: number;
  schoolName?: string;
  schoolCode?: string;
  monitoringDate: string;
  totalActiveTeachers?: number;
  totalActiveStudents?: number;
  totalLogins?: number;
  teacherLogins?: number;
  studentLogins?: number;
  adminLogins?: number;
  attendanceRate?: number;
  assignmentSubmissions?: number;
  assignmentsGraded?: number;
  averageGradingTurnaroundHours?: number;
  curriculumCompletionRate?: number;
  systemUptimePercentage?: number;
  peakUsageHour?: number;
  totalAnnouncements?: number;
  announcementsAcknowledged?: number;
  forumPosts?: number;
  quizSubmissions?: number;
  documentUploads?: number;
  documentDownloads?: number;
  averageSessionDuration?: number;
  uniqueActiveUsers?: number;
  complianceScore?: number;
  alertCount?: number;
  lastActivityTimestamp?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SchoolMonitoringResponse {
  status: string;
  message: string;
  data: SchoolMonitoring | SchoolMonitoring[] | null;
  timestamp: string | null;
}

/**
 * API service for interacting with school monitoring endpoints
 */
const schoolMonitoringApi = {
  /**
   * Get latest monitoring data by school ID
   * @param schoolId School ID
   * @returns Response with school monitoring data
   */
  getBySchool: async (schoolId: number): Promise<AxiosResponse<SchoolMonitoringResponse>> => {
    return api.get(`/monitoring/schools/school/${schoolId}`);
  },

  /**
   * Get monitoring data by school ID and date
   * @param schoolId School ID
   * @param date Monitoring date (YYYY-MM-DD)
   * @returns Response with school monitoring data
   */
  getBySchoolAndDate: async (schoolId: number, date: string): Promise<AxiosResponse<SchoolMonitoringResponse>> => {
    return api.get(`/monitoring/schools/school/${schoolId}/date/${date}`);
  },

  /**
   * Get monitoring data by school ID and date range
   * @param schoolId School ID
   * @param startDate Start date (YYYY-MM-DD)
   * @param endDate End date (YYYY-MM-DD)
   * @returns Response with school monitoring data array
   */
  getBySchoolAndDateRange: async (schoolId: number, startDate: string, endDate: string): Promise<AxiosResponse<SchoolMonitoringResponse>> => {
    return api.get(`/monitoring/schools/school/${schoolId}/date-range?startDate=${startDate}&endDate=${endDate}`);
  },

  /**
   * Get monitoring data for all schools in a region
   * @param regionId Region ID
   * @returns Response with school monitoring data array
   */
  getByRegion: async (regionId: number): Promise<AxiosResponse<SchoolMonitoringResponse>> => {
    return api.get(`/monitoring/schools/region/${regionId}`);
  },

  /**
   * Get monitoring data by region ID and date
   * @param regionId Region ID
   * @param date Monitoring date (YYYY-MM-DD)
   * @returns Response with school monitoring data array
   */
  getByRegionAndDate: async (regionId: number, date: string): Promise<AxiosResponse<SchoolMonitoringResponse>> => {
    return api.get(`/monitoring/schools/region/${regionId}/date/${date}`);
  },

  /**
   * Get monitoring data by date
   * @param date Monitoring date (YYYY-MM-DD)
   * @returns Response with school monitoring data array
   */
  getByDate: async (date: string): Promise<AxiosResponse<SchoolMonitoringResponse>> => {
    return api.get(`/monitoring/schools/date/${date}`);
  },

  /**
   * Get latest monitoring data for all schools
   * @returns Response with school monitoring data array
   */
  getLatestForAllSchools: async (): Promise<AxiosResponse<SchoolMonitoringResponse>> => {
    return api.get('/monitoring/schools/latest/all');
  },

  /**
   * Get schools with low attendance
   * @param threshold Attendance threshold
   * @param date Monitoring date (YYYY-MM-DD)
   * @returns Response with school monitoring data array
   */
  getSchoolsWithLowAttendance: async (threshold: number, date: string): Promise<AxiosResponse<SchoolMonitoringResponse>> => {
    return api.get(`/monitoring/schools/attendance/below-threshold?threshold=${threshold}&date=${date}`);
  },

  /**
   * Get schools with low usage
   * @param threshold Usage threshold
   * @param date Monitoring date (YYYY-MM-DD)
   * @returns Response with school monitoring data array
   */
  getSchoolsWithLowUsage: async (threshold: number, date: string): Promise<AxiosResponse<SchoolMonitoringResponse>> => {
    return api.get(`/monitoring/schools/usage/below-threshold?threshold=${threshold}&date=${date}`);
  },

  /**
   * Get schools with delayed grading
   * @param threshold Grading delay threshold (hours)
   * @param date Monitoring date (YYYY-MM-DD)
   * @returns Response with school monitoring data array
   */
  getSchoolsWithDelayedGrading: async (threshold: number, date: string): Promise<AxiosResponse<SchoolMonitoringResponse>> => {
    return api.get(`/monitoring/schools/grading/delayed?threshold=${threshold}&date=${date}`);
  },

  /**
   * Get schools with low compliance
   * @param threshold Compliance threshold
   * @param date Monitoring date (YYYY-MM-DD)
   * @returns Response with school monitoring data array
   */
  getSchoolsWithLowCompliance: async (threshold: number, date: string): Promise<AxiosResponse<SchoolMonitoringResponse>> => {
    return api.get(`/monitoring/schools/compliance/below-threshold?threshold=${threshold}&date=${date}`);
  },

  /**
   * Get schools with high alerts
   * @param threshold Alert count threshold
   * @param date Monitoring date (YYYY-MM-DD)
   * @returns Response with school monitoring data array
   */
  getSchoolsWithHighAlerts: async (threshold: number, date: string): Promise<AxiosResponse<SchoolMonitoringResponse>> => {
    return api.get(`/monitoring/schools/alerts/high?threshold=${threshold}&date=${date}`);
  },

  /**
   * Calculate compliance score for school
   * @param schoolId School ID
   * @param date Monitoring date (YYYY-MM-DD)
   * @returns Response with compliance score
   */
  calculateComplianceScore: async (schoolId: number, date: string): Promise<AxiosResponse<{ data: number }>> => {
    return api.get(`/monitoring/schools/compliance/school/${schoolId}?date=${date}`);
  },

  /**
   * Update monitoring data for school
   * @param schoolId School ID
   * @param date Monitoring date (YYYY-MM-DD)
   * @returns Response indicating success/failure
   */
  updateSchoolMonitoring: async (schoolId: number, date: string): Promise<AxiosResponse<void>> => {
    return api.post(`/monitoring/schools/update/school/${schoolId}?date=${date}`);
  },

  /**
   * Generate monitoring data for school
   * @param schoolId School ID
   * @param date Monitoring date (YYYY-MM-DD)
   * @returns Response with generated monitoring data
   */
  generateMonitoringData: async (schoolId: number, date: string): Promise<AxiosResponse<SchoolMonitoringResponse>> => {
    return api.post(`/monitoring/schools/generate/school/${schoolId}?date=${date}`);
  },

  /**
   * Generate monitoring data for all schools
   * @param date Monitoring date (YYYY-MM-DD)
   * @returns Response indicating success/failure
   */
  generateForAllSchools: async (date: string): Promise<AxiosResponse<void>> => {
    return api.post(`/monitoring/schools/generate/all?date=${date}`);
  },
};

export default schoolMonitoringApi; 