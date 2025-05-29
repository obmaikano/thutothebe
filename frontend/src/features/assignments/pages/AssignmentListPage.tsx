import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { 
  fetchAssignments, 
  clearAssignmentsError, 
  publishAssignment,
  closeAssignment,
  archiveAssignment,
  deleteAssignment
} from '../assignmentsSlice';
import { fetchCourses } from '../../courses/coursesSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { Assignment } from '../../../api/services/assignmentApi';
import AssignmentCard from '../components/AssignmentCard';
import AssignmentFilters from '../components/AssignmentFilters';
import { 
  Plus, 
  BarChart3,
  FileText,
  Users,
  Calendar,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Archive
} from 'lucide-react';

const AssignmentListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { assignments, status, error } = useAppSelector(state => state.assignments);
  const { courses } = useAppSelector(state => state.courses);
  const { user } = useAppSelector(state => state.auth);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [dueDateFilter, setDueDateFilter] = useState('');

  useEffect(() => {
    dispatch(fetchAssignments());
    dispatch(fetchCourses());
    return () => {
      dispatch(clearAssignmentsError());
    };
  }, [dispatch]);

  // Helper functions
  const getCourseName = (courseId: number) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.name : `Course ${courseId}`;
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const isDueToday = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    return today.toDateString() === due.toDateString();
  };

  const isDueThisWeek = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return due >= today && due <= weekFromNow;
  };

  const isDueNextWeek = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const twoWeeksFromNow = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
    return due > weekFromNow && due <= twoWeeksFromNow;
  };

  const isDueThisMonth = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    return today.getMonth() === due.getMonth() && today.getFullYear() === due.getFullYear();
  };

  // Event handlers
  const handleCreateAssignment = () => {
    dispatch(openModal({
      title: 'Create New Assignment',
      bodyType: MODAL_BODY_TYPES.ASSIGNMENT_ADD_NEW,
      size: 'lg'
    }));
  };

  const handleEdit = (assignment: Assignment) => {
    dispatch(openModal({
      title: 'Edit Assignment',
      bodyType: MODAL_BODY_TYPES.ASSIGNMENT_EDIT,
      extraObject: assignment,
      size: 'lg'
    }));
  };

  const handleViewDetails = (assignment: Assignment) => {
    dispatch(openModal({
      title: 'Assignment Details',
      bodyType: MODAL_BODY_TYPES.ASSIGNMENT_VIEW_DETAILS,
      extraObject: assignment,
      size: 'lg'
    }));
  };

  const handleViewSubmissions = (assignment: Assignment) => {
    dispatch(openModal({
      title: 'Assignment Submissions',
      bodyType: MODAL_BODY_TYPES.ASSIGNMENT_VIEW_SUBMISSIONS,
      extraObject: assignment,
      size: 'xl'
    }));
  };

  const handleDelete = (assignment: Assignment) => {
    dispatch(openModal({
      title: 'Delete Assignment',
      bodyType: MODAL_BODY_TYPES.ASSIGNMENT_DELETE_CONFIRMATION,
      extraObject: assignment
    }));
  };

  // Filter assignments
  const filteredAssignments = assignments.filter((assignment: Assignment) => {
    const matchesSearch = 
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (assignment.code && assignment.code.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = 
      statusFilter === '' || assignment.status === statusFilter;

    const matchesCourse = 
      courseFilter === '' || assignment.courseId.toString() === courseFilter;

    const matchesDueDate = () => {
      if (dueDateFilter === '' || !assignment.dueDate) return true;
      
      switch (dueDateFilter) {
        case 'overdue':
          return isOverdue(assignment.dueDate);
        case 'today':
          return isDueToday(assignment.dueDate);
        case 'this_week':
          return isDueThisWeek(assignment.dueDate);
        case 'next_week':
          return isDueNextWeek(assignment.dueDate);
        case 'this_month':
          return isDueThisMonth(assignment.dueDate);
        default:
          return true;
      }
    };

    return matchesSearch && matchesStatus && matchesCourse && matchesDueDate();
  });

  // Calculate statistics
  const stats = {
    total: assignments.length,
    published: assignments.filter(a => a.status === 'PUBLISHED').length,
    draft: assignments.filter(a => a.status === 'DRAFT').length,
    closed: assignments.filter(a => a.status === 'CLOSED').length,
    overdue: assignments.filter(a => a.dueDate && isOverdue(a.dueDate)).length,
    totalSubmissions: assignments.reduce((sum, a) => sum + (a.submissionCount || 0), 0)
  };

  // Check permissions
  const canCreateAssignments = [
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
  ].includes(user?.role || '');

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Assignments</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your assignments and track student submissions
          </p>
        </div>
        {canCreateAssignments && (
          <button
            onClick={handleCreateAssignment}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Assignment
          </button>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Assignments</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Published</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.published}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Draft</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.draft}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircle className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Overdue</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.overdue}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Submissions</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalSubmissions}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <AssignmentFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        courseFilter={courseFilter}
        onCourseFilterChange={setCourseFilter}
        dueDateFilter={dueDateFilter}
        onDueDateFilterChange={setDueDateFilter}
        courses={courses.map(course => ({ id: course.id, name: course.name }))}
        showCourseFilter={true}
      />

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assignments Grid */}
      {filteredAssignments.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No assignments found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter || courseFilter || dueDateFilter
              ? 'Try adjusting your filters to see more assignments.'
              : 'Get started by creating a new assignment.'}
          </p>
          {canCreateAssignments && !searchTerm && !statusFilter && !courseFilter && !dueDateFilter && (
            <div className="mt-6">
              <button
                onClick={handleCreateAssignment}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Assignment
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onView={handleViewDetails}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewSubmissions={handleViewSubmissions}
              userRole={user?.role}
              showActions={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignmentListPage; 