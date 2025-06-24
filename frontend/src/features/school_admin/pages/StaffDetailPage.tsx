import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchTeacherById, activateTeacher, deactivateTeacher } from '../../teachers/teachersSlice';
import { Teacher } from '../../../api/services/teacherApi';
import classApi, { Class } from '../../../api/services/classApi';
import courseApi, { Course } from '../../../api/services/courseApi';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { 
  ArrowLeft, User, Mail, GraduationCap, Calendar, BookOpen, Users, 
  Edit, Trash2, UserCheck, UserX, Plus, Code, Clock
} from 'lucide-react';

const StaffDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentTeacher, status, error } = useAppSelector(state => state.teachers);
  const { isOpen } = useAppSelector(state => state.modal);
  const [classes, setClasses] = useState<Class[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (id) {
      dispatch(fetchTeacherById(parseInt(id)));
    }
  }, [dispatch, id]);

  const fetchTeacherData = async () => {
    if (!currentTeacher) return;

    try {
      setLoading(true);
      
      // Fetch teacher's classes
      const classesResponse = await classApi.getAllByTeacher(currentTeacher.id);
      const teacherClasses = Array.isArray(classesResponse.data.data) 
        ? classesResponse.data.data 
        : [];
      setClasses(teacherClasses);

      // Fetch teacher's courses
      const coursesResponse = await courseApi.getByTeacher(currentTeacher.id);
      const teacherCourses = Array.isArray(coursesResponse.data.data) 
        ? coursesResponse.data.data 
        : [];
      setCourses(teacherCourses);

    } catch (error) {
      console.error('Failed to fetch teacher data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacherData();
  }, [currentTeacher]);

  // Refresh data when modal closes (after successful assignment)
  useEffect(() => {
    if (!isOpen && currentTeacher) {
      fetchTeacherData();
    }
  }, [isOpen, currentTeacher]);

  const handleEdit = () => {
    if (currentTeacher) {
      dispatch(openModal({
        title: 'Edit Teacher',
        bodyType: MODAL_BODY_TYPES.TEACHER_EDIT,
        extraObject: currentTeacher,
        size: 'lg'
      }));
    }
  };

  const handleDelete = () => {
    if (currentTeacher) {
      dispatch(openModal({
        title: 'Remove Teacher',
        bodyType: MODAL_BODY_TYPES.TEACHER_DELETE_CONFIRMATION,
        extraObject: currentTeacher
      }));
    }
  };

  const handleToggleStatus = async () => {
    if (currentTeacher) {
      try {
        if (currentTeacher.active) {
          await dispatch(deactivateTeacher(currentTeacher.id)).unwrap();
        } else {
          await dispatch(activateTeacher(currentTeacher.id)).unwrap();
        }
        // Refresh the teacher data
        dispatch(fetchTeacherById(currentTeacher.id));
      } catch (error) {
        console.error('Failed to toggle teacher status:', error);
      }
    }
  };

  const handleAssignCourse = () => {
    if (currentTeacher) {
      dispatch(openModal({
        title: 'Assign Course',
        bodyType: MODAL_BODY_TYPES.TEACHER_ASSIGN_COURSE,
        extraObject: currentTeacher,
        size: 'lg'
      }));
    }
  };

  const handleAssignClass = () => {
    if (currentTeacher) {
      dispatch(openModal({
        title: 'Assign Class',
        bodyType: MODAL_BODY_TYPES.TEACHER_ASSIGN_CLASS,
        extraObject: currentTeacher,
        size: 'lg'
      }));
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error || !currentTeacher) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p>{error || 'Teacher not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/app/staff-management')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {currentTeacher.firstName} {currentTeacher.lastName}
            </h1>
            <p className="text-gray-600">Staff Profile & Assignment Management</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleStatus}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              currentTeacher.active
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {currentTeacher.active ? <UserX size={16} /> : <UserCheck size={16} />}
            {currentTeacher.active ? 'Deactivate' : 'Activate'}
          </button>
          <button
            onClick={handleEdit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Edit size={16} />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      {/* Teacher Overview Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start gap-6">
          <div className="p-4 bg-blue-100 rounded-full">
            <User size={32} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {currentTeacher.firstName} {currentTeacher.lastName}
              </h2>
              <div className="flex gap-2">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  currentTeacher.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {currentTeacher.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <User size={16} className="text-gray-400" />
                <span className="text-sm text-gray-600">
                  Staff ID: <span className="font-medium">{currentTeacher.staffId}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gray-400" />
                <span className="text-sm text-gray-600">
                  <span className="font-medium">{currentTeacher.email}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap size={16} className="text-gray-400" />
                <span className="text-sm text-gray-600">
                  <span className="font-medium">{currentTeacher.qualification}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'courses', label: 'Assigned Courses', icon: BookOpen },
              { id: 'classes', label: 'Assigned Classes', icon: Users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User size={16} className="text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-600">Full Name</span>
                        <div className="font-medium">{currentTeacher.firstName} {currentTeacher.lastName}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <User size={16} className="text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-600">Staff ID</span>
                        <div className="font-medium">{currentTeacher.staffId}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <GraduationCap size={16} className="text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-600">Qualification</span>
                        <div className="font-medium">{currentTeacher.qualification}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-600">Email</span>
                        <div className="font-medium">{currentTeacher.email}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{courses.length}</div>
                  <div className="text-sm text-gray-600">Assigned Courses</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{classes.length}</div>
                  <div className="text-sm text-gray-600">Assigned Classes</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{currentTeacher.active ? 'Active' : 'Inactive'}</div>
                  <div className="text-sm text-gray-600">Status</div>
                </div>
              </div>
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Assigned Courses</h3>
                <button
                  onClick={handleAssignCourse}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Plus size={16} />
                  Assign Course
                </button>
              </div>
              
              {courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {courses.map((course) => (
                    <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-gray-900">{course.name}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          course.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {course.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Code size={14} className="text-gray-400" />
                          <span>Code: {course.code}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-gray-400" />
                          <span>Year: {course.year}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-gray-400" />
                          <span>Term: {course.term}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600 mb-4">No courses assigned yet</p>
                  <button
                    onClick={handleAssignCourse}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
                  >
                    <Plus size={16} />
                    Assign First Course
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Classes Tab */}
          {activeTab === 'classes' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Assigned Classes</h3>
                <button
                  onClick={handleAssignClass}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Plus size={16} />
                  Assign Class
                </button>
              </div>
              
              {classes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {classes.map((classItem) => (
                    <div key={classItem.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-gray-900">{classItem.name}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          classItem.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {classItem.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Users size={14} className="text-gray-400" />
                          <span>Students: {classItem.currentEnrollment || 0}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GraduationCap size={14} className="text-gray-400" />
                          <span>Grade: {classItem.gradeLevel}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users size={14} className="text-gray-400" />
                          <span>Capacity: {classItem.capacity || 'Not set'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600 mb-4">No classes assigned yet</p>
                  <button
                    onClick={handleAssignClass}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
                  >
                    <Plus size={16} />
                    Assign First Class
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffDetailPage; 