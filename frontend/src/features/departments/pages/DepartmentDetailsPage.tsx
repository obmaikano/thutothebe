import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchDepartmentById, clearCurrentDepartment, activateDepartment, deactivateDepartment } from '../departmentsSlice';
import { 
  Building2, 
  Users, 
  BookOpen, 
  ArrowLeft, 
  Edit, 
  Trash2, 
  UserCheck,
  Calendar,
  School,
  MapPin,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  Copy,
  Share2,
  Download,
  Settings,
  BarChart3,
  TrendingUp,
  Target,
  Award,
  Activity,
  AlertCircle,
  FileText
} from 'lucide-react';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import DepartmentWorkflowControls from '../components/DepartmentWorkflowControls';

const DepartmentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentDepartment, status, error } = useAppSelector(state => state.departments);
  const { user } = useAppSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (id) {
      dispatch(fetchDepartmentById(parseInt(id)));
    }
    return () => {
      dispatch(clearCurrentDepartment());
    };
  }, [dispatch, id]);

  const canManageDepartments = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'DEPARTMENT_HEAD'].includes(user?.role || '');
  const canEditDepartment = canManageDepartments && (
    ['SUPER_ADMIN', 'SCHOOL_ADMIN'].includes(user?.role || '') ||
    (user?.role === 'DEPARTMENT_HEAD' && currentDepartment?.departmentHeadId === user?.id)
  );

  const canViewAnalytics = user && [
    'SUPER_ADMIN',
    'SCHOOL_ADMIN',
    'DEPARTMENT_HEAD'
  ].includes(user.role);

  const handleEdit = () => {
    if (currentDepartment) {
      dispatch(openModal({
        title: 'Edit Department',
        bodyType: MODAL_BODY_TYPES.DEPARTMENT_EDIT,
        extraObject: currentDepartment,
        size: 'lg'
      }));
    }
  };

  const handleDelete = () => {
    if (currentDepartment) {
      dispatch(openModal({
        title: 'Delete Department',
        bodyType: MODAL_BODY_TYPES.DEPARTMENT_DELETE_CONFIRMATION,
        extraObject: currentDepartment
      }));
    }
  };

  const handleDuplicate = () => {
    if (currentDepartment) {
      // Create a copy of the department data for duplication
      const duplicateData = {
        ...currentDepartment,
        name: `${currentDepartment.name} (Copy)`,
        id: undefined // Remove ID so it creates a new department
      };
      dispatch(openModal({
        title: 'Duplicate Department',
        bodyType: MODAL_BODY_TYPES.DEPARTMENT_ADD_NEW,
        extraObject: duplicateData,
        size: 'lg'
      }));
    }
  };

  const handleToggleStatus = async () => {
    if (!currentDepartment) return;
    
    try {
      if (currentDepartment.active) {
        await dispatch(deactivateDepartment(currentDepartment.id)).unwrap();
      } else {
        await dispatch(activateDepartment(currentDepartment.id)).unwrap();
      }
    } catch (error) {
      console.error('Failed to toggle department status:', error);
    }
  };

  const handleExport = () => {
    if (!currentDepartment) return;
    
    const exportData = {
      department: currentDepartment,
      exportedAt: new Date().toISOString(),
      exportedBy: user?.firstName + ' ' + user?.lastName || 'Unknown User',
      version: '1.0'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `department-${currentDepartment.name}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleShare = () => {
    if (!currentDepartment) return;
    
    const shareData = {
      title: currentDepartment.name,
      text: `Check out this department: ${currentDepartment.name}`,
      url: window.location.href
    };
    
    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Department link copied to clipboard!');
      }).catch(() => {
        alert('Unable to share. Please copy the URL manually.');
      });
    }
  };

  const handleAssignHead = () => {
    if (currentDepartment) {
      dispatch(openModal({
        title: 'Assign Department Head',
        bodyType: MODAL_BODY_TYPES.DEPARTMENT_ASSIGN_HEAD,
        extraObject: currentDepartment,
        size: 'lg'
      }));
    }
  };

  const handleAssignTeacher = () => {
    if (currentDepartment) {
      dispatch(openModal({
        title: 'Manage Teachers',
        bodyType: MODAL_BODY_TYPES.DEPARTMENT_ASSIGN_TEACHER,
        extraObject: currentDepartment,
        size: 'lg'
      }));
    }
  };

  const handleAssignSubject = () => {
    if (currentDepartment) {
      dispatch(openModal({
        title: 'Manage Subjects',
        bodyType: MODAL_BODY_TYPES.DEPARTMENT_ASSIGN_SUBJECT,
        extraObject: currentDepartment,
        size: 'lg'
      }));
    }
  };

  const getStatusBadge = (active: boolean) => {
    const config = active 
      ? { color: 'bg-green-100 text-green-800 border-green-200', label: 'Active', icon: CheckCircle }
      : { color: 'bg-red-100 text-red-800 border-red-200', label: 'Inactive', icon: XCircle };
    
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg border ${config.color}`}>
        <IconComponent size={14} className="mr-1.5" />
        {config.label}
      </span>
    );
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, requiresPermission: canViewAnalytics },
    { id: 'teachers', label: 'Teachers', icon: Users },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'resources', label: 'Resources', icon: Target }
  ].filter(tab => !tab.requiresPermission || tab.requiresPermission);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'analytics':
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Department Analytics</h3>
            <p className="text-gray-600 mb-6">Detailed analytics and insights coming soon.</p>
          </div>
        );
      case 'teachers':
        return (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Department Teachers ({currentDepartment?.teacherIds.length || 0})</h3>
                {canManageDepartments && (
                  <button
                    onClick={handleAssignTeacher}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Users size={16} />
                    Manage Teachers
                  </button>
                )}
              </div>
              {currentDepartment?.teacherNames.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentDepartment.teacherNames.map((teacherName, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Users size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-blue-800">{teacherName}</p>
                        <p className="text-sm text-blue-600">Teacher</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Teachers Assigned</h3>
                  <p className="text-gray-600 mb-6">This department doesn't have any teachers assigned yet.</p>
                  {canManageDepartments && (
                    <button
                      onClick={handleAssignTeacher}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      <Users size={16} />
                      Assign Teachers
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      case 'subjects':
        return (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Department Subjects ({currentDepartment?.subjectIds.length || 0})</h3>
                {canManageDepartments && (
                  <button
                    onClick={handleAssignSubject}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <BookOpen size={16} />
                    Manage Subjects
                  </button>
                )}
              </div>
              {currentDepartment?.subjectNames.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentDepartment.subjectNames.map((subjectName, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <BookOpen size={16} className="text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium text-orange-800">{subjectName}</p>
                        <p className="text-sm text-orange-600">Subject</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Subjects Assigned</h3>
                  <p className="text-gray-600 mb-6">This department doesn't have any subjects assigned yet.</p>
                  {canManageDepartments && (
                    <button
                      onClick={handleAssignSubject}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      <BookOpen size={16} />
                      Assign Subjects
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      case 'performance':
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <TrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance Metrics</h3>
            <p className="text-gray-600 mb-6">Department performance tracking coming soon.</p>
          </div>
        );
      case 'resources':
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Department Resources</h3>
            <p className="text-gray-600 mb-6">Resource management coming soon.</p>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            {/* Header with Status and Controls */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Building2 className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {currentDepartment?.name}
                      </h1>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <School className="h-4 w-4" />
                          {currentDepartment?.schoolName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Created {new Date(currentDepartment?.createdAt || '').toLocaleDateString()}
                        </span>
                        {getStatusBadge(currentDepartment?.active || false)}
                      </div>
                    </div>
                  </div>

                  {/* Department Head Info */}
                  {currentDepartment?.departmentHeadName && (
                    <div className="flex items-center gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <UserCheck className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-purple-900">Department Head</div>
                        <div className="text-sm text-purple-700">{currentDepartment.departmentHeadName}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Workflow Controls */}
                <div className="flex flex-col gap-4">
                  <DepartmentWorkflowControls
                    department={currentDepartment!}
                    userRole={user?.role || ''}
                    variant="expanded"
                    showLabels={true}
                    onAction={(action, department) => {
                      console.log(`Action ${action} performed on department ${department.id}`);
                    }}
                  />
                  
                  {/* Additional Quick Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                    <button
                      onClick={() => navigate(`/app/departments/${currentDepartment?.id}/manage`)}
                      className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      Manage Department
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg mr-4">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {currentDepartment?.teacherIds.length || 0}
                    </div>
                    <div className="text-sm text-gray-500">Teachers</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-orange-100 rounded-lg mr-4">
                    <BookOpen className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {currentDepartment?.subjectIds.length || 0}
                    </div>
                    <div className="text-sm text-gray-500">Subjects</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg mr-4">
                    <UserCheck className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {currentDepartment?.departmentHeadName ? '1' : '0'}
                    </div>
                    <div className="text-sm text-gray-500">Department Head</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg mr-4">
                    <Activity className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {currentDepartment?.active ? 'Active' : 'Inactive'}
                    </div>
                    <div className="text-sm text-gray-500">Status</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Description */}
                {currentDepartment?.description && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <FileText className="h-5 w-5 text-blue-600 mr-2" />
                      Description
                    </h3>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed">{currentDepartment.description}</p>
                    </div>
                  </div>
                )}

                {/* Teachers Overview */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Users className="h-5 w-5 text-blue-600 mr-2" />
                    Teachers ({currentDepartment?.teacherNames.length || 0})
                  </h3>
                  {currentDepartment?.teacherNames.length ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentDepartment.teacherNames.slice(0, 6).map((teacher, index) => (
                        <div
                          key={index}
                          className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <Users className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
                          <span className="text-sm font-medium text-blue-800 truncate" title={teacher}>
                            {teacher}
                          </span>
                        </div>
                      ))}
                      {currentDepartment.teacherNames.length > 6 && (
                        <div className="flex items-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <span className="text-sm text-gray-600">
                            +{currentDepartment.teacherNames.length - 6} more teachers
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-gray-500">No teachers assigned</p>
                    </div>
                  )}
                </div>

                {/* Subjects Overview */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
                    Subjects ({currentDepartment?.subjectNames.length || 0})
                  </h3>
                  {currentDepartment?.subjectNames.length ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentDepartment.subjectNames.slice(0, 6).map((subject, index) => (
                        <div
                          key={index}
                          className="flex items-center p-3 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
                        >
                          <BookOpen className="h-4 w-4 text-orange-600 mr-2 flex-shrink-0" />
                          <span className="text-sm font-medium text-orange-800 truncate" title={subject}>
                            {subject}
                          </span>
                        </div>
                      ))}
                      {currentDepartment.subjectNames.length > 6 && (
                        <div className="flex items-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <span className="text-sm text-gray-600">
                            +{currentDepartment.subjectNames.length - 6} more subjects
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-gray-500">No subjects assigned</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Administrative Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Building2 className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Department ID</div>
                        <div className="text-sm text-gray-600">{currentDepartment?.id}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <School className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">School</div>
                        <div className="text-sm text-gray-600">{currentDepartment?.schoolName}</div>
                      </div>
                    </div>
                    {currentDepartment?.departmentHeadName && (
                      <div className="flex items-center">
                        <UserCheck className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Department Head</div>
                          <div className="text-sm text-gray-600">{currentDepartment.departmentHeadName}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Dates</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">Created At</div>
                      <div className="text-sm text-gray-600">{new Date(currentDepartment?.createdAt || '').toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Last Updated</div>
                      <div className="text-sm text-gray-600">{new Date(currentDepartment?.modifiedAt || '').toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={handleExport}
                      className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Department
                    </button>
                    <button
                      onClick={handleShare}
                      className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Department
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center min-h-96">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg text-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading department details...</p>
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
            <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Department</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => navigate('/app/departments')}
                className="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50"
              >
                Back to Departments
              </button>
              <button
                onClick={() => id && dispatch(fetchDepartmentById(parseInt(id)))}
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

  if (!currentDepartment) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Department Not Found</h3>
            <p className="text-gray-600 mb-6">
              The department you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate('/app/departments')}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Departments
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/app/departments')}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Department Details</h1>
                <p className="text-gray-600">Comprehensive department management and insights</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {canEditDepartment && (
                <button
                  onClick={handleEdit}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit size={16} className="mr-2" />
                  Edit
                </button>
              )}
              
              <button
                onClick={handleDuplicate}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Copy size={16} className="mr-2" />
                Duplicate
              </button>
              
              {canEditDepartment && (
                <button
                  onClick={handleToggleStatus}
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentDepartment.active 
                      ? 'text-white bg-orange-600 hover:bg-orange-700' 
                      : 'text-white bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {currentDepartment.active ? <Pause size={16} className="mr-2" /> : <Play size={16} className="mr-2" />}
                  {currentDepartment.active ? 'Deactivate' : 'Activate'}
                </button>
              )}
              
              {canEditDepartment && ['SUPER_ADMIN', 'SCHOOL_ADMIN'].includes(user?.role || '') && (
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

      <div className="px-8 py-8">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default DepartmentDetailsPage; 