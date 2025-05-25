import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import studentApi from '../../../api/services/studentApi';
import { ClipboardList, Calendar, Clock, CheckCircle, AlertCircle, Eye, Upload } from 'lucide-react';

interface Assignment {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: 'PENDING' | 'SUBMITTED' | 'GRADED' | 'OVERDUE';
  courseId: number;
  courseName: string;
  submissionId?: number;
  score?: number;
  feedback?: string;
}

const StudentAssignmentsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchStudentAssignments = async () => {
      console.log('StudentAssignmentsPage - User:', user);
      console.log('StudentAssignmentsPage - Is Authenticated:', isAuthenticated);
      
      if (!isAuthenticated) {
        setError('Please log in to view your assignments.');
        setLoading(false);
        return;
      }

      if (!user?.id) {
        setError('User information not found. Please try logging in again.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching student record for user ID:', user.id);
        
        // First, get the student record using the user ID
        const studentResponse = await studentApi.getByUserId(user.id);
        console.log('Student API response:', studentResponse.data);
        
        if (studentResponse.data.status !== 'SUCCESS' || !studentResponse.data.data) {
          setError('Student profile not found. Please contact your administrator.');
          setLoading(false);
          return;
        }

        const studentData = Array.isArray(studentResponse.data.data) 
          ? studentResponse.data.data[0] 
          : studentResponse.data.data;

        if (!studentData) {
          setError('Student profile not found. Please contact your administrator.');
          setLoading(false);
          return;
        }

        console.log('Student data:', studentData);

        // Now get the student's assignments using the student ID
        const response = await studentApi.getAssignments(studentData.id);
        console.log('Assignments API response:', response.data);
        
        if (response.data.status === 'SUCCESS') {
          setAssignments((response.data.data as unknown as Assignment[]) || []);
        } else {
          setError(response.data.message || 'Failed to fetch assignments');
        }
      } catch (err: any) {
        console.error('Error fetching student assignments:', err);
        if (err.response?.status === 401) {
          setError('Authentication failed. Please log in again.');
          navigate('/login');
        } else if (err.response?.status === 403) {
          setError('You do not have permission to access this resource.');
        } else {
          setError(err.response?.data?.message || err.message || 'Failed to fetch assignments');
        }
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user?.id) {
      fetchStudentAssignments();
    }
  }, [user?.id, isAuthenticated, navigate]);

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
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Assignments</h1>
          <p className="text-gray-600 mt-2">View and manage your course assignments</p>
        </div>
        <div className="text-sm text-gray-500">
          {assignments.length} assignment{assignments.length !== 1 ? 's' : ''} total
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Assignments List */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {assignments.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardList className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No assignments available</h3>
            <p className="mt-1 text-sm text-gray-500">
              Your course assignments will appear here when they are created.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {assignment.title}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        assignment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        assignment.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-800' :
                        assignment.status === 'GRADED' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {assignment.status}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      {assignment.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Course: {assignment.courseName}
                      </div>
                    </div>

                    {assignment.status === 'GRADED' && assignment.score !== undefined && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Score:</span>
                          <span className="text-lg font-bold text-green-600">{assignment.score}%</span>
                        </div>
                        {assignment.feedback && (
                          <div className="mt-2">
                            <span className="text-sm font-medium text-gray-700">Feedback:</span>
                            <p className="text-sm text-gray-600 mt-1">{assignment.feedback}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    {assignment.status === 'PENDING' && (
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                        <Upload className="h-4 w-4" />
                        Submit
                      </button>
                    )}
                    
                    <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                      <Eye className="h-4 w-4" />
                      View
                    </button>

                    {assignment.status === 'OVERDUE' && (
                      <div className="flex items-center text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Overdue
                      </div>
                    )}

                    {assignment.status === 'GRADED' && (
                      <div className="flex items-center text-green-600 text-sm">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Completed
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAssignmentsPage;