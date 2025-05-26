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
  ArrowLeft, User, Mail, Phone, MapPin, GraduationCap, 
  Calendar, BookOpen, Users, Award, CheckCircle, XCircle, 
  Edit, Trash2, UserCheck, UserX, Clock, Code, Plus
} from 'lucide-react';

const StaffDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentTeacher, status, error } = useAppSelector(state => state.teachers);
  const [classes, setClasses] = useState<Class[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      dispatch(fetchTeacherById(parseInt(id)));
    }
  }, [dispatch, id]);

  useEffect(() => {
    const fetchTeacherData = async () => {
      if (!currentTeacher) return;

      try {
        setLoading(true);
        
        // Fetch teacher's classes
        const classesResponse = await classApi.getByTeacher(currentTeacher.id);
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

    fetchTeacherData();
  }, [currentTeacher]);

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
              {currentTeacher.firstName} {currentTeacher.lastName}
            </h1>
            <p className="text-gray-600 mt-1">Staff Profile & Assignment Management</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleAssignCourse}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={16} />
            Assign Course
          </button>
          <button
            onClick={handleAssignClass}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={16} />
            Assign Class
          </button>
          <button
            onClick={handleEdit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Edit size={16} />
            Edit
          </button>
          <button
            onClick={handleToggleStatus}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              currentTeacher.active 
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {currentTeacher.active ? <UserX size={16} /> : <UserCheck size={16} />}
            {currentTeacher.active ? 'Deactivate' : 'Activate'}
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Trash2 size={16} />
            Remove
          </button>
        </div>
      </div>

      {/* Teacher Profile Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8">
        <div className="flex items-start gap-6">
          <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-2xl font-bold text-blue-600">
              {currentTeacher.firstName.charAt(0)}{currentTeacher.lastName.charAt(0)}
            </span>
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
            <p className="text-lg text-gray-700 mb-4">{currentTeacher.qualification}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail size={16} />
                <span>{currentTeacher.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <User size={16} />
                <span>Staff ID: {currentTeacher.staffId}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <GraduationCap size={16} />
                <span>{currentTeacher.qualification}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <BookOpen size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
              <p className="text-sm text-gray-600">Assigned Courses</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{classes.length}</p>
              <p className="text-sm text-gray-600">Assigned Classes</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <CheckCircle size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{currentTeacher.active ? 'Active' : 'Inactive'}</p>
              <p className="text-sm text-gray-600">Status</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Award size={24} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">Certified</p>
              <p className="text-sm text-gray-600">Qualification</p>
            </div>
          </div>
        </div>
      </div>

      {/* Assigned Courses Section */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Assigned Courses</h3>
            <button
              onClick={handleAssignCourse}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
            >
              <Plus size={14} />
              Assign Course
            </button>
          </div>
        </div>
        <div className="p-6">
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{course.name}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      course.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {course.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Code size={14} />
                      <span>Code: {course.code}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      <span>Year: {course.year}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      <span>Term: {course.term}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">No courses assigned yet</p>
              <button
                onClick={handleAssignCourse}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
              >
                <Plus size={16} />
                Assign First Course
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Assigned Classes Section */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Assigned Classes</h3>
            <button
              onClick={handleAssignClass}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
            >
              <Plus size={14} />
              Assign Class
            </button>
          </div>
        </div>
        <div className="p-6">
          {classes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classes.map((classItem) => (
                <div key={classItem.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{classItem.name}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      classItem.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {classItem.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Users size={14} />
                      <span>Students: {classItem.currentEnrollment || 0}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap size={14} />
                      <span>Grade: {classItem.grade}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={14} />
                      <span>Capacity: {classItem.capacity || 'Not set'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">No classes assigned yet</p>
              <button
                onClick={handleAssignClass}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
              >
                <Plus size={16} />
                Assign First Class
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffDetailPage; 