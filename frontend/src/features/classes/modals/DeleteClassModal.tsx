import React, { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { deleteClass, fetchClasses } from '../classesSlice';
import { Class } from '../../../api/services/classApi';
import { AlertTriangle, Trash2, School } from 'lucide-react';

interface DeleteClassModalProps {
  extraObject?: Class;
}

export const DeleteClassModal: React.FC<DeleteClassModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const isConfirmationValid = confirmationText === extraObject?.name;

  const handleDelete = async () => {
    if (!extraObject || !isConfirmationValid) return;

    try {
      setIsDeleting(true);
      setError(null);
      await dispatch(deleteClass(extraObject.id)).unwrap();
      setIsSuccess(true);
      
      // Refresh the classes list
      await dispatch(fetchClasses());
      
      // Show success briefly then close
      setTimeout(() => {
        handleClose();
      }, 1500);
      
    } catch (error: any) {
      console.error('Failed to delete class:', error);
      setIsDeleting(false);
      
      // Handle specific error messages
      if (error.includes('foreign key') || error.includes('constraint')) {
        setError('Cannot delete this class because it has associated students or courses. Please remove all associations first.');
      } else {
        setError(error || 'Failed to delete class. Please try again.');
      }
    }
  };

  if (!extraObject) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-red-100 p-3">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Class Selected</h3>
        <p className="text-gray-600 mb-4">No class was selected for deletion.</p>
        <button
          onClick={handleClose}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <School className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Class Deleted Successfully!</h3>
        <p className="text-gray-600">The class has been removed from your system.</p>
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
          <h3 className="text-lg font-semibold text-gray-900">Delete Class</h3>
          <p className="text-sm text-gray-600">This action cannot be undone</p>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-red-800 mb-1">Warning: Permanent Deletion</h4>
            <p className="text-sm text-red-700">
              Deleting this class will permanently remove all associated data including:
            </p>
            <ul className="text-sm text-red-700 mt-2 list-disc list-inside space-y-1">
              <li>Student enrollments and records</li>
              <li>Class schedules and timetables</li>
              <li>Associated courses and assignments</li>
              <li>All related class data</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Class Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <School className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex-grow">
            <div className="font-medium text-gray-900">{extraObject.name}</div>
            <div className="text-sm text-gray-500">Grade: {extraObject.grade}</div>
            <div className="text-sm text-gray-500">
              Capacity: {extraObject.capacity || 'Not set'} | 
              Current Enrollment: {extraObject.currentEnrollment || 0}
            </div>
          </div>
          <div>
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
              extraObject.active 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {extraObject.active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      {/* Confirmation Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type the class name to confirm deletion:
        </label>
        <div className="text-sm text-gray-600 mb-2">
          Please type <span className="font-medium text-gray-900">"{extraObject.name}"</span> to confirm
        </div>
        <input
          type="text"
          value={confirmationText}
          onChange={(e) => setConfirmationText(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          placeholder={extraObject.name}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={handleClose}
          disabled={isDeleting}
          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting || !isConfirmationValid}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isDeleting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4" />
              Delete Class
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DeleteClassModal; 