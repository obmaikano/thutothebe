import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { deleteContent } from '../contentSlice';
import { closeModal } from '../../common/modalSlice';
import { showNotification } from '../../common/commonSlice';
import { Content } from '../../../api/services/contentApi';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface DeleteContentModalProps {
  content: Content;
}

const DeleteContentModal: React.FC<DeleteContentModalProps> = ({ content }) => {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.content);
  const [confirmText, setConfirmText] = useState('');

  const handleDelete = async () => {
    if (confirmText !== content.title) {
      return;
    }

    try {
      await dispatch(deleteContent(content.id)).unwrap();
      dispatch(showNotification({
        type: 'success',
        message: 'Content deleted successfully!'
      }));
      dispatch(closeModal({}));
    } catch (error) {
      console.error('Failed to delete content:', error);
    }
  };

  const isConfirmValid = confirmText === content.title;

  return (
    <div className="p-6">
      <div className="flex items-center mb-4">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-medium text-gray-900">
            Delete Content
          </h3>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-700 mb-4">
          Are you sure you want to delete this content? This action cannot be undone.
        </p>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Trash2 className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-red-800">
                Content to be deleted:
              </h4>
              <div className="mt-2 text-sm text-red-700">
                <p><strong>Title:</strong> {content.title}</p>
                <p><strong>Type:</strong> {content.type}</p>
                <p><strong>Course ID:</strong> {content.courseId}</p>
                {content.description && (
                  <p><strong>Description:</strong> {content.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="confirmText" className="block text-sm font-medium text-gray-700 mb-2">
            To confirm deletion, type the content title: <strong>{content.title}</strong>
          </label>
          <input
            type="text"
            id="confirmText"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="Type the content title to confirm"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => dispatch(closeModal({}))}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={!isConfirmValid || status === 'loading'}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Deleting...' : 'Delete Content'}
        </button>
      </div>
    </div>
  );
};

export default DeleteContentModal; 