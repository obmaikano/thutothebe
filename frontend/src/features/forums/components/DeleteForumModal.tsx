import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { deleteForum } from '../forumsSlice';
import { closeModal } from '../../common/modalSlice';
import { showNotification } from '../../common/headerSlice';
import { Forum } from '../../../api/services/forumApi';
import { AlertTriangle } from 'lucide-react';

interface DeleteForumModalProps {
  extraObject?: Forum;
}

const DeleteForumModal: React.FC<DeleteForumModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.forums);
  
  const isLoading = status === 'loading';

  const handleDelete = async () => {
    if (!extraObject) return;

    try {
      await dispatch(deleteForum(extraObject.id)).unwrap();
      
      dispatch(showNotification({
        message: 'Forum deleted successfully',
        status: 1
      }));
      dispatch(closeModal());
    } catch (error: any) {
      dispatch(showNotification({
        message: error || 'Failed to delete forum',
        status: 0
      }));
    }
  };

  if (!extraObject) {
    return (
      <div className="text-center py-4">
        <p className="text-error">No forum selected for deletion</p>
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
          You are about to delete the following forum:
        </p>
        <div className="bg-base-100 rounded p-3">
          <p className="font-semibold">{extraObject.title}</p>
          {extraObject.description && (
            <p className="text-sm text-base-content/70 mt-1">{extraObject.description}</p>
          )}
          <p className="text-xs text-base-content/60 mt-2">Course ID: {extraObject.courseId}</p>
        </div>
      </div>

      <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
        <p className="text-warning text-sm">
          <strong>Warning:</strong> This action cannot be undone. All threads and comments in this forum will also be deleted.
        </p>
      </div>

      <div className="modal-action">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => dispatch(closeModal())}
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
          {isLoading ? 'Deleting...' : 'Delete Forum'}
        </button>
      </div>
    </div>
  );
};

export default DeleteForumModal; 