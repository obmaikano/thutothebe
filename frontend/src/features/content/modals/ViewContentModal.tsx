import React from 'react';
import { useAppDispatch } from '../../../store';
import { closeModal } from '../../common/modalSlice';
import { Content } from '../../../api/services/contentApi';
import { FileText, Calendar, User, ExternalLink, Download } from 'lucide-react';

interface ViewContentModalProps {
  content: Content;
}

const ViewContentModal: React.FC<ViewContentModalProps> = ({ content }) => {
  const dispatch = useAppDispatch();

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
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="h-16 w-16 rounded-lg bg-blue-100 flex items-center justify-center">
              {getContentTypeIcon(content.type)}
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {content.title}
            </h2>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getContentTypeColor(content.type)}`}>
                {content.type}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                content.active 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {content.active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Details */}
      <div className="space-y-6">
        {/* Description */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
          {content.description ? (
            <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
              {content.description}
            </p>
          ) : (
            <p className="text-gray-500 italic">No description provided</p>
          )}
        </div>

        {/* Content Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-gray-600">Created:</span>
              <span className="ml-2 text-gray-900">
                {new Date(content.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <User className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-gray-600">Creator ID:</span>
              <span className="ml-2 text-gray-900">
                {content.createdById}
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <FileText className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-gray-600">Version:</span>
              <span className="ml-2 text-gray-900">
                {content.version}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <FileText className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-gray-600">Course ID:</span>
              <span className="ml-2 text-gray-900">
                {content.courseId}
              </span>
            </div>
          </div>
        </div>

        {/* Content URL */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Content URL</h3>
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="flex items-center justify-between">
              <span className="text-gray-900 break-all">{content.url}</span>
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => navigator.clipboard.writeText(content.url)}
                  className="text-blue-600 hover:text-blue-800 p-1 rounded"
                  title="Copy URL"
                >
                  <FileText className="w-4 h-4" />
                </button>
                <a
                  href={content.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 p-1 rounded"
                  title="Open Content"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-200">
        <a
          href={content.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4" />
          Open Content
        </a>
        <button
          onClick={() => dispatch(closeModal({}))}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ViewContentModal; 