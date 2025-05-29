import React, { useState } from 'react';
import { useAppDispatch } from '../../../store';
import { closeModal } from '../../common/modalSlice';
import { deleteQuiz, fetchQuizzes } from '../quizzesSlice';
import { Quiz } from '../../../api/services/quizApi';
import { Trash2, AlertTriangle, FileQuestion, CheckCircle } from 'lucide-react';

interface DeleteQuizModalProps {
  extraObject?: Quiz;
}

export const DeleteQuizModal: React.FC<DeleteQuizModalProps> = ({ extraObject }) => {
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
      await dispatch(deleteQuiz(extraObject.id)).unwrap();
      setIsSuccess(true);
      
      // Refresh the quizzes list instead of reloading the page
      await dispatch(fetchQuizzes());
      
      // Show success briefly then close
      setTimeout(() => {
        handleClose();
      }, 1500);
      
    } catch (err: any) {
      setError(err.message || 'Failed to delete quiz');
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Quiz Data</h3>
        <p className="text-gray-600 mb-4">No quiz information was provided for deletion.</p>
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Quiz Deleted Successfully!</h3>
        <p className="text-gray-600">The quiz has been permanently removed from the system.</p>
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
          <h3 className="text-lg font-semibold text-gray-900">Delete Quiz</h3>
          <p className="text-sm text-gray-600">This action cannot be undone</p>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-red-800 mb-1">Warning: Permanent Deletion</h4>
            <p className="text-sm text-red-700">
              Deleting this quiz will permanently remove:
            </p>
            <ul className="text-sm text-red-700 mt-2 list-disc list-inside space-y-1">
              <li>All quiz questions and answers</li>
              <li>All student submissions and grades</li>
              <li>All quiz analytics and reports</li>
              <li>Quiz settings and configurations</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quiz Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileQuestion className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-900">{extraObject.title}</div>
            <div className="text-sm text-gray-500">Code: {extraObject.code}</div>
            <div className="text-sm text-gray-500">Course: {extraObject.courseName || 'Unknown'}</div>
            <div className="text-sm text-gray-500">
              Status: <span className={`font-medium ${
                extraObject.status === 'PUBLISHED' ? 'text-green-600' :
                extraObject.status === 'DRAFT' ? 'text-yellow-600' :
                'text-gray-600'
              }`}>
                {extraObject.status}
              </span>
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
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type the quiz title to confirm deletion:
          </label>
          <div className="text-sm text-gray-600 mb-2">
            Please type: <span className="font-mono bg-gray-100 px-1 rounded">{extraObject.title}</span>
          </div>
          <input
            type="text"
            placeholder={`Type "${extraObject.title}" to confirm`}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            disabled={isDeleting}
          />
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

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={handleClose}
          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          disabled={isDeleting}
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          className={`px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2 ${
            isDeleting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4" />
              Delete Quiz
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DeleteQuizModal; 