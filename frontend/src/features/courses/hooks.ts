import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import {
  fetchCourses,
  fetchCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  activateCourse,
  deactivateCourse,
  addTeacherToCourse,
  removeTeacherFromCourse
} from './coursesSlice';
import { Course, CreateCourseRequest, UpdateCourseRequest } from '../../api/services/courseApi';

/**
 * Hook for accessing and managing courses
 */
export const useCourses = () => {
  const dispatch = useDispatch();
  const { courses, status, error } = useSelector((state: RootState) => state.courses);

  const getCourses = useCallback(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  const getCourseById = useCallback((id: number) => {
    dispatch(fetchCourseById(id));
  }, [dispatch]);

  const createNewCourse = useCallback((courseData: CreateCourseRequest) => {
    return dispatch(createCourse(courseData));
  }, [dispatch]);

  const updateExistingCourse = useCallback((id: number, courseData: UpdateCourseRequest) => {
    return dispatch(updateCourse({ id, courseData }));
  }, [dispatch]);

  const removeCourse = useCallback((id: number) => {
    return dispatch(deleteCourse(id));
  }, [dispatch]);

  const activateExistingCourse = useCallback((id: number) => {
    return dispatch(activateCourse(id));
  }, [dispatch]);

  const deactivateExistingCourse = useCallback((id: number) => {
    return dispatch(deactivateCourse(id));
  }, [dispatch]);

  const addTeacher = useCallback((courseId: number, teacherId: number, isPrimary: boolean = false) => {
    return dispatch(addTeacherToCourse({ courseId, teacherId, isPrimary }));
  }, [dispatch]);

  const removeTeacher = useCallback((courseId: number, teacherId: number) => {
    return dispatch(removeTeacherFromCourse({ courseId, teacherId }));
  }, [dispatch]);

  return {
    courses,
    status,
    error,
    loading: status === 'loading',
    getCourses,
    getCourseById,
    createCourse: createNewCourse,
    updateCourse: updateExistingCourse,
    deleteCourse: removeCourse,
    activateCourse: activateExistingCourse,
    deactivateCourse: deactivateExistingCourse,
    addTeacherToCourse: addTeacher,
    removeTeacherFromCourse: removeTeacher
  };
};

/**
 * Hook to fetch courses on component mount
 */
export function useCoursesData() {
  const { getCourses, courses, loading, error } = useCourses();

  useEffect(() => {
    getCourses();
  }, [getCourses]);

  return { courses, loading, error };
}

/**
 * Hook for accessing details of a specific course
 */
export const useCourseDetails = (courseId: number) => {
  const dispatch = useDispatch();
  const { currentCourse, status, error } = useSelector((state: RootState) => state.courses);

  const fetchCourseDetails = useCallback(() => {
    dispatch(fetchCourseById(courseId));
  }, [dispatch, courseId]);

  const updateCourseDetails = useCallback((courseData: UpdateCourseRequest) => {
    return dispatch(updateCourse({ id: courseId, courseData }));
  }, [dispatch, courseId]);

  const deleteCourseDetails = useCallback(() => {
    return dispatch(deleteCourse(courseId));
  }, [dispatch, courseId]);

  const activateCourseDetails = useCallback(() => {
    return dispatch(activateCourse(courseId));
  }, [dispatch, courseId]);

  const deactivateCourseDetails = useCallback(() => {
    return dispatch(deactivateCourse(courseId));
  }, [dispatch, courseId]);

  const addTeacherToCourseDetails = useCallback((teacherId: number, isPrimary: boolean = false) => {
    return dispatch(addTeacherToCourse({ courseId, teacherId, isPrimary }));
  }, [dispatch, courseId]);

  const removeTeacherFromCourseDetails = useCallback((teacherId: number) => {
    return dispatch(removeTeacherFromCourse({ courseId, teacherId }));
  }, [dispatch, courseId]);

  return {
    course: currentCourse,
    status,
    error,
    loading: status === 'loading',
    fetchCourseDetails,
    updateCourse: updateCourseDetails,
    deleteCourse: deleteCourseDetails,
    activateCourse: activateCourseDetails,
    deactivateCourse: deactivateCourseDetails,
    addTeacher: addTeacherToCourseDetails,
    removeTeacher: removeTeacherFromCourseDetails
  };
};

/**
 * Hook to handle course form operations
 */
export function useCourseForm(id?: string) {
  const navigate = useNavigate();
  const { addCourse, editCourse, currentCourse, loading, error, getCourseById, resetError } = useCourses();

  useEffect(() => {
    resetError();
    if (id) {
      getCourseById(id);
    }
  }, [id, getCourseById, resetError]);

  const handleSubmit = async (courseData: Omit<Course, 'id'> | Partial<Course>) => {
    try {
      if (id) {
        await editCourse(id, courseData);
        navigate(`/app/courses/${id}`);
      } else {
        const result = await addCourse(courseData as Omit<Course, 'id'>);
        navigate(`/app/courses/${result.id}`);
      }
      return true;
    } catch (error) {
      console.error('Error submitting course form:', error);
      return false;
    }
  };

  return {
    initialValues: id ? currentCourse : null,
    loading,
    error,
    handleSubmit,
    isEditing: !!id
  };
} 