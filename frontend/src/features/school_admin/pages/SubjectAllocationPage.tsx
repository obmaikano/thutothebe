import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useAuth } from '../../../features/auth/hooks';
import { 
  fetchCourses, 
  fetchCourseById, 
  createCourse, 
  updateCourse, 
  deleteCourse,
  addTeacherToCourse,
  removeTeacherFromCourse
} from '../../courses/coursesSlice';
import { fetchClasses } from '../../classes/classesSlice';
import { fetchTeachers } from '../../teachers/teachersSlice';
import { fetchSubjects } from '../../subjects/subjectsSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { useSubjectAllocationRealtime } from '../hooks/useSubjectAllocationRealtime';
import { 
  Plus, 
  Users, 
  BookOpen, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar,
  CheckCircle,
  Clock,
  BarChart3,
  User,
  RefreshCw,
  Wifi,
  WifiOff,
  AlertCircle
} from 'lucide-react';
import courseApi, { Course } from '../../../api/services/courseApi';
import subjectApi from '../../../api/services/subjectApi';
import teacherApi from '../../../api/services/teacherApi';
import classApi from '../../../api/services/classApi';
import { getRealCourseProgress, getRealTeacherWorkload, CourseProgressData, TeacherWorkloadData } from '../../../utils/subjectAllocationProgressUtils';

// Card component for statistics
const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 ${className}`}>
    {children}
  </div>
);

export const SubjectAllocationPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { courses, status, error } = useAppSelector(state => state.courses);
  const { teachers } = useAppSelector(state => state.teachers);
  const { classes } = useAppSelector(state => state.classes);
  const { subjects } = useAppSelector(state => state.subjects);

  // Real-time data
  const { connected, workloadStats, allocations: realtimeAllocations, refreshData } = useSubjectAllocationRealtime();

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [courseProgressData, setCourseProgressData] = useState<Map<number, CourseProgressData>>(new Map());
  const [teacherWorkloadData, setTeacherWorkloadData] = useState<TeacherWorkloadData[]>([]);

  // Transform courses data to allocation format with real backend data
  const transformCourseToAllocation = async (course: Course) => {
    const subject = subjects.find(s => s.id === course.subjectId);
    const classEntity = classes.find(c => c.id === course.classId);
    const teacher = teachers.find(t => course.instructorIds.includes(t.id));
    
    // Get real progress data
    const progressData = courseProgressData.get(course.id) || await getRealCourseProgress(course);
    
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

  // Load real progress data for all courses
  const loadRealProgressData = async () => {
    try {
      setLoading(true);
      
      // Load course progress data
      const progressPromises = courses.map(async (course) => {
        const progressData = await getRealCourseProgress(course);
        return [course.id, progressData] as [number, CourseProgressData];
      });
      
      const progressResults = await Promise.all(progressPromises);
      const progressMap = new Map(progressResults);
      setCourseProgressData(progressMap);
      
      // Load teacher workload data
      const workloadData = await getRealTeacherWorkload(teachers, courses);
      setTeacherWorkloadData(workloadData);
      
    } catch (error: any) {
      console.error('Error loading real progress data:', error);
      setApiError('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  // Use real-time allocations if available, otherwise transform courses data
  const [allocations, setAllocations] = useState<any[]>([]);

  useEffect(() => {
    const loadAllocations = async () => {
      if (realtimeAllocations.length > 0) {
        setAllocations(realtimeAllocations);
      } else {
        const transformedAllocations = await Promise.all(courses.map(transformCourseToAllocation));
        setAllocations(transformedAllocations);
      }
    };

    if (courses.length > 0 && subjects.length > 0 && classes.length > 0 && teachers.length > 0) {
      loadAllocations();
    }
  }, [courses, subjects, classes, teachers, courseProgressData, realtimeAllocations]);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setApiError(null);
      try {
        await Promise.all([
          dispatch(fetchCourses()),
          dispatch(fetchTeachers()),
          dispatch(fetchClasses()),
          dispatch(fetchSubjects())
        ]);
      } catch (error: any) {
        console.error('Error loading data:', error);
        setApiError(error.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dispatch]);

  // Load real progress data when courses are available
  useEffect(() => {
    if (courses.length > 0 && teachers.length > 0) {
      loadRealProgressData();
    }
  }, [courses, teachers]);

  // Handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    setApiError(null);
    try {
      await Promise.all([
        dispatch(fetchCourses()),
        dispatch(fetchTeachers()),
        dispatch(fetchClasses()),
        dispatch(fetchSubjects()),
        refreshData(),
        loadRealProgressData()
      ]);
    } catch (error: any) {
      console.error('Error refreshing data:', error);
      setApiError(error.message || 'Failed to refresh data');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAllocateSubject = () => {
    // Check if we have subjects available
    if (subjects.length === 0) {
      setApiError('No subjects available. Please create subjects first.');
      return;
    }

    // Get teachers already assigned to subjects
    const assignedTeachers = courses
      .map(course => {
        const teacher = teachers.find(t => course.instructorIds.includes(t.id));
        return teacher;
      })
      .filter(Boolean);

    dispatch(openModal({
      title: 'Assign Teachers to Subject',
      bodyType: MODAL_BODY_TYPES.SUBJECT_ASSIGN_TEACHER,
      extraObject: { 
        subjects,
        teachers,
        classes,
        assignedTeachers
      }
    }));
  };

  const handleEditAllocation = (allocation: any) => {
    dispatch(openModal({
      title: 'Edit Subject Allocation',
      bodyType: MODAL_BODY_TYPES.SUBJECT_ALLOCATION_EDIT,
      extraObject: { 
        allocation,
        classes,
        teachers,
        subjects
      }
    }));
  };

  const handleRemoveAllocation = async (allocation: any) => {
    dispatch(openModal({
      title: 'Delete Subject Allocation',
      bodyType: MODAL_BODY_TYPES.SUBJECT_ALLOCATION_DELETE,
      extraObject: { 
        allocation
      }
    }));
  };

  const handleViewProgress = (allocation: any) => {
    dispatch(openModal({
      title: 'Subject Allocation Details',
      bodyType: MODAL_BODY_TYPES.SUBJECT_ALLOCATION_VIEW,
      extraObject: { 
        allocation,
        classes,
        teachers,
        subjects
      }
    }));
  };

  const handleBulkAllocation = () => {
    dispatch(openModal({
      title: 'Bulk Subject Allocation',
      bodyType: MODAL_BODY_TYPES.SUBJECT_ASSIGN_TEACHER,
      extraObject: { 
        bulk: true,
        classes,
        teachers,
        subjects
      }
    }));
  };

  const filteredAllocations = allocations.filter(allocation => {
    const matchesSearch = 
      allocation.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      allocation.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      allocation.class.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSubject = filterSubject === '' || allocation.subject === filterSubject;
    const matchesStatus = filterStatus === '' || allocation.status === filterStatus;
    const matchesClass = selectedClass === null || allocation.classId === selectedClass;

    return matchesSearch && matchesSubject && matchesStatus && matchesClass;
  });

  const getStatistics = () => {
    const total = allocations.length;
    const active = allocations.filter(a => a.status === 'ACTIVE').length;
    const pending = allocations.filter(a => a.status === 'PENDING').length;
    const avgProgress = total > 0 ? Math.round(allocations.reduce((sum, a) => sum + a.progress, 0) / total) : 0;
    
    return { total, active, pending, avgProgress };
  };

  const stats = getStatistics();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'SUSPENDED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading subject allocations...</p>
        </div>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-800 font-medium">Error loading data</p>
          </div>
          <p className="text-red-700 mb-4">{apiError}</p>
          <button 
            onClick={handleRefresh}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subject Allocation</h1>
          <p className="text-gray-600 mt-2">Allocate subjects to teachers and monitor curriculum delivery</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleBulkAllocation}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Users size={16} />
            Bulk Allocation
          </button>
          <button 
            onClick={handleAllocateSubject} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={16} />
            Allocate Subject
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleAllocateSubject}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Plus className="text-blue-600" size={20} />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Allocate Subject</h4>
                <p className="text-sm text-gray-600">Assign a subject to a teacher</p>
              </div>
            </div>
          </button>
          
          <button
            onClick={handleBulkAllocation}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="text-purple-600" size={20} />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Bulk Allocation</h4>
                <p className="text-sm text-gray-600">Allocate multiple subjects at once</p>
              </div>
            </div>
          </button>
          
          <button
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <BarChart3 className="text-green-600" size={20} />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Progress Reports</h4>
                <p className="text-sm text-gray-600">View curriculum delivery reports</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <BookOpen size={20} className="text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-500">Total Allocations</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.active}</div>
              <div className="text-sm text-gray-500">Active</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg mr-3">
              <Clock size={20} className="text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
              <div className="text-sm text-gray-500">Pending</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <BarChart3 size={20} className="text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.avgProgress}%</div>
              <div className="text-sm text-gray-500">Avg Progress</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search allocations by subject, teacher, or class..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Class Filter */}
          <div className="flex items-center gap-2">
            <Users size={16} className="text-gray-500" />
            <select
              value={selectedClass || ''}
              onChange={(e) => setSelectedClass(e.target.value ? Number(e.target.value) : null)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Classes</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Filter */}
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-gray-500" />
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Allocations Table */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject & Teacher
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class & Term
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lessons
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assessments
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Update
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAllocations.map((allocation) => (
                <tr key={allocation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <BookOpen size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{allocation.subject}</div>
                        <div className="text-sm text-gray-500">{allocation.teacher}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{allocation.class}</div>
                    <div className="text-sm text-gray-500">{allocation.term}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(allocation.status)}`}>
                      {allocation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900 mr-2">{allocation.progress}%</div>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getProgressColor(allocation.progress)}`}
                          style={{ width: `${allocation.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {allocation.completedLessons}/{allocation.totalLessons}
                    </div>
                    <div className="text-sm text-gray-500">completed</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{allocation.assessments}</div>
                    <div className="text-sm text-gray-500">assessments</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-900">{formatDate(allocation.lastUpdate)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => handleViewProgress(allocation)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="View Progress"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleEditAllocation(allocation)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Edit Allocation"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleRemoveAllocation(allocation)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Remove Allocation"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAllocations.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <div className="text-gray-500 text-lg mb-2">
              {searchTerm || filterSubject || filterStatus || selectedClass ? 'No allocations found matching your criteria' : 'No subject allocations found'}
            </div>
            {!searchTerm && !filterSubject && !filterStatus && !selectedClass && (
              <button
                onClick={handleAllocateSubject}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
              >
                <Plus size={16} />
                Create First Allocation
              </button>
            )}
          </div>
        )}
      </div>

      {/* Teacher Workload Overview */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Teacher Workload Overview</h3>
          <div className="flex items-center gap-3">
            {/* Connection Status */}
            <div className="flex items-center gap-2">
              {connected ? (
                <Wifi className="h-4 w-4 text-green-600" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-600" />
              )}
              <span className={`text-sm ${connected ? 'text-green-600' : 'text-red-600'}`}>
                {connected ? 'Live Updates' : 'Offline'}
              </span>
            </div>
            
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          {teacherWorkloadData.length > 0 ? teacherWorkloadData.slice(0, 5).map(teacher => (
            <div key={teacher.teacherId} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="text-blue-600" size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{teacher.teacherName}</h4>
                  <p className="text-sm text-gray-600">{teacher.totalCourses} subjects allocated</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{Math.round(teacher.averageProgress)}% Progress</p>
                  <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                    <div 
                      className="h-full bg-blue-600 rounded-full transition-all duration-300" 
                      style={{ width: `${teacher.averageProgress}%` }}
                    ></div>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  teacher.workloadLevel === 'LIGHT' ? 'bg-green-100 text-green-800' :
                  teacher.workloadLevel === 'MODERATE' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {teacher.workloadLevel}
                </span>
              </div>
            </div>
          )) : workloadStats.length > 0 ? workloadStats.slice(0, 5).map(teacher => (
            <div key={teacher.teacherId} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="text-blue-600" size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{teacher.teacherName}</h4>
                  <p className="text-sm text-gray-600">{teacher.workload} subjects allocated</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{teacher.avgProgress}% Progress</p>
                  <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                    <div 
                      className="h-full bg-blue-600 rounded-full transition-all duration-300" 
                      style={{ width: `${teacher.avgProgress}%` }}
                    ></div>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  teacher.status === 'LIGHT' ? 'bg-green-100 text-green-800' :
                  teacher.status === 'MODERATE' ? 'bg-yellow-100 text-yellow-800' :
                  teacher.status === 'HEAVY' ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {teacher.status}
                </span>
              </div>
            </div>
          )) : teachers.slice(0, 5).map(teacher => {
            const teacherAllocations = allocations.filter(a => a.teacherId === teacher.id);
            const workload = teacherAllocations.length;
            const avgProgress = teacherAllocations.length > 0 
              ? teacherAllocations.reduce((sum, a) => sum + a.progress, 0) / teacherAllocations.length 
              : 0;

            return (
              <div key={teacher.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{teacher.firstName} {teacher.lastName}</h4>
                    <p className="text-sm text-gray-600">{workload} subjects allocated</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{Math.round(avgProgress)}% Progress</p>
                    <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                      <div 
                        className="h-full bg-blue-600 rounded-full" 
                        style={{ width: `${avgProgress}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    workload <= 3 ? 'bg-green-100 text-green-800' :
                    workload <= 5 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {workload <= 3 ? 'Light' : workload <= 5 ? 'Moderate' : 'Heavy'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        
        {teacherWorkloadData.length === 0 && workloadStats.length === 0 && teachers.length === 0 && (
          <div className="text-center py-8">
            <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No teacher data available</p>
          </div>
        )}
      </div>
    </div>
  );
}; 