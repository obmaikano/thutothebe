import { useState, useEffect, useCallback } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { getRealCourseProgress, getRealTeacherWorkload } from '../../../utils/subjectAllocationProgressUtils';
import { Course } from '../../../api/services/courseApi';

interface WorkloadStats {
  teacherId: number;
  teacherName: string;
  workload: number;
  avgProgress: number;
  status: 'LIGHT' | 'MODERATE' | 'HEAVY';
}

interface Allocation {
  id: number;
  subject: string;
  subjectId: number;
  teacher: string;
  teacherId: number;
  class: string;
  classId: number;
  term: string;
  status: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  assessments: number;
  lastUpdate: string;
  courseData: any;
}

export const useSubjectAllocationRealtime = () => {
  const { courses } = useAppSelector(state => state.courses);
  const { teachers } = useAppSelector(state => state.teachers);
  const { classes } = useAppSelector(state => state.classes);
  const { subjects } = useAppSelector(state => state.subjects);

  const [connected, setConnected] = useState(false);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [workloadStats, setWorkloadStats] = useState<WorkloadStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Transform courses data to allocation format with real backend data
  const transformCourseToAllocation = async (course: Course): Promise<Allocation> => {
    const subject = subjects.find(s => s.id === course.subjectId);
    const classEntity = classes.find(c => c.id === course.classId);
    const teacher = teachers.find(t => course.instructorIds.includes(t.id));
    
    // Get real progress data
    const progressData = await getRealCourseProgress(course);
    
    return {
      id: course.id,
      subject: subject?.name || 'Unknown Subject',
      subjectId: course.subjectId,
      teacher: teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unassigned',
      teacherId: teacher?.id || 0,
      class: classEntity?.name || 'Unknown Class',
      classId: course.classId,
      term: `${course.term} ${course.year}`,
      status: course.active ? 'ACTIVE' : 'SUSPENDED',
      progress: progressData.averageProgress,
      completedLessons: progressData.completedLessons,
      totalLessons: progressData.totalLessons,
      assessments: progressData.completedAssessments,
      lastUpdate: progressData.lastActivityDate || course.updatedAt || course.createdAt || new Date().toISOString().split('T')[0],
      courseData: course
    };
  };

  // Load real-time data
  const loadRealTimeData = useCallback(async () => {
    if (courses.length === 0 || teachers.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      // Transform courses to allocations with real data
      const allocationPromises = courses.map(transformCourseToAllocation);
      const realtimeAllocations = await Promise.all(allocationPromises);
      setAllocations(realtimeAllocations);

      // Get real teacher workload data
      const workloadData = await getRealTeacherWorkload(teachers, courses);
      
      // Transform to WorkloadStats format
      const stats: WorkloadStats[] = workloadData.map(teacher => ({
        teacherId: teacher.teacherId,
        teacherName: teacher.teacherName,
        workload: teacher.totalCourses,
        avgProgress: teacher.averageProgress,
        status: teacher.workloadLevel
      }));
      
      setWorkloadStats(stats);
      setConnected(true);
    } catch (error: any) {
      console.error('Error loading real-time data:', error);
      setError(error.message || 'Failed to load real-time data');
      setConnected(false);
    } finally {
      setLoading(false);
    }
  }, [courses, teachers, classes, subjects]);

  // Refresh data
  const refreshData = useCallback(async () => {
    await loadRealTimeData();
  }, [loadRealTimeData]);

  // Load data on mount and when dependencies change
  useEffect(() => {
    loadRealTimeData();
  }, [loadRealTimeData]);

  // Simulate WebSocket connection for real-time updates
  useEffect(() => {
    if (!connected) return;

    const interval = setInterval(() => {
      // Refresh data every 30 seconds
      loadRealTimeData();
    }, 30000);

    return () => clearInterval(interval);
  }, [connected, loadRealTimeData]);

  return {
    connected,
    allocations,
    workloadStats,
    loading,
    error,
    refreshData
  };
}; 