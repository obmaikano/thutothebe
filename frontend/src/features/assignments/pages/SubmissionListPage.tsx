import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { 
  fetchSubmissionsByTeacher,
  fetchPendingSubmissionsByTeacher,
  fetchLateSubmissionsByTeacher,
  clearSubmissionsError,
  gradeSubmission,
  deleteSubmission
} from '../submissionsSlice';
import { fetchAssignments } from '../assignmentsSlice';
import { fetchCourses } from '../../courses/coursesSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { Submission } from '../../../api/services/submissionApi';
import SubmissionCard from '../components/SubmissionCard';
import { 
  Search, 
  Filter,
  FileText,
  Clock,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3
} from 'lucide-react';

const SubmissionListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { submissions, status, error } = useAppSelector(state => state.submissions);
  const { assignments } = useAppSelector(state => state.assignments);
  const { courses } = useAppSelector(state => state.courses);
  const { user } = useAppSelector(state => state.auth);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [assignmentFilter, setAssignmentFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [viewFilter, setViewFilter] = useState('all'); // all, pending, late
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Load data based on view filter
    if (user?.id) {
      switch (viewFilter) {
        case 'pending':
          dispatch(fetchPendingSubmissionsByTeacher(user.id));
          break;
        case 'late':
          dispatch(fetchLateSubmissionsByTeacher(user.id));
          break;
        default:
          dispatch(fetchSubmissionsByTeacher(user.id));
      }
    }
    
    dispatch(fetchAssignments());
    dispatch(fetchCourses());
    
    return () => {
      dispatch(clearSubmissionsError());
    };
  }, [dispatch, user?.id, viewFilter]);

  // Helper functions
  const getAssignmentTitle = (assignmentId: number) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    return assignment ? assignment.title : `Assignment ${assignmentId}`;
  };

  const getCourseName = (assignmentId: number) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    if (assignment) {
      const course = courses.find(c => c.id === assignment.courseId);
      return course ? course.name : `Course ${assignment.courseId}`;
    }
    return 'Unknown Course';
  };

  // Event handlers
  const handleViewSubmission = (submission: Submission) => {
    dispatch(openModal({
      title: 'Submission Details',
      bodyType: MODAL_BODY_TYPES.SUBMISSION_VIEW_DETAILS,
      extraObject: submission,
      size: 'lg'
    }));
  };

  const handleGradeSubmission = (submission: Submission) => {
    dispatch(openModal({
      title: 'Grade Submission',
      bodyType: MODAL_BODY_TYPES.SUBMISSION_GRADE,
      extraObject: submission,
      size: 'lg'
    }));
  };

  const handleEditSubmission = (submission: Submission) => {
    dispatch(openModal({
      title: 'Edit Submission',
      bodyType: MODAL_BODY_TYPES.SUBMISSION_EDIT,
      extraObject: submission,
      size: 'lg'
    }));
  };

  const handleDeleteSubmission = (submission: Submission) => {
    dispatch(openModal({
      title: 'Delete Submission',
      bodyType: MODAL_BODY_TYPES.SUBMISSION_DELETE_CONFIRMATION,
      extraObject: submission
    }));
  };

  const handleDownloadSubmission = async (submission: Submission) => {
    // This would trigger the download API call
    console.log('Download submission:', submission.id);
  };

  // Filter submissions
  const filteredSubmissions = submissions.filter((submission: Submission) => {
    const assignmentTitle = getAssignmentTitle(submission.assignmentId);
    
    const matchesSearch = 
      assignmentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (submission.content && submission.content.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = 
      statusFilter === '' || submission.status === statusFilter;

    const matchesAssignment = 
      assignmentFilter === '' || submission.assignmentId.toString() === assignmentFilter;

    const matchesCourse = courseFilter === '' || (() => {
      const assignment = assignments.find(a => a.id === submission.assignmentId);
      return assignment && assignment.courseId.toString() === courseFilter;
    })();

    return matchesSearch && matchesStatus && matchesAssignment && matchesCourse;
  });

  // Calculate statistics
  const stats = {
    total: submissions.length,
    submitted: submissions.filter(s => s.status === 'SUBMITTED').length,
    graded: submissions.filter(s => s.status === 'GRADED').length,
    late: submissions.filter(s => s.isLateSubmission).length,
    needsReview: submissions.filter(s => s.needsReview).length,
    draft: submissions.filter(s => s.status === 'DRAFT').length
  };

  // Check permissions
  const canGradeSubmissions = [
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
          <h1 className="text-2xl font-semibold text-gray-900">Submissions</h1>
          <p className="mt-1 text-sm text-gray-500">
            Review and grade student submissions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>
      </div>

      {/* View Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'all', label: 'All Submissions', count: stats.total },
            { key: 'pending', label: 'Pending Review', count: stats.submitted },
            { key: 'late', label: 'Late Submissions', count: stats.late }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setViewFilter(tab.key)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                viewFilter === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total</dt>
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
                <Clock className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Submitted</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.submitted}</dd>
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Graded</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.graded}</dd>
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Late</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.late}</dd>
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Needs Review</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.needsReview}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-purple-400" />
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
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search submissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="DRAFT">Draft</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="GRADED">Graded</option>
                <option value="RETURNED">Returned</option>
                <option value="LATE">Late</option>
                <option value="MISSING">Missing</option>
              </select>
            </div>

            {/* Assignment Filter */}
            <div>
              <select
                value={assignmentFilter}
                onChange={(e) => setAssignmentFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Assignments</option>
                {assignments.map((assignment) => (
                  <option key={assignment.id} value={assignment.id?.toString()}>
                    {assignment.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Course Filter */}
            <div>
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Courses</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id.toString()}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

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

      {/* Submissions Grid */}
      {filteredSubmissions.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No submissions found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter || assignmentFilter || courseFilter
              ? 'Try adjusting your filters to see more submissions.'
              : 'No submissions have been made yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubmissions.map((submission) => (
            <SubmissionCard
              key={submission.id}
              submission={submission}
              onView={handleViewSubmission}
              onGrade={canGradeSubmissions ? handleGradeSubmission : undefined}
              onEdit={handleEditSubmission}
              onDelete={handleDeleteSubmission}
              onDownload={handleDownloadSubmission}
              userRole={user?.role}
              showStudentInfo={true}
              showAssignmentInfo={true}
              showActions={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SubmissionListPage; 