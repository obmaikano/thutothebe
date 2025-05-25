import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchAllProgress, fetchProgressByCourse } from '../../progress/progressSlice';
import { fetchStudents } from '../studentsSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { Progress } from '../../../api/services/progressApi';
import { Student } from '../../../api/services/studentApi';
import { 
  TrendingUp, Users, BookOpen, Award, Search, Filter, 
  BarChart3, Target, Clock, CheckCircle, AlertCircle,
  Edit3, Eye, Download, RefreshCw
} from 'lucide-react';

interface StudentProgressData {
  student: Student;
  progress: Progress[];
  averageGrade: number;
  averageCompletion: number;
  completedCourses: number;
  totalCourses: number;
}

export const StudentProgressPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { progressRecords, status: progressStatus } = useAppSelector(state => state.progress);
  const { students, status: studentsStatus } = useAppSelector(state => state.students);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [studentProgressData, setStudentProgressData] = useState<StudentProgressData[]>([]);
  const [overallStats, setOverallStats] = useState({
    totalStudents: 0,
    averageGrade: 0,
    averageCompletion: 0,
    studentsAtRisk: 0
  });

  useEffect(() => {
    dispatch(fetchAllProgress());
    dispatch(fetchStudents());
  }, [dispatch]);

  useEffect(() => {
    if (students && progressRecords && Array.isArray(students) && Array.isArray(progressRecords)) {
      // Group progress by student
      const progressByStudent = progressRecords.reduce((acc: Record<number, Progress[]>, progress: Progress) => {
        if (!acc[progress.studentId]) {
          acc[progress.studentId] = [];
        }
        acc[progress.studentId].push(progress);
        return acc;
      }, {});

      // Create student progress data
      const data: StudentProgressData[] = students.map((student: Student) => {
        const studentProgress = progressByStudent[student.id] || [];
        const totalCourses = studentProgress.length;
        const completedCourses = studentProgress.filter(p => p.completed).length;
        const averageGrade = totalCourses > 0 
          ? studentProgress.reduce((sum, p) => sum + p.grade, 0) / totalCourses 
          : 0;
        const averageCompletion = totalCourses > 0 
          ? studentProgress.reduce((sum, p) => sum + p.completionPercentage, 0) / totalCourses 
          : 0;

        return {
          student,
          progress: studentProgress,
          averageGrade: Math.round(averageGrade * 100) / 100,
          averageCompletion: Math.round(averageCompletion * 100) / 100,
          completedCourses,
          totalCourses
        };
      });

      setStudentProgressData(data);

      // Calculate overall statistics
      const totalStudents = data.length;
      const overallAverageGrade = totalStudents > 0 
        ? data.reduce((sum, d) => sum + d.averageGrade, 0) / totalStudents 
        : 0;
      const overallAverageCompletion = totalStudents > 0 
        ? data.reduce((sum, d) => sum + d.averageCompletion, 0) / totalStudents 
        : 0;
      const studentsAtRisk = data.filter(d => d.averageGrade < 60 || d.averageCompletion < 50).length;

      setOverallStats({
        totalStudents,
        averageGrade: Math.round(overallAverageGrade * 100) / 100,
        averageCompletion: Math.round(overallAverageCompletion * 100) / 100,
        studentsAtRisk
      });
    }
  }, [students, progressRecords]);

  const filteredData = studentProgressData.filter(data => {
    const matchesSearch = data.student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         data.student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         data.student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'at-risk' && (data.averageGrade < 60 || data.averageCompletion < 50)) ||
                         (statusFilter === 'excellent' && data.averageGrade >= 90) ||
                         (statusFilter === 'good' && data.averageGrade >= 80 && data.averageGrade < 90);

    return matchesSearch && matchesStatus;
  });

  const handleUpdateProgress = (student: Student, courseId?: number) => {
    dispatch(openModal({
      title: 'Update Student Progress',
      bodyType: MODAL_BODY_TYPES.UPDATE_STUDENT_PROGRESS,
      extraObject: { ...student, courseId: courseId || 1 }
    }));
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-blue-600';
    if (grade >= 70) return 'text-yellow-600';
    if (grade >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getCompletionColor = (completion: number) => {
    if (completion >= 90) return 'bg-green-500';
    if (completion >= 70) return 'bg-blue-500';
    if (completion >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getPerformanceStatus = (grade: number, completion: number) => {
    if (grade < 60 || completion < 50) return { label: 'At Risk', color: 'text-red-600', icon: AlertCircle };
    if (grade >= 90 && completion >= 90) return { label: 'Excellent', color: 'text-green-600', icon: CheckCircle };
    if (grade >= 80) return { label: 'Good', color: 'text-blue-600', icon: Target };
    return { label: 'Satisfactory', color: 'text-yellow-600', icon: Clock };
  };

  if (progressStatus === 'loading' || studentsStatus === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Progress Tracking</h1>
          <p className="text-gray-600">Monitor and manage student academic progress</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              dispatch(fetchAllProgress());
              dispatch(fetchStudents());
            }}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">Total Students</h3>
              <div className="text-2xl font-bold text-gray-900">{overallStats.totalStudents}</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Award size={20} className="text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">Average Grade</h3>
              <div className={`text-2xl font-bold ${getGradeColor(overallStats.averageGrade)}`}>
                {overallStats.averageGrade}%
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp size={20} className="text-purple-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">Average Completion</h3>
              <div className="text-2xl font-bold text-gray-900">{overallStats.averageCompletion}%</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle size={20} className="text-red-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">Students at Risk</h3>
              <div className="text-2xl font-bold text-red-600">{overallStats.studentsAtRisk}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or admission number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Students</option>
              <option value="excellent">Excellent (90%+)</option>
              <option value="good">Good (80-89%)</option>
              <option value="at-risk">At Risk (&lt;60%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Student Progress Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Student Progress Overview</h3>
          <p className="text-sm text-gray-600">{filteredData.length} students</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Courses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Average Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((data) => {
                const status = getPerformanceStatus(data.averageGrade, data.averageCompletion);
                const StatusIcon = status.icon;
                
                return (
                  <tr key={data.student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-full mr-3">
                          <Users size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {data.student.firstName} {data.student.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{data.student.admissionNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{data.totalCourses} total</div>
                      <div className="text-sm text-gray-500">{data.completedCourses} completed</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${getGradeColor(data.averageGrade)}`}>
                        {data.averageGrade}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${getCompletionColor(data.averageCompletion)}`}
                            style={{ width: `${data.averageCompletion}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{data.averageCompletion}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center gap-1 ${status.color}`}>
                        <StatusIcon size={16} />
                        <span className="text-sm font-medium">{status.label}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => window.open(`/app/students/${data.student.id}`, '_blank')}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleUpdateProgress(data.student)}
                          className="text-green-600 hover:text-green-900 p-1 rounded"
                          title="Update Progress"
                        >
                          <Edit3 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-8">
            <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <div className="text-gray-500 text-lg mb-2">No students found</div>
            <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProgressPage; 