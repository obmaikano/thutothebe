import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchStudentPerformances } from '../studentPerformanceSlice';
import { fetchStudents } from '../../students/studentsSlice';
import { fetchCourses } from '../../courses/coursesSlice';
import DataTable from 'react-data-table-component';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertTriangle
} from 'lucide-react';

const StudentPerformancePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { performances, status, error } = useAppSelector(state => state.studentPerformance);
  const { students } = useAppSelector(state => state.students);
  const { courses } = useAppSelector(state => state.courses);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPerformances, setFilteredPerformances] = useState(performances);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [performanceFilter, setPerformanceFilter] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, [dispatch]);

  useEffect(() => {
    filterPerformances();
  }, [performances, searchTerm, selectedCourse, performanceFilter]);

  const loadData = async () => {
    await Promise.all([
      dispatch(fetchStudentPerformances()),
      dispatch(fetchStudents()),
      dispatch(fetchCourses())
    ]);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const filterPerformances = () => {
    let filtered = performances;

    if (searchTerm) {
      filtered = filtered.filter((performance) => {
        const student = students.find(s => s.id === performance.studentId);
        const course = courses.find(c => c.id === performance.courseId);
        const studentName = student ? `${student.firstName} ${student.lastName}` : '';
        const courseName = course ? course.name : '';
        
        return (
          studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (student?.admissionNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    if (selectedCourse) {
      filtered = filtered.filter(performance => 
        performance.courseId === parseInt(selectedCourse)
      );
    }

    if (performanceFilter) {
      filtered = filtered.filter(performance => {
        switch (performanceFilter) {
          case 'high': return performance.averageGrade >= 80;
          case 'medium': return performance.averageGrade >= 60 && performance.averageGrade < 80;
          case 'low': return performance.averageGrade < 60;
          default: return true;
        }
      });
    }

    setFilteredPerformances(filtered);
  };

  const getPerformanceStatus = (grade: number) => {
    if (grade >= 80) return { label: 'Excellent', color: 'badge-success' };
    if (grade >= 70) return { label: 'Good', color: 'badge-info' };
    if (grade >= 60) return { label: 'Average', color: 'badge-warning' };
    return { label: 'Needs Improvement', color: 'badge-error' };
  };

  const getStudentName = (studentId: number) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : 'Unknown Student';
  };

  const getCourseName = (courseId: number) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.name : 'Unknown Course';
  };

  const getAdmissionNumber = (studentId: number) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.admissionNumber : 'N/A';
  };

  const formatTimeSpent = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const columns = [
    {
      name: 'Student',
      selector: (row: any) => getStudentName(row.studentId),
      sortable: true,
      minWidth: '200px',
      cell: (row: any) => {
        const student = students.find(s => s.id === row.studentId);
        return (
          <div className="flex flex-col">
            <span className="font-medium">{getStudentName(row.studentId)}</span>
            <span className="text-sm text-gray-500">{getAdmissionNumber(row.studentId)}</span>
          </div>
        );
      },
    },
    {
      name: 'Course',
      selector: (row: any) => getCourseName(row.courseId),
      sortable: true,
      minWidth: '180px',
    },
    {
      name: 'Average Grade',
      selector: (row: any) => row.averageGrade,
      sortable: true,
      cell: (row: any) => {
        const status = getPerformanceStatus(row.averageGrade);
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium">{row.averageGrade.toFixed(1)}%</span>
            <span className={`badge badge-sm ${status.color}`}>
              {status.label}
            </span>
          </div>
        );
      },
    },
    {
      name: 'Submissions',
      selector: (row: any) => row.totalSubmissions,
      sortable: true,
      center: true,
    },
    {
      name: 'Forum Posts',
      selector: (row: any) => row.forumPosts,
      sortable: true,
      center: true,
    },
    {
      name: 'Login Count',
      selector: (row: any) => row.loginCount,
      sortable: true,
      center: true,
    },
    {
      name: 'Time Spent',
      selector: (row: any) => row.timeSpentMinutes,
      sortable: true,
      cell: (row: any) => formatTimeSpent(row.timeSpentMinutes),
    },
    {
      name: 'Last Updated',
      selector: (row: any) => row.lastUpdated,
      sortable: true,
      cell: (row: any) => new Date(row.lastUpdated).toLocaleDateString(),
    },
    {
      name: 'Actions',
      cell: (row: any) => (
        <div className="flex items-center gap-1">
          <button
            className="btn btn-xs btn-ghost"
            onClick={() => handleViewDetails(row)}
            title="View Details"
          >
            <Eye className="h-3 w-3" />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const handleViewDetails = (performance: any) => {
    // TODO: Navigate to detailed performance view
    console.log('View details for:', performance);
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export performance data');
  };

  const canViewAllPerformance = user && [
    'SUPER_ADMIN',
    'MINISTRY_EXECUTIVE',
    'MINISTRY_STAFF',
    'DIRECTOR',
    'REGIONAL_ADMIN',
    'REGIONAL_OFFICER',
    'SCHOOL_ADMIN',
    'SCHOOL_HEAD',
    'DEPARTMENT_HEAD',
    'SENIOR_TEACHER',
    'TEACHER'
  ].includes(user.role);

  if (status === 'loading') {
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
                <h1 className="text-3xl font-bold text-gray-900">Student Performance</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Monitor and analyze individual student performance metrics
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="btn btn-sm btn-outline"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                <button
                  onClick={handleExport}
                  className="btn btn-sm btn-primary"
                >
                  <Download className="h-4 w-4" />
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="alert alert-error mb-6">
            <span>{error}</span>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">{filteredPerformances.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Performance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredPerformances.length > 0
                    ? (filteredPerformances.reduce((sum, p) => sum + p.averageGrade, 0) / filteredPerformances.length).toFixed(1)
                    : '0.0'
                  }%
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Performers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredPerformances.filter(p => p.averageGrade >= 80).length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">At Risk</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredPerformances.filter(p => p.averageGrade < 60).length}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 border mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students or courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-bordered w-full pl-10"
              />
            </div>

            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="">All Courses</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>

            <select
              value={performanceFilter}
              onChange={(e) => setPerformanceFilter(e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="">All Performance Levels</option>
              <option value="high">High (80%+)</option>
              <option value="medium">Medium (60-79%)</option>
              <option value="low">Low (&lt;60%)</option>
            </select>

            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCourse('');
                setPerformanceFilter('');
              }}
              className="btn btn-outline"
            >
              <Filter className="h-4 w-4" />
              Clear Filters
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          <DataTable
            columns={columns}
            data={filteredPerformances}
            pagination
            paginationPerPage={20}
            paginationRowsPerPageOptions={[10, 20, 50, 100]}
            responsive
            highlightOnHover
            striped
            noDataComponent={
              <div className="text-center py-8">
                <p className="text-gray-500">No performance data found</p>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default StudentPerformancePage; 