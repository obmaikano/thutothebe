import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { 
  fetchAssignments, 
  clearAssignmentsError, 
  publishAssignment,
  closeAssignment,
  archiveAssignment
} from '../assignmentsSlice';
import { fetchCourses } from '../../courses/coursesSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { Assignment } from '../../../api/services/assignmentApi';
import { 
  Plus, 
  Search, 
  BookOpen, 
  Edit, 
  Trash2, 
  Eye, 
  FileText,
  Users,
  Calendar,
  Filter,
  CheckCircle,
  XCircle,
  Archive,
  Send
} from 'lucide-react';

const AssignmentListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { assignments, status, error } = useAppSelector(state => state.assignments);
  const { courses } = useAppSelector(state => state.courses);
  const { user } = useAppSelector(state => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [submissionTypeFilter, setSubmissionTypeFilter] = useState('');
  const [gradingTypeFilter, setGradingTypeFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

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
      case 'PUBLISHED': return 'bg-green-100 text-green-800';
      case 'DRAFT': return 'bg-yellow-100 text-yellow-800';
      case 'CLOSED': return 'bg-red-100 text-red-800';
      case 'ARCHIVED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSubmissionTypeIcon = (type: string) => {
    switch (type) {
      case 'FILE': return <FileText className="h-4 w-4" />;
      case 'TEXT': return <Edit className="h-4 w-4" />;
      case 'LINK': return <BookOpen className="h-4 w-4" />;
      case 'MIXED': return <Plus className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
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

  const handlePublish = async (assignment: Assignment) => {
    try {
      await dispatch(publishAssignment(assignment.id)).unwrap();
    } catch (error) {
      console.error('Failed to publish assignment:', error);
    }
  };

  const handleClose = async (assignment: Assignment) => {
    try {
      await dispatch(closeAssignment(assignment.id)).unwrap();
    } catch (error) {
      console.error('Failed to close assignment:', error);
    }
  };

  const handleArchive = async (assignment: Assignment) => {
    try {
      await dispatch(archiveAssignment(assignment.id)).unwrap();
    } catch (error) {
      console.error('Failed to archive assignment:', error);
    }
  };

  // Filter assignments
  const filteredAssignments = assignments.filter((assignment: Assignment) => {
    const matchesSearch = 
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === '' || assignment.status === statusFilter;

    const matchesCourse = 
      courseFilter === '' || assignment.courseId.toString() === courseFilter;

    const matchesSubmissionType = 
      submissionTypeFilter === '' || assignment.submissionType === submissionTypeFilter;

    const matchesGradingType = 
      gradingTypeFilter === '' || assignment.gradingType === gradingTypeFilter;

    return matchesSearch && matchesStatus && matchesCourse && matchesSubmissionType && matchesGradingType;
  });

  // Calculate statistics
  const stats = {
    total: assignments.length,
    published: assignments.filter(a => a.status === 'PUBLISHED').length,
    draft: assignments.filter(a => a.status === 'DRAFT').length,
    closed: assignments.filter(a => a.status === 'CLOSED').length,
    archived: assignments.filter(a => a.status === 'ARCHIVED').length,
    avgSubmissions: assignments.length > 0 ? 
      Math.round(assignments.reduce((sum, a) => sum + a.submissionCount, 0) / assignments.length) : 0
  };

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
        <button
          onClick={handleCreateAssignment}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Assignment
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <BookOpen size={16} className="text-blue-600" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">{stats.total}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <CheckCircle size={16} className="text-green-600" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">{stats.published}</div>
              <div className="text-xs text-gray-500">Published</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg mr-3">
              <Edit size={16} className="text-yellow-600" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">{stats.draft}</div>
              <div className="text-xs text-gray-500">Draft</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg mr-3">
              <XCircle size={16} className="text-red-600" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">{stats.closed}</div>
              <div className="text-xs text-gray-500">Closed</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg mr-3">
              <Archive size={16} className="text-gray-600" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">{stats.archived}</div>
              <div className="text-xs text-gray-500">Archived</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <Users size={16} className="text-purple-600" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">{stats.avgSubmissions}</div>
              <div className="text-xs text-gray-500">Avg Submissions</div>
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
              placeholder="Search assignments by title, description, or code..."
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
              <option value="PUBLISHED">Published</option>
              <option value="CLOSED">Closed</option>
              <option value="ARCHIVED">Archived</option>
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
            <select 
              value={submissionTypeFilter}
              onChange={(e) => setSubmissionTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Submission Types</option>
              <option value="FILE">File Upload</option>
              <option value="TEXT">Text Entry</option>
              <option value="LINK">Link Submission</option>
              <option value="MIXED">Mixed</option>
            </select>
            <select 
              value={gradingTypeFilter}
              onChange={(e) => setGradingTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Grading Types</option>
              <option value="POINTS">Points</option>
              <option value="PERCENTAGE">Percentage</option>
              <option value="LETTER">Letter Grade</option>
              <option value="PASS_FAIL">Pass/Fail</option>
            </select>
          </div>
        )}
      </div>

      {/* Assignments Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
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
              {filteredAssignments.map((assignment: Assignment) => (
                <tr key={assignment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          {getSubmissionTypeIcon(assignment.submissionType)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {assignment.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {assignment.code}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{getCourseName(assignment.courseId)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {formatDate(assignment.dueDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(assignment.status)}`}>
                      {assignment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Users className="h-4 w-4 mr-2 text-gray-400" />
                      {assignment.submissionCount} / {assignment.gradedCount} graded
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      {getSubmissionTypeIcon(assignment.submissionType)}
                      <span className="ml-2">{assignment.submissionType}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {assignment.maxScore} pts
                    </div>
                    <div className="text-xs text-gray-500">
                      {assignment.gradingType}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleViewDetails(assignment)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleViewSubmissions(assignment)}
                        className="text-green-600 hover:text-green-900"
                        title="View Submissions"
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(assignment)}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {assignment.status === 'DRAFT' && (
                        <button
                          onClick={() => handlePublish(assignment)}
                          className="text-green-600 hover:text-green-900"
                          title="Publish"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      )}
                      {assignment.status === 'PUBLISHED' && (
                        <button
                          onClick={() => handleClose(assignment)}
                          className="text-red-600 hover:text-red-900"
                          title="Close"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      )}
                      {(assignment.status === 'CLOSED' || assignment.status === 'PUBLISHED') && (
                        <button
                          onClick={() => handleArchive(assignment)}
                          className="text-gray-600 hover:text-gray-900"
                          title="Archive"
                        >
                          <Archive className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(assignment)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAssignments.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No assignments found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter || courseFilter || submissionTypeFilter || gradingTypeFilter
                ? 'Try adjusting your search criteria or filters.'
                : 'Get started by creating a new assignment.'}
            </p>
            {!searchTerm && !statusFilter && !courseFilter && !submissionTypeFilter && !gradingTypeFilter && (
              <div className="mt-6">
                <button
                  onClick={handleCreateAssignment}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  New Assignment
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Loading and Error States */}
      {status === 'loading' && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-sm text-gray-500">Loading assignments...</p>
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

export default AssignmentListPage; 