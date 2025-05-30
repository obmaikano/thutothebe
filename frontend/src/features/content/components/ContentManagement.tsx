import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { 
  fetchContents, 
  fetchContentByCourse,
  fetchContentByType,
  fetchActiveContentByCourse,
  clearContentError,
  setContentFilter,
  clearContentFilter
} from '../contentSlice';
import { openModal } from '../../common/modalSlice';
import { FileText, Plus, Filter, Eye, Edit, Trash2, Download, ExternalLink } from 'lucide-react';
import { Content } from '../../../api/services/contentApi';

const ContentManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const contentState = useAppSelector((state) => state.content);
  const { user } = useAppSelector((state) => state.auth);
  
  // Provide default values in case the state is not properly initialized
  const contents = contentState?.contents || [];
  const status = contentState?.status || 'idle';
  const error = contentState?.error || null;
  const filter = contentState?.filter || {};

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchContents());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      // Handle error display
      console.error('Content error:', error);
    }
  }, [error]);

  const handleCreateContent = () => {
    dispatch(openModal({
      title: 'Create New Content',
      size: 'lg',
      bodyType: 'CONTENT_ADD_NEW',
      extraObject: {}
    }));
  };

  const handleEditContent = (content: Content) => {
    dispatch(openModal({
      title: 'Edit Content',
      size: 'lg',
      bodyType: 'CONTENT_EDIT',
      extraObject: { content }
    }));
  };

  const handleViewContent = (content: Content) => {
    dispatch(openModal({
      title: content.title,
      size: 'lg',
      bodyType: 'CONTENT_VIEW',
      extraObject: { content }
    }));
  };

  const handleDeleteContent = (content: Content) => {
    dispatch(openModal({
      title: 'Delete Content',
      size: 'md',
      bodyType: 'CONTENT_DELETE_CONFIRMATION',
      extraObject: { content }
    }));
  };

  const handleFilterChange = () => {
    const filterParams = {
      courseId: courseFilter ? parseInt(courseFilter) : undefined,
      type: typeFilter || undefined,
      activeOnly: activeFilter === 'active'
    };
    
    dispatch(setContentFilter(filterParams));
    
    // Apply filters
    if (courseFilter && typeFilter) {
      if (activeFilter === 'active') {
        dispatch(fetchActiveContentByCourse(parseInt(courseFilter)));
      } else {
        dispatch(fetchContentByType({ courseId: parseInt(courseFilter), type: typeFilter }));
      }
    } else if (courseFilter) {
      if (activeFilter === 'active') {
        dispatch(fetchActiveContentByCourse(parseInt(courseFilter)));
      } else {
        dispatch(fetchContentByCourse(parseInt(courseFilter)));
      }
    } else {
      dispatch(fetchContents());
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setTypeFilter('');
    setCourseFilter('');
    setActiveFilter('all');
    dispatch(clearContentFilter());
    dispatch(fetchContents());
  };

  const filteredContents = contents.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'DOCUMENT':
        return <FileText className="w-4 h-4" />;
      case 'VIDEO':
        return <FileText className="w-4 h-4" />;
      case 'LINK':
        return <ExternalLink className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'DOCUMENT':
        return 'bg-blue-100 text-blue-800';
      case 'VIDEO':
        return 'bg-purple-100 text-purple-800';
      case 'LINK':
        return 'bg-green-100 text-green-800';
      case 'ANNOUNCEMENT':
        return 'bg-yellow-100 text-yellow-800';
      case 'SCHEDULE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canCreateContent = user && [
    'SUPER_ADMIN',
    'MINISTRY_EXECUTIVE', 
    'MINISTRY_STAFF',
    'DIRECTOR',
    'REGIONAL_ADMIN',
    'REGIONAL_OFFICER',
    'SCHOOL_ADMIN',
    'SCHOOL_HEAD',
    'DEPARTMENT_HEAD',
    'SENIOR_TEACHER',
    'TEACHER'
  ].includes(user.role);

  const canEditContent = (content: Content) => {
    if (!user) return false;
    
    // Content creator can edit
    if (content.createdById === user.id) return true;
    
    // Admins can edit
    return [
      'SUPER_ADMIN',
      'MINISTRY_EXECUTIVE',
      'MINISTRY_STAFF',
      'DIRECTOR',
      'REGIONAL_ADMIN',
      'SCHOOL_ADMIN',
      'SCHOOL_HEAD',
      'DEPARTMENT_HEAD'
    ].includes(user.role);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-600">Manage course content and resources</p>
        </div>
        {canCreateContent && (
          <button
            onClick={handleCreateContent}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Content
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search content..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="DOCUMENT">Document</option>
              <option value="VIDEO">Video</option>
              <option value="LINK">Link</option>
              <option value="ANNOUNCEMENT">Announcement</option>
              <option value="SCHEDULE">Schedule</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Content</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={handleFilterChange}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Apply
            </button>
            <button
              onClick={handleClearFilters}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Content List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {status === 'loading' ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading content...</p>
          </div>
        ) : status === 'failed' ? (
          <div className="p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Failed to load content</p>
            <p className="text-sm text-gray-500 mb-4">{error}</p>
            <button
              onClick={() => dispatch(fetchContents())}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredContents.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No content found</p>
            {canCreateContent && (
              <button
                onClick={handleCreateContent}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Create Your First Content
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Content
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContents.map((content) => (
                  <tr key={content.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            {getContentTypeIcon(content.type)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {content.title}
                          </div>
                          {content.description && (
                            <div className="text-sm text-gray-500">
                              {content.description.length > 50 
                                ? `${content.description.substring(0, 50)}...`
                                : content.description
                              }
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getContentTypeColor(content.type)}`}>
                        {content.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        content.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {content.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(content.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewContent(content)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="View Content"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {canEditContent(content) && (
                          <button
                            onClick={() => handleEditContent(content)}
                            className="text-green-600 hover:text-green-900 p-1 rounded"
                            title="Edit Content"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {canEditContent(content) && (
                          <button
                            onClick={() => handleDeleteContent(content)}
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                            title="Delete Content"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        <a
                          href={content.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-900 p-1 rounded"
                          title="Open Content"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentManagement; 