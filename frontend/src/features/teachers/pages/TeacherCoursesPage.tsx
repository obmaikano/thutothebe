import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import courseApi, { Course } from '../../../api/services/courseApi';
import studentApi from '../../../api/services/studentApi';
import teacherApi, { Teacher } from '../../../api/services/teacherApi';
import { Search, BookOpen, Users, Calendar, Eye, Clock, Code } from 'lucide-react';

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

      {/* Courses Table */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Students
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Term
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course: Course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg mr-3">
                          <BookOpen size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{course.name}</div>
                          {course.type && (
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              course.type === 'CORE' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                              {course.type}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Code size={16} className="mr-2 text-gray-400" />
                        {course.code}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Users size={16} className="mr-2 text-gray-400" />
                        {courseStudentCounts[course.id] || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Clock size={16} className="mr-2 text-gray-400" />
                        {course.term || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        course.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {course.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(course)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => window.location.href = `/app/students?course=${course.id}`}
                          className="text-green-600 hover:text-green-900"
                          title="View Students"
                        >
                          <Users size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-sm font-medium text-gray-900 mb-2">No courses found</h3>
                    <p className="text-sm text-gray-500">
                      {searchTerm || statusFilter 
                        ? 'Try adjusting your search or filter criteria.' 
                        : 'You have not been assigned to any courses yet.'
                      }
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherCoursesPage; 