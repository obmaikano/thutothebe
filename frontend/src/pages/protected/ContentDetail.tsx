import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { setPageTitle } from '../../features/common/headerSlice';
import { fetchContentById } from '../../features/content/contentSlice';
import { useAppSelector, useAppDispatch } from '../../store';
import { FileText, Calendar, User, ExternalLink, Download } from 'lucide-react';

function ContentDetailPage() {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const { currentContent, status, error } = useAppSelector((state) => state.content);

  useEffect(() => {
    if (id) {
      dispatch(fetchContentById(parseInt(id)));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentContent) {
      dispatch(setPageTitle({ title: `Content: ${currentContent.title}` }));
    } else {
      dispatch(setPageTitle({ title: "Content Details" }));
    }
  }, [dispatch, currentContent]);

  if (status === 'loading') {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading content...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentContent) {
    return (
      <div className="p-6">
        <div className="text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Content not found</p>
        </div>
      </div>
    );
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'DOCUMENT':
        return <FileText className="w-6 h-6" />;
      case 'VIDEO':
        return <FileText className="w-6 h-6" />;
      case 'LINK':
        return <ExternalLink className="w-6 h-6" />;
      default:
        return <FileText className="w-6 h-6" />;
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

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="h-16 w-16 rounded-lg bg-blue-100 flex items-center justify-center">
                  {getContentTypeIcon(currentContent.type)}
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {currentContent.title}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getContentTypeColor(currentContent.type)}`}>
                    {currentContent.type}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    currentContent.active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {currentContent.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <a
                href={currentContent.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                Open Content
              </a>
            </div>
          </div>
        </div>

        {/* Content Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
              {currentContent.description ? (
                <div className="prose max-w-none">
                  <p className="text-gray-700">{currentContent.description}</p>
                </div>
              ) : (
                <p className="text-gray-500 italic">No description provided</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Content Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Information</h3>
              <div className="space-y-4">
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">Created:</span>
                  <span className="ml-2 text-gray-900">
                    {new Date(currentContent.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <User className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">Creator ID:</span>
                  <span className="ml-2 text-gray-900">
                    {currentContent.createdById}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <FileText className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">Version:</span>
                  <span className="ml-2 text-gray-900">
                    {currentContent.version}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <FileText className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">Course ID:</span>
                  <span className="ml-2 text-gray-900">
                    {currentContent.courseId}
                  </span>
                </div>
              </div>
            </div>

            {/* Content Access */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Access Content</h3>
              <div className="space-y-3">
                <a
                  href={currentContent.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in New Tab
                </a>
                <button
                  onClick={() => navigator.clipboard.writeText(currentContent.url)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Copy URL
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentDetailPage; 