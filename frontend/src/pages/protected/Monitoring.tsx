import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setPageTitle } from '../../features/common/headerSlice';
import { 
  fetchSchoolMonitoringByRegion,
  fetchSchoolsWithLowCompliance,
  fetchLatestSchoolMonitoringForAllSchools,
  clearSchoolMonitoringError
} from '../../features/schools/schoolMonitoringSlice';
import {
  fetchLatestRegionMonitoringForAllRegions,
  fetchNationalAverageAttendanceRate,
  fetchNationalAverageComplianceScore,
  fetchTotalSchoolsNationally,
  clearRegionMonitoringError
} from '../../features/regions/regionMonitoringSlice';
import { fetchRegions } from '../../features/regions/regionsSlice';
import { 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  School, 
  MapPin,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw
} from 'lucide-react';

interface RegionPerformance {
  regionId: number;
  regionName: string;
  totalSchools: number;
  averageAttendanceRate: number;
  averageComplianceScore: number;
}

const Monitoring: React.FC = () => {
  const dispatch = useAppDispatch();
  const { 
    schoolMonitoring: schoolMonitoringData, 
    status: schoolMonitoringStatus, 
    error: schoolMonitoringError 
  } = useAppSelector(state => state.schoolMonitoring);
  
  const { 
    regionMonitoring,
    nationalStats, 
    status: regionMonitoringStatus, 
    error: regionMonitoringError 
  } = useAppSelector(state => state.regionMonitoring);
  
  const { regions } = useAppSelector(state => state.regions);
  
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [thresholdFilter, setThresholdFilter] = useState<string>('');
  const [refreshInterval, setRefreshInterval] = useState<number>(30000); // 30 seconds
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Create performance analysis from region monitoring data
  const performanceAnalysis: RegionPerformance[] = regionMonitoring.map(region => ({
    regionId: region.regionId,
    regionName: region.regionName || `Region ${region.regionId}`,
    totalSchools: region.totalSchools || 0,
    averageAttendanceRate: region.averageAttendanceRate || 0,
    averageComplianceScore: region.averageComplianceScore || 0
  }));

  // Create national statistics from individual stats
  const nationalStatistics = {
    totalSchools: nationalStats.totalSchools || 0,
    totalRegions: regions.length,
    averageAttendanceRate: nationalStats.averageAttendanceRate || 0,
    averageComplianceScore: nationalStats.averageComplianceScore || 0
  };

  useEffect(() => {
    dispatch(setPageTitle({ title: "System Monitoring" }));
    loadInitialData();
    
    // Set up auto-refresh
    const interval = setInterval(() => {
      refreshData();
    }, refreshInterval);

    return () => {
      clearInterval(interval);
      dispatch(clearSchoolMonitoringError());
      dispatch(clearRegionMonitoringError());
    };
  }, [dispatch, refreshInterval]);

  const loadInitialData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await Promise.all([
        dispatch(fetchRegions()),
        dispatch(fetchLatestSchoolMonitoringForAllSchools()),
        dispatch(fetchLatestRegionMonitoringForAllRegions()),
        dispatch(fetchNationalAverageAttendanceRate(today)),
        dispatch(fetchNationalAverageComplianceScore(today)),
        dispatch(fetchTotalSchoolsNationally(today))
      ]);
    } catch (error) {
      console.error('Failed to load initial monitoring data:', error);
    }
  };

  const refreshData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await Promise.all([
        dispatch(fetchLatestSchoolMonitoringForAllSchools()),
        dispatch(fetchLatestRegionMonitoringForAllRegions()),
        dispatch(fetchNationalAverageAttendanceRate(today)),
        dispatch(fetchNationalAverageComplianceScore(today)),
        selectedRegion && dispatch(fetchSchoolMonitoringByRegion(parseInt(selectedRegion))),
        thresholdFilter && dispatch(fetchSchoolsWithLowCompliance({
          threshold: parseFloat(thresholdFilter),
          date: today
        }))
      ].filter(Boolean));
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to refresh monitoring data:', error);
    }
  };

  const handleRegionChange = (regionId: string) => {
    setSelectedRegion(regionId);
    if (regionId) {
      dispatch(fetchSchoolMonitoringByRegion(parseInt(regionId)));
    }
  };

  const handleThresholdFilter = (threshold: string) => {
    setThresholdFilter(threshold);
    if (threshold) {
      const today = new Date().toISOString().split('T')[0];
      dispatch(fetchSchoolsWithLowCompliance({
        threshold: parseFloat(threshold),
        date: today
      }));
    }
  };

  const isLoading = schoolMonitoringStatus === 'loading' || regionMonitoringStatus === 'loading';

  return (
    <div className="monitoring-container p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Activity className="text-blue-600" size={32} />
            System Monitoring
          </h1>
          <p className="text-gray-600 mt-2">Real-time monitoring of school and regional performance</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </div>
          <button 
            onClick={refreshData}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Error Alerts */}
      {(schoolMonitoringError || regionMonitoringError) && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} />
            <span>{schoolMonitoringError || regionMonitoringError}</span>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <select 
            value={selectedRegion}
            onChange={(e) => handleRegionChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Regions</option>
            {regions.map((region) => (
              <option key={region.id} value={region.id.toString()}>
                {region.name}
              </option>
            ))}
          </select>
          <select 
            value={thresholdFilter}
            onChange={(e) => handleThresholdFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Performance Levels</option>
            <option value="0.5">Below 50%</option>
            <option value="0.7">Below 70%</option>
            <option value="0.8">Below 80%</option>
            <option value="0.9">Below 90%</option>
          </select>
          <select 
            value={refreshInterval.toString()}
            onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="10000">10 seconds</option>
            <option value="30000">30 seconds</option>
            <option value="60000">1 minute</option>
            <option value="300000">5 minutes</option>
          </select>
        </div>
      </div>

      {/* National Statistics Overview */}
      {nationalStatistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {nationalStatistics.totalSchools}
                </div>
                <div className="text-sm text-gray-500">Total Schools</div>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <School size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {nationalStatistics.totalRegions}
                </div>
                <div className="text-sm text-gray-500">Total Regions</div>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <MapPin size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {(nationalStatistics.averageAttendanceRate * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-500">Avg Attendance</div>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Users size={24} className="text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {(nationalStatistics.averageComplianceScore * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-500">Compliance Score</div>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 size={24} className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Analysis */}
      {performanceAnalysis && performanceAnalysis.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp size={20} />
            Regional Performance Analysis
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Region
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Schools
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Attendance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Compliance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {performanceAnalysis.map((region: RegionPerformance) => (
                  <tr key={region.regionId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {region.regionName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{region.totalSchools}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {(region.averageAttendanceRate * 100).toFixed(1)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {(region.averageComplianceScore * 100).toFixed(1)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {region.averageComplianceScore >= 0.8 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle size={12} className="mr-1" />
                          Good
                        </span>
                      ) : region.averageComplianceScore >= 0.6 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Clock size={12} className="mr-1" />
                          Warning
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <XCircle size={12} className="mr-1" />
                          Critical
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleRegionChange(region.regionId.toString())}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                      >
                        <Eye size={14} />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* School Monitoring Data */}
      {schoolMonitoringData && schoolMonitoringData.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <School size={20} />
            School Monitoring Details
            {selectedRegion && (
              <span className="text-sm font-normal text-gray-500">
                - {regions.find(r => r.id.toString() === selectedRegion)?.name}
              </span>
            )}
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    School
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Login Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Compliance Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alerts
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {schoolMonitoringData.map((school) => (
                  <tr key={school.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {school.schoolName || `School ${school.schoolId}`}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {school.schoolId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {school.attendanceRate ? (school.attendanceRate * 100).toFixed(1) : 'N/A'}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{school.totalLogins || 0}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {school.complianceScore ? (school.complianceScore * 100).toFixed(1) : 'N/A'}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(school.alertCount || 0) > 0 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <AlertTriangle size={12} className="mr-1" />
                          {school.alertCount}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle size={12} className="mr-1" />
                          None
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {school.updatedAt ? new Date(school.updatedAt).toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center min-h-64">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !nationalStatistics && !schoolMonitoringData?.length && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <Activity size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Monitoring Data Available</h3>
          <p className="text-gray-600 mb-4">
            Monitoring data will appear here once schools start generating activity.
          </p>
          <button 
            onClick={refreshData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Refresh Data
          </button>
        </div>
      )}
    </div>
  );
};

export default Monitoring; 