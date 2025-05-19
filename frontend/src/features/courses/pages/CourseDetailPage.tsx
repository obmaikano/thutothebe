import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, Award, User, BookOpen, Clock, 
  ArrowLeft, Edit, Trash2, ExternalLink, 
  Users, AlertTriangle, Book
} from 'lucide-react';
import { useCourseDetails } from '../hooks';
import { Button } from '../../../components/common/Button';
import { Course } from '../../../api/services/courseApi';

const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { course, loading, error, fetchCourseDetails, deleteCourse } = useCourseDetails(parseInt(id || '0', 10));
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
  }, [fetchCourseDetails]);

  const getStatusColor = (active: boolean) => {
    return active 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const handleDelete = async () => {
    if (!course) return;
    
    setIsDeleting(true);
    try {
      await deleteCourse();
      navigate('/app/courses');
    } catch (error) {
      console.error('Error deleting course:', error);
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <div className="mt-4">
                <Link
                  to="/app/courses"
                  className="text-sm font-medium text-red-700 hover:text-red-600"
                >
                  Go back to courses
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state if no course found
  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Course not found</h3>
          <p className="mt-1 text-gray-500">
            The course you're looking for doesn't exist or has been removed.
          </p>
          <div className="mt-6">
            <Link
              to="/app/courses"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center">
            <Link to="/app/courses" className="mr-4">
              <Button variant="outline" size="small" leftIcon={<ArrowLeft className="h-4 w-4" />}>
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{course.name}</h1>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-gray-500 text-sm">{course.code}</span>
                <span className="text-gray-300">•</span>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(course.active)}`}>
                  {course.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Link to={`/app/courses/${course.id}/edit`}>
              <Button
                variant="outline"
                leftIcon={<Edit className="h-4 w-4" />}
              >
                Edit
              </Button>
            </Link>
            <Button
              variant="danger"
              leftIcon={<Trash2 className="h-4 w-4" />}
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="mt-6 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Description - Generic info section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Course Information</h2>
              <p className="text-gray-700">
                This is a {course.type.toLowerCase()} course for the {course.term.toLowerCase()} term of {course.year}.
              </p>
            </div>
            
            {/* Class & Subject Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Academic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <BookOpen className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Subject ID</p>
                    <p className="text-gray-900">{course.subjectId}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Class ID</p>
                    <p className="text-gray-900">{course.classId}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Instructor Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Instructors</h2>
              {course.instructorIds && course.instructorIds.length > 0 ? (
                <div className="space-y-4">
                  {course.instructorIds.map(instructorId => (
                    <div key={instructorId} className="flex items-start">
                      <User className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-gray-900">Instructor ID: {instructorId}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No instructors assigned yet.</p>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Course Details</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Term</p>
                    <p className="text-gray-900">{course.term}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Year</p>
                    <p className="text-gray-900">{course.year}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Award className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Type</p>
                    <p className="text-gray-900">{course.type}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Links</h2>
              <div className="space-y-2">
                <Link
                  to={`/resources?courseId=${course.id}`}
                  className="flex items-center text-primary-600 hover:text-primary-700"
                >
                  <Book className="h-4 w-4 mr-2" />
                  <span>Course Resources</span>
                </Link>
                <Link
                  to={`/assignments?courseId=${course.id}`}
                  className="flex items-center text-primary-600 hover:text-primary-700"
                >
                  <Award className="h-4 w-4 mr-2" />
                  <span>Assignments</span>
                </Link>
                <Link
                  to={`/students?courseId=${course.id}`}
                  className="flex items-center text-primary-600 hover:text-primary-700"
                >
                  <Users className="h-4 w-4 mr-2" />
                  <span>Enrolled Students</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Course</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this course? This action cannot be undone.
                        All data associated with this course will be permanently removed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  isLoading={isDeleting}
                  className="w-full sm:w-auto sm:ml-3"
                >
                  Delete
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="mt-3 w-full sm:mt-0 sm:w-auto"
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetailPage; 