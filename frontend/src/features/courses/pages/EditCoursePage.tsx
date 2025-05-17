import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { CourseForm } from '../components/CourseForm';
import { useCourseForm, useCourse } from '../hooks';

const EditCoursePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { course, loading: courseLoading, error: courseError } = useCourse(id);
  const { handleSubmit, loading: submitLoading, error: submitError } = useCourseForm(id);

  if (courseLoading) {
    return <div className="flex items-center justify-center p-8">Loading course...</div>;
  }

  if (courseError) {
    return <div className="p-8 text-red-500">Error loading course: {courseError}</div>;
  }

  if (!course && !courseLoading) {
    return <Navigate to="/courses" replace />;
  }

  return (
    <CourseForm
      initialValues={course}
      onSubmit={handleSubmit}
      loading={submitLoading}
      error={submitError}
      isEditing={true}
    />
  );
};

export default EditCoursePage; 