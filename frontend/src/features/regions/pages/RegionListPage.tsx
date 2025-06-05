import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchRegions, clearRegionsError, activateRegion, deactivateRegion, deleteRegion } from '../regionsSlice';
import { fetchLatestRegionMonitoringForAllRegions, clearRegionMonitoringError } from '../regionMonitoringSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { Region } from '../../../api/services/regionApi';
import { RegionMonitoring } from '../../../api/services/regionMonitoringApi';
import { Plus, Search, MapPin, Edit, Trash2, Activity, AlertTriangle, TrendingUp, Users, School, ChevronLeft, ChevronRight } from 'lucide-react';

const RegionListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { regions, status, error } = useAppSelector(state => state.regions);
  const { regionMonitoring, status: monitoringStatus } = useAppSelector(state => state.regionMonitoring || { regionMonitoring: [], status: 'idle' });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [performanceFilter, setPerformanceFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchRegions());
    dispatch(fetchLatestRegionMonitoringForAllRegions());
    return () => {
      dispatch(clearRegionsError());
      dispatch(clearRegionMonitoringError());
    };
  }, [dispatch]);

  const handleCreateRegion = () => {
    dispatch(openModal({
      title: 'Create New Region',
      bodyType: MODAL_BODY_TYPES.REGION_ADD_NEW,
      size: 'md'
    }));
  };

  const handleEdit = (region: Region) => {
    dispatch(openModal({
      title: 'Edit Region',
      bodyType: MODAL_BODY_TYPES.REGION_EDIT,
      extraObject: region
    }));
  };

  const handleDelete = (region: Region) => {
    dispatch(openModal({
      title: 'Delete Region',
      bodyType: MODAL_BODY_TYPES.REGION_DELETE_CONFIRMATION,
      extraObject: region
    }));
  };

  const handleToggleStatus = async (region: Region) => {
    try {
      if (region.active) {
        await dispatch(deactivateRegion(region.id)).unwrap();
      } else {
        await dispatch(activateRegion(region.id)).unwrap();
      }
    } catch (error) {
      console.error('Failed to toggle region status:', error);
    }
  };

  const handleViewDetails = (region: Region) => {
    navigate(`/app/administration/regions/${region.id}`);
  };

  const handleViewMonitoring = (region: Region) => {
    dispatch(openModal({
      title: `${region.name} - Regional Monitoring`,
      bodyType: MODAL_BODY_TYPES.MONITORING_DETAILS,
      extraObject: { region, monitoring: getRegionMonitoring(region.id) }
    }));
  };

  const getRegionMonitoring = (regionId: number): RegionMonitoring | null => {
    return regionMonitoring.find((m: RegionMonitoring) => m.regionId === regionId) || null;
  };

  const getPerformanceStatus = (monitoring: RegionMonitoring | null) => {
    if (!monitoring || !monitoring.averageComplianceScore) return 'unknown';
    const score = monitoring.averageComplianceScore;
    if (score >= 0.8) return 'excellent';
    if (score >= 0.6) return 'good';
    if (score >= 0.4) return 'warning';
    return 'critical';
  };

  const getPerformanceColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRegions = regions.filter((region: Region) => {
    const monitoring = getRegionMonitoring(region.id);
    const performanceStatus = getPerformanceStatus(monitoring);

    const matchesSearch = 
      region.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      region.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (region.description && region.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = 
      statusFilter === '' ||
      (statusFilter === 'active' && region.active) ||
      (statusFilter === 'inactive' && !region.active);

    const matchesPerformance = 
      performanceFilter === '' ||
      performanceStatus === performanceFilter;

    return matchesSearch && matchesStatus && matchesPerformance;
  });

  // Pagination calculations
  const totalItems = filteredRegions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRegions = filteredRegions.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, performanceFilter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  // Calculate monitoring statistics
  const monitoringStats = {
    totalWithMonitoring: regionMonitoring.length,
    totalSchools: regionMonitoring.reduce((sum: number, m: RegionMonitoring) => sum + (m.totalSchools || 0), 0),
    averageAttendance: regionMonitoring.length > 0 
      ? regionMonitoring.reduce((sum: number, m: RegionMonitoring) => sum + (m.averageAttendanceRate || 0), 0) / regionMonitoring.length 
      : 0,
    averageCompliance: regionMonitoring.length > 0 
      ? regionMonitoring.reduce((sum: number, m: RegionMonitoring) => sum + (m.averageComplianceScore || 0), 0) / regionMonitoring.length 
      : 0,
    totalAlerts: regionMonitoring.reduce((sum: number, m: RegionMonitoring) => sum + (m.totalAlerts || 0), 0)
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
          <h1 className="text-3xl font-bold text-gray-900">Regional Management</h1>
          <p className="text-gray-600 mt-2">Manage regions and monitor their performance</p>
        </div>
        <button 
          onClick={handleCreateRegion} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={16} />
          Add New Region
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => dispatch(clearRegionsError())}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search regions by name, code, or description..."
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
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select 
            value={performanceFilter}
            onChange={(e) => setPerformanceFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Performance</option>
            <option value="excellent">Excellent (80%+)</option>
            <option value="good">Good (60-79%)</option>
            <option value="warning">Warning (40-59%)</option>
            <option value="critical">Critical (&lt;40%)</option>
          </select>
          <select 
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
      </div>

      {/* Enhanced Stats Summary */}
      {regions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <MapPin size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{regions.length}</div>
                <div className="text-sm text-gray-500">Total Regions</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <Activity size={20} className="text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{monitoringStats.totalWithMonitoring}</div>
                <div className="text-sm text-gray-500">With Monitoring</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg mr-3">
                <School size={20} className="text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{monitoringStats.totalSchools}</div>
                <div className="text-sm text-gray-500">Total Schools</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                <Users size={20} className="text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {(monitoringStats.averageAttendance * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-500">Avg Attendance</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <TrendingUp size={20} className="text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {(monitoringStats.averageCompliance * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-500">Avg Compliance</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Regions Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Regions</h3>
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} regions
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Region
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Schools
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendance
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Compliance
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alerts
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentRegions.map((region: Region) => {
                const monitoring = getRegionMonitoring(region.id);
                const performanceStatus = getPerformanceStatus(monitoring);
                
                return (
                  <tr key={region.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg mr-3">
                          <MapPin size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{region.name}</div>
                          <div className="text-sm text-gray-500">{region.code}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                        {region.schoolCount || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {monitoring?.averageAttendanceRate ? (
                        <div className="text-sm text-gray-900">
                          {(monitoring.averageAttendanceRate * 100).toFixed(1)}%
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">No data</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {monitoring?.averageComplianceScore ? (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPerformanceColor(performanceStatus)}`}>
                          {(monitoring.averageComplianceScore * 100).toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">No data</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {monitoring?.totalAlerts ? (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                          <AlertTriangle size={12} className="mr-1" />
                          {monitoring.totalAlerts}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStatus(region);
                        }}
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full cursor-pointer transition-colors ${
                          region.active 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {region.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => handleViewDetails(region)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="View Details"
                        >
                          <MapPin size={16} />
                        </button>
                        {monitoring && (
                          <button 
                            onClick={() => handleViewMonitoring(region)}
                            className="text-green-600 hover:text-green-900 transition-colors"
                            title="View Monitoring"
                          >
                            <Activity size={16} />
                          </button>
                        )}
                        <button 
                          onClick={() => handleEdit(region)}
                          className="text-yellow-600 hover:text-yellow-900 transition-colors"
                          title="Edit Region"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(region)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Delete Region"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft size={16} />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-3 py-1 border rounded-lg ${
                        currentPage === pageNumber
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        )}

        {filteredRegions.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <div className="text-gray-500 text-lg mb-2">
              {searchTerm || statusFilter || performanceFilter ? 'No regions found matching your criteria' : 'No regions found'}
            </div>
            {!searchTerm && !statusFilter && !performanceFilter && (
              <button
                onClick={handleCreateRegion}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
              >
                <Plus size={16} />
                Create First Region
              </button>
            )}
          </div>
        )}
      </div>

      {/* Monitoring Status */}
      {monitoringStatus === 'loading' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="loading loading-spinner loading-sm mr-2"></div>
            <span className="text-blue-700">Loading monitoring data...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegionListPage; 