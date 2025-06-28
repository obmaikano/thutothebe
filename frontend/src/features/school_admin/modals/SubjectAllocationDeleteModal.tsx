import React, { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { deleteCourse, fetchCourses } from '../../courses/coursesSlice';
import { BookOpen, Trash2, AlertTriangle, Loader2 } from 'lucide-react';

interface SubjectAllocationDeleteModalProps {
  extraObject?: {
    allocation: any;
  };
}

const SubjectAllocationDeleteModal: React.FC<SubjectAllocationDeleteModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const handleDelete = async () => {
    if (!extraObject?.allocation) return;

    try {
      setLoading(true);
      setError(null);
      
      // Get the course ID from the allocation data
      const courseId = extraObject.allocation.courseData?.id || extraObject.allocation.id;
      
      if (!courseId) {
        throw new Error('Course ID not found in allocation data');
      }
      
      await dispatch(deleteCourse(courseId)).unwrap();
      
      setIsSuccess(true);
      
      // Refresh the courses list
      await dispatch(fetchCourses());
      
      // Show success briefly then close
      setTimeout(() => {
        handleClose();
      }, 1000);
      
    } catch (error: any) {
      console.error('Failed to delete allocation:', error);
      setError(error.message || 'Failed to delete allocation');
    } finally {
      setLoading(false);
    }
  };

  if (!extraObject?.allocation) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-red-100 p-3">
            <BookOpen className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Allocation Data</h3>
        <p className="text-gray-600 mb-4">No subject allocation information was provided for deletion.</p>
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Allocation Deleted Successfully!</h3>
        <p className="text-gray-600">The subject allocation has been removed.</p>
      </div>
    );
  }

  const allocation = extraObject.allocation;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <div className="p-2 bg-red-100 rounded-lg">
          <Trash2 className="h-5 w-5 text-red-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Delete Subject Allocation</h3>
          <p className="text-sm text-gray-600">Remove the allocation for "{allocation.subject}"</p>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-red-800">Warning</h4>
            <p className="text-sm text-red-700 mt-1">
              This action will permanently delete the subject allocation. This cannot be undone.
            </p>
          </div>
        </div>
      </div>

      {/* Allocation Details */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Allocation to be deleted:</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">{allocation.subject}</div>
              <div className="text-sm text-gray-500">Assigned to {allocation.teacher}</div>
              <div className="text-sm text-gray-500">{allocation.class} • {allocation.term}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Information */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-800 mb-2">What will happen:</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• The subject allocation will be permanently removed</li>
          <li>• Any associated course data will be deleted</li>
          <li>• Teacher assignments for this subject-class combination will be removed</li>
          <li>• Progress tracking data will be lost</li>
        </ul>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={handleClose}
          disabled={loading}
          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4" />
              Delete Allocation
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SubjectAllocationDeleteModal; 