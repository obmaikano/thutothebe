import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface CourseType {
  CORE: 'CORE';
  ELECTIVE: 'ELECTIVE';
}

export interface Term {
  FIRST_TERM: 'FIRST_TERM';
  SECOND_TERM: 'SECOND_TERM';
  THIRD_TERM: 'THIRD_TERM';
  SEMESTER_1: 'SEMESTER_1';
  SEMESTER_2: 'SEMESTER_2';
}

export interface Course {
  id: number;
  code: string;
  name: string;
  subjectId: number;
  classId: number;
  term: keyof Term;
  year: number;
  active: boolean;
  type: keyof CourseType;
  instructorIds: number[];
}

export interface CourseResponse {
  status: string;
  message: string;
  data: Course | Course[] | null;
  timestamp: string | null;
}

export type CreateCourseRequest = Omit<Course, 'id'>;
export type UpdateCourseRequest = Partial<Course>;

/**
 * API service for interacting with course endpoints
 */
const courseApi = {
  /**
   * Get all courses
   * @returns Response with a list of courses
   */
  getAll: async (): Promise<AxiosResponse<CourseResponse>> => {
    return api.get('/courses');
  },

  /**
   * Get course by ID
   * @param id Course ID
   * @returns Response with course details
   */
  getById: async (id: number): Promise<AxiosResponse<CourseResponse>> => {
    return api.get(`/courses/${id}`);
  },

  /**
   * Get course by code
   * @param code Course code
   * @returns Response with course details
   */
  getByCode: async (code: string): Promise<AxiosResponse<CourseResponse>> => {
    return api.get(`/courses/code/${code}`);
  },

  /**
   * Get all active courses
   * @returns Response with a list of active courses
   */
  getActiveCourses: async (): Promise<AxiosResponse<CourseResponse>> => {
    return api.get('/courses/active');
  },

  /**
   * Get courses by subject ID
   * @param subjectId Subject ID
   * @returns Response with a list of courses for the subject
   */
  getBySubject: async (subjectId: number): Promise<AxiosResponse<CourseResponse>> => {
    return api.get(`/courses/subject/${subjectId}`);
  },

  /**
   * Get active courses by subject ID
   * @param subjectId Subject ID
   * @returns Response with a list of active courses for the subject
   */
  getActiveBySubject: async (subjectId: number): Promise<AxiosResponse<CourseResponse>> => {
    return api.get(`/courses/subject/${subjectId}/active`);
  },

  /**
   * Get courses by class ID
   * @param classId Class ID
   * @returns Response with a list of courses for the class
   */
  getByClass: async (classId: number): Promise<AxiosResponse<CourseResponse>> => {
    return api.get(`/courses/class/${classId}`);
  },

  /**
   * Get active courses by class ID
   * @param classId Class ID
   * @returns Response with a list of active courses for the class
   */
  getActiveByClass: async (classId: number): Promise<AxiosResponse<CourseResponse>> => {
    return api.get(`/courses/class/${classId}/active`);
  },

  /**
   * Get courses by teacher ID
   * @param teacherId Teacher ID
   * @returns Response with a list of courses for the teacher
   */
  getByTeacher: async (teacherId: number): Promise<AxiosResponse<CourseResponse>> => {
    return api.get(`/courses/teacher/${teacherId}`);
  },

  /**
   * Get active courses by teacher ID
   * @param teacherId Teacher ID
   * @returns Response with a list of active courses for the teacher
   */
  getActiveByTeacher: async (teacherId: number): Promise<AxiosResponse<CourseResponse>> => {
    return api.get(`/courses/teacher/${teacherId}/active`);
  },

  /**
   * Get courses by term
   * @param term Term (FIRST_TERM, SECOND_TERM, THIRD_TERM, SEMESTER_1, SEMESTER_2)
   * @returns Response with a list of courses for the term
   */
  getByTerm: async (term: keyof Term): Promise<AxiosResponse<CourseResponse>> => {
    return api.get(`/courses/term/${term}`);
  },

  /**
   * Get courses by year
   * @param year Academic year
   * @returns Response with a list of courses for the year
   */
  getByYear: async (year: number): Promise<AxiosResponse<CourseResponse>> => {
    return api.get(`/courses/year/${year}`);
  },

  /**
   * Get courses by type (CORE or ELECTIVE)
   * @param type Course type
   * @returns Response with a list of courses of the type
   */
  getByType: async (type: keyof CourseType): Promise<AxiosResponse<CourseResponse>> => {
    return api.get(`/courses/type/${type}`);
  },

  /**
   * Get active courses by type (CORE or ELECTIVE)
   * @param type Course type
   * @returns Response with a list of active courses of the type
   */
  getActiveByType: async (type: keyof CourseType): Promise<AxiosResponse<CourseResponse>> => {
    return api.get(`/courses/type/${type}/active`);
  },

  /**
   * Create a new course
   * @param courseData Course data
   * @returns Response with created course details
   */
  create: async (courseData: CreateCourseRequest): Promise<AxiosResponse<CourseResponse>> => {
    return api.post('/courses', courseData);
  },

  /**
   * Update an existing course
   * @param id Course ID
   * @param courseData Updated course data
   * @returns Response with updated course details
   */
  update: async (id: number, courseData: UpdateCourseRequest): Promise<AxiosResponse<CourseResponse>> => {
    return api.put(`/courses/${id}`, courseData);
  },

  /**
   * Delete a course
   * @param id Course ID
   * @returns Response indicating success/failure
   */
  delete: async (id: number): Promise<AxiosResponse<CourseResponse>> => {
    return api.delete(`/courses/${id}`);
  },

  /**
   * Activate a course
   * @param id Course ID
   * @returns Response indicating success/failure
   */
  activate: async (id: number): Promise<AxiosResponse<CourseResponse>> => {
    return api.post(`/courses/${id}/activate`);
  },

  /**
   * Deactivate a course
   * @param id Course ID
   * @returns Response indicating success/failure
   */
  deactivate: async (id: number): Promise<AxiosResponse<CourseResponse>> => {
    return api.post(`/courses/${id}/deactivate`);
  },

  /**
   * Add a teacher to a course
   * @param courseId Course ID
   * @param teacherId Teacher ID
   * @param isPrimary Whether the teacher is the primary instructor
   * @returns Response indicating success/failure
   */
  addTeacherToCourse: async (
    courseId: number, 
    teacherId: number, 
    isPrimary: boolean = false
  ): Promise<AxiosResponse<CourseResponse>> => {
    return api.post(`/courses/${courseId}/teacher/${teacherId}?isPrimary=${isPrimary}`);
  },

  /**
   * Remove a teacher from a course
   * @param courseId Course ID
   * @param teacherId Teacher ID
   * @returns Response indicating success/failure
   */
  removeTeacherFromCourse: async (
    courseId: number, 
    teacherId: number
  ): Promise<AxiosResponse<CourseResponse>> => {
    return api.delete(`/courses/${courseId}/teacher/${teacherId}`);
  }
};

export default courseApi; 