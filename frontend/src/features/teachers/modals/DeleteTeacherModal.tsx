import React, { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { deleteTeacher, fetchTeachers } from '../teachersSlice';
import { Teacher } from '../../../api/services/teacherApi';
import { AlertTriangle, Trash2, Users } from 'lucide-react';

interface DeleteTeacherModalProps {
  extraObject?: Teacher;
}

export const DeleteTeacherModal: React.FC<DeleteTeacherModalProps> = ({ extraObject: teacher }) => {
  const dispatch = useAppDispatch();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const handleDelete = async () => {
    if (!teacher) return;

    setIsDeleting(true);
    try {
      await dispatch(deleteTeacher(teacher.id)).unwrap();
      setIsSuccess(true);
      
      // Refresh the teachers list
      await dispatch(fetchTeachers());
      
      // Show success briefly then close
      setTimeout(() => {
        handleClose();
      }, 1500);
      
    } catch (error) {
      console.error('Failed to delete teacher:', error);
      setIsDeleting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Teacher Removed Successfully!</h3>
        <p className="text-gray-600">The teacher has been removed from your staff.</p>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error: No teacher data provided</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <div className="p-2 bg-red-100 rounded-lg">
          <Trash2 className="h-5 w-5 text-red-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Remove Teacher</h3>
          <p className="text-sm text-gray-600">This action cannot be undone</p>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-yellow-800">Warning</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Removing this teacher will permanently delete their record from the system. 
              This action cannot be undone.
            </p>
          </div>
        </div>
      </div>

      {/* Teacher Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Teacher to be removed:</h4>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-sm font-medium text-blue-600">
              {teacher.firstName.charAt(0)}{teacher.lastName.charAt(0)}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {teacher.firstName} {teacher.lastName}
            </p>
            <p className="text-sm text-gray-600">{teacher.email}</p>
            <p className="text-xs text-gray-500">Staff ID: {teacher.staffId}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={handleClose}
          disabled={isDeleting}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isDeleting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Removing...
            </>
          ) : (
            <>
              <Trash2 size={16} />
              Remove Teacher
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DeleteTeacherModal; 