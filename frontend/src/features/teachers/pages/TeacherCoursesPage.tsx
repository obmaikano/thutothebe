import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import courseApi, { Course } from '../../../api/services/courseApi';
import studentApi from '../../../api/services/studentApi';
import teacherApi, { Teacher } from '../../../api/services/teacherApi';
import { Search, BookOpen, Users, Calendar, Eye, Clock } from 'lucide-react';

const TeacherCoursesPage: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [courseStudentCounts, setCourseStudentCounts] = useState<Record<number, number>>({});

  useEffect(() => {
    const fetchTeacherCourses = async () => {
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
          setError('Teacher profile not found. Please contact your administrator.');
          setLoading(false);
          return;
        }
        
        setTeacher(teacherData);
        
        // Fetch teacher's courses
        const coursesResponse = await courseApi.getByTeacher(teacherData.id);
        const teacherCourses = Array.isArray(coursesResponse.data.data) 
          ? coursesResponse.data.data 
          : [];
        setCourses(teacherCourses);

        // Fetch student counts for each course
        const studentCounts: Record<number, number> = {};
        for (const course of teacherCourses) {
          try {
            const studentsResponse = await studentApi.getByCourse(course.id);
            const students = Array.isArray(studentsResponse.data.data) 
              ? studentsResponse.data.data 
              : [];
            studentCounts[course.id] = students.length;
          } catch (err) {
            console.error(`Error fetching students for course ${course.id}:`, err);
            studentCounts[course.id] = 0;
          }
        }
        setCourseStudentCounts(studentCounts);

      } catch (err: any) {
        console.error('Error fetching teacher courses:', err);
        if (err.response?.status === 404) {
          setError('Teacher profile not found. Please contact your administrator to set up your teacher profile.');
        } else {
          setError(err.response?.data?.message || 'Failed to load teacher data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherCourses();
  }, [user?.id]);

  const handleViewDetails = (course: Course) => {
    window.location.href = `/app/courses/${course.id}`;
  };

  const filteredCourses = courses.filter((course: Course) => {
    const matchesSearch = 
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === '' ||
      (statusFilter === 'active' && course.active) ||
      (statusFilter === 'inactive' && !course.active);

    return matchesSearch && matchesStatus;
  });

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
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600 mt-2">Courses you are assigned to teach</p>
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
              placeholder="Search courses by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      {courses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <BookOpen size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{courses.length}</div>
                <div className="text-sm text-gray-500">Total Courses</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <BookOpen size={20} className="text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {courses.filter((c: Course) => c.active).length}
                </div>
                <div className="text-sm text-gray-500">Active Courses</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <Users size={20} className="text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {Object.values(courseStudentCounts).reduce((sum, count) => sum + count, 0)}
                </div>
                <div className="text-sm text-gray-500">Total Students</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg mr-3">
                <Calendar size={20} className="text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {new Date().getFullYear()}
                </div>
                <div className="text-sm text-gray-500">Academic Year</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || statusFilter ? 'No courses match your search criteria' : 'No courses assigned'}
            </h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter 
                ? 'Try adjusting your search or filter criteria' 
                : 'You have not been assigned to any courses yet'
              }
            </p>
          </div>
        ) : (
          filteredCourses.map((course: Course) => (
            <div key={course.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{course.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{course.code}</p>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  course.active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {course.active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <Users size={16} className="mr-2" />
                    <span>{courseStudentCounts[course.id] || 0} Students</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar size={16} className="mr-2" />
                    <span>{course.year || new Date().getFullYear()}</span>
                  </div>
                </div>

                {course.term && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock size={16} className="mr-2" />
                    <span>{course.term} Term</span>
                  </div>
                )}

                {course.type && (
                  <div className="flex items-center text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      course.type === 'CORE' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {course.type}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-between items-center">
                <button
                  onClick={() => handleViewDetails(course)}
                  className="text-blue-600 hover:text-blue-900 flex items-center text-sm font-medium"
                >
                  <Eye size={16} className="mr-1" />
                  View Details
                </button>
                <button
                  onClick={() => window.location.href = `/app/students?course=${course.id}`}
                  className="text-gray-600 hover:text-gray-900 flex items-center text-sm"
                >
                  <Users size={16} className="mr-1" />
                  View Students
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeacherCoursesPage; 