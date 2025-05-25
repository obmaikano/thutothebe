import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { setPageTitle } from '../../../features/common/headerSlice';
import studentApi from '../../../api/services/studentApi';
import submissionApi from '../../../api/services/submissionApi';
import { BarChart3, TrendingUp, Award, BookOpen, AlertTriangle } from 'lucide-react';

interface Submission {
  id: number;
  assignmentId: number;
  studentId: number;
  content: string;
  submittedAt: string;
  score?: number;
  feedback?: string;
  status: 'PENDING' | 'GRADED' | 'LATE';
}

interface PerformanceData {
  studentId: number;
  studentName: string;
  admissionNumber: string;
  active: boolean;
}

const StudentGradesPage: React.FC = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [performance, setPerformance] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studentData, setStudentData] = useState<any>(null);
  const [noStudentRecord, setNoStudentRecord] = useState(false);
  const [creatingStudent, setCreatingStudent] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    overallGPA: 0,
    overallLetterGrade: 'N/A',
    totalCourses: 0,
    completionRate: 0,
    attendanceRate: 0
  });
  const [gradeDistribution, setGradeDistribution] = useState<any>({});
  const [grades, setGrades] = useState<any[]>([]);

  useEffect(() => {
    dispatch(setPageTitle({ title: "My Grades" }));
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchGradesData = async () => {
      if (!isAuthenticated || !user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Get student record first
        const studentResponse = await studentApi.getByUserId(user.id);
        if (studentResponse.data.status !== 'SUCCESS' || !studentResponse.data.data) {
          setError('Student profile not found. Please contact your administrator.');
          setLoading(false);
          return;
        }

        const student = Array.isArray(studentResponse.data.data) 
          ? studentResponse.data.data[0] 
          : studentResponse.data.data;

        if (!student) {
          setError('Student profile not found. Please contact your administrator.');
          setLoading(false);
          return;
        }

        setStudentData(student);

        // Fetch performance analytics (grades data)
        const performanceResponse = await studentApi.getPerformance(student.id);
        if (performanceResponse.data.status === 'SUCCESS') {
          const performanceData = performanceResponse.data.data as any;
          console.log('Performance data:', performanceData);
          
          // Set performance metrics
          setPerformanceMetrics({
            overallGPA: performanceData.overallGPA || 0,
            overallLetterGrade: performanceData.overallLetterGrade || 'N/A',
            totalCourses: performanceData.totalCourses || 0,
            completionRate: performanceData.completionRate || 0,
            attendanceRate: performanceData.attendanceRate || 0
          });

          // Set grade distribution
          if (performanceData.gradeDistribution) {
            setGradeDistribution(performanceData.gradeDistribution);
          }

          // Transform course grades for display
          if (performanceData.courseGrades && Array.isArray(performanceData.courseGrades)) {
            const transformedGrades = performanceData.courseGrades.map((courseGrade: any) => ({
              id: courseGrade.courseId,
              course: courseGrade.courseName,
              code: courseGrade.courseCode,
              assignments: courseGrade.assignments,
              averageScore: courseGrade.averageScore,
              letterGrade: courseGrade.letterGrade,
              gradePoints: courseGrade.gradePoints,
              credits: courseGrade.credits,
              assignmentGrades: courseGrade.assignmentGrades || []
            }));
            setGrades(transformedGrades);
          }
        } else {
          console.error('Failed to fetch performance data:', performanceResponse.data.message);
          setError('Failed to load performance data');
        }

      } catch (err: any) {
        console.error('Error fetching grades data:', err);
        if (err.response?.status === 404) {
          setError('Student profile not found. Please contact your administrator.');
        } else {
          setError(err.response?.data?.message || 'Failed to fetch grades data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGradesData();
  }, [user?.id, isAuthenticated]);

  const createStudentRecord = async () => {
    if (!user?.id) return;
    
    try {
      setCreatingStudent(true);
      console.log('Creating student record for user ID:', user.id);
      
      const response = await studentApi.createForUser(user.id);
      console.log('Create student response:', response.data);
      
      if (response.data.status === 'SUCCESS') {
        // Student record created successfully, refresh the page data
        setNoStudentRecord(false);
        setError(null);
        // Trigger a re-fetch of the data
        window.location.reload();
      } else {
        setError('Failed to create student record: ' + response.data.message);
      }
    } catch (err: any) {
      console.error('Error creating student record:', err);
      if (err.response?.status === 400 && err.response?.data?.message?.includes('school')) {
        setError('Cannot create student record: You must be assigned to a school first. Please contact your administrator.');
      } else {
        setError('Failed to create student record: ' + (err.response?.data?.message || err.message));
      }
    } finally {
      setCreatingStudent(false);
    }
  };

  const calculateAverageGrade = () => {
    const gradedSubmissions = submissions.filter(sub => sub.score !== undefined && sub.score !== null);
    if (gradedSubmissions.length === 0) return 0;
    
    const total = gradedSubmissions.reduce((sum, sub) => sum + (sub.score || 0), 0);
    return Math.round((total / gradedSubmissions.length) * 100) / 100;
  };

  const getGradeDistribution = () => {
    const gradedSubmissions = submissions.filter(sub => sub.score !== undefined && sub.score !== null);
    const distribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    
    gradedSubmissions.forEach(sub => {
      const score = sub.score || 0;
      if (score >= 90) distribution.A++;
      else if (score >= 80) distribution.B++;
      else if (score >= 70) distribution.C++;
      else if (score >= 60) distribution.D++;
      else distribution.F++;
    });
    
    return distribution;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getGradeColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getGradeLetter = (score: number) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Authentication Required</h3>
          <p className="mt-2 text-sm text-gray-500">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className={`border rounded-lg p-6 ${noStudentRecord ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertTriangle className={`h-5 w-5 ${noStudentRecord ? 'text-yellow-400' : 'text-red-400'}`} />
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${noStudentRecord ? 'text-yellow-800' : 'text-red-800'}`}>
                {noStudentRecord ? 'Student Profile Setup Required' : 'Error'}
              </h3>
              <div className={`mt-2 text-sm ${noStudentRecord ? 'text-yellow-700' : 'text-red-700'}`}>
                <p>{error}</p>
                {noStudentRecord && (
                  <div className="mt-4">
                    <p className="font-medium">What you can do:</p>
                    <ul className="mt-2 list-disc list-inside space-y-1">
                      <li>Contact your school administrator to complete your student profile setup</li>
                      <li>Ensure your account has been properly enrolled in the system</li>
                      <li>Check that you have been assigned to a class and school</li>
                    </ul>
                    <div className="mt-4">
                      <p className="text-sm">
                        <strong>Your User ID:</strong> {user?.id} <br />
                        <strong>Your Email:</strong> {user?.email} <br />
                        <strong>Your Role:</strong> {user?.role}
                      </p>
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={createStudentRecord}
                        disabled={creatingStudent}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                      >
                        {creatingStudent ? 'Creating...' : 'Create Student Profile'}
                      </button>
                      <p className="text-xs text-yellow-600 mt-2">
                        This will attempt to create your student profile automatically. You must be assigned to a school for this to work.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const averageGrade = performanceMetrics.overallGPA || 0;
  const completionRate = performanceMetrics.completionRate || 0;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Grades & Performance</h1>
          <p className="text-gray-600 mt-2">Track your academic progress and performance</p>
          {studentData && (
            <p className="text-sm text-gray-500 mt-1">
              Student: {studentData.firstName} {studentData.lastName} ({studentData.admissionNumber})
            </p>
          )}
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overall GPA</p>
              <p className={`text-2xl font-bold ${getGradeColor(averageGrade * 20)}`}>
                {averageGrade.toFixed(2)} ({performanceMetrics.overallLetterGrade})
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-green-600">{completionRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Award className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-purple-600">{performanceMetrics.totalCourses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BookOpen className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Attendance</p>
              <p className="text-2xl font-bold text-orange-600">
                {performanceMetrics.attendanceRate}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grade Distribution */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Grade Distribution</h3>
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(gradeDistribution).map(([grade, count]) => (
            <div key={grade} className="text-center">
              <div className="text-2xl font-bold text-gray-900">{count as number}</div>
              <div className="text-sm text-gray-600">Grade {grade}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Course Grades */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Course Grades</h3>
        </div>
        
        {grades.length === 0 ? (
          <div className="p-12 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No grades available</h3>
            <p className="mt-1 text-sm text-gray-500">
              You don't have any graded courses yet. Complete assignments to see your grades here.
            </p>
            {studentData && (
              <div className="mt-4 text-xs text-gray-400">
                <p>Student ID: {studentData.id}</p>
                <p>Status: {studentData.status}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assignments
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Average Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Letter Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credits
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {grades.map((courseGrade: any) => (
                  <tr key={courseGrade.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {courseGrade.course}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {courseGrade.code}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {courseGrade.assignments}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${getGradeColor(courseGrade.averageScore)}`}>
                        {courseGrade.averageScore.toFixed(1)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        courseGrade.letterGrade === 'A' ? 'bg-green-100 text-green-800'
                        : courseGrade.letterGrade === 'B' ? 'bg-blue-100 text-blue-800'
                        : courseGrade.letterGrade === 'C' ? 'bg-yellow-100 text-yellow-800'
                        : courseGrade.letterGrade === 'D' ? 'bg-orange-100 text-orange-800'
                        : 'bg-red-100 text-red-800'
                      }`}>
                        {courseGrade.letterGrade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {courseGrade.credits}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentGradesPage; 