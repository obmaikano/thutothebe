import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchTeacherById, clearTeachersError } from '../teachersSlice';
import { fetchClassesByTeacherId } from '../../classes/classesSlice';
import { fetchCoursesByTeacherId } from '../../courses/coursesSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { Teacher } from '../../../api/services/teacherApi';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Users, 
  BookOpen, 
  GraduationCap, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  User,
  Award,
  Building,
  Plus,
  Eye,
  Search,
  Filter
} from 'lucide-react';

const TeacherDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentTeacher, status, error } = useAppSelector(state => state.teachers);
  const { classes, status: classesStatus } = useAppSelector(state => state.classes);
  const { courses, status: coursesStatus } = useAppSelector(state => state.courses);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [courseSearchTerm, setCourseSearchTerm] = useState('');
  const [classSearchTerm, setClassSearchTerm] = useState('');

  useEffect(() => {
    if (id) {
      dispatch(fetchTeacherById(parseInt(id)));
      dispatch(fetchClassesByTeacherId(parseInt(id)));
      dispatch(fetchCoursesByTeacherId(parseInt(id)));
    }
    return () => {
      dispatch(clearTeachersError());
    };
  }, [dispatch, id]);

  const handleEdit = (teacher: Teacher) => {
    dispatch(openModal({
      title: 'Edit Teacher',
      bodyType: MODAL_BODY_TYPES.TEACHER_EDIT,
      extraObject: teacher
    }));
  };

  const handleDelete = (teacher: Teacher) => {
    dispatch(openModal({
      title: 'Delete Teacher',
      bodyType: MODAL_BODY_TYPES.TEACHER_DELETE_CONFIRMATION,
      extraObject: teacher
    }));
  };

  const handleAssignCourse = (teacher: Teacher) => {
    dispatch(openModal({
      title: 'Assign Course to Teacher',
      bodyType: MODAL_BODY_TYPES.TEACHER_ASSIGN_COURSE,
      extraObject: { teacherId: teacher.id, teacher }
    }));
  };

  const handleAssignClass = (teacher: Teacher) => {
    dispatch(openModal({
      title: 'Assign Class to Teacher',
      bodyType: MODAL_BODY_TYPES.TEACHER_ASSIGN_CLASS_FROM_TEACHER,
      extraObject: { teacherId: teacher.id, teacher }
    }));
  };

  const handleViewDetails = (teacher: Teacher) => {
    dispatch(openModal({
      title: 'Teacher Details',
      bodyType: MODAL_BODY_TYPES.TEACHER_VIEW_PROFILE,
      extraObject: teacher
    }));
  };

  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(courseSearchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(courseSearchTerm.toLowerCase())
  );

  const filteredClasses = classes.filter(classItem => 
    classItem.name.toLowerCase().includes(classSearchTerm.toLowerCase()) ||
    (classItem.description && classItem.description.toLowerCase().includes(classSearchTerm.toLowerCase()))
  );

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => dispatch(clearTeachersError())}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentTeacher) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-500">Teacher not found</div>
      </div>
    );
  }

  const teacher = currentTeacher;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/app/staff-management')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {teacher.firstName} {teacher.lastName}
            </h1>
            <p className="text-gray-600">Teacher Details</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewDetails(teacher)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Eye size={16} />
            View Profile
          </button>
          <button
            onClick={() => handleEdit(teacher)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Edit size={16} />
            Edit
          </button>
          <button
            onClick={() => handleDelete(teacher)}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 flex items-center gap-2"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-2">
        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
          teacher.active 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {teacher.active ? 'Active' : 'Inactive'}
        </span>
        <span className="text-sm text-gray-500">Staff ID: {teacher.staffId}</span>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'courses', label: 'Courses', icon: BookOpen },
            { id: 'classes', label: 'Classes', icon: GraduationCap },
            { id: 'assignments', label: 'Assignments', icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Teacher Information */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <p className="text-sm text-gray-600">{teacher.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Qualification</p>
                      <p className="text-sm text-gray-600">{teacher.qualification || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">School</p>
                      <p className="text-sm text-gray-600">{teacher.schoolId || 'Not assigned'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleAssignCourse(teacher)}
                    className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">Assign Course</p>
                      <p className="text-xs text-gray-500">Assign a course to this teacher</p>
                    </div>
                  </button>
                  <button
                    onClick={() => handleAssignClass(teacher)}
                    className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="p-2 bg-green-100 rounded-lg">
                      <GraduationCap className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">Assign Class</p>
                      <p className="text-xs text-gray-500">Assign a class to this teacher</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      <span className="text-sm text-gray-600">Courses</span>
                    </div>
                    <span className="text-lg font-semibold text-gray-900">{courses.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GraduationCap className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-gray-600">Classes</span>
                    </div>
                    <span className="text-lg font-semibold text-gray-900">{classes.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-purple-600" />
                      <span className="text-sm text-gray-600">Students</span>
                    </div>
                    <span className="text-lg font-semibold text-gray-900">0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Assigned Courses</h3>
              <button
                onClick={() => handleAssignCourse(teacher)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus size={16} />
                Assign Course
              </button>
            </div>

            {/* Search and Filters */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses by name or code..."
                  value={courseSearchTerm}
                  onChange={(e) => setCourseSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {coursesStatus === 'loading' ? (
              <div className="flex justify-center py-8">
                <div className="loading loading-spinner loading-lg"></div>
              </div>
            ) : filteredCourses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Year
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Term
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCourses.map((course) => (
                      <tr key={course.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{course.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{course.code}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{course.year}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{course.term}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            course.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {course.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => navigate(`/app/courses/${course.id}`)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No courses assigned</h3>
                <p className="mt-1 text-sm text-gray-500">
                  This teacher hasn't been assigned to any courses yet.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'classes' && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Assigned Classes</h3>
              <button
                onClick={() => handleAssignClass(teacher)}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Plus size={16} />
                Assign Class
              </button>
            </div>

            {/* Search and Filters */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search classes by name or description..."
                  value={classSearchTerm}
                  onChange={(e) => setClassSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {classesStatus === 'loading' ? (
              <div className="flex justify-center py-8">
                <div className="loading loading-spinner loading-lg"></div>
              </div>
            ) : filteredClasses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Class Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grade Level
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Capacity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredClasses.map((classItem) => (
                      <tr key={classItem.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{classItem.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {classItem.description || 'No description'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">Grade {classItem.gradeLevel}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {classItem.capacity || 'Not set'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            classItem.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {classItem.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => navigate(`/app/classes/${classItem.id}`)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No classes assigned</h3>
                <p className="mt-1 text-sm text-gray-500">
                  This teacher hasn't been assigned to any classes yet.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Assignments</h3>
            </div>
            <div className="text-center py-8">
              <Award className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No assignments</h3>
              <p className="mt-1 text-sm text-gray-500">
                This teacher hasn't created any assignments yet.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDetailsPage; 