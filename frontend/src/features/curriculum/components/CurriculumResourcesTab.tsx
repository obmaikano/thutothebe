import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchCurriculumResources } from '../curriculumAdvancedSlice';
import { FolderOpen, FileText, Video, Image, ExternalLink, Download, Upload, AlertCircle } from 'lucide-react';

interface CurriculumResourcesTabProps {
  curriculumId: number;
}

const CurriculumResourcesTab: React.FC<CurriculumResourcesTabProps> = ({ curriculumId }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const {
    resources,
    resourcesLoading,
    resourceError
  } = useAppSelector(state => (state as any).curriculumAdvanced || {
    resources: [],
    resourcesLoading: false,
    resourceError: null
  });

  useEffect(() => {
    if (curriculumId) {
      dispatch(fetchCurriculumResources({ curriculumId }));
    }
  }, [dispatch, curriculumId]);

  const handleViewFullResources = () => {
    navigate(`/app/curriculum-resources/${curriculumId}`);
  };

  const handleUploadResource = () => {
    navigate(`/app/curriculum-resources/${curriculumId}?action=upload`);
  };

  // Calculate resource stats from real data
  const resourceStats = {
    documents: resources.filter((r: any) => r.resourceType === 'DOCUMENT').length,
    videos: resources.filter((r: any) => r.resourceType === 'VIDEO').length,
    images: resources.filter((r: any) => r.resourceType === 'IMAGE').length,
    interactive: resources.filter((r: any) => r.resourceType === 'INTERACTIVE').length
  };

  // Get recent resources (last 3)
  const recentResources = resources
    .sort((a: any, b: any) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
    .slice(0, 3);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'DOCUMENT':
        return <FileText className="h-4 w-4 text-blue-600" />;
      case 'VIDEO':
      case 'AUDIO':
        return <Video className="h-4 w-4 text-green-600" />;
      case 'IMAGE':
        return <Image className="h-4 w-4 text-purple-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getResourceIconBg = (type: string) => {
    switch (type) {
      case 'DOCUMENT':
        return 'bg-blue-100';
      case 'VIDEO':
      case 'AUDIO':
        return 'bg-green-100';
      case 'IMAGE':
        return 'bg-purple-100';
      default:
        return 'bg-gray-100';
    }
  };

  if (resourcesLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg text-orange-600 mb-4"></div>
            <p className="text-gray-600">Loading resources...</p>
          </div>
        </div>
      </div>
    );
  }

  if (resourceError) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Resources Error</h3>
            <p className="text-red-600 mb-6">{resourceError}</p>
            <button
              onClick={handleViewFullResources}
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              View Resources Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resources Overview */}
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
            <FolderOpen className="h-8 w-8 text-orange-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Curriculum Resources</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Access and manage all curriculum resources including documents, videos, assessments, lesson plans, and interactive materials for effective teaching.
          </p>
          <button
            onClick={handleViewFullResources}
            className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
          >
            <FolderOpen className="h-4 w-4 mr-2" />
            View All Resources
            <ExternalLink className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>

      {/* Resource Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{resourceStats.documents}</div>
              <div className="text-sm text-gray-500">Documents</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              <Video className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{resourceStats.videos}</div>
              <div className="text-sm text-gray-500">Videos</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg mr-4">
              <Image className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{resourceStats.images}</div>
              <div className="text-sm text-gray-500">Images</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg mr-4">
              <FolderOpen className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{resourceStats.interactive}</div>
              <div className="text-sm text-gray-500">Interactive</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Resources */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Resources</h4>
        {recentResources.length > 0 ? (
          <div className="space-y-4">
            {recentResources.map((resource: any) => (
              <div key={resource.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 ${getResourceIconBg(resource.resourceType)} rounded-lg`}>
                    {getResourceIcon(resource.resourceType)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{resource.title}</div>
                    <div className="text-sm text-gray-600">
                      {resource.resourceType} • {resource.fileSize ? `${Math.round(resource.fileSize / 1024)} KB` : 'N/A'} • 
                      Added {new Date(resource.uploadedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => window.open(resource.fileUrl, '_blank')}
                  className="p-2 text-gray-400 hover:text-gray-600"
                  title="View Resource"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FolderOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">No resources available yet</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={handleUploadResource}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-colors"
          >
            <div className="text-center">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <div className="font-medium text-gray-900">Upload Resource</div>
              <div className="text-sm text-gray-600">Add new curriculum materials</div>
            </div>
          </button>
          
          <button 
            onClick={handleViewFullResources}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <div className="text-center">
              <FolderOpen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <div className="font-medium text-gray-900">Browse All</div>
              <div className="text-sm text-gray-600">View complete resource library</div>
            </div>
          </button>
        </div>
      </div>

      {/* Resource Categories */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Resource Categories</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <div className="font-medium text-gray-900">Lesson Plans</div>
              <div className="text-sm text-gray-600">Structured teaching guides and activities</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <div className="font-medium text-gray-900">Assessment Tools</div>
              <div className="text-sm text-gray-600">Tests, quizzes, and evaluation materials</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
            <div>
              <div className="font-medium text-gray-900">Interactive Content</div>
              <div className="text-sm text-gray-600">Digital activities and simulations</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
            <div>
              <div className="font-medium text-gray-900">Reference Materials</div>
              <div className="text-sm text-gray-600">Supporting documents and guides</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurriculumResourcesTab; 