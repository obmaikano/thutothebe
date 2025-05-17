import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { 
  fetchCourses, 
  fetchCourseById, 
  createCourse, 
  updateCourse, 
  deleteCourse,
  clearCurrentCourse,
  clearCoursesError,
  Course
} from './coursesSlice';

/**
 * Hook to access courses state and actions
 */
export function useCourses() {
  const dispatch = useAppDispatch();
  const { courses, currentCourse, loading, error } = useAppSelector((state) => state.courses);

  const getCourses = () => {
    dispatch(fetchCourses());
  };

  const getCourseById = (id: string) => {
    dispatch(fetchCourseById(id));
  };

  const addCourse = (courseData: Omit<Course, 'id'>) => {
    return dispatch(createCourse(courseData)).unwrap();
  };

  const editCourse = (id: string, courseData: Partial<Course>) => {
    return dispatch(updateCourse({ id, courseData })).unwrap();
  };

  const removeCourse = (id: string) => {
    return dispatch(deleteCourse(id)).unwrap();
  };

  const resetCurrentCourse = () => {
    dispatch(clearCurrentCourse());
  };

  const resetError = () => {
    dispatch(clearCoursesError());
  };

  return {
    courses,
    currentCourse,
    loading,
    error,
    getCourses,
    getCourseById,
    addCourse,
    editCourse,
    removeCourse,
    resetCurrentCourse,
    resetError
  };
}

/**
 * Hook to fetch courses on component mount
 */
export function useCoursesData() {
  const { getCourses, courses, loading, error } = useCourses();

  useEffect(() => {
    getCourses();
  }, []);

  return { courses, loading, error };
}

/**
 * Hook to fetch a specific course by ID
 */
export function useCourseDetails(id: string) {
  const { getCourseById, currentCourse, loading, error, resetCurrentCourse } = useCourses();

  useEffect(() => {
    getCourseById(id);
    return () => {
      resetCurrentCourse();
    };
  }, [id]);

  return { course: currentCourse, loading, error };
}

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
  }, [id]);

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