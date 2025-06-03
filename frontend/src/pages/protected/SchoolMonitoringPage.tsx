import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setPageTitle } from '../../features/common/headerSlice';
import { fetchLatestSchoolMonitoringForAllSchools } from '../../features/schools/schoolMonitoringSlice';
import { fetchSchools } from '../../features/schools/schoolsSlice';
import { fetchRegions } from '../../features/regions/regionsSlice';
import { openModal } from '../../features/common/modalSlice';
import { MODAL_BODY_TYPES } from '../../utils/modalConstants';
import { School } from '../../api/services/schoolApi';
import { SchoolMonitoring } from '../../api/services/schoolMonitoringApi';
import { Region } from '../../api/services/regionApi';
import { 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Search,
  Eye,
  BarChart3,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function SchoolMonitoringPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { schools } = useAppSelector(state => state.schools);
  const { regions } = useAppSelector(state => state.regions);
  const { schoolMonitoring, status } = useAppSelector(state => state.schoolMonitoring || { schoolMonitoring: [], status: 'idle' });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [performanceFilter, setPerformanceFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    dispatch(setPageTitle({ title: "School Monitoring" }));
    dispatch(fetchSchools());
    dispatch(fetchRegions());
    dispatch(fetchLatestSchoolMonitoringForAllSchools());
  }, [dispatch]);

  const getSchoolMonitoring = (schoolId: number): SchoolMonitoring | null => {
    return schoolMonitoring.find((m: SchoolMonitoring) => m.schoolId === schoolId) || null;
  };

  const getRegionName = (regionId: number) => {
    const region = regions.find((r: Region) => r.id === regionId);
    return region ? region.name : 'Unknown Region';
  };

  const getPerformanceStatus = (monitoring: SchoolMonitoring | null) => {
    if (!monitoring || !monitoring.complianceScore) return 'unknown';
    const score = monitoring.complianceScore;
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

  const handleViewDetails = (school: School) => {
    navigate(`/app/administration/schools/${school.id}`);
  };

  const handleViewMonitoring = (school: School) => {
    const monitoring = getSchoolMonitoring(school.id);
    dispatch(openModal({
      title: `${school.name} - Monitoring Details`,
      bodyType: MODAL_BODY_TYPES.MONITORING_DETAILS,
      extraObject: { school, monitoring },
      size: 'lg'
    }));
  };

  const filteredSchools = schools.filter((school: School) => {
    const monitoring = getSchoolMonitoring(school.id);
    const performanceStatus = getPerformanceStatus(monitoring);

    const matchesSearch = 
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRegion = 
      regionFilter === '' ||
      school.regionId.toString() === regionFilter;

    const matchesPerformance = 
      performanceFilter === '' ||
      performanceStatus === performanceFilter;

    return matchesSearch && matchesRegion && matchesPerformance;
  });

  // Pagination calculations
  const totalItems = filteredSchools.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSchools = filteredSchools.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, regionFilter, performanceFilter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  // Calculate overall statistics
  const totalSchools = schools.length;
  const schoolsWithMonitoring = schoolMonitoring.length;
  const averageAttendance = schoolMonitoring.length > 0 
    ? schoolMonitoring.reduce((sum: number, m: SchoolMonitoring) => sum + (m.attendanceRate || 0), 0) / schoolMonitoring.length 
    : 0;
  const averageCompliance = schoolMonitoring.length > 0 
    ? schoolMonitoring.reduce((sum: number, m: SchoolMonitoring) => sum + (m.complianceScore || 0), 0) / schoolMonitoring.length 
    : 0;
  const totalAlerts = schoolMonitoring.reduce((sum: number, m: SchoolMonitoring) => sum + (m.alertCount || 0), 0);

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
          <h1 className="text-3xl font-bold text-gray-900">School Monitoring Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor performance and compliance across all schools</p>
        </div>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{totalSchools}</div>
              <div className="text-sm text-gray-500">Total Schools</div>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users size={20} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{schoolsWithMonitoring}</div>
              <div className="text-sm text-gray-500">With Monitoring</div>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <Activity size={20} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {(averageAttendance * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-500">Avg Attendance</div>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp size={20} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {(averageCompliance * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-500">Avg Compliance</div>
            </div>
            <div className="p-2 bg-indigo-100 rounded-lg">
              <BarChart3 size={20} className="text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{totalAlerts}</div>
              <div className="text-sm text-gray-500">Total Alerts</div>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search schools by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select 
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Regions</option>
            {regions.map((region: Region) => (
              <option key={region.id} value={region.id.toString()}>
                {region.name}
              </option>
            ))}
          </select>
          <select 
            value={performanceFilter}
            onChange={(e) => setPerformanceFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Performance</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
            <option value="unknown">No Data</option>
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

      {/* Schools List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Schools Monitoring Status</h3>
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} schools
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  School
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Region
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Compliance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alerts
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
              {currentSchools.map((school: School) => {
                const monitoring = getSchoolMonitoring(school.id);
                const performanceStatus = getPerformanceStatus(monitoring);
                const performanceColor = getPerformanceColor(performanceStatus);

                return (
                  <tr key={school.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{school.name}</div>
                        <div className="text-sm text-gray-500">{school.code}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getRegionName(school.regionId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {monitoring?.attendanceRate ? `${(monitoring.attendanceRate * 100).toFixed(1)}%` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {monitoring?.complianceScore ? `${(monitoring.complianceScore * 100).toFixed(1)}%` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {monitoring?.alertCount || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${performanceColor}`}>
                        {performanceStatus.charAt(0).toUpperCase() + performanceStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(school)}
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                        >
                          <Eye size={16} />
                          Details
                        </button>
                        <button
                          onClick={() => handleViewMonitoring(school)}
                          className="text-green-600 hover:text-green-900 flex items-center gap-1"
                        >
                          <Activity size={16} />
                          Monitor
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
      </div>
    </div>
  );
}

export default SchoolMonitoringPage; 