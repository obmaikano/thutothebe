import { api } from '../index';
import { AxiosResponse } from 'axios';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export interface AnalyticsData {
  courseId?: number;
  studentId?: number;
  timeframe: 'WEEK' | 'MONTH' | 'TERM' | 'YEAR';
  metrics: {
    averagePerformance: number;
    performanceDistribution: Array<{
      range: string;
      count: number;
      percentage: number;
    }>;
    trendAnalysis: {
      direction: 'UP' | 'DOWN' | 'STABLE';
      percentage: number;
      significance: 'HIGH' | 'MEDIUM' | 'LOW';
    };
    comparativeData: {
      classAverage: number;
      schoolAverage: number;
      nationalAverage?: number;
    };
    predictiveInsights: {
      projectedGrade: number;
      riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
      interventionRecommendations: string[];
    };
  };
  charts: {
    performanceTrend: Array<{
      date: string;
      value: number;
      benchmark?: number;
    }>;
    subjectBreakdown: Array<{
      subject: string;
      score: number;
      weight: number;
    }>;
    skillsRadar: Array<{
      skill: string;
      current: number;
      target: number;
    }>;
  };
}

export interface AnalyticsResponse {
  status: string;
  message: string;
  data: AnalyticsData | AnalyticsData[] | null;
  timestamp: string | null;
}

interface DashboardParams {
  timeframe: 'WEEK' | 'MONTH' | 'TERM' | 'YEAR';
  schoolId?: number;
  regionId?: number;
  courseId?: number;
  curriculumId: number;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  usersByRole: Record<string, number>;
  todayActive: number;
  weeklyActive: number;
  monthlyActive: number;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

/**
 * API service for interacting with analytics endpoints
 */
const analyticsApi = {
  /**
   * Get analytics dashboard data
   * @param params Dashboard parameters
   * @returns Response with dashboard analytics
   */
  getDashboardData: async (params: DashboardParams): Promise<AxiosResponse> => {
    return api.get(`/curriculum/${params.curriculumId}/analytics/dashboard`, {
      params: {
        timeframe: params.timeframe,
        schoolId: params.schoolId,
        regionId: params.regionId,
        courseId: params.courseId
      }
    });
  },

  /**
   * Get performance analytics for a student
   * @param studentId Student ID
   * @param params Additional parameters
   * @returns Response with student analytics
   */
  getStudentAnalytics: async (
    studentId: number,
    params?: {
      timeframe?: 'WEEK' | 'MONTH' | 'TERM' | 'YEAR';
      courseId?: number;
    }
  ): Promise<AxiosResponse<AnalyticsResponse>> => {
    return api.get(`/analytics/student/${studentId}`, { params });
  },

  /**
   * Get performance analytics for a course
   * @param courseId Course ID
   * @param params Additional parameters
   * @returns Response with course analytics
   */
  getCourseAnalytics: async (
    courseId: number,
    params?: {
      timeframe?: 'WEEK' | 'MONTH' | 'TERM' | 'YEAR';
    }
  ): Promise<AxiosResponse<AnalyticsResponse>> => {
    return api.get(`/analytics/course/${courseId}`, { params });
  },

  /**
   * Get class performance analytics
   * @param classId Class ID
   * @param params Additional parameters
   * @returns Response with class analytics
   */
  getClassAnalytics: async (
    classId: number,
    params?: {
      timeframe?: 'WEEK' | 'MONTH' | 'TERM' | 'YEAR';
    }
  ): Promise<AxiosResponse<AnalyticsResponse>> => {
    return api.get(`/analytics/class/${classId}`, { params });
  },

  /**
   * Get school performance analytics
   * @param schoolId School ID
   * @param params Additional parameters
   * @returns Response with school analytics
   */
  getSchoolAnalytics: async (
    schoolId: number,
    params?: {
      timeframe?: 'WEEK' | 'MONTH' | 'TERM' | 'YEAR';
    }
  ): Promise<AxiosResponse<AnalyticsResponse>> => {
    return api.get(`/analytics/school/${schoolId}`, { params });
  },

  /**
   * Get comparative analytics
   * @param params Comparison parameters
   * @returns Response with comparative analytics
   */
  getComparativeAnalytics: async (params: {
    type: 'STUDENT' | 'COURSE' | 'CLASS' | 'SCHOOL';
    ids: number[];
    timeframe?: 'WEEK' | 'MONTH' | 'TERM' | 'YEAR';
  }): Promise<AxiosResponse<AnalyticsResponse>> => {
    return api.get('/analytics/compare', { params });
  },

  /**
   * Get trend analytics
   * @param params Trend parameters
   * @returns Response with trend analytics
   */
  getTrendAnalytics: async (params: {
    type: 'STUDENT' | 'COURSE' | 'CLASS' | 'SCHOOL';
    id: number;
    startDate: string;
    endDate: string;
  }): Promise<AxiosResponse<AnalyticsResponse>> => {
    return api.get('/analytics/trends', { params });
  },

  /**
   * Export analytics data
   * @param params Export parameters
   * @returns Response with export data/link
   */
  exportAnalytics: async (params: {
    type: 'STUDENT' | 'COURSE' | 'CLASS' | 'SCHOOL';
    id: number;
    format: 'PDF' | 'EXCEL' | 'CSV';
    timeframe?: 'WEEK' | 'MONTH' | 'TERM' | 'YEAR';
  }): Promise<AxiosResponse<{ downloadUrl: string }>> => {
    return api.post('/analytics/export', params);
  },

  /**
   * Get user statistics
   * @returns Response with user statistics
   */
  getUserStats: async () => {
    return api.get<ApiResponse<UserStats>>('/api/analytics/users/stats');
  },
};

export default analyticsApi; 