import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { deleteAnnouncement } from '../announcementsSlice';
import { closeModal } from '../../common/modalSlice';
import { useAuth } from '../../../contexts/AuthContext';
import { Announcement } from '../../../api/services/announcementApi';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface DeleteAnnouncementModalProps {
  extraObject?: Announcement;
}

const DeleteAnnouncementModal: React.FC<DeleteAnnouncementModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { status } = useAppSelector(state => state.announcements);

  const handleDelete = async () => {
    if (!user?.id || !extraObject?.id) return;

    try {
      await dispatch(deleteAnnouncement({
        id: extraObject.id,
        userId: user.id
      })).unwrap();
      dispatch(closeModal({}));
    } catch (error) {
      console.error('Failed to delete announcement:', error);
    }
  };

  if (!extraObject) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">No announcement data provided.</p>
        <button
          onClick={() => dispatch(closeModal({}))}
          className="mt-4 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="text-center">
        {/* Warning Icon */}
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Announcement</h3>
        
        {/* Warning Message */}
        <p className="text-sm text-gray-500 mb-4">
          Are you sure you want to delete this announcement? This action cannot be undone.
        </p>

        {/* Announcement Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900 mb-1">
                {extraObject.title}
              </h4>
              <p className="text-sm text-gray-600 line-clamp-2">
                {extraObject.content.length > 100 
                  ? `${extraObject.content.substring(0, 100)}...` 
                  : extraObject.content
                }
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <span>Type: {extraObject.type}</span>
                <span>Priority: {extraObject.priority}</span>
                <span>Created: {new Date(extraObject.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Impact Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
          <div className="flex items-center gap-2 text-yellow-800 text-sm">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-medium">Impact:</span>
          </div>
          <ul className="text-sm text-yellow-700 mt-2 text-left list-disc list-inside space-y-1">
            <li>All read receipts and acknowledgments will be permanently deleted</li>
            <li>Users will no longer be able to view this announcement</li>
            <li>Analytics data for this announcement will be lost</li>
            {extraObject.readCount && extraObject.readCount > 0 && (
              <li>{extraObject.readCount} users have already read this announcement</li>
            )}
            {extraObject.acknowledgmentCount && extraObject.acknowledgmentCount > 0 && (
              <li>{extraObject.acknowledgmentCount} users have acknowledged this announcement</li>
            )}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={() => dispatch(closeModal({}))}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={status === 'loading'}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {status === 'loading' ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete Announcement
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAnnouncementModal; 