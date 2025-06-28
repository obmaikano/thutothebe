import lessonApi, { Lesson } from '../api/services/lessonApi';
import lessonCompletionApi, { LessonCompletion } from '../api/services/lessonCompletionApi';
import curriculumProgressApi, { CurriculumProgress } from '../api/services/curriculumProgressApi';
import { Course } from '../api/services/courseApi';

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

// ==================== UTILITY FUNCTIONS ====================

/**
 * Calculate real progress data for a course using existing APIs
 */
export const calculateCourseProgress = async (course: Course): Promise<CourseProgressData> => {
  try {
    // Get lessons for the course
    const lessonsResponse = await lessonApi.getByCourseId(course.id);
    const lessons: Lesson[] = lessonsResponse.data.data || [];
    
    // Get curriculum progress for the course
    const progressResponse = await curriculumProgressApi.getByCourseId(course.id);
    const progress: CurriculumProgress[] = progressResponse.data.data || [];
    
    // Calculate metrics from lessons
    const totalLessons = lessons.length;
    const completedLessons = lessons.filter(l => l.status === 'COMPLETED').length;
    const inProgressLessons = lessons.filter(l => l.status === 'IN_PROGRESS').length;
    
    // Calculate assessments (assuming each lesson has one assessment)
    const totalAssessments = totalLessons;
    const completedAssessments = completedLessons;
    
    // Calculate average progress from curriculum progress
    const averageProgress = progress.length > 0 
      ? progress.reduce((sum, p) => sum + (p.progressPercentage || 0), 0) / progress.length
      : 0;
    
    // Calculate average score from curriculum progress
    const scores = progress
      .filter(p => p.averageScore !== null && p.averageScore !== undefined)
      .map(p => p.averageScore!);
    const averageScore = scores.length > 0 
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length
      : 0;
    
    // Calculate completion rate
    const completionRate = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
    
    // Get last activity date
    const lastActivityDate = progress.length > 0 
      ? progress.reduce((latest, p) => {
          const date = p.lastActivityDate || p.modifiedAt;
          return date && (!latest || date > latest) ? date : latest;
        }, '')
      : undefined;
    
    return {
      courseId: course.id,
      totalLessons,
      completedLessons,
      inProgressLessons,
      totalAssessments,
      completedAssessments,
      averageProgress,
      averageScore,
      completionRate,
      lastActivityDate
    };
  } catch (error) {
    console.error(`Error calculating progress for course ${course.id}:`, error);
    // Return default values if API calls fail
    return {
      courseId: course.id,
      totalLessons: 0,
      completedLessons: 0,
      inProgressLessons: 0,
      totalAssessments: 0,
      completedAssessments: 0,
      averageProgress: 0,
      averageScore: 0,
      completionRate: 0
    };
  }
};

/**
 * Calculate real progress data for multiple courses
 */
export const calculateMultipleCoursesProgress = async (courses: Course[]): Promise<CourseProgressData[]> => {
  const progressPromises = courses.map(course => calculateCourseProgress(course));
  return Promise.all(progressPromises);
};

/**
 * Calculate teacher workload data
 */
export const calculateTeacherWorkload = async (
  teacherId: number, 
  teacherName: string, 
  teacherCourses: Course[]
): Promise<TeacherWorkloadData> => {
  try {
    // Calculate progress for all teacher's courses
    const coursesProgress = await calculateMultipleCoursesProgress(teacherCourses);
    
    // Aggregate metrics
    const totalCourses = teacherCourses.length;
    const totalLessons = coursesProgress.reduce((sum, p) => sum + p.totalLessons, 0);
    const completedLessons = coursesProgress.reduce((sum, p) => sum + p.completedLessons, 0);
    const averageProgress = coursesProgress.length > 0 
      ? coursesProgress.reduce((sum, p) => sum + p.averageProgress, 0) / coursesProgress.length
      : 0;
    const averageScore = coursesProgress.length > 0 
      ? coursesProgress.reduce((sum, p) => sum + p.averageScore, 0) / coursesProgress.length
      : 0;
    
    // Determine workload level
    let workloadLevel: 'LIGHT' | 'MODERATE' | 'HEAVY';
    if (totalCourses <= 3) {
      workloadLevel = 'LIGHT';
    } else if (totalCourses <= 5) {
      workloadLevel = 'MODERATE';
    } else {
      workloadLevel = 'HEAVY';
    }
    
    // Get last activity date
    const lastActivityDate = coursesProgress
      .filter(p => p.lastActivityDate)
      .reduce((latest, p) => {
        const date = p.lastActivityDate!;
        return !latest || date > latest ? date : latest;
      }, '');
    
    return {
      teacherId,
      teacherName,
      totalCourses,
      totalLessons,
      completedLessons,
      averageProgress,
      averageScore,
      workloadLevel,
      lastActivityDate: lastActivityDate || undefined
    };
  } catch (error) {
    console.error(`Error calculating workload for teacher ${teacherId}:`, error);
    // Return default values if calculation fails
    return {
      teacherId,
      teacherName,
      totalCourses: teacherCourses.length,
      totalLessons: 0,
      completedLessons: 0,
      averageProgress: 0,
      averageScore: 0,
      workloadLevel: 'LIGHT',
    };
  }
};

/**
 * Calculate workload for multiple teachers
 */
export const calculateMultipleTeachersWorkload = async (
  teachers: Array<{ id: number; firstName: string; lastName: string }>,
  teacherCoursesMap: Map<number, Course[]>
): Promise<TeacherWorkloadData[]> => {
  const workloadPromises = teachers.map(teacher => {
    const teacherCourses = teacherCoursesMap.get(teacher.id) || [];
    const teacherName = `${teacher.firstName} ${teacher.lastName}`;
    return calculateTeacherWorkload(teacher.id, teacherName, teacherCourses);
  });
  
  return Promise.all(workloadPromises);
};

/**
 * Get real progress data for a course (fallback to calculated data if APIs fail)
 */
export const getRealCourseProgress = async (course: Course): Promise<CourseProgressData> => {
  try {
    // Try to get from dedicated API first
    // const response = await subjectAllocationProgressApi.getCourseProgress(course.id);
    // return response.data.data;
    
    // Fallback to calculated data
    return await calculateCourseProgress(course);
  } catch (error) {
    console.error(`Error getting real progress for course ${course.id}:`, error);
    return await calculateCourseProgress(course);
  }
};

/**
 * Get real progress data for multiple courses
 */
export const getRealMultipleCoursesProgress = async (courses: Course[]): Promise<CourseProgressData[]> => {
  try {
    // Try to get from dedicated API first
    // const courseIds = courses.map(c => c.id);
    // const response = await subjectAllocationProgressApi.getMultipleCoursesProgress(courseIds);
    // return response.data.data;
    
    // Fallback to calculated data
    return await calculateMultipleCoursesProgress(courses);
  } catch (error) {
    console.error('Error getting real progress for multiple courses:', error);
    return await calculateMultipleCoursesProgress(courses);
  }
};

/**
 * Get real teacher workload data
 */
export const getRealTeacherWorkload = async (
  teachers: Array<{ id: number; firstName: string; lastName: string }>,
  courses: Course[]
): Promise<TeacherWorkloadData[]> => {
  try {
    // Group courses by teacher
    const teacherCoursesMap = new Map<number, Course[]>();
    courses.forEach(course => {
      course.instructorIds?.forEach(teacherId => {
        if (!teacherCoursesMap.has(teacherId)) {
          teacherCoursesMap.set(teacherId, []);
        }
        teacherCoursesMap.get(teacherId)!.push(course);
      });
    });
    
    // Calculate workload for each teacher
    return await calculateMultipleTeachersWorkload(teachers, teacherCoursesMap);
  } catch (error) {
    console.error('Error getting real teacher workload:', error);
    return [];
  }
}; 