import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import teacherApi from '../../../api/services/teacherApi';
import submissionApi, { Submission } from '../../../api/services/submissionApi';
import { Teacher } from '../../../api/services/teacherApi';
import { 
  FileCheck, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Star,
  MessageSquare,
  Calendar,
  User,
  Search,
  FileText,
  Edit,
  Eye
} from 'lucide-react';

const TeacherSubmissionsPage: React.FC = () => {
  const { user } = useAuth();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'GRADED' | 'LATE'>('ALL');

  useEffect(() => {
    fetchTeacherSubmissions();
  }, [user?.id]);

  const fetchTeacherSubmissions = async () => {
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
      
      // Fetch teacher's submissions
      const submissionsResponse = await submissionApi.getByTeacher(teacherData.id);
      const teacherSubmissions = Array.isArray(submissionsResponse.data.data) 
        ? submissionsResponse.data.data 
        : [];
      setSubmissions(teacherSubmissions);

    } catch (err: any) {
      console.error('Error fetching teacher submissions:', err);
      if (err.response?.status === 404) {
        setError('Teacher profile not found. Please contact your administrator to set up your teacher profile.');
      } else {
        setError(err.response?.data?.message || 'Failed to load submissions');
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || submission.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'GRADED': return 'bg-green-100 text-green-800';
      case 'LATE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSubmissionStats = () => {
    const total = submissions.length;
    const pending = submissions.filter(s => s.status === 'PENDING').length;
    const graded = submissions.filter(s => s.status === 'GRADED').length;
    const late = submissions.filter(s => s.status === 'LATE').length;
    
    return { total, pending, graded, late };
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

  const handleGradeSubmission = async (submissionId: number, score: number, feedback: string) => {
    try {
      await submissionApi.grade(submissionId, score, feedback);
      // Refresh submissions
      fetchTeacherSubmissions();
    } catch (err: any) {
      console.error('Error grading submission:', err);
      setError(err.response?.data?.message || 'Failed to grade submission');
    }
  };

  const handleViewDetails = (submission: Submission) => {
    // TODO: Implement view details functionality
    console.log('View submission details:', submission);
  };

  const stats = getSubmissionStats();

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
          <h1 className="text-3xl font-bold text-gray-900">Student Submissions</h1>
          <p className="text-gray-600 mt-2">Review and grade student submissions</p>
        </div>
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
              placeholder="Search submissions by content..."
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
            <option value="PENDING">Pending</option>
            <option value="GRADED">Graded</option>
            <option value="LATE">Late</option>
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      {submissions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <FileCheck size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-500">Total Submissions</div>
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
                <div className="text-sm text-gray-500">Pending Review</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <CheckCircle size={20} className="text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.graded}</div>
                <div className="text-sm text-gray-500">Graded</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg mr-3">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.late}</div>
                <div className="text-sm text-gray-500">Late Submissions</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submissions Table */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignment
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg mr-3">
                          <User size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">Student ID: {submission.studentId}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {submission.content.substring(0, 50)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <FileText size={16} className="mr-2 text-gray-400" />
                        Assignment {submission.assignmentId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar size={16} className="mr-2 text-gray-400" />
                        {formatDate(submission.submittedAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(submission.status)}`}>
                        {submission.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        {submission.status === 'GRADED' ? (
                          <>
                            <Star size={16} className="mr-2 text-yellow-400" />
                            {submission.score}/100
                          </>
                        ) : (
                          <span className="text-gray-400">Not graded</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(submission)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        {submission.status === 'PENDING' && (
                          <button
                            onClick={() => {
                              const modal = document.getElementById(`grade_modal_${submission.id}`) as HTMLDialogElement;
                              modal?.showModal();
                            }}
                            className="text-green-600 hover:text-green-900"
                            title="Grade Submission"
                          >
                            <Edit size={16} />
                          </button>
                        )}
                        {submission.status === 'GRADED' && submission.feedback && (
                          <button
                            className="text-purple-600 hover:text-purple-900"
                            title="View Feedback"
                          >
                            <MessageSquare size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <FileCheck className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-sm font-medium text-gray-900 mb-2">No submissions found</h3>
                    <p className="text-sm text-gray-500">
                      {searchTerm || statusFilter !== 'ALL' 
                        ? 'Try adjusting your search or filter criteria.' 
                        : 'No submissions have been received yet.'
                      }
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grading Modals */}
      {filteredSubmissions.map((submission) => (
        <dialog key={`modal_${submission.id}`} id={`grade_modal_${submission.id}`} className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Grade Submission</h3>
            <div className="mb-4">
              <h4 className="font-medium mb-2">Submission Content:</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{submission.content}</p>
              </div>
            </div>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const score = parseInt(formData.get('score') as string);
                const feedback = formData.get('feedback') as string;
                handleGradeSubmission(submission.id, score, feedback);
                const modal = document.getElementById(`grade_modal_${submission.id}`) as HTMLDialogElement;
                modal?.close();
              }}
            >
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Score (0-100)</span>
                </label>
                <input 
                  type="number" 
                  name="score"
                  min="0" 
                  max="100" 
                  className="input input-bordered" 
                  required 
                />
              </div>
              
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Feedback</span>
                </label>
                <textarea 
                  name="feedback"
                  className="textarea textarea-bordered h-24" 
                  placeholder="Provide feedback to the student..."
                ></textarea>
              </div>
              
              <div className="modal-action">
                <button type="submit" className="btn btn-primary">Submit Grade</button>
                <button 
                  type="button" 
                  className="btn" 
                  onClick={() => {
                    const modal = document.getElementById(`grade_modal_${submission.id}`) as HTMLDialogElement;
                    modal?.close();
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </dialog>
      ))}
    </div>
  );
};

export default TeacherSubmissionsPage; 