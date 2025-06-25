import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { addTeacherToCourse } from '../../courses/coursesSlice';
import { fetchCourses } from '../../courses/coursesSlice';
import { Course } from '../../../api/services/courseApi';
import courseApi from '../../../api/services/courseApi';

interface TeacherAssignCourseModalProps {
  extraObject: {
    teacherId: number;
    teacher: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
    };
  };
}

const TeacherAssignCourseModal: React.FC<TeacherAssignCourseModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.courses);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvailableCourses = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const response = await courseApi.getActiveCourses();
        if (response.data.status === 'SUCCESS' && response.data.data) {
          const courseData = Array.isArray(response.data.data) 
            ? response.data.data 
            : [response.data.data];
          console.log('Fetched courses:', courseData);
          setCourses(courseData);
        }
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        setFetchError('Failed to load available courses');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableCourses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId) return;

    try {
      await dispatch(addTeacherToCourse({
        courseId: selectedCourseId,
        teacherId: extraObject.teacherId
      })).unwrap();
      
      dispatch(fetchCourses());
      dispatch(closeModal({}));
    } catch (err) {
      console.error('Failed to assign teacher to course:', err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Assign Teacher to Course</h2>
      <p className="text-gray-600 mb-4">
        Teacher: {extraObject.teacher.firstName} {extraObject.teacher.lastName} ({extraObject.teacher.email})
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Course
          </label>
          {loading ? (
            <div className="w-full p-2 border rounded-md bg-gray-50 text-gray-500">
              Loading courses...
            </div>
          ) : fetchError ? (
            <div className="w-full p-2 border border-red-300 rounded-md bg-red-50 text-red-600">
              {fetchError}
            </div>
          ) : (
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value ? Number(e.target.value) : '')}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.code} - {course.name} ({course.term}{course.year ? ` ${course.year}` : ''}{course.type ? ` - ${course.type}` : ''})
                </option>
              ))}
            </select>
          )}
        </div>

        {courses.length === 0 && !loading && !fetchError && (
          <div className="mb-4 text-yellow-600 bg-yellow-50 p-3 rounded-md">
            No active courses available for assignment.
          </div>
        )}

        {error && (
          <div className="mb-4 text-red-600 bg-red-50 p-3 rounded-md">
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
            disabled={status === 'loading' || !selectedCourseId || loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {status === 'loading' ? 'Assigning...' : 'Assign to Course'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TeacherAssignCourseModal; 