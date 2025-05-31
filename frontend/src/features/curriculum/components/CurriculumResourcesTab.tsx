import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderOpen, FileText, Video, Image, ExternalLink, Download, Upload } from 'lucide-react';

interface CurriculumResourcesTabProps {
  curriculumId: number;
}

const CurriculumResourcesTab: React.FC<CurriculumResourcesTabProps> = ({ curriculumId }) => {
  const navigate = useNavigate();

  const handleViewFullResources = () => {
    navigate(`/app/curriculum-resources/${curriculumId}`);
  };

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
              <div className="text-2xl font-bold text-gray-900">24</div>
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
              <div className="text-2xl font-bold text-gray-900">12</div>
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
              <div className="text-2xl font-bold text-gray-900">36</div>
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
              <div className="text-2xl font-bold text-gray-900">8</div>
              <div className="text-sm text-gray-500">Interactive</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Resources */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Resources</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Mathematics Curriculum Guide</div>
                <div className="text-sm text-gray-600">PDF • 2.4 MB • Added 2 days ago</div>
              </div>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Download className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Video className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Teaching Methods Video</div>
                <div className="text-sm text-gray-600">MP4 • 45 min • Added 5 days ago</div>
              </div>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Download className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Image className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Assessment Templates</div>
                <div className="text-sm text-gray-600">ZIP • 1.8 MB • Added 1 week ago</div>
              </div>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-colors">
            <div className="text-center">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <div className="font-medium text-gray-900">Upload Resource</div>
              <div className="text-sm text-gray-600">Add new curriculum materials</div>
            </div>
          </button>
          
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
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