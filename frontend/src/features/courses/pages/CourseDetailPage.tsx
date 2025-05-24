import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, Award, User, BookOpen, Clock, 
  ArrowLeft, Edit, Trash2, ExternalLink, 
  Users, AlertTriangle, Book
} from 'lucide-react';
import { useCourseDetails } from '../hooks';
import { useTeachers } from '../../teachers/hooks';
import { Button } from '../../../components/common/Button';
import { Course } from '../../../api/services/courseApi';
import { Teacher } from '../../../api/services/teacherApi';
import { useAppDispatch } from '../../../store';
import { addTeacherToCourse, removeTeacherFromCourse } from '../coursesSlice';

const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { course, loading, error, fetchCourseDetails, deleteCourse } = useCourseDetails(parseInt(id || '0', 10));
  const { teachers, loading: teachersLoading, getActiveTeachers } = useTeachers();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [teacherError, setTeacherError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchCourseDetails();
    getActiveTeachers();
  }, [fetchCourseDetails, getActiveTeachers]);

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
  if (loading || teachersLoading) {
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
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
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
                size="sm"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
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
                  {course.instructorIds.map(instructorId => {
                    const teacher = teachers.find((t: Teacher) => t.id === instructorId);
                    return (
                      <div key={instructorId} className="flex items-center justify-between">
                        <div className="flex items-start">
                          <User className="h-5 w-5 text-gray-400 mr-2" />
                          <div>
                            <p className="text-gray-900">
                              {teacher ? `${teacher.firstName} ${teacher.lastName}` : `Instructor ID: ${instructorId}`}
                            </p>
                            {teacher && (
                              <p className="text-sm text-gray-500">{teacher.email}</p>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            setTeacherError(null);
                            try {
                              await dispatch(removeTeacherFromCourse({ courseId: course.id, teacherId: instructorId }));
                              fetchCourseDetails();
                            } catch (err) {
                              setTeacherError('Failed to remove teacher');
                            }
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500">No instructors assigned yet.</p>
              )}
              <form
                className="mt-6 flex items-center space-x-2"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setTeacherError(null);
                  const tid = parseInt(selectedTeacherId, 10);
                  if (!tid || tid <= 0) {
                    setTeacherError('Please select a teacher');
                    return;
                  }
                  try {
                    await dispatch(addTeacherToCourse({ courseId: course.id, teacherId: tid, isPrimary: false }));
                    setSelectedTeacherId('');
                    fetchCourseDetails();
                  } catch (err) {
                    setTeacherError('Failed to add teacher');
                  }
                }}
              >
                <select
                  className="border rounded px-2 py-1 w-64"
                  value={selectedTeacherId}
                  onChange={e => setSelectedTeacherId(e.target.value)}
                >
                  <option value="">Select a teacher</option>
                  {teachers
                    .filter((teacher: Teacher) => !course.instructorIds?.includes(teacher.id))
                    .map((teacher: Teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.firstName} {teacher.lastName} ({teacher.email})
                      </option>
                    ))}
                </select>
                <Button type="submit" size="sm">Assign Teacher</Button>
              </form>
              {teacherError && <p className="text-red-500 text-xs mt-2">{teacherError}</p>}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Course Status</h2>
              <div className="flex items-center">
                <div className={`h-2 w-2 rounded-full mr-2 ${course.active ? 'bg-green-500' : 'bg-gray-500'}`} />
                <span className="text-gray-700">{course.active ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
            
            {/* Course Type */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Course Type</h2>
              <div className="flex items-center">
                <Book className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-700">{course.type}</span>
              </div>
            </div>
            
            {/* Term & Year */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Term & Year</h2>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-700">{course.term}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-700">{course.year}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Course</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete this course? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="secondary"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetailPage; 