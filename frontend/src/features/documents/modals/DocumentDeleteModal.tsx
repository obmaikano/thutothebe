import React from 'react';
import { useDispatch } from 'react-redux';
import { Trash2, AlertTriangle } from 'lucide-react';
import { AppDispatch } from '../../../app/store';
import { deleteDocument } from '../documentsSlice';
import { closeModal } from '../../common/modalSlice';
import { Document } from '../../../api/services/documentApi';
import { useAuth } from '../../../contexts/AuthContext';

interface DocumentDeleteModalProps {
  extraObject?: {
    document: Document;
  };
}

const DocumentDeleteModal: React.FC<DocumentDeleteModalProps> = ({ extraObject }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const document = extraObject?.document;

  if (!document) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Document not found</p>
      </div>
    );
  }

  const handleDelete = async () => {
    if (user?.id) {
      try {
        await dispatch(deleteDocument({ id: document.id, userId: user.id }));
        dispatch(closeModal({}));
      } catch (error) {
        console.error('Failed to delete document:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Warning Icon */}
      <div className="flex items-center justify-center">
        <div className="bg-red-100 rounded-full p-3">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
      </div>

      {/* Confirmation Message */}
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Document</h3>
        <p className="text-sm text-gray-500 mb-4">
          Are you sure you want to delete "{document.title}"? This action cannot be undone.
        </p>
        
        {/* Document Info */}
        <div className="bg-gray-50 rounded-lg p-4 text-left">
          <div className="space-y-2 text-sm">
            <div><span className="font-medium">File:</span> {document.fileName}</div>
            <div><span className="font-medium">Category:</span> {document.documentCategory}</div>
            <div><span className="font-medium">Uploaded by:</span> {document.uploadedBy ? `${document.uploadedBy.firstName} ${document.uploadedBy.lastName}` : document.uploadedByName || 'Unknown User'}</div>
            <div><span className="font-medium">Upload date:</span> {new Date(document.uploadedAt).toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          onClick={() => dispatch(closeModal({}))}
          className="btn btn-ghost"
        >
          Cancel
        </button>
        
        <button
          onClick={handleDelete}
          className="btn btn-error"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Document
        </button>
      </div>
    </div>
  );
};

export default DocumentDeleteModal; 