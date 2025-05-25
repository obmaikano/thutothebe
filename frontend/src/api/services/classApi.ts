import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface Class {
  id: number;
  name: string;
  grade: number;
  schoolId: number;
  active: boolean;
  description?: string;
  capacity?: number;
  currentEnrollment?: number;
  studentIds?: number[];
  teacherIds?: number[];
}

export interface ClassResponse {
  status: string;
  message: string;
  data: Class | Class[] | null;
  timestamp: string | null;
}

export type CreateClassRequest = Omit<Class, 'id'>;
export type UpdateClassRequest = Partial<Class>;

/**
 * API service for interacting with class endpoints
 */
const classApi = {
  /**
   * Get all classes
   * @returns Response with a list of classes
   */
  getAll: async (): Promise<AxiosResponse<ClassResponse>> => {
    return api.get('/classes');
  },

  /**
   * Get class by ID
   * @param id Class ID
   * @returns Response with class details
   */
  getById: async (id: number): Promise<AxiosResponse<ClassResponse>> => {
    return api.get(`/classes/${id}`);
  },

  /**
   * Get class by ID with enrolled students
   * @param id Class ID
   * @returns Response with class details including student IDs
   */
  getByIdWithStudents: async (id: number): Promise<AxiosResponse<ClassResponse>> => {
    return api.get(`/classes/${id}/with-students`);
  },

  /**
   * Get enrolled students for a class
   * @param classId Class ID
   * @returns Response with list of students in the class
   */
  getEnrolledStudents: async (classId: number): Promise<AxiosResponse<any>> => {
    return api.get(`/students/class/${classId}/enrolled`);
  },

  /**
   * Get classes by school ID
   * @param schoolId School ID
   * @returns Response with classes in the school
   */
  getBySchool: async (schoolId: number): Promise<AxiosResponse<ClassResponse>> => {
    return api.get(`/classes/school/${schoolId}`);
  },

  /**
   * Get active classes by school ID
   * @param schoolId School ID
   * @returns Response with active classes in the school
   */
  getActiveBySchool: async (schoolId: number): Promise<AxiosResponse<ClassResponse>> => {
    return api.get(`/classes/school/${schoolId}/active`);
  },

  /**
   * Get all active classes
   * @returns Response with a list of active classes
   */
  getActiveClasses: async (): Promise<AxiosResponse<ClassResponse>> => {
    return api.get('/classes/active');
  },

  /**
   * Create a new class
   * @param classData Class data
   * @returns Response with created class details
   */
  create: async (classData: CreateClassRequest): Promise<AxiosResponse<ClassResponse>> => {
    return api.post('/classes', classData);
  },

  /**
   * Update an existing class
   * @param id Class ID
   * @param classData Updated class data
   * @returns Response with updated class details
   */
  update: async (id: number, classData: UpdateClassRequest): Promise<AxiosResponse<ClassResponse>> => {
    return api.put(`/classes/${id}`, classData);
  },

  /**
   * Delete a class
   * @param id Class ID
   * @returns Response indicating success/failure
   */
  delete: async (id: number): Promise<AxiosResponse<ClassResponse>> => {
    return api.delete(`/classes/${id}`);
  },

  /**
   * Activate a class
   * @param id Class ID
   * @returns Response indicating success/failure
   */
  activate: async (id: number): Promise<AxiosResponse<ClassResponse>> => {
    return api.post(`/classes/${id}/activate`);
  },

  /**
   * Deactivate a class
   * @param id Class ID
   * @returns Response indicating success/failure
   */
  deactivate: async (id: number): Promise<AxiosResponse<ClassResponse>> => {
    return api.post(`/classes/${id}/deactivate`);
  },

  /**
   * Add a student to a class
   * @param classId Class ID
   * @param studentId Student ID
   * @returns Response indicating success/failure
   */
  addStudentToClass: async (classId: number, studentId: number): Promise<AxiosResponse<ClassResponse>> => {
    return api.post(`/classes/${classId}/student/${studentId}`);
  },

  /**
   * Remove a student from a class
   * @param classId Class ID
   * @param studentId Student ID
   * @returns Response indicating success/failure
   */
  removeStudentFromClass: async (classId: number, studentId: number): Promise<AxiosResponse<ClassResponse>> => {
    return api.delete(`/classes/${classId}/student/${studentId}`);
  },

  /**
   * Assign a teacher to a class
   * @param classId Class ID
   * @param teacherId Teacher ID
   * @returns Response indicating success/failure
   */
  assignTeacherToClass: async (classId: number, teacherId: number): Promise<AxiosResponse<ClassResponse>> => {
    return api.post(`/classes/${classId}/teacher/${teacherId}`);
  },

  /**
   * Remove a teacher from a class
   * @param classId Class ID
   * @param teacherId Teacher ID
   * @returns Response indicating success/failure
   */
  removeTeacherFromClass: async (classId: number, teacherId: number): Promise<AxiosResponse<ClassResponse>> => {
    return api.delete(`/classes/${classId}/teacher/${teacherId}`);
  },

  /**
   * Get classes by teacher ID
   * @param teacherId Teacher ID
   * @returns Response with classes assigned to the teacher
   */
  getByTeacher: async (teacherId: number): Promise<AxiosResponse<ClassResponse>> => {
    return api.get(`/classes/teacher/${teacherId}`);
  },

  /**
   * Get active classes by teacher ID
   * @param teacherId Teacher ID
   * @returns Response with active classes assigned to the teacher
   */
  getActiveByTeacher: async (teacherId: number): Promise<AxiosResponse<ClassResponse>> => {
    return api.get(`/classes/teacher/${teacherId}/active`);
  },
};

export default classApi; 