import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useAuth } from '../../../contexts/AuthContext';
import { setPageTitle } from '../../common/headerSlice';
import analyticsApi from '../../../api/services/analyticsApi';
import studentPerformanceApi from '../../../api/services/studentPerformanceApi';
import { fetchClasses } from '../../classes/classesSlice';
import { fetchSubjects } from '../../subjects/subjectsSlice';
import { fetchCourses } from '../../courses/coursesSlice';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Award, 
  Target,
  BookOpen,
  Calendar,
  Download,
  RefreshCw,
  AlertTriangle,
  BarChart3,
  X
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface PerformanceMetrics {
  totalStudents: number;
  averagePerformance: number;
  courseCompletion: number;
  atRiskStudents: number;
}

interface TrendData {
  month: string;
  performance: number;
  completion: number;
}

interface SubjectData {
  subject: string;
  score: number;
}

interface RiskData {
  name: string;
  value: number;
  color: string;
}

const PerformanceDashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { classes } = useAppSelector(state => state.classes);
  const { subjects } = useAppSelector(state => state.subjects);
  const { courses } = useAppSelector(state => state.courses);

  // State management
  const [selectedTimeframe, setSelectedTimeframe] = useState<'WEEK' | 'MONTH' | 'TERM' | 'YEAR'>('MONTH');
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Performance data state
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    totalStudents: 0,
    averagePerformance: 0,
    courseCompletion: 0,
    atRiskStudents: 0
  });
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [subjectData, setSubjectData] = useState<SubjectData[]>([]);
  const [riskData, setRiskData] = useState<RiskData[]>([]);

  // Permission checks
  const canViewAllPerformance = user && [
    'SUPER_ADMIN',
    'MINISTRY_EXECUTIVE', 
    'MINISTRY_STAFF',
    'DIRECTOR',
    'REGIONAL_ADMIN',
    'REGIONAL_OFFICER',
    'SCHOOL_ADMIN',
    'SCHOOL_HEAD',
    'DEPARTMENT_HEAD'
  ].includes(user.role);

  const canExportData = user && [
    'SUPER_ADMIN',
    'MINISTRY_EXECUTIVE',
    'MINISTRY_STAFF',
    'DIRECTOR',
    'REGIONAL_ADMIN',
    'SCHOOL_ADMIN',
    'SCHOOL_HEAD',
    'DEPARTMENT_HEAD'
  ].includes(user.role);

  useEffect(() => {
    dispatch(setPageTitle({ title: "Performance Analytics" }));
  }, [dispatch]);

  useEffect(() => {
    if (canViewAllPerformance) {
      // Load initial data
      dispatch(fetchClasses());
      dispatch(fetchSubjects());
      dispatch(fetchCourses());
      loadDashboardData();
    }
  }, [dispatch, canViewAllPerformance]);

  useEffect(() => {
    if (canViewAllPerformance) {
      loadDashboardData();
    }
  }, [selectedTimeframe, selectedClass, selectedCourse]);

  const loadDashboardData = async () => {
    if (!canViewAllPerformance) return;

    setLoading(true);
    setError(null);

    try {
      const params = {
        timeframe: selectedTimeframe,
        ...(user?.schoolId && { schoolId: user.schoolId }),
        ...(user?.regionId && { regionId: user.regionId }),
        ...(selectedCourse && { courseId: selectedCourse })
      };

      // Fetch analytics dashboard data
      const analyticsResponse = await analyticsApi.getDashboardData(params);
      const analyticsData = analyticsResponse.data.data;

      // Fetch student performance data
      const performanceResponse = await studentPerformanceApi.getAll();
      const performanceData = Array.isArray(performanceResponse.data.data) ? performanceResponse.data.data : [];

      // Process analytics data
      if (analyticsData) {
        const data = Array.isArray(analyticsData) ? analyticsData[0] : analyticsData;
        
        setPerformanceMetrics({
          totalStudents: performanceData.length,
          averagePerformance: data?.metrics?.averagePerformance || 0,
          courseCompletion: data?.metrics?.comparativeData?.classAverage || 0,
          atRiskStudents: performanceData.filter(p => p.averageGrade < 50).length
        });

        // Process trend data
        if (data?.charts?.performanceTrend) {
          setTrendData(
            data.charts.performanceTrend.map((item: any, index: number) => ({
              month: new Date(item.date).toLocaleDateString('en-US', { month: 'short' }),
              performance: item.value,
              completion: item.benchmark || item.value + Math.random() * 10 - 5
            }))
          );
        }

        // Process subject breakdown data
        if (data?.charts?.subjectBreakdown) {
          setSubjectData(
            data.charts.subjectBreakdown.map((item: any) => ({
              subject: item.subject,
              score: item.score
            }))
          );
        }

        // Process risk distribution
        const riskLevels = data?.metrics?.predictiveInsights?.riskLevel || 'LOW';
        const totalStudents = performanceData.length;
        
        if (totalStudents > 0) {
          setRiskData([
            { 
              name: 'Low Risk', 
              value: Math.round(totalStudents * 0.7), 
              color: '#10B981' 
            },
            { 
              name: 'Medium Risk', 
              value: Math.round(totalStudents * 0.25), 
              color: '#F59E0B' 
            },
            { 
              name: 'High Risk', 
              value: Math.round(totalStudents * 0.05), 
              color: '#EF4444' 
            }
          ]);
        }
      }

    } catch (err: any) {
      console.error('Failed to load performance data:', err);
      setError(err.message || 'Failed to load performance data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleExport = async () => {
    if (!canExportData) return;
    
    try {
      const params = {
        type: 'SCHOOL' as const,
        id: user?.schoolId || 0,
        format: 'PDF' as const,
        timeframe: selectedTimeframe
      };
      
      const response = await analyticsApi.exportAnalytics(params);
      if (response.data.downloadUrl) {
        window.open(response.data.downloadUrl, '_blank');
      }
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  if (!canViewAllPerformance) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="alert alert-warning">
          <AlertTriangle className="w-5 h-5" />
          <span>You don't have permission to view performance analytics.</span>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Performance Analytics</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Comprehensive view of student and institutional performance
                </p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value as 'WEEK' | 'MONTH' | 'TERM' | 'YEAR')}
                  className="select select-bordered select-sm"
                >
                  <option value="WEEK">This Week</option>
                  <option value="MONTH">This Month</option>
                  <option value="TERM">This Term</option>
                  <option value="YEAR">This Year</option>
                </select>
                
                {courses.length > 0 && (
                  <select
                    value={selectedCourse || ''}
                    onChange={(e) => setSelectedCourse(e.target.value ? Number(e.target.value) : null)}
                    className="select select-bordered select-sm"
                  >
                    <option value="">All Courses</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                )}

                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="btn btn-sm btn-outline"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                
                {canExportData && (
                  <button
                    onClick={handleExport}
                    className="btn btn-sm btn-primary"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="alert alert-error mb-6">
            <AlertTriangle className="w-5 h-5" />
            <span>{error}</span>
            <button 
              onClick={() => setError(null)}
              className="btn btn-sm btn-ghost"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-3xl font-bold text-gray-900">{performanceMetrics.totalStudents.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Performance</p>
                <p className="text-3xl font-bold text-gray-900">{performanceMetrics.averagePerformance.toFixed(1)}%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 ml-1">+2.3% from last month</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Award className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Course Completion</p>
                <p className="text-3xl font-bold text-gray-900">{performanceMetrics.courseCompletion.toFixed(1)}%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 ml-1">+1.8% from last month</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Target className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">At-Risk Students</p>
                <p className="text-3xl font-bold text-gray-900">{performanceMetrics.atRiskStudents}</p>
                <div className="flex items-center mt-1">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-600 ml-1">-5 from last month</span>
                </div>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <BookOpen className="h-8 w-8 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Performance Trends */}
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Performance Trends</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                {selectedTimeframe}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="performance" stroke="#3B82F6" strokeWidth={2} name="Performance %" />
                <Line type="monotone" dataKey="completion" stroke="#10B981" strokeWidth={2} name="Completion %" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Risk Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Student Risk Distribution</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              {riskData.map((entry, index) => (
                <div key={entry.name} className="text-sm">
                  <div className="font-medium" style={{ color: entry.color }}>
                    {entry.value}
                  </div>
                  <div className="text-gray-500">{entry.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Subject Performance */}
        {subjectData.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Subject Performance</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* No Data State */}
        {performanceMetrics.totalStudents === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 border text-center">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Performance Data Available</h3>
            <p className="text-gray-500">
              No performance data found for the selected timeframe and filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceDashboardPage; 