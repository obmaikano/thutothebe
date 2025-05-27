import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface Grade {
  id: number;
  studentId: number;
  courseId: number;
  gradeCategoryId?: number;
  assessmentId?: number;
  assignmentId?: number;
  gradeType: 'ASSIGNMENT' | 'ASSESSMENT' | 'QUIZ' | 'EXAM' | 'PROJECT';
  score: number;
  maxScore: number;
  weight: number;
  feedback?: string;
  gradedById: number;
  gradedAt: string;
  isFinal: boolean;
  isModerated: boolean;
  moderatedById?: number;
  moderatedAt?: string;
  moderationNotes?: string;
  originalScore?: number;
  active: boolean;
  createdAt: string;
  modifiedAt: string;
}

export interface GradeResponse {
  status: string;
  message: string;
  data: Grade | Grade[] | number | boolean | null;
  timestamp: string | null;
}

export interface CreateGradeRequest {
  studentId: number;
  courseId: number;
  gradeCategoryId?: number;
  assessmentId?: number;
  assignmentId?: number;
  gradeType: 'ASSIGNMENT' | 'ASSESSMENT' | 'QUIZ' | 'EXAM' | 'PROJECT';
  score: number;
  maxScore?: number;
  weight?: number;
  feedback?: string;
  gradedById: number;
  isFinal?: boolean;
}

export interface UpdateGradeRequest {
  score?: number;
  maxScore?: number;
  weight?: number;
  feedback?: string;
  isFinal?: boolean;
}

export interface ModerateGradeRequest {
  moderatedById: number;
  moderationNotes?: string;
  newScore?: number;
}

export interface CreateGradeForAssessmentRequest {
  studentId: number;
  assessmentId: number;
  score: number;
  gradedById: number;
}

export interface CreateGradeForAssignmentRequest {
  studentId: number;
  assignmentId: number;
  score: number;
  gradedById: number;
}

/**
 * API service for interacting with grade endpoints
 */
const gradeApi = {
  /**
   * Get all grades
   * @returns Response with a list of grades
   */
  getAll: async (): Promise<AxiosResponse<GradeResponse>> => {
    return api.get('/grades');
  },

  /**
   * Get grade by ID
   * @param id Grade ID
   * @returns Response with grade details
   */
  getById: async (id: number): Promise<AxiosResponse<GradeResponse>> => {
    return api.get(`/grades/${id}`);
  },

  /**
   * Get grades by student ID
   * @param studentId Student ID
   * @returns Response with student's grades
   */
  getByStudentId: async (studentId: number): Promise<AxiosResponse<GradeResponse>> => {
    return api.get(`/grades/student/${studentId}`);
  },

  /**
   * Get grades by course ID
   * @param courseId Course ID
   * @returns Response with course grades
   */
  getByCourseId: async (courseId: number): Promise<AxiosResponse<GradeResponse>> => {
    return api.get(`/grades/course/${courseId}`);
  },

  /**
   * Get grades by student and course
   * @param studentId Student ID
   * @param courseId Course ID
   * @returns Response with student's grades for the course
   */
  getByStudentAndCourse: async (studentId: number, courseId: number): Promise<AxiosResponse<GradeResponse>> => {
    return api.get(`/grades/student/${studentId}/course/${courseId}`);
  },

  /**
   * Get grades by grade category
   * @param gradeCategoryId Grade Category ID
   * @returns Response with category grades
   */
  getByGradeCategoryId: async (gradeCategoryId: number): Promise<AxiosResponse<GradeResponse>> => {
    return api.get(`/grades/category/${gradeCategoryId}`);
  },

  /**
   * Get grades by type
   * @param gradeType Grade type
   * @returns Response with grades of specified type
   */
  getByType: async (gradeType: string): Promise<AxiosResponse<GradeResponse>> => {
    return api.get(`/grades/type/${gradeType}`);
  },

  /**
   * Get grades by assessment
   * @param assessmentId Assessment ID
   * @returns Response with assessment grades
   */
  getByAssessmentId: async (assessmentId: number): Promise<AxiosResponse<GradeResponse>> => {
    return api.get(`/grades/assessment/${assessmentId}`);
  },

  /**
   * Get grades by assignment
   * @param assignmentId Assignment ID
   * @returns Response with assignment grades
   */
  getByAssignmentId: async (assignmentId: number): Promise<AxiosResponse<GradeResponse>> => {
    return api.get(`/grades/assignment/${assignmentId}`);
  },

  /**
   * Get grades by teacher
   * @param teacherId Teacher ID
   * @returns Response with grades entered by teacher
   */
  getByTeacherId: async (teacherId: number): Promise<AxiosResponse<GradeResponse>> => {
    return api.get(`/grades/teacher/${teacherId}`);
  },

  /**
   * Get student average
   * @param studentId Student ID
   * @returns Response with student's average grade
   */
  getStudentAverage: async (studentId: number): Promise<AxiosResponse<GradeResponse>> => {
    return api.get(`/grades/statistics/average/student/${studentId}`);
  },

  /**
   * Get course average
   * @param courseId Course ID
   * @returns Response with course average grade
   */
  getCourseAverage: async (courseId: number): Promise<AxiosResponse<GradeResponse>> => {
    return api.get(`/grades/statistics/average/course/${courseId}`);
  },

  /**
   * Get category average
   * @param gradeCategoryId Grade Category ID
   * @returns Response with category average grade
   */
  getCategoryAverage: async (gradeCategoryId: number): Promise<AxiosResponse<GradeResponse>> => {
    return api.get(`/grades/statistics/average/category/${gradeCategoryId}`);
  },

  /**
   * Get student-course average
   * @param studentId Student ID
   * @param courseId Course ID
   * @returns Response with student's average for the course
   */
  getStudentCourseAverage: async (studentId: number, courseId: number): Promise<AxiosResponse<GradeResponse>> => {
    return api.get(`/grades/statistics/average/student/${studentId}/course/${courseId}`);
  },

  /**
   * Create a new grade
   * @param gradeData Grade data
   * @returns Response with created grade details
   */
  create: async (gradeData: CreateGradeRequest): Promise<AxiosResponse<GradeResponse>> => {
    return api.post('/grades', gradeData);
  },

  /**
   * Create grade for assessment
   * @param gradeData Grade data for assessment
   * @returns Response with created grade details
   */
  createForAssessment: async (gradeData: CreateGradeForAssessmentRequest): Promise<AxiosResponse<GradeResponse>> => {
    const formData = new FormData();
    formData.append('studentId', gradeData.studentId.toString());
    formData.append('assessmentId', gradeData.assessmentId.toString());
    formData.append('score', gradeData.score.toString());
    formData.append('gradedById', gradeData.gradedById.toString());
    
    return api.post('/grades/assessment', formData);
  },

  /**
   * Create grade for assignment
   * @param gradeData Grade data for assignment
   * @returns Response with created grade details
   */
  createForAssignment: async (gradeData: CreateGradeForAssignmentRequest): Promise<AxiosResponse<GradeResponse>> => {
    const formData = new FormData();
    formData.append('studentId', gradeData.studentId.toString());
    formData.append('assignmentId', gradeData.assignmentId.toString());
    formData.append('score', gradeData.score.toString());
    formData.append('gradedById', gradeData.gradedById.toString());
    
    return api.post('/grades/assignment', formData);
  },

  /**
   * Bulk create grades
   * @param grades Array of grade data
   * @returns Response with created grades
   */
  bulkCreate: async (grades: CreateGradeRequest[]): Promise<AxiosResponse<GradeResponse>> => {
    return api.post('/grades/bulk', grades);
  },

  /**
   * Update an existing grade
   * @param id Grade ID
   * @param gradeData Updated grade data
   * @returns Response with updated grade details
   */
  update: async (id: number, gradeData: UpdateGradeRequest): Promise<AxiosResponse<GradeResponse>> => {
    return api.put(`/grades/${id}`, gradeData);
  },

  /**
   * Delete a grade
   * @param id Grade ID
   * @returns Response indicating success/failure
   */
  delete: async (id: number): Promise<AxiosResponse<GradeResponse>> => {
    return api.delete(`/grades/${id}`);
  },

  /**
   * Moderate a grade
   * @param id Grade ID
   * @param moderationData Moderation data
   * @returns Response with moderated grade details
   */
  moderate: async (id: number, moderationData: ModerateGradeRequest): Promise<AxiosResponse<GradeResponse>> => {
    return api.post(`/grades/moderate/${id}`, moderationData);
  },

  /**
   * Deactivate a grade
   * @param id Grade ID
   * @returns Response with deactivated grade details
   */
  deactivate: async (id: number): Promise<AxiosResponse<GradeResponse>> => {
    return api.put(`/grades/${id}/deactivate`);
  },

  /**
   * Reactivate a grade
   * @param id Grade ID
   * @returns Response with reactivated grade details
   */
  reactivate: async (id: number): Promise<AxiosResponse<GradeResponse>> => {
    return api.put(`/grades/${id}/reactivate`);
  },

  /**
   * Check if grade exists for student and assessment
   * @param studentId Student ID
   * @param assessmentId Assessment ID
   * @returns Response with existence check result
   */
  existsForStudentAndAssessment: async (studentId: number, assessmentId: number): Promise<AxiosResponse<GradeResponse>> => {
    return api.get(`/grades/exists/student/${studentId}/assessment/${assessmentId}`);
  },

  /**
   * Check if grade exists for student and assignment
   * @param studentId Student ID
   * @param assignmentId Assignment ID
   * @returns Response with existence check result
   */
  existsForStudentAndAssignment: async (studentId: number, assignmentId: number): Promise<AxiosResponse<GradeResponse>> => {
    return api.get(`/grades/exists/student/${studentId}/assignment/${assignmentId}`);
  },

  /**
   * Check if grade exists for student and category
   * @param studentId Student ID
   * @param gradeCategoryId Grade Category ID
   * @returns Response with existence check result
   */
  existsForStudentAndCategory: async (studentId: number, gradeCategoryId: number): Promise<AxiosResponse<GradeResponse>> => {
    return api.get(`/grades/exists/student/${studentId}/category/${gradeCategoryId}`);
  },

  /**
   * Get unmoderated grades
   * @returns Response with unmoderated grades
   */
  getUnmoderated: async (): Promise<AxiosResponse<GradeResponse>> => {
    return api.get('/grades/unmoderated');
  },

  /**
   * Get moderated grades
   * @returns Response with moderated grades
   */
  getModerated: async (): Promise<AxiosResponse<GradeResponse>> => {
    return api.get('/grades/moderated');
  },
};

export default gradeApi; 