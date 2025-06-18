import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { addTeacherToCourse } from '../coursesSlice';
import { fetchTeachers } from '../../teachers/teachersSlice';
import { fetchCourses } from '../coursesSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';

interface CourseAssignTeacherModalProps {
  extraObject: {
    courseId: number;
    courseName: string;
    availableTeachers?: Array<{
      id: number;
      firstName: string;
      lastName: string;
      email: string;
    }>;
  };
}

const CourseAssignTeacherModal: React.FC<CourseAssignTeacherModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.courses);
  const { teachers } = useAppSelector((state) => state.teachers);
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | ''>('');

  useEffect(() => {
    dispatch(fetchTeachers());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacherId) return;

    try {
      await dispatch(addTeacherToCourse({
        courseId: extraObject.courseId,
        teacherId: selectedTeacherId
      })).unwrap();
      
      dispatch(fetchCourses());
      dispatch(closeModal({}));
    } catch (err) {
      console.error('Failed to assign teacher:', err);
    }
  };

  // Use availableTeachers from props if provided, otherwise use all teachers from Redux store
  const availableTeachers = extraObject.availableTeachers || teachers;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Assign Teacher to Course</h2>
      <p className="text-gray-600 mb-4">Course: {extraObject.courseName}</p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Teacher
          </label>
          <select
            value={selectedTeacherId}
            onChange={(e) => setSelectedTeacherId(e.target.value ? Number(e.target.value) : '')}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="">Select a teacher</option>
            {availableTeachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.firstName} {teacher.lastName} ({teacher.email})
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="mb-4 text-red-600">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => dispatch(closeModal({}))}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={status === 'loading' || !selectedTeacherId}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {status === 'loading' ? 'Assigning...' : 'Assign Teacher'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseAssignTeacherModal; 