import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchTeacherById } from '../../teachers/teachersSlice';
import { Teacher } from '../../../api/services/teacherApi';
import classApi, { Class } from '../../../api/services/classApi';
import courseApi, { Course } from '../../../api/services/courseApi';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { 
  ArrowLeft, User, Mail, Phone, MapPin, GraduationCap, 
  Calendar, BookOpen, Users, Award, CheckCircle, XCircle, 
  Edit, Trash2, UserCheck, UserX, Clock, Code
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
    // Implementation for toggling teacher status
    console.log('Toggle teacher status');
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
            <p className="text-gray-600 mt-1">Staff ID: {currentTeacher.staffId}</p>
          </div>
        </div>
        <div className="flex gap-3">
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentTeacher.firstName} {currentTeacher.lastName}
            </h2>
            <p className="text-lg text-gray-700 mb-4">{currentTeacher.qualification}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail size={16} />
                <span>{currentTeacher.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <User size={16} />
                <span>Staff ID: {currentTeacher.staffId}</span>
              </div>
              <div className="flex items-center gap-2">
                {currentTeacher.active ? (
                  <>
                    <CheckCircle size={16} className="text-green-600" />
                    <span className="text-green-600 font-medium">Active</span>
                  </>
                ) : (
                  <>
                    <XCircle size={16} className="text-red-600" />
                    <span className="text-red-600 font-medium">Inactive</span>
                  </>
                )}
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
              <div className="text-2xl font-bold text-gray-900">{courses.length}</div>
              <div className="text-sm text-gray-500">Courses</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users size={24} className="text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{classes.length}</div>
              <div className="text-sm text-gray-500">Classes</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Award size={24} className="text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {currentTeacher.active ? 'Active' : 'Inactive'}
              </div>
              <div className="text-sm text-gray-500">Status</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <GraduationCap size={24} className="text-blue-600" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">Qualified</div>
              <div className="text-sm text-gray-500">Certification</div>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BookOpen size={24} className="text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">Assigned Courses</h3>
          </div>
          <span className="text-sm text-gray-500">{courses.length} courses</span>
        </div>
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div key={course.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{course.name}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    course.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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
                    <span>Year {course.year} - {course.term} Term</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award size={14} />
                    <span>{course.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No courses assigned</p>
          </div>
        )}
      </div>

      {/* Classes Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users size={24} className="text-purple-600" />
            <h3 className="text-xl font-semibold text-gray-900">Assigned Classes</h3>
          </div>
          <span className="text-sm text-gray-500">{classes.length} classes</span>
        </div>
        {classes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((classItem) => (
              <div key={classItem.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{classItem.name}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    classItem.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {classItem.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <GraduationCap size={14} />
                    <span>Grade {classItem.grade}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={14} />
                    <span>Capacity: {classItem.capacity || 'Not set'}</span>
                  </div>
                  {classItem.currentEnrollment !== undefined && (
                    <div className="flex items-center gap-2">
                      <Users size={14} />
                      <span>Enrolled: {classItem.currentEnrollment}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No classes assigned</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDetailPage; 