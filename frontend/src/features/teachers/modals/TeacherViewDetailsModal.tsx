import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { Teacher } from '../../../api/services/teacherApi';
import { Class } from '../../../api/services/classApi';
import courseApi, { Course } from '../../../api/services/courseApi';
import { refreshTeacherClasses } from '../teachersSlice';
import { 
  fetchAllClassesByTeacherId,
  fetchActiveClassesByTeacherId,
  fetchClassesByTeacherId
} from '../../classes/classesSlice';
import { 
  User, Mail, Phone, MapPin, GraduationCap, 
  Calendar, BookOpen, Users, Award, 
  CheckCircle, XCircle, Eye, Edit
} from 'lucide-react';

interface TeacherViewDetailsModalProps {
  extraObject?: Teacher;
  onClassAssigned?: () => void;
}

export const TeacherViewDetailsModal: React.FC<TeacherViewDetailsModalProps> = ({ extraObject: teacher, onClassAssigned }) => {
  const dispatch = useAppDispatch();
  const { lastRefreshedTeacherId } = useAppSelector((state) => state.teachers);
  const { classes, status, error } = useAppSelector((state) => state.classes);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const refreshTeacherClasses = async () => {
    if (!teacher) return;

    try {
      // Fetch teacher's classes using Redux
      dispatch(fetchAllClassesByTeacherId(teacher.id));
    } catch (error) {
      console.error('Failed to refresh teacher classes:', error);
    }
  };

  // Watch for refresh action
  useEffect(() => {
    if (lastRefreshedTeacherId === teacher?.id) {
      refreshTeacherClasses();
    }
  }, [lastRefreshedTeacherId, teacher]);

  useEffect(() => {
    const fetchTeacherData = async () => {
      if (!teacher) return;

      try {
        setLoading(true);
        
        // Fetch teacher's classes using Redux
        dispatch(fetchAllClassesByTeacherId(teacher.id));

        // Fetch teacher's courses
        const coursesResponse = await courseApi.getByTeacher(teacher.id);
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
  }, [teacher, dispatch]);

  // Update loading state based on Redux status
  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
    } else if (status === 'succeeded' || status === 'failed') {
      setLoading(false);
    }
  }, [status]);

  if (!teacher) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error: No teacher data provided</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Eye className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Teacher Details</h3>
            <p className="text-sm text-gray-600">View comprehensive teacher information</p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 p-1"
        >
          ✕
        </button>
      </div>

      {/* Teacher Profile */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-xl font-bold text-blue-600">
              {teacher.firstName.charAt(0)}{teacher.lastName.charAt(0)}
            </span>
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-bold text-gray-900">
              {teacher.firstName} {teacher.lastName}
            </h4>
            <p className="text-gray-600 mb-2">{teacher.qualification}</p>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Mail size={14} />
                <span>{teacher.email}</span>
              </div>
              <div className="flex items-center gap-1">
                <User size={14} />
                <span>Staff ID: {teacher.staffId}</span>
              </div>
              <div className="flex items-center gap-1">
                {teacher.active ? (
                  <>
                    <CheckCircle size={14} className="text-green-600" />
                    <span className="text-green-600">Active</span>
                  </>
                ) : (
                  <>
                    <XCircle size={14} className="text-red-600" />
                    <span className="text-red-600">Inactive</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <BookOpen size={20} className="text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{courses.length}</div>
              <div className="text-sm text-gray-500">Courses</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users size={20} className="text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{classes.length}</div>
              <div className="text-sm text-gray-500">Classes</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Award size={20} className="text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {teacher.active ? 'Active' : 'Inactive'}
              </div>
              <div className="text-sm text-gray-500">Status</div>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={20} className="text-blue-600" />
          <h4 className="text-lg font-semibold text-gray-900">Assigned Courses</h4>
        </div>
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {courses.map((course) => (
              <div key={course.id} className="bg-gray-50 rounded-lg p-3">
                <h5 className="font-medium text-gray-900">{course.name}</h5>
                <p className="text-sm text-gray-600">Code: {course.code}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                  <span>Year {course.year}</span>
                  <span>•</span>
                  <span>{course.term} Term</span>
                  <span>•</span>
                  <span className={`px-2 py-1 rounded-full ${
                    course.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {course.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No courses assigned</p>
        )}
      </div>

      {/* Classes Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users size={20} className="text-purple-600" />
          <h4 className="text-lg font-semibold text-gray-900">Assigned Classes</h4>
        </div>
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
          </div>
        ) : classes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {classes.map((classItem) => (
              <div key={classItem.id} className="bg-gray-50 rounded-lg p-3">
                <h5 className="font-medium text-gray-900">{classItem.name}</h5>
                <p className="text-sm text-gray-600">{classItem.description}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                  <span>Grade {classItem.gradeLevel}</span>
                  <span>•</span>
                  <span>Capacity: {classItem.capacity || 'Not set'}</span>
                  <span>•</span>
                  <span className={`px-2 py-1 rounded-full ${
                    classItem.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {classItem.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No classes assigned</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={handleClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TeacherViewDetailsModal; 