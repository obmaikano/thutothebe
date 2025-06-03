import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchRegionById, clearRegionsError, activateRegion, deactivateRegion, deleteRegion } from '../regionsSlice';
import { fetchSchoolsByRegionId } from '../../schools/schoolsSlice';
import { fetchRegionMonitoringByRegion, clearRegionMonitoringError } from '../regionMonitoringSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { Region } from '../../../api/services/regionApi';
import { 
  ArrowLeft,
  MapPin, 
  Users, 
  Building, 
  TrendingUp, 
  AlertTriangle,
  Calendar,
  Edit,
  Activity,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  Globe,
  Layers,
  School,
  GraduationCap,
  Trash2,
  Play,
  Pause,
  Copy,
  Download,
  Share2,
  Settings,
  Award,
  BookMarked,
  Star,
  Eye
} from 'lucide-react';

const RegionDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { currentRegion, status, error } = useAppSelector(state => state.regions);
  const { schools } = useAppSelector(state => state.schools);
  const { 
    currentRegionMonitoring, 
    status: monitoringStatus 
  } = useAppSelector(state => state.regionMonitoring);
  const { user } = useAppSelector(state => state.auth);
  
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (id) {
      dispatch(fetchRegionById(parseInt(id)));
      dispatch(fetchSchoolsByRegionId(parseInt(id)));
      dispatch(fetchRegionMonitoringByRegion(parseInt(id)));
    }
    return () => {
      dispatch(clearRegionsError());
      dispatch(clearRegionMonitoringError());
    };
  }, [id, dispatch]);

  const handleEdit = () => {
    if (currentRegion) {
      dispatch(openModal({
        title: 'Edit Region',
        bodyType: MODAL_BODY_TYPES.REGION_EDIT,
        extraObject: currentRegion,
        size: 'lg'
      }));
    }
  };

  const handleDelete = () => {
    if (currentRegion) {
      dispatch(openModal({
        title: 'Delete Region',
        bodyType: MODAL_BODY_TYPES.REGION_DELETE_CONFIRMATION,
        extraObject: { region: currentRegion }
      }));
    }
  };

  const handleToggleStatus = async () => {
    if (!currentRegion) return;
    
    try {
      if (currentRegion.active) {
        await dispatch(deactivateRegion(currentRegion.id)).unwrap();
      } else {
        await dispatch(activateRegion(currentRegion.id)).unwrap();
      }
    } catch (error) {
      console.error('Failed to toggle region status:', error);
    }
  };

  const handleViewMonitoring = () => {
    if (currentRegion && currentRegionMonitoring) {
      dispatch(openModal({
        title: `${currentRegion.name} - Regional Monitoring`,
        bodyType: MODAL_BODY_TYPES.MONITORING_DETAILS,
        extraObject: {
          region: currentRegion,
          monitoring: currentRegionMonitoring
        }
      }));
    }
  };

  const handleViewSchool = (schoolId: number) => {
    navigate(`/app/administration/schools/${schoolId}`);
  };

  const canEditRegion = (region: Region) => {
    if (!user) return false;
    
    const editorRoles = ['SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'DIRECTOR'];
    return editorRoles.includes(user.role);
  };

  const canViewMonitoring = user && [
    'SUPER_ADMIN',
    'MINISTRY_EXECUTIVE',
    'MINISTRY_STAFF',
    'DIRECTOR',
    'REGIONAL_ADMIN',
    'REGIONAL_OFFICER'
  ].includes(user.role);

  const getStatusBadge = (active: boolean) => {
    return (
      <span className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg border ${
        active 
          ? 'bg-green-100 text-green-800 border-green-200' 
          : 'bg-red-100 text-red-800 border-red-200'
      }`}>
        {active ? <CheckCircle size={14} className="mr-1.5" /> : <XCircle size={14} className="mr-1.5" />}
        {active ? 'Active' : 'Inactive'}
      </span>
    );
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: MapPin },
    { id: 'schools', label: 'Schools', icon: School },
    { id: 'monitoring', label: 'Monitoring', icon: Activity, requiresPermission: canViewMonitoring },
    { id: 'performance', label: 'Performance', icon: BarChart3, requiresPermission: canViewMonitoring },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, requiresPermission: canViewMonitoring }
  ].filter(tab => !tab.requiresPermission || tab.requiresPermission);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center min-h-96">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg text-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading region details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-400 mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Region</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => dispatch(clearRegionsError())}
                className="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50"
              >
                Dismiss
              </button>
              <button
                onClick={() => id && dispatch(fetchRegionById(parseInt(id)))}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentRegion) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Region Not Found</h3>
            <p className="text-gray-600 mb-6">
              The region you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate('/app/administration/regions')}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Regions
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter schools for this region
  const regionSchools = schools.filter(school => school.regionId === currentRegion.id);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'schools':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <School className="h-5 w-5 text-blue-600 mr-2" />
                  Schools in {currentRegion.name} ({regionSchools.length})
                </h3>
              </div>
              
              {regionSchools.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {regionSchools.map((school) => (
                    <div
                      key={school.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
                      onClick={() => handleViewSchool(school.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{school.name}</h4>
                          <p className="text-sm text-gray-600 font-mono">{school.code}</p>
                          {school.description && (
                            <p className="text-sm text-gray-500 mt-2 line-clamp-2">{school.description}</p>
                          )}
                        </div>
                        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                          school.active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {school.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <School className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Schools Found</h4>
                  <p className="text-gray-600">There are no schools registered in this region yet.</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'monitoring':
        return (
          <div className="space-y-6">
            {currentRegionMonitoring ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-blue-100 rounded-lg mr-4">
                        <School className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {currentRegionMonitoring.totalSchools || 0}
                        </div>
                        <div className="text-sm text-gray-500">Total Schools</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-green-100 rounded-lg mr-4">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {currentRegionMonitoring.activeSchools || 0}
                        </div>
                        <div className="text-sm text-gray-500">Active Schools</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-yellow-100 rounded-lg mr-4">
                        <Users className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {((currentRegionMonitoring.averageAttendanceRate || 0) * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-500">Avg Attendance</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-red-100 rounded-lg mr-4">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {currentRegionMonitoring.totalAlerts || 0}
                        </div>
                        <div className="text-sm text-gray-500">Total Alerts</div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <Activity className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Monitoring Data</h3>
                <p className="text-gray-600">Monitoring data is not available for this region.</p>
              </div>
            )}
          </div>
        );
      case 'performance':
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance Analytics</h3>
            <p className="text-gray-600 mb-6">Detailed performance analytics coming soon.</p>
          </div>
        );
      case 'analytics':
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <TrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Regional Analytics</h3>
            <p className="text-gray-600 mb-6">Advanced regional analytics coming soon.</p>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            {/* Region Information Cards */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <MapPin className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {currentRegion.name}
                      </h1>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          Code: {currentRegion.code}
                        </span>
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(currentRegion.active)}
                </div>
              </div>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg mr-4">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {currentRegion.id}
                    </div>
                    <div className="text-sm text-gray-500">Region ID</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg mr-4">
                    <School className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {regionSchools.length}
                    </div>
                    <div className="text-sm text-gray-500">Schools</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg mr-4">
                    <CheckCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {regionSchools.filter(school => school.active).length}
                    </div>
                    <div className="text-sm text-gray-500">Active Schools</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Regional Statistics */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
                Regional Overview & Live Statistics
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-blue-800">Total Schools</div>
                      <div className="text-2xl font-bold text-blue-900">
                        {regionSchools.length}
                      </div>
                    </div>
                    <School className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    {regionSchools.filter(s => s.active).length} active
                  </div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-green-800">School Types</div>
                      <div className="text-lg font-bold text-green-900">
                        {new Set(regionSchools.map(s => s.schoolType || 'Unknown')).size}
                      </div>
                    </div>
                    <Building className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    Different types
                  </div>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-purple-800">Performance</div>
                      <div className="text-lg font-bold text-purple-900">
                        {regionSchools.length > 0 ? 
                          Math.round((regionSchools.filter(s => s.active).length / regionSchools.length) * 100) : 0}%
                      </div>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="text-xs text-purple-600 mt-1">
                    Activity rate
                  </div>
                </div>
                
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-orange-800">Coverage</div>
                      <div className="text-lg font-bold text-orange-900">
                        {regionSchools.length > 0 ? '100' : '0'}%
                      </div>
                    </div>
                    <MapPin className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="text-xs text-orange-600 mt-1">
                    Regional coverage
                  </div>
                </div>
              </div>
              
              {/* School Type Breakdown */}
              {regionSchools.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">School Type Distribution</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {Object.entries(
                      regionSchools.reduce((acc, school) => {
                        const type = school.schoolType || 'Unknown';
                        acc[type] = (acc[type] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    ).map(([type, count]) => (
                      <div key={type} className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-gray-900">{count}</div>
                        <div className="text-xs text-gray-600">{type.replace('_', ' ')}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Region Description */}
                {currentRegion.description && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <Target className="h-5 w-5 text-blue-600 mr-2" />
                      Description
                    </h3>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed">{currentRegion.description}</p>
                    </div>
                  </div>
                )}

                {/* Monitoring Summary */}
                {currentRegionMonitoring && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <Activity className="h-5 w-5 text-blue-600 mr-2" />
                      Monitoring Summary
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="text-sm font-medium text-blue-800">Total Schools</div>
                        <div className="text-2xl font-bold text-blue-900">
                          {currentRegionMonitoring.totalSchools || 0}
                        </div>
                      </div>
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="text-sm font-medium text-green-800">Active Schools</div>
                        <div className="text-2xl font-bold text-green-900">
                          {currentRegionMonitoring.activeSchools || 0}
                        </div>
                      </div>
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="text-sm font-medium text-yellow-800">Avg Attendance</div>
                        <div className="text-2xl font-bold text-yellow-900">
                          {((currentRegionMonitoring.averageAttendanceRate || 0) * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                        <div className="text-sm font-medium text-purple-800">Compliance Score</div>
                        <div className="text-2xl font-bold text-purple-900">
                          {((currentRegionMonitoring.averageComplianceScore || 0) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Region Information */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Region Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Region Code</div>
                        <div className="text-sm text-gray-600 font-mono">{currentRegion.code}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Status</div>
                        <div className="text-sm text-gray-600">
                          {currentRegion.active ? 'Active' : 'Inactive'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                {canViewMonitoring && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      {currentRegionMonitoring && (
                        <button
                          onClick={handleViewMonitoring}
                          className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100"
                        >
                          <Activity className="h-4 w-4 mr-2" />
                          View Monitoring Details
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/app/administration/regions')}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Region Details</h1>
                <p className="text-gray-600">Comprehensive regional information and management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {canEditRegion(currentRegion) && (
                <button
                  onClick={handleEdit}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit size={16} className="mr-2" />
                  Edit
                </button>
              )}
              
              {canEditRegion(currentRegion) && (
                <button
                  onClick={handleToggleStatus}
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentRegion.active 
                      ? 'text-white bg-orange-600 hover:bg-orange-700' 
                      : 'text-white bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {currentRegion.active ? <Pause size={16} className="mr-2" /> : <Play size={16} className="mr-2" />}
                  {currentRegion.active ? 'Deactivate' : 'Activate'}
                </button>
              )}
              
              {canEditRegion(currentRegion) && (
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-8">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default RegionDetailsPage; 