import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useAuth } from '../../../contexts/AuthContext';
import studentApi, { Student } from '../../../api/services/studentApi';
import courseApi, { Course } from '../../../api/services/courseApi';
import teacherApi, { Teacher } from '../../../api/services/teacherApi';
import { Search, Users, BookOpen, Eye, Mail, Phone } from 'lucide-react';

const TeacherStudentsPage: React.FC = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');

  useEffect(() => {
    const fetchTeacherData = async () => {
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
        const coursesResponse = await courseApi.getActiveByTeacher(teacherData.id);
        const teacherCourses = Array.isArray(coursesResponse.data.data) 
          ? coursesResponse.data.data 
          : [];
        setCourses(teacherCourses);

        // Fetch students from teacher's courses
        const studentsResponse = await studentApi.getActiveByTeacher(teacherData.id);
        const teacherStudents = Array.isArray(studentsResponse.data.data) 
          ? studentsResponse.data.data 
          : [];
        setStudents(teacherStudents);

      } catch (err: any) {
        console.error('Error fetching teacher data:', err);
        if (err.response?.status === 404) {
          setError('Teacher profile not found. Please contact your administrator to set up your teacher profile.');
        } else {
          setError(err.response?.data?.message || 'Failed to load teacher data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [user?.id]);

  const handleViewDetails = (student: Student) => {
    window.location.href = `/app/students/${student.id}`;
  };

  const filteredStudents = students.filter((student: Student) => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCourse = selectedCourse === '' || 
      // This would need to be implemented based on student-course relationship
      true; // For now, show all students

    return matchesSearch && matchesCourse;
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
          <h1 className="text-3xl font-bold text-gray-900">My Students</h1>
          <p className="text-gray-600 mt-2">Students from your assigned courses</p>
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
              placeholder="Search students by name, admission number, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select 
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id.toString()}>
                {course.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      {students.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Users size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{students.length}</div>
                <div className="text-sm text-gray-500">Total Students</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <BookOpen size={20} className="text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{courses.length}</div>
                <div className="text-sm text-gray-500">Courses Teaching</div>
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
                  {students.length > 0 ? Math.round(students.length / courses.length) : 0}
                </div>
                <div className="text-sm text-gray-500">Avg Students/Course</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Students Table */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admission Number
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Academic Year
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
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    {searchTerm || selectedCourse ? 'No students match your search criteria' : 'No students found'}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student: Student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.gender}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.admissionNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Mail size={14} className="mr-1 text-gray-400" />
                        {student.email}
                      </div>
                      {student.phone && (
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <Phone size={14} className="mr-1 text-gray-400" />
                          {student.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.academicYear}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        student.status === 'ACTIVE' 
                          ? 'bg-green-100 text-green-800' 
                          : student.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(student)}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherStudentsPage; 