import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { assignTeacherToClass } from '../classesSlice';
import { fetchTeachers } from '../../teachers/teachersSlice';
import { fetchClasses } from '../classesSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';

interface ClassAssignTeacherModalProps {
  extraObject: {
    classId: number;
    className: string;
    gradeLevel: string;
    availableTeachers: Array<{
      id: number;
      firstName: string;
      lastName: string;
      email: string;
    }>;
  };
}

const ClassAssignTeacherModal: React.FC<ClassAssignTeacherModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.classes);
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | ''>('');

  useEffect(() => {
    dispatch(fetchTeachers());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacherId) return;

    try {
      await dispatch(assignTeacherToClass({
        classId: extraObject.classId,
        teacherId: selectedTeacherId
      })).unwrap();
      
      dispatch(fetchClasses());
      dispatch(closeModal({}));
    } catch (err) {
      console.error('Failed to assign teacher:', err);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium text-gray-900">Class Information</h3>
        <div className="mt-2 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Class Name</p>
            <p className="text-sm font-medium text-gray-900">{extraObject.className}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Grade Level</p>
            <p className="text-sm font-medium text-gray-900">{extraObject.gradeLevel}</p>
          </div>
        </div>
      </div>

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
            {extraObject.availableTeachers.map((teacher) => (
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

export default ClassAssignTeacherModal; 