import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../app/hooks';
import { createCourse, updateCourse } from '../coursesSlice';

export interface CourseFormValues {
  name: string;
  code: string;
  description: string;
  startDate: string;
  endDate: string;
  credits: number;
  instructor: string;
  department: string;
  status: string;
  enrollmentCount: number;
  thumbnail: string;
}

export const useCourseForm = (courseId?: string) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = useCallback(async (values: CourseFormValues) => {
    setLoading(true);
    setError(null);
    
    try {
      if (courseId) {
        await dispatch(updateCourse({ id: courseId, courseData: values })).unwrap();
        navigate(`/courses/${courseId}`);
      } else {
        const result = await dispatch(createCourse(values)).unwrap();
        navigate(`/courses/${result.id}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save course');
    } finally {
      setLoading(false);
    }
  }, [dispatch, navigate, courseId]);
  
  return {
    handleSubmit,
    loading,
    error
  };
}; 