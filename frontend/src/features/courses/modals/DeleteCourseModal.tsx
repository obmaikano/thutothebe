import React, { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { deleteCourse, fetchCourses } from '../coursesSlice';
import { Course } from '../../../api/services/courseApi';
import { AlertTriangle, Trash2, BookOpen } from 'lucide-react';

interface DeleteCourseModalProps {
  extraObject?: Course;
}

export const DeleteCourseModal: React.FC<DeleteCourseModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const handleDelete = async () => {
    if (!extraObject) return;

    if (confirmationText !== extraObject.name) {
      alert('Please type the course name exactly as shown to confirm deletion.');
      return;
    }

    try {
      setIsDeleting(true);
      await dispatch(deleteCourse(extraObject.id)).unwrap();
      setIsSuccess(true);
      
      // Refresh the courses list
      await dispatch(fetchCourses());
      
      // Show success briefly then close
      setTimeout(() => {
        handleClose();
      }, 1500);
      
    } catch (error: any) {
      console.error('Failed to delete course:', error);
      setIsDeleting(false);
      
      // Show specific error message for foreign key constraint violations
      let errorMessage = 'Failed to delete course';
      if (error.message && error.message.includes('foreign key constraint')) {
        errorMessage = 'Cannot delete this course because it has associated data (grade categories, assignments, etc.). Please remove all related data first.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Course Selected</h3>
        <p className="text-gray-600 mb-4">No course was selected for deletion.</p>
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
            <BookOpen className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Course Deleted Successfully!</h3>
        <p className="text-gray-600">The course has been removed from your system.</p>
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
          <h3 className="text-lg font-semibold text-gray-900">Delete Course</h3>
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
              Deleting this course will permanently remove all associated data including:
            </p>
            <ul className="text-sm text-red-700 mt-2 list-disc list-inside space-y-1">
              <li>Course assignments and materials</li>
              <li>Student enrollments and grades</li>
              <li>Course statistics and reports</li>
              <li>All related course data</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Course Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BookOpen className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex-grow">
            <div className="font-medium text-gray-900">{extraObject.name}</div>
            <div className="text-sm text-gray-500">Code: {extraObject.code}</div>
            <div className="text-sm text-gray-500">
              {extraObject.term} {extraObject.year} • {extraObject.type}
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
          Type the course name to confirm deletion:
        </label>
        <div className="text-sm text-gray-600 mb-2">
          Please type <span className="font-medium text-gray-900">"{extraObject.name}"</span> to confirm
        </div>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          placeholder={extraObject.name}
          value={confirmationText}
          onChange={(e) => setConfirmationText(e.target.value)}
          id="confirmationInput"
        />
      </div>

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
          disabled={isDeleting || confirmationText !== extraObject.name}
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
              Delete Course
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DeleteCourseModal; 