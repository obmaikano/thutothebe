import React, { useState } from 'react';
import LessonList from '../../features/lessons/components/LessonList';
import LessonCompletionList from '../../features/lessonCompletions/components/LessonCompletionList';
import CurriculumProgressDashboard from '../../features/curriculumProgress/components/CurriculumProgressDashboard';
import RealTimeDataStatus from '../../components/RealTimeDataStatus';

const LiveDataDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'lessons' | 'completions' | 'progress'>('lessons');
  const [filterType, setFilterType] = useState<'all' | 'filtered'>('all');
  const [filterValue, setFilterValue] = useState<string>('');

  const tabs = [
    { id: 'lessons', name: 'Lessons', icon: '📚' },
    { id: 'completions', name: 'Lesson Completions', icon: '✅' },
    { id: 'progress', name: 'Curriculum Progress', icon: '📊' }
  ] as const;

  const renderContent = () => {
    switch (activeTab) {
      case 'lessons':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-blue-900 mb-2">Lessons Data</h3>
              <p className="text-blue-700 text-sm">
                This component fetches real lesson data from the backend API. 
                It shows lesson status, scheduling, and completion information.
              </p>
            </div>
            <LessonList showAll={filterType === 'all'} />
          </div>
        );
      
      case 'completions':
        return (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-green-900 mb-2">Lesson Completions Data</h3>
              <p className="text-green-700 text-sm">
                This component fetches real lesson completion data from the backend API.
                It tracks student progress, scores, and completion status.
              </p>
            </div>
            <LessonCompletionList showAll={filterType === 'all'} />
          </div>
        );
      
      case 'progress':
        return (
          <div className="space-y-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-purple-900 mb-2">Curriculum Progress Data</h3>
              <p className="text-purple-700 text-sm">
                This component fetches real curriculum progress data from the backend API.
                It provides comprehensive analytics and progress tracking.
              </p>
            </div>
            <CurriculumProgressDashboard showAll={filterType === 'all'} />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 sm:px-0 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Live Data Demo</h1>
          <p className="mt-2 text-gray-600">
            This page demonstrates fetching real-time data from the backend API using Redux and React components.
          </p>
        </div>

        {/* Real-Time Status */}
        <div className="px-4 sm:px-0 mb-6">
          <RealTimeDataStatus />
        </div>

        {/* Filter Controls */}
        <div className="px-4 sm:px-0 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Data Filtering</h3>
                <p className="text-sm text-gray-500">Choose how to display the data</p>
              </div>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="showAll"
                    name="filterType"
                    value="all"
                    checked={filterType === 'all'}
                    onChange={(e) => setFilterType(e.target.value as 'all' | 'filtered')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="showAll" className="text-sm font-medium text-gray-700">
                    Show All Data
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="showFiltered"
                    name="filterType"
                    value="filtered"
                    checked={filterType === 'filtered'}
                    onChange={(e) => setFilterType(e.target.value as 'all' | 'filtered')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="showFiltered" className="text-sm font-medium text-gray-700">
                    Filter by ID
                  </label>
                </div>
              </div>
            </div>
            
            {filterType === 'filtered' && (
              <div className="mt-4">
                <label htmlFor="filterValue" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter ID to filter by:
                </label>
                <input
                  type="number"
                  id="filterValue"
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  placeholder="Enter ID..."
                  className="block w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 sm:px-0 mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-0">
          {renderContent()}
        </div>

        {/* API Information */}
        <div className="px-4 sm:px-0 mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Backend API Endpoints</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Lessons API</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• GET /api/lessons</li>
                  <li>• GET /api/lessons/{'{id}'}</li>
                  <li>• GET /api/lessons/course/{'{courseId}'}</li>
                  <li>• GET /api/lessons/status/{'{status}'}</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Lesson Completions API</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• GET /api/lesson-completions</li>
                  <li>• GET /api/lesson-completions/{'{id}'}</li>
                  <li>• GET /api/lesson-completions/lesson/{'{lessonId}'}</li>
                  <li>• GET /api/lesson-completions/student/{'{studentId}'}</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Curriculum Progress API</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• GET /api/curriculum-progress</li>
                  <li>• GET /api/curriculum-progress/{'{id}'}</li>
                  <li>• GET /api/curriculum-progress/student/{'{studentId}'}</li>
                  <li>• GET /api/curriculum-progress/curriculum/{'{curriculumId}'}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="px-4 sm:px-0 mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Technical Implementation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Frontend Architecture</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Redux Toolkit for state management</li>
                  <li>• RTK Query for API calls</li>
                  <li>• TypeScript for type safety</li>
                  <li>• React hooks for component logic</li>
                  <li>• Tailwind CSS for styling</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Backend Architecture</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Spring Boot 3 with Java 17</li>
                  <li>• JPA/Hibernate for data persistence</li>
                  <li>• PostgreSQL database</li>
                  <li>• RESTful API design</li>
                  <li>• DTO pattern for data transfer</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveDataDemo; 