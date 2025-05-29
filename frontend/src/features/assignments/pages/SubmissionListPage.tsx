import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { 
  fetchSubmissionsByTeacher,
  fetchPendingSubmissionsByTeacher,
  fetchLateSubmissionsByTeacher,
  fetchSubmissionsNeedingReviewByTeacher,
  returnSubmissionToStudent,
  markSubmissionReviewed,
  clearSubmissionsError
} from '../submissionsSlice';
import { fetchAssignments } from '../assignmentsSlice';
import { fetchCourses } from '../../courses/coursesSlice';
import { fetchStudents } from '../../students/studentsSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { Submission } from '../../../api/services/submissionApi';
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
  Eye,
  Download,
  MessageSquare,
  Star,
  GraduationCap,
  Send
} from 'lucide-react';

const SubmissionListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { submissions, status, error } = useAppSelector(state => state.submissions);
  const { assignments } = useAppSelector(state => state.assignments);
  const { courses } = useAppSelector(state => state.courses);
  const { students } = useAppSelector(state => state.students);
  const { user } = useAppSelector(state => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [assignmentFilter, setAssignmentFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [viewFilter, setViewFilter] = useState('all'); // all, pending, late, needsReview
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
        case 'needsReview':
          dispatch(fetchSubmissionsNeedingReviewByTeacher(user.id));
          break;
        default:
          dispatch(fetchSubmissionsByTeacher(user.id));
      }
    }
    
    dispatch(fetchAssignments());
    dispatch(fetchCourses());
    dispatch(fetchStudents());
    
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

  const getStudentName = (studentId: number) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : `Student ${studentId}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUBMITTED': return 'bg-blue-100 text-blue-800';
      case 'GRADED': return 'bg-green-100 text-green-800';
      case 'RETURNED': return 'bg-purple-100 text-purple-800';
      case 'LATE': return 'bg-red-100 text-red-800';
      case 'MISSING': return 'bg-gray-100 text-gray-800';
      case 'DRAFT': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (submission: Submission) => {
    if (submission.needsReview) return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    if (submission.isLate) return <Clock className="h-4 w-4 text-red-500" />;
    if (submission.status === 'GRADED') return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (submission.status === 'SUBMITTED') return <FileText className="h-4 w-4 text-blue-500" />;
    return <XCircle className="h-4 w-4 text-gray-500" />;
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

  const handleProvideFeedback = (submission: Submission) => {
    dispatch(openModal({
      title: 'Provide Feedback',
      bodyType: MODAL_BODY_TYPES.SUBMISSION_FEEDBACK,
      extraObject: submission,
      size: 'lg'
    }));
  };

  const handleDownloadSubmission = async (submission: Submission) => {
    // This would trigger the download API call
    console.log('Download submission:', submission.id);
  };

  const handleReturnToStudent = async (submission: Submission) => {
    try {
      await dispatch(returnSubmissionToStudent(submission.id)).unwrap();
    } catch (error) {
      console.error('Failed to return submission:', error);
    }
  };

  const handleMarkReviewed = async (submission: Submission) => {
    try {
      await dispatch(markSubmissionReviewed({ id: submission.id })).unwrap();
    } catch (error) {
      console.error('Failed to mark as reviewed:', error);
    }
  };

  // Filter submissions
  const filteredSubmissions = submissions.filter((submission: Submission) => {
    const assignmentTitle = getAssignmentTitle(submission.assignmentId);
    const studentName = getStudentName(submission.studentId);
    
    const matchesSearch = 
      assignmentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (submission.textContent && submission.textContent.toLowerCase().includes(searchTerm.toLowerCase()));

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
    late: submissions.filter(s => s.isLate).length,
    needsReview: submissions.filter(s => s.needsReview).length,
    avgScore: submissions.length > 0 && submissions.filter(s => s.score !== undefined).length > 0 ? 
      Math.round(submissions.filter(s => s.score !== undefined).reduce((sum, s) => sum + (s.score || 0), 0) / 
      submissions.filter(s => s.score !== undefined).length) : 0
  };

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
        <div className="flex space-x-2">
          <select
            value={viewFilter}
            onChange={(e) => setViewFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Submissions</option>
            <option value="pending">Pending Review</option>
            <option value="late">Late Submissions</option>
            <option value="needsReview">Needs Review</option>
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <FileText size={16} className="text-blue-600" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">{stats.total}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg mr-3">
              <Clock size={16} className="text-yellow-600" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">{stats.submitted}</div>
              <div className="text-xs text-gray-500">Submitted</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <CheckCircle size={16} className="text-green-600" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">{stats.graded}</div>
              <div className="text-xs text-gray-500">Graded</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg mr-3">
              <AlertTriangle size={16} className="text-red-600" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">{stats.late}</div>
              <div className="text-xs text-gray-500">Late</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg mr-3">
              <Eye size={16} className="text-orange-600" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">{stats.needsReview}</div>
              <div className="text-xs text-gray-500">Needs Review</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <Star size={16} className="text-purple-600" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">{stats.avgScore}</div>
              <div className="text-xs text-gray-500">Avg Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search submissions by assignment, student, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium ${
              showFilters 
                ? 'border-blue-500 text-blue-700 bg-blue-50' 
                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="DRAFT">Draft</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="GRADED">Graded</option>
              <option value="RETURNED">Returned</option>
              <option value="LATE">Late</option>
              <option value="MISSING">Missing</option>
            </select>
            <select 
              value={assignmentFilter}
              onChange={(e) => setAssignmentFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Assignments</option>
              {assignments.map(assignment => (
                <option key={assignment.id} value={assignment.id}>{assignment.title}</option>
              ))}
            </select>
            <select 
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Courses</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                  setAssignmentFilter('');
                  setCourseFilter('');
                }}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Submissions Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubmissions.map((submission: Submission) => (
                <tr key={submission.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <Users className="h-5 w-5 text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {getStudentName(submission.studentId)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Submission #{submission.submissionNumber}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{getAssignmentTitle(submission.assignmentId)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{getCourseName(submission.assignmentId)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {formatDate(submission.submittedAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(submission)}
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(submission.status)}`}>
                        {submission.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {submission.score !== undefined ? (
                        <>
                          {submission.score} / {submission.maxScore}
                          {submission.percentage && (
                            <span className="text-gray-500 ml-1">({submission.percentage}%)</span>
                          )}
                        </>
                      ) : (
                        <span className="text-gray-400">Not graded</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleViewSubmission(submission)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Submission"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {submission.filePaths && (
                        <button
                          onClick={() => handleDownloadSubmission(submission)}
                          className="text-green-600 hover:text-green-900"
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      )}
                      {submission.status === 'SUBMITTED' && (
                        <button
                          onClick={() => handleGradeSubmission(submission)}
                          className="text-purple-600 hover:text-purple-900"
                          title="Grade"
                        >
                          <GraduationCap className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleProvideFeedback(submission)}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Feedback"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </button>
                      {submission.status === 'GRADED' && (
                        <button
                          onClick={() => handleReturnToStudent(submission)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Return to Student"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      )}
                      {submission.needsReview && (
                        <button
                          onClick={() => handleMarkReviewed(submission)}
                          className="text-orange-600 hover:text-orange-900"
                          title="Mark Reviewed"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSubmissions.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No submissions found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter || assignmentFilter || courseFilter
                ? 'Try adjusting your search criteria or filters.'
                : 'No submissions have been made yet.'}
            </p>
          </div>
        )}
      </div>

      {/* Loading and Error States */}
      {status === 'loading' && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-sm text-gray-500">Loading submissions...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <XCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionListPage; 