import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchSubjectById, clearCurrentSubject, activateSubject, deactivateSubject } from '../subjectsSlice';
import { fetchCourses } from '../../courses/coursesSlice';
import { fetchDepartments } from '../../departments/departmentsSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { Subject } from '../../../api/services/subjectApi';
import { Course } from '../../../api/services/courseApi';
import { BookOpen, Edit, Trash2, Users, Calendar, ArrowLeft, Plus, Building, Activity, BarChart3, Eye } from 'lucide-react';

const SubjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentSubject, status, error } = useAppSelector(state => state.subjects);
  const { courses } = useAppSelector(state => state.courses);
  const { departments } = useAppSelector(state => state.departments);
  const [relatedCourses, setRelatedCourses] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'analytics'>('overview');

  useEffect(() => {
    if (id) {
      dispatch(fetchSubjectById(parseInt(id, 10)));
      dispatch(fetchCourses());
      dispatch(fetchDepartments());
    }
    return () => {
      dispatch(clearCurrentSubject());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (currentSubject && courses.length > 0) {
      const subjectCourses = courses.filter((course: Course) => course.subjectId === currentSubject.id);
      setRelatedCourses(subjectCourses);
    }
  }, [currentSubject, courses]);

  const handleEdit = () => {
    if (currentSubject) {
      dispatch(openModal({
        title: 'Edit Subject',
        bodyType: MODAL_BODY_TYPES.SUBJECT_EDIT,
        extraObject: currentSubject
      }));
    }
  };

  const handleDelete = () => {
    if (currentSubject) {
      dispatch(openModal({
        title: 'Delete Subject',
        bodyType: MODAL_BODY_TYPES.SUBJECT_DELETE_CONFIRMATION,
        extraObject: currentSubject
      }));
    }
  };

  const handleToggleStatus = async () => {
    if (!currentSubject) return;
    
    try {
      if (currentSubject.active) {
        await dispatch(deactivateSubject(currentSubject.id)).unwrap();
      } else {
        await dispatch(activateSubject(currentSubject.id)).unwrap();
      }
    } catch (error) {
      console.error('Failed to toggle subject status:', error);
    }
  };

  const handleCreateCourse = () => {
    if (currentSubject) {
      dispatch(openModal({
        title: 'Create Course',
        bodyType: MODAL_BODY_TYPES.COURSE_ADD_NEW,
        extraObject: { subjectId: currentSubject.id }
      }));
    }
  };

  const getDepartmentInfo = () => {
    if (!(currentSubject as any)?.departmentId) return null;
    return departments.find(d => d.id === (currentSubject as any).departmentId);
  };

  const getSubjectStats = () => {
    const activeCourses = relatedCourses.filter(c => c.active).length;
    const totalStudents = relatedCourses.reduce((sum, course) => sum + (course.enrolledStudents || 0), 0);
    const totalInstructors = new Set(relatedCourses.flatMap(c => c.instructorIds || [])).size;
    
    return {
      totalCourses: relatedCourses.length,
      activeCourses,
      totalStudents,
      totalInstructors
    };
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!currentSubject) {
    return (
      <div className="p-6">
        <div className="alert alert-warning">
          <span>Subject not found</span>
        </div>
      </div>
    );
  }

  const departmentInfo = getDepartmentInfo();
  const stats = getSubjectStats();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/app/subjects')}
          className="btn btn-ghost btn-sm gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Subjects
        </button>
      </div>

      {/* Subject Header Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-lg bg-blue-100 flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{currentSubject.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  {currentSubject.code}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  currentSubject.active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {currentSubject.active ? 'Active' : 'Inactive'}
                </span>
                {departmentInfo && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    <Building className="h-4 w-4 mr-1" />
                    {departmentInfo.name}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleToggleStatus}
              className={`btn btn-sm gap-2 ${
                currentSubject.active ? 'btn-warning' : 'btn-success'
              }`}
            >
              <Activity className="h-4 w-4" />
              {currentSubject.active ? 'Deactivate' : 'Activate'}
            </button>
            <button
              onClick={handleEdit}
              className="btn btn-outline btn-sm gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="btn btn-error btn-sm gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>

        {currentSubject.description && (
          <div className="mt-4">
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600">{currentSubject.description}</p>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <BookOpen size={20} className="text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalCourses}</div>
              <div className="text-sm text-gray-500">Total Courses</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <Activity size={20} className="text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.activeCourses}</div>
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
              <div className="text-2xl font-bold text-gray-900">{stats.totalStudents}</div>
              <div className="text-sm text-gray-500">Total Students</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg mr-3">
              <Users size={20} className="text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalInstructors}</div>
              <div className="text-sm text-gray-500">Instructors</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'courses'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Courses ({relatedCourses.length})
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Subject Info Card */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-8 w-8 text-primary" />
                  <div>
                    <h1 className="text-2xl font-bold">{currentSubject.name}</h1>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                        {currentSubject.code}
                      </span>
                      <div className={`badge ${currentSubject.active ? 'badge-success' : 'badge-warning'}`}>
                        {currentSubject.active ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleEdit}
                    className="btn btn-outline btn-sm gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="btn btn-error btn-sm gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>

              {currentSubject.description && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-600">{currentSubject.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Related Courses */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h2 className="card-title">Related Courses</h2>
                <button
                  onClick={handleCreateCourse}
                  className="btn btn-primary btn-sm gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create Course
                </button>
              </div>

              {relatedCourses.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">No courses created for this subject yet</p>
                  <button
                    onClick={handleCreateCourse}
                    className="btn btn-primary btn-sm gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create First Course
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {relatedCourses.map((course: Course) => (
                    <div key={course.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{course.name}</h4>
                          <p className="text-sm text-gray-600">Code: {course.code}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span>Term: {course.term}</span>
                            <span>Year: {course.year}</span>
                            <span>Type: {course.type}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`badge ${course.active ? 'badge-success' : 'badge-warning'} badge-sm`}>
                            {course.active ? 'Active' : 'Inactive'}
                          </div>
                          {course.instructorIds && course.instructorIds.length > 0 && (
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Users className="h-3 w-3" />
                              <span>{course.instructorIds.length}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Statistics */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-lg">Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Courses</span>
                  <span className="font-semibold">{relatedCourses.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Courses</span>
                  <span className="font-semibold text-success">
                    {relatedCourses.filter((c: Course) => c.active).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Teachers</span>
                  <span className="font-semibold">
                    {new Set(relatedCourses.flatMap((c: Course) => c.instructorIds || [])).size}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-lg">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={handleCreateCourse}
                  className="btn btn-outline btn-sm w-full gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create Course
                </button>
                <button
                  onClick={handleEdit}
                  className="btn btn-outline btn-sm w-full gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Subject
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectDetailPage; 