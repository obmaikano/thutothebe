import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { assignTeacherToClass } from '../../classes/classesSlice';
import { fetchClassesWithTeachers } from '../../classes/classesSlice';
import { refreshTeacherClasses } from '../teachersSlice';
import { Class } from '../../../api/services/classApi';
import classApi from '../../../api/services/classApi';

interface TeacherAssignClassModalProps {
  extraObject: {
    teacherId: number;
    teacher: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  onClassAssigned?: () => void;
}

const TeacherAssignClassModal: React.FC<TeacherAssignClassModalProps> = ({ extraObject, onClassAssigned }) => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.classes);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvailableClasses = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const response = await classApi.getActiveClasses();
        if ((response.data.status === 'success' || response.data.status === 'SUCCESS') && response.data.data) {
          const classData = Array.isArray(response.data.data) 
            ? response.data.data 
            : [response.data.data];
          setClasses(classData);
        }
      } catch (err) {
        console.error('Failed to fetch classes:', err);
        setFetchError('Failed to load available classes');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableClasses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId) return;

    try {
      await dispatch(assignTeacherToClass({
        classId: selectedClassId,
        teacherId: extraObject.teacherId
      })).unwrap();
      
      dispatch(fetchClassesWithTeachers());
      dispatch(refreshTeacherClasses(extraObject.teacherId));
      dispatch(closeModal({}));
      if (onClassAssigned) {
        onClassAssigned();
      }
    } catch (err) {
      console.error('Failed to assign teacher to class:', err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Assign Teacher to Class</h2>
      <p className="text-gray-600 mb-4">
        Teacher: {extraObject.teacher.firstName} {extraObject.teacher.lastName} ({extraObject.teacher.email})
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Class
          </label>
          {loading ? (
            <div className="w-full p-2 border rounded-md bg-gray-50 text-gray-500">
              Loading classes...
            </div>
          ) : fetchError ? (
            <div className="w-full p-2 border border-red-300 rounded-md bg-red-50 text-red-600">
              {fetchError}
            </div>
          ) : (
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value ? Number(e.target.value) : '')}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select a class</option>
              {classes.map((classItem) => (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.name} - Grade {classItem.gradeLevel} 
                  {classItem.capacity && ` (${classItem.totalEnrolled || 0}/${classItem.capacity} students)`}
                </option>
              ))}
            </select>
          )}
        </div>

        {classes.length === 0 && !loading && !fetchError && (
          <div className="mb-4 text-yellow-600 bg-yellow-50 p-3 rounded-md">
            No active classes available for assignment.
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
            disabled={status === 'loading' || !selectedClassId || loading}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {status === 'loading' ? 'Assigning...' : 'Assign to Class'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TeacherAssignClassModal; 