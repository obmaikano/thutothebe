import React, { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { deleteSubject, fetchSubjects } from '../subjectsSlice';
import { Subject } from '../../../api/services/subjectApi';
import { Trash2, AlertTriangle, BookOpen, CheckCircle } from 'lucide-react';

interface DeleteSubjectModalProps {
  extraObject?: Subject;
}

export const DeleteSubjectModal: React.FC<DeleteSubjectModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const handleDelete = async () => {
    if (!extraObject) return;

    setIsDeleting(true);
    setError(null);

    try {
      await dispatch(deleteSubject(extraObject.id)).unwrap();
      setIsSuccess(true);
      
      // Refresh the subjects list instead of reloading the page
      await dispatch(fetchSubjects());
      
      // Show success briefly then close
      setTimeout(() => {
        handleClose();
      }, 1500);
      
    } catch (err: any) {
      setError(err.message || 'Failed to delete subject');
      setIsDeleting(false);
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Subject Data</h3>
        <p className="text-gray-600 mb-4">No subject information was provided for deletion.</p>
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
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Subject Deleted Successfully!</h3>
        <p className="text-gray-600">The subject "{extraObject.name}" has been removed from your curriculum.</p>
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
          <h3 className="text-lg font-semibold text-gray-900">Delete Subject</h3>
          <p className="text-sm text-gray-600">This action cannot be undone</p>
        </div>
      </div>

      {/* Warning Message */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-red-100 p-3">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <p className="text-gray-700 mb-4">
          Are you sure you want to delete the subject <strong>"{extraObject.name}"</strong>?
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="text-sm font-medium text-yellow-800 mb-1">Warning: This action is permanent</p>
              <p className="text-sm text-yellow-700">
                Deleting this subject may affect related courses and academic records. 
                Please ensure this subject is no longer needed before proceeding.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Details */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BookOpen className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{extraObject.name}</div>
            <div className="text-sm text-gray-500">Subject to be deleted</div>
          </div>
        </div>
        <div className="space-y-2 text-sm border-t border-gray-200 pt-3">
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Subject Code:</span>
            <span className="font-mono text-gray-900">{extraObject.code}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Subject Name:</span>
            <span className="text-gray-900">{extraObject.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Status:</span>
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
              extraObject.active 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {extraObject.active ? 'Active' : 'Inactive'}
            </span>
          </div>
          {extraObject.description && (
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Description:</span>
              <span className="text-gray-900 text-right max-w-xs">{extraObject.description}</span>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={handleClose}
          className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          disabled={isDeleting}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 ${
            isDeleting ? 'opacity-75 cursor-not-allowed' : ''
          }`}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4" />
              Delete Subject
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DeleteSubjectModal; 