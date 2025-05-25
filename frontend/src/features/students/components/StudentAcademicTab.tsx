import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchProgressByStudent } from '../../progress/progressSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { Student } from '../../../api/services/studentApi';
import { Progress } from '../../../api/services/progressApi';
import { 
  GraduationCap, Calendar, BookOpen, TrendingUp, Award, 
  Target, Clock, BarChart3, Users, CheckCircle, Edit3 
} from 'lucide-react';

interface StudentAcademicTabProps {
  student: Student;
}

interface CourseProgress {
  courseId: number;
  courseName: string;
  completionPercentage: number;
  grade: number;
  completed: boolean;
  lastActivity: string;
}

export const StudentAcademicTab: React.FC<StudentAcademicTabProps> = ({ student }) => {
  const dispatch = useAppDispatch();
  const { progressRecords, status } = useAppSelector(state => state.progress);
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  const [academicStats, setAcademicStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    averageGrade: 0,
    averageCompletion: 0,
    totalTimeSpent: 0
  });

  useEffect(() => {
    if (student.id) {
      dispatch(fetchProgressByStudent(student.id));
    }
  }, [dispatch, student.id]);

  useEffect(() => {
    if (progressRecords && Array.isArray(progressRecords)) {
      // Transform progress records to course progress
      const courseData: CourseProgress[] = progressRecords.map((progress: Progress) => ({
        courseId: progress.courseId,
        courseName: `Course ${progress.courseId}`, // This should be fetched from course API
        completionPercentage: progress.completionPercentage,
        grade: progress.grade,
        completed: progress.completed,
        lastActivity: progress.lastActivityAt
      }));

      setCourseProgress(courseData);

      // Calculate academic statistics
      const totalCourses = courseData.length;
      const completedCourses = courseData.filter(course => course.completed).length;
      const averageGrade = totalCourses > 0 
        ? courseData.reduce((sum, course) => sum + course.grade, 0) / totalCourses 
        : 0;
      const averageCompletion = totalCourses > 0 
        ? courseData.reduce((sum, course) => sum + course.completionPercentage, 0) / totalCourses 
        : 0;

      setAcademicStats({
        totalCourses,
        completedCourses,
        averageGrade: Math.round(averageGrade * 100) / 100,
        averageCompletion: Math.round(averageCompletion * 100) / 100,
        totalTimeSpent: 0 // This would need to be calculated from actual time tracking
      });
    }
  }, [progressRecords]);

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600 bg-green-100';
    if (grade >= 80) return 'text-blue-600 bg-blue-100';
    if (grade >= 70) return 'text-yellow-600 bg-yellow-100';
    if (grade >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getCompletionColor = (completion: number) => {
    if (completion >= 90) return 'bg-green-500';
    if (completion >= 70) return 'bg-blue-500';
    if (completion >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Academic Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Academic Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Academic Details</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <GraduationCap size={16} className="text-gray-400" />
              <div>
                <span className="text-sm text-gray-600">Admission Number</span>
                <div className="font-medium">{student.admissionNumber}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar size={16} className="text-gray-400" />
              <div>
                <span className="text-sm text-gray-600">Academic Year</span>
                <div className="font-medium">{student.academicYear}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <BookOpen size={16} className="text-gray-400" />
              <div>
                <span className="text-sm text-gray-600">Class</span>
                <div className="font-medium">{student.classId ? `Class ID: ${student.classId}` : 'Not assigned'}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users size={16} className="text-gray-400" />
              <div>
                <span className="text-sm text-gray-600">Subjects Enrolled</span>
                <div className="font-medium">{student.subjectIds?.length || 0} subjects</div>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Statistics */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Academic Performance</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target size={16} className="text-blue-600" />
                <span className="text-sm text-gray-600">Courses</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{academicStats.totalCourses}</div>
              <div className="text-xs text-gray-500">{academicStats.completedCourses} completed</div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Award size={16} className="text-green-600" />
                <span className="text-sm text-gray-600">Avg. Grade</span>
              </div>
              <div className={`text-2xl font-bold ${getGradeColor(academicStats.averageGrade).split(' ')[0]}`}>
                {academicStats.averageGrade}%
              </div>
              <div className="text-xs text-gray-500">Overall performance</div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={16} className="text-purple-600" />
                <span className="text-sm text-gray-600">Completion</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{academicStats.averageCompletion}%</div>
              <div className="text-xs text-gray-500">Average progress</div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 size={16} className="text-orange-600" />
                <span className="text-sm text-gray-600">Status</span>
              </div>
              <div className={`text-lg font-bold ${
                student.status === 'ACTIVE' ? 'text-green-600' :
                student.status === 'PENDING' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {student.status}
              </div>
              <div className="text-xs text-gray-500">{student.active ? 'Active' : 'Inactive'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Progress Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Course Progress</h3>
          <span className="text-sm text-gray-500">{courseProgress.length} courses</span>
        </div>

        {courseProgress.length > 0 ? (
          <div className="space-y-4">
            {courseProgress.map((course) => (
              <div key={course.courseId} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BookOpen size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{course.courseName}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Course ID: {course.courseId}</span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          Last activity: {formatDate(course.lastActivity)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(course.grade)}`}>
                      {course.grade}%
                    </div>
                    {course.completed && (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle size={16} />
                        <span className="text-sm font-medium">Completed</span>
                      </div>
                    )}
                    <button
                      onClick={() => dispatch(openModal({
                        title: 'Update Student Progress',
                        bodyType: MODAL_BODY_TYPES.UPDATE_STUDENT_PROGRESS,
                        extraObject: { ...student, courseId: course.courseId }
                      }))}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg flex items-center gap-1 text-sm transition-colors"
                    >
                      <Edit3 size={14} />
                      Update
                    </button>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{course.completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getCompletionColor(course.completionPercentage)}`}
                      style={{ width: `${course.completionPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <div className="text-gray-500 text-lg mb-2">No course progress data</div>
            <p className="text-gray-400">Student has not been enrolled in any courses yet.</p>
          </div>
        )}
      </div>

      {/* Enrollment Notes */}
      {student.onboardingNotes && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Onboarding Notes</h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">{student.onboardingNotes}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAcademicTab; 