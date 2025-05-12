// User Roles
export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN'
}

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// Course interface
export interface Course {
  id: string;
  title: string;
  description: string;
  teacherId: string;
  teacherName: string;
  startDate: string;
  endDate: string;
  language: 'english' | 'setswana';
  imageUrl: string;
  enrolledCount: number;
  topics: CourseTopic[];
}

// Course topic
export interface CourseTopic {
  id: string;
  title: string;
  type: 'lesson' | 'quiz' | 'assignment';
  content?: string;
  fileUrl?: string;
  dueDate?: string;
}

// Notification interface
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'assignment' | 'message' | 'system' | 'announcement';
  read: boolean;
  date: string;
}

// Student performance
export interface Performance {
  userId: string;
  courseId: string;
  attendance: number; // percentage
  quizAverage: number; // percentage
  assignmentsCompleted: number;
  assignmentsTotal: number;
}