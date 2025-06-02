import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { 
  FileText, 
  Upload, 
  Search, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar,
  User,
  Shield,
  Tag
} from 'lucide-react';
import { 
  fetchDocuments, 
  searchDocuments,
  downloadDocument,
  setFilters,
  clearFilters,
  clearDocumentsError
} from '../documentsSlice';
import { fetchSchools } from '../../schools/schoolsSlice';
import { fetchClasses } from '../../classes/classesSlice';
import { fetchSubjects } from '../../subjects/subjectsSlice';
import { fetchCourses } from '../../courses/coursesSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { Document, DOCUMENT_CATEGORIES, DOCUMENT_ACCESS_LEVELS } from '../../../api/services/documentApi';
import { useAuth } from '../../../contexts/AuthContext';

const DocumentLibraryPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { 
    documents, 
    status, 
    error
  } = useAppSelector(state => state.documents);
  
  // Live data from other slices
  const { schools } = useAppSelector(state => state.schools);
  const { classes } = useAppSelector(state => state.classes);
  const { subjects } = useAppSelector(state => state.subjects);
  const { courses } = useAppSelector(state => state.courses);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [accessLevelFilter, setAccessLevelFilter] = useState('');
  const [approvalStatusFilter, setApprovalStatusFilter] = useState('');
  const [schoolFilter, setSchoolFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');

  // Role-based permissions
  const canUploadDocuments = [
    'SUPER_ADMIN',
    'SCHOOL_ADMIN',
    'DEPARTMENT_HEAD',
    'SENIOR_TEACHER',
    'TEACHER'
  ].includes(user?.role || '');

  const canApproveDocuments = [
    'SUPER_ADMIN',
    'SCHOOL_ADMIN',
    'DEPARTMENT_HEAD',
    'SENIOR_TEACHER'
  ].includes(user?.role || '');

  const canViewAllDocuments = [
    'SUPER_ADMIN',
    'SCHOOL_ADMIN',
    'SCHOOL_HEAD',
    'DEPARTMENT_HEAD'
  ].includes(user?.role || '');

  useEffect(() => {
    // Fetch documents and live data for dropdowns
    dispatch(fetchDocuments({ page: 0, size: 10 }));
    dispatch(fetchSchools());
    dispatch(fetchClasses());
    dispatch(fetchSubjects());
    dispatch(fetchCourses());
    
    return () => {
      dispatch(clearDocumentsError());
    };
  }, [dispatch]);

  // Filter documents based on current filters
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = !searchTerm || 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !categoryFilter || doc.documentCategory === categoryFilter;
    const matchesAccessLevel = !accessLevelFilter || doc.accessLevel === accessLevelFilter;
    const matchesApprovalStatus = !approvalStatusFilter || doc.approvalStatus === approvalStatusFilter;
    const matchesSchool = !schoolFilter || doc.schoolId?.toString() === schoolFilter;
    const matchesClass = !classFilter || doc.classId?.toString() === classFilter;
    const matchesSubject = !subjectFilter || doc.subjectId?.toString() === subjectFilter;
    const matchesCourse = !courseFilter || doc.courseId?.toString() === courseFilter;
    
    return matchesSearch && matchesCategory && matchesAccessLevel && matchesApprovalStatus && 
           matchesSchool && matchesClass && matchesSubject && matchesCourse;
  });

  // Predefined approval statuses
  const approvalStatuses = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'UNDER_REVIEW', label: 'Under Review' },
    { value: 'REQUIRES_REVISION', label: 'Requires Revision' }
  ];

  const handleSearch = () => {
    if (searchTerm.trim()) {
      dispatch(searchDocuments({ searchTerm, page: 0, size: 10 }));
    } else {
      dispatch(fetchDocuments({ page: 0, size: 10 }));
    }
  };

  const handleUploadDocument = () => {
    dispatch(openModal({
      title: 'Upload Document',
      bodyType: MODAL_BODY_TYPES.DOCUMENT_UPLOAD,
      size: 'lg'
    }));
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

  const handleDownloadDocument = async (document: Document) => {
    if (user?.id) {
      try {
        await dispatch(downloadDocument({
          id: document.id,
          userId: user.id,
          fileName: document.fileName
        })).unwrap();
      } catch (error: any) {
        console.error('Download failed:', error);
        // Error will be shown in the error alert below
      }
    }
  };

  const handleClearFilters = () => {
    setCategoryFilter('');
    setAccessLevelFilter('');
    setApprovalStatusFilter('');
    setSchoolFilter('');
    setClassFilter('');
    setSubjectFilter('');
    setCourseFilter('');
    setSearchTerm('');
    dispatch(clearFilters());
    dispatch(fetchDocuments({ page: 0, size: 10 }));
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
      APPROVED: 'bg-green-100 text-green-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      REJECTED: 'bg-red-100 text-red-800',
      UNDER_REVIEW: 'bg-blue-100 text-blue-800',
      REQUIRES_REVISION: 'bg-orange-100 text-orange-800'
    };
    return statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800';
  };

  const getAccessLevelBadge = (level: string) => {
    const levelClasses = {
      PUBLIC: 'bg-green-100 text-green-800',
      REGIONAL: 'bg-indigo-100 text-indigo-800',
      SCHOOL: 'bg-blue-100 text-blue-800',
      CLASS: 'bg-yellow-100 text-yellow-800',
      COURSE: 'bg-purple-100 text-purple-800',
      SUBJECT: 'bg-pink-100 text-pink-800',
      TEACHER_ONLY: 'bg-purple-100 text-purple-800',
      ADMIN_ONLY: 'bg-red-100 text-red-800',
      PRIVATE: 'bg-gray-100 text-gray-800'
    };
    return levelClasses[level as keyof typeof levelClasses] || 'bg-gray-100 text-gray-800';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Document Library</h1>
          <p className="text-gray-600 mt-2">Browse and manage educational documents and resources</p>
          {user && (
            <p className="text-sm text-gray-500 mt-1">
              Role: {user.role} | Access Level: {canViewAllDocuments ? 'All Documents' : 'Limited Access'}
            </p>
          )}
        </div>
        {canUploadDocuments && (
          <button 
            onClick={handleUploadDocument} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Upload size={16} />
            Upload Document
          </button>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-error">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => dispatch(clearDocumentsError())}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
          <div className="lg:col-span-2 xl:col-span-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {DOCUMENT_CATEGORIES.map(category => (
              <option key={category.value} value={category.value}>{category.label}</option>
            ))}
          </select>
          
          <select 
            value={accessLevelFilter}
            onChange={(e) => setAccessLevelFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Access Levels</option>
            {DOCUMENT_ACCESS_LEVELS.map(level => (
              <option key={level.value} value={level.value}>{level.label}</option>
            ))}
          </select>
          
          <select 
            value={approvalStatusFilter}
            onChange={(e) => setApprovalStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            {approvalStatuses.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
          <select 
            value={schoolFilter}
            onChange={(e) => setSchoolFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Schools</option>
            {schools.map(school => (
              <option key={school.id} value={school.id.toString()}>{school.name}</option>
            ))}
          </select>
          
          <select 
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Classes</option>
            {classes.map(classItem => (
              <option key={classItem.id} value={classItem.id.toString()}>
                {classItem.name}
              </option>
            ))}
          </select>
          
          <select 
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject.id} value={subject.id.toString()}>{subject.name}</option>
            ))}
          </select>
          
          <select 
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Courses</option>
            {courses.map(course => (
              <option key={course.id} value={course.id.toString()}>{course.name}</option>
            ))}
          </select>
        </div>
        
        <div className="flex justify-end mt-4">
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      {documents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <FileText size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{documents.length}</div>
                <div className="text-sm text-gray-500">Total Documents</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <Shield size={20} className="text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {documents.filter(d => d.approvalStatus === 'APPROVED').length}
                </div>
                <div className="text-sm text-gray-500">Approved</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                <Tag size={20} className="text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {documents.filter(d => d.approvalStatus === 'PENDING').length}
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
                  {documents.reduce((sum, doc) => sum + doc.downloadCount, 0)}
                </div>
                <div className="text-sm text-gray-500">Total Downloads</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Documents Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {filteredDocuments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Access Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploaded By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Upload Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Downloads
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDocuments.map((document: Document) => (
                  <tr key={document.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{getDocumentTypeIcon(document.mimeType)}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{document.title}</div>
                          <div className="text-sm text-gray-500">{document.fileName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                        {document.documentCategory}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAccessLevelBadge(document.accessLevel)}`}>
                        {document.accessLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getApprovalStatusBadge(document.approvalStatus)}`}>
                        {document.approvalStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {document.uploadedBy 
                            ? `${document.uploadedBy.firstName} ${document.uploadedBy.lastName}`
                            : document.uploadedByName || 'Unknown User'
                          }
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatFileSize(document.fileSize)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {new Date(document.uploadedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {document.downloadCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDocument(document)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="View Document"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDownloadDocument(document)}
                          className="text-green-600 hover:text-green-900 p-1 rounded"
                          title="Download Document"
                        >
                          <Download size={16} />
                        </button>
                        {(canUploadDocuments || (document.uploadedBy?.id === user?.id || document.uploadedById === user?.id)) && (
                          <button
                            onClick={() => handleEditDocument(document)}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                            title="Edit Document"
                          >
                            <Edit size={16} />
                          </button>
                        )}
                        {(canApproveDocuments || (document.uploadedBy?.id === user?.id || document.uploadedById === user?.id)) && (
                          <button
                            onClick={() => handleDeleteDocument(document)}
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                            title="Delete Document"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <div className="text-gray-500 text-lg mb-2">
              {searchTerm || categoryFilter || accessLevelFilter || approvalStatusFilter 
                ? 'No documents found matching your criteria' 
                : 'No documents found'
              }
            </div>
            {!searchTerm && !categoryFilter && !accessLevelFilter && !approvalStatusFilter && canUploadDocuments && (
              <button
                onClick={handleUploadDocument}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
              >
                <Upload size={16} />
                Upload First Document
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentLibraryPage; 