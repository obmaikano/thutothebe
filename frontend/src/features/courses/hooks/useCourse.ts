import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchCourseById, selectCurrentCourse, selectCoursesLoading, selectCoursesError } from '../coursesSlice';

export const useCourse = (id?: string) => {
  const dispatch = useAppDispatch();
  const course = useAppSelector(selectCurrentCourse);
  const loading = useAppSelector(selectCoursesLoading);
  const error = useAppSelector(selectCoursesError);
  
  useEffect(() => {
    if (id) {
      dispatch(fetchCourseById(id));
    }
  }, [dispatch, id]);
  
  return {
    course,
    loading,
    error
  };
}; 