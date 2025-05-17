import React from 'react';
import { CourseForm } from '../components/CourseForm';
import { useCourseForm } from '../hooks';

const NewCoursePage: React.FC = () => {
  const { handleSubmit, loading, error } = useCourseForm();

  return (
    <CourseForm
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      isEditing={false}
    />
  );
};

export default NewCoursePage; 