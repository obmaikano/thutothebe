import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface Class {
  id: number;
  name: string;
  schoolId: number;
  active: boolean;
  description?: string;
  capacity?: number;
  currentEnrollment?: number;
  totalEnrolled?: number;
  studentIds?: number[];
  teacherIds?: number[];
  gradeLevel: string;
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
   * Get all classes (active and inactive) by teacher ID
   * @param teacherId Teacher ID
   * @returns Response with all classes assigned to the teacher
   */
  getAllByTeacher: async (teacherId: number): Promise<AxiosResponse<ClassResponse>> => {
    return api.get(`/classes/teacher/${teacherId}/all`);
  },

  /**
   * Get active classes by teacher ID
   * @param teacherId Teacher ID
   * @returns Response with active classes assigned to the teacher
   */
  getActiveByTeacher: async (teacherId: number): Promise<AxiosResponse<ClassResponse>> => {
    return api.get(`/classes/teacher/${teacherId}/active`);
  },

  /**
   * Get all classes with teachers
   * @returns Response with a list of classes including teacher assignments
   */
  getAllWithTeachers: async (): Promise<AxiosResponse<ClassResponse>> => {
    return api.get('/classes/with-teachers');
  },

  /**
   * Get class by ID with teachers
   * @param id Class ID
   * @returns Response with class details including teacher assignments
   */
  getByIdWithTeachers: async (id: number): Promise<AxiosResponse<ClassResponse>> => {
    return api.get(`/classes/${id}/with-teachers`);
  },

  /**
   * Get classes by student ID
   * @param studentId Student ID
   * @returns Response with classes for the student
   */
  getByStudent: async (studentId: number): Promise<AxiosResponse<ClassResponse>> => {
    return api.get(`/classes/student/${studentId}`);
  },

  /**
   * Get classes by minimum capacity
   * @param minCapacity Minimum capacity
   * @returns Response with classes having at least the specified capacity
   */
  getByMinCapacity: async (minCapacity: number): Promise<AxiosResponse<ClassResponse>> => {
    return api.get(`/classes/capacity/${minCapacity}`);
  },

  /**
   * Get available classes (with spots left)
   * @returns Response with available classes
   */
  getAvailableClasses: async (): Promise<AxiosResponse<ClassResponse>> => {
    return api.get('/classes/available');
  },

  /**
   * Get classes by over capacity status
   * @param overCapacity Whether to get over-capacity classes
   * @returns Response with classes based on over capacity status
   */
  getByOverCapacity: async (overCapacity: boolean): Promise<AxiosResponse<ClassResponse>> => {
    return api.get(`/classes/over-capacity/${overCapacity}`);
  },

  /**
   * Search classes by name
   * @param name Class name to search for
   * @returns Response with matching classes
   */
  searchByName: async (name: string): Promise<AxiosResponse<ClassResponse>> => {
    return api.get(`/classes/search?name=${encodeURIComponent(name)}`);
  },

  /**
   * Get classes by region ID
   * @param regionId Region ID
   * @returns Response with classes in the region
   */
  getByRegion: async (regionId: number): Promise<AxiosResponse<ClassResponse>> => {
    return api.get(`/classes/region/${regionId}`);
  },

  /**
   * Get classes by grade level
   * @param gradeLevel Grade level
   * @returns Response with classes for the grade level
   */
  getByGradeLevel: async (gradeLevel: string): Promise<AxiosResponse<ClassResponse>> => {
    return api.get(`/classes/grade-level/${gradeLevel}`);
  },

  /**
   * Get class count statistics
   * @returns Response with class count
   */
  getClassCount: async (): Promise<AxiosResponse<{ status: string; message: string; data: number }>> => {
    return api.get('/classes/statistics/count');
  },

  /**
   * Get total enrollment statistics
   * @returns Response with total enrollment
   */
  getTotalEnrollment: async (): Promise<AxiosResponse<{ status: string; message: string; data: number }>> => {
    return api.get('/classes/statistics/enrollment');
  },

  /**
   * Get total capacity statistics
   * @returns Response with total capacity
   */
  getTotalCapacity: async (): Promise<AxiosResponse<{ status: string; message: string; data: number }>> => {
    return api.get('/classes/statistics/capacity');
  },

  /**
   * Get all grade levels (enum values)
   * @returns Response with a list of grade levels
   */
  getGradeLevels: async (): Promise<AxiosResponse<{ status: string; message: string; data: string[] }>> => {
    return api.get('/classes/grade-levels');
  },
};

export default classApi; 