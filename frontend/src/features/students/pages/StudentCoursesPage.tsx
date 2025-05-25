import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import studentApi from '../../../api/services/studentApi';
import { getToken } from '../../../features/auth/authUtils';
import { BookOpen, Clock, Users, Calendar, Eye } from 'lucide-react';

interface Course {
  id: number;
  code: string;
  name: string;
  subjectId: number;
  classId: number;
  term: string;
  year: number;
  active: boolean;
  type: string;
  instructorIds: number[];
}

const StudentCoursesPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchStudentCourses = async () => {
      console.log('StudentCoursesPage - User:', user);
      console.log('StudentCoursesPage - Is Authenticated:', isAuthenticated);
      
      if (!isAuthenticated) {
        setError('Please log in to view your courses.');
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

        // Now get the student's courses using the student ID
        const response = await studentApi.getCourses(studentData.id);
        console.log('Courses API response:', response.data);
        
        if (response.data.status === 'SUCCESS') {
          setCourses((response.data.data as unknown as Course[]) || []);
        } else {
          setError(response.data.message || 'Failed to fetch courses');
        }
      } catch (err: any) {
        console.error('Error fetching student courses:', err);
        if (err.response?.status === 401) {
          setError('Authentication failed. Please log in again.');
          navigate('/login');
        } else if (err.response?.status === 403) {
          setError('You do not have permission to access this resource.');
        } else {
          setError(err.response?.data?.message || err.message || 'Failed to fetch courses');
        }
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user?.id) {
      fetchStudentCourses();
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
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600 mt-2">View your enrolled courses and access course materials</p>
        </div>
        <div className="text-sm text-gray-500">
          {courses.length} course{courses.length !== 1 ? 's' : ''} enrolled
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

      {/* Courses Grid */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No courses enrolled</h3>
            <p className="mt-1 text-sm text-gray-500">
              You are not currently enrolled in any courses. Contact your administrator for enrollment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {course.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {course.code}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    course.type === 'CORE' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {course.type}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    {course.term} {course.year}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    {course.active ? 'Active' : 'Inactive'}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-2" />
                    {course.instructorIds.length} instructor{course.instructorIds.length !== 1 ? 's' : ''}
                  </div>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
                  <Eye className="h-4 w-4" />
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentCoursesPage; 