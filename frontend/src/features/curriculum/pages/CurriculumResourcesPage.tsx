import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  fetchCurriculumResources,
  uploadCurriculumResource,
  trackResourceAccess,
  clearCurrentResource
} from '../curriculumAdvancedSlice';
import { fetchCurriculumById } from '../curriculumSlice';
import { CurriculumResourceDTO } from '../../../api/services/curriculumAdvancedApi';
import {
  Upload,
  Download,
  Eye,
  Edit,
  Trash2,
  FileText,
  Video,
  Image,
  Link,
  BookOpen,
  Search,
  Filter,
  Plus,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

const CurriculumResourcesPage: React.FC = () => {
  const { curriculumId } = useParams<{ curriculumId: string }>();
  const dispatch = useAppDispatch();
  
  const { currentCurriculum } = useAppSelector(state => state.curriculum);
  const {
    resources,
    resourcesLoading,
    resourceError
  } = useAppSelector(state => (state as any).curriculumAdvanced || {
    resources: [],
    resourcesLoading: false,
    resourceError: null
  });
  const { user } = useAppSelector(state => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [resourceTypeFilter, setResourceTypeFilter] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    resourceType: 'DOCUMENT' as CurriculumResourceDTO['resourceType'],
    isPublic: true,
    tags: [] as string[],
    unitId: undefined as number | undefined,
    topicId: undefined as number | undefined
  });
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  useEffect(() => {
    if (curriculumId) {
      const id = parseInt(curriculumId);
      dispatch(fetchCurriculumById(id));
      dispatch(fetchCurriculumResources({
        curriculumId: id,
        resourceType: resourceTypeFilter || undefined
      }));
    }

    return () => {
      dispatch(clearCurrentResource());
    };
  }, [dispatch, curriculumId, resourceTypeFilter]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadData(prev => ({
        ...prev,
        title: prev.title || file.name.split('.')[0]
      }));
    }
  };

  const handleUploadResource = async () => {
    if (curriculumId && (selectedFile || uploadData.resourceType === 'LINK')) {
      try {
        await dispatch(uploadCurriculumResource({
          curriculumId: parseInt(curriculumId),
          file: selectedFile,
          resourceData: {
            ...uploadData,
            curriculumId: parseInt(curriculumId),
            uploadedById: user?.id || 1,
            uploadedByName: user?.name || 'Unknown'
          }
        })).unwrap();
        
        setShowUploadModal(false);
        setSelectedFile(null);
        setUploadData({
          title: '',
          description: '',
          resourceType: 'DOCUMENT',
          isPublic: true,
          tags: [],
          unitId: undefined,
          topicId: undefined
        });
        showNotification('success', 'Resource uploaded successfully');
      } catch (error) {
        console.error('Failed to upload resource:', error);
        showNotification('error', 'Failed to upload resource');
      }
    }
  };

  const handleResourceAccess = async (resourceId: number) => {
    if (user?.id) {
      await dispatch(trackResourceAccess({
        resourceId,
        accessedById: user.id
      }));
    }
  };

  const handleViewResource = async (resource: CurriculumResourceDTO) => {
    // Track access
    await handleResourceAccess(resource.id);
    
    // Open resource based on type
    if (resource.resourceType === 'LINK') {
      window.open(resource.fileUrl, '_blank', 'noopener,noreferrer');
    } else if (resource.fileUrl) {
      // For files, open in new tab
      window.open(resource.fileUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Show resource details in modal or alert
      alert(`Resource: ${resource.title}\nType: ${resource.resourceType}\nDescription: ${resource.description || 'No description available'}`);
    }
  };

  const handleDownloadResource = async (resource: CurriculumResourceDTO) => {
    if (!resource.fileUrl) {
      alert('Download not available for this resource');
      return;
    }

    // Track access
    await handleResourceAccess(resource.id);
    
    try {
      // Create download link
      const link = document.createElement('a');
      link.href = resource.fileUrl;
      link.download = resource.fileName || resource.title;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback to opening in new tab
      window.open(resource.fileUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const getResourceIcon = (type: string) => {
    const icons = {
      'DOCUMENT': FileText,
      'VIDEO': Video,
      'AUDIO': Video,
      'IMAGE': Image,
      'LINK': Link,
      'INTERACTIVE': BookOpen,
      'ASSESSMENT': BookOpen,
      'LESSON_PLAN': BookOpen
    };
    const IconComponent = icons[type as keyof typeof icons] || FileText;
    return <IconComponent size={20} />;
  };

  const getResourceTypeColor = (type: string) => {
    const colors = {
      'DOCUMENT': 'bg-blue-100 text-blue-800',
      'VIDEO': 'bg-red-100 text-red-800',
      'AUDIO': 'bg-purple-100 text-purple-800',
      'IMAGE': 'bg-green-100 text-green-800',
      'LINK': 'bg-yellow-100 text-yellow-800',
      'INTERACTIVE': 'bg-indigo-100 text-indigo-800',
      'ASSESSMENT': 'bg-orange-100 text-orange-800',
      'LESSON_PLAN': 'bg-pink-100 text-pink-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredResources = resources.filter((resource: CurriculumResourceDTO) => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (resource.description && resource.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = 
      resourceTypeFilter === '' || resource.resourceType === resourceTypeFilter;
    
    return matchesSearch && matchesType;
  });

  const canUploadResources = user && [
    'MINISTRY_STAFF',
    'MINISTRY_EXECUTIVE',
    'REGIONAL_ADMIN',
    'SCHOOL_ADMIN',
    'TEACHER',
    'SUPER_ADMIN'
  ].includes(user.role);

  const handleRefreshResources = () => {
    if (curriculumId) {
      const id = parseInt(curriculumId);
      dispatch(fetchCurriculumById(id));
      dispatch(fetchCurriculumResources({
        curriculumId: id,
        resourceType: resourceTypeFilter || undefined
      }));
      showNotification('success', 'Resources refreshed successfully');
    }
  };

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  if (resourcesLoading) {
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
          <h1 className="text-3xl font-bold text-gray-900">Curriculum Resources</h1>
          <p className="text-gray-600 mt-2">
            {currentCurriculum?.title || 'Loading curriculum...'} - Educational Resources & Materials
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleRefreshResources}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          {canUploadResources && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus size={16} />
              Upload Resource
            </button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={resourceTypeFilter}
            onChange={(e) => setResourceTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Resource Types</option>
            <option value="DOCUMENT">Documents</option>
            <option value="VIDEO">Videos</option>
            <option value="AUDIO">Audio</option>
            <option value="IMAGE">Images</option>
            <option value="LINK">Links</option>
            <option value="INTERACTIVE">Interactive</option>
            <option value="ASSESSMENT">Assessments</option>
            <option value="LESSON_PLAN">Lesson Plans</option>
          </select>
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">
              {filteredResources.length} of {resources.length} resources
            </span>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource: CurriculumResourceDTO) => (
          <div key={resource.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {getResourceIcon(resource.resourceType)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {resource.title}
                  </h3>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getResourceTypeColor(resource.resourceType)}`}>
                    {resource.resourceType.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>

            {resource.description && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {resource.description}
              </p>
            )}

            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>Uploaded by {resource.uploadedByName || 'Unknown'}</span>
              <span>{resource.accessCount} views</span>
            </div>

            {resource.tags && resource.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {resource.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    {tag}
                  </span>
                ))}
                {resource.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    +{resource.tags.length - 3} more
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewResource(resource)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="View Resource"
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={() => handleDownloadResource(resource)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Download Resource"
                >
                  <Download size={16} />
                </button>
                {resource.resourceType === 'LINK' && (
                  <a
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    title="Open Link"
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
              <div className="text-xs text-gray-500">
                {new Date(resource.uploadedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No resources found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || resourceTypeFilter
              ? 'Try adjusting your search criteria.'
              : 'Get started by uploading your first resource.'}
          </p>
          {canUploadResources && !searchTerm && !resourceTypeFilter && (
            <div className="mt-6">
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                Upload Resource
              </button>
            </div>
          )}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Resource</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Resource Type</label>
                <select
                  value={uploadData.resourceType}
                  onChange={(e) => setUploadData(prev => ({ ...prev, resourceType: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="DOCUMENT">Document</option>
                  <option value="VIDEO">Video</option>
                  <option value="AUDIO">Audio</option>
                  <option value="IMAGE">Image</option>
                  <option value="LINK">Link</option>
                  <option value="INTERACTIVE">Interactive</option>
                  <option value="ASSESSMENT">Assessment</option>
                  <option value="LESSON_PLAN">Lesson Plan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={uploadData.title}
                  onChange={(e) => setUploadData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Resource title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={uploadData.description}
                  onChange={(e) => setUploadData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Resource description"
                />
              </div>

              {uploadData.resourceType !== 'LINK' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">File</label>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {selectedFile && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>
              )}

              {uploadData.resourceType === 'LINK' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
                  <input
                    type="url"
                    value={uploadData.title}
                    onChange={(e) => setUploadData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com"
                  />
                </div>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={uploadData.isPublic}
                  onChange={(e) => setUploadData(prev => ({ ...prev, isPublic: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
                  Make this resource public
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadResource}
                disabled={!uploadData.title || (uploadData.resourceType !== 'LINK' && !selectedFile)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`rounded-lg p-4 shadow-lg ${
            notification.type === 'success' ? 'bg-green-100 border border-green-400 text-green-700' :
            notification.type === 'error' ? 'bg-red-100 border border-red-400 text-red-700' :
            'bg-blue-100 border border-blue-400 text-blue-700'
          }`}>
            <div className="flex items-center justify-between">
              <p className="font-medium">{notification.message}</p>
              <button
                onClick={() => setNotification(null)}
                className="ml-4 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurriculumResourcesPage; 