import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, CheckCircle, Clock, ExternalLink, AlertCircle } from 'lucide-react';

interface CurriculumProgressTabProps {
  curriculumId: number;
}

const CurriculumProgressTab: React.FC<CurriculumProgressTabProps> = ({ curriculumId }) => {
  const navigate = useNavigate();

  const handleViewFullProgress = () => {
    navigate(`/app/curriculum-progress/${curriculumId}`);
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-green-100 rounded-xl flex items-center justify-center mb-4">
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Implementation Progress</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Track curriculum implementation progress across schools, monitor milestones, and manage implementation timelines with detailed progress tracking.
          </p>
          <button
            onClick={handleViewFullProgress}
            className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            View Full Progress
            <ExternalLink className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">12</div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">8</div>
              <div className="text-sm text-gray-500">In Progress</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg mr-4">
              <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">3</div>
              <div className="text-sm text-gray-500">Overdue</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg mr-4">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">75%</div>
              <div className="text-sm text-gray-500">Overall Progress</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Timeline Preview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Progress Updates</h4>
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="font-medium text-gray-900">Teacher Training Completed</div>
                <div className="text-sm text-gray-500">2 days ago</div>
              </div>
              <div className="text-sm text-gray-600">All teachers have completed the curriculum training program</div>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Clock className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="font-medium text-gray-900">Resource Distribution</div>
                <div className="text-sm text-gray-500">5 days ago</div>
              </div>
              <div className="text-sm text-gray-600">Curriculum materials distributed to 15 schools</div>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="font-medium text-gray-900">Assessment Review Pending</div>
                <div className="text-sm text-gray-500">1 week ago</div>
              </div>
              <div className="text-sm text-gray-600">Curriculum assessment materials require review</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features List */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Progress Tracking Features</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <div className="font-medium text-gray-900">Implementation Milestones</div>
              <div className="text-sm text-gray-600">Track key implementation phases and deadlines</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <div className="font-medium text-gray-900">School-wise Progress</div>
              <div className="text-sm text-gray-600">Monitor progress across individual schools</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
            <div>
              <div className="font-medium text-gray-900">Timeline Management</div>
              <div className="text-sm text-gray-600">Manage implementation schedules and deadlines</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
            <div>
              <div className="font-medium text-gray-900">Progress Reports</div>
              <div className="text-sm text-gray-600">Generate detailed progress and status reports</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurriculumProgressTab; 