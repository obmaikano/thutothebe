import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { deleteThread } from '../threadsSlice';
import { closeModal } from '../../common/modalSlice';
import { showNotification } from '../../common/headerSlice';
import { Thread } from '../../../api/services/threadApi';
import { AlertTriangle } from 'lucide-react';

interface DeleteThreadModalProps {
  extraObject?: Thread;
}

const DeleteThreadModal: React.FC<DeleteThreadModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.threads);
  
  const isLoading = status === 'loading';

  const handleDelete = async () => {
    if (!extraObject) return;

    try {
      await dispatch(deleteThread(extraObject.id)).unwrap();
      
      dispatch(showNotification({
        message: 'Thread deleted successfully',
        status: 1
      }));
      dispatch(closeModal({}));
    } catch (error: any) {
      dispatch(showNotification({
        message: error || 'Failed to delete thread',
        status: 0
      }));
    }
  };

  if (!extraObject) {
    return (
      <div className="text-center py-4">
        <p className="text-error">No thread selected for deletion</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-warning">
        <AlertTriangle className="w-6 h-6" />
        <h3 className="text-lg font-semibold">Confirm Deletion</h3>
      </div>
      
      <div className="bg-base-200 rounded-lg p-4">
        <p className="text-base-content/80 mb-2">
          You are about to delete the following thread:
        </p>
        <div className="bg-base-100 rounded p-3">
          <p className="font-semibold">{extraObject.title}</p>
          {extraObject.content && (
            <p className="text-sm text-base-content/70 mt-1 line-clamp-3">{extraObject.content}</p>
          )}
          <div className="flex gap-4 text-xs text-base-content/60 mt-2">
            <span>Forum ID: {extraObject.forumId}</span>
            <span>Author ID: {extraObject.authorId}</span>
            {extraObject.pinned && <span className="text-warning">📌 Pinned</span>}
          </div>
        </div>
      </div>

      <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
        <p className="text-warning text-sm">
          <strong>Warning:</strong> This action cannot be undone. All comments and replies in this thread will also be deleted.
        </p>
      </div>

      <div className="modal-action">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => dispatch(closeModal({}))}
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="button"
          className={`btn btn-error ${isLoading ? 'loading' : ''}`}
          onClick={handleDelete}
          disabled={isLoading}
        >
          {isLoading ? 'Deleting...' : 'Delete Thread'}
        </button>
      </div>
    </div>
  );
};

export default DeleteThreadModal; 