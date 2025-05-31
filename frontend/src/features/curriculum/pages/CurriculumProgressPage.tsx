import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  fetchAllProgress,
  fetchProgressByCurriculum,
  fetchProgressBySchool,
  fetchProgressSummary,
  fetchProgressStatistics,
  fetchOverdueProgress,
  createProgress,
  updateProgress,
  deleteProgress
} from '../curriculumProgressSlice';
import { fetchCurriculumById } from '../curriculumSlice';
import { CurriculumProgressDTO } from '../../../api/services/curriculumProgressApi';
import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Activity,
  TrendingUp,
  TrendingDown,
  Users,
  School,
  Target,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';

const CurriculumProgressPage: React.FC = () => {
  const { curriculumId } = useParams<{ curriculumId: string }>();
  const dispatch = useAppDispatch();
  
  const { currentCurriculum } = useAppSelector(state => state.curriculum);
  const {
    progressRecords,
    progressSummary,
    progressStatistics,
    overdueProgress,
    status,
    error
  } = useAppSelector(state => (state as any).curriculumProgress || {
    progressRecords: [],
    progressSummary: null,
    progressStatistics: null,
    overdueProgress: [],
    status: 'idle',
    error: null
  });
  const { user } = useAppSelector(state => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProgress, setEditingProgress] = useState<CurriculumProgressDTO | null>(null);
  const [progressData, setProgressData] = useState({
    schoolId: user?.schoolId || 0,
    implementationStatus: 'NOT_STARTED' as CurriculumProgressDTO['implementationStatus'],
    progressPercentage: 0,
    startDate: new Date().toISOString().split('T')[0],
    expectedEndDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    assignedTeacherId: undefined as number | undefined,
    supervisorId: undefined as number | undefined,
    notes: '',
    challenges: '',
    achievements: '',
    resourcesNeeded: ''
  });
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  useEffect(() => {
    if (curriculumId) {
      const id = parseInt(curriculumId);
      dispatch(fetchCurriculumById(id));
      dispatch(fetchProgressByCurriculum(id));
      dispatch(fetchProgressSummary(id));
      dispatch(fetchProgressStatistics());
      dispatch(fetchOverdueProgress());
    } else {
      dispatch(fetchAllProgress());
    }
  }, [dispatch, curriculumId]);

  const handleCreateProgress = async () => {
    if (curriculumId) {
      try {
        await dispatch(createProgress({
          ...progressData,
          curriculumId: parseInt(curriculumId),
          lastUpdatedById: user?.id || 1
        })).unwrap();
        
        setShowCreateModal(false);
        resetProgressData();
        showNotification('success', 'Progress record created successfully');
      } catch (error) {
        console.error('Failed to create progress record:', error);
        showNotification('error', 'Failed to create progress record');
      }
    }
  };

  const handleUpdateProgress = async () => {
    if (editingProgress) {
      try {
        await dispatch(updateProgress({
          id: editingProgress.id,
          progressData: {
            ...progressData,
            lastUpdatedById: user?.id || 1
          }
        })).unwrap();
        
        setEditingProgress(null);
        resetProgressData();
        showNotification('success', 'Progress record updated successfully');
      } catch (error) {
        console.error('Failed to update progress record:', error);
        showNotification('error', 'Failed to update progress record');
      }
    }
  };

  const handleDeleteProgress = async (progressId: number) => {
    if (window.confirm('Are you sure you want to delete this progress record?')) {
      try {
        await dispatch(deleteProgress(progressId)).unwrap();
        showNotification('success', 'Progress record deleted successfully');
      } catch (error) {
        console.error('Failed to delete progress record:', error);
        showNotification('error', 'Failed to delete progress record');
      }
    }
  };

  const resetProgressData = () => {
    setProgressData({
      schoolId: user?.schoolId || 0,
      implementationStatus: 'NOT_STARTED',
      progressPercentage: 0,
      startDate: new Date().toISOString().split('T')[0],
      expectedEndDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      assignedTeacherId: undefined,
      supervisorId: undefined,
      notes: '',
      challenges: '',
      achievements: '',
      resourcesNeeded: ''
    });
  };

  const openEditModal = (progress: CurriculumProgressDTO) => {
    setEditingProgress(progress);
    setProgressData({
      schoolId: progress.schoolId,
      implementationStatus: progress.implementationStatus,
      progressPercentage: progress.progressPercentage,
      startDate: progress.startDate.split('T')[0],
      expectedEndDate: progress.expectedEndDate.split('T')[0],
      assignedTeacherId: progress.assignedTeacherId,
      supervisorId: progress.supervisorId,
      notes: progress.notes || '',
      challenges: progress.challenges || '',
      achievements: progress.achievements || '',
      resourcesNeeded: progress.resourcesNeeded || ''
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'NOT_STARTED': 'bg-gray-100 text-gray-800',
      'PLANNING': 'bg-blue-100 text-blue-800',
      'IN_PROGRESS': 'bg-yellow-100 text-yellow-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'ON_HOLD': 'bg-orange-100 text-orange-800',
      'CANCELLED': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      'NOT_STARTED': Clock,
      'PLANNING': Calendar,
      'IN_PROGRESS': Activity,
      'COMPLETED': CheckCircle,
      'ON_HOLD': AlertTriangle,
      'CANCELLED': AlertTriangle
    };
    const IconComponent = icons[status as keyof typeof icons] || Clock;
    return <IconComponent size={16} />;
  };

  const filteredProgress = progressRecords.filter((progress: CurriculumProgressDTO) => {
    const matchesSearch = 
      (progress.schoolName && progress.schoolName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (progress.assignedTeacherName && progress.assignedTeacherName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = 
      statusFilter === '' || progress.implementationStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const canManageProgress = user && [
    'MINISTRY_STAFF',
    'MINISTRY_EXECUTIVE',
    'REGIONAL_ADMIN',
    'SCHOOL_ADMIN',
    'SUPER_ADMIN'
  ].includes(user.role);

  const handleRefreshData = () => {
    if (curriculumId) {
      const id = parseInt(curriculumId);
      dispatch(fetchCurriculumById(id));
      dispatch(fetchProgressByCurriculum(id));
      dispatch(fetchProgressSummary(id));
      dispatch(fetchProgressStatistics());
      dispatch(fetchOverdueProgress());
    } else {
      dispatch(fetchAllProgress());
      dispatch(fetchProgressStatistics());
      dispatch(fetchOverdueProgress());
    }
    showNotification('success', 'Progress data refreshed successfully');
  };

  const handleExportProgress = () => {
    const exportData = {
      curriculum: currentCurriculum,
      progressRecords: filteredProgress,
      summary: progressSummary,
      statistics: progressStatistics,
      overdueProgress: overdueProgress,
      generatedAt: new Date().toISOString(),
      generatedBy: user?.name || 'Unknown User',
      filters: {
        searchTerm,
        statusFilter
      }
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `curriculum-progress-${curriculumId || 'all'}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('success', 'Progress data exported successfully');
  };

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
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
          <h1 className="text-3xl font-bold text-gray-900">
            {curriculumId ? 'Curriculum Implementation Progress' : 'All Implementation Progress'}
          </h1>
          <p className="text-gray-600 mt-2">
            {curriculumId 
              ? `${currentCurriculum?.title || 'Loading curriculum...'} - Track implementation progress across schools`
              : 'Monitor curriculum implementation progress across all curricula and schools'
            }
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleRefreshData}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Refresh Data
          </button>
          <button
            onClick={handleExportProgress}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Download size={16} />
            Export Progress
          </button>
          {canManageProgress && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus size={16} />
              Add Progress Record
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      {progressSummary && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <School size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {progressSummary.totalSchools}
                </div>
                <div className="text-sm text-gray-500">Total Schools</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <CheckCircle size={20} className="text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {progressSummary.completedSchools}
                </div>
                <div className="text-sm text-gray-500">Completed</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                <Activity size={20} className="text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {progressSummary.inProgressSchools}
                </div>
                <div className="text-sm text-gray-500">In Progress</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg mr-3">
                <Clock size={20} className="text-gray-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {progressSummary.notStartedSchools}
                </div>
                <div className="text-sm text-gray-500">Not Started</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg mr-3">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {progressSummary.overdueSchools}
                </div>
                <div className="text-sm text-gray-500">Overdue</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search schools or teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="NOT_STARTED">Not Started</option>
            <option value="PLANNING">Planning</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="ON_HOLD">On Hold</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">
              {filteredProgress.length} of {progressRecords.length} records
            </span>
          </div>
        </div>
      </div>

      {/* Progress Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  School
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned Teacher
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timeline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProgress.map((progress: CurriculumProgressDTO) => (
                <tr key={progress.id} className={progress.isOverdue ? 'bg-red-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {progress.schoolName || 'Unknown School'}
                      </div>
                      {progress.regionName && (
                        <div className="text-sm text-gray-500">
                          {progress.regionName}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(progress.implementationStatus)}`}>
                      {getStatusIcon(progress.implementationStatus)}
                      <span className="ml-1">{progress.implementationStatus.replace('_', ' ')}</span>
                    </span>
                    {progress.isOverdue && (
                      <div className="text-xs text-red-600 mt-1">
                        {progress.daysOverdue} days overdue
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className={`h-2 rounded-full ${
                            progress.isOverdue ? 'bg-red-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${progress.progressPercentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">{progress.progressPercentage}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {progress.assignedTeacherName || 'Not assigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div>Start: {new Date(progress.startDate).toLocaleDateString()}</div>
                      <div>Due: {new Date(progress.expectedEndDate).toLocaleDateString()}</div>
                      {progress.actualEndDate && (
                        <div>Completed: {new Date(progress.actualEndDate).toLocaleDateString()}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(progress)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit Progress"
                      >
                        <Edit size={16} />
                      </button>
                      {canManageProgress && (
                        <button
                          onClick={() => handleDeleteProgress(progress.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Progress"
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
      </div>

      {filteredProgress.length === 0 && (
        <div className="text-center py-12">
          <Target className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No progress records found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter
              ? 'Try adjusting your search criteria.'
              : 'Get started by adding your first progress record.'}
          </p>
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || editingProgress) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingProgress ? 'Edit Progress Record' : 'Create Progress Record'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={progressData.implementationStatus}
                  onChange={(e) => setProgressData(prev => ({ ...prev, implementationStatus: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="NOT_STARTED">Not Started</option>
                  <option value="PLANNING">Planning</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="ON_HOLD">On Hold</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Progress (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={progressData.progressPercentage}
                  onChange={(e) => setProgressData(prev => ({ ...prev, progressPercentage: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={progressData.startDate}
                  onChange={(e) => setProgressData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expected End Date</label>
                <input
                  type="date"
                  value={progressData.expectedEndDate}
                  onChange={(e) => setProgressData(prev => ({ ...prev, expectedEndDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={progressData.notes}
                  onChange={(e) => setProgressData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Implementation notes..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Challenges</label>
                <textarea
                  value={progressData.challenges}
                  onChange={(e) => setProgressData(prev => ({ ...prev, challenges: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Implementation challenges..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Achievements</label>
                <textarea
                  value={progressData.achievements}
                  onChange={(e) => setProgressData(prev => ({ ...prev, achievements: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Implementation achievements..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Resources Needed</label>
                <textarea
                  value={progressData.resourcesNeeded}
                  onChange={(e) => setProgressData(prev => ({ ...prev, resourcesNeeded: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Additional resources needed..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingProgress(null);
                  resetProgressData();
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingProgress ? handleUpdateProgress : handleCreateProgress}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {editingProgress ? 'Update' : 'Create'}
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

export default CurriculumProgressPage; 