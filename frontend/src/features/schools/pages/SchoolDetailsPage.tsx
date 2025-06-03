import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchSchoolById, clearSchoolsError, activateSchool, deactivateSchool, deleteSchool } from '../schoolsSlice';
import { fetchSchoolMonitoringBySchool, clearSchoolMonitoringError } from '../schoolMonitoringSlice';
import { fetchRegionById } from '../../regions/regionsSlice';
import { fetchAllSchoolStats, clearUserStats } from '../userStatsSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { School } from '../../../api/services/schoolApi';
import { 
  ArrowLeft,
  Building, 
  MapPin, 
  Users, 
  GraduationCap, 
  TrendingUp, 
  AlertTriangle,
  Calendar,
  Phone,
  Mail,
  Globe,
  Edit,
  Activity,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  Target,
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
  Eye,
  School as SchoolIcon
} from 'lucide-react';

const SchoolDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { currentSchool, status, error } = useAppSelector(state => state.schools);
  const { currentRegion } = useAppSelector(state => state.regions);
  const { 
    currentSchoolMonitoring, 
    status: monitoringStatus 
  } = useAppSelector(state => state.schoolMonitoring);
  const { 
    schoolStudents, 
    schoolTeachers, 
    schoolStaff, 
    loading: statsLoading 
  } = useAppSelector(state => state.userStats);
  const { user } = useAppSelector(state => state.auth);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchSchoolById(parseInt(id)));
      dispatch(fetchSchoolMonitoringBySchool(parseInt(id)));
      dispatch(fetchAllSchoolStats(parseInt(id)));
    }
    return () => {
      dispatch(clearSchoolsError());
      dispatch(clearSchoolMonitoringError());
      dispatch(clearUserStats());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (currentSchool?.regionId) {
      dispatch(fetchRegionById(currentSchool.regionId));
    }
  }, [currentSchool?.regionId, dispatch]);

  // Auto-refresh statistics every 30 seconds
  useEffect(() => {
    if (!id) return;

    const refreshStats = async () => {
      setIsRefreshing(true);
      try {
        await dispatch(fetchAllSchoolStats(parseInt(id))).unwrap();
        setLastRefreshed(new Date());
      } catch (error) {
        console.error('Failed to refresh stats:', error);
      } finally {
        setIsRefreshing(false);
      }
    };

    // Initial refresh
    refreshStats();

    // Set up interval for auto-refresh
    const interval = setInterval(refreshStats, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [id, dispatch]);

  const handleEdit = () => {
    if (currentSchool) {
      dispatch(openModal({
        title: 'Edit School',
        bodyType: MODAL_BODY_TYPES.SCHOOL_EDIT,
        extraObject: currentSchool,
        size: 'lg'
      }));
    }
  };

  const handleDelete = () => {
    if (currentSchool) {
      dispatch(openModal({
        title: 'Delete School',
        bodyType: MODAL_BODY_TYPES.SCHOOL_DELETE_CONFIRMATION,
        extraObject: { school: currentSchool }
      }));
    }
  };

  const handleToggleStatus = async () => {
    if (!currentSchool) return;
    
    try {
      if (currentSchool.active) {
        await dispatch(deactivateSchool(currentSchool.id)).unwrap();
      } else {
        await dispatch(activateSchool(currentSchool.id)).unwrap();
      }
    } catch (error) {
      console.error('Failed to toggle school status:', error);
    }
  };

  const handleViewMonitoring = () => {
    if (currentSchool && currentSchoolMonitoring) {
      dispatch(openModal({
        title: `${currentSchool.name} - Monitoring Details`,
        bodyType: MODAL_BODY_TYPES.MONITORING_DETAILS,
        extraObject: {
          school: currentSchool,
          monitoring: currentSchoolMonitoring
        }
      }));
    }
  };

  const canEditSchool = (school: School) => {
    if (!user) return false;
    
    const editorRoles = ['SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'DIRECTOR', 'REGIONAL_ADMIN'];
    if (!editorRoles.includes(user.role)) return false;
    
    if (school.regionId && user.regionId && user.regionId !== school.regionId) return false;
    
    return true;
  };

  const canViewMonitoring = user && [
    'SUPER_ADMIN',
    'MINISTRY_EXECUTIVE',
    'MINISTRY_STAFF',
    'DIRECTOR',
    'REGIONAL_ADMIN',
    'REGIONAL_OFFICER',
    'SCHOOL_ADMIN',
    'SCHOOL_HEAD'
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

  const getSchoolTypeBadge = (type: string) => {
    const typeConfig = {
      'PRIMARY': { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Primary', icon: SchoolIcon },
      'SECONDARY': { color: 'bg-green-100 text-green-800 border-green-200', label: 'Secondary', icon: GraduationCap },
      'COMBINED': { color: 'bg-purple-100 text-purple-800 border-purple-200', label: 'Combined', icon: Building },
      'SPECIAL': { color: 'bg-pink-100 text-pink-800 border-pink-200', label: 'Special', icon: Users },
      'TECHNICAL': { color: 'bg-orange-100 text-orange-800 border-orange-200', label: 'Technical', icon: Settings },
      'VOCATIONAL': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Vocational', icon: Award }
    };
    
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.PRIMARY;
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg border ${config.color}`}>
        <IconComponent size={14} className="mr-1.5" />
        {config.label}
      </span>
    );
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building },
    { id: 'monitoring', label: 'Monitoring', icon: Activity, requiresPermission: canViewMonitoring },
    { id: 'performance', label: 'Performance', icon: BarChart3, requiresPermission: canViewMonitoring },
    { id: 'facilities', label: 'Facilities', icon: Settings },
    { id: 'staff', label: 'Staff', icon: Users },
    { id: 'students', label: 'Students', icon: GraduationCap }
  ].filter(tab => !tab.requiresPermission || tab.requiresPermission);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center min-h-96">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg text-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading school details...</p>
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
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading School</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => dispatch(clearSchoolsError())}
                className="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50"
              >
                Dismiss
              </button>
              <button
                onClick={() => id && dispatch(fetchSchoolById(parseInt(id)))}
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

  if (!currentSchool) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <Building className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">School Not Found</h3>
            <p className="text-gray-600 mb-6">
              The school you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate('/app/administration/schools')}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Schools
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'monitoring':
        return (
          <div className="space-y-6">
            {currentSchoolMonitoring ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-blue-100 rounded-lg mr-4">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {((currentSchoolMonitoring.attendanceRate || 0) * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-500">Attendance Rate</div>
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
                          {((currentSchoolMonitoring.complianceScore || 0) * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-500">Compliance Score</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-yellow-100 rounded-lg mr-4">
                        <Activity className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {currentSchoolMonitoring.totalLogins || 0}
                        </div>
                        <div className="text-sm text-gray-500">Total Logins</div>
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
                          {currentSchoolMonitoring.alertCount || 0}
                        </div>
                        <div className="text-sm text-gray-500">Active Alerts</div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <Activity className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Monitoring Data</h3>
                <p className="text-gray-600">Monitoring data is not available for this school.</p>
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
      case 'facilities':
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <Settings className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Facilities Management</h3>
            <p className="text-gray-600">Facilities management features coming soon.</p>
          </div>
        );
      case 'staff':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Users className="h-5 w-5 text-blue-600 mr-2" />
                  Staff Members ({schoolStaff.length + schoolTeachers.length})
                </h3>
                {statsLoading && (
                  <div className="loading loading-spinner loading-sm text-blue-600"></div>
                )}
              </div>
              
              {(schoolStaff.length > 0 || schoolTeachers.length > 0) ? (
                <>
                  {/* Staff Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="text-sm font-medium text-blue-800">Teachers</div>
                      <div className="text-2xl font-bold text-blue-900">
                        {schoolTeachers.length}
                      </div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="text-sm font-medium text-green-800">Admin Staff</div>
                      <div className="text-2xl font-bold text-green-900">
                        {schoolStaff.filter(staff => ['SCHOOL_ADMIN', 'SCHOOL_HEAD', 'DEPARTMENT_HEAD'].includes(staff.role)).length}
                      </div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="text-sm font-medium text-purple-800">Support Staff</div>
                      <div className="text-2xl font-bold text-purple-900">
                        {schoolStaff.filter(staff => !['SCHOOL_ADMIN', 'SCHOOL_HEAD', 'DEPARTMENT_HEAD'].includes(staff.role)).length}
                      </div>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="text-sm font-medium text-orange-800">Active Staff</div>
                      <div className="text-2xl font-bold text-orange-900">
                        {schoolStaff.filter(staff => staff.active).length + schoolTeachers.filter(teacher => teacher.active).length}
                      </div>
                    </div>
                  </div>

                  {/* Teachers List */}
                  {schoolTeachers.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Teachers ({schoolTeachers.length})</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {schoolTeachers.map((teacher) => (
                          <div
                            key={teacher.id}
                            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">
                                  {teacher.firstName} {teacher.lastName}
                                </h4>
                                <p className="text-sm text-gray-600">{teacher.email}</p>
                              </div>
                              <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                                teacher.active 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {teacher.active ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500">
                              <div className="flex items-center justify-between">
                                <span>Staff ID:</span>
                                <span className="font-medium">{teacher.staffId}</span>
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <span>Qualification:</span>
                                <span>{teacher.qualification}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Administrative Staff List */}
                  {schoolStaff.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Administrative Staff ({schoolStaff.length})</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {schoolStaff.map((staff) => (
                          <div
                            key={staff.id}
                            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">
                                  {staff.firstName} {staff.lastName}
                                </h4>
                                <p className="text-sm text-gray-600">{staff.email}</p>
                              </div>
                              <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                                staff.active 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {staff.active ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500">
                              <div className="flex items-center justify-between">
                                <span>Role:</span>
                                <span className="font-medium">{staff.role.replace('_', ' ')}</span>
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <span>Gender:</span>
                                <span>{staff.gender}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Staff Members</h4>
                  <p className="text-gray-600">No staff members are registered for this school yet.</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'students':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <GraduationCap className="h-5 w-5 text-blue-600 mr-2" />
                  Students ({schoolStudents.length})
                </h3>
                {statsLoading && (
                  <div className="loading loading-spinner loading-sm text-blue-600"></div>
                )}
              </div>
              
              {schoolStudents.length > 0 ? (
                <>
                  {/* Student Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="text-sm font-medium text-blue-800">Total Students</div>
                      <div className="text-2xl font-bold text-blue-900">
                        {schoolStudents.length}
                      </div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="text-sm font-medium text-green-800">Active Students</div>
                      <div className="text-2xl font-bold text-green-900">
                        {schoolStudents.filter(student => student.active).length}
                      </div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="text-sm font-medium text-purple-800">Male Students</div>
                      <div className="text-2xl font-bold text-purple-900">
                        {schoolStudents.filter(student => student.gender === 'MALE').length}
                      </div>
                    </div>
                    <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                      <div className="text-sm font-medium text-pink-800">Female Students</div>
                      <div className="text-2xl font-bold text-pink-900">
                        {schoolStudents.filter(student => student.gender === 'FEMALE').length}
                      </div>
                    </div>
                  </div>

                  {/* Students List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {schoolStudents.slice(0, 12).map((student) => (
                      <div
                        key={student.id}
                        className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {student.firstName} {student.lastName}
                            </h4>
                            <p className="text-sm text-gray-600">{student.email}</p>
                          </div>
                          <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                            student.active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {student.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          <div className="flex items-center justify-between">
                            <span>Admission #:</span>
                            <span className="font-medium">{student.admissionNumber}</span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span>Gender:</span>
                            <span>{student.gender}</span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span>Academic Year:</span>
                            <span>{student.academicYear}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {schoolStudents.length > 12 && (
                    <div className="text-center mt-6">
                      <p className="text-sm text-gray-600">
                        Showing 12 of {schoolStudents.length} students
                      </p>
                      <button className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View All Students
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <GraduationCap className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Students Enrolled</h4>
                  <p className="text-gray-600">No students are enrolled in this school yet.</p>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            {/* School Information Cards */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Building className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {currentSchool.name}
                      </h1>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          Code: {currentSchool.code}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {currentRegion ? currentRegion.name : 'Loading region...'}
                        </span>
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(currentSchool.active)}
                </div>
              </div>
            </div>

            {/* Statistics Grid - simplified to only show available properties */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg mr-4">
                    <Building className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {currentSchool.id}
                    </div>
                    <div className="text-sm text-gray-500">School ID</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg mr-4">
                    <MapPin className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {currentSchool.regionId}
                    </div>
                    <div className="text-sm text-gray-500">Region ID</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-time Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg mr-4">
                    <GraduationCap className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {statsLoading ? (
                            <div className="loading loading-dots loading-sm"></div>
                          ) : (
                            schoolStudents.length
                          )}
                        </div>
                        <div className="text-sm text-gray-500">Students</div>
                      </div>
                      <div className="text-xs text-gray-400">Live</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg mr-4">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {statsLoading ? (
                            <div className="loading loading-dots loading-sm"></div>
                          ) : (
                            schoolTeachers.length
                          )}
                        </div>
                        <div className="text-sm text-gray-500">Teachers</div>
                      </div>
                      <div className="text-xs text-gray-400">Live</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg mr-4">
                    <Building className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {statsLoading ? (
                            <div className="loading loading-dots loading-sm"></div>
                          ) : (
                            schoolStaff.length + schoolTeachers.length
                          )}
                        </div>
                        <div className="text-sm text-gray-500">Total Staff</div>
                      </div>
                      <div className="text-xs text-gray-400">Live</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* School Description */}
                {currentSchool.description && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <Target className="h-5 w-5 text-blue-600 mr-2" />
                      Description
                    </h3>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed">{currentSchool.description}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Contact Information - removed non-existent properties */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Region</div>
                        <div className="text-sm text-gray-600">
                          {currentRegion ? currentRegion.name : 'Loading...'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Important Dates - only show existing properties */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Dates</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">Created</div>
                      <div className="text-sm text-gray-600">
                        {new Date().toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                {canViewMonitoring && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      {currentSchoolMonitoring && (
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

                {/* School Information */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">School Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Building className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">School Code</div>
                        <div className="text-sm text-gray-600 font-mono">{currentSchool.code}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Region</div>
                        <div className="text-sm text-gray-600">
                          {currentRegion ? `${currentRegion.name} (${currentRegion.code})` : 'Loading...'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Status</div>
                        <div className="text-sm text-gray-600">
                          {currentSchool.active ? 'Active' : 'Inactive'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
                onClick={() => navigate('/app/administration/schools')}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">School Details</h1>
                <p className="text-gray-600">Comprehensive school information and management</p>
                {lastRefreshed && (
                  <p className="text-xs text-gray-500 mt-1">
                    Last updated: {lastRefreshed.toLocaleTimeString()}
                    {isRefreshing && <span className="ml-2 text-blue-600">Refreshing...</span>}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {canEditSchool(currentSchool) && (
                <button
                  onClick={handleEdit}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit size={16} className="mr-2" />
                  Edit
                </button>
              )}
              
              {canEditSchool(currentSchool) && (
                <button
                  onClick={handleToggleStatus}
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentSchool.active 
                      ? 'text-white bg-orange-600 hover:bg-orange-700' 
                      : 'text-white bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {currentSchool.active ? <Pause size={16} className="mr-2" /> : <Play size={16} className="mr-2" />}
                  {currentSchool.active ? 'Deactivate' : 'Activate'}
                </button>
              )}
              
              {canEditSchool(currentSchool) && (
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

export default SchoolDetailsPage; 