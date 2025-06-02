import React from 'react';
import { useDispatch } from 'react-redux';
import { Download, Edit, Trash2, Eye, Calendar, User, Tag, FileText } from 'lucide-react';
import { AppDispatch } from '../../../app/store';
import { downloadDocument } from '../documentsSlice';
import { openModal, closeModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { Document } from '../../../api/services/documentApi';
import { useAuth } from '../../../contexts/AuthContext';

interface DocumentViewModalProps {
  extraObject?: {
    document: Document;
  };
}

const DocumentViewModal: React.FC<DocumentViewModalProps> = ({ extraObject }) => {
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

  const canEditDocument = [
    'SUPER_ADMIN',
    'SCHOOL_ADMIN',
    'DEPARTMENT_HEAD',
    'SENIOR_TEACHER',
    'TEACHER'
  ].includes(user.role) || (document.uploadedBy?.id === user?.id || document.uploadedById === user?.id);

  const canDeleteDocument = [
    'SUPER_ADMIN',
    'SCHOOL_ADMIN',
    'DEPARTMENT_HEAD',
    'SENIOR_TEACHER'
  ].includes(user.role) || (document.uploadedBy?.id === user?.id || document.uploadedById === user?.id);

  const handleDownload = () => {
    if (user?.id) {
      dispatch(downloadDocument({
        id: document.id,
        userId: user.id,
        fileName: document.fileName
      }));
    }
  };

  const handleEdit = () => {
    dispatch(closeModal({}));
    dispatch(openModal({
      title: 'Edit Document',
      bodyType: MODAL_BODY_TYPES.DOCUMENT_EDIT,
      extraObject: { document },
      size: 'lg'
    }));
  };

  const handleDelete = () => {
    dispatch(closeModal({}));
    dispatch(openModal({
      title: 'Delete Document',
      bodyType: MODAL_BODY_TYPES.DOCUMENT_DELETE_CONFIRMATION,
      extraObject: { document },
      size: 'md'
    }));
  };

  const getDocumentTypeIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return '📽️';
    if (mimeType.includes('image')) return '🖼️';
    if (mimeType.includes('video')) return '🎥';
    if (mimeType.includes('audio')) return '🎵';
    return '📁';
  };

  const getApprovalStatusBadge = (status: string) => {
    const statusClasses = {
      APPROVED: 'badge badge-success',
      PENDING: 'badge badge-warning',
      REJECTED: 'badge badge-error',
      DRAFT: 'badge badge-info'
    };
    return statusClasses[status as keyof typeof statusClasses] || 'badge badge-ghost';
  };

  const getAccessLevelBadge = (level: string) => {
    const levelClasses = {
      PUBLIC: 'badge badge-success',
      SCHOOL: 'badge badge-info',
      CLASS: 'badge badge-warning',
      TEACHER: 'badge badge-primary',
      ADMIN: 'badge badge-error',
      PRIVATE: 'badge badge-ghost'
    };
    return levelClasses[level as keyof typeof levelClasses] || 'badge badge-ghost';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Document Header */}
      <div className="flex items-start space-x-4">
        <div className="text-4xl">{getDocumentTypeIcon(document.mimeType)}</div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900">{document.title}</h2>
          <p className="text-sm text-gray-500">{document.fileName}</p>
          <div className="flex items-center space-x-4 mt-2">
            <span className={getApprovalStatusBadge(document.approvalStatus)}>
              {document.approvalStatus}
            </span>
            <span className={getAccessLevelBadge(document.accessLevel)}>
              {document.accessLevel}
            </span>
            <span className="badge badge-outline">{document.documentCategory}</span>
          </div>
        </div>
      </div>

      {/* Document Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <p className="text-sm text-gray-900">{document.description || 'No description provided'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">File Size</label>
            <p className="text-sm text-gray-900">{formatFileSize(document.fileSize)}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">MIME Type</label>
            <p className="text-sm text-gray-900">{document.mimeType}</p>
          </div>

          {document.tags && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <div className="flex flex-wrap gap-1">
                {document.tags.split(',').map((tag, index) => (
                  <span key={index} className="badge badge-outline badge-sm">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-400" />
            <div>
              <label className="block text-sm font-medium text-gray-700">Uploaded By</label>
              <p className="text-sm text-gray-900">
                {document.uploadedBy 
                  ? `${document.uploadedBy.firstName} ${document.uploadedBy.lastName}`
                  : document.uploadedByName || 'Unknown User'
                }
              </p>
              <p className="text-xs text-gray-500">
                {document.uploadedBy?.role || 'Unknown Role'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div>
              <label className="block text-sm font-medium text-gray-700">Upload Date</label>
              <p className="text-sm text-gray-900">
                {new Date(document.uploadedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {document.approvedBy && (
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-gray-400" />
              <div>
                <label className="block text-sm font-medium text-gray-700">Approved By</label>
                <p className="text-sm text-gray-900">
                  {`${document.approvedBy.firstName} ${document.approvedBy.lastName}`}
                </p>
                {document.approvedAt && (
                  <p className="text-xs text-gray-500">
                    {new Date(document.approvedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statistics</label>
            <div className="text-sm text-gray-900 space-y-1">
              <p>Downloads: {document.downloadCount}</p>
              <p>Views: {document.viewCount}</p>
              <p>Version: {document.version}</p>
            </div>
          </div>
        </div>
      </div>

      {/* School/Class Information */}
      {(document.schoolName || document.className || document.subjectName) && (
        <div className="border-t pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Associated With</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {document.schoolName && (
              <div>
                <span className="font-medium">School:</span> {document.schoolName}
              </div>
            )}
            {document.className && (
              <div>
                <span className="font-medium">Class:</span> {document.className}
              </div>
            )}
            {document.subjectName && (
              <div>
                <span className="font-medium">Subject:</span> {document.subjectName}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          onClick={() => dispatch(closeModal({}))}
          className="btn btn-ghost"
        >
          Close
        </button>
        
        <button
          onClick={handleDownload}
          className="btn btn-outline"
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </button>

        {canEditDocument && (
          <button
            onClick={handleEdit}
            className="btn btn-primary"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </button>
        )}

        {canDeleteDocument && (
          <button
            onClick={handleDelete}
            className="btn btn-error"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default DocumentViewModal; 