import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface Student {
  id: number;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phone?: string;
  email: string;
  address?: string;
  academicYear: number;
  classId?: number;
  medicalConditions?: string;
  disabilities?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  schoolId: number;
  userId?: number;
  personId?: number;
  active: boolean;
  status: 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'GRADUATED' | 'WITHDRAWN';
  onboardingNotes?: string;
  subjectIds?: number[];
}

export interface StudentResponse {
  status: string;
  message: string;
  data: Student | Student[] | null;
  timestamp: string | null;
}

export type CreateStudentRequest = Omit<Student, 'id'>;
export type UpdateStudentRequest = Partial<Student>;

/**
 * API service for interacting with student endpoints
 */
const studentApi = {
  /**
   * Get all students
   * @returns Response with a list of students
   */
  getAll: async (): Promise<AxiosResponse<StudentResponse>> => {
    return api.get('/students');
  },

  /**
   * Get student by ID
   * @param id Student ID
   * @returns Response with student details
   */
  getById: async (id: number): Promise<AxiosResponse<StudentResponse>> => {
    return api.get(`/students/${id}`);
  },

  /**
   * Get student by admission number
   * @param admissionNumber Student admission number
   * @returns Response with student details
   */
  getByAdmissionNumber: async (admissionNumber: string): Promise<AxiosResponse<StudentResponse>> => {
    return api.get(`/students/admission-number/${admissionNumber}`);
  },

  /**
   * Get student by email
   * @param email Student email
   * @returns Response with student details
   */
  getByEmail: async (email: string): Promise<AxiosResponse<StudentResponse>> => {
    return api.get(`/students/email/${email}`);
  },

  /**
   * Get all active students
   * @returns Response with a list of active students
   */
  getActive: async (): Promise<AxiosResponse<StudentResponse>> => {
    return api.get('/students/active');
  },

  /**
   * Get students by course
   * @param courseId Course ID
   * @returns Response with students in the course
   */
  getByCourse: async (courseId: number): Promise<AxiosResponse<StudentResponse>> => {
    return api.get(`/students/course/${courseId}`);
  },

  /**
   * Get students by class
   * @param classId Class ID
   * @returns Response with students in the class
   */
  getByClass: async (classId: number): Promise<AxiosResponse<StudentResponse>> => {
    return api.get(`/students/class/${classId}`);
  },

  /**
   * Get students by school
   * @param schoolId School ID
   * @returns Response with students in the school
   */
  getBySchool: async (schoolId: number): Promise<AxiosResponse<StudentResponse>> => {
    return api.get(`/students/school/${schoolId}`);
  },

  /**
   * Get students by teacher ID (from assigned courses)
   * @param teacherId Teacher ID
   * @returns Response with students from teacher's assigned courses
   */
  getByTeacher: async (teacherId: number): Promise<AxiosResponse<StudentResponse>> => {
    return api.get(`/students/teacher/${teacherId}`);
  },

  /**
   * Get active students by teacher ID (from assigned courses)
   * @param teacherId Teacher ID
   * @returns Response with active students from teacher's assigned courses
   */
  getActiveByTeacher: async (teacherId: number): Promise<AxiosResponse<StudentResponse>> => {
    return api.get(`/students/teacher/${teacherId}/active`);
  },

  /**
   * Get students by subject
   * @param subjectId Subject ID
   * @returns Response with students in the subject
   */
  getBySubject: async (subjectId: number): Promise<AxiosResponse<StudentResponse>> => {
    return api.get(`/students/subject/${subjectId}`);
  },

  /**
   * Get active students by subject
   * @param subjectId Subject ID
   * @returns Response with active students in the subject
   */
  getActiveBySubject: async (subjectId: number): Promise<AxiosResponse<StudentResponse>> => {
    return api.get(`/students/subject/${subjectId}/active`);
  },

  /**
   * Get active students by course
   * @param courseId Course ID
   * @returns Response with active students in the course
   */
  getActiveByCourse: async (courseId: number): Promise<AxiosResponse<StudentResponse>> => {
    return api.get(`/students/course/${courseId}/active`);
  },

  /**
   * Get active students by class
   * @param classId Class ID
   * @returns Response with active students in the class
   */
  getActiveByClass: async (classId: number): Promise<AxiosResponse<StudentResponse>> => {
    return api.get(`/students/class/${classId}/active`);
  },

  /**
   * Create a new student
   * @param studentData Student data
   * @returns Response with created student details
   */
  create: async (studentData: CreateStudentRequest): Promise<AxiosResponse<StudentResponse>> => {
    return api.post('/students', studentData);
  },

  /**
   * Update an existing student
   * @param id Student ID
   * @param studentData Updated student data
   * @returns Response with updated student details
   */
  update: async (id: number, studentData: UpdateStudentRequest): Promise<AxiosResponse<StudentResponse>> => {
    return api.put(`/students/${id}`, studentData);
  },

  /**
   * Delete a student
   * @param id Student ID
   * @returns Response indicating success/failure
   */
  delete: async (id: number): Promise<AxiosResponse<StudentResponse>> => {
    return api.delete(`/students/${id}`);
  },

  /**
   * Activate a student
   * @param id Student ID
   * @returns Response indicating success/failure
   */
  activate: async (id: number): Promise<AxiosResponse<StudentResponse>> => {
    return api.post(`/students/${id}/activate`);
  },

  /**
   * Deactivate a student
   * @param id Student ID
   * @returns Response indicating success/failure
   */
  deactivate: async (id: number): Promise<AxiosResponse<StudentResponse>> => {
    return api.post(`/students/${id}/deactivate`);
  },
};

export default studentApi; 