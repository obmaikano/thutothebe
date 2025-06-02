import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchCurricula, clearCurriculumError } from '../curriculumSlice';
import { Curriculum } from '../../../api/services/curriculumApi';
import CurriculumWorkflowControls from '../components/CurriculumWorkflowControls';
import CurriculumWorkflowStatus from '../components/CurriculumWorkflowStatus';
import { 
  Search, 
  Filter, 
  BarChart3, 
  Clock, 
  CheckCircle, 
  Play, 
  Pause, 
  Archive,
  FileText,
  AlertTriangle,
  Users,
  Calendar,
  TrendingUp,
  ArrowLeft
} from 'lucide-react';

const CurriculumWorkflowDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { curricula, status, error } = useAppSelector(state => state.curriculum);
  const { user } = useAppSelector(state => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selectedCurricula, setSelectedCurricula] = useState<number[]>([]);

  useEffect(() => {
    dispatch(fetchCurricula());
    return () => {
      dispatch(clearCurriculumError());
    };
  }, [dispatch]);

  const getWorkflowStats = () => {
    const stats = {
      draft: curricula.filter(c => c.status === 'DRAFT').length,
      underReview: curricula.filter(c => c.status === 'UNDER_REVIEW').length,
      approved: curricula.filter(c => c.status === 'APPROVED').length,
      active: curricula.filter(c => c.status === 'ACTIVE').length,
      suspended: curricula.filter(c => c.status === 'SUSPENDED').length,
      archived: curricula.filter(c => c.status === 'ARCHIVED').length,
      total: curricula.length
    };
    
    return stats;
  };

  const filteredCurricula = curricula.filter((curriculum: Curriculum) => {
    const matchesSearch = 
      curriculum.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (curriculum.description && curriculum.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = 
      statusFilter === '' || curriculum.status === statusFilter;

    const matchesType = 
      typeFilter === '' || curriculum.curriculumType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleSelectCurriculum = (curriculumId: number) => {
    setSelectedCurricula(prev => 
      prev.includes(curriculumId) 
        ? prev.filter(id => id !== curriculumId)
        : [...prev, curriculumId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCurricula.length === filteredCurricula.length) {
      setSelectedCurricula([]);
    } else {
      setSelectedCurricula(filteredCurricula.map(c => c.id));
    }
  };

  const stats = getWorkflowStats();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center min-h-96">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg text-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading workflow dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/app/curriculum')}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Back to Curriculum List"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Curriculum Workflow Dashboard</h1>
                <p className="text-gray-600">Monitor and manage curriculum workflow across all stages</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <BarChart3 className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* Workflow Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl font-bold text-gray-600 mb-2">{stats.draft}</div>
              <div className="text-sm text-gray-500 flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" />
                Draft
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.underReview}</div>
              <div className="text-sm text-gray-500 flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" />
                Under Review
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.approved}</div>
              <div className="text-sm text-gray-500 flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Approved
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.active}</div>
              <div className="text-sm text-gray-500 flex items-center justify-center gap-2">
                <Play className="w-4 h-4" />
                Active
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl font-bold text-orange-600 mb-2">{stats.suspended}</div>
              <div className="text-sm text-gray-500 flex items-center justify-center gap-2">
                <Pause className="w-4 h-4" />
                Suspended
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl font-bold text-red-600 mb-2">{stats.archived}</div>
              <div className="text-sm text-gray-500 flex items-center justify-center gap-2">
                <Archive className="w-4 h-4" />
                Archived
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl font-bold text-gray-900 mb-2">{stats.total}</div>
              <div className="text-sm text-gray-500 flex items-center justify-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Total
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search curricula..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">All Statuses</option>
                <option value="DRAFT">Draft</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="APPROVED">Approved</option>
                <option value="ACTIVE">Active</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="ARCHIVED">Archived</option>
              </select>
              <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">All Types</option>
                <option value="NATIONAL">National</option>
                <option value="REGIONAL">Regional</option>
                <option value="SCHOOL_SPECIFIC">School-Based</option>
                <option value="INTERNATIONAL">International</option>
                <option value="VOCATIONAL">Vocational</option>
                <option value="SPECIAL_NEEDS">Special Needs</option>
              </select>
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                <Filter className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-600">
                  {filteredCurricula.length} of {curricula.length} curricula
                </span>
              </div>
            </div>
          </div>

          {/* Curriculum List */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Curriculum Workflow ({filteredCurricula.length})
                  </h2>
                  {selectedCurricula.length > 0 && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {selectedCurricula.length} selected
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedCurricula.length === filteredCurricula.length && filteredCurricula.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="text-sm font-medium text-gray-600">Select All</label>
                </div>
              </div>
            </div>

            {filteredCurricula.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {filteredCurricula.map((curriculum) => (
                  <div key={curriculum.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={selectedCurricula.includes(curriculum.id)}
                        onChange={() => handleSelectCurriculum(curriculum.id)}
                        className="mt-1.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-6">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 cursor-pointer hover:text-blue-600 transition-colors"
                                onClick={() => navigate(`/app/curriculum/${curriculum.id}`)}>
                              {curriculum.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                              <span className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                {curriculum.gradeLevel.replace('_', ' ')}
                              </span>
                              <span className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Academic Year {curriculum.academicYear}
                              </span>
                              <span className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                {curriculum.curriculumType.replace('_', ' ')}
                              </span>
                              {curriculum.createdByName && (
                                <span className="text-gray-500">
                                  Created by {curriculum.createdByName}
                                </span>
                              )}
                            </div>
                            
                            {/* Workflow Status */}
                            <div className="mb-2">
                              <CurriculumWorkflowStatus 
                                curriculum={curriculum} 
                                variant="compact"
                                showNextActions={false}
                              />
                            </div>
                          </div>
                          
                          {/* Workflow Controls */}
                          <div className="flex-shrink-0">
                            <CurriculumWorkflowControls
                              curriculum={curriculum}
                              variant="compact"
                              onAction={(action, curr) => {
                                console.log(`Action ${action} performed on curriculum ${curr.id}`);
                                // Refresh the list after actions
                                if (['activate', 'suspend', 'archive', 'delete', 'submit'].includes(action)) {
                                  dispatch(fetchCurricula());
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <FileText className="mx-auto h-16 w-16 text-gray-400 mb-6" />
                <h3 className="text-xl font-medium text-gray-900 mb-3">No curricula found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {searchTerm || statusFilter || typeFilter 
                    ? 'Try adjusting your filters to see more results.'
                    : 'No curricula have been created yet.'
                  }
                </p>
                {!searchTerm && !statusFilter && !typeFilter && (
                  <div className="mt-6">
                    <button
                      onClick={() => navigate('/app/curriculum')}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      Go to Curriculum Management
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurriculumWorkflowDashboard; 