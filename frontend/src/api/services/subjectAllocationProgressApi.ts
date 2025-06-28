import { api } from '../index';
import { AxiosResponse } from 'axios';

// ==================== INTERFACES ====================

export interface CourseProgressData {
  courseId: number;
  totalLessons: number;
  completedLessons: number;
  inProgressLessons: number;
  totalAssessments: number;
  completedAssessments: number;
  averageProgress: number;
  averageScore: number;
  completionRate: number;
  lastActivityDate?: string;
}

export interface SubjectAllocationProgressResponse {
  status: string;
  message: string;
  data: CourseProgressData;
  errors?: string[];
}

export interface SubjectAllocationProgressListResponse {
  status: string;
  message: string;
  data: CourseProgressData[];
  errors?: string[];
}

export interface TeacherWorkloadData {
  teacherId: number;
  teacherName: string;
  totalCourses: number;
  totalLessons: number;
  completedLessons: number;
  averageProgress: number;
  averageScore: number;
  workloadLevel: 'LIGHT' | 'MODERATE' | 'HEAVY';
  lastActivityDate?: string;
}

export interface TeacherWorkloadResponse {
  status: string;
  message: string;
  data: TeacherWorkloadData[];
  errors?: string[];
}

// ==================== API SERVICE ====================

const subjectAllocationProgressApi = {
  /**
   * Get progress data for a specific course
   * @param courseId Course ID
   * @returns Response with course progress data
   */
  getCourseProgress: async (courseId: number): Promise<AxiosResponse<SubjectAllocationProgressResponse>> => {
    return api.get(`/subject-allocation/course/${courseId}/progress`);
  },

  /**
   * Get progress data for multiple courses
   * @param courseIds Array of course IDs
   * @returns Response with course progress data for multiple courses
   */
  getMultipleCoursesProgress: async (courseIds: number[]): Promise<AxiosResponse<SubjectAllocationProgressListResponse>> => {
    return api.post('/subject-allocation/courses/progress', { courseIds });
  },

  /**
   * Get progress data for all courses
   * @returns Response with progress data for all courses
   */
  getAllCoursesProgress: async (): Promise<AxiosResponse<SubjectAllocationProgressListResponse>> => {
    return api.get('/subject-allocation/courses/progress');
  },

  /**
   * Get teacher workload data
   * @param teacherId Teacher ID (optional, if not provided returns all teachers)
   * @returns Response with teacher workload data
   */
  getTeacherWorkload: async (teacherId?: number): Promise<AxiosResponse<TeacherWorkloadResponse>> => {
    const url = teacherId 
      ? `/subject-allocation/teacher/${teacherId}/workload`
      : '/subject-allocation/teachers/workload';
    return api.get(url);
  },

  /**
   * Get progress data for courses by teacher
   * @param teacherId Teacher ID
   * @returns Response with course progress data for teacher's courses
   */
  getTeacherCoursesProgress: async (teacherId: number): Promise<AxiosResponse<SubjectAllocationProgressListResponse>> => {
    return api.get(`/subject-allocation/teacher/${teacherId}/courses/progress`);
  },

  /**
   * Get progress data for courses by class
   * @param classId Class ID
   * @returns Response with course progress data for class courses
   */
  getClassCoursesProgress: async (classId: number): Promise<AxiosResponse<SubjectAllocationProgressListResponse>> => {
    return api.get(`/subject-allocation/class/${classId}/courses/progress`);
  },

  /**
   * Get progress data for courses by subject
   * @param subjectId Subject ID
   * @returns Response with course progress data for subject courses
   */
  getSubjectCoursesProgress: async (subjectId: number): Promise<AxiosResponse<SubjectAllocationProgressListResponse>> => {
    return api.get(`/subject-allocation/subject/${subjectId}/courses/progress`);
  },

  /**
   * Get real-time progress updates
   * @param courseIds Array of course IDs to monitor
   * @returns Response with real-time progress data
   */
  getRealTimeProgress: async (courseIds: number[]): Promise<AxiosResponse<SubjectAllocationProgressListResponse>> => {
    return api.post('/subject-allocation/realtime/progress', { courseIds });
  },

  /**
   * Get progress analytics for subject allocation
   * @returns Response with analytics data
   */
  getProgressAnalytics: async (): Promise<AxiosResponse<{
    status: string;
    message: string;
    data: {
      totalCourses: number;
      activeCourses: number;
      completedCourses: number;
      averageProgress: number;
      averageCompletionRate: number;
      totalTeachers: number;
      averageTeacherWorkload: number;
      topPerformingCourses: CourseProgressData[];
      topPerformingTeachers: TeacherWorkloadData[];
    };
    errors?: string[];
  }>> => {
    return api.get('/subject-allocation/analytics');
  }
};

export default subjectAllocationProgressApi; 