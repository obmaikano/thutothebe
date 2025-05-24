import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchSubjectById, clearCurrentSubject } from '../subjectsSlice';
import { fetchCourses } from '../../courses/coursesSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { Subject } from '../../../api/services/subjectApi';
import { Course } from '../../../api/services/courseApi';
import { BookOpen, Edit, Trash2, Users, Calendar, ArrowLeft, Plus } from 'lucide-react';

const SubjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentSubject, status, error } = useAppSelector(state => state.subjects);
  const { courses } = useAppSelector(state => state.courses);
  const [relatedCourses, setRelatedCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (id) {
      dispatch(fetchSubjectById(parseInt(id, 10)));
      dispatch(fetchCourses());
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

  const handleCreateCourse = () => {
    if (currentSubject) {
      dispatch(openModal({
        title: 'Create Course',
        bodyType: MODAL_BODY_TYPES.COURSE_ADD_NEW,
        extraObject: { subjectId: currentSubject.id }
      }));
    }
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

  return (
    <div className="p-6">
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