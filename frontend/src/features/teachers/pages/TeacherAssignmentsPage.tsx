import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import teacherApi from '../../../api/services/teacherApi';
import assignmentApi, { Assignment } from '../../../api/services/assignmentApi';
import submissionApi, { Submission } from '../../../api/services/submissionApi';
import { Teacher } from '../../../api/services/teacherApi';
import CreateAssignmentModal from '../components/CreateAssignmentModal';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Calendar,
  Users,
  FileText
} from 'lucide-react';

const TeacherAssignmentsPage: React.FC = () => {
  const { user } = useAuth();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Record<number, Submission[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'DRAFT' | 'PUBLISHED' | 'CLOSED'>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchTeacherAssignments();
  }, [user?.id]);

  const fetchTeacherAssignments = async () => {
    if (!user?.id) {
      setError('User information not found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // First, fetch the teacher record using the user ID
      const teacherResponse = await teacherApi.getByUserId(user.id);
      const teacherData = Array.isArray(teacherResponse.data.data) 
        ? teacherResponse.data.data[0] 
        : teacherResponse.data.data;
      
      if (!teacherData) {
        setError('Teacher profile not found. Please contact your administrator to set up your teacher profile.');
        setLoading(false);
        return;
      }
      
      setTeacher(teacherData);
      
      // Fetch teacher's assignments
      const assignmentsResponse = await assignmentApi.getByTeacher(teacherData.id);
      const teacherAssignments = Array.isArray(assignmentsResponse.data.data) 
        ? assignmentsResponse.data.data 
        : [];
      setAssignments(teacherAssignments);

      // Fetch submissions for each assignment
      const submissionData: Record<number, Submission[]> = {};
      for (const assignment of teacherAssignments) {
        try {
          const submissionsResponse = await submissionApi.getByAssignment(assignment.id);
          const assignmentSubmissions = Array.isArray(submissionsResponse.data.data) 
            ? submissionsResponse.data.data 
            : [];
          submissionData[assignment.id] = assignmentSubmissions;
        } catch (err) {
          console.error(`Error fetching submissions for assignment ${assignment.id}:`, err);
          submissionData[assignment.id] = [];
        }
      }
      setSubmissions(submissionData);

    } catch (err: any) {
      console.error('Error fetching teacher assignments:', err);
      if (err.response?.status === 404) {
        setError('Teacher profile not found. Please contact your administrator to set up your teacher profile.');
      } else {
        setError(err.response?.data?.message || 'Failed to load assignments');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    fetchTeacherAssignments();
  };

  const handleViewDetails = (assignment: Assignment) => {
    window.location.href = `/app/assignments/${assignment.id}`;
  };

  const handleEdit = (assignment: Assignment) => {
    // TODO: Implement edit functionality
    console.log('Edit assignment:', assignment);
  };

  const handleDelete = async (assignment: Assignment) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await assignmentApi.delete(assignment.id);
        fetchTeacherAssignments();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete assignment');
      }
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || assignment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getSubmissionStats = (assignmentId: number) => {
    const assignmentSubmissions = submissions[assignmentId] || [];
    const total = assignmentSubmissions.length;
    const pending = assignmentSubmissions.filter(s => s.status === 'PENDING').length;
    const graded = assignmentSubmissions.filter(s => s.status === 'GRADED').length;
    const late = assignmentSubmissions.filter(s => s.status === 'LATE').length;
    
    return { total, pending, graded, late };
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-yellow-100 text-yellow-800';
      case 'PUBLISHED': return 'bg-green-100 text-green-800';
      case 'CLOSED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Assignments</h1>
          <p className="text-gray-600 mt-2">Manage assignments for your courses</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Create Assignment
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search assignments by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">All Status</option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      {assignments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <BookOpen size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{assignments.length}</div>
                <div className="text-sm text-gray-500">Total Assignments</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                <Clock size={20} className="text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {assignments.filter(a => a.status === 'DRAFT').length}
                </div>
                <div className="text-sm text-gray-500">Draft Assignments</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <CheckCircle size={20} className="text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {assignments.filter(a => a.status === 'PUBLISHED').length}
                </div>
                <div className="text-sm text-gray-500">Published</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg mr-3">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {Object.values(submissions).flat().filter(s => s.status === 'PENDING').length}
                </div>
                <div className="text-sm text-gray-500">Pending Reviews</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assignments Table */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignment
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submissions
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAssignments.length > 0 ? (
                filteredAssignments.map((assignment) => {
                  const stats = getSubmissionStats(assignment.id);
                  return (
                    <tr key={assignment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="p-2 bg-blue-100 rounded-lg mr-3">
                            <FileText size={16} className="text-blue-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{assignment.title}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {assignment.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(assignment.status)}`}>
                          {assignment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar size={16} className="mr-2 text-gray-400" />
                          {formatDate(assignment.dueDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Users size={16} className="mr-2 text-gray-400" />
                          <span>{stats.total} total</span>
                          {stats.pending > 0 && (
                            <span className="ml-2 text-yellow-600">({stats.pending} pending)</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewDetails(assignment)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(assignment)}
                            className="text-green-600 hover:text-green-900"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(assignment)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-sm font-medium text-gray-900 mb-2">No assignments found</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      {searchTerm || statusFilter !== 'ALL' 
                        ? 'Try adjusting your search or filter criteria.'
                        : 'Get started by creating your first assignment.'
                      }
                    </p>
                    {!searchTerm && statusFilter === 'ALL' && (
                      <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center mx-auto"
                      >
                        <Plus size={20} className="mr-2" />
                        Create Assignment
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Assignment Modal */}
      <CreateAssignmentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
};

export default TeacherAssignmentsPage; 