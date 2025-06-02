import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FileText, 
  Upload, 
  Search, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  Calendar,
  User
} from 'lucide-react';
import { AppDispatch, RootState } from '../../../app/store';
import { 
  fetchDocumentsByUploader,
  downloadDocument,
  deleteDocument,
  searchDocuments
} from '../documentsSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { Document } from '../../../api/services/documentApi';
import { useAuth } from '../../../contexts/AuthContext';
import DataTable from 'react-data-table-component';

const MyDocumentsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const { 
    documents, 
    status, 
    error, 
    pagination
  } = useSelector((state: RootState) => state.documents);

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchDocumentsByUploader({ uploaderId: user.id, page: 0, size: 10 }));
    }
  }, [dispatch, user?.id]);

  const handleSearch = () => {
    if (searchTerm.trim() && user?.id) {
      // For now, we'll use the general search and filter client-side
      // In a real implementation, you'd want a searchByUser endpoint
      dispatch(searchDocuments({ searchTerm, page: 0, size: 10 }));
    } else if (user?.id) {
      dispatch(fetchDocumentsByUploader({ uploaderId: user.id, page: 0, size: 10 }));
    }
  };

  const handleViewDocument = (document: Document) => {
    dispatch(openModal({
      title: 'Document Details',
      bodyType: MODAL_BODY_TYPES.DOCUMENT_VIEW,
      extraObject: { document },
      size: 'lg'
    }));
  };

  const handleEditDocument = (document: Document) => {
    dispatch(openModal({
      title: 'Edit Document',
      bodyType: MODAL_BODY_TYPES.DOCUMENT_EDIT,
      extraObject: { document },
      size: 'lg'
    }));
  };

  const handleDeleteDocument = (document: Document) => {
    dispatch(openModal({
      title: 'Delete Document',
      bodyType: MODAL_BODY_TYPES.DOCUMENT_DELETE_CONFIRMATION,
      extraObject: { document },
      size: 'md'
    }));
  };

  const handleDownloadDocument = (document: Document) => {
    if (user?.id) {
      dispatch(downloadDocument({
        id: document.id,
        userId: user.id,
        fileName: document.fileName
      }));
    }
  };

  const handlePageChange = (page: number) => {
    if (user?.id) {
      if (searchTerm.trim()) {
        dispatch(searchDocuments({ searchTerm, page: page - 1, size: 10 }));
      } else {
        dispatch(fetchDocumentsByUploader({ uploaderId: user.id, page: page - 1, size: 10 }));
      }
    }
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

  // Filter documents to show only user's documents
  const myDocuments = documents.filter(doc => 
    (doc.uploadedBy?.id === user?.id) || (doc.uploadedById === user?.id)
  );

  const columns = [
    {
      name: 'Document',
      selector: (row: Document) => row.title,
      sortable: true,
      cell: (row: Document) => (
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getDocumentTypeIcon(row.mimeType)}</span>
          <div>
            <div className="font-semibold text-gray-900">{row.title}</div>
            <div className="text-sm text-gray-500">{row.fileName}</div>
          </div>
        </div>
      ),
      width: '300px'
    },
    {
      name: 'Category',
      selector: (row: Document) => row.documentCategory,
      sortable: true,
      cell: (row: Document) => (
        <span className="badge badge-outline">{row.documentCategory}</span>
      )
    },
    {
      name: 'Access Level',
      selector: (row: Document) => row.accessLevel,
      sortable: true,
      cell: (row: Document) => (
        <span className={getAccessLevelBadge(row.accessLevel)}>
          {row.accessLevel}
        </span>
      )
    },
    {
      name: 'Status',
      selector: (row: Document) => row.approvalStatus,
      sortable: true,
      cell: (row: Document) => (
        <span className={getApprovalStatusBadge(row.approvalStatus)}>
          {row.approvalStatus}
        </span>
      )
    },
    {
      name: 'Size',
      selector: (row: Document) => row.fileSize,
      sortable: true,
      cell: (row: Document) => formatFileSize(row.fileSize)
    },
    {
      name: 'Upload Date',
      selector: (row: Document) => row.uploadedAt,
      sortable: true,
      cell: (row: Document) => (
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span>{new Date(row.uploadedAt).toLocaleDateString()}</span>
        </div>
      )
    },
    {
      name: 'Downloads',
      selector: (row: Document) => row.downloadCount,
      sortable: true,
      cell: (row: Document) => (
        <span className="text-sm text-gray-600">{row.downloadCount}</span>
      )
    },
    {
      name: 'Actions',
      cell: (row: Document) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleViewDocument(row)}
            className="btn btn-ghost btn-xs"
            title="View Document"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDownloadDocument(row)}
            className="btn btn-ghost btn-xs"
            title="Download Document"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleEditDocument(row)}
            className="btn btn-ghost btn-xs"
            title="Edit Document"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteDocument(row)}
            className="btn btn-ghost btn-xs text-red-600"
            title="Delete Document"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '150px'
    }
  ];

  const customStyles = {
    headCells: {
      style: {
        fontWeight: 'bold',
        fontSize: '14px',
        backgroundColor: '#f8fafc',
      },
    },
    cells: {
      style: {
        fontSize: '14px',
      },
    },
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Documents</h1>
          <p className="text-gray-600 mt-2">Manage your uploaded documents and resources</p>
          {user && (
            <p className="text-sm text-gray-500 mt-1">
              User: {user.firstName} {user.lastName} | Total Documents: {myDocuments.length}
            </p>
          )}
        </div>
        <div className="text-sm text-gray-500">
          {myDocuments.length} document{myDocuments.length !== 1 ? 's' : ''} uploaded
        </div>
      </div>

      {/* Search and Actions */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="form-control">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Search my documents..."
                  className="input input-bordered w-full max-w-xs"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button 
                  className="btn btn-square"
                  onClick={handleSearch}
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => window.location.href = '/app/documents/upload'}
            className="btn btn-primary"
          >
            <Upload className="h-5 w-5 mr-2" />
            Upload New Document
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      {myDocuments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <FileText size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{myDocuments.length}</div>
                <div className="text-sm text-gray-500">Total Documents</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <Calendar size={20} className="text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {myDocuments.filter(d => d.approvalStatus === 'APPROVED').length}
                </div>
                <div className="text-sm text-gray-500">Approved</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                <User size={20} className="text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {myDocuments.filter(d => d.approvalStatus === 'PENDING').length}
                </div>
                <div className="text-sm text-gray-500">Pending</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <Download size={20} className="text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {myDocuments.reduce((sum, doc) => sum + doc.downloadCount, 0)}
                </div>
                <div className="text-sm text-gray-500">Total Downloads</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {/* Documents Table */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <DataTable
          columns={columns}
          data={myDocuments}
          pagination
          paginationServer
          paginationTotalRows={pagination.totalElements}
          paginationDefaultPage={pagination.page + 1}
          paginationPerPage={pagination.size}
          onChangePage={handlePageChange}
          progressPending={status === 'loading'}
          customStyles={customStyles}
          noDataComponent={
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">You haven't uploaded any documents yet</h3>
              <p className="text-gray-500 mb-4">Get started by uploading your first document</p>
              <button
                onClick={() => window.location.href = '/app/documents/upload'}
                className="btn btn-primary"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Your First Document
              </button>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default MyDocumentsPage; 