import { useState, useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { 
  fetchCourses,
  selectAllCourses,
  selectCoursesLoading,
  selectCoursesError
} from '../coursesSlice';

interface CoursesQueryParams {
  searchTerm?: string;
  department?: string;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

export const useCourses = () => {
  const dispatch = useAppDispatch();
  const courses = useAppSelector(selectAllCourses);
  const loading = useAppSelector(selectCoursesLoading);
  const error = useAppSelector(selectCoursesError);
  
  const fetchCoursesData = useCallback((params: CoursesQueryParams = {}) => {
    dispatch(fetchCourses(params));
  }, [dispatch]);
  
  useEffect(() => {
    fetchCoursesData();
  }, [fetchCoursesData]);
  
  return {
    courses,
    loading,
    error,
    fetchCourses: fetchCoursesData
  };
}; 